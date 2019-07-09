
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

        let divActions = document.createElement("div");

        let textAction = document.createElement("p");
        textAction.textContent = "What will you do?";
        divActions.appendChild(textAction);
        divActions.id = 'actions';

        let avatar1 = gameManager.players[0].iconUrl;
        let imgAvatar1 = document.createElement("img");
        imgAvatar1.src = avatar1;
        imgAvatar1.style.transform = "rotateY(180deg)";

        let avatar2 = gameManager.players[1].iconUrl;
        let imgAvatar2 = document.createElement("img");
        imgAvatar2.src = avatar2;

        let divCharacters = document.createElement("div");
        divCharacters.classList.add("character-to-fight");

        let divCharacterToFight1 = document.createElement("div");
        divCharacterToFight1.classList.add("character-to-fight1");
        divCharacterToFight1.classList.add(gameManager.players[0].name);
        divCharacterToFight1.appendChild(imgAvatar1);

        let divCharacterToFight2 = document.createElement("div");
        divCharacterToFight2.classList.add("character-to-fight2");
        divCharacterToFight2.classList.add(gameManager.players[1].name);
        divCharacterToFight2.appendChild(imgAvatar2);

        let divButton = document.createElement("div");
        divButton.id = "action-button";
        let attackButton = this.setAttackButton(gameManager);
        let defenseButton = this.setDefenseButton(gameManager);
        divButton.appendChild(attackButton);
        divButton.appendChild(defenseButton);

        divCharacters.appendChild(divCharacterToFight1);
        divCharacters.appendChild(divCharacterToFight2);
        divFightMenuElt.appendChild(divCharacters);
        divFightMenuElt.appendChild(divActions);
        divFightMenuElt.appendChild(divButton);

        document.getElementById("arena").appendChild(divFightMenuElt);
        document.getElementById("fight").classList.add("fight-mode");
        let casesElements = document.getElementsByClassName('case');

        for (let row of gameManager.field.cases) {
            for(let caseToCheck of row){
            caseToCheck.$el.classList.remove('case-reachable');
            caseToCheck.$el.removeEventListener('click', onclick);
        }
    }

        if(gameManager.playerTour === gameManager.players[0]){
            document.querySelectorAll('.' +gameManager.playerTour.name)[0].classList.add("playerTour-fight");
            document.querySelectorAll('.' +gameManager.players[1].name)[0].classList.add("passivePlayer-fight");
        }else{
            document.querySelectorAll('.' +gameManager.playerTour.name)[0].classList.add("playerTour-fight");
            document.querySelectorAll('.' +gameManager.players[0].name)[0].classList.add("passivePlayer-fight");            
        }
    }

    static setAttackButton(gameManager: GameManager): HTMLButtonElement{
        let attackButton = document.createElement("button");
        attackButton.textContent = "Attack";
        attackButton.id = "btnAttack";
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
        defenseButton.id = "btnDefense";
        defenseButton.textContent = "Defense";
        defenseButton.onclick = (event: MouseEvent) => {
            this.onClickDefense(event, gameManager);
        };
        return defenseButton;
    }

    static onClickDefense(event: MouseEvent, gameManager: GameManager): void{

          gameManager.playerTour.defense();

    }
    
    static endGame(player: Character){
        window.alert('The player ' +player.name+ ' lost!!\nThe game will restart.');
        location.reload(true);
    }

    static updatePlayerTourFightMenu(player: Character){
        let playerTourElt = document.getElementsByClassName("playerTour-fight")[0];
        let passivePlayerElt = document.getElementsByClassName("passivePlayer-fight")[0];
  
          playerTourElt.classList.remove('playerTour-fight');
          passivePlayerElt.classList.remove('passivePlayer-fight');

           passivePlayerElt.classList.add('playerTour-fight');
          playerTourElt.classList.add('passivePlayer-fight');  

    }
    

}

export default FightManager;