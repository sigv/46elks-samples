#!/usr/bin/env node
/* jshint node: true */

/*
 * SMS sending example for 46elks
 * ===
 *
 * This example sends off a text message to a pre-defined phone number when the specific
 * endpoint (/send) is reached.
 *
 * Setup
 * ---
 *
 * Change the phone number that will receive the text message (see the listener() function).
 * Provide your own API username and API password (see the sendSms() function).
 */

var core = require(__dirname + '/_core.js');
var https = require('https');
var querystring = require('querystring');

function sendSms(from, to, message) {

  // Do URL-encoding on the data and prepare the request details.
  var postData = querystring.stringify({ from: from, to: to, message: message });
  var options = {

    hostname: 'api.46elks.com',
    path: '/a1/SMS',
    method: 'POST',
    headers: {
      'User-Agent': 'samples/1.0.0',
      'Content-Length': postData.length,
      'Content-Type': 'application/x-www-form-urlencoded',
      // Add basic access authentication. Real simple.
      'Authorization': 'Basic ' +
        new Buffer(core.username + ':' + core.password, 'utf8').toString('base64')
    }
  };

  // Start the web request.
  var request = https.request(options, function (response) {
    // Log all data we receive from the server. We need to consume these 'data' events anyway.
    response.on('data', function (data) { console.log(data.toString('utf8')); });
  });

  // Send the real data away to the server.
  request.write(postData, 'utf8');

  // Finish sending the request.
  request.end();

  // Log any errors, in case something goes wrong.
  request.on('error', function (err) { console.error(err); });

}

core.listen('/send', function listener(postData, writeResponse) {

  var from = 'DummyFrom'; // This is the sender. It can be up to 11 alphanumeric chars long.
  var to = '+46709751949'; // This is the recipient's number. You should change it.
  var message = 'Hello, world!';

  sendSms(from, to, message);
  writeResponse('Your request has been acknowledged. Have a nice day.');

});
