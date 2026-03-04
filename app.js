const http = require('http');

const PORT        = process.env.PORT        || 3000;
const APP_NAME    = process.env.APP_NAME    || 'My App';
const ENVIRONMENT = process.env.ENVIRONMENT || 'development';
const AUTHOR      = process.env.AUTHOR      || 'Unknown';
const BG_COLOR    = process.env.BG_COLOR    || '#f0f4f8';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${APP_NAME}</title>
      <style>
        body { font-family: Arial, sans-serif; background: ${BG_COLOR};
               display: flex; justify-content: center; align-items: center;
               height: 100vh; margin: 0; }
        .card { background: white; border-radius: 16px; padding: 3rem;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center; }
        .badge { display: inline-block; padding: 6px 18px; border-radius: 20px;
                 font-weight: bold; color: white; margin-top: 1rem;
                 background: ${ENVIRONMENT === 'production' ? '#e74c3c' : '#2ecc71'}; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Welcome to ${APP_NAME}</h1>
        <div class="badge">${ENVIRONMENT.toUpperCase()}</div>
        <p>Built by: <strong>${AUTHOR}</strong></p>
        <p>Running on port: <strong>${PORT}</strong></p>
      </div>
    </body>
    </html>
  `);
});

server.listen(PORT, () => {
  console.log(`${APP_NAME} running on port ${PORT} [${ENVIRONMENT}]`);
});
