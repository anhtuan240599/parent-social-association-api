//config env
require("dotenv").config();

const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const app = express({ cors: true });
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
var server = require("http").Server(app);
var io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:8888", "http://localhost:4000"],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    "http://localhost:8888",
    "http://localhost:4000"
  ); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Customer API",
      description: "Customer API information",
      version: "1.0.0",
    },
  },
  apis: ["./routes/swagger.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

//import config
const db = require("./config/key").MongoURI;
// connect to mongo
mongoose
  .connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Mongo connected`))
  .catch((err) => console.log(err));

//import route
const userRoute = require("./routes/user");
const deckRoute = require("./routes/deck");
const reviewRoute = require("./routes/review");
const addressRoute = require("./routes/address");
const messageRoute = require("./routes/message");
const groupRoute = require("./routes/group");
const adminRoute = require("./routes/admin");
const roomRoute = require("./routes/room");
const { type } = require("os");
const { getMaxListeners } = require("./model/User");
const { rejects } = require("assert");

// Middleware
app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(helmet());

//Routes
app.use("/api/auth", userRoute);
app.use("/decks", deckRoute);
app.use("/reviews", reviewRoute);
app.use("/address", addressRoute);
app.use("/message", messageRoute);
app.use("/groups", groupRoute);
app.use("/admin", adminRoute);
app.use("/rooms", roomRoute);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Catch error
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

//Error function
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;

  //response to client
  return res.status(status).json({
    error: {
      message: error.message,
    },
  });
});

//Socket

io.on("connection", (socket) => {
  socket.on("Created", (data) => {
    console.log("Co nguoi ket noi ", data.user);
  });
  socket.on("user_connected", function (username) {
    users[username] = socket.id;
    io.emit("user_connected", username);
  });
  // send message to room
  socket.on("chat-message", async (data) => {
    socket.to(socket.Room).to(socket.Room2).emit("chat-message", data);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });
  socket.on("stopTyping", (data) => {
    socket.broadcast.emit("stopTyping", data);
  });
  // create a room went user want to chat with another user
  socket.on("joined", async (data) => {
    socket.join(data.friend);
    socket.join(data.user);
    socket.Room = data.friend;
    socket.Room2 = data.user;
    console.log(socket.adapter.rooms);
    socket.broadcast.emit("joined", data);
  });
  //  user comment
  socket.on("user-comment", (data) => {
    io.sockets.emit("user-comment", data);
  });
});

//start server
const PORT = process.env.PORT || 3000;
server.listen(
  process.env.PORT || 3000,
  console.log(`server run on port ${PORT}`)
);
