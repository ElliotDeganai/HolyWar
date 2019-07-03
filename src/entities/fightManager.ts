
import Character from "./character/model/character";
import GameManager from "./gameManager";
import Logger from "./logger";

abstract class FightManager {

    static fightToDeath(player1: Character, player2: Character){

        let logger: Logger;
        logger.writteDescription('The death match begins !!');

        document.getElementById('')

        
    }

    static setFightMenu(gameManager: GameManager){
        let divFightMenuElt = document.createElement("div");
        divFightMenuElt.id = "fight-menu";

        let divCharacterToFight1 = document.createElement("div");
        divCharacterToFight1.classList.add("character-to-fight");

        let divCharacterToFight2 = document.createElement("div");
        divCharacterToFight2.classList.add("character-to-fight");

        let attackButton = this.setAttackButton(gameManager);
        let defenseButton = this.setDefenseButton(gameManager);

        divFightMenuElt.appendChild(attackButton);
        divFightMenuElt.appendChild(defenseButton);

        document.getElementById("fight").appendChild(divFightMenuElt);



    }

    static setAttackButton(gameManager: GameManager): HTMLButtonElement{
        let attackButton = document.createElement("button");
        attackButton.textContent = "Attack";
        attackButton.onclick = (event: MouseEvent) => {
            this.onClickAttack(event, gameManager);
        };
        return attackButton;
    }

    static onClickAttack(event: MouseEvent, gameManager: GameManager): void{

        let offensivePlayer = gameManager.playerTour;
        let defensivePlayer = gameManager.field.characters.filter((defensivePlayer) => {
            return (defensivePlayer !== offensivePlayer);
          })[0];

          offensivePlayer.attack();

    } 

    static setDefenseButton(gameManager: GameManager): HTMLButtonElement{
        let defenseButton = document.createElement("button");
        defenseButton.textContent = "Defense";
        defenseButton.onclick = (event: MouseEvent) => {
            this.onClickAttack(event, gameManager);
        };
        return defenseButton;
    }

    onClickDefense(event: MouseEvent, gameManager: GameManager): void{

          gameManager.playerTour.defense();

    } 
    

}

export default FightManager;