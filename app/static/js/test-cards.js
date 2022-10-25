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