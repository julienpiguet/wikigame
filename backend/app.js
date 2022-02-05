const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const dns = require('dns');
const { json } = require('express');
dns.setServers(['8.8.8.8']);

const wiki_random_url = 'https://en.wikipedia.org/api/rest_v1/page/random/summary';
const wiki_request_url = 'https://en.wikipedia.org/api/rest_v1/page'

const hostname = 'localhost';
const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/example/index.html');
  
});

app.get('/random', (req, res) => {

  try {
    https.get(wiki_random_url, (res_rdm) => {
      res_rdm.on('data', (chunk) => {
      });
  
      res_rdm.on('end', () => {

        let url = wiki_request_url+(res_rdm.headers.location.toString().slice(2));
        console.log('Request: '+ url);
  
        https.get(url, (res_query) => {
          var json = '';

          res_query.on('data', function (chunk) {
              json += chunk;
          });
  
          res_query.on('end', () => {
  
            try {
              var data = JSON.parse(json);
  
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.send({ data })
  
            } catch (e) {
              console.log('Error parsing JSON!');
              console.log("Error: " + e.message);
              res.statusCode = 500;
              res.end("Error: " + e.message);
            }
            
          }).on("error", (err) => {
            res.statusCode = 500;
            console.log("Error: " + err.message);
            res.end("Error: " + err.message);
          });
        });
      }).on("error", (err) => {
        res.statusCode = 500;
        console.log("Error: " + err.message);
        res.end("Error: " + err.message);
      });
    });
  } catch (err){
    console.log("Error: " + e.message);
    res.statusCode = 500;
    res.end("Error: " + e.message);
  }
  
});

/*io.on('connection', (socket) => {
    socket.broadcast.emit('hi');
  });

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
  });*/

//io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});