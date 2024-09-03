import express from "express";
import logger from "morgan";

import { Server } from "socket.io";
import { createServer } from "node:http";
import {
  loadMatchFile,
  saveMatchFile,
  addPlayerToTeam,
  affectSkills,
  affectPlayerHealth,
} from "./match.loader.js";
import { circularList, startTurnRotation, callNextTurn } from "./turns.js";

const port = process.env.PORT ?? 3000;
//const users = [];
const app = express();
const server = createServer(app);
//const io = new Server(server)
const io = new Server(server, {
  cors: {
    origin: "*", // esto hay que cambiarlo a la url del cliente cuando se despliegue
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user has connected!", socket.id);
  // if (!users.includes(socket.id)) {
  socket.on("bindInfo", (bindInfo) => {
    // console.log("Información recibida: ", bindInfo);
    addPlayerToTeam(bindInfo);
    const matchInfo = loadMatchFile();
    //saveMatchFile(matchInfo)
    console.log("match.json actualizado!");
    io.emit("newUser", matchInfo);
    //users.push(socket.id);
  });
  //}

  // recibe la notificacion del cliente que creo la partida que inicie la batalla
  socket.on("startBattle", (msg) => {
    // le notifica al resto que tienen que actualizar el front
    //io.emit('startBattle', msg)
    startTurnRotation(circularList, io);
  });

  socket.on("passTurn", () => {
    console.log("Paso turno!");
    callNextTurn(); // Trigger the next turn
  });

  /*
    socket.on('chat message', (msg) => {
        console.log(msg)
        io.emit('chat message', "perra puta sunga rastrera")
        io.emit('chat message', msg)
    })*/

  socket.on("useProduct", (productInfo) => {
    console.log("usó producto, " + productInfo);
    affectSkills(productInfo.target, productInfo.product);
    io.emit("productUsed", loadMatchFile()); // esto se usa solo pa enviar el match file cargado después de actualizar al usuario
  });

  socket.on("useAttack", (attackInfo) => {
    console.log("atacó");
    affectPlayerHealth(attackInfo.perpetratorId, attackInfo.victimId);
    io.emit("attackUsed", loadMatchFile());
  });

  socket.on("getMatch", () => {
    console.log("se pasó match");
    io.emit("actualMatch", loadMatchFile()); // esto se usa solo pa enviar el match file cargado después de actualizar al usuario
  });

  socket.on("disconnect", () => {
    console.log(`the user ${socket.id} has disconnected`);
  });
});

app.use(logger("dev"));

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/client/index.html");
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
