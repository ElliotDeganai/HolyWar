import CaseLogic from "../../case/logic/caseLogic";
import Coord from "../../coord/model/coord";
import Weapon from "../../weapon/model/weapon";
import LogicWeapon from "../../weapon/logic/logicWeapon";
import Field from "../../field/model/field";
import Character from "../../character/model/character";
import GameManager from "../../gameManager";

class Case {
    //field 
    imgUrl: string;
    isBlocked: boolean;
    isAvailable: boolean;
    position: Coord;
    positionString: string;
    type: string;
    weapon: Weapon;
    gameManager: GameManager;
    $el: HTMLElement;

    //constructor 
    constructor(position: Coord, type: string = CaseLogic.NORMAL, isAvailable: boolean = true) {

        switch (type) {
            case CaseLogic.NORMAL:
                this.imgUrl = "/assets/img/normal-field/tile-2D.png";
                this.isBlocked = false;
                break;

            case CaseLogic.BLOCKED:
                this.imgUrl = "/assets/img/blocked-field/tile-2D.png";
                this.isBlocked = true;
                break;
        }
        this.isAvailable = isAvailable;
        this.position = position;
        this.positionString = String(position.x) + String(position.y);
        this.weapon = null;
    }

    casesAdjacent(caseToCheck: Case): Boolean{
        if(this.position.x === caseToCheck.position.x+1 || this.position.x === caseToCheck.position.x-1 || this.position.y === caseToCheck.position.y+1 || this.position.y === caseToCheck.position.y-1){
            return true;
        }else{
            return false;
        }
    }

    hasWeapon(){
        if(this.weapon !== null){
            return true;
        }else{
            return false;
        }
    }



    removeWeapon(){
        
        this.weapon.$el.remove();
        this.weapon = null;

    }

    addWeapon(field: Field, weapon: Weapon){
        this.weapon = weapon;
        LogicWeapon.paintWeapon(this, weapon, field);
    }

    setEl(element: HTMLElement): HTMLElement {
        this.$el = element;

        this.$el.onclick = (event: MouseEvent) => {
            this.onClick(event);
        };

        return this.$el;
    }

    onClick(event: MouseEvent): void{
 
            let casesElements = document.getElementsByClassName('case');
            let field = this.gameManager.field;

            for (let i = 0; i < casesElements.length; i++) {
                let casesElement = (<HTMLElement>casesElements[i]);
                casesElement.classList.remove('case-reachable');
            }
            
            var el = event.target||event.srcElement;
            let caseToGo = field.cases[this.position.x][this.position.y];

            // Do nothing if player select a Block Case
            if (caseToGo.isBlocked) {
                this.gameManager.showReachableCase();
                return;
            }
            //we get the element target
            
            this.gameManager.playerTour.moveTo(this.gameManager.field, caseToGo);

            
            this.gameManager.showReachableCase();

    }


}



export default Case;