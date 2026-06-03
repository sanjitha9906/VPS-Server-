require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { Client } = require("ssh2");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Frontend Connected");

  const ssh = new Client();

  ssh.on("ready", () => {
    console.log("SSH Connected Successfully");

    socket.emit(
      "output",
      "\r\n✅ Connected To VPS Successfully\r\n"
    );

    ssh.shell((err, stream) => {
      if (err) {
        console.log(err);

        socket.emit(
          "output",
          "\r\n❌ Failed To Open Shell\r\n"
        );

        return;
      }

      socket.on("command", (command) => {
        stream.write(command + "\n");
      });

      stream.on("data", (data) => {
        socket.emit("output", data.toString());
      });

      stream.stderr.on("data", (data) => {
        socket.emit("output", data.toString());
      });

      socket.on("disconnect", () => {
        ssh.end();
      });
    });
  });

  ssh.on("error", (err) => {
    console.log("SSH ERROR:", err.message);

    socket.emit(
      "output",
      `\r\n❌ SSH Error: ${err.message}\r\n`
    );
  });

  ssh.connect({
    host: process.env.SSH_HOST,
    port: Number(process.env.SSH_PORT),
    username: process.env.SSH_USER,
    password: process.env.SSH_PASS,

    // IMPORTANT FIX
    tryKeyboard: true,
  });
});

server.listen(5000, () => {
  console.log("SSH Server Running On Port 5000");
});