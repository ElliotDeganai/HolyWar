
import Character from "./character/model/character";
import GameManager from "./gameManager";
import Logger from "./logger";

abstract class FightManager {

    static fightToDeath(player1: Character, player2: Character){

        let logger: Logger;
        logger.writteDescription('The death match begins !!');

        document.getElementById('')

        
    }

    static setIdPlayerInfo(gameManager: GameManager, element: Element){

        document.getElementsByClassName("character-to-fight-avatar")[0].id = gameManager.players[0].name;

        document.getElementsByClassName("character-to-fight-avatar")[1].id = gameManager.players[1].name;

}

    static setFightMenu(gameManager: GameManager){

        gameManager.isFinished = true;

        let divFightMenuElt = document.getElementById("fight-menu");
        divFightMenuElt.style.display = "block";

        let avatar1 = gameManager.players[0].iconUrl;
        let imgAvatar1 = document.createElement("img");
        imgAvatar1.src = avatar1;
        imgAvatar1.style.transform = "rotateY(180deg)";

        let avatar2 = gameManager.players[1].iconUrl;
        let imgAvatar2 = document.createElement("img");
        imgAvatar2.src = avatar2;

        let divCharacterToFight1 = document.getElementsByClassName("character-to-fight-avatar")[0];
        divCharacterToFight1.classList.add(gameManager.players[0].name);
        divCharacterToFight1.appendChild(imgAvatar1);

        let divCharacterToFight2 = document.getElementsByClassName("character-to-fight-avatar")[1];
        divCharacterToFight2.classList.add(gameManager.players[1].name);
        divCharacterToFight2.appendChild(imgAvatar2);
        
        this.setAttackButton(gameManager);
        this.setDefenseButton(gameManager);


        document.getElementById("arena").appendChild(divFightMenuElt);
        document.getElementById("fight").classList.add("fight-mode");


    

        if(gameManager.playerTour === gameManager.players[0]){
            document.querySelectorAll('.' +gameManager.playerTour.name)[0].classList.add("playerTour-fight");
            document.querySelectorAll('.' +gameManager.players[1].name)[0].classList.add("passivePlayer-fight");
        }else{
            document.querySelectorAll('.' +gameManager.playerTour.name)[0].classList.add("playerTour-fight");
            document.querySelectorAll('.' +gameManager.players[0].name)[0].classList.add("passivePlayer-fight");            
        }
    }

    static setAttackButton(gameManager: GameManager){

        let attackButton = <HTMLDivElement>document.querySelectorAll('#btnAttack')[0];
        attackButton.onclick = (event: MouseEvent) => {
            this.onClickAttack(event, gameManager);
        };
    }

    static onClickAttack(event: MouseEvent, gameManager: GameManager): void{

        let offensivePlayer = gameManager.playerTour;
        let defensivePlayer = gameManager.field.characters.filter((defensivePlayer) => {
            return (defensivePlayer !== offensivePlayer);
          })[0];

          offensivePlayer.attack();

    } 

    static setDefenseButton(gameManager: GameManager){ 

        let defenseButton = <HTMLDivElement>document.querySelectorAll('#btnDefense')[0];
        defenseButton.onclick = (event: MouseEvent) => {
            this.onClickDefense(event, gameManager);
        };
    }

    static onClickDefense(event: MouseEvent, gameManager: GameManager): void{

          gameManager.playerTour.defense();

    }

    static onClickReload(event: MouseEvent): void{

        location.reload();

  }
    
    static endGame(player: Character){
        //window.alert('The player ' +player.name+ ' lost!!\nThe game will restart.');
        //location.reload(true);

        document.getElementById("endGame-modal").style.display = "block";
        document.getElementById("arena").style.filter = "brightness(50%)";

        document.getElementById("winner").textContent = player.name + " win the game!!!";

        let winnerImg = document.createElement("img");
        winnerImg.src = player.iconUrl;

        document.getElementById("winner-img").appendChild(winnerImg);

        let refresh = document.getElementById("endGame-img-reload");
        refresh.onclick = (event: MouseEvent) => {
            this.onClickReload(event);
        };



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