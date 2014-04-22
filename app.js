/**
 * Module dependencies.
 */

var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.post('/submitData', function (req, res) {

    console.log(req.body.data);
    var d = req.body.data;
    console.log(d);
    submitData(d, res);
//    res.jsonp('success');
})

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});


//node socket server on port 5000
// Load the TCP Library
net = require('net');

// Keep track of the chat clients
var clients = [];

// Start a TCP Server
net.createServer({ allowHalfOpen: true
    },
    function (socket) {

        var d = '';
        // Identify this client
        socket.name = socket.remoteAddress + ":" + socket.remotePort

        // Put this new client in the list
        clients.push(socket);

        // Send a nice welcome message and announce
//    socket.write("Welcome " + socket.name + "\n");
        broadcast(socket.name + " joined the chat\n", socket);

        // Handle incoming messages from clients.
        socket.on('data', function (data) {
            d += data;
            broadcast(socket.name + "> " + data, socket);
        });

        // Remove the client from the list when it leaves
        socket.on('end', function () {
            console.log(d);
            d = '';
            clients.splice(clients.indexOf(socket), 1);
            broadcast(socket.name + " left the chat.\n");
        });
        socket.setKeepAlive(true);

        // Send a message to all clients
        function broadcast(message, sender) {
            clients.forEach(function (client) {
                // Don't want to send it to sender
                if (client === sender) return;
                client.write(message);
            });
            // Log it to the server output too
            process.stdout.write(message)
        }

    }).listen(5000);

function submitData(data, res) {
    if (clients.length > 0) {
        socket = clients[0];
        socket.end(data);

        res.jsonp('success');
        console.log('submitData');
    }
    else {
        console.log('error');
    }

}

//setInterval(function () {
//    submitData("歡sdkfjlk");
//
//
//}, 1000);
//setTimeout(function () {
//    if (clients.length > 0) {
//        socket = clients[0];
//        socket.write("exit");
//    }
//
//},10000);


// Put a friendly message on the terminal of the server.
console.log("Chat server running at port 5000\n");




