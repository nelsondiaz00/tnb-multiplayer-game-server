import fs from "fs";
import path from "path";
import { GameSettings } from "../server/game.settings.js";
import {
  loadMatchFile,
  saveMatchFile,
  addPlayerToTeam,
  affectSkills,
  affectPlayerHealth,
} from "../server/match.loader.js";

jest.mock("fs");

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const mockMatchFilePath = path.join("../match.json");

describe("Game Functions Tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    GameSettings.bluePlayers = 0;
    GameSettings.redPlayers = 0;
    GameSettings.blueDead = 0;
    GameSettings.redDead = 0;
  });

  test("loadMatchFile should return parsed JSON data", () => {
    const mockData = { teams: {} };
    fs.readFileSync.mockReturnValue(JSON.stringify(mockData));

    const result = loadMatchFile();
    expect(result).toEqual(mockData);
  });

  test("saveMatchFile should write JSON data to file", () => {
    const mockData = { teams: { blue: { players: [] } } };
    saveMatchFile(mockData);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      mockMatchFilePath,
      JSON.stringify(mockData, null, 2),
      "utf8"
    );
  });

  // test("addPlayerToTeam should add player to the correct team", () => {
  //   const playerInfo = {
  //     teamSide: "blue",
  //     idUser: "1",
  //     type: "warrior",
  //     subtype: "knight",
  //     attributes: {},
  //     products: [],
  //   };
  //   console.log(
  //     playerInfo,
  //     " ME UI SFUSHDAKJHSFKHSJF,SDLJKLSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSJDSKFH"
  //   );

  //   const updatedData = addPlayerToTeam(playerInfo);
  //   expect(updatedData.teams.blue.players).toContainEqual(playerInfo);
  // });

  // test("affectSkills should apply product effects to player attributes", () => {
  //   const mockData = {
  //     teams: {
  //       blue: {
  //         players: [
  //           {
  //             idUser: "1",
  //             attributes: {
  //               health: {
  //                 name: "health",
  //                 value: 10,
  //                 valueMin: 0,
  //                 valueMax: 0,
  //               },
  //             },
  //             products: [
  //               {
  //                 idProduct: "p1",
  //                 effects: [
  //                   {
  //                     attributeName: "health",
  //                     mathOperator: "+",
  //                     turns: 0,
  //                     target: "ally",
  //                     value: 5,
  //                     valueCaused: 5,
  //                   },
  //                 ],
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     },
  //   };
  //   fs.readFileSync.mockReturnValue(JSON.stringify(mockData));

  //   affectSkills("1", "p1");
  //   // const updatedData = JSON.parse(fs.readFileSync.mock.results[0].value);

  //   expect(match.teams.blue.players[0].attributes.health.value).toBe(15);
  // });

  //   test("affectPlayerHealth should update health and handle death", () => {
  //     GameSettings.setBluePlayers(1);
  //     GameSettings.setRedPlayers(1);

  //     const mockData = {
  //       teams: {
  //         blue: {
  //           players: [
  //             { idUser: "1", attributes: { health: { value: 10 } }, alive: true },
  //           ],
  //         },
  //         red: {
  //           players: [
  //             { idUser: "2", attributes: { damage: { value: 5 } }, alive: true },
  //           ],
  //         },
  //       },
  //     };
  //     fs.readFileSync.mockReturnValue(JSON.stringify(mockData));

  //     affectPlayerHealth("2", "1");
  //     const updatedData = JSON.parse(fs.readFileSync.mock.results[0].value);

  //     expect(updatedData.teams.blue.players[0].attributes.health.value).toBe(5);
  //     expect(GameSettings.getBlueDead()).toBe(0);
  //     expect(GameSettings.getRedDead()).toBe(1);
});
