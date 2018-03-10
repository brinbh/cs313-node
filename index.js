// const express = require('express')
// const path = require('path')
const PORT = process.env.PORT || 5000
//
// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('pages/index'))
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))

/* app.js */

// require and instantiate express
const app = require('express')()
var url = require('url');
var price = 0;

// set the view engine to ejs
app.set('view engine', 'ejs')

// blog home page
app.get('/', function (req, res) {
  res.render('mail', { price: this.price})
})

app.get('/calculateRate', function (req, res) {
  handleCalculateReq(req, res)
})

function handleCalculateReq(req, res) {
  var requestUrl = url.parse(req.url, true)
  var type = String(requestUrl.query.type)
  var weight = Number(requestUrl.query.weight)
  var price = calculateRate(type, weight)
  console.log("price: " + price)
  res.render('mail', { price: price})
}

function calculateRate(mailType, weight) {
  var price = 0;
  switch (mailType) {
    case "letterStamped":
      if (weight === 1) {
        price = .5;
        break;
      }
      else if (weight === 2) {
        price = .71;
        break;
      }
      else if (weight === 3) {
        price = .92;
        break;
      } else {
        price = 1.13;
        break;
      }
    case "letterMetered":
      if (weight < 1) {
        price = .47;
        break;
      }
      else if (weight < 2) {
        price = .68;
        break;
      }
      else if (weight < 3) {
        price = .89;
        break;
      } else {
        price = 1.10;
        break;
      }
    case "largeEnvelope":
      if (weight < 1) {
        price = 1;
        break;
      }
      else if (weight < 2) {
        price = 1.21;
        break;
      }
      else if (weight < 3) {
        price = 1.42;
        break;
      } else {
        price = 1.63;
        break;
      }
    case "firstClass" :
      if (weight < 5) {
        price = 3.5;
        break;
      }
      else if (weight < 9) {
        price = 3.75;
        break;
      }
      else if (weight < 10) {
        price = 4.10;
        break;
      }
      else if (weight < 11) {
        price = 4.45;
        break;
      }
      else if (weight < 12) {
        price = 4.80;
        break;
      }
      else if (weight < 13) {
        price = 5.15;
        break;
      } else {
        price = 5.5;
        break;
      }
    default:
    {
      price = 0;
      break;
    }
  }

  return price;
}

app.listen(PORT)

console.log('listening on port 3000')