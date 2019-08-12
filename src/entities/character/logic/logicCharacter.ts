
import Field from "../../field/model/field";
import Character from "../../character/model/character";
import Case from "../../case/model/case";
import Coord from "../../coord/model/coord";
import GameManager from "../../gameManager";

abstract class LogicCharacter {

    static paintStartCharacters(field: Field, nameCharacter: string, iconUrl: string): void {
        let player = new Character(nameCharacter, iconUrl, field.getAvailableRandomCase());
        

        let nextPlayer = field.characters.filter((nextPlayer) => {
            return (nextPlayer !== player);
          })[0];


        

        if (typeof field.characters[0] !== 'undefined') {

            while(player.case.casesAdjacent(nextPlayer.case) || player.isClosedCasesBlocked()){
                player = new Character(nameCharacter, iconUrl, field.getAvailableRandomCase());
            }

          }
          field.cases[player.case.position.x][player.case.position.y].isAvailable = false;

        //field.cases[player.case.position.x][player.case.position.y].isAvailable = false;
        let imgChar: HTMLImageElement = document.createElement("img");
        let spanElt = document.createElement("span");

        spanElt.classList.add("char");
        imgChar.src = player.iconUrl;
        imgChar.style.maxWidth = "100%";
        imgChar.style.maxHeight = (Math.round(100 / field.size.x))+ "%";
        imgChar.style.position = "absolute";
        imgChar.style.zIndex = "50";
        let playerDivElt = document.getElementById("fight");
        playerDivElt.appendChild(imgChar);
        player.$el = imgChar;
        imgChar.classList.add("player");
        this.setAbsolutePosition(player);
        

        player.$el.style.left = player.absoluteCoord.y + 'px';
        player.$el.style.top = player.absoluteCoord.x + 'px';
        this.characterAnimation(player, player.absoluteCoord);

        field.characters.push(player);
        player.case.gameManager.players.push(player);

        if(player.case.gameManager.players.length === 2){
            if(player.case.position.y < nextPlayer.case.position.y){
                LogicCharacter.turnPlayer(player);
                player.colorText = "blue";
                nextPlayer.colorText = "red";
              }else{
                LogicCharacter.turnPlayer(nextPlayer);  
              }
        }
    } 

    static paintCharacters(field: Field, player: Character, casePlayer: Case): void {

        let imgChar: HTMLImageElement = document.createElement("img");
        let spanElt = document.createElement("span");

        spanElt.classList.add("char");
        imgChar.src = player.iconUrl;
        imgChar.style.maxWidth = "100%";
        imgChar.style.maxHeight = "75%";
        imgChar.style.position = "absolute";
        imgChar.style.top = "0";
        imgChar.style.left = "0";
        imgChar.style.zIndex = "50";
        imgChar.classList.add("player");
        spanElt.appendChild(imgChar);
        let playerDivElt = player.case.$el;
        playerDivElt.appendChild(spanElt);
        player.$el = spanElt;
    }

    static characterAnimation(player: Character, newCoord: Coord){

        player.$el.style.left = newCoord.y + 'px';
        player.$el.style.top = newCoord.x + 'px';

    }

    static turnPlayer(player: Character){

      if(player.direction === 'left'){
        player.$el.style.transform = "rotateY(180deg)";
        player.direction = 'right';
            
        }else{
          player.$el.style.transform = "";
            player.direction = 'left'; 
        }
    }

    static checkPlayerDirection(gameManager: GameManager){
        let playerLeft = gameManager.players.filter((playerLeft) => {
            return (playerLeft.direction === 'right');
          })[0];

          let playerRight = gameManager.players.filter((playerRight) => {
            return (playerRight.direction === 'left');
          })[0];

          if(playerLeft.case.position.y > playerRight.case.position.y){

            this.turnPlayer(playerLeft);
            this.turnPlayer(playerRight);
          }
    }

    static setAbsolutePosition(player: Character){

      let caseOffsetHeight = player.case.gameManager.field.caseHeight;
      let caseOffsetWidht = player.case.gameManager.field.caseWidht;

        let absoluteX = player.case.position.x*caseOffsetHeight;
        let absoluteY = player.case.position.y*caseOffsetWidht;
        
        let absolutePositionPlayer = new Coord(absoluteX, absoluteY);
        player.absoluteCoord = absolutePositionPlayer; 

    }

}

export default LogicCharacter;