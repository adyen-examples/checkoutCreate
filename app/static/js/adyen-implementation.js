const clientKey = JSON.parse(document.getElementById('client-key').innerHTML);
const storedCountry = document.getElementById('country-code');
// let country = "GB";
let countrySettings = "NL";

// Used to retrieve country value from url
const urlCountryParams = new URLSearchParams(window.location.search);
const countryURL = urlCountryParams.get('country');
console.log(countryURL)

// global configuration variables
let openFirst = true
let billAdd = false
let onlyStored = true
let holderName = false
let showPayMethod = true
let hideCVC = false
let placeholderData = false

const toggleData = [
	{

	}
]

// identify checkout div and create new empty div to replace with
const oldDiv = document.getElementById("dropin-container");
const newDiv = document.createElement('div');

const flagUrlMap = {
	"NL": {
		"src": "https://ca-test.adyen.com/ca/adl/img/flags/nl.svg",
		"total": "€40.00",
		"currency": "EUR",
		"href": "{{ url_for('checkout', integration=method, country=NL) }}"
	},
	"GB": {
		"src": "https://ca-test.adyen.com/ca/adl/img/flags/gb.svg",
		"total": "£40.00",
		"currency": "GBP",
		"href": "{{ url_for('checkout', integration=method, country=GB) }}"
	},
	"US": {
		"src": "https://ca-test.adyen.com/ca/adl/img/flags/us.svg",
		"total": "$40.00",
		"currency": "USD",
		"href": "{{ url_for('checkout', integration=method, country=US) }}"
	}
}

// Country dropdown changes the flag image and reloads the dropin with new country values
function changeSelect(el) {
	document.getElementById('flag_img').src = flagUrlMap[el.value].src;
	const country = el.value;
	countrySettings = getCountryData(country)
	console.log(countrySettings)
	if (document.getElementById("dropin-container") && document.getElementById("placeholderData").checked == true) {
		placeholderData = {
			holderName: "Jane Doe",
			billingAddress: {
				street: countrySettings.street,
				postalCode: countrySettings.postalCode,
				city: countrySettings.city,
				country: countrySettings.countryCode,
				stateOrProvince: countrySettings.stateOrProvince,
				houseNumberOrName: countrySettings.houseNumberOrName
			}
		}
		// document.getElementById("placeholderData").checked = false
		// placeholderData = false
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container");
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	} else if (document.getElementById("dropin-container")) {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container");
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
}

// function openFirstPayment() {
// 	var firstPayBox = document.getElementById("firstPayBox")
// 	if (firstPayBox == true){
// 		openFirst = true
// 		oldDiv.replaceWith(newDiv)
// 		newDiv.setAttribute("id", "dropin-container")
// 		initCheckout()
// 	}
// 	else {
// 		openFirst = false
// 		oldDiv.replaceWith(newDiv)
// 		newDiv.setAttribute("id", "dropin-container")
// 		initCheckout()
// 	}
// }

// Funtion to toggle first payment method open
document.getElementById('firstPayBox').parentNode.addEventListener('click', function (event) {
	// the value of `this` here is the element the event was fired on.
	// In this situation, it's the element with the ID of 'approval'.
	if (this.querySelector('input').checked) {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		openFirst = true
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
	else {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		openFirst = false
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
})

// Function to add billing address
document.getElementById('billAdd').parentNode.addEventListener('click', function (event) {
	// the value of `this` here is the element the event was fired on.
	// In this situation, it's the element with the ID of 'approval'.
	if (this.querySelector('input').checked) {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		billAdd = true
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
	else {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		billAdd = false
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
})


// Function to show only saved payment methods
document.getElementById('onlyStored').parentNode.addEventListener('click', function (event) {
	// the value of `this` here is the element the event was fired on.
	// In this situation, it's the element with the ID of 'approval'.
	if (this.querySelector('input').checked) {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		onlyStored = false
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
	else {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		onlyStored = true
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
})

// function to show holder name field
document.getElementById('holderName').parentNode.addEventListener('click', function (event) {
	// the value of `this` here is the element the event was fired on.
	// In this situation, it's the element with the ID of 'approval'.
	if (this.querySelector('input').checked) {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		holderName = true
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
	else {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		holderName = false
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
})


// Funtion to show all payment methods
document.getElementById('showPayMethod').parentNode.addEventListener('click', function (event) {
	// the value of `this` here is the element the event was fired on.
	// In this situation, it's the element with the ID of 'approval'.
	if (this.querySelector('input').checked) {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		showPayMethod = false
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
	else {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		showPayMethod = true
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
})

// Funtion to hide or show cvc
document.getElementById('hideCVC').parentNode.addEventListener('click', function (event) {
	// the value of `this` here is the element the event was fired on.
	// In this situation, it's the element with the ID of 'approval'.
	if (this.querySelector('input').checked) {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		hideCVC = true
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
	else {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		hideCVC = false
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
})

// Funtion for including placeholder data
document.getElementById('placeholderData').parentNode.addEventListener('click', function (event) {
	// the value of `this` here is the element the event was fired on.
	// In this situation, it's the element with the ID of 'approval'.
	if (this.querySelector('input').checked) {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		placeholderData = {
			holderName: "Jane Doe",
			billingAddress: {
				street: countrySettings.street,
				postalCode: countrySettings.postalCode,
				city: countrySettings.city,
				country: countrySettings.countryCode,
				stateOrProvince: countrySettings.stateOrProvince,
				houseNumberOrName: countrySettings.houseNumberOrName
			}
		}
		console.log(countrySettings)
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
	else {
		const oldDiv = document.getElementById("dropin-container");
		const newDiv = document.createElement('div');
		placeholderData = false
		oldDiv.replaceWith(newDiv)
		newDiv.setAttribute("id", "dropin-container")
		newDiv.setAttribute("class", "payment p-5")
		initCheckout()
	}
})

//change width of drop in form
// let widthSlider = document.querySelector('[type=range]')
let widthDiv = document.querySelector('.payment')

document.querySelector('[type=range]').parentNode.addEventListener('input', function (event) {

	if (this.querySelector('input')) {
		this.addEventListener('input', e => {
			widthDiv.style.width = e.target.value + 'px'
		})
	}
})


const countryVariables = [
	{
		countryCode: "NL",
		currency: "EUR",
		locale: "en_NL",
		city: "Amsterdam",
		postalCode: "1011DJ",
		street: "Simon Carmiggeltstraat",
		houseNumberOrName: "6 - 50"
	},
	{
		countryCode: "GB",
		currency: "GBP",
		locale: "en_GB",
		city: "London",
		postalCode: "W1T3HE",
		street: "Wells Mews",
		houseNumberOrName: "12 13"
	},
	{
		countryCode: "US",
		currency: "USD",
		locale: "en_US",
		city: "New York City",
		postalCode: "10003",
		street: "71 5th Avenue",
		stateOrProvince: "NY",
		houseNumberOrName: "Floor 11"
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
		console.log(openFirst);
		let configuration = {
			paymentMethodsResponse: paymentMethodsResponse,
			clientKey,
			locale: countrySettings.locale || "en_NL",
        	countryCode: countrySettings.countryCode || "NL",
			environment: "test",
			showPayButton: true,
			paymentMethodsConfiguration: {
				ideal: {
					showImage: true
				},
				card: {
					hasHolderName: holderName,
					holderNameRequired: true,
					hideCVC: hideCVC,
					// brands: ['mc','visa','amex'],
					name: "Credit or debit card",
					data: {
						holderName: placeholderData.holderName,
						billingAddress: placeholderData.billingAddress
					},
					enableStoreDetails: true,
					billingAddressRequired: billAdd,
					amount: {
						value: 4000,
						currency: countrySettings.currency || "EUR"
					}
				},
				storedCard: {
					hideCVC: hideCVC
				},
				paypal: {
					amount: {
						currency: countrySettings.currency || "EUR",
						value: 4000
					},
					//commit: false,
					environment: "test", // Change this to "live" when you're ready to accept live PayPal payments
					countryCode: countrySettings.countryCode || "NL", // Only needed for test. This will be automatically retrieved when you are in production.
					showPayButton: true,
					merchantId: "AD74FQNVXQY5E"
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
		console.log(configuration)

		console.log(openFirst)

		const checkout = await AdyenCheckout(configuration);
		checkout.create('dropin', {
			showRemovePaymentMethodButton: true,
			openFirstPaymentMethod: openFirst,
			showStoredPaymentMethods: onlyStored,
			showPaymentMethods: showPayMethod,
			onDisableStoredPaymentMethod: (storedPaymentMethodId, resolve, reject) => {
				callServer("/api/disable", { "storedPaymentMethodId": storedPaymentMethodId });
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

// Test cards JS
// function copyToClipboard() {
// 	// Get the text field
// 	let copyPAN = document.getElementById('cardNumber').textContent;
// 	console.log(copyPAN)

// 	// Select the text field
// 	// copyPAN.select();
// 	// copyPAN.setSelectionRange(0, 99999); // For mobile devices

// 	// Copy the text inside the text field
// 	navigator.clipboard.write(copyPAN);

// 	// Alert the copied text
// 	alert("Copied the text: " + copyPAN);
// }
let r = document.querySelector(':root');

function setDynamicCSS() {
	r.style.setProperty('--background-color', 'green');
}

function buttonEdges () {
	let edgeValue = document.getElementById('buttonEdges').value
	let pixelVal = edgeValue + 'px'
	r.style.setProperty('--button-edges', pixelVal);
}

function bodyEdges () {
	let bodyEdgeValue = document.getElementById('bodyEdges').value
	let bodyPixelVal = bodyEdgeValue + 'px'
	r.style.setProperty('--body-edges', bodyPixelVal);
}

// function noBorder () {
// 	let borderValue = document.getElementById('noBorder').value
// 	if (borderValue == 'checked') {
// 		r.style.setProperty('--border-off', "0")
// 		console.log(borderValue)
// 	}
// 	else {
// 		r.style.setProperty('--border-off', null)
// 	}
// }

// Funtion to show all payment methods
document.getElementById('noBorder').parentNode.addEventListener('click', function (event) {
	if (this.querySelector('input').checked) {
		r.style.setProperty('--border-off', "0")
		console.log(borderValue)
	}
	else {
		r.style.setProperty('--border-off', null)
	}
})

function resetDynamicCSS () {
	r.style.setProperty('--background-color', null);
}



// Copy to clipboard function
function copyToClipboard(e) {
	const cb = navigator.clipboard;
	cb.writeText(e.target.innerText)
}

initCheckout();



