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
import Sound from "./sound";

class GameManager {
    field: Field;
    id: string = 'fight';
    players: Array<Character>;
    playerTour: Character;
    maxMove: number = 3;
    logger: Logger;
    menuManager: MenuManager;
    isFinished: boolean;
    soundBackground: Sound;
    soundFightBackground: Sound;
    soundPickUpWeapon: Sound;
    soundDefenseMode: Sound;

    $el: HTMLElement;

    /**
     *
     */
    constructor() {
        this.players = new Array<Character>();
        this.logger = new Logger();
        this.$el = document.getElementById(this.id);
        this.isFinished = false;
        this.soundBackground = new Sound('/assets/song/Dragon Ball Z Theme 3.mp3');
    }

    setGameManager(){
        for(let rowField of this.field.cases){
            for(let caseToUpdate of rowField){
                caseToUpdate.gameManager = this;
            }
        }
    }

    startGame() {
        this.logger.writteDescription('starting game...', this);
        console.log('starting game...');

        let field = LogicField.generateMap(10, 10);

        this.field = field;

        this.setGameManager();

        LogicField.paintField(document.getElementById("fight"), field);

        LogicField.setWeapon(field);

        LogicField.setCharacters(field);

        // First Player start
        this.playerTour = field.characters[0];
        MenuManager.setMenu(this);



        this.showReachableCase();

        this.logger.writteDescription(this.playerTour.name + ' can play.', this, this.playerTour);
        console.log('The player ' + this.playerTour.name + ' can play.');
        document.getElementById('arena').appendChild(this.soundBackground.$el);
        this.soundBackground.play();
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