export function expressAppJs() {
  return `
    const express = require('express');
  
    // Routes
    const routes = require('./routes');
  
    const app = express();
    
    app.set('port', Number(process.env.PORT) || 3000);
    app.use('/', routes);
    
    export default app;
        `;
}
