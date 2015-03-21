#!/usr/bin/env node
/* jshint node: true */

/*
 * Group SMS example for 46elks
 * ===
 *
 * This example listens to incoming text messages and, if they match a sender rule, forwards
 * them to everyone else in the group.
 *
 * Setup
 * ---
 *
 * Allocate phone numbers either via the web dashboard or using the /Numbers API endpoint.
 * Set the `sms_url` value for the allocated numbers to match the endpoint provided by this
 *   example (http://example.com/callback/newsms.php).
 * Modify the group objects as described in the code, setting your allocated numbers and the
 *   numbers of all the members of the groups.
 * Provide your own API username and API password (see the sendSms() function).
 */

var core = require(__dirname + '/_core.js');
var https = require('https');
var querystring = require('querystring');

// We have to define the phone numbers we will be working with.
var groups = {

  '+46761070124': { // This is the number which you have been allocated.
    'name': 'The development team', // This is here just for logging purposes.
    'members': { // These are... well, the members of the group.
      '+46707808449': 'sirmike', // Each member is ID'd by his/her number and a name.
      '+46761239871': 'sl0wcoder',
      '+46739338123': 'jlundberg'
    }
  },

  '+46761070125': {
    'name': 'Family',
    'members': {
      '+46735207657': 'Anders',
      '+46707224755': 'Marie',
      '+46709194878': 'Kicki',
      '+46703738061': 'Carina'
    }
  }

};

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

core.listen('/callback/newsms.php', function listener(postData) {

  // Make sure the POST data looks sane before starting anything.
  var fields = [ 'from', 'to', 'message' ];
  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];
    if (typeof postData[field] === 'undefined') {
      console.error('No "' + field + '" in the POST data.');
      return;
    }
  }

  // Group keys are our allocated numbers which makes group lookup rather simple.
  var group = groups[postData.to];

  // If there is no group matched, just log that and return.
  if (typeof group === 'undefined') {
    console.error('No group for number "' + postData.to + '". (from: "' + postData.from + '")');
    return;
  }

  // People's names are nicely organized as well where the keys are their representative numbers.
  var author = group.members[postData.from];

  // The sender does not seem to be a member of the group he is sending for.
  if (typeof author === 'undefined') {
    // If you want to allow this, you could use something like `author = postData.from`.
    console.error('Broadcast for "' + postData.from + '" rejected in "' + group.name + '".');
    return;
  }

  // After all this validation, send out messages to everyone in the group!
  for (var memberNumber in group.members) {
    // This is a bit of a weird quirk with JS. Got to have this to avoid weird numbers popping up.
    if (!group.members.hasOwnProperty(memberNumber)) continue;

    // The original sender is probably not interested in an echo.
    if (memberNumber === postData.from) continue;

    // This is what we end up sending off:
    // from = postData.to // This is the number we received the text on.
    // to = memberNumber // This is the number of the current member we are looking at.
    // message = ...

    // Message ahoy!
    sendSms(postData.to, memberNumber, author + ': ' + postData.message);
  }

});
