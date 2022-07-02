const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { createServer } = require('http');
const { Server } = require('socket.io');
const { addUser, removeUser, getUser, getUsersInParking, changeSlot } = require('./utils/parking');
const queueCar = [];
const queueRoom = [];
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});
const DBSOURCE = "database.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        // ** EXAMPLE **
        // ** For a column with unique values **
        // email TEXT UNIQUE, 
        // with CONSTRAINT email_unique UNIQUE (email) 
    }
});



app.use(
    express.urlencoded({ extended: true }),
    express.json(),
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
)
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/parkings', (req, res) => {
    return res.send([
        {Id: 1, Name: 'HUST'},
        {Id: 2, Name: 'NEU'},
        {Id: 3, Name: 'NUCE'}
    ]);
})

app.post('/api/img', (req, res) => {
    const body = req.body;
    // io.in(0).emit('test', {data: 'asdasda'});

    if(!queueCar.includes(body.car_id)){
        io.in(queueCar.length).emit('data_comming', body);
        queueCar.push(body.car_id);
    }else{
        const roomid = queueCar.findIndex(element => element === body.car_id);
        io.in(roomid).emit('data_comming', body);
    }
    // var spawn = require("child_process").spawn; 
    // var process = spawn('python',["E:\\WorkSpace\\JavaScript-Project\\server-project-2\\src\\saveImage.py", body.src] );
    // process.stdout.on('data', function(data) {
    //     console.log(data.toString);
    //     res.send(data.toString());
    // } )
  
    res.send(body)  
})
 
io.on('connection', (socket) => {

    socket.on('join', () => { 
        socket.join(queueRoom.length); 
        queueRoom.push(socket.id);
    })

    socket.on('select_slot', ({userId, parking_id, slot_id}, callback) => {
        let result = changeSlot({userId: userId, parking_id, slot_id});
        console.log(getUsersInParking(parking_id))
        if(result.message) { 
            return callback(result.message)
        }
    })

    socket.on('out_parking', (userId) => {
        var user = removeUser(userId);
    })
})

httpServer.listen(8080, () => {
    console.log('listening on port 8080');
})


  