'use strict'

const { get } = require('env-var')

module.exports = {
  SESSION_SECRET: get('SESSION_SECRET', 'wow. such secret. very secure.').asString(),
  LOG_LEVEL: get('LOG_LEVEL', 'debug').asEnum(['trace', 'debug', 'info']),

  // This should be set to an internal URL, e.g http://orders.namespace.svc:8080
  ORDERS_API_BASE_URL: get('ORDERS_API_BASE_URL').required().asUrlString(),

  KEYCLOAK_CONFIG: get('KEYCLOAK_CONFIG').asJsonObject(),
  HTTP_PORT: get('HTTP_PORT', 8080).asPortNumber(),
  NODE_ENV: get('NODE_ENV').asString()
}
