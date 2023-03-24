const clientKey = JSON.parse(document.getElementById("client-key").innerHTML)
const storedCountry = document.getElementById("country-code")

/**
 * Global configuration variables
 * @param {HTMLHtmlElement} r - Identifies root of document for css variables
 * @param {boolean} openFirst - Status of "Open first payment method" toggle
 * @param {boolean} billAdd - Status of "Add billing address" toggle
 * @param {boolean} onlyStored - Status of "Add card holder name" toggle
 * @param {boolean} holderName - Status of "Show only stored payment methods" toggle
 * @param {boolean} showPayMethod - Status of "Show stored payment methods" toggle
 * @param {boolean} hideCVC - Status of "Hide CVC field" toggle
 * @param {boolean} placeholderData - Status of "Include placeholder data" toggle
 * @param {Array} instantArray - Instant Payment Methods "Enable" toggle - populate array if active = true
 * @param {Array} payMethods - Payment methods included in the array will be "blocked"
 * @param {Array} payArray - Payment methods values to include in the blockedPaymentMethods array
 * @param {string} countrySettings - Value of the currently selected shopper's country
 *
 */
let r = document.querySelector(":root")
let openFirst = true
let billAdd = false
let onlyStored = false
let holderName = false
let showPayMethod = true
let hideCVC = false
let placeholderData = false
let instantArray = [];
let payMethods =[];
let payArray = Object.values(payMethods);
let countrySettings = {
  countryCode: "NL",
  currency: "EUR",
  locale: "en_NL",
  city: "Amsterdam",
  postalCode: "1011DJ",
  street: "Simon Carmiggeltstraat",
  houseNumberOrName: "6 - 50"
};
let saveId = ""
let blockedPM = { blockedPaymentMethods: payArray }
// const query = window.location.search;
// const urlParameter = new URLSearchParams(query);
// let styleId = String(window.location.search.slice(1).split("&")[0].split("=")[1])

// identify checkout div and create new empty div to replace with
const oldDiv = document.getElementById("dropin-container")
const newDiv = document.createElement("div")

// banner functionality
function bannerColor() {
  document.getElementById("banner").style.display = "block"
  let bannerInput = document.getElementById("bannerColorPick").value
  // console.log(bannerInput, "colour input")
  r.style.setProperty("--banner-color", bannerInput)
}


// Toggle config page:
function toggleConfig() {
  const checkPreview = document.querySelector(".preview-basket")
  const configUI = document.querySelector(".config-UI")
  if (checkPreview.style.display === "none") {
    checkPreview.style.display = "block"
    configUI.style.display = "none"
  } else {
    configUI.style.display = "block"
    checkPreview.style.display = "none"
  }
}

// merchantLogoLoad
function loadMerchantLogo(merchantURL) {
  let bannerEl = document.getElementById("banner")
  if (bannerEl.childElementCount === 0) {
    // bannerEl.classList.add("undoHidden")
    document.getElementById("banner").style.display = "block"
    const merchantLogo = document.createElement("img")
    merchantLogo.src = `${merchantURL.trim()}`
    merchantLogo.classList.add("logo")
    bannerEl.appendChild(merchantLogo)
    // console.log("first input")
  } 
  else {
    document.getElementById("banner").style.display = "block"
    const merchantLogo = document.querySelector(".logo")
    merchantLogo.src = `${merchantURL}`
    // console.log("second input")
  }
}

/**
 * Country flag svg image location
 */
const flagUrlMap = {
  NL: {
    src: "https://ca-test.adyen.com/ca/adl/img/flags/nl.svg",
  },
  GB: {
    src: "https://ca-test.adyen.com/ca/adl/img/flags/gb.svg",
  },
  US: {
    src: "https://ca-test.adyen.com/ca/adl/img/flags/us.svg",
  },
  FR: {
    src: "https://ca-test.adyen.com/ca/adl/img/flags/fr.svg",
  },
  DE: {
    src: "https://ca-test.adyen.com/ca/adl/img/flags/de.svg",
  },
  ES: {
    src: "https://ca-test.adyen.com/ca/adl/img/flags/es.svg",
  },
  IT: {
    src: "https://ca-test.adyen.com/ca/adl/img/flags/it.svg",
  },
  SE: {
    src: "https://ca-test.adyen.com/ca/adl/img/flags/se.svg",
  },
  NO: {
    src: "https://ca-test.adyen.com/ca/adl/img/flags/no.svg",
  },
  DK: {
    src: "https://ca-test.adyen.com/ca/adl/img/flags/dk.svg",
  },
  FI: {
    src: "https://ca-test.adyen.com/ca/adl/img/flags/fi.svg",
  },
  PL: {
    src: "https://ca-test.adyen.com/ca/adl/img/flags/pl.svg",
  },
  BE: {
    src: "https://ca-test.adyen.com/ca/adl/img/flags/be.svg",
  },
  PT: {
    src: "https://ca-test.adyen.com/ca/adl/img/flags/pt.svg",
  },
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
  {
    countryCode: "FR",
    currency: "EUR",
    locale: "en_FR",
    city: "Paris",
    postalCode: "75009",
    street: "Boulevard Haussmann",
    houseNumberOrName: "6-8",
  },
  {
    countryCode: "DE",
    currency: "EUR",
    locale: "en_DE",
    city: "Berlin",
    postalCode: "10117",
    street: "Friedrichstrasse 63",
    houseNumberOrName: "17",
  },
  {
    countryCode: "ES",
    currency: "EUR",
    locale: "en_ES",
    city: "Madrid",
    postalCode: "28001",
    street: "Calle Serrano",
    houseNumberOrName: "37",
  },
  {
    countryCode: "IT",
    currency: "EUR",
    locale: "en_IT",
    city: "Milan",
    postalCode: "20124",
    street: "Via Joe Colombo",
    houseNumberOrName: "6",
  },
  {
    countryCode: "SE",
    currency: "SEK",
    locale: "en_SE",
    city: "Stockholm",
    postalCode: "111 22",
    street: "Kungsbron",
    houseNumberOrName: "2",
  },
  {
    countryCode: "NO",
    currency: "NOK",
    locale: "en_NO",
    city: "Oslo",
    postalCode: "0150",
    street: "Kirsten Flagstads Plass",
    houseNumberOrName: "1",
  },
  {
    countryCode: "DK",
    currency: "DKK",
    locale: "en_DK",
    city: "Copenhagen",
    postalCode: "1471",
    street: "Ny Vestergade",
    houseNumberOrName: "10",
  },
  {
    countryCode: "FI",
    currency: "EUR",
    locale: "en_FI",
    city: "Helsinki",
    postalCode: "00170",
    street: "Aleksanterinkatu",
    houseNumberOrName: "16",
  },
  {
    countryCode: "PL",
    currency: "PLN",
    locale: "en_PL",
    city: "Warsaw",
    postalCode: "00-667",
    street: "Koszyki",
    houseNumberOrName: "61",
  },
  {
    countryCode: "BE",
    currency: "EUR",
    locale: "en_BE",
    city: "Brussels",
    postalCode: "1050",
    street: "Avenue Arnaud Fraiteur",
    houseNumberOrName: "15-23",
  },
  {
    countryCode: "PT",
    currency: "EUR",
    locale: "en_PT",
    city: "Lisbon",
    postalCode: "1200-479",
    street: "Av. 24 de Julho",
    houseNumberOrName: "49",
  },
]

/**
 * @param {Array} PMnames - maps txvariant to display name of Payment Method
 */
const PMnames = [
  { tx: "ach", txname: "ACH US Direct Debit" },
  { tx: "affirm", txname: "Affirm" },
  { tx: "afterpaytouch", txname: "Afterpay" },
  { tx: "alipay", txname: "Alipay" },
  { tx: "amazonpay", txname: "Amazon Pay" },
  { tx: "blik", txname: "Blik" },
  { tx: "boleto", txname: "Boleto" },
  { tx: "clearpay", txname: "Clearpay" },
  { tx: "directdebit_GB", txname: "Bacs Direct Debit" },
  { tx: "directEbanking", txname: "Sofort" },
  { tx: "facilypay", txname: "3x4xOney" },
  { tx: "giropay", txname: "Giropay" },
  { tx: "ideal", txname: "iDeal" },
  { tx: "interac", txname: "Interac" },
  { tx: "kakaopay", txname: "KakaoPay" },
  { tx: "kcp_banktransfer", txname: "Korean Bank Transfer" },
  { tx: "kcp_payco", txname: "PayCo" },
  { tx: "klarna", txname: "Klarna Pay Later" },
  { tx: "klarna_account", txname: "Klarna Pay Over Time" },
  { tx: "klarna_paynow", txname: "Klarna Pay Now" },
  { tx: "mbway", txname: "MB WAY" },
  { tx: "mobilepay", txname: "Mobile Pay" },
  { tx: "neteller", txname: "Neteller" },
  { tx: "nordea", txname: "Nordea" },
  { tx: "paymaya_connect", txname: "PayMaya Connect" },
  { tx: "paymaya_wallet", txname: "PayMaya Wallet" },
  { tx: "paypal", txname: "PayPal" },
  { tx: "paysafecard", txname: "PaySafeCard" },
  { tx: "paybybank", txname: "Open Banking"},
  { tx: "googlepay", txname: "Google Pay" },
  { tx: "paywithgoogle", txname: "Google Pay" },
  { tx: "samsungpay", txname: "Samsung Pay" },
  { tx: "sepadirectdebit", txname: "SEPA Direct Debit" },
  { tx: "trustly", txname: "Trustly" },
  { tx: "vipps", txname: "Vipps" },
  { tx: "wechatpay", txname: "WeChat Pay" },
  { tx: "wechatpayQR", txname: "WeChatPay QR" },
  { tx: "wechatpayWeb", txname: "WeChatPay Web" },
  { tx: "zip", txname: "Zip" },
]

//Paypal style variables
let palColor = "gold"
let palShape = "rect"
let palLabel = "paypal"

async function onLoad() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if (urlParams.has('saveId')) {
    let saveId = urlParams.get('saveId')
    const getConfigResponse = await callServer(
      "/loadConfig",
      saveId
    )
    if (getConfigResponse.error != "no user"){
      countrySettings = getConfigResponse.countrySettings
    }
    else {
      countrySettings = countrySettings
    }
  }
  await getToggles();
  await fromDatabase();
  initCheckout()
}

async function fromDatabase(){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if (urlParams.has('saveId')) {
    let saveId = urlParams.get('saveId')
    const getStyleResponse = await callServer(
      "/loadStyles",
      saveId
    );
    // console.log(getStyleResponse);
    if (getStyleResponse.error != 'no user'){
      loadStyle(getStyleResponse)
    }
    const getConfigResponse = await callServer(
      "/loadConfig",
      saveId
    )
    if (getConfigResponse.error != 'no user'){
      loadConfig(getConfigResponse)
    }
  }
}

// Function to add mutiple attributes to a div
function setAttributes(el, options) {
  Object.keys(options).forEach(function (attr) {
    el.setAttribute(attr, options[attr])
  })
}


// Load saved style based on the data from db
function loadStyle(styleData) {
  for (const [key, value] of Object.entries(styleData)) {
    r.style.setProperty(key, value);
  }
  if (styleData.merchantUrl){
    let merchantURL = styleData.merchantUrl
    loadMerchantLogo(merchantURL)
  }
    updateColorPickers()
  }


/**
 * @function createToggles - creates toggles to enable/disable payment methods according to /paymentMethods response
 * @param {string} tx - txvariant
 * @param {string} PMname - Payment Method name
 */
async function createToggles(tx, PMname) {
  // create first column div and set attributes
  let column = document.createElement("div")
  setAttributes(column, {
    id: `${tx}Col`,
    class: "col-6",
  })
  // create second column div and set attributes
  let boxPM = document.createElement("div")
  setAttributes(boxPM, {
    id: `${tx}Box`,
    class: "col-3",
  })
  // print Payment Method title
  let titlePM = document.createElement("p")
  titlePM.setAttribute("class", "textFonts text-left ml-3")
  let textPM = document.createTextNode(PMname[0].txname)
  // put text inside <p>
  titlePM.appendChild(textPM)
  // put <p> inside <div>
  boxPM.appendChild(titlePM)
  // create toggle div and set attributes
  let toggleDiv = document.createElement("div")
  setAttributes(toggleDiv, {
    id: `${tx}Toggle`,
    class: "col-3",
  })
  // create switch
  let toggleSwitch = document.createElement("div")
  toggleSwitch.setAttribute("class", "custom-control custom-switch text-center")
  toggleSwitch.setAttribute("id", `${tx}Switch`)
  // create toggle input
  let toggleInput = document.createElement("input")
  setAttributes(toggleInput, {
    class: "custom-control-input",
    type: "checkbox",
    "data-toggle": "toggle",
    id: `show${PMname[0].tx}`,
    onchange: "blockPM(this)",
    checked: true,
  })
  // create label
  let toggleLabel = document.createElement("label")
  setAttributes(toggleLabel, {
    class: "custom-control-label",
    for: `show${PMname[0].tx}`,
  })
  // put switch <div> inside the toggle <div>
  toggleDiv.appendChild(toggleSwitch)
  // put <input> and <label> inside <div>
  toggleSwitch.appendChild(toggleInput)
  toggleSwitch.appendChild(toggleLabel)
  // put all created divs inside parent div
  parentPM.appendChild(column)
  parentPM.appendChild(boxPM)
  parentPM.appendChild(toggleDiv)
}

/**
 * @function getToggles - updates toggles for enable/disable payment methods
 * @param {HTMLHtmlElement} parentPM - parent div for payment methods section
 * @param {Array} children - all children under parentPM
 * @param {Array} ids - IDs of children
 */
async function getToggles() {
  const parentPM = document.getElementById("parentPM")
  const children = Array.from(parentPM.children)
  // get IDs of children divs
  const ids = children.map((element) => {
    return element.id
  })
  // loop through div IDs for toggles existing on the page and remove all but Card
  const filteredIds = ids.filter(
    (s) =>
      !s.match("schemeTitle") &&
      !s.match("schemeCol") &&
      !s.match("schemeBox") &&
      !s.match("schemeToggle")
  )
  filteredIds.forEach(function (item) {
    let divId = document.getElementById(item)
    divId.remove()
  })
  // call /paymentMethods with no filter to get txvariants for that country
  let txvariants = await getCountryPM()
  // loop through each value of response array - but do not count scheme/cards
  txvariants
    .filter(function (tx) {
      return tx != "scheme"
    })
    .forEach((tx) => {
      let PMname = PMnames.filter((obj) => {
        return obj.tx === tx
      })
      createToggles(tx, PMname)
    })
}

/**
 * Country dropdown changes the flag image and reloads the dropin with new country values
 * Calls /paymentMethods to retrieve available txvariants for that country
 * @param {*} el
 */
async function changeSelect(el) {
  // console.log(blockedPM)
  payArray = []
  blockedPM = { blockedPaymentMethods: payArray }
  // console.log(blockedPM)
  // console.log(el.value)
  // console.log(Object.values)
  // console.log(document.getElementById("flag_img").src)
  document.getElementById("flag_img").src = flagUrlMap[el.value].src
  const country = el.value
  // console.log(country)
  countrySettings = getCountryData(country)
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
    initCheckout()
  } else if (document.getElementById("dropin-container")) {
    const oldDiv = document.getElementById("dropin-container")
    const newDiv = document.createElement("div")
    oldDiv.replaceWith(newDiv)
    newDiv.setAttribute("id", "dropin-container")
    newDiv.setAttribute("class", "payment p-5")
    initCheckout()
  }
  getToggles()
}

/**
 * Funtion to toggle first payment method open
 */
document
  .getElementById("openFirst")
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
    initCheckout()
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
      onlyStored = true
    } else {
      onlyStored = false
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
    if (this.querySelector("input").checked == false) {
      showPayMethod = true
    } else {
      showPayMethod = false
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
    if (this.querySelector("input").checked == true) {
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

function getCountryData(countrySettings) {
  return countryVariables.find(
    (locality) => locality.countryCode === countrySettings
  )
}

/**
 * setting the array of blockedPaymentMethods
 */


async function getCountryPM() {
  let noBlock = { blockedPaymentMethods: [] }
  const mergeData = {
    ...countrySettings,
    ...noBlock,
  }
  const unblockedResponse = await callServer(
    "/api/getPaymentMethods",
    mergeData
  )
  let payMethodArray = unblockedResponse.paymentMethods
  // console.log(payMethodArray)
  let txvariants = payMethodArray.map(({ type }) => type)
  return await txvariants
}

async function paymentMethods() {
  const mergeData = {
    ...countrySettings,
    ...blockedPM,
  }
  const paymentMethodsResponse = await callServer(
    "/api/getPaymentMethods",
    mergeData
  )
  // console.log(paymentMethodsResponse)
  return await paymentMethodsResponse
}

async function getConfiguration() {
  const paymentMethodsResponse = await paymentMethods()
  let prettyResponse = JSON.stringify(paymentMethodsResponse, null, 2)
  console.log(prettyResponse)
  let configuration = {
    paymentMethodsResponse: paymentMethodsResponse,
    clientKey,
    locale: countrySettings.locale,
    countryCode: countrySettings.countryCode,
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
        style: {
          label: palLabel,
          color: palColor,
          shape: palShape,
        },
        environment: "test", // Change this to "live" when you're ready to accept live PayPal payments
        countryCode: countrySettings.countryCode || "NL", // Only needed for test. This will be automatically retrieved when you are in production.
        showPayButton: true,
        merchantId: "AD74FQNVXQY5E",
      },
      applepay: {
        amount: {
          currency: countrySettings.currency || "EUR",
          value: 4000,
        },
        countryCode: countrySettings.countryCode || "NL",
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
  }
  // console.log(configuration)
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
        instantPaymentTypes: instantArray,
      })
      .mount("#dropin-container")
    return await checkout
  } catch (error) {
    console.error(error)
    alert("Error occurred. Look at console for details")
  }
}

function showInstantPay() {
  const instantPayState = document.getElementById("instantPay").checked
  const oldDiv = document.getElementById("dropin-container")
  const newDiv = document.createElement("div")
  if (instantPayState == true) {
    instantArray = ["paywithgoogle"]
  } else {
    instantArray = []
  }
  oldDiv.replaceWith(newDiv)
  newDiv.setAttribute("id", "dropin-container")
  newDiv.setAttribute("class", "payment p-5")
  initCheckout()
}

async function unmountDropin() {
  const checkout = await initCheckout()
  checkout.unmount("#dropin-container")
}

async function unmountContainer() {
  try {
    const checkout = await AdyenCheckout()
    checkout.unmount("#dropin-container")
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
  let styleVal = String(window.location.search.slice(1).split("&")[0].split("=")[1])
  let styleId = {
    saveId: styleVal
  }
  // console.log(styleId)
  // console.log(countrySettings)
  try {
    //keeping the country data for the /payments call
    const mergedData = {
      ...state.data,
      ...countrySettings,
      ...styleId,
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
  const CardState = document.getElementById("showCard").checked
  const oldDiv = document.getElementById("dropin-container")
  const newDiv = document.createElement("div")
  if (CardState == true) {
    const filteredPM = payMethods.filter(
      (s) => !s.match("visa") && !s.match("mc") && !s.match("amex")
    )
    payMethods = filteredPM
    payArray = Object.values(payMethods)
    blockedPM = { blockedPaymentMethods: payArray }
  } else {
    payMethods.push("visa")
    payMethods.push("mc")
    payMethods.push("amex")
    payArray = Object.values(payMethods)
    blockedPM = { blockedPaymentMethods: payArray }
  }
  oldDiv.replaceWith(newDiv)
  newDiv.setAttribute("id", "dropin-container")
  newDiv.setAttribute("class", "payment p-5")
  initCheckout()
}
// ------- All other payment methods ---------
/**
 * @function blockPM - adds/removes the txvariant of the toggle to blockPaymentMethods array
 */
function blockPM(element) {
  // const pmState = document.getElementById(`show${PMname[0].txname}`).checked;
  const oldDiv = document.getElementById("dropin-container")
  const newDiv = document.createElement("div")
  let thisParentPM = element.parentNode
  // console.log(thisParentPM.id)
  let thisPM = thisParentPM.querySelector("input")
  const pmState = thisPM.checked
  // console.log(pmState)
  let currentTXid = thisParentPM.id
  let currentTX = currentTXid.replace("Switch", "")
  if (pmState == true) {
    const filteredPM = payMethods.filter((s) => !s.match(currentTX))
    payMethods = filteredPM
    payArray = Object.values(payMethods)
    blockedPM = { blockedPaymentMethods: payArray }
  } else {
    payMethods.push(currentTX)
    payArray = Object.values(payMethods)
    blockedPM = { blockedPaymentMethods: payArray }
  }
  oldDiv.replaceWith(newDiv)
  newDiv.setAttribute("id", "dropin-container")
  newDiv.setAttribute("class", "payment p-5")
  initCheckout()
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
/**
 * @function collapsedBorderColor - Changes collapsed payment method border colour
 */
function collapsedBorderColor() {
  let collapsedBorderColor = document.getElementById(
    "collapsedBorderColorPick"
  ).value
  r.style.setProperty("--collapsedBorder-color", collapsedBorderColor)
  updateStyleCode()
}
/**
 * @function activeBorderColor - Changes active payment method border colour
 */
function activeBorderColor() {
  let activeBorderColor = document.getElementById("activeBorderColorPick").value
  r.style.setProperty("--selectedBorder-color", activeBorderColor)
  updateStyleCode()
}
/**
 * @function inputBorderColor - Changes input field border colour
 */
function inputBorderColor() {
  let inputBorderColor = document.getElementById("inputBorderColorPick").value
  r.style.setProperty("--inputBorder-color", inputBorderColor)
  updateStyleCode()
}
/**
 * @function updateColorPickers - Gets current colour value to show on colour pickers
 */
function updateColorPickers() {
  // font color
  let fontColorInput = document.getElementById("textColorPick")
  let fontColor = getComputedStyle(r).getPropertyValue("--text-color")
  let fontColorNoSpace = fontColor.replace(/\s/g, "")
  // let buttonTextColor = getComputedStyle(r).getPropertyValue("--main-text")
  fontColorInput.value = fontColorNoSpace
  // website background
  let bgColorInput = document.getElementById("bgColorPick")
  let bgColor = getComputedStyle(r).getPropertyValue("--bg-color")
  let bgColorNoSpace = bgColor.replace(/\s/g, "")
  bgColorInput.value = bgColorNoSpace
  // active payment method background
  let activeColorInput = document.getElementById("dropinColorPick")
  let activeColor = getComputedStyle(r).getPropertyValue("--dropin-color")
  let activeColorNoSpace = activeColor.replace(/\s/g, "")
  activeColorInput.value = activeColorNoSpace
  // collapsed payment methods
  let tabColorInput = document.getElementById("dropinTabColorPick")
  let tabColor = getComputedStyle(r).getPropertyValue("--dropin-tab-color")
  let tabColorNoSpace = tabColor.replace(/\s/g, "")
  tabColorInput.value = tabColorNoSpace
  // pay button
  let buttonColorInput = document.getElementById("buttonColorPick")
  let buttonColor = getComputedStyle(r).getPropertyValue("--background-color")
  let buttonColorNoSpace = buttonColor.replace(/\s/g, "")
  buttonColorInput.value = buttonColorNoSpace
  //
  // pay button text colour
  let buttonTextColorInput = document.getElementById("payTextColorPick")
  let buttonTextColor = getComputedStyle(r).getPropertyValue("--payText-color")
  let buttonTextColorNoSpace = buttonTextColor.replace(/\s/g, "")
  buttonTextColorInput.value = buttonTextColorNoSpace
  //
  // active checkout border
  let activeBorderColorInput = document.getElementById("activeBorderColorPick")
  let activeBorderColor = getComputedStyle(r).getPropertyValue(
    "--selectedBorder-color"
  )
  let activeBorderColorNoSpace = activeBorderColor.replace(/\s/g, "")
  activeBorderColorInput.value = activeBorderColorNoSpace
  //
  // collapsed checkout border
  let collapsedBorderColorInput = document.getElementById(
    "collapsedBorderColorPick"
  )
  let collapsedBorderColor = getComputedStyle(r).getPropertyValue(
    "--collapsedBorder-color"
  )
  let collapsedBorderColorNoSpace = collapsedBorderColor.replace(/\s/g, "")
  collapsedBorderColorInput.value = collapsedBorderColorNoSpace
  //
    // input field border
    let inputBorderColorInput = document.getElementById(
      "inputBorderColorPick"
    )
    let inputBorderColor = getComputedStyle(r).getPropertyValue(
      "--inputBorder-color"
    )
    let inputBorderColorNoSpace = inputBorderColor.replace(/\s/g, "")
    inputBorderColorInput.value = inputBorderColorNoSpace
    //
  let bannerInput = document.getElementById("bannerColorPick")
  let bannerColor = getComputedStyle(r).getPropertyValue("--banner-color")
  let bannerColorNoSpace = bannerColor.replace(/\s/g, "")
  bannerInput.value = bannerColorNoSpace
}
// console.log(tabColorNoSpace.constructor)
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

// change pay button text colour
function payTextColor() {
  let payTextColor = document.getElementById("payTextColorPick").value
  r.style.setProperty("--payText-color", payTextColor)
  updateStyleCode()
}

// change pay buttons' edges (staright to round)
function buttonEdges() {
  let edgeValue = document.getElementById("buttonEdges").value
  let pixelVal = edgeValue + "px"
  r.style.setProperty("--button-edges", pixelVal)
  updateStyleCode()
}
/**
 * @function activeBorderWidth - Changes active payment method border width
 */
function activeBorderWidth() {
  let activeBorderWidth = document.getElementById("activeBorderSize").value
  let borderPixelVal = activeBorderWidth + "px"
  r.style.setProperty("--selectedBorder-width", borderPixelVal)
  updateStyleCode()
}
/**
 * @function collapsedBorderWidth - Changes collapsed payment method border width
 */
function collapsedBorderWidth() {
  let collapsedBorderWidth = document.getElementById("collapsedBorderSize").value
  let collapsedBorderPixelVal = collapsedBorderWidth + "px"
  r.style.setProperty("--collapsedBorder-width", collapsedBorderPixelVal)
  updateStyleCode()
}
/**
 * @function inputBorderWidth - Changes input field border width
 */
function inputBorderWidth() {
  let inputBorderWidth = document.getElementById("inputBorderSize").value
  let borderPixelVal = `0 0 0 ${inputBorderWidth}px`
  r.style.setProperty("--inputBorder-width", borderPixelVal)
  updateStyleCode()
}
/**
 * @function logoSize - Changes input field border width
 */
function logoSize() {
  let logoSize = document.getElementById("logoSize").value
  let logoSizeVal = logoSize + "px"
  r.style.setProperty("--logo-width", logoSizeVal)
  updateStyleCode()
}
/**
 * @function logoSize - Changes input field border width
 */
function logoVerticalPosition() {
  let logoVerPosition = document.getElementById("logoVerticalPosition").value
  let logoVerPosVal = logoVerPosition + "px"
  r.style.setProperty("--logo-verPosition", logoVerPosVal)
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

  // Function to remove borders
document
.getElementById("bannerBorder")
.parentNode.addEventListener("click", function (event) {
  if (this.querySelector("input").checked) {
    r.style.setProperty("--banner-border", "2px solid rgba(45, 45, 45, 0.1)")
    updateStyleCode()
  } else {
    r.style.setProperty("--banner-border", null)
    updateStyleCode()
  }
})

// change dropin container width
function dropinWidth() {
  let widthValue = document.getElementById("changeWidth").value
  let widthpx = widthValue + "px"
  r.style.setProperty("--dropin-width", widthpx)
  // console.log(widthpx)
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
    r.style.setProperty("--align-selected", null)
    updateStyleCode()
  } else {
    document.getElementById("makeItalic").classList.add("italic-active")
    r.style.setProperty("--text-italic", "italic")
    r.style.setProperty("--align-selected", "#00112c")
    updateStyleCode()
  }
}

// make text bold
function makeBold() {
  if (document.getElementById("makeBold").classList.contains("bold-active")) {
    document.getElementById("makeBold").classList.remove("bold-active")
    r.style.setProperty("--text-bold", null)
    r.style.setProperty("--align-selected", null)
    updateStyleCode()
  } else {
    document.getElementById("makeBold").classList.add("bold-active")
    r.style.setProperty("--text-bold", "bold")
    r.style.setProperty("--align-selected", "#00112c")
    updateStyleCode()
  }
}

//align the drop in text
function alignText(element) {
  let alignCheck = element.classList.contains("align-active")
  let alignValue = element.id
  if (alignCheck == true) {
    element.classList.remove("align-active")
    r.style.setProperty("--text-align", null)
    r.style.setProperty("--align-selected", null)
  } else {
    element.classList.add("align-active")
    r.style.setProperty("--text-align", alignValue)
    r.style.setProperty("--align-selected", "#00112c")
  }
}

//drop down selector for input field shape 
function changeInputField() {
  r.style.setProperty("--inputBorder-radius", null)
  let InputValue = document.getElementById("input_shape_select").value
  r.style.setProperty("--inputBorder-radius", InputValue)
  updateStyleCode()
}

//drop down selector for the different font styles
function changeFont() {
  r.style.setProperty("--font-options", null)
  let fontValue = document.getElementById("font_select").value
  r.style.setProperty("--font-options", fontValue)
  updateStyleCode()
}

//PayPal button Style
function changePayPal(palValue) {
  // console.log(palValue)
  const oldDiv = document.getElementById("dropin-container")
  const newDiv = document.createElement("div")
  if (palValue.id == "paypal_color_select") {
    palColor = palValue.value
    // console.log(palColor)
  } else if (palValue.id == "paypal_shape_select") {
    palShape = palValue.value
    // console.log(palShape)
  } else {
    palLabel = palValue.value
    // console.log(palLabel)
  }
  oldDiv.replaceWith(newDiv)
  newDiv.setAttribute("id", "dropin-container")
  newDiv.setAttribute("class", "payment p-5")
  initCheckout()
}

// Reset CSS values to default Drop-in
function resetDynamicCSS() {
    r.style.setProperty("--background-color", '#00112c')
    r.style.setProperty("--dropin-width", null)
    r.style.setProperty("--body-edges", null)
    r.style.setProperty("--selectedBody-edges", null)
    r.style.setProperty("--topedges-left", null)
    r.style.setProperty("--topedges-right", null)
    r.style.setProperty("--bottomedges-left", null)
    r.style.setProperty("--bottomedges-right", null)
    r.style.setProperty("--button-edges", null)
    r.style.setProperty("--bg-color", '#ffffff')
    r.style.setProperty("--dropin-color", '#f7f8f9')
    r.style.setProperty("--dropin-tab-color", '#ffffff')
    r.style.setProperty("--dropin-font", null)
    r.style.setProperty("--text-color", null)
    r.style.setProperty("--text-bold", null)
    r.style.setProperty("--text-italic", null)
    r.style.setProperty("--text-align", null)
    r.style.setProperty("--payButton-width", null)
    r.style.setProperty("--payments-spacing", null)
    r.style.setProperty("--paymentselected-margin", null)
    r.style.setProperty("--font-options", null)
    r.style.setProperty("--bold-selected", null)
    r.style.setProperty("--italic-selected", null)
    r.style.setProperty("--secondary-text", "#ffffff")
    r.style.setProperty("--payText-color", null)
    r.style.setProperty("--selectedBorder-color", null)
    r.style.setProperty("--selectedBorder-width", null)
    r.style.setProperty("--collapsedBorder-color", null)
    r.style.setProperty("--border-off", null)
    r.style.setProperty("--banner-color", null)
    r.style.setProperty("--inputBorder-color", null)
    r.style.setProperty("--inputBorder-width", null)
    r.style.setProperty("--inputBorder-radius", null)
    r.style.setProperty("--logo-width", null)
    r.style.setProperty("--collapsedBorder-width", null)
    r.style.setProperty("--logo-verPosition", null)
    r.style.setProperty("--banner-border", null)
    document.getElementById("banner").style.display = "none"
    document.getElementById("merchantLogoUrl").value = null
    document.querySelector('.logo').src = ''
    updateColorPickers()
  }

// Load saved style based on the data from db
function loadStyle(styleData) {
  for (const [key, value] of Object.entries(styleData)) {
    r.style.setProperty(key, value);
  }
  if (styleData.merchantUrl){
    let merchantURL = styleData.merchantUrl
    loadMerchantLogo(merchantURL)
  }
    updateColorPickers()
  }

// Load config based on the data from db
function loadConfig(configData) {
  filteredData = Object.fromEntries(Object.entries(configData).filter(([key]) => !key.match('showPayMethod') && !key.match('placeHolderData') && !key.match('payArray') && !key.match('payMethods')))
  for (const [key, value] of Object.entries(filteredData)) {
    // console.log(key, value)
    if (value == true){
      document.getElementById(key).checked = true
    }
  }
  openFirst = configData.openFirst
  billAdd = configData.billAdd
  onlyStored = configData.onlyStored
  holderName = configData.holderName 
  showPayMethod = configData.showPayMethod
  if (showPayMethod == true){
    document.getElementById("showPayMethod").checked = false
  }
  else{
    document.getElementById("showPayMethod").checked = true
  }
  hideCVC = configData.hideCVC
  placeholderData = configData.placeholderData
  if (placeholderData == false){
    document.getElementById("placeholderData").checked = false
  }
  else {
    document.getElementById("placeholderData").checked = true
  }
  instantArray = configData.instantArray
  if (instantArray.length < 1){
    document.getElementById("instantPay").checked = false
  }
  else {
    document.getElementById("instantPay").checked = true
  }
  payMethods = configData.payMethods
  // console.log(payMethods)
  payArray = configData.payArray
  // console.log(payArray)
  blockedPM = { blockedPaymentMethods: payArray }
  payArray.forEach((tx) => {
    // console.log(tx)
    document.getElementById(`show${tx}`).checked = false
    // console.log(offToggle)
    // const parentPM = document.getElementById("parentPM")
    // const children = Array.from(parentPM.children)
    // // get IDs of children divs
    // const ids = children.map((element) => {
    //   console.log(element.id)
    // })
  })
  countrySettings = configData.countrySettings
  savedCountry = countrySettings.countryCode
  let countryDropdown = document.getElementById("country_select")
  countryDropdown.value = savedCountry
  document.getElementById("flag_img").src = flagUrlMap[savedCountry].src
  // initCheckout()
}


// logging configuration object to UI
function logConfig(cloneConfig) {
  // console.log(cloneConfig)
  // let filteredConfig = loggedConfig

  delete cloneConfig.paymentMethodsResponse
  cloneConfig.clientKey = "***"
  cloneConfig.paymentMethodsConfiguration.paypal.merchantId = "***"

  let finalConfig = { configuration: cloneConfig }
  let stringConfig = JSON.stringify(finalConfig, null, 2)

  // console.log(stringConfig)

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

async function saveStyle() {
  styleData = {
  "--background-color": getComputedStyle(r).getPropertyValue("--background-color"),
  "--dropin-width": getComputedStyle(r).getPropertyValue("--dropin-width"),
  "--body-edges": getComputedStyle(r).getPropertyValue("--body-edges"),
  "--selectedBody-edges": getComputedStyle(r).getPropertyValue("--selectedBody-edges"),
  "--topedges-left": getComputedStyle(r).getPropertyValue("--topedges-left"),
  "--topedges-right": getComputedStyle(r).getPropertyValue("--topedges-right"),
  "--bottomedges-left": getComputedStyle(r).getPropertyValue("--bottomedges-left"),
  "--bottomedges-right": getComputedStyle(r).getPropertyValue("--bottomedges-right"),
  "--button-edges": getComputedStyle(r).getPropertyValue("--button-edges"),
  "--bg-color": getComputedStyle(r).getPropertyValue("--bg-color"),
  "--dropin-color": getComputedStyle(r).getPropertyValue("--dropin-color"),
  "--dropin-tab-color": getComputedStyle(r).getPropertyValue("--dropin-tab-color"),
  "--dropin-font": getComputedStyle(r).getPropertyValue("--dropin-font"),
  "--text-color": getComputedStyle(r).getPropertyValue("--text-color"),
  "--text-bold": getComputedStyle(r).getPropertyValue("--text-bold"),
  "--text-italic": getComputedStyle(r).getPropertyValue("--text-italic"),
  "--text-align": getComputedStyle(r).getPropertyValue("--text-align"),
  "--payButton-width": getComputedStyle(r).getPropertyValue("--payButton-width"),
  "--payments-spacing": getComputedStyle(r).getPropertyValue("--payments-spacing"),
  "--paymentselected-margin": getComputedStyle(r).getPropertyValue("--paymentselected-margin"),
  "--font-options": getComputedStyle(r).getPropertyValue("--font-options"),
  "--bold-selected": getComputedStyle(r).getPropertyValue("--bold-selected"),
  "--italic-selected": getComputedStyle(r).getPropertyValue("--italic-selected"),
  "--secondary-text": getComputedStyle(r).getPropertyValue("--secondary-text"),
  "--payText-color": getComputedStyle(r).getPropertyValue("--payText-color"),
  "--selectedBorder-color": getComputedStyle(r).getPropertyValue("--selectedBorder-color"),
  "--selectedBorder-width": getComputedStyle(r).getPropertyValue("--selectedBorder-width"),
  "--border-off": getComputedStyle(r).getPropertyValue("--border-off"),
  "--banner-color": getComputedStyle(r).getPropertyValue("--banner-color"),
  "--inputBorder-color": getComputedStyle(r).getPropertyValue("--inputBorder-color"),
  "--inputBorder-width": getComputedStyle(r).getPropertyValue("--inputBorder-width"),
  "--inputBorder-radius": getComputedStyle(r).getPropertyValue("--inputBorder-radius"),
  "--logo-width":getComputedStyle(r).getPropertyValue("--logo-width"),
  "--logo-verPosition":getComputedStyle(r).getPropertyValue("--logo-verPosition"),
  "--collapsedBorder-width":getComputedStyle(r).getPropertyValue("--collapsedBorder-width"),
  "--collapsedBorder-color":getComputedStyle(r).getPropertyValue("--collapsedBorder-color"),
  "--banner-border":getComputedStyle(r).getPropertyValue("--banner-border"),
  "merchantUrl": document.querySelector("#merchantLogoUrl").value
  }
  configData = {
    "openFirst": openFirst,
    "billAdd": billAdd,
    "onlyStored": onlyStored,
    "holderName": holderName ,
    "showPayMethod": showPayMethod,
    "hideCVC": hideCVC,
    "placeholderData": placeholderData,
    "instantArray": instantArray,
    "payMethods": payMethods,
    "payArray": payArray,
    "countrySettings": countrySettings,
  }
  // console.log(configData)

  const saveStyleResponse = await callServer(
    "/saveStyle",
    styleData
  )
  saveId = saveStyleResponse.saveId
  const saveConfigResponse = await callServer(
    `/saveConfig/${saveId}`,
    configData
  )
  configResponse = saveConfigResponse
  baseUrl = window.location.host;
  printUrl = `${baseUrl}/load?saveId=${saveId}`
  // console.log(`${baseUrl}/load?saveId=${saveId}`)
  // const para = document.createElement("p");
  // const node = document.createTextNode(printUrl);
  // para.appendChild(node);
  // const element = document.getElementById("myInput");
  // element.appendChild(para);
  document.getElementById("myInput").value = printUrl
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
      "border-color": getComputedStyle(r).getPropertyValue("--collapsedBorder-color")
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
      "border-color": getComputedStyle(r).getPropertyValue("--selectedBorder-color"),
      "border-width": getComputedStyle(r).getPropertyValue("--selectedBorder-width")
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
    },
    ".adyen-checkout__input": {
      "box-shadow": getComputedStyle(r).getPropertyValue("--inputBorder-width"),
      "color": getComputedStyle(r).getPropertyValue("--inputBorder-color"),
      "border-radius": getComputedStyle(r).getPropertyValue("--inputBorder-radius")
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

updateColorPickers()

onLoad()

