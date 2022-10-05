const clientKey = JSON.parse(document.getElementById('client-key').innerHTML);
const storedCountry = document.getElementById('country-code');
// let country = "GB";
let countrySettings = "GB";

// Used to retrieve country value from url
const urlCountryParams = new URLSearchParams(window.location.search);
const countryURL = urlCountryParams.get('country');
console.log(countryURL)

let checkout

const flagUrlMap = {
	"NL" : {
		"src": "https://ca-test.adyen.com/ca/adl/img/flags/nl.svg",
		"total": "€40.00",
		"currency": "EUR",
		"href": "{{ url_for('checkout', integration=method, country=NL) }}"
	},
	"GB" : {
		"src": "https://ca-test.adyen.com/ca/adl/img/flags/gb.svg",
		"total": "£40.00",
		"currency": "GBP",
		"href": "{{ url_for('checkout', integration=method, country=GB) }}"
	},
	"US" : {
		"src": "https://ca-test.adyen.com/ca/adl/img/flags/us.svg",
		"total": "$40.00",
		"currency": "USD",
		"href": "{{ url_for('checkout', integration=method, country=US) }}"
	}
}


function changeSelect(el) {
	document.getElementById('flag_img').src = flagUrlMap[el.value].src;
	// document.getElementById("total_cost").innerHTML = flagUrlMap[el.value].total;
	const country = el.value;
	countrySettings = getCountryData(country)
	console.log(countrySettings)
	if (document.getElementById("dropin-container")) {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv =  document.createElement('div');
		// oldDiv.parentNode.replaceChild(newDiv, oldDiv);
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container");
		initCheckout()
		// document.getElementById("dropin-container").remove()
	}
	// else {
	// 	newDiv = document.createElement('div');
	// 	newDiv.setAttribute("id", "#dropin-container");
	// 	initCheckout()
	// }
	// initCheckout()
}


const countryVariables = [
    {
        countryCode: "NL",
        currency: "EUR",
        locale: "en_NL"
    },
    {
        countryCode: "GB",
        currency: "GBP",
        locale: "en_GB"
    },
    {
        countryCode: "US",
        currency: "USD",
        locale: "en_US"
    }
]
if (storedCountry) {
    const selectedCountry = JSON.parse(storedCountry.innerHTML);
    countrySettings = getCountryData(selectedCountry)
}
if (countryURL) {
	const selectedCountry = countryURL
	countrySettings = getCountryData(selectedCountry)
}

function getCountryData(countrySettings) {
    return countryVariables.find((locality) => locality.countryCode === countrySettings)
}


async function initCheckout() {
    try {
		const paymentMethodsResponse = await callServer("/api/getPaymentMethods", countrySettings);
		console.log(countrySettings)
		let prettyResponse = JSON.stringify(paymentMethodsResponse, null, 2)
		console.log(prettyResponse)
		const configuration = {
			paymentMethodsResponse: paymentMethodsResponse,
			clientKey,
			locale: countrySettings.locale || "en_GB",
        	countryCode: countrySettings.countryCode || "GB",
			environment: "test",
			showPayButton: true,
			paymentMethodsConfiguration: {
				ideal: {
					showImage: true
				},
				card: {
					hasHolderName: true,
					holderNameRequired: true,
					// brands: ['mc','visa','amex'],
					name: "Credit or debit card",
                    enableStoreDetails: true,
					amount: {
						value: 4000,
						currency: countrySettings.currency || "GBP"
					}
				},
				paypal: {
					amount: {
						currency: countrySettings.currency || "GBP",
						value: 4000
					},
					//commit: false,
					environment: "test", // Change this to "live" when you're ready to accept live PayPal payments
					countryCode: countrySettings.countryCode || "GB", // Only needed for test. This will be automatically retrieved when you are in production.
					showPayButton: true
					//subtype: "redirect"
				}
			},
			onSubmit: (state, dropin) => {

				if (state.isValid) {
					handleSubmission(state, dropin, "/api/initiatePayment", countrySettings);
				}
			},
			onAdditionalDetails: (state, dropin) => {
				handleSubmission(state, dropin, "/api/submitAdditionalDetails");
			},
            onDisableStoredPaymentMethod: (storedPaymentMethodId, resolve, reject) => {
				// handleSubmission(state, dropin, "/api/disable");
            }

		};

		const checkout = await AdyenCheckout(configuration);
		checkout.create('dropin', {
            showRemovePaymentMethodButton: true,
			onDisableStoredPaymentMethod: (storedPaymentMethodId, resolve, reject) => {
                callServer("/api/disable", {"storedPaymentMethodId":storedPaymentMethodId});
                resolve()
                reject()
            }
        })
        .mount("#dropin-container");
		
        } catch (error) {
            console.error(error);
            alert("Error occurred. Look at console for details");
        }
    }

/*function filterUnimplemented(pm) {
    pm.paymentMethods = pm.paymentMethods.filter((it) =>
        [
            "scheme",
            "ideal",
            "dotpay",
            "giropay",
            "sepadirectdebit",
            "directEbanking",
            "ach",
            "alipay",
            "klarna_paynow",
            "klarna",
            "klarna_account",
            "paypal",
            "boletobancario_santander"
        ].includes(it.type)
    );
    return pm;
}*/


// Event handlers called when the shopper selects the pay button,
// or when additional information is required to complete the payment
async function handleSubmission(state, dropin, url, countrySettings) {
    try {
		//keeping the country data for the /payments call
		const mergedData = {
			...state.data,
			...countrySettings
		}
        const res = await callServer(url, mergedData);
		let prettyResponse = JSON.stringify(res, null, 2)
		console.log(prettyResponse)
        handleServerResponse(res, dropin);
    } catch (error) {
        console.error(error);
        alert("Error occurred. Look at console for details");
    }
}

// Calls your server endpoints
async function callServer(url, data) {
	const res = await fetch(url, {
		method: "POST",
		body: data ? JSON.stringify(data) : "",
		headers: {
			"Content-Type": "application/json"
		}
	});
	return await res.json();
}

// Handles responses sent from your server to the client
function handleServerResponse(res, dropin) {
	if (res.action) {
		dropin.handleAction(res.action);
	} else {
		switch (res.resultCode) {
			case "Authorised":
				window.location.href = "/result/success";
				break;
			case "Pending":
			case "Received":
				window.location.href = "/result/pending";
				break;
			case "Refused":
				window.location.href = "/result/failed";
				break;
			default:
				window.location.href = "/result/error";
				break;
		}
	}
}

initCheckout();
