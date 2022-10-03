import logging

from Adyen.util import is_valid_hmac_notification
from flask import Flask, render_template, send_from_directory, request, redirect, url_for, abort

from main.sessions import adyen_sessions
from main.paymentMethods import adyen_payment_methods
from main.payments import adyen_payments
from main.redirect import handle_shopper_redirect
from main.additional_details import get_payment_details
from main.disable import disable_card
from main.config import *


def create_app():
    logging.basicConfig(format='%(asctime)s - %(levelname)s - %(message)s', level=logging.INFO)
    logging.getLogger('werkzeug').setLevel(logging.ERROR)

    app = Flask('app')

    # Register 404 handler
    app.register_error_handler(404, page_not_found)

    # Routes:
    @app.route('/')
    def home():
        return render_template('home.html')

    @app.route('/cart/<integration>')
    def cart(integration):
        return render_template('cart.html', method=integration)

    @app.route('/checkout')
    def checkout():
        return render_template('component.html', client_key=get_adyen_client_key())

    @app.route('/api/getPaymentMethods', methods=['GET', 'POST'])
    def get_payment_methods():
        request_data = request.get_json()
        # print (request_data)
        locale_data = request_data
        return adyen_payment_methods(locale_data)


    @app.route('/api/initiatePayment', methods=['POST'])
    def initiate_payment():
        request_data = request.get_json()
        # print (request_data)
        locale_data = request_data
        return adyen_payments(request, locale_data)

    @app.route('/api/submitAdditionalDetails', methods=['POST'])
    def payment_details():
        return get_payment_details(request)

    @app.route('/api/disable', methods=['POST'])
    def disable():
        storedPaymentMethodId = request.get_json()['storedPaymentMethodId']
        return disable_card(storedPaymentMethodId)

    @app.route('/api/handleShopperRedirect', methods=['POST', 'GET'])
    def handle_redirect():
        values = request.values.to_dict()  # Get values from query params in request object
        details_request = {}

        if "payload" in values:
            details_request["details"] = {"payload": values["payload"]}
        elif "redirectResult" in values:
            details_request["details"] = {"redirectResult": values["redirectResult"]}

        redirect_response = handle_shopper_redirect(details_request)

        # Redirect shopper to landing page depending on payment success/failure
        if redirect_response["resultCode"] == 'Authorised':
            print ('I reach here')
            return redirect(url_for('checkout_success'))
        elif redirect_response["resultCode"] == 'Received' or redirect_response["resultCode"] == 'Pending':
            return redirect(url_for('checkout_pending'))
        else:
            return redirect(url_for('checkout_failure'))

    @app.route('/api/sessions', methods=['POST'])
    def sessions():
        host_url = request.host_url 
        request_data = request.get_json()
        print (request_data)
        locale_data = request_data

        return adyen_sessions(host_url, locale_data)


    @app.route('/result/success', methods=['GET'])
    def checkout_success():
        return render_template('checkout-success.html')

    @app.route('/result/failed', methods=['GET'])
    def checkout_failure():
        return render_template('checkout-failed.html')

    @app.route('/result/pending', methods=['GET'])
    def checkout_pending():
        return render_template('checkout-success.html')

    @app.route('/result/error', methods=['GET'])
    def checkout_error():
        return render_template('checkout-failed.html')

    # Handle redirect (required for some payment methods)
    @app.route('/redirect', methods=['POST', 'GET'])
    def redirect_():

        return render_template('component.html', method=None, client_key=get_adyen_client_key())

    # Process incoming webhook notifications
    @app.route('/api/webhooks/notifications', methods=['POST'])
    def webhook_notifications():
        """
        Receives outcome of each payment
        :return:
        """
        notifications = request.json['notificationItems']

        for notification in notifications:
            if is_valid_hmac_notification(notification['NotificationRequestItem'], get_adyen_hmac_key()) :
                print(f"merchantReference: {notification['NotificationRequestItem']['merchantReference']} "
                      f"result? {notification['NotificationRequestItem']['success']}")
            else:
                # invalid hmac: do not send [accepted] response
                raise Exception("Invalid HMAC signature")

        return '[accepted]'

    @app.route('/favicon.ico')
    def favicon():
        return send_from_directory(os.path.join(app.root_path, 'static'),
                                   'img/favicon.ico')

    return app


def page_not_found(error):
    return render_template('error.html'), 404


if __name__ == '__main__':
    web_app = create_app()

    logging.info(f"Running on http://localhost:{get_port()}")
    web_app.run(debug=True, port=get_port(), host='0.0.0.0')


