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
import Sound from "./sound/model/sound";
import SoundLogic from "./sound/logic/logicSound";
import HttpHelper from "../helpers/httpHelper";

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
    soundAttack: Sound;
    parameters: any;

    $el: HTMLElement;

    /**
     *
     */
    constructor() {
        this.players = new Array<Character>();
        this.logger = new Logger();
        this.$el = document.getElementById(this.id);
        this.isFinished = false;

        this.soundBackground = new Sound(SoundLogic.soundBackground);
        this.soundBackground.$el.id = "audio-background";
        this.soundBackground.$el.loop = true;

        this.soundFightBackground = new Sound(SoundLogic.soundFightBackground);
        this.soundFightBackground.$el.id = "audio-background-fight";
        this.soundFightBackground.$el.loop = true;

        this.soundPickUpWeapon = new Sound(SoundLogic.soundPickUpWeapon);
        this.soundPickUpWeapon.$el.id = "audio-pick-up";

        this.soundDefenseMode = new Sound(SoundLogic.soundDefenseMode);
        this.soundDefenseMode.$el.id = "audio-defense";

        this.soundAttack = new Sound('/assets/song/steelsword.mp3');
        this.soundAttack.$el.id = "audio-attack";
    }

    setGameManager(){
        for(let rowField of this.field.cases){
            for(let caseToUpdate of rowField){
                caseToUpdate.gameManager = this;
            }
        }
    }

    startGame(reponse: any) {

        this.parameters = JSON.parse(reponse);


        let loadingCount = 0;
        this.logger.writteDescription('starting game...', this);
        console.log('starting game...');

        let field = LogicField.generateMap(this.parameters.general[0].field_dimension_x, this.parameters.general[0].field_dimension_y);
        

        this.field = field;


        this.setGameManager();
        loadingCount = 20;
        setTimeout(function(){return;}, (5000));

        LogicField.paintField(document.getElementById("fight"), field);
        loadingCount = 40;
        setTimeout(function(){return;}, 5000);
        document.getElementById('progress-step1').style.display = 'none';
        document.getElementById('progress-step2').style.display = 'block';
        setTimeout(function(){return;}, 5000);


        LogicField.setCharacters(field, this.parameters.players);
        LogicField.setWeapon(field, this.parameters.weapons, this.parameters.general[0].weapons_number);

        
        loadingCount = 60;
        setTimeout(function(){return;}, 5000);
        document.getElementById('progress-step2').style.display = 'none';
        document.getElementById('progress-step3').style.display = 'block';
        setTimeout(function(){return;}, 5000);

        // First Player start
        this.playerTour = field.characters[0];
        MenuManager.setMenu(this);
        loadingCount = 80;
        setTimeout(function(){return;}, 5000);
        document.getElementById('progress-step3').style.display = 'none';
        document.getElementById('progress-step4').style.display = 'block';
        setTimeout(function(){return;}, 5000);

        this.showReachableCase(this.parameters);

        this.logger.writteDescription(this.playerTour.name + ' can play.', this, this.playerTour);
        console.log('The player ' + this.playerTour.name + ' can play.');
        document.getElementById('arena').appendChild(this.soundBackground.$el);
        document.getElementById('arena').appendChild(this.soundFightBackground.$el);
        document.getElementById('arena').appendChild(this.soundAttack.$el);
        document.getElementById('arena').appendChild(this.soundDefenseMode.$el);
        document.getElementById('arena').appendChild(this.soundPickUpWeapon.$el);
        loadingCount = 100;
        document.getElementById('progress-step4').style.display = 'none';
        document.getElementById('progress-step5').style.display = 'block';
        setTimeout(function(){return;}, 5000);

        GameManager.setStartButton(this);
        document.getElementById("buttonStart").style.display = "block";

        GameManager.setAutoResize(this);
        console.log(this.parameters.general[0].move_max);
    }

    static setAutoResize(gameManager: GameManager){
        window.onresize = () => {
            LogicField.calculateCaseDimension(document.getElementById("arena"), document.getElementById("fight"),gameManager.field);

            for(let player of gameManager.players){
            LogicCharacter.setAbsolutePosition(player);
          LogicCharacter.characterAnimation(player, player.absoluteCoord);
          LogicCharacter.checkPlayerDirection(player.case.gameManager);
            }
        };
    }

    static setStartButton(gameManager: GameManager){

        let startButton = <HTMLDivElement>document.querySelectorAll('#buttonStart')[0];
        startButton.onclick = (event: MouseEvent) => {
            this.onClickStart(event, gameManager);
        };
    }

    static onClickStart(event: MouseEvent, gameManager: GameManager): void{

        document.getElementById('loading').style.display = "none";
        document.getElementById('arena').style.display = "block";

        gameManager.soundBackground.play();
    } 

    showReachableCase(parameters: any){

        for(let col=0; col < this.field.size.x; col++){
            for(let row=0; row < this.field.size.y; row++){
                let caseToCheck = this.field.cases[col][row];
                
            if(this.playerTour.isCaseReachable(caseToCheck, this.field, parameters.general[0].move_max) === true && caseToCheck !== this.playerTour.case){
                caseToCheck.$el.classList.add("case-reachable");
            }
            
        }
    }
    }



    
}
export default GameManager;