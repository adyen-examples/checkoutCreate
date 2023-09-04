import Adyen
import uuid
import json
from main.config import get_adyen_api_key, get_adyen_merchant_account


'''
perform a call to /payments
'''


def adyen_payments(frontend_request, locale_data, host_url):
    adyen = Adyen.Adyen()
    adyen.payment.client.xapikey = get_adyen_api_key()
    adyen.payment.client.platform = "test" # change to live for production
    adyen.payment.client.merchant_account = get_adyen_merchant_account()

    payment_info = frontend_request.get_json()
    txvariant = payment_info["paymentMethod"]["type"]


    payments_request = {}

    payments_request['amount'] = {"value": "1000", "currency": locale_data['currency']} # choose_currency(txvariant)}
    payments_request['channel'] = "Web"
    payments_request['reference'] = f"Reference {uuid.uuid4()}" 
    payments_request['shopperReference'] = "UniqueReference"
    payments_request['returnUrl'] = f"{host_url}/api/handleShopperRedirect?saveId={locale_data['saveId']}"
    payments_request['countryCode'] = locale_data['countryCode']  
    payments_request['merchantAccount'] = get_adyen_merchant_account()
    payments_request['recurringExpiry'] = "2022-08-01T23:59:59+02:00"
    payments_request['billingAddress'] = {"city": locale_data['city'], "country": locale_data['countryCode'], "houseNumberOrName": locale_data['houseNumberOrName'], "postalCode": locale_data['postalCode'], "street": locale_data['street']}


    payments_request.update(payment_info)


    if 'klarna' in txvariant:
        payments_request['shopperEmail'] = "myEmail@adyen.com"
        payments_request['shopperName'] = {"firstName": "Test", "lastName": "Shopper"}
        payments_request['lineItems'] = [
            {
                "quantity":"1",
                "taxPercentage":"2100",
                "description":"Shoes",
                "id":"Item #1",
                "amountIncludingTax":"400"
            },
            {
                "quantity":"2",
                "taxPercentage":"2100",
                "description":"Socks",
                "id":"Item #2",
                "amountIncludingTax":"300",
                "productUrl": "URL_TO_PURCHASED_ITEM"
            }
        ]

    elif txvariant == 'clearpay':
        payments_request['shopperName'] = {"firstName": "Test", "lastName": "Shopper"}
        payments_request['deliveryAddress'] = {"city": "London", "country": "GB", "houseNumberOrName": "56", "postalCode": "EC17 2IH", "street": "Mill Lane"}
        payments_request['billingAddress'] = {"city": "London", "country": "GB", "houseNumberOrName": "56", "postalCode": "EC17 2IH", "street": "Mill Lane"}
        payments_request['lineItems'] = [
            {
                'quantity': "1",
                'amountExcludingTax': "1950",
                'taxPercentage': "1111",
                'description': "Sunglasses",
                'id': "Item #1",
                'taxAmount': "50",
                'amountIncludingTax': "2000",
                'taxCategory': "High"
            },
            {
                'quantity': "1",
                'amountExcludingTax': "1950",
                'taxPercentage': "1111",
                'description': "Headphones",
                'id': "Item #2",
                'taxAmount': "50",
                'amountIncludingTax': "2000",
                'taxCategory': "High"
            }]
        payments_request['shopperEmail'] = "ana.mota@adyen.com"


    elif txvariant == 'directEbanking' or txvariant == 'giropay':
        payments_request['countryCode'] = "DE"

    elif txvariant == 'dotpay':
        payments_request['countryCode'] = "PL"

    elif txvariant == 'scheme':
        payments_request['additionalData'] = {"allow3DS2": "true"}
        payments_request['origin'] = "http://localhost:8080"

    elif txvariant == 'ach' or txvariant == 'paypal':
        payments_request['countryCode'] = 'US'
        #subtype = "ecommerce"
        payments_request


    sanitizeRequest(payments_request)
    print("/payments request:\n" + str(payments_request))

    payments_response = adyen.checkout.payments(payments_request)
    formatted_response = json.dumps((json.loads(payments_response.raw_response)))

    print("/payments response:\n" + formatted_response)
    return formatted_response


def choose_currency(payment_method):
    if payment_method == "alipay":
        return "CNY"
    elif payment_method == "dotpay":
        return "PLN"
    elif payment_method == "boletobancario":
        return "BRL"
    elif payment_method == "ach" or payment_method == "paypal":
        return "USD"
    else:
        return "EUR"

def currency_locale(country):
    if country == "NL":
        return "EUR"
    elif country == "GB":
        return "GBP"
    elif country == "US":
        return "USD"

def sanitizeRequest(payment_request):
    safe_delete(payment_request, 'locale')
    # safe_delete(payment_request, 'currency')

    safe_delete(payment_request, 'city')
    safe_delete(payment_request, 'currency')
    safe_delete(payment_request, 'houseNumberOrName')
    safe_delete(payment_request, 'postalCode')
    safe_delete(payment_request, 'street')
    safe_delete(payment_request, 'stateOrProvince')
    safe_delete(payment_request, 'saveId')

    # loaded = json.loads(payments_request)
    # for item in loaded:
    #     for key in ["currency", "locale"]:
    #         item.pop(key)
    # payments_request = str(loaded)


    # for d in payments_request:
    #     cleanData = []
    #     cleanDict = {}
    #     for key, value in d.items():
    #         if key != 'locale':
    #             cleanData[key] = value
    
    # with open('cleanData.json', 'r') as payments_request:
    #     cleanData = json.load(payments_request)

    # for element in payments_request:
    #     element.pop('currency', None)
    # with open('cleanData.json', 'w') as payments_request:

def safe_delete(payment_request, key):
    try:
        del payment_request[key]
    except KeyError:
        print('Error while trying to delete key : ' + key)
