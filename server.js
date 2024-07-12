const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler();

const appDataURL = dev ? `http://${hostname}:${port}/api/fetch` : process.env.APP_DATA_URL;
const cron =  require('node-cron');

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl
      
      if (pathname === '/a') {
        await app.render(req, res, '/a', query)
      } else if (pathname === '/b') {
        await app.render(req, res, '/b', query)
      } else {
        await handle(req, res, parsedUrl)
      }
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
   .once('error', (err) => {
     console.error(err)
     process.exit(1)
   })
   .listen(port, () => {
     console.log(`> Ready on http://${hostname}:${port}`);
     
     // run cronjob
     cron.schedule('* */3 * * * *', async () => {
       console.log('saving new data in every 3 minutes', Date.now());
       try {
         const { exec } = require('child_process');
         exec(`curl ${appDataURL}`, (err, stdout, stderr) => {
           if (err) {
             console.error(err);
             return;
           }
           console.log(stdout);
         });
       } catch (error) {
         console.error(error);
       }
     });
   })
})