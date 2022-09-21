// require("./utils/db");
const express = require("express");
const http = require("http");
const cors = require("cors");
const port = 2222;
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);

const room = {};

const { Server } = require("socket.io");
const io = new Server(server, { cors: "*" },);


app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
    res.send("Ths Socket io");
});

// const url = "mongodb+srv://Davidokih:dav517id@cluster0.1nweu.mongodb.net/socketIO?retryWrites=true&w=majority";

// mongoose.connect(url).then(() => {
//     console.log("connected to database");
// }).catch((err) => {
//     console.log(err);
// });

// const db = mongoose.connection;

// db.on("open", () => {
//     const observer = db.collection("users").watch();

//     observer.on("change", (change) => {
//         if (change.operationType === "insert") {
//             const newData = {
//                 name: change.fullDocument.name,
//                 _id: change.fullDocument._id,
//                 like: change.fullDocument.like
//             };
//             io.emit('newEntry', newData);
//         }
//     });
// });
io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("join room", roomID => {
        if (room[ roomID ]) {
            room[ roomID ].push(socket.id);
        } else {
            room[ roomID ] = socket.id;
        }

        const otherUser = room[ roomID ].find((id) => id !== socket.io);
        if (otherUser) {
            socket.emit("other user", other);
            socket.to(otherUser).emit("other joined", socket.id);
        }
    });

    socket.on("offer", payload => {
        io.to(payload.target).emit("offer", payload);
    });
    socket.on("answer", payload => {
        io.to(payload.target).emit("answer", payload);
    });
    socket.on("ice-candidate", (incoming) => {
        io.to(incoming.target).emit("ice-candidate", incoming);
    });
});

server.listen(port, () => {
    console.log("connected to ", port);
});