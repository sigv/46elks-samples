#!/usr/bin/env node
/* jshint node: true */

/*
 * 46elks samples: Taking an incoming voice call
 * ===
 *
 * This example introduces you with how to handle an incoming voice call by simply playing
 * back a pre-recorded message to it. This can be useful for out-of-office notifications
 * and similar setups when there is nobody around who can take the call. This idea can be
 * worked upon to provide, say, a voicemail system.
 *
 * You can investigate the JSON examples provided in later examples in this samples
 * repository to learn about how the `voice_start` value can be used to execute various
 * actions. To easily test those configurations out in action, replace the `voice_start`
 * value in the listener() function of this example.
 *
 * Setup
 * ---
 *
 * Allocate phone numbers either via the web dashboard or by using the /Numbers API endpoint.
 * For the allocated numbers you are going to use, set the `voice_start` value as the endpoint
 *   provided by this example (http://example.com/callback/newcall).
 */

var core = require(__dirname + '/_core.js');

core.listen('/callback/newcall', function listener(page) {

  var voice_start = '{ "play": "http://example.com/message.wav" }';
  page.write(voice_start);

});
