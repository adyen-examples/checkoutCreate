# Checkout Create
## Interactive Drop-in creation and styling tool 


[Try the tool online here!](https://adyencheckout.fly.dev/).

_⚠️WARNING⚠️: Do not use real payment information online! There are test cards available at the bottom of the page_

> :warning: **This tool is being worked on and is in Alpha stage**

An external tool which allows you to build a drop-in integration and make customizations as outlined in our style sheet. Enables you to experiment and see what your checkout could potentially look like. You can then retrive the final result alongside the changes so it can be exported for your team to fully implement your vision.



## Run this integration in seconds using [Gitpod](https://gitpod.io/)

* Open your [Adyen Test Account](https://ca-test.adyen.com/ca/ca/overview/default.shtml) and create a set of [API keys](https://docs.adyen.com/user-management/how-to-get-the-api-key).
* Go to [gitpod account variables](https://gitpod.io/variables).
* Set the `ADYEN_API_KEY`, `ADYEN_CLIENT_KEY`, `ADYEN_HMAC_KEY` and `ADYEN_MERCHANT_ACCOUNT variables`.
* Click the button below!

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/adyen-examples/checkoutCreate)

_NOTE: To allow the Adyen Drop-In and Components to load, you have to add `https://*.gitpod.io` as allowed origin for your chosen set of [API Credentials](https://ca-test.adyen.com/ca/ca/config/api_credentials_new.shtml)_



## Requirements

- Python 3.5 or greater
- Python libraries:
  - flask
  - uuid
  - Adyen v6.0.0 or higher
  - requests

## Installation

1. Clone this repo:

```
git clone https://github.com/adyen-examples/checkoutCreate.git
```

2. Run `source ./setup.sh` to:
   - Create and activate a virtual environment
   - Download the necessary python dependencies

3. Create a `.env` file with all required configuration 

   - PORT (default 8080)
   - [API key](https://docs.adyen.com/user-management/how-to-get-the-api-key)
   - [Client Key](https://docs.adyen.com/user-management/client-side-authentication) 
   - [Merchant Account](https://docs.adyen.com/account/account-structure)
   - [HMAC Key](https://docs.adyen.com/development-resources/webhooks/verify-hmac-signatures)

Remember to include `http://localhost:8080` in the list of Allowed Origins

```
    PORT=8080
    ADYEN_API_KEY="your_API_key_here"
    ADYEN_MERCHANT_ACCOUNT="your_merchant_account_here"
    ADYEN_CLIENT_KEY="your_client_key_here"
    ADYEN_HMAC_KEY="your_hmac_key_here"
```

4. In order to save and load configuration, the application makes use of an sqlite database. By default, the sqlite database will be created in the root of the application folder, but this can be changed (for example to make it persistent). You can change the default location by adding a `DATABASE_LOCATION` value in the `.env` file.

```
   DATABASE_LOCATION="/data"
```

## Usage
1. Run `./start.sh` to:
   - Initialize the required environment variables. This step is necessary every time you re-activate your venv
   - Start Python app    
 
2. Visit [http://localhost:8080](http://localhost:8080) and select an integration type!

## Contributing

We commit all our new features directly into our GitHub repository. Feel free to request or suggest new features or code changes yourself as well!!

Find out more in our [Contributing](https://github.com/adyen-examples/.github/blob/main/CONTRIBUTING.md) guidelines.

## License

MIT license. For more information, see the **LICENSE** file in the root directory

---

*v1.2.0-alpha* 
