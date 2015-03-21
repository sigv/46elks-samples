#!/usr/bin/env node
/* jshint node: true */

/*
 * 46elks samples: Wall of text messages
 * ===
 *
 * This example introduces you with how to receive text messages to a phone number allocated
 * to you and store them. The scenario is that a web portal can be displayed on a wall to show
 * the most recent text messages which can be great for announcements and notices or various
 * kinds. The same idea can be expanded further to provide all kinds of logging, highlighted
 * notices, etc.
 *
 * Setup
 * ---
 *
 * Give this example's process write access to its working directory for simple data storage.
 * Get a new random secret key and set it as the `key` variable.
 * Set the `sms_url` value for the allocated numbers you are going to use to match the endpoint
 *   provided by this example along with the key (http://example.com/callback/newsms?key=abc123).
 */

var core = require(__dirname + '/_core.js');
var fs = require('fs');

var key = 'abc123'; // This is the key that should be unique.

var knownPeople = { // This object is used for nicer output formatting.
  '+46704508449': 'Johannes L', // Each pair consists of a phone number and a name.
  '+46701234124': 'Mike Douglas'
};

function getStamp() {
  // You might want to use a seperate timestamp for each day or hour or whatever else.
  // One is added to the month as January is the 0th month in JavaScript.
  var d = new Date();
  return d.getUTCFullYear() + '.' + (d.getUTCMonth() + 1);
}

core.listen('/callback/newsms?key=' + key, function listener(page) {

  // Make sure the POST data looks sane before doing anything.
  var fields = [ 'from', 'to', 'message' ];
  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];
    if (typeof page.post[field] === 'undefined') {
      console.error('No "' + field + '" key in the POST data.');
      return;
    }
  }

  // Get the file to store the message in.
  var file = __dirname + '/textwall.' + getStamp() + '.txt';
  // Process the data to be stored.
  var line = page.post.from + ' ' +
    new Buffer(page.post.message, 'utf8').toString('base64') + '\n';
  // Do the actual storing. This should be done async and cached, but this will do for the example.
  fs.appendFileSync(file, line, { encoding: 'utf8', mode: 0664 });

});

core.listen('/wall', function listener(page) {

  // Load the history. This should already be cached, but this will do for the example.
  var file = __dirname + '/textwall.' + getStamp() + '.txt';
  var lines = [];
  try {
    lines = fs.readFileSync(file, { encoding: 'utf8' }).split('\n');
  } catch (err) {
    if (err.code === 'ENOENT') {
      // File not found. Carry on.
    } else {
      throw err;
    }
  }

  // Throw the beginning of the HTML at the requesting client.
  page.write('<!DOCTYPE html>\n<html><head><title>Text wall example for 46elks</title><style>h1,p{font-family:Verdana;text-align:center;width:90%;margin:0 auto;padding:10px 20px;}h1{font-size:22px;}p{font-size:16px;}p em{font-size:13px;}</style><meta http-equiv="refresh" content="5"></head><body><h1>Text wall example</h1>');

  // Output each line to the client.
  for (var i = lines.length - 1; i >= 0; i--) {
    var line = lines[i].trim();

    // Skip empty lines.
    if (line === '') continue;

    // Parse the original sender.
    var from = line.split(' ')[0];
    // Check if we know that person. If we do, grab his/her name.
    if (typeof knownPeople[from] !== 'undefined') from = knownPeople[from];
    // Parse the original message.
    var message = new Buffer(line.split(' ')[1], 'base64').toString('utf8');

    page.write('<p>' + message + ' <em>' + from + '</em></p>');
  }

  // Wrap up.
  page.write('</body></html>\n');

});
