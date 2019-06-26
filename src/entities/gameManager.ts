import Case from "./case/model/case";
import Field from "./field/model/field";
import LogicField from "./field/logic/logicField";
import CaseLogic from "./case/logic/caseLogic";
import Weapon from "./weapon/model/weapon";
import LogicWeapon from "./weapon/logic/logicWeapon";
import Character from "./character/model/character";
import LogicCharacter from "./character/logic/logicCharacter";
import Coord from "./coord/model/coord";

class GameManager {
    field: Field;
    id: string = 'fight';
    players: Array<Character>;
    playerTour: Character;
    maxMove: number = 3;

    $el: HTMLElement;

    /**
     *
     */
    constructor() {
        this.players = new Array<Character>();
        this.$el = document.getElementById(this.id);
    }

    setGameManager(){
        for(let rowField of this.field.cases){
            for(let caseToUpdate of rowField){
                caseToUpdate.gameManager = this;
            }
        }
    }

    startGame() {
        console.log('starting game...');

        let field = LogicField.generateMap(10, 10);

        LogicField.paintField(document.getElementById("fight"), field);

        LogicField.setWeapon(field);

        LogicField.setCharacters(field);

        // First Player start
        this.playerTour = field.characters[0];

        this.field = field;

        this.setGameManager();



        console.log('The player ' + this.playerTour.name + ' can play.');
    }

    showReachableCase(){
        for(let col=0; col < this.field.size.x; col++){
            for(let row=0; row < this.field.size.y; row++){
                let caseToCheck = this.field.cases[col][row];
                let blockFaced = 0;
            if(this.playerTour.isCaseReachable(caseToCheck, this.field) === true && caseToCheck !== this.playerTour.case){
                caseToCheck.$el.classList.add("case-reachable");
            }
        }
    }
    }



    
}
export default GameManager;