require('dotenv').config();
const usernamePassword = 'bitebooker:bitebooker1';
const bodyParser = require('body-parser');
const express = require('express'); // Import express
const http = require('http');
const apiv3 = require('./apiv3methods.js');
const port = process.env.PORT || 8080;

const app = express(); // Create an instance of express

app.use(bodyParser.json());

// TO-DO: implement SSL server using https module
// for more info: https://nodejs.org/api/https.html
// const https = require('https');
// const fs = require('fs');
// const options = {
//  key: fs.readFileSync('./keys/booking-server-key.pem'),
//  cert: fs.readFileSync('./keys/booking-server-cert.pem')
// };
// const server = https.createServer(options, (request, response) => {...

const server = http.createServer(app);

app.use((request, response, next) => {
  const {headers, method, url} = request;

  // Parsing basic authentication to extract base64 encoded username:password
  // Authorization:Basic dXNlcm5hbWU6cGFzc3dvcmQ=
  let decodedString = '';
  const authorization = headers['authorization'];
  if (authorization) {
    const encodedString = authorization.replace('Basic ', '');
    const decodedBuffer = Buffer.from(encodedString, 'base64');
    decodedString = decodedBuffer.toString();  // "username:password"
  }

  if (decodedString !== usernamePassword) {
    response.status(401).set('Content-Type', 'text/plain').end('Unauthorized Request');
    return;
  }

  // convert url to lower case and remove trailing '/' if there's one
  // you can also remove prefixed URL, if your server is hosted on
  // server/somepath/
  let path = url.endsWith('/') ? url.slice(0, -1).toLowerCase() : url.toLowerCase();

  console.log(`HTTP Request ${method} ${path}`);

  request.body = [];
  request
    .on('error', (err) => console.error(err))
    .on('data', (chunk) => request.body.push(chunk))
    .on('end', () => {
      request.body = Buffer.concat(request.body).toString();
      next();
    });
});

app.get('/v3/healthcheck', (request, response) => {
  try {
    const responseBody = apiv3.HealthCheck(request.body);
    console.log(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

app.post('/v3/batchavailabilitylookup', (request, response) => {
  try {
    console.log(`Received request for /v3/batchavailabilitylookup: ${request.body}`);
    const responseBody = apiv3.BatchAvailabilityLookup(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

app.post('/v3/checkavailability', (request, response) => {
  try {
    const responseBody = apiv3.CheckAvailability(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

app.post('/v3/createbooking', (request, response) => {
  try {
    const responseBody = apiv3.CreateBooking(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

app.post('/v3/updatebooking', (request, response) => {
  try {
    const responseBody = apiv3.UpdateBooking(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

app.post('/v3/getbookingstatus', (request, response) => {
  try {
    const responseBody = apiv3.GetBookingStatus(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

app.post('/v3/listbookings', (request, response) => {
  try {
    const responseBody = apiv3.ListBookings(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

app.post('/v3/checkorderfulfillability', (request, response) => {
  try {
    const responseBody = apiv3.CheckOrderFulfillability(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

app.post('/v3/createorder', (request, response) => {
  try {
    const responseBody = apiv3.CreateOrder(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

app.post('/v3/listorders', (request, response) => {
  try {
    const responseBody = apiv3.ListOrders(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

app.post('/v3/batchgetwaitestimates', (request, response) => {
  try {
    const responseBody = apiv3.BatchGetWaitEstimates(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

app.post('/v3/createwaitlistentry', (request, response) => {
  try {
    const responseBody = apiv3.CreateWaitlistEntry(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

app.post('/v3/getwaitlistentry', (request, response) => {
  try {
    const responseBody = apiv3.GetWaitlistEntry(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

app.post('/v3/deletewaitlistentry', (request, response) => {
  try {
    const responseBody = apiv3.DeleteWaitlistEntry(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

app.use((request, response) => {
  response.status(400).set('Content-Type', 'text/plain').end('Request Not Supported');
});

server.listen(port, () => {
  console.log(`Booking Server is running at ${port}`);
});
