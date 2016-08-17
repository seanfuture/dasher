var url = require('url')
var dashButton = require('node-dash-button');
var request = require('request')

function DasherButton(button) {
  var options = {headers: button.headers, body: button.body, json: button.json}

  this.dashButton = dashButton(button.address, button.interface)
  this.dashButton.on("detected", function( mac_address, packet ) {

    var target = undefined
    if( !! packet && !! packet.payload && !! packet.payload.payload &&
      !! packet.payload.payload.target_pa &&
      !! packet.payload.payload.target_pa.addr )
      target = packet.payload.payload.target_pa.addr.join( "." )

      // console.log(button.name + " check - data [ " + mac_address + " ] ", target, button.match )

      if( ! button.match || target == button.match ) {
        console.log(button.name + " pressed .. " +
          "[ " + mac_address + " / " + target + " ]" )
        doRequest(button.url, button.method, options)
      }
  })

  console.log(button.name + " added.")
}

function doRequest(requestUrl, method, options, callback) {
  options = options || {}
  options.query = options.query || {}
  options.json = options.json || false
  options.headers = options.headers || {}

  var reqOpts = {
    url: url.parse(requestUrl),
    method: method || 'GET',
    qs: options.query,
    body: options.body,
    json: options.json,
    headers: options.headers
  }

  request(reqOpts, function onResponse(error, response, body) {
    if (error) {
      console.log("there was an error");
      console.log(error);
    }
    if (response.statusCode === 401) {
      console.log("Not authenticated");
      console.log(error);
    }
    if (response.statusCode !== 200) {
      console.log("Not a 200");
      console.log(error);
    }

    if (callback) {
      callback(error, response, body)
    }
  })
}

module.exports = DasherButton