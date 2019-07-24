import Case from "./case/model/case";
import Field from "./field/model/field";
import LogicField from "./field/logic/logicField";
import CaseLogic from "./case/logic/caseLogic";
import Weapon from "./weapon/model/weapon";
import LogicWeapon from "./weapon/logic/logicWeapon";
import Character from "./character/model/character";
import LogicCharacter from "./character/logic/logicCharacter";
import Coord from "./coord/model/coord";
import GameManager from "./gameManager";

class Logger {
    activity: Array<string>;
    $el: HTMLElement;

    constructor() {
        this.activity = Array<string>();

        this.$el = document.getElementById('activity-item-list');
    }

writteDescription(text: string, gameManager: GameManager, speaker:Character = null){
    let activityElt = this.$el;
    this.activity.push(text);
    let lastActivityIndice = this.activity.length-1;
    let divTextElt = document.createElement("div");
    let textColorClass: string;
    if(speaker === gameManager.players[0]){
        textColorClass = "player0";
    }else if(speaker === gameManager.players[1]){
        textColorClass = "player1";
    }else{
        textColorClass = "system";
    }

    let itemList = document.getElementsByClassName('last-item');
    if(itemList[0] !== undefined && itemList[0] !== null){
    itemList[0].classList.remove('last-item');
    }

    divTextElt.textContent = this.activity[lastActivityIndice];

    
    activityElt.insertAdjacentHTML('afterbegin', '<div class="activity-item last-item '+ textColorClass + '">'+ this.activity[lastActivityIndice] +'</div>');


}



}
export default Logger;