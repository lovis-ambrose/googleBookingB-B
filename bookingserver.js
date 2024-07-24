require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const apiv3 = require('./apiv3methods.js');
const port = process.env.PORT || 8080;

const usernamePassword = 'bitebooker:bitebooker1';
const app = express();

app.use(bodyParser.json());

// Middleware to handle authorization
app.use((request, response, next) => {
  const authorization = request.headers['authorization'];

  if (authorization) {
    const encodedString = authorization.replace('Basic ', '');
    const decodedBuffer = Buffer.from(encodedString, 'base64');
    const decodedString = decodedBuffer.toString();  // "username:password"

    if (decodedString !== usernamePassword) {
      response.status(401).set('Content-Type', 'text/plain').end('Unauthorized Request');
      return;
    }
  } else {
    response.status(401).set('Content-Type', 'text/plain').end('Unauthorized Request');
    return;
  }

  next();
});

// Health Check Endpoint
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

// Batch Availability Lookup Endpoint
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

// Check Availability Endpoint
app.post('/v3/checkavailability', (request, response) => {
  try {
    const responseBody = apiv3.CheckAvailability(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

// Create Booking Endpoint
app.post('/v3/createbooking', (request, response) => {
  try {
    const responseBody = apiv3.CreateBooking(request.body);
    response.status(200).json(responseBody);
    console.log('Received request for CreateBooking:', responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

// Update Booking Endpoint
app.post('/v3/updatebooking', (request, response) => {
  try {
    const responseBody = apiv3.UpdateBooking(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

// Get Booking Status Endpoint
app.post('/v3/getbookingstatus', (request, response) => {
  try {
    const responseBody = apiv3.GetBookingStatus(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

// List Bookings Endpoint
app.post('/v3/listbookings', (request, response) => {
  try {
    const responseBody = apiv3.ListBookings(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

// Check Order Fulfillability Endpoint
app.post('/v3/checkorderfulfillability', (request, response) => {
  try {
    const responseBody = apiv3.CheckOrderFulfillability(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

// Create Order Endpoint
app.post('/v3/createorder', (request, response) => {
  try {
    const responseBody = apiv3.CreateOrder(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

// List Orders Endpoint
app.post('/v3/listorders', (request, response) => {
  try {
    const responseBody = apiv3.ListOrders(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

// Batch Get Wait Estimates Endpoint
app.post('/v3/batchgetwaitestimates', (request, response) => {
  try {
    const responseBody = apiv3.BatchGetWaitEstimates(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

// Create Waitlist Entry Endpoint
app.post('/v3/createwaitlistentry', (request, response) => {
  try {
    const responseBody = apiv3.CreateWaitlistEntry(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

// Get Waitlist Entry Endpoint
app.post('/v3/getwaitlistentry', (request, response) => {
  try {
    const responseBody = apiv3.GetWaitlistEntry(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

// Delete Waitlist Entry Endpoint
app.post('/v3/deletewaitlistentry', (request, response) => {
  try {
    const responseBody = apiv3.DeleteWaitlistEntry(request.body);
    response.status(200).json(responseBody);
  } catch (e) {
    response.status(500).end(`Error: ${e}`);
    console.log(`Error: ${e}`);
  }
});

// Handle unsupported requests
app.use((request, response) => {
  response.status(400).set('Content-Type', 'text/plain').end('Request Not Supported');
});

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Booking Server is running at ${port}`);
});