import Adyen
import json
from main.config import get_adyen_api_key, get_adyen_merchant_account

'''
perform a call to /payments/details
Passing in the component state.data object as frontend_request, This looks like the following:
    {
        details: {
            "threeds2.fingerprint/challengeResult" : "eyJ0aHJlZURTQ29tcEluZCI6IlkifQ==""
        }
        paymentData : "Ab02b4c0!BQABAgB/3ckQEAf5YOdAT83NDjdf+AR4hmjf1fohm2Q8gSe95qb6hE3+GnxfBaK..."
    }
'''


def get_payment_details(frontend_request):
    adyen = Adyen.Adyen()
    adyen.payment.client.xapikey = get_adyen_api_key()
    adyen.payment.client.platform = "test" # change to live for production
    adyen.payment.client.merchant_account = get_adyen_merchant_account()

    details_request = frontend_request.get_json()

    print("/payments/details request:\n" + str(details_request))

    details_response = adyen.checkout.payments_details(details_request)
    formatted_response = json.loads(details_response.raw_response)

    print("payments/details response:\n" + str(formatted_response))
    return formatted_response
