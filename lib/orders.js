'use strict'

const http = require('got')
const { ORDERS_API_BASE_URL: baseUrl, NODE_ENV } = require('./config')

const sampleOrders = [
  {
    product: 'Engine',
    quantity: 1,
    message_id: 'frontend-nodejs/ae16-1',
    datetime: Date.now() - 60 * 1000 * 1
  },
  {
    product: 'Shocks',
    quantity: 2,
    message_id: 'frontend-nodejs/ae16-2',
    datetime: Date.now()
  }
]

exports.getOrders = async () => {
  if (NODE_ENV === 'local' && !baseUrl) {
    return Promise.resolve(sampleOrders)
  } else {
    const response = await http(new URL('/orders', baseUrl), {
      json: true
    })

    return response.body
  }
}
