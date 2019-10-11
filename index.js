'use strict'

const path = require('path')
const boom = require('@hapi/boom')
const express = require('express')
const probe = require('kube-probe')
const helmet = require('helmet')
const exphbs = require('express-handlebars')
const { HTTP_PORT } = require('./lib/config')
const applyKeycloak = require('./lib/keycloak')
const { getOrders } = require('./lib/orders')
const log = require('./lib/log')

const app = express()

// Configure handlebars and server-side rendering
app.engine('handlebars', exphbs())
app.set('views', path.resolve(__dirname, 'views'))
app.set('view engine', 'handlebars')

// Required when running behind a load balancer, e.g HAProxy
app.set('trust proxy', true)

// Apply some sensible security headers to all responses
app.use(helmet())

// Expose standard k8s liveness and readiness checks
probe(app)

// Expose static assets
app.use('/', express.static(path.join(__dirname, 'public')))

// Apply keycloak security if it's configured
applyKeycloak(app)

// Render the order management page
app.get('/', async (req, res, next) => {
  try {
    const orders = await getOrders()
    const username = req.kauth ? req.kauth.grant.access_token.content.preferred_username : undefined

    // Change the date property in the order object
    // from a number to formatted string
    orders.forEach(o => {
      o.datetime = new Date(o.datetime).toJSON()
    })

    res.render('index.handlebars', {
      orders,
      username
    })
  } catch (e) {
    next(e)
  }
})

// 404 handler. If a request gets here it matched no routes
app.use((req, res) => {
  res.render('error.handlebars', {
    title: '404 - Not Found',
    desciption: 'Looks like you entered an invalid URL or followed a broken link. Use the button below to get back to the application.'
  })
})

app.use((err, req, res, next) => {
  log.error('server error', err)
  log.error(err.stack)

  const description = 'Sorry, we had some trouble processing your request. Try again later.'

  if (boom.isBoom(err)) {
    log.error('rendering boom error')
    res.render('error.handlebars', {
      title: `${err.output.statusCode} - ${err.output.payload.error}`,
      description: err.output.statusCode === 500 ? description : err.output.payload.message
    })
  } else {
    log.error('rendering regular error')
    res.render('error.handlebars', {
      title: 'Unknown Error',
      description
    })
  }
})

app.listen(HTTP_PORT, (err) => {
  if (err) {
    log.error('Error starting application:')
    log.error(err)
  } else {
    log.info(`started listening on ${HTTP_PORT}`)
  }
})
