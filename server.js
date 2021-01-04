//config env 
require('dotenv').config()

const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
var server = require("http").Server(app);
var io = require("socket.io")(server);


//import config
const db = require('./config/key').MongoURI
// connect to mongo
mongoose.connect(db,{
    useCreateIndex: true,
    useNewUrlParser : true,
    useUnifiedTopology: true
    })
    .then(() => console.log(`Mongo connected`))
    .catch(err => console.log(err))

//import route
const userRoute = require('./routes/user')
const deckRoute = require('./routes/deck')
const reviewRoute = require('./routes/review')
const addressRoute = require('./routes/address')
const messageRoute = require('./routes/message')
const groupRoute = require('./routes/group')
const adminRoute = require('./routes/admin')
// Middleware

app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(helmet())

//Routes
app.use('/api/auth',userRoute)
app.use('/decks',deckRoute)
app.use('/reviews',reviewRoute)
app.use('/address',addressRoute)
app.use('/message',messageRoute)
app.use('/groups',groupRoute)
app.use('/admin',adminRoute)


//Catch error
app.use((req,res,next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})


//Error function
app.use((err,req,res,next) =>  {
    const error = app.get('env') === 'development' ? err : {} ;
    const status = err.status || 500

    //response to client 
    return res.status(status).json({
        error: {
            message : error.message
        }
    })
})


//Socket 


io.on("connection",(socket) => {

    socket.on('Created', (data) => {
        console.log('Co nguoi ket noi ' + data.user)
    })

    socket.on('chat-message' , async  (data) => {
        socket.broadcast.emit('chat-message',data)
    })

    socket.on('typing' , (data) => {
        socket.broadcast.emit('typing', data)
    })
    socket.on('stopTyping' , (data) => {
        socket.broadcast.emit('stopTyping',data)
    })
    socket.on('joined',(data) => {
        socket.broadcast.emit('joined',data)
    })
    //  user comment 
    socket.on('user-comment', (data) => {
        console.log(data.user)
        io.sockets.emit("user-comment",data )
     })
})

app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
 });

//start server
const port = app.get('port') || 3000
server.listen(port, () => console.log(`Server listening on port ${port}`))