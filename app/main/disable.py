import Adyen
import json
from main.config import get_adyen_api_key, get_adyen_merchant_account

'''
perform a call to /disable to delete stored payment method
'''


def disable_card(storedPaymentMethodId):
    adyen = Adyen.Adyen()
    adyen.payment.client.xapikey = get_adyen_api_key()
    adyen.payment.client.platform = "test" # change to live for production
    adyen.payment.client.service = "Recurring"
    adyen.payment.client.merchant_account = get_adyen_merchant_account()

    disable_request = {}

    disable_request['shopperReference'] = "UniqueReference"
    disable_request['recurringDetailReference'] =  f"{storedPaymentMethodId}"
    disable_request['merchantAccount'] = "AnaTestMER"
    print("/disable request:\n" + str(disable_request))

    disable_response = adyen.recurring.disable(disable_request)
    formatted_response = json.loads(disable_response.raw_response)

    print("disable response:\n" + str(formatted_response))
    return formatted_response
