import Case from "./case/model/case";
import Field from "./field/model/field";
import LogicField from "./field/logic/logicField";
import CaseLogic from "./case/logic/caseLogic";
import Weapon from "./weapon/model/weapon";
import LogicWeapon from "./weapon/logic/logicWeapon";
import Character from "./character/model/character";
import LogicCharacter from "./character/logic/logicCharacter";
import Coord from "./coord/model/coord";

class MenuManager {
    field: Field;
    id: string = 'menu';
    players: Array<Character>;
    playerTour: Character;

    $el: HTMLElement;

    /**
     *
     */
    constructor() {
        this.players = new Array<Character>();
        this.$el = document.getElementById(this.id);
    }

    setMenu(){
        let perso1BlockElt = document.createElement("div");
        perso1BlockElt.style.position = "absolute";
    }


}

