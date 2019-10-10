# RHMI RHTE Lab No. 1 Order Management UI

## Purpose

This UI displays orders received and provides a facility to assign a user to
the order.

## Local Development

Requires:

* Node.js 10+
* npm 6+

Run the following commands from the *frontend/* directory in this repository:

```
npm i
npm run start:dev
```

You can now access the application on http://localhost:8080

## Applying Keycloak / Red Hat SSO Protection

Start the server with the `KEYCLOAK_CONFIG` environment variable set to a valid
JSON Object containing a Keycloak configuration. For example:

```
# You can get this from a client in keycloak
export KEYCLOAK_CONFIG='{"realm":"master","auth-server-url":"http://localhost:9090/auth","ssl-required":"external","resource":"orders-app","public-client":true,"confidential-port":0}'

# The server will automatically apply keycloak middleware using KEYCLOAK_CONFIG
npm run start:dev
```

If you need a Keycloak instance locally try the following:

1. `docker run -p 9090:9090 jboss/keycloak`
1. Access Keycloak at `http://localhost:9090` when it's ready
1. Login using the username `admin` and password `admin`
1. Create a *Client* and set the *Root URL* to `http://localhost:8080`
1. Ensure the *Access Type* for the client is set to `public`
1. Create a *Role* named `staff` in this new client under the *Roles* tab
1. Create a *User* with any name
1. Choose *User > Credentials* and assign a password to the user
1. Choose *User > Role Mappings* and select your *Client* from the *Client Roles* dropdown.
1. Assign the `staff` role.

## Deployment

To deploy to an OpenShift cluster you're logged into use `npm run openshift`.

An image is also available for use from quay.io/evanshortiss/rhmi-lab-order-management-ui:latest
