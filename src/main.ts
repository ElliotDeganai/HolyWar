
import Case from "./entities/case/model/case";
import Field from "./entities/field/model/field";
import LogicField from "./entities/field/logic/logicField";

let fieldForGame = LogicField.generateMap(6, 8);

LogicField.paintField(document.getElementById("fight"), fieldForGame);

LogicField.setWeapon(fieldForGame);

LogicField.setCharacters(fieldForGame);

