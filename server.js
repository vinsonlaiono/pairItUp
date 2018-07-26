const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware
app.use(express.static("/views"));
app.use(bodyParser.urlencoded({extended: true}));
app.set(' view engine', 'ejs');

const server = app.listen(4000, function(){
    console.log('Listening on port 4000');
})

const io = require('socket.io')(server);

var users = []
// Change messages from being appended to being looped through as it will be stored in this array
var messages = []

io.on('connection', function(socket){
    console.log('Socket connection complete...');
    // needs to be tested to display all messages to new users
    socket.emit('message_histort', {messages, messages})

    allUsers();
    // allMessages()
    socket.on('new_user', function(username){
        console.log(username)
        // users.push({name: username, userid : socket.id})
        socket.user = username
        users.push(socket.user)
        // console.log(users)
        // allMessages()
        allUsers();
    });
    // Listen for new_msg event for a new message
    socket.on('new_msg', function(data, user){
        console.log(data)

        socket.data = data;
        messages.push(socket.data)
        io.sockets.emit('msg', {msg: socket.data, user: user})
        allUsers();
    })

    socket.on('newHTML', function(data) {
        console.log("newHTML------------",data)
        io.sockets.emit('sendHTML', data)
    })

    // Send the users array to client
    function allUsers() {
        io.sockets.emit('allusers', users);
    }

    

    // socket.on('disconnect', function(data){
    //     if(!socket.user) {
    //         return;
    //     }
    //     users.splice(users.indexOf(socket.user),1);
    //     allUsers();
    // console.log('user disconnected: ' + user);
    // });
    // Send the users array to client(Note: add this at a latter time)
    // function allMessages() {
    //     io.emit('allMessages', messages);
    // }


    // uncomment this method to remove all users

    // function removeUsers(arr){
    //     for(var i = 0; i < arr.length; i ++){
    //         users.splice(arr[i])
    //     }
    // }
    // removeUsers(users)

    
});

// Render chatroom ejs page
app.get('/', function(req, res) {
    
    res.render("index.ejs");
});
