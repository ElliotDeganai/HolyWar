
import Case from "./entities/case/model/case";
import Field from "./entities/field/model/field";
import LogicField from "./entities/field/logic/logicField";
import GameManager from "./entities/gameManager";
import HttpHelper from "./helpers/httpHelper";

let gameManager = new GameManager();

HttpHelper.ajaxGet("http://localhost/royalFight/data/fight.json", (reponse: any) => {
    gameManager.startGame(reponse);
  });



