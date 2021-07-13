require("dotenv").config()
const express = require("express");

const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const ChatUsers ={};
const vcUsers = {};
const userss = {};


users = new Map();
var peer=null;

io.on('connection',socket =>{
    //socket.emit('yourID', userid);
    vcUsers[socket.handshake.query.team+"*****"+socket.handshake.query.name]=socket.id;
    io.sockets.emit('allUsers', vcUsers);
    if (!userss[socket.id]) {
        //userss[socket.id] = socket.id;
        //console.log(userss);
        console.log(vcUsers);
        
    }
    
    /*socket.on("takeVCinfo",(data)=>{
        vcUsers[data.team+"*****"+data.name]= data.id;
        console.log(vcUsers);
    })*/
    socket.on('callUser', (data)=>{
        console.log("calling details")
        console.log(data)
        if([data.userToCall])io.to(vcUsers[data.userToCall]).emit('hey', {signal: data.signalData, from: data.from})
        else socket.emit("notOnline");
    })

    socket.on('acceptCall', (data)=>{
        io.to(vcUsers[data.to]).emit('callAccepted', data.signal)
    })

    socket.on('close', (data)=>{
        io.to(vcUsers[data.to]).emit('close')
    })

    socket.on('rejected', (data)=>{
        io.to(vcUsers[data.to]).emit('rejected')
    })

    socket.on("forChat",(data)=>{
        ChatUsers[data.team+"*****"+data.name]=data.id;
        console.log(ChatUsers);
    });
    socket.on("sendChat",(data)=>{console.log(data);
        socket.to(ChatUsers[data.team+"*****"+data.send.name]).emit("recieveChat",{
            to:data.from.name,
            message: data.message
        });
    });
    console.log('connected to '+socket.id);
    socket.emit("yourID", socket.id);
    io.sockets.emit("allUsers", userss);
    socket.on('disconnect', () => {
        delete userss[socket.id];
        delete vcUsers[socket.handshake.query.team+"*****"+socket.handshake.query.name];
        console.log(socket.id+'disconnected')
        console.log(vcUsers);
    })
    /*socket.on("callUser", (data) => {
        io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
    })

    socket.on("acceptCall", (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    })*/

    socket.on('takeData',(data)=>{
        console.log(data);
        users[`${data.team}`,`${data.name}`]=data.id;
        console.log(users);
    });

    socket.on('takeID',(data)=>{
        console.log(data);
        if(peer){
            socket.to(data.socketID).emit("getID",peer);
        }
        else{
            peer=data.peerID;
        }
    });

    socket.on("callFriend",(data)=>{
        console.log(data);
        if(users[data.to.team,data.to.name]){
            console.log("frnd online");
            socket.to(users[data.from.team,data.from.name]).emit("friendOnline");
            socket.to(users[data.to.team,data.to.name]).emit("incomingCall", {
                from:data.from,
                link: data.link
            });
        }
        else{
            console.log("frnd offline");
            socket.to(users[data.from.team,data.from.name]).emit("friendOffline");
        }
    });

    socket.on("Accepted", (data)=>{
        socket.to(users[data.team,data.name]).emit("yourFriendAccepted",data);
    });

    
    socket.on("Declined", (data)=>{
        console.log(" declined");

        socket.to(users[data.team,data.name]).emit("yourFriendDeclined",data);
    });


});

if(process.env.PROD){
    app.use(express.static(path.join(_dirname,'./client/build')));
    app.get('*',(req,res)=>{
        res.sendFile(path.join(_dirname,'./client/build/index.html'))
    });
}

const port = process.env.PORT || 8000;
server.listen(port, () => console.log('server is running on port' + port));