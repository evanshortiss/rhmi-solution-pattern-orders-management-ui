'use strict'

const Keycloak = require('keycloak-connect')
const session = require('express-session')
const log = require('./log')
const { KEYCLOAK_CONFIG, NODE_ENV, SESSION_SECRET } = require('./config')

module.exports = (app) => {
  if (KEYCLOAK_CONFIG) {
    log.info('KEYCLOAK_CONFIG was detected. Enabling keycloak protections.')
    log.debug('KEYCLOAK_CONFIG was set to: %j', KEYCLOAK_CONFIG)
    const store = new session.MemoryStore()
    const keycloak = new Keycloak({ store }, KEYCLOAK_CONFIG)

    // Apply a session middleware to manage cookies
    app.use(session({
      store,
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        // Use secure cookies in production
        secure: NODE_ENV === 'production'
      }
    }))

    // Apply keycloak middleware
    app.use(keycloak.middleware({
      logout: '/logout'
    }))

    // If you don't have the "staff" role assigned...you shall not pass!
    app.use(keycloak.protect('staff'))
  } else {
    log.warn(`
    Keycloak authentication is not enabled. Set the KEYCLOAK_CONFIG
    environment variable to a valid Keycloak JSON configuration.
    `)
  }
}
