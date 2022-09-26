import { createServer } from "http";
import express from "express";
import "express-async-errors";
import { config } from "dotenv";
import { chats } from "./data/data.js";
import connectDB from "./config/db.js";
import userRouter from "./routes/user.js";
import chatRouter from "./routes/chat.js";
import messagesRouter from "./routes/message.js";
import notificationRouter from "./routes/notification.js";
import { Server } from "socket.io";
import cors from "cors";
import cloudinary from "cloudinary";
import mailTransporter from "./config/mailTransporter.js";
// error handler middlewares
import notFoundMiddleware from "./middlewares/not-found.js";
import errorHandlerMiddleware from "./middlewares/error-handler.js";

// authentication middlewares
import authenticateUser from "./middlewares/authentication.js";

config();
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

//cloudinary configurations
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// middlewares
app.use(express.json({ limit: "50mb" }));
app.use(cors());

// routes
// !---------------------------------------------------------------- Check------------------------------------------------
app.get("/", (req, res) => {
  res.send("<h1>Welcome !!! This is your chatApp server</h1>");
});

app.get("/api/v1/chats", (req, res) => {
  res.send(chats);
});
app.post("/api/v1/chats/:id", (req, res) => {
  let chat = chats.find((e) => e.id === req.params._id);
  res.send(chat);
});

app.get("/sendemail", async (req, res) => {
  let mailDetails = {
    from: `"Fred Foo 👍" <noreply.snappychats@gmail.com>`,
    to: "jindalpraval791@gmail.com",
    subject: "Test mail",
    text: "Node.js testing mail for GeeksforGeeks",
  };

  mailTransporter.sendMail(mailDetails, (err, data) => {
    if (err) {
      res.json({ err, data });
    } else {
      res.json({ msg: "Email sent successfully" });
    }
  });
});

// !---------------------------------------------------------------- Check------------------------------------------------

// user routes
app.use("/api/v1/user", userRouter);
// chat routes
app.use("/api/v1/chat", authenticateUser, chatRouter);
// messages routes
app.use("/api/v1/message", authenticateUser, messagesRouter);
// notification routes
app.use("/api/v1/notification", authenticateUser, notificationRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const url = process.env.MONGO_URI;

// starting of server and creating the sockets
const start = async () => {
  try {
    await connectDB(url).then((c) => {
      console.log(`Mongodb is connected to: ${c.connection.host} `);
    });

    io.on("connection", (socket) => {
      console.log("connection established");

      socket.on("setup", (userId) => {
        socket.join(userId);
        socket.emit("connected");
      });

      socket.on("join chat", (room) => {
        socket.join(room);
      });

      socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        if (!chat.users) return console.log("Chat users not defined");
        chat.users.forEach((user) => {
          if (user._id == newMessageReceived.sender._id) return;
          socket.in(user._id).emit("message received", newMessageReceived);
        });
      });

      socket.on("typing", ({ room, userId }) => {
        // console.log(room, userId, "start");
        return socket.in(room).emit("typing", { room, userId });
      });

      socket.on("stop typing", ({ room, userId }) => {
        // console.log(room, userId);
        return socket.in(room).emit("stop typing", { room, userId });
      });

      socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userId);
      });
    });

    httpServer.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
