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
    console.log("Co nguoi ket noi : " + socket.id );

    socket.on('Created', (data) => {
        socket.emit('Created',data)
    })

    socket.on('chat-message', (data) => {
        socket.broadcast.emit('chat-message',data)
    })
})

//start server
const port = app.get('port') || 3000
server.listen(port, () => console.log(`Server listening on port ${port}`))