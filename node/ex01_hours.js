#!/usr/bin/env node
/* jshint node: true */

/*
 * Static SMS replies for 46elks
 * ===
 *
 * This example listens to incoming text messages and responds to all of them with a static
 * reply telling them about the open hours for the current day.
 *
 * Setup
 * ---
 *
 * Allocate phone numbers either via the web dashboard or using the /Numbers API endpoint.
 * Set the `sms_url` value for the allocated numbers to match the endpoint provided by this
 *   example (http://example.com/callback/newsms.php).
 */

var core = require(__dirname + '/_core.js');

// JavaScript uses a numeric system that is 0-index and has Sunday as the first element.
// We will use this array to transition that over to a string representation.
var dayLookup = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];

// This is the object from which we will pick the open hours.
var hours = {
  'Mon': '08:00 - 17:00',
  'Tue': '08:00 - 17:00',
  'Wed': '08:00 - 19:00',
  'Thu': '08:00 - 17:00',
  'Fri': '08:00 - 17:00',
  'Sat': '10:00 - 16:00'
};

core.listen('/callback/newsms.php', function listener(postData, writeResponse) {

  // Hint: You can check the "message" key-value pair in POST data to build commands!

  var day = dayLookup[new Date().getDay()];

  if (typeof hours[day] === 'undefined') {
    // The open hours for the day are not defined. That means we are closed.
    writeResponse('Sorry, but we are closed today.');
  } else {
    // The open hours for the day are defined. That means we are open at some point.
    writeResponse('We are open today between ' + hours[day] + '.');
  }

});
