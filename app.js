const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const axios = require('axios');
var timeout = require('connect-timeout');

// To prevent timout when node is waking up from sleep state
app.use(timeout('2hrs'))
const haltOnTimedout = (req, res, next) => {
  if (!req.timedout) next()
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

// parse application/json
app.use(bodyParser.json({limit: '50mb'}))

// Set CORS headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use(haltOnTimedout)

app.get("/", (req, res) => res.type('html').send(html));

app.post("/save-roam-sr-data", async (req, res) => {
  const { data, graphName, } = req.body;

  try {
    const response = await fetch(`https://api.roamresearch.com/api/graph/${graphName}/write`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Authorization': req.headers.authorization,
        'Content-Type': 'application/json',
      },
    });

    const responseCode = response.status;

    if(responseCode !== 200) {
      const responseText = await response.text();
      const error = new Error(`Error Saving Roam Data: ${responseCode}`);
      error.status = responseCode;
      error.message = responseText;

      throw error;
    }

    res.send('Success');
  } catch (error) {
    console.log('Error Saving Roam Data', error);
    res.status(error.status || 500).send(error.message)
  }

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Roam Memo 😊!
    </section>
  </body>
</html>
`
