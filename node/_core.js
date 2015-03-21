#!/usr/bin/env node
/* jshint node: true */

/* This is the core library for all examples to work on top of. This abstracts away the details
 * about how the backend works as that will always be specific to the language or framework or
 * or platform or whatever used and doing so allows the individual example scripts to look much
 * cleaner. Additionally, if some changes to the way requests are handled need to be made that
 * can be done in a centralized manner instead of having to rewrite massive code blocks everywhere
 * around the codebase.
 */

var http = require('http');
var querystring = require('querystring');

var port = process.env.PORT || 5000;

var listeners = { /* url: [ function (postData) ] */ };

// This chunk does the main server-ing.
http.createServer(function (request, response) {

  if (request.url === '/') {
    // Provide special content for the front page.
    var responseData = 'You are currently running the 46elks sample server.\n' +
      'See https://github.com/sigv/46elks-samples for more information.';

    response.writeHead(200, {
      'Content-Length': responseData.length,
      'Content-Type': 'text/plain; charset=utf-8'
    });

    response.write(responseData);
    response.end();

    return;
  }

  if (request.method !== 'POST') {
    // Ignore everything that is not a POST request.
    response.writeHead(400, {
      'Content-Length': 0,
      'Content-Type': 'text/plain; charset=utf-8'
    });
    response.end();
    return;
  }

  if (typeof listeners[request.url] === 'undefined') {
    // We don't have anything in place to handle this request so just 404 it.
    response.writeHead(404, {
      'Content-Length': 0,
      'Content-Type': 'text/plain; charset=utf-8'
    });
    response.end();
    return;
  }

  var data = '';

  // Listen to data.
  request.on('data', function (chunk) {
    data += chunk;
    // Fail instantly if we are getting overloaded with data.
    if (data.length > 1e6) request.connection.destroy();
  });

  // When the provider decides to call it a day...
  request.on('end', function () {

    // ...fire off calls to all the listeners hooked for it...

    var postData = querystring.parse(data) || {};
    var responseData = '';

    var writeResponse = function writeResponse(chunk) {
      if (typeof chunk === 'undefined') return;
      responseData += chunk.toString();
    };

    for (var i = 0; i < listeners[request.url].length; i++) {
      listeners[request.url][i](postData, writeResponse);
    }

    // ...and thank the source.

    response.writeHead(200, {
      'Content-Length': responseData.length,
      'Content-Type': 'text/plain; charset=utf-8'
    });

    if (responseData !== '') response.write(responseData);
    response.end();

  });

}).listen(port);

// Let the user know we have a server up.
console.log('Server listening on port %s', port);

// This is what you get when you require this library.
var exports = module.exports = {};

// And this is the core call that will matter for the examples.
exports.listen = function listen(url, listener /* :(postData, writeResponse) */) {

  // Do a quick check that we have a URL handed to us.
  if (typeof url !== 'string') {
    console.error('Listeners are required to provide URL strings. This one is missing it.');
    process.exit(1);
    return;
  }

  // Do a quick check that we have a listener handed to us.
  if (typeof listener !== 'function') {
    console.error('Listeners are required to provide listener functions. This one is missing it.');
    process.exit(1);
    return;
  }

  // Hook the listener.
  if (typeof listeners[url] === 'undefined') listeners[url] = [];
  listeners[url][listeners[url].length] = listener;
  console.log('Listener for ' + url + ' ready');

};

// We check $46ELKS_USERNAME and $46ELKS_PASSWORD but you can hardcode these values as well.
exports.username = process.env['46ELKS_USERNAME'] || '';
exports.password = process.env['46ELKS_PASSWORD'] || '';
