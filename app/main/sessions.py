import Adyen
import json
import uuid
from main.config import get_adyen_api_key, get_adyen_merchant_account
from flask import Flask, render_template, send_from_directory, request, redirect, url_for, abort

'''
Create Payment Session by calling /sessions endpoint

Request must provide few mandatory attributes (amount, currency, returnUrl, transaction reference)

Your backend should have a payment state where you can fetch information like amount and shopperReference

Parameters
    ----------
    host_url : string
        URL of the host (i.e. http://localhost:8080): required to define returnUrl parameter
'''

def adyen_sessions(host_url, locale_data):
    
    adyen = Adyen.Adyen()
    adyen.payment.client.xapikey = get_adyen_api_key()
    adyen.payment.client.platform = "test" # change to live for production
    adyen.payment.client.merchant_account = get_adyen_merchant_account()



    request = {}

    request['amount'] = {"value": "4000", "currency": locale_data['currency']}
    request['reference'] = f"Reference {uuid.uuid4()}"  # provide your unique payment reference
    # set redirect URL required for some payment methods
    request['returnUrl'] = f"{host_url}/redirect?shopperOrder=myRef"
    request['countryCode'] = locale_data['countryCode']
    # for Klarna
    request['lineItems'] = [{"quantity": "1", "amountIncludingTax": "2000", "description": "Sunglasses", "id": "Item 1", "taxPercentage": "2100", "productUrl": "https://example.com/item1", "imageUrl": "https://example.com/item1pic"},
    {"quantity": "1","amountIncludingTax": "2000","description": "Headphones","id": "Item 2","taxPercentage": "2100","productUrl": "https://example.com/item2","imageUrl": "https://example.com/item2pic"}]
    request['shopperEmail'] = "customer@email.uk"
    request['shopperReference'] = "UniqueReference"

    # for clearPay
    request['shopperName'] = {"firstName": "Test", "lastName": "Shopper"}
    request['deliveryAddress'] = {"city": "London", "country": "GB", "houseNumberOrName": "56", "postalCode": "EC17 2IH", "street": "Mill Lane"}
    request['billingAddress'] = {"city": "London", "country": "GB", "houseNumberOrName": "56", "postalCode": "EC17 2IH", "street": "Mill Lane"}


  
    result = adyen.checkout.sessions(request)
    print("/sessions request:\n" + str(request))

    formatted_response = json.dumps((json.loads(result.raw_response)))
    print("/sessions response:\n" + formatted_response)

    return formatted_response

