const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const fileUpload = require("express-fileupload");
const userRouter = require("./router/user.router");
const messageRouter = require("./router/message.router");
const { default: mongoose } = require("mongoose");
const { restrictUserAuth } = require("./middleware/authUser");
const { initSocket } = require("./service/webSocket");

// connecting mongoDb :-
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log("mongoDB connected.."))
  .catch((err) => console.log("error in connecting mongoDB", err));

// Initialize socket.io
initSocket(server);

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(fileUpload({ useTempFiles: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "hello chitchat users..." }).status(200);
});

app.use("/user", userRouter);

app.use("/message", restrictUserAuth, messageRouter);

server.listen(5001, () => {
  console.log("server is running at port 5001");
});
