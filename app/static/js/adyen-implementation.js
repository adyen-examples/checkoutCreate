const clientKey = JSON.parse(document.getElementById("client-key").innerHTML)
const storedCountry = document.getElementById("country-code")
const currentPM = document.getElementById("pay-methods")
// let country = "GB";
let countrySettings = "NL"

// Used to retrieve country value from url
const urlCountryParams = new URLSearchParams(window.location.search)
const countryURL = urlCountryParams.get("country")
console.log(countryURL)

let payMethods =[];
let payArray = Object.values(payMethods);

// global configuration variables
let openFirst = true
let billAdd = false
let onlyStored = true
let holderName = false
let showPayMethod = true
let hideCVC = false
let placeholderData = false

// identify checkout div and create new empty div to replace with
const oldDiv = document.getElementById("dropin-container")
const newDiv = document.createElement("div")

const flagUrlMap = {
  NL: {
    src: "https://ca-test.adyen.com/ca/adl/img/flags/nl.svg",
    total: "€40.00",
    currency: "EUR",
    href: "{{ url_for('checkout', integration=method, country=NL) }}",
  },
  GB: {
    src: "https://ca-test.adyen.com/ca/adl/img/flags/gb.svg",
    total: "£40.00",
    currency: "GBP",
    href: "{{ url_for('checkout', integration=method, country=GB) }}",
  },
  US: {
    src: "https://ca-test.adyen.com/ca/adl/img/flags/us.svg",
    total: "$40.00",
    currency: "USD",
    href: "{{ url_for('checkout', integration=method, country=US) }}",
  },
}

const testCardBrandsMap = {
  visa: {
    src: "https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/visa.svg",
    cardNumber: "4111 1111 1111 1111",
    expiry: "03/30",
    cvc: "737",
  },
  mc: {
    src: "https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/mc.svg",
    cardNumber: "2222 4107 4036 0010",
    expiry: "03/30",
    cvc: "737",
  },
  amex: {
    src: "https://checkoutshopper-live.adyen.com/checkoutshopper/images/logos/amex.svg",
    cardNumber: "3700 0000 0000 002",
    expiry: "03/30",
    cvc: "7373",
  },
}

// Get old Drop-in
function getOldDiv() {
  const oldDiv = document.getElementById("dropin-container")
  const newDiv = document.createElement("div")
}

// Create new Drop-in and replace for the old one
function replaceDiv() {
  oldDiv.replaceWith(newDiv);
  newDiv.setAttribute("id", "dropin-container");
  newDiv.setAttribute("class", "payment p-5");
  initCheckout();
}


// Country dropdown changes the flag image and reloads the dropin with new country values
function changeSelect(el) {
  document.getElementById("flag_img").src = flagUrlMap[el.value].src
  const country = el.value
  countrySettings = getCountryData(country)
  console.log(countrySettings)
  if (
    document.getElementById("dropin-container") &&
    document.getElementById("placeholderData").checked == true
  ) {
    placeholderData = {
      holderName: "Jane Doe",
      billingAddress: {
        street: countrySettings.street,
        postalCode: countrySettings.postalCode,
        city: countrySettings.city,
        country: countrySettings.countryCode,
        stateOrProvince: countrySettings.stateOrProvince,
        houseNumberOrName: countrySettings.houseNumberOrName,
      },
    }
    // document.getElementById("placeholderData").checked = false
    // placeholderData = false
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    updateToggles();
    initCheckout();
  } else if (document.getElementById("dropin-container")) {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    updateToggles();
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
document
  .getElementById("firstPayBox")
  .parentNode.addEventListener("click", function (event) {
    // the value of `this` here is the element the event was fired on.
    // In this situation, it's the element with the ID of 'approval'.
    if (this.querySelector("input").checked) {
      const oldDiv = document.getElementById("dropin-container")
      const newDiv = document.createElement("div")
      openFirst = true
      oldDiv.replaceWith(newDiv)
      newDiv.setAttribute("id", "dropin-container")
      newDiv.setAttribute("class", "payment p-5")
      initCheckout()
    } else {
      const oldDiv = document.getElementById("dropin-container")
      const newDiv = document.createElement("div")
      openFirst = false
      oldDiv.replaceWith(newDiv)
      newDiv.setAttribute("id", "dropin-container")
      newDiv.setAttribute("class", "payment p-5")
      initCheckout()
    }
  })

// Function to add billing address
document
  .getElementById("billAdd")
  .parentNode.addEventListener("click", function (event) {
    // the value of `this` here is the element the event was fired on.
    // In this situation, it's the element with the ID of 'approval'.
    if (this.querySelector("input").checked) {
      const oldDiv = document.getElementById("dropin-container")
      const newDiv = document.createElement("div")
      billAdd = true
      oldDiv.replaceWith(newDiv)
      newDiv.setAttribute("id", "dropin-container")
      newDiv.setAttribute("class", "payment p-5")
      initCheckout()
    } else {
      const oldDiv = document.getElementById("dropin-container")
      const newDiv = document.createElement("div")
      billAdd = false
      oldDiv.replaceWith(newDiv)
      newDiv.setAttribute("id", "dropin-container")
      newDiv.setAttribute("class", "payment p-5")
      initCheckout()
    }
  })

// Function to show only saved payment methods
document
  .getElementById("onlyStored")
  .parentNode.addEventListener("click", function (event) {
    // the value of `this` here is the element the event was fired on.
    // In this situation, it's the element with the ID of 'approval'.
    if (this.querySelector("input").checked) {
      const oldDiv = document.getElementById("dropin-container")
      const newDiv = document.createElement("div")
      onlyStored = false
      oldDiv.replaceWith(newDiv)
      newDiv.setAttribute("id", "dropin-container")
      newDiv.setAttribute("class", "payment p-5")
      initCheckout()
    } else {
      const oldDiv = document.getElementById("dropin-container")
      const newDiv = document.createElement("div")
      onlyStored = true
      oldDiv.replaceWith(newDiv)
      newDiv.setAttribute("id", "dropin-container")
      newDiv.setAttribute("class", "payment p-5")
      initCheckout()
    }
  })

// function to show holder name field
document
  .getElementById("holderName")
  .parentNode.addEventListener("click", function (event) {
    // the value of `this` here is the element the event was fired on.
    // In this situation, it's the element with the ID of 'approval'.
    if (this.querySelector("input").checked) {
      const oldDiv = document.getElementById("dropin-container")
      const newDiv = document.createElement("div")
      holderName = true
      oldDiv.replaceWith(newDiv)
      newDiv.setAttribute("id", "dropin-container")
      newDiv.setAttribute("class", "payment p-5")
      initCheckout()
    } else {
      const oldDiv = document.getElementById("dropin-container")
      const newDiv = document.createElement("div")
      holderName = false
      oldDiv.replaceWith(newDiv)
      newDiv.setAttribute("id", "dropin-container")
      newDiv.setAttribute("class", "payment p-5")
      initCheckout()
    }
  })

// Funtion to show all payment methods
document
  .getElementById("showPayMethod")
  .parentNode.addEventListener("click", function (event) {
    // the value of `this` here is the element the event was fired on.
    // In this situation, it's the element with the ID of 'approval'.
    if (this.querySelector("input").checked) {
      const oldDiv = document.getElementById("dropin-container")
      const newDiv = document.createElement("div")
      showPayMethod = false
      oldDiv.replaceWith(newDiv)
      newDiv.setAttribute("id", "dropin-container")
      newDiv.setAttribute("class", "payment p-5")
      initCheckout()
    } else {
      const oldDiv = document.getElementById("dropin-container")
      const newDiv = document.createElement("div")
      showPayMethod = true
      oldDiv.replaceWith(newDiv)
      newDiv.setAttribute("id", "dropin-container")
      newDiv.setAttribute("class", "payment p-5")
      initCheckout()
    }
  })

// Funtion to hide or show cvc
document
  .getElementById("hideCVC")
  .parentNode.addEventListener("click", function (event) {
    // the value of `this` here is the element the event was fired on.
    // In this situation, it's the element with the ID of 'approval'.
    if (this.querySelector("input").checked) {
      const oldDiv = document.getElementById("dropin-container")
      const newDiv = document.createElement("div")
      hideCVC = true
      oldDiv.replaceWith(newDiv)
      newDiv.setAttribute("id", "dropin-container")
      newDiv.setAttribute("class", "payment p-5")
      initCheckout()
    } else {
      const oldDiv = document.getElementById("dropin-container")
      const newDiv = document.createElement("div")
      hideCVC = false
      oldDiv.replaceWith(newDiv)
      newDiv.setAttribute("id", "dropin-container")
      newDiv.setAttribute("class", "payment p-5")
      initCheckout()
    }
  })

// Funtion for including placeholder data
document
  .getElementById("placeholderData")
  .parentNode.addEventListener("click", function (event) {
    // the value of `this` here is the element the event was fired on.
    // In this situation, it's the element with the ID of 'approval'.
    if (this.querySelector("input").checked) {
      const oldDiv = document.getElementById("dropin-container")
      const newDiv = document.createElement("div")
      placeholderData = {
        holderName: "Jane Doe",
        billingAddress: {
          street: countrySettings.street,
          postalCode: countrySettings.postalCode,
          city: countrySettings.city,
          country: countrySettings.countryCode,
          stateOrProvince: countrySettings.stateOrProvince,
          houseNumberOrName: countrySettings.houseNumberOrName,
        },
      }
      console.log(countrySettings)
      oldDiv.replaceWith(newDiv)
      newDiv.setAttribute("id", "dropin-container")
      newDiv.setAttribute("class", "payment p-5")
      initCheckout()
    } else {
      const oldDiv = document.getElementById("dropin-container")
      const newDiv = document.createElement("div")
      placeholderData = false
      oldDiv.replaceWith(newDiv)
      newDiv.setAttribute("id", "dropin-container")
      newDiv.setAttribute("class", "payment p-5")
      initCheckout()
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
    houseNumberOrName: "6 - 50",
  },
  {
    countryCode: "GB",
    currency: "GBP",
    locale: "en_GB",
    city: "London",
    postalCode: "W1T3HE",
    street: "Wells Mews",
    houseNumberOrName: "12 13",
  },
  {
    countryCode: "US",
    currency: "USD",
    locale: "en_US",
    city: "New York City",
    postalCode: "10003",
    street: "71 5th Avenue",
    stateOrProvince: "NY",
    houseNumberOrName: "Floor 11",
  },
]
if (storedCountry) {
  const selectedCountry = JSON.parse(storedCountry.innerHTML)
  countrySettings = getCountryData(selectedCountry)
}
if (countryURL) {
  const selectedCountry = countryURL
  countrySettings = getCountryData(selectedCountry)
}

function getCountryData(countrySettings) {
  return countryVariables.find(
    (locality) => locality.countryCode === countrySettings
  )
}

let blockedPM = {"blockedPaymentMethods": payArray};

async function initCheckout() {
  try {
    const mergeData = {
      ...countrySettings,
      ...blockedPM
    }
    const paymentMethodsResponse = await callServer(
      "/api/getPaymentMethods",
      mergeData
    )
    console.log(mergeData)
    let prettyResponse = JSON.stringify(paymentMethodsResponse, null, 2)
    console.log(prettyResponse)
    let configuration = {
      paymentMethodsResponse: paymentMethodsResponse,
      clientKey,
      locale: countrySettings.locale || "en_NL",
      countryCode: countrySettings.countryCode || "NL",
      environment: "test",
      showPayButton: true,
      paymentMethodsConfiguration: {
        ideal: {
          showImage: true,
        },
        card: {
          hasHolderName: holderName,
          holderNameRequired: true,
          hideCVC: hideCVC,
          // brands: ['mc','visa','amex'],
          name: "Credit or debit card",
          data: {
            holderName: placeholderData.holderName,
            billingAddress: placeholderData.billingAddress,
          },
          enableStoreDetails: true,
          billingAddressRequired: billAdd,
          amount: {
            value: 4000,
            currency: countrySettings.currency || "EUR",
          },
        },
        storedCard: {
          hideCVC: hideCVC,
        },
        paypal: {
          amount: {
            currency: countrySettings.currency || "EUR",
            value: 4000,
          },
          //commit: false,
          environment: "test", // Change this to "live" when you're ready to accept live PayPal payments
          countryCode: countrySettings.countryCode || "NL", // Only needed for test. This will be automatically retrieved when you are in production.
          showPayButton: true,
          merchantId: "AD74FQNVXQY5E",
          //subtype: "redirect"
        },
      },
      onSubmit: (state, dropin) => {
        if (state.isValid) {
          handleSubmission(
            state,
            dropin,
            "/api/initiatePayment",
            countrySettings,
            payArray
          )
        }
      },
      onAdditionalDetails: (state, dropin) => {
        handleSubmission(state, dropin, "/api/submitAdditionalDetails")
      },
      onDisableStoredPaymentMethod: (
        storedPaymentMethodId,
        resolve,
        reject
      ) => {
        // handleSubmission(state, dropin, "/api/disable");
      },
    }
    // cloning configuration object to filter and log
    const cloneConfig = Object.assign({}, configuration)
    logConfig(cloneConfig)

    const checkout = await AdyenCheckout(configuration)
    checkout
      .create("dropin", {
        showRemovePaymentMethodButton: true,
        openFirstPaymentMethod: openFirst,
        showStoredPaymentMethods: onlyStored,
        showPaymentMethods: showPayMethod,
        onDisableStoredPaymentMethod: (
          storedPaymentMethodId,
          resolve,
          reject
        ) => {
          callServer("/api/disable", {
            storedPaymentMethodId: storedPaymentMethodId,
          })
          resolve()
          reject()
        },
      })
      .mount("#dropin-container")
  } catch (error) {
    console.error(error)
    alert("Error occurred. Look at console for details")
  }
}

async function unmountContainer() {
  try {
    const checkout = await AdyenCheckout();
    checkout
      .unmount("#dropin-container")
  } catch (error) {
    console.error(error)
    alert("Error occurred. Look at console for details")
  }
}


// logging configuration object to UI
function logConfig(cloneConfig) {
  console.log(cloneConfig)
  // let filteredConfig = loggedConfig

  delete cloneConfig.paymentMethodsResponse
  cloneConfig.clientKey = "***"
  cloneConfig.paymentMethodsConfiguration.paypal.merchantId = "***"

  let finalConfig = { configuration: cloneConfig }
  let stringConfig = JSON.stringify(finalConfig, null, 2)

  console.log(stringConfig)

  document.getElementById("configCode").innerHTML =
    syntaxHighlight(stringConfig)
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
async function handleSubmission(state, dropin, url, countrySettings, payArray) {
  try {
    //keeping the country data for the /payments call
    const mergedData = {
      ...state.data,
      ...countrySettings,
      ...payArray
    }
    const res = await callServer(url, mergedData)
    let prettyResponse = JSON.stringify(res, null, 2)
    console.log(prettyResponse)
    handleServerResponse(res, dropin)
  } catch (error) {
    console.error(error)
    alert("Error occurred. Look at console for details")
  }
}

// Calls your server endpoints
async function callServer(url, data) {
  const res = await fetch(url, {
    method: "POST",
    body: data ? JSON.stringify(data) : "",
    headers: {
      "Content-Type": "application/json",
    },
  })
  return await res.json()
}

const successDiv = document.querySelector(".successDiv")
successDiv.style.display = "none"
const errorDiv = document.querySelector(".errorDiv")
errorDiv.style.display = "none"

// Handles responses sent from your server to the client
function handleServerResponse(res, dropin) {
  if (res.action) {
    dropin.handleAction(res.action)
  } else {
    switch (res.resultCode) {
      case "Authorised":
        let currentDiv = document.getElementById("dropin-container")
        successDiv.style.display = ""
        currentDiv.style.display = "none"
        // window.location.href = "/result/success";
        break
      case "Pending":
      case "Received":
        window.location.href = "/result/pending"
        break
      case "Refused":
        let thisDiv = document.getElementById("dropin-container")
        errorDiv.style.display = ""
        thisDiv.style.display = "none"
        // window.location.href = "/result/failed";
        break
      default:
        window.location.href = "/result/error"
        break
    }
  }
}

// not it use
function restartDropin() {
  const currentDiv = document.getElementById("dropin-container")
  currentDiv.style.display = ""
  const newDiv = document.createElement("div")
  currentDiv.replaceWith(newDiv)
  newDiv.setAttribute("id", "dropin-container")
  newDiv.setAttribute("class", "payment p-5")
  newDiv.style.display = ""
  successDiv.style.display = "none"
  errorDiv.style.display = "none"
  initCheckout()
}



// define r as root of document for css variables
let r = document.querySelector(":root")

// Colour picker changes button color
function setDynamicCSS() {
  colorVal = document.getElementById("buttonColorPick").value
  r.style.setProperty("--background-color", colorVal)
  updateStyleCode()
}
// change page background colour
function backgroundColor() {
  let bgVal = document.getElementById("bgColorPick").value
  r.style.setProperty("--bg-color", bgVal)
}
// change active payment method colour
function dropinColor() {
  let dropinColor = document.getElementById("dropinColorPick").value
  r.style.setProperty("--dropin-color", dropinColor)
  updateStyleCode()
}
// change collapsed payment methods' colours
function dropinTabColor() {
  let dropinTabColor = document.getElementById("dropinTabColorPick").value
  r.style.setProperty("--dropin-tab-color", dropinTabColor)
  updateStyleCode()
}
// change text colour
function textColor() {
  let textColor = document.getElementById("textColorPick").value
  r.style.setProperty("--text-color", textColor)
  updateStyleCode()
}
// change pay buttons' edges (staright to round)
function buttonEdges() {
  let edgeValue = document.getElementById("buttonEdges").value
  let pixelVal = edgeValue + "px"
  r.style.setProperty("--button-edges", pixelVal)
  updateStyleCode()
}
// change Drop-in's edges (straight to round)
function bodyEdges() {
  let bodyEdgeValue = document.getElementById("bodyEdges").value
  let bodyPixelVal = bodyEdgeValue + "px"
  r.style.setProperty("--body-edges", bodyPixelVal)
  r.style.setProperty("--selectedBody-edges", bodyPixelVal)
  r.style.setProperty("--topedges-left", bodyPixelVal)
  r.style.setProperty("--topedges-right", bodyPixelVal)
  r.style.setProperty("--bottomedges-left", bodyPixelVal)
  r.style.setProperty("--bottomedges-right", bodyPixelVal)
  updateStyleCode()
}

// Function to remove borders
document
  .getElementById("noBorder")
  .parentNode.addEventListener("click", function (event) {
    if (this.querySelector("input").checked) {
      r.style.setProperty("--border-off", "0")
      updateStyleCode()
    } else {
      r.style.setProperty("--border-off", null)
      updateStyleCode()
    }
  })

// Reset CSS values to default Drop-in
function resetDynamicCSS() {
  r.style.setProperty("--background-color", null)
  r.style.setProperty("--dropin-width", null)
  r.style.setProperty("--body-edges", null)
  r.style.setProperty("--selectedBody-edges", null)
  r.style.setProperty("--topedges-left", null)
  r.style.setProperty("--topedges-right", null)
  r.style.setProperty("--bottomedges-left", null)
  r.style.setProperty("--bottomedges-right", null)
  r.style.setProperty("--button-edges", null)
  r.style.setProperty("--bg-color", null)
  r.style.setProperty("--dropin-color", null)
  r.style.setProperty("--dropin-tab-color", null)
  r.style.setProperty("--dropin-font", null)
  r.style.setProperty("--text-color", null)
  r.style.setProperty("--text-bold", null)
  r.style.setProperty("--text-italic", null)
  r.style.setProperty("--text-align", null)
  r.style.setProperty("--payButton-width", null)
  r.style.setProperty("--payments-spacing", null)
  r.style.setProperty("--paymentselected-margin", null)
  r.style.setProperty("--font-options", null)
}
// change dropin container width
function dropinWidth() {
  let widthValue = document.getElementById("changeWidth").value
  let widthpx = widthValue + "px"
  r.style.setProperty("--dropin-width", widthpx)
  console.log(widthpx)
  updateStyleCode()
}
// change pay buttons' width
function payButtonWidth() {
  let payWidthValue = document.getElementById("payButtonWidth").value
  let payWidthpx = payWidthValue + "px"
  r.style.setProperty("--payButton-width", payWidthpx)
  updateStyleCode()
}
// change spacing of payment methods tabs
function paymentsSpacing() {
  let paymentSpacingValue = document.getElementById("paymentsSpacing").value
  let paymentSpacingpx = paymentSpacingValue + "px"
  r.style.setProperty("--payments-spacing", paymentSpacingpx)
  r.style.setProperty("--paymentselected-margin", paymentSpacingpx)
  updateStyleCode()
}
// change font size
function fontWidth() {
  let fontValue = document.getElementById("fontSize").value
  let fontpx = fontValue + "px"
  r.style.setProperty("--dropin-font", fontpx)
  updateStyleCode()
}

// this turns the test card around on copyCVC button click
function turnCard() {
	updateCardCopy();
  document.getElementById("card").classList.add("card-visited")
}

// this turns the card back to front if on reverse and copyPAN or copyExiry button gets clicked
function resetCard() {
	updateCardCopy();
  if (document.getElementById("card").classList.contains("card-visited")) {
    document.getElementById("card").classList.remove("card-visited")
  }
}

// this updates the button attribute copy text to reflect the current card on UI
function updateCardCopy() {
	let panText = document.getElementById('cardNumber').innerText
	console.log(panText)
	document.getElementById('btn').setAttribute("data-clipboard-text", String(panText))
	let expiryText = document.getElementById('expiry').innerText
	document.getElementById('copy-expiry').setAttribute("data-clipboard-text", String(expiryText))
	let cvcText = document.getElementById('cvc').innerText
	document.getElementById('copy-cvc').setAttribute("data-clipboard-text", String(cvcText))
}

// this is for the drop down to change test cards
function changeTestCard(brandValue) {
	updateCardCopy();
  document.getElementById("brand_img").src =
    testCardBrandsMap[brandValue.value].src
  document.getElementById("cardNumber").innerText =
    testCardBrandsMap[brandValue.value].cardNumber
  document.getElementById("cvc").innerText =
    testCardBrandsMap[brandValue.value].cvc
}
// change text position
function positionText() {
  let positionValue = document.getElementById("positionText").value
  r.style.setProperty("--text-align", positionValue)
  updateStyleCode()
}
// make text bold
function makeBold() {
  if (document.getElementById("makeBold").classList.contains("bold-active")) {
    document.getElementById("makeBold").classList.remove("bold-active")
    r.style.setProperty("--text-bold", null)
    updateStyleCode()
  } else {
    document.getElementById("makeBold").classList.add("bold-active")
    r.style.setProperty("--text-bold", "bold")
    updateStyleCode()
  }
}

// make text italic
function makeItalic() {
  if (
    document.getElementById("makeItalic").classList.contains("italic-active")
  ) {
    document.getElementById("makeItalic").classList.remove("italic-active")
    r.style.setProperty("--text-italic", null)
    updateStyleCode()
  } else {
    document.getElementById("makeItalic").classList.add("italic-active")
    r.style.setProperty("--text-italic", "italic")
    updateStyleCode()
  }
}

//drop down selector for the different font styles
function changeFont() {
  r.style.setProperty("--font-options", null)
  let fontValue = document.getElementById("font_select").value
  r.style.setProperty("--font-options", fontValue)
  updateStyleCode()
}

// default toggles for NL
document.getElementById('trustlyCol').style.display = "none"
document.getElementById('trustlyBox').style.display = "none"
document.getElementById('trustlyToggle').style.display = "none"

// Remove toggle from txvariants not applicable for the 
function updateToggles(){
  if(countrySettings.countryCode == 'GB' ) {
    document.getElementById('trustlyCol').style.display = ""
    document.getElementById('trustlyBox').style.display = ""
    document.getElementById('trustlyToggle').style.display = ""
  }
  else if(countrySettings.countryCode == 'NL' ) {
    document.getElementById('trustlyCol').style.display = "none"
    document.getElementById('trustlyBox').style.display = "none"
    document.getElementById('trustlyToggle').style.display = "none"
  }
  else if (countrySettings.countryCode == 'US' ){
    document.getElementById('trustlyCol').style.display = "none"
    document.getElementById('trustlyBox').style.display = "none"
    document.getElementById('trustlyToggle').style.display = "none"

  }
}
// Add txvariants to blockPaymentMethods array on button click
// -------Cards - visa+mastercard+amex ---------
function blockCard() {
	const CardState = document.getElementById('showCard').checked;
	if (CardState == true) {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
    const filteredPM = payMethods.filter((s) => !s.match("visa") && !s.match("mc") && !s.match("amex"));
    payMethods = filteredPM;
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout()
	} else {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
		payMethods.push("visa");
    payMethods.push("mc");
    payMethods.push("amex");
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout()
	}
}
// -------PayPal---------
function blockPaypal() {
	const paypalState = document.getElementById('showPaypal').checked;
	if (paypalState == true) {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
    const filteredPM = payMethods.filter((s) => !s.match("paypal"));
    payMethods = filteredPM;
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout()
	} else {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
		payMethods.push("paypal");
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout()
	}
}
// -------Ideal---------
function blockIdeal() {
	const idealState = document.getElementById('showIdeal').checked;
	if (idealState == true) {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
    const filteredPM = payMethods.filter((s) => !s.match("ideal"));
    payMethods = filteredPM;
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout();
	} else {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
		payMethods.push("ideal");
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout()
	}
}
// -------Klarna---------
function blockKlarna() {
	const klarnaState = document.getElementById('showKlarna').checked;
	if (klarnaState == true) {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
    const filteredPM = payMethods.filter((s) => !s.match("klarna"));
    payMethods = filteredPM;
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout();
	} else {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
		payMethods.push("klarna");
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout()
	}
}
// -------GooglePay---------
function blockGooglePay() {
	const GooglePayState = document.getElementById('showGooglePay').checked;
	if (GooglePayState == true) {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
    const filteredPM = payMethods.filter((s) => !s.match("paywithgoogle"));
    payMethods = filteredPM;
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout();
	} else {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
		payMethods.push("paywithgoogle");
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout()
	}
}
// -------WeChat---------
function blockWeChat() {
	const WeChatState = document.getElementById('showWeChat').checked;
	if (WeChatState == true) {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
    const filteredPM = payMethods.filter((s) => !s.match("wechatpayQR"));
    payMethods = filteredPM;
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout();
	} else {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
		payMethods.push("wechatpayQR");
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout()
	}
}
// -------AliPay---------
function blockAliPay() {
	const AliPayState = document.getElementById('showAliPay').checked;
	if (AliPayState == true) {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
    const filteredPM = payMethods.filter((s) => !s.match("alipay"));
    payMethods = filteredPM;
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout();
	} else {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
		payMethods.push("alipay");
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout()
	}
}
// -------Paysafecard---------
function blockPaysafecard() {
	const PaysafecardState = document.getElementById('showPaysafecard').checked;
	if (PaysafecardState == true) {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
    const filteredPM = payMethods.filter((s) => !s.match("paysafecard"));
    payMethods = filteredPM;
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout();
	} else {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
		payMethods.push("paysafecard");
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout()
	}
}
// -------Clearpay---------
function blockClearpay() {
	const ClearpayState = document.getElementById('showClearpay').checked;
	if (ClearpayState == true) {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
    const filteredPM = payMethods.filter((s) => !s.match("clearpay"));
    payMethods = filteredPM;
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout();
	} else {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
		payMethods.push("clearpay");
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout()
	}
}
// -------Trustly---------
function blockTrustly() {
	const TrustlyState = document.getElementById('showTrustly').checked;
	if (TrustlyState == true) {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
    const filteredPM = payMethods.filter((s) => !s.match("trustly"));
    payMethods = filteredPM;
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout();
	} else {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
		payMethods.push("trustly");
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout()
	}
}

//JSON highlight code styling
function syntaxHighlight(json) {
  json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      var cls = "number"
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "key"
        } else {
          cls = "string"
        }
      } else if (/true|false/.test(match)) {
        cls = "boolean"
      } else if (/null/.test(match)) {
        cls = "null"
      }
      return '<span class="' + cls + '">' + match + "</span>"
    }
  )
}

// Get css values from current page and print to "Save your creation"
function updateStyleCode() {
  let cssjson = {
    ".adyen-checkout__payment-method": {
      width: getComputedStyle(r).getPropertyValue("--dropin-width"),
      "font-size": getComputedStyle(r).getPropertyValue("--dropin-font"),
      "font-family": getComputedStyle(r).getPropertyValue("--font-options"),
      "text-align": getComputedStyle(r).getPropertyValue("--text-align"),
      "border-radius": getComputedStyle(r).getPropertyValue("--body-edges"),
      border: getComputedStyle(r).getPropertyValue("--border-off"),
      background: getComputedStyle(r).getPropertyValue("--dropin-tab-color"),
      "font-weight": getComputedStyle(r).getPropertyValue("--text-bold"),
      margin: getComputedStyle(r).getPropertyValue("--payments-spacing"),
    },
    ".adyen-checkout__button.adyen-checkout__button--pay": {
      width: getComputedStyle(r).getPropertyValue("--payButton-width"),
      background: getComputedStyle(r).getPropertyValue("--background-color"),
      "border-radius": getComputedStyle(r).getPropertyValue("--button-edges"),
    },
    ".adyen-checkout__payment-methods-list li:nth-child(2)": {
      "border-top-left-radius":
        getComputedStyle(r).getPropertyValue("--topedges-left"),
      "border-top-right-radius":
        getComputedStyle(r).getPropertyValue("--topedges-right"),
    },
    ".adyen-checkout__payment-methods-list li:last-child": {
      "border-bottom-left-radius":
        getComputedStyle(r).getPropertyValue("--bottomedges-left"),
      "border-bottom-right-radius": getComputedStyle(r).getPropertyValue(
        "--bottomedges-right"
      ),
    },
    ".adyen-checkout__dropin": {
      "text-align": getComputedStyle(r).getPropertyValue("--text-align"),
    },
    ".adyen-checkout__payment-method--selected": {
      background: getComputedStyle(r).getPropertyValue("--dropin-color"),
      margin: getComputedStyle(r).getPropertyValue("--paymentselected-margin"),
      "border-radius": getComputedStyle(r).getPropertyValue(
        "--selectedBody-edges"
      ),
    },
    ".adyen-checkout__payment-method__name": {
      "font-weight": getComputedStyle(r).getPropertyValue("--text-bold"),
      "font-style": getComputedStyle(r).getPropertyValue("--text-italic"),
      color: getComputedStyle(r).getPropertyValue("--text-color"),
    },
    ".adyen-checkout__label__text": {
      "font-weight": getComputedStyle(r).getPropertyValue("--text-bold"),
      "font-style": getComputedStyle(r).getPropertyValue("--text-italic"),
      color: getComputedStyle(r).getPropertyValue("--text-color"),
    },
    ".adyen-checkout__checkbox__label": {
      "font-weight": getComputedStyle(r).getPropertyValue("--text-bold"),
      "font-style": getComputedStyle(r).getPropertyValue("--text-italic"),
      color: getComputedStyle(r).getPropertyValue("--text-color"),
    },
    ".adyen-checkout__button__text": {
      "font-weight": getComputedStyle(r).getPropertyValue("--text-bold"),
      "font-style": getComputedStyle(r).getPropertyValue("--text-italic"),
      color: getComputedStyle(r).getPropertyValue("--text-color"),
    }
  }
  var styleStr = ""
  for (var i in cssjson) {
    styleStr += i + " {\n"
    for (var j in cssjson[i]) {
      styleStr += "\t" + j + ":" + cssjson[i][j] + ";\n"
    }
    styleStr += "}\n"
  }
  // let stringCSS = JSON.stringify(css, null, 2);
  document.getElementById("cssCode").innerHTML = styleStr
}
updateStyleCode()

initCheckout()
