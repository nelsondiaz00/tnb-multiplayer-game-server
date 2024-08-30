export class GameSettings {
  static bluePlayers = 0;
  static blueDead = 0;
  static redPlayers = 0;
  static redDead = 0;

  static addBlueDead() {
    this.blueDead++;
  }
  static addRedDead() {
    this.redDead++;
  }
  static getBlueDead() {
    return this.blueDead;
  }
  static getRedDead() {
    return this.redDead;
  }

  static setBluePlayers(val) {
    this.bluePlayers = val;
  }
  static setRedPlayers(val) {
    this.redPlayers = val;
  }
  static getBluePlayers() {
    return this.bluePlayers;
  }
  static getRedPlayers() {
    return this.redPlayers;
  }
}
