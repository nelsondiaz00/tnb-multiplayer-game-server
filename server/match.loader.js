import path from "path";
import fs from "fs";
import { GameSettings } from "./game.settings.js";
import { fileURLToPath } from "url";
import { console } from "inspector";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const matchFilePath = path.join(__dirname, "../match.json");
console.log(matchFilePath, " ????");
//const matchFilePath = path.join("../match.json");

export function loadMatchFile() {
  const data = fs.readFileSync(matchFilePath, "utf8");
  return JSON.parse(data);
}

export function saveMatchFile(matchData) {
  const data = JSON.stringify(matchData, null, 2);
  fs.writeFileSync(matchFilePath, data, "utf8");
}

export function addPlayerToTeam(bindInfo) {
  const matchData = loadMatchFile();

  const teamSide = bindInfo.teamSide;
  const team = matchData.teams[teamSide];

  if (team) {
    team.players.push({
      teamSide: bindInfo.teamSide,
      idUser: bindInfo.idUser,
      type: bindInfo.type,
      subtype: bindInfo.subtype,
      attributes: bindInfo.attributes,
      products: bindInfo.products,
      alive: bindInfo.alive,
    });
  } else {
    console.error(`El equipo ${teamSide} no existe en el archivo match.json.`);
  }

  saveMatchFile(matchData);
}

function getPlayer(idUser, matchData) {
  let user;
  Object.keys(matchData.teams).forEach((teamKey) => {
    const team = matchData.teams[teamKey];
    const foundUser = team.players.find((player) => player.idUser === idUser);
    if (foundUser) {
      user = foundUser;
    }
  });

  if (!user) {
    console.error(`Usuario con id ${idUser} no encontrado.`);
    return;
  } else return user;
}

function getTeam(idUser, matchData) {
  let user;
  let team;
  Object.keys(matchData.teams).forEach((teamKey) => {
    team = matchData.teams[teamKey];
    const foundUser = team.players.find((player) => player.idUser === idUser);
    if (foundUser) user = foundUser;
  });

  if (!user) {
    console.error(`Usuario con id ${idUser} no encontrado.`);
    return;
  } else return team;
}

export function affectSkills(idUser, idProduct) {
  const matchData = loadMatchFile();

  let user = getPlayer(idUser, matchData);

  console.log(user);

  const product = user.products.find(
    (product) => product.idProduct === idProduct
  );
  if (!product) {
    console.error(
      `Producto con id ${idProduct} no encontrado para el usuario ${idUser}.`
    );
    return;
  }
  console.log(product);

  applyEffectsToPlayer(user, product, matchData);
}

function applyEffectsToPlayer(player, product, matchData) {
  product.effects.forEach((effect) => {
    const attributeName = effect.attributeName;
    const operator = effect.mathOperator;
    const value = effect.value;

    const attribute = player.attributes[attributeName];

    attribute.value = eval(attribute.value + operator + value);
    /*
        if (attribute) {
            switch (operator) {
                case '+':
                    attribute.value += value;
                    break;
                case '-':
                    attribute.value -= value;
                    break;
                case '*':
                    attribute.value *= value;
                    break;
                default:
                    console.warn(`Operador no reconocido: ${operator}`);
            }*/

    //attribute.value = Math.max(attribute.valueMin, Math.min(attribute.valueMax, attribute.value));
    /*} else {
            console.warn(`Atributo no encontrado: ${attributeName}`);
        }*/
  });

  console.log("guardando!!!");
  saveMatchFile(matchData);
}

export function affectPlayerHealth(perpetratorId, victimId) {
  const matchData = loadMatchFile();
  console.log("recibidos: " + perpetratorId + " - " + victimId);
  let perpetrator = getPlayer(perpetratorId, matchData);
  let victim = getPlayer(victimId, matchData);

  // console.log("perpetrator: ", perpetrator);
  // console.log("victim: ", victim);

  // lo que le bajo de blood a la victima sale de damage del victimario
  const damage = perpetrator.attributes["damage"].value;
  const blood = victim.attributes["blood"];

  if (blood.value - damage > 0) blood.value = eval(blood.value - damage);
  else {
    blood.value = 0;
    victim.alive = false;

    const team = getTeam(perpetratorId, matchData);
    if (team.name == "red") GameSettings.addRedDead();
    else if (team.name == "blue") GameSettings.addBlueDead();
    else console.error("??????Error al saber a donde pertenece el muerto");

    if (
      GameSettings.getRedDead == GameSettings.getRedPlayers ||
      GameSettings.getBlueDead == GameSettings.getBluePlayers
    ) {
      team.alive = false;
      //endMatch()?
    }
  }

  console.log("guardando daño");
  saveMatchFile(matchData);
}
