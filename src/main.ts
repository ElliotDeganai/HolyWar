
import Case from "./entities/case/model/case";
import Field from "./entities/field/model/field";
import LogicField from "./entities/field/logic/logicField";
import GameManager from "./entities/gameManager";

let gameManager = new GameManager();
gameManager.startGame();
gameManager.movePlayer();

