import Case from "./case/model/case";
import Field from "./field/model/field";
import LogicField from "./field/logic/logicField";
import CaseLogic from "./case/logic/caseLogic";
import Weapon from "./weapon/model/weapon";
import LogicWeapon from "./weapon/logic/logicWeapon";
import Character from "./character/model/character";
import LogicCharacter from "./character/logic/logicCharacter";
import Coord from "./coord/model/coord";
import Logger from "./logger";
import MenuManager from "./menuManager";

class GameManager {
    field: Field;
    id: string = 'fight';
    players: Array<Character>;
    playerTour: Character;
    maxMove: number = 3;
    logger: Logger;
    menuManager: MenuManager;

    $el: HTMLElement;

    /**
     *
     */
    constructor() {
        this.players = new Array<Character>();
        this.logger = new Logger();
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
        this.logger.writteDescription('starting game...');
        console.log('starting game...');

        let field = LogicField.generateMap(8, 8);

        this.field = field;

        this.setGameManager();

        LogicField.paintField(document.getElementById("fight"), field);

        LogicField.setWeapon(field);

        LogicField.setCharacters(field);

        // First Player start
        this.playerTour = field.characters[0];
        MenuManager.setMenu(this);



        this.showReachableCase();

        this.logger.writteDescription('The player ' + this.playerTour.name + ' can play.');
        console.log('The player ' + this.playerTour.name + ' can play.');
    }

    showReachableCase(){
        for(let col=0; col < this.field.size.x; col++){
            for(let row=0; row < this.field.size.y; row++){
                let caseToCheck = this.field.cases[col][row];
            if(this.playerTour.isCaseReachable(caseToCheck, this.field) === true && caseToCheck !== this.playerTour.case){
                caseToCheck.$el.classList.add("case-reachable");
            }
        }
    }
    }



    
}
export default GameManager;