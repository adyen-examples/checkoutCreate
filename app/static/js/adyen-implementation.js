let r = document.querySelector(":root")
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

/**
 * Global configuration variables
 * 
 */ 
let openFirst = true
let billAdd = false
let onlyStored = true
let holderName = false
let showPayMethod = true
let hideCVC = false
let placeholderData = false

/**
 * Hiding toggles of local payment methods not supported for NL (initial page load)
 * 
 */ 
document.getElementById('trustlyCol').style.display = "none"
document.getElementById('trustlyBox').style.display = "none"
document.getElementById('trustlyToggle').style.display = "none"
document.getElementById('clearpayCol').style.display = "none"
document.getElementById('clearpayBox').style.display = "none"
document.getElementById('clearpayToggle').style.display = "none"

// identify checkout div and create new empty div to replace with
const oldDiv = document.getElementById("dropin-container")
const newDiv = document.createElement("div")

/**
 * Country flag svg image location
 */
const flagUrlMap = {
  NL: {
    src: "https://ca-test.adyen.com/ca/adl/img/flags/nl.svg"
  },
  GB: {
    src: "https://ca-test.adyen.com/ca/adl/img/flags/gb.svg"
  },
  US: {
    src: "https://ca-test.adyen.com/ca/adl/img/flags/us.svg"
  }
}
/**
 * Country specific variables
 */
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

/**
 * Country dropdown changes the flag image and reloads the dropin with new country values
 * Calls /paymentMethods to retrieve available txvariants for that country
 * @param {*} el 
 */
async function changeSelect(el) {
  // let countryPM = getConfiguration();
  console.log(Object.values)
  document.getElementById("flag_img").src = flagUrlMap[el.value].src
  const country = el.value
  countrySettings = getCountryData(country)
  let txvariants = await getCountryPM()
  console.log(txvariants)
  if (txvariants.includes("trustly") === true) {
    document.getElementById('trustlyCol').style.display = ""
    document.getElementById('trustlyBox').style.display = ""
    document.getElementById('trustlyToggle').style.display = ""
  } else {
    document.getElementById('trustlyCol').style.display = "none"
    document.getElementById('trustlyBox').style.display = "none"
    document.getElementById('trustlyToggle').style.display = "none"
  }
  if (txvariants.includes("clearpay") === true) {
    document.getElementById('clearpayCol').style.display = ""
    document.getElementById('clearpayBox').style.display = ""
    document.getElementById('clearpayToggle').style.display = ""
  } else {
    document.getElementById('clearpayCol').style.display = "none"
    document.getElementById('clearpayBox').style.display = "none"
    document.getElementById('clearpayToggle').style.display = "none"
  }
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
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout();
  } else if (document.getElementById("dropin-container")) {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout();
  }
}

/**
 * Funtion to toggle first payment method open
 */
document
  .getElementById("firstPayBox")
  .parentNode.addEventListener("click", function (event) {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
    if (this.querySelector("input").checked) {
      openFirst = true
    } else {
      openFirst = false
    }
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout();
  })

// Function to add billing address
document
  .getElementById("billAdd")
  .parentNode.addEventListener("click", function (event) {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
    if (this.querySelector("input").checked) {
      billAdd = true
    } else {
      billAdd = false
    }
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout()
  })

// Function to show only saved payment methods
document
  .getElementById("onlyStored")
  .parentNode.addEventListener("click", async function (event) {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
    if (this.querySelector("input").checked) {
      onlyStored = false
    } else {
      onlyStored = true
    }
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout()
  })

// function to show holder name field
document
  .getElementById("holderName")
  .parentNode.addEventListener("click", function (event) {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
    if (this.querySelector("input").checked) {
      holderName = true
    } else {
      holderName = false
    }
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout()
  })

// Funtion to show all payment methods
document
  .getElementById("showPayMethod")
  .parentNode.addEventListener("click", function (event) {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
    if (this.querySelector("input").checked) {
      showPayMethod = false
    } else {
      showPayMethod = true
    }
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout()
  })

// Funtion to hide or show cvc
document
  .getElementById("hideCVC")
  .parentNode.addEventListener("click", function (event) {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
    if (this.querySelector("input").checked) {
      hideCVC = true
    } else {
      hideCVC = false
    }
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout()
  })

// Funtion for including placeholder data
document
  .getElementById("placeholderData")
  .parentNode.addEventListener("click", function (event) {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
    if (this.querySelector("input").checked) {
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
    } else {
      placeholderData = false
    }
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout()
  })

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

/**
 * setting the array of blockedPaymentMethods
 */
let blockedPM = {"blockedPaymentMethods": payArray};

async function getCountryPM() {
  let noBlock = {"blockedPaymentMethods": []};
  const mergeData = {
    ...countrySettings,
    ...noBlock
  }
  const unblockedResponse = await callServer(
    "/api/getPaymentMethods",
    mergeData
  )
  let payMethodArray = unblockedResponse.paymentMethods
  let txvariants = payMethodArray.map(({ type }) => type);
  return await txvariants
}

async function paymentMethods() {
  const mergeData = {
    ...countrySettings,
    ...blockedPM
  }
  const paymentMethodsResponse = await callServer(
    "/api/getPaymentMethods",
    mergeData
  )
  console.log(paymentMethodsResponse)
  return await paymentMethodsResponse
}

async function getConfiguration() {
  const paymentMethodsResponse = await paymentMethods();
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
        environment: "test", // Change this to "live" when you're ready to accept live PayPal payments
        countryCode: countrySettings.countryCode || "NL", // Only needed for test. This will be automatically retrieved when you are in production.
        showPayButton: true,
        merchantId: "AD74FQNVXQY5E",
      }
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
    }
  }
  let cloneConfig = Object.assign({}, configuration)
  logConfig(cloneConfig)
  return await configuration
}

async function initCheckout() {
  try {
    let configuration = await getConfiguration()
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
    return await checkout
  } catch (error) {
    console.error(error)
    alert("Error occurred. Look at console for details")
  }
}

async function unmountDropin() {
  const checkout = await initCheckout()
  checkout.unmount("#dropin-container")
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

/**
 * @function handleSubmission - Event handlers called when the shopper selects the pay button, or when additional information is required to complete the payment
 * @param state  - Dropin state data
 * @param dropin - Dropin
 * @param url - web address
 * @param countrySettings - country specific data
 */
async function handleSubmission(state, dropin, url, countrySettings) {
  try {
    //keeping the country data for the /payments call
    const mergedData = {
      ...state.data,
      ...countrySettings
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

/**
 * @function handleServerResponse - Handles responses sent from your server to the client
 * @param res - API response payload
 * @param dropin - Dropin
 */
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

// Add txvariants to blockPaymentMethods array on button click
// ------- Cards ---------
/**
 * @function blockCard - adds/removes visa, amex and mastercard as txvariants to blockPaymentMethods array
 */
function blockCard() {
	const CardState = document.getElementById('showCard').checked;
  const oldDiv = document.getElementById("dropin-container")
  const newDiv = document.createElement("div")
	if (CardState == true) {
    const filteredPM = payMethods.filter((s) => !s.match("visa") && !s.match("mc") && !s.match("amex"));
    payMethods = filteredPM;
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
	} else {
		payMethods.push("visa");
    payMethods.push("mc");
    payMethods.push("amex");
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
	}
  oldDiv.replaceWith(newDiv)
  newDiv.setAttribute("id", "dropin-container")
  newDiv.setAttribute("class", "payment p-5")
  initCheckout()
}
// -------PayPal---------
/**
 * @function blockPaypal - adds/removes paypal as txvariant to blockPaymentMethods array
 */
function blockPaypal() {
	const paypalState = document.getElementById('showPaypal').checked;
  const oldDiv = document.getElementById("dropin-container")
  const newDiv = document.createElement("div")
	if (paypalState == true) {
    const filteredPM = payMethods.filter((s) => !s.match("paypal"));
    payMethods = filteredPM;
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
	} else {
		payMethods.push("paypal");
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
	}
  oldDiv.replaceWith(newDiv)
  newDiv.setAttribute("id", "dropin-container")
  newDiv.setAttribute("class", "payment p-5")
  initCheckout()
}
// -------Ideal---------
/**
 * @function blockIdeal - adds/removes ideal as txvariant to blockPaymentMethods array
 */
function blockIdeal() {
	const idealState = document.getElementById('showIdeal').checked;
  const oldDiv = document.getElementById("dropin-container")
  const newDiv = document.createElement("div")
	if (idealState == true) {
    const filteredPM = payMethods.filter((s) => !s.match("ideal"));
    payMethods = filteredPM;
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
	} else {
		payMethods.push("ideal");
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
	}
  oldDiv.replaceWith(newDiv)
  newDiv.setAttribute("id", "dropin-container")
  newDiv.setAttribute("class", "payment p-5")
  initCheckout();
}
// -------Klarna---------
/**
 * @function blockKlarna - adds/removes klarna as txvariant to blockPaymentMethods array
 */
function blockKlarna() {
	const klarnaState = document.getElementById('showKlarna').checked;
  const oldDiv = document.getElementById("dropin-container")
  const newDiv = document.createElement("div")
	if (klarnaState == true) {
    const filteredPM = payMethods.filter((s) => !s.match("klarna"));
    payMethods = filteredPM;
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
	} else {
		payMethods.push("klarna");
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
	}
  oldDiv.replaceWith(newDiv)
  newDiv.setAttribute("id", "dropin-container")
  newDiv.setAttribute("class", "payment p-5")
  initCheckout();
}
// -------GooglePay---------
/**
 * @function blockGooglePay - adds/removes paywithgoogle as txvariant to blockPaymentMethods array
 */
function blockGooglePay() {
	const GooglePayState = document.getElementById('showGooglePay').checked;
  const oldDiv = document.getElementById("dropin-container")
  const newDiv = document.createElement("div")
	if (GooglePayState == true) {
    const filteredPM = payMethods.filter((s) => !s.match("paywithgoogle"));
    payMethods = filteredPM;
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
	} else {
		payMethods.push("paywithgoogle");
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
	}
  oldDiv.replaceWith(newDiv)
  newDiv.setAttribute("id", "dropin-container")
  newDiv.setAttribute("class", "payment p-5")
  initCheckout();
}
// -------WeChat---------
/**
 * @function blockWeChat - adds/removes wechatpayQR as txvariant to blockPaymentMethods array
 */
function blockWeChat() {
	const WeChatState = document.getElementById('showWeChat').checked;
  const oldDiv = document.getElementById("dropin-container")
  const newDiv = document.createElement("div")
	if (WeChatState == true) {
    const filteredPM = payMethods.filter((s) => !s.match("wechatpayQR"));
    payMethods = filteredPM;
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
	} else {
		payMethods.push("wechatpayQR");
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
	}
  oldDiv.replaceWith(newDiv)
  newDiv.setAttribute("id", "dropin-container")
  newDiv.setAttribute("class", "payment p-5")
  initCheckout();
}
// -------AliPay---------
/**
 * @function blockAliPay - adds/removes alipay as txvariant to blockPaymentMethods array
 */
function blockAliPay() {
	const AliPayState = document.getElementById('showAliPay').checked;
  const oldDiv = document.getElementById("dropin-container")
  const newDiv = document.createElement("div")
	if (AliPayState == true) {
    const filteredPM = payMethods.filter((s) => !s.match("alipay"));
    payMethods = filteredPM;
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
	} else {
		payMethods.push("alipay");
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
	}
  oldDiv.replaceWith(newDiv)
  newDiv.setAttribute("id", "dropin-container")
  newDiv.setAttribute("class", "payment p-5")
  initCheckout();
}
// -------Paysafecard---------
/**
 * @function blockPaysafecard - adds/removes paysafecard as txvariant to blockPaymentMethods array
 */
function blockPaysafecard() {
	const PaysafecardState = document.getElementById('showPaysafecard').checked;
  const oldDiv = document.getElementById("dropin-container")
  const newDiv = document.createElement("div")
	if (PaysafecardState == true) {
    const filteredPM = payMethods.filter((s) => !s.match("paysafecard"));
    payMethods = filteredPM;
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
	} else {
		payMethods.push("paysafecard");
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
	}
  oldDiv.replaceWith(newDiv)
  newDiv.setAttribute("id", "dropin-container")
  newDiv.setAttribute("class", "payment p-5")
  initCheckout();
}
// -------Clearpay---------
/**
 * @function blockClearpay - adds/removes clearpay as txvariant to blockPaymentMethods array
 */
function blockClearpay() {
	const ClearpayState = document.getElementById('showClearpay').checked;
  const oldDiv = document.getElementById("dropin-container")
  const newDiv = document.createElement("div")
	if (ClearpayState == true) {
    const filteredPM = payMethods.filter((s) => !s.match("clearpay"));
    payMethods = filteredPM;
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
	} else {
		payMethods.push("clearpay");
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
	}
  oldDiv.replaceWith(newDiv)
  newDiv.setAttribute("id", "dropin-container")
  newDiv.setAttribute("class", "payment p-5")
  initCheckout();
}
// -------Trustly---------
/**
 * @function blockTrustly - adds/removes trustly as txvariant to blockPaymentMethods array
 */
function blockTrustly() {
	const TrustlyState = document.getElementById('showTrustly').checked;
  const oldDiv = document.getElementById("dropin-container")
  const newDiv = document.createElement("div")
	if (TrustlyState == true) {
    const filteredPM = payMethods.filter((s) => !s.match("trustly"));
    payMethods = filteredPM;
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
	} else {
		payMethods.push("trustly");
    payArray = Object.values(payMethods);
    blockedPM = {"blockedPaymentMethods": payArray};
	}
  oldDiv.replaceWith(newDiv)
  newDiv.setAttribute("id", "dropin-container")
  newDiv.setAttribute("class", "payment p-5")
  initCheckout();
}

/**
 * @function setDynamicCSS - Colour picker that changes button colour
 */
function setDynamicCSS() {
  colorVal = document.getElementById("buttonColorPick").value
  r.style.setProperty("--background-color", colorVal)
  updateStyleCode()
}
/**
 * @function backgroudColor - Changes page background colour
 */
function backgroundColor() {
  let bgVal = document.getElementById("bgColorPick").value
  r.style.setProperty("--bg-color", bgVal)
}
/** @function dropinColor - Changes active payment method colour */
function dropinColor() {
  let dropinColor = document.getElementById("dropinColorPick").value
  r.style.setProperty("--dropin-color", dropinColor)
  updateStyleCode()
}
/** @function dropinTabColor - Changes collapsed payment methods' colours */
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

function restartDropin() {
  const oldDiv = document.getElementById("dropin-container")
  const newDiv = document.createElement("div")
  oldDiv.replaceWith(newDiv)
  newDiv.setAttribute("id", "dropin-container")
  newDiv.setAttribute("class", "payment p-5")
  initCheckout()
  successDiv.style.display = "none"
}

initCheckout()
