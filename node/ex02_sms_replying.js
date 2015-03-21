#!/usr/bin/env node
/* jshint node: true */

/*
 * 46elks samples: Replying to text messages
 * ===
 *
 * This example introduces you with how to reply to a received text message. The scenario is
 * that all people who message this allocated number are interested in what the open hours
 * are for the day. While that may sound restrictive, the basic idea can be easily expanded
 * upon later to provide support for various special commands and inquiries.
 *
 * Setup
 * ---
 *
 * Allocate phone numbers either via the web dashboard or by using the /Numbers API endpoint.
 * For the allocated numbers you are going to use, set the `sms_url` value as the endpoint
 *   provided by this example (http://example.com/callback/newsms).
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

core.listen('/callback/newsms', function listener(page) {

  /*
   * This will be executed when a request to /callback/newsms is received.
   * It will be an automatic POST request as described in the specification.
   *
   * To reply to the number that sent the original message, just output content on this page.
   * The 46elks servers will grab that response and send off a text message automatically.
   *
   * Hint: To build commands, check out the value for the "message" key in the POST data!
   */

  var day = dayLookup[new Date().getDay()];

  if (typeof hours[day] === 'undefined') {
    // The open hours for the day are not defined. That means we are closed.
    page.write('Sorry, but we are closed today.');
  } else {
    // The open hours for the day are defined. That means we are open at some point.
    page.write('We are open today between ' + hours[day] + '.');
  }

});
