export function initPackage() {
  return `
  {
    "name": "api-gateway",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "dev": "npm run watch",
      "serve": "node index.js",
      "watch": "nodemon index.js",
      "start": "npm run serve",
      "format": "prettier --write \\"**/*.{js,json}\\""
    },
    "keywords": [],
    "author": "",
    "license": "ISC"
  }
  `;
}

// index.js content
export function indexJs(name: string) {
  return `
    const express = require('express');
    const dotenv = require('dotenv');
    const bodyParser = require('body-parser');
    const router = require('./routers/router');

    dotenv.config({ path: './.env' });
    const app = express();

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
  const express = require('express');
  const router = express.Router();
  // const serviceExample = require('./serviceExample')
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
  const express = require('express');
  const router = express.Router();
  const apiAdapter = require('./apiAdapter');
  
  const BASE_URL = 'http://localhost:8888'
  const api = apiAdapter(BASE_URL)
  
  router.get('/', (req, res) => {
      res.json({ hello: 'world' });
  })
  
  module.exports = router;
  `;
}
