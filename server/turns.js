import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const matchDataPath = path.join(__dirname, "../match.json");

//const matchFilePath = path.join("../match.json");
let rotationStarted = false;
const matchData = JSON.parse(fs.readFileSync(matchDataPath, "utf8"));
let turnTimeout;

function createCircularList(matchData) {
  const circularList = [];
  const blueTeam = matchData.teams.blue.players;
  const redTeam = matchData.teams.red.players;

  const maxLength = Math.max(blueTeam.length, redTeam.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < blueTeam.length) {
      circularList.push({ side: "blue", idUser: blueTeam[i].idUser });
    }
    if (i < redTeam.length) {
      circularList.push({ side: "red", idUser: redTeam[i].idUser });
    }
  }

  return circularList;
}

export const circularList = createCircularList(matchData);
let nextTurnFunction;

export function startTurnRotation(circularList, io) {
  if (rotationStarted) {
    console.log("Turn rotation already started.");
    return;
  }

  let index = 0;

  const nextTurn = () => {
    const currentHero = circularList[index];
    console.log(circularList, " lista");
    io.emit("turnInfo", { idUser: currentHero.idUser, side: currentHero.side });
    console.log(
      `Turno del héroe con ID: ${currentHero.idUser}, Lado: ${currentHero.side}`
    );

    index = (index + 1) % circularList.length;

    turnTimeout = setTimeout(nextTurn, 30000);
  };

  nextTurn();

  nextTurnFunction = () => {
    clearTimeout(turnTimeout);
    nextTurn();
  };

  rotationStarted = true; // Set flag to true
}

export function callNextTurn() {
  if (nextTurnFunction) {
    nextTurnFunction();
  } else {
    console.error("Turn rotation has not started.");
  }
}
