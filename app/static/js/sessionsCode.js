const clientKey = JSON.parse(document.getElementById('client-key').innerHTML);
const type = JSON.parse(document.getElementById('integration-type').innerHTML);
const storedCountry = document.getElementById('country-code');
let countrySettings;

// Used to finalize a checkout call in case of redirect
const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('sessionId'); // Unique identifier for the payment session
const redirectResult = urlParams.get('redirectResult');

// Used to retrieve country value from url
const urlCountryParams = new URLSearchParams(window.location.search);
const countryURL = urlCountryParams.get('country');
console.log(countryURL)

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


// Start the Checkout workflow
async function startCheckout() {
	try {
	    // Init Sessions
		const checkoutSessionResponse = await callServer(
            "/api/sessions?type=" + type,
            countrySettings
            );
        console.log(countrySettings)

        // Create AdyenCheckout using Sessions response
		const checkout = await createAdyenCheckout(checkoutSessionResponse)

		// Create an instance of Drop-in and mount it to the container you created.
		const dropinComponent = checkout.create(type, {
            showRemovePaymentMethodButton: true,
            onDisableStoredPaymentMethod: (storedPaymentMethodId, resolve, reject) => {
                callServer("/api/disable", {"storedPaymentMethodId":storedPaymentMethodId});
                resolve()
                reject()
            },
        }).mount("#component");  // pass DIV id where component must be rendered

	} catch (error) {
		console.error(error);
		alert("Error occurred. Look at console for details");
	}
}

// Some payment methods use redirects. This is where we finalize the operation
async function finalizeCheckout() {
    try {
        // Create AdyenCheckout re-using existing Session
        const checkout = await createAdyenCheckout({id: sessionId});

        // Submit the extracted redirectResult (to trigger onPaymentCompleted(result, component) handler)
        checkout.submitDetails({details: {redirectResult}});
    } catch (error) {
        console.error(error);
        alert("Error occurred. Look at console for details");
    }
}

async function createAdyenCheckout(session) {

    const configuration = {
        clientKey,
        locale: countrySettings.locale || "en_GB",
        countryCode: countrySettings.countryCode || "GB",
        environment: "test",  // change to live for production
        showPayButton: true,
        session: session,
        paymentMethodsConfiguration: {
            ideal: {
                showImage: true
            },
            card: {
                hasHolderName: true,
                holderNameRequired: true,
                name: "Credit or debit card",
                enableStoreDetails: true,
                brands: ['mc','visa','amex', 'cup', 'cartebancaire', 'diners', 'discover', 'jcb'],
                //billingAddressRequired: true,
                //onSubmit: () => {},
                amount: {
                    value: 4000,
                    currency: countrySettings.currency || "GBP"
                }
            },
            threeDS2: { // Web Components 4.0.0 and above: sample configuration for the threeDS2 action type
                challengeWindowSize: '02'
                 // Set to any of the following:
                 // '02': ['390px', '400px'] -  The default window size
                 // '01': ['250px', '400px']
                 // '03': ['500px', '600px']
                 // '04': ['600px', '400px']
                 // '05': ['100%', '100%']
          },
            paypal: {
                amount: {
                    currency: countrySettings.currency || "GBP",
                    value: 4000
                },
                environment: "test",
                commit: false,
                returnUrl: "http://localhost:8080/checkout/success",
                //countryCode: "GB",   // Only needed for test. This will be automatically retrieved when you are in production.
                lineItems: [
                    {"quantity": "1",
                    "amountIncludingTax": "2000",
                    "description": "Sunglasses",
                    "id": "Item 1",
                    "taxPercentage": "2100",
                    "productUrl": "https://example.com/item1",
                    "imageUrl": "https://example.com/item1pic"
                    },
                    {"quantity": "1",
                    "amountIncludingTax": "2000",
                    "description": "Headphones",
                    "id": "Item 2",
                    "taxPercentage": "2100",
                    "productUrl": "https://example.com/item2",
                    "imageUrl": "https://example.com/item2pic"
                }
                ]
            },
            //klarna: {
            //    lineItems: [
            //        {"quantity": "1",
            //        "amountIncludingTax": "500",
            //        "description": "Sunglasses",
            //        "id": "Item 1",
            //        "taxPercentage": "2100",
            //        "productUrl": "https://example.com/item1",
            //        "imageUrl": "https://example.com/item1pic"}
            //    ]
            //}frontend_request
        },
        /*onSubmit: (state, component) => {
            // Your function calling your server to make the /payments request.
            console.log(state);

            if (state.isValid) {
                handleSubmission(state, component, "/api/initiatePayment");
            }
        },
        onAdditionalDetails: (state, component) => {
            handleSubmission(state, component, "/api/submitAdditionalDetails");
        },*/
        onPaymentCompleted: (result, component) => {
            console.info(result, component);
            handleServerResponse(result, component);
        },
        onError: (error, component) => {
            console.error(error.name, error.message, error.stack, component);
        },
        onDisableStoredPaymentMethod: (storedPaymentMethodId, resolve, reject) => {
        }
    };

    return new AdyenCheckout(configuration);
}

/*
// Event handlers called when the shopper selects the pay button,
// or when additional information is required to complete the payment
async function handleSubmission(state, dropin, url) {
    try {
        const res = await callServer(url, state.data, countrySettings);
        handleServerResponse(res, dropin);
    } catch (error) {
        console.error(error);
        alert("Error occurred. Look at console for details");
    }
}
*/
// Calls your server endpoints
async function callServer(url, data) {
	const res = await fetch(url, {
		method: "POST",
		body: data ? JSON.stringify(data) : "",
		headers: {
			"Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
		}
	});

	return await res.json();
}

// Handles responses sent from your server to the client
function handleServerResponse(res, component) {
	if (res.action) {
		component.handleAction(res.action);
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

if (!sessionId) {
    startCheckout();
}
else {
    // existing session: complete Checkout
    finalizeCheckout();
}

