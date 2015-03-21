#!/usr/bin/env node
/* jshint node: true */

/*
 * 46elks samples: Placing an outgoing voice call
 * ===
 *
 * This example introduces you with how to place an outgoing voice call that connects the
 * user to a pre-defined phone number right away on request. This idea can be adapted for
 * various situations and expanded further, for example, including recordings of such
 * calls and voicemail systems, that allow people to leave notes.
 *
 * You can investigate the JSON examples provided in later examples in this samples
 * repository to learn about how the `voice_start` value can be used to execute various
 * actions. To easily test those configurations out in action, replace the `voice_start`
 * value in the listener() function of this example.
 *
 * Setup
 * ---
 *
 * Change the phone number that will initiate the call (see the listener() function).
 * Provide your own API username and API password (see the newCall() function).
 */

var core = require(__dirname + '/_core.js');
var https = require('https');
var querystring = require('querystring');

function newCall(from, to, voice_start) {

  // Do URL-encoding on the data and prepare the request details.
  var postData = querystring.stringify({ from: from, to: to, voice_start: voice_start });
  var options = {

    hostname: 'api.46elks.com',
    path: '/a1/Calls',
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

core.listen('/call', function listener(page) {

  var from = '+46766861001'; // This is the caller. You should put a number allocated to you here.
  var to = page.post.mobilenumber; // This is the number to be called. Simple.
  var voice_start = '{ "connect": "+461890510" }'; // This is what instructs the 46elks system.

  // Start writing the page.
  page.write('<!DOCTYPE html>\n<html><head><title>Caller example for 46elks</title><style>h1,p,form{font-family:Verdana;text-align:center;width:90%;margin:0 auto;padding:10px 20px;}h1{font-size:22px;}p,form{font-size:16px;}p em{font-size:13px;}</style></head><body><h1>Caller example</h1>');

  if (typeof to === 'undefined') {
    // There is no target defined. Show the user the form.
    page.write('<p>Enter your phone number below to be connected to +461890510 free of charge.<form action="#" method="POST"><input type="text" name="mobilenumber" value="+4670"><input type="submit" value="Start call"></form></p>');
  } else {
    // There is a target defined. Call away.
    page.write('<p>Calling ' + to + '...</p>');
    newCall(from, to, voice_start);
  }

  // Finish writing the page.
  page.write('</body></html>\n');

});
