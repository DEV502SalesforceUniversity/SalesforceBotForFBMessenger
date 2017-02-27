# Messenger Platform Sample -- node.js

This project is an example server for a Salesforce Bot for the Facebook Messenger Platform built in Node.js. With this app, you can connect to your Salesforce account and query certain data. It should be very simple to extend the functionality of the app to query all data in your org.

# Deploy your code to Heroku:
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

This app contains the following functionality:

* Webhook (specifically for Messenger Platform events)
* Send API
* Storing Salesforce tokens in Postgres on Heroku
* Retrieving data from Salesforce

Follow the [walk-through](https://developers.facebook.com/docs/messenger-platform/quickstart) to learn about the Facebook Messenger platform.

## Setup

Set the values in `YOUR HEROKU APP` before running the sample. Descriptions of each parameter can be found in `app.json`.

## Run

When you click the `Deploy to Heroku button`, your app will be available to setup webhook integration.

You must populate the `config vars`in your Heroku app for everything to work correctly.

## Webhook

All webhook code is in `app.js`. It is routed to `/webhook`. This project handles callbacks for authentication, messages, delivery confirmation and postbacks. More details are available at the [reference docs](https://developers.facebook.com/docs/messenger-platform/webhook-reference).

## "Send to Messenger" and "Message Us" Plugin

An example of the "Send to Messenger" plugin and "Message Us" plugin are located at `index.html`. The "Send to Messenger" plugin can be used to trigger an authentication event. More details are available at the [reference docs](https://developers.facebook.com/docs/messenger-platform/plugin-reference).

## License

See the LICENSE file in the root directory of this source tree. Feel free to use and modify the code.
