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

    startGame() {
        console.log('starting game...');

        let field = LogicField.generateMap(6, 8);

        LogicField.paintField(document.getElementById("fight"), field);

        LogicField.setWeapon(field);

        LogicField.setCharacters(field);

        // First Player start
        this.playerTour = field.characters[0];

        console.log('The player ' + this.playerTour.name + ' can play.');
    }

    movePlayer(): void{

        document.getElementById('fight').addEventListener('click', event => {
 
            //we get the element target
            var el= event.target||event.srcElement;
                    console.log(el);
    });

    }

    
}
export default GameManager;