import fs from "fs";
import {
  circularList,
  startTurnRotation,
  callNextTurn,
} from "../server/turns.js";

jest.mock("fs");

describe("Turn Rotation Tests", () => {
  let ioMock;

  beforeEach(() => {
    // Mocking fs.readFileSync to return mock data
    const mockData = {
      teams: {
        blue: {
          players: [{ idUser: "blue1" }, { idUser: "blue2" }],
        },
        red: {
          players: [{ idUser: "red1" }, { idUser: "red2" }],
        },
      },
    };

    fs.readFileSync.mockReturnValue(JSON.stringify(mockData));
    jest.useFakeTimers(); // To mock timers
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });

  test("startTurnRotation should start turn rotation and emit events", () => {
    ioMock = { emit: jest.fn() }; // Mocking io.emit
    const circularList = require("../server/turns.js").circularList;

    startTurnRotation(circularList, ioMock);

    // Check if io.emit was called with the correct arguments
    expect(ioMock.emit).toHaveBeenCalledWith("turnInfo", {
      idUser: "blue1",
      side: "blue",
    });

    // Simulate the passing of time to verify the rotation
    jest.advanceTimersByTime(5000);

    // Check if the next hero's turn is emitted
    expect(ioMock.emit).toHaveBeenCalledWith("turnInfo", {
      idUser: "blue2",
      side: "blue",
    });

    // Call nextTurnFunction directly
    callNextTurn();
    expect(ioMock.emit).toHaveBeenCalledWith("turnInfo", {
      idUser: "red1",
      side: "red",
    });
  });

  test("callNextTurn should call nextTurnFunction if rotation started", () => {
    ioMock = { emit: jest.fn() };
    const circularList = require("../server/turns.js").circularList;

    startTurnRotation(circularList, ioMock);

    // Advance timers to simulate the next turn
    jest.advanceTimersByTime(5000);

    // Mocking nextTurnFunction
    const nextTurnFunction = require("../server/turns.js").nextTurnFunction;

    // Mock nextTurnFunction
    const nextTurnFunctionMock = jest.fn();
    nextTurnFunctionMock.mockImplementation(() => {
      ioMock.emit("turnInfo", { idUser: "red2", side: "red" });
    });

    require("../server/turns.js").nextTurnFunction = nextTurnFunctionMock;

    callNextTurn();

    // Verify nextTurnFunction was called
    expect(nextTurnFunctionMock).toHaveBeenCalled();
    expect(ioMock.emit).toHaveBeenCalledWith("turnInfo", {
      idUser: "red2",
      side: "red",
    });
  });

  test("callNextTurn should report error if rotation has not started", () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    callNextTurn();
    expect(consoleSpy).toHaveBeenCalledWith("Turn rotation has not started.");
    consoleSpy.mockRestore();
  });
});
