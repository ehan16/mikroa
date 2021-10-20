export function expressAppJs() {
  return `
    const express = require('express');
  
    // Routes
    const routes = require('./routes');
  
    const app = express();
    
    app.set('port', Number(process.env.PORT) || 3000);
    app.use('/', routes);
    
    exports.app = app;
        `;
}

export function routesIndexJs() {
  return `
  const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
  console.log('Called: ', req.path);
  next();
});

module.exports = router;

  `;
}
