/* eslint-disable no-useless-escape */

// index.js content
export function indexJs(name: string) {
  return `
    var express = require('express');
    var app = express();
    var router = require('./routers/router');
    var bodyParser = require('body-parser');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/', (req, res) => {
        res.send("${name} API Gateway")
    });

    app.use(router);

    console.log("🚀 ${name} API Gateway on http://localhost:3000");
    app.listen(3000);
      `;
}

// router.js is content combines all the services endpoints

export function routerJs() {
  return `
  var express = require('express');
  var router = express.Router();
  // var serviceExample = require('./serviceExample')
  router.use((req, res, next) => {
      console.log("Called: ", req.path)
      next()
  });
  
  // router.use(serviceExample);
  
  module.exports = router;
        `;
}

// apiAdapter.js is to construct the API endpoint for each service

export function apiAdapterJs() {
  return `
  const axios = require('axios');

  module.exports = (baseURL) => {
    return axios.create({
      baseURL: baseURL,
    });
  }
          `;
}

// serviceExample.js is an example file to reroute request to a Service

export function serviceExampleJs() {
  return `
  var express = require('express');
  var router = express.Router();
  const apiAdapter = require('./apiAdapter');
  
  const BASE_URL = 'http://localhost:8888'
  const api = apiAdapter(BASE_URL)
  
  router.get('/', (req, res) => {
      res.json({ hello: 'world' });
  })
  
  module.exports = router;
            `;
}
