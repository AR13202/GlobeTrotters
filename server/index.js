const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
const server = http.createServer(app);
const data = require('./data/data.json');
const { Server } = require('socket.io');
const { getRandomQuestions } = require('./utils/getRandomQuestions');
const { getUniqueRoomId } = require('./utils/getUniqueRoomId');
const {generateQuestionSequence} = require('./utils/generateQuestionSequence');
const port = 4000;

//data
let users = [];
let rooms = [];

app.get('/', (req, res) => {
    res.send('server started....');
});

app.get('/questions', (req, res) => {
    const questions = getRandomQuestions(data, 10);
    res.json(questions);
});
app.get('/data',(req,res)=>{
    res.json({users,rooms})
})
// console.log(data.length);
const allowedOrigins = ['http://localhost:5173'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('create-room', (username) => {

        const roomId = getUniqueRoomId(rooms);
        const questions = getRandomQuestions(data, 10);
        const questionSequence = generateQuestionSequence(questions);
        const room = {
            roomId:roomId,
            users:[username],
            questions:questions
        }
        rooms.push(room);
        const user = { 
            socketId:socket.id,
            roomId:roomId,
            username:username,
            score:0,
            questionSequence:questionSequence,
            currentQuestionIndex:0
        };

        users.push(user);
        socket.join(roomId);

        console.log(`User ${username} joined room ${roomId}`);
        // socket.to(roomId).emit('user-connected', username);
        io.to(roomId).emit('room-created', roomId);
        // socket.broadcast.to(roomId).emit('user-joined', user);
    })

    socket.on('get-question',(socketId,roomId,username)=>{
        const otherUsers = users.filter(user=>user.socketId!==socketId);
        const user = users.find(user => user.socketId === socketId);
        if(user){
            if(user.currentQuestionIndex === user.questionSequence.length){
            io.to(socketId).emit('question',{res:"completed"});
            return;
            }
            const room = rooms.find(room => room.roomId === roomId);
            const questionIndex = user.questionSequence[user.currentQuestionIndex];
            const question = room.questions[questionIndex];
            user.currentQuestionIndex+=1;
            users = [...otherUsers, user]
            io.to(socketId).emit('question',{            
                ...question,
                questionIndex:questionIndex,
                res:"success"
            });
        }else{
            console.log("cannot find user")
        }
    })

    socket.on('getRoomMembers',(roomId,username)=>{
        const room = rooms.find(room => room.roomId === roomId);
        const res = [];
        room.users.map(user => { 
            if(user!=username){
                const tempUser = users.find(u=>u.username==user);
                const temp = {
                    username:user, 
                    score:tempUser.score, 
                    socketId:tempUser.socketId
                }
                res.push(temp);
            }
        });
        console.log("sending roomMembers",roomId,username,res,socket.id)
        io.to(socket.id).emit('room-members',res,socket.id);
    })

    socket.on('update-score',(socketId)=>{
        const otherUsers = users.filter(user=>user.socketId!=socketId);
        const user = users.find(user => user.socketId === socketId);
        user.score+=1;
        console.log("otherusers",otherUsers);
        console.log("user",user);
        users = [...otherUsers, user]
        // io.to(socketId).emit('update-score',{            
        //     score:users[users.indexOf(user)].score,
        //     username:users[users.indexOf(user)].username,
        //     socketId,
        //     res:"success"
        // });
        socket.broadcast.to(user.roomId).emit('update-score-broadcast',{            
            score:users[users.indexOf(user)].score,
            username:users[users.indexOf(user)].username,
            socketId,
            res:"success"
        })
    })

    socket.on('validate-roomId',(roomId)=>{
        const room = rooms.find(room => room.roomId === roomId);
        if(room){
            io.to(socket.id).emit('room-validated',{users: room.users,res:"success"});
        }else{
            io.to(socket.id).emit('room-validated',{res:"failed"});
        }
    })

    socket.on('join-room',(roomId,username,socketId)=>{
        const otherRooms = rooms.filter(room=>room.roomId!==roomId);
        const room = rooms.find(room => room.roomId === roomId);
        if(room){
            const user = { 
                socketId:socketId,
                roomId:roomId,
                username:username,
                score:0,
                questionSequence:generateQuestionSequence(room.questions),
                currentQuestionIndex:0
            };
            users.push(user);
            socket.join(roomId);
            room.users.push(username);
            rooms = [...otherRooms, room]
            console.log(`User ${username}:${socketId}:${socket.id} joined room ${roomId}`);
            socket.broadcast.to(roomId).emit('user-joined-broadcast', {...{username:user.username,score:user.score,socketId:user.socketId},res:"success"});
        }else{
            io.to(socketId).emit('room-join-failed',{res:"failed"});
        }
    })

    socket.on('user-disconnected', (socketId,roomId,username) => {
        users = users.filter(user=>user.socketId!=socketId);
        rooms = rooms.map(room => {
            if (room.roomId === roomId) {
                const updatedUsers = room.users.filter(user => user !== username);
                return updatedUsers.length > 0 ? { ...room, users: updatedUsers } : null;
            }
            return room;
        }).filter(room => room !== null); // Remove empty rooms
        socket.disconnect();
        console.log('user disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


/*
rooms = [
    {
        roomId:"",
        usersnames:[],
        questions:[],
    }
]

users = [
    {
        socketId:"",
        roomId:"",
        username:"",
        score:0
        questionSequence:[]
        currentQuestionIndex:0
    }
]
*/