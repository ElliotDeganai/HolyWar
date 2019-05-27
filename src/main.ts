
import Case from "./entities/case/model/case";
import Field from "./entities/field/model/field";
import LogicField from "./entities/field/logic/logicField";

let fieldForGame = LogicField.generateMap(8, 6);

LogicField.paintField(document.getElementById("fight"), fieldForGame);

