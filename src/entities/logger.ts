import Case from "./case/model/case";
import Field from "./field/model/field";
import LogicField from "./field/logic/logicField";
import CaseLogic from "./case/logic/caseLogic";
import Weapon from "./weapon/model/weapon";
import LogicWeapon from "./weapon/logic/logicWeapon";
import Character from "./character/model/character";
import LogicCharacter from "./character/logic/logicCharacter";
import Coord from "./coord/model/coord";

class Logger {
    activity: string;
    $el: HTMLElement;

    constructor() {
        this.activity = "";

        this.$el = document.getElementById('activity');
    }

writteDescription(text: string){
    this.activity = text;

}



}
export default Logger;