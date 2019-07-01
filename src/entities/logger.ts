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
    activity: Array<string>;
    $el: HTMLElement;

    constructor() {
        this.activity = Array<string>();

        this.$el = document.getElementById('activity-item-list');
    }

writteDescription(text: string){
    let activityElt = this.$el;
    this.activity.push(text);
    let lastActivityIndice = this.activity.length-1;
    let divElt = document.createElement("div");
    let divTextElt = document.createElement("div");

    let itemList = document.getElementsByClassName('last-item');
    if(itemList[0] !== undefined && itemList[0] !== null){
    itemList[0].classList.remove('last-item');
    }

    divTextElt.textContent = this.activity[lastActivityIndice];

    
    activityElt.insertAdjacentHTML('afterbegin', '<div class="activity-item last-item">'+ this.activity[lastActivityIndice] +'</div>');


}



}
export default Logger;