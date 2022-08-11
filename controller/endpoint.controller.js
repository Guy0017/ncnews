const endpoints = require('../endpoints.json')
const { fetchEndpoints } = require('../model/endpoint.model')

exports.getEndpoints = (res, req, next) => {

    fetchEndpoints().then((endpoints) => {

        console.log(endpoint)

    })
    .catch(next)


}