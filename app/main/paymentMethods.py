import Adyen
import json
import uuid
from main.config import get_adyen_api_key, get_adyen_merchant_account

'''
Retrieve available payment methods by calling /paymentMethods
Request only needs to include merchantAccount, but you can include more information to get a more refined response
Should have a payment state on your server from which you can fetch information like amount and shopperReference
'''


def adyen_payment_methods(locale_data):
    adyen = Adyen.Adyen()
    adyen.payment.client.xapikey = get_adyen_api_key()
    adyen.payment.client.platform = "test" # change to live for production
    adyen.payment.client.merchant_account = get_adyen_merchant_account()

    payment_methods_request = {}

    payment_methods_request['reference'] = f"Reference {uuid.uuid4()}"  # provide your unique payment reference
    payment_methods_request['countryCode'] = locale_data['countryCode'] 
    payment_methods_request['shopperReference'] = "UniqueReference"
    payment_methods_request['channel'] = "Web"
    payment_methods_request['merchantAccount'] = get_adyen_merchant_account()
    payment_methods_request['blockedPaymentMethods'] = locale_data['blockedPaymentMethods']



    print("/paymentMethods request:\n" + str(payment_methods_request))

    payment_methods_response = adyen.checkout.payment_methods(payment_methods_request)
    formatted_response = json.dumps((json.loads(payment_methods_response.raw_response)))

    print("/paymentMethods response:\n" + formatted_response)
    return formatted_response