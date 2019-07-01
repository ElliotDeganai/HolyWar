
import Field from "../../field/model/field";
import Character from "../../character/model/character";
import Case from "../../case/model/case";
import Coord from "../../coord/model/coord";

const dimensionCase = 84;

abstract class LogicCharacter {

    static paintStartCharacters(field: Field, nameCharacter: string, iconUrl: string): void {
        let player = new Character(nameCharacter, iconUrl, field.getAvailableRandomCase());
        

        if (typeof field.characters[0] !== 'undefined') {

            while(field.characters[0].case.casesAdjacent(player.case) || player.isClosedCasesBlocked()){
                player = new Character(nameCharacter, iconUrl, field.getAvailableRandomCase());
            }

          }

        field.cases[player.case.position.x][player.case.position.y].isAvailable = false;
        let imgChar: HTMLImageElement = document.createElement("img");
        let spanElt = document.createElement("span");

        spanElt.classList.add("char");
        imgChar.src = player.iconUrl;
        imgChar.style.maxWidth = "100%";
        imgChar.style.maxHeight = (Math.round(100 / field.size.x))+ "%";
        imgChar.style.position = "absolute";
        imgChar.style.zIndex = "50";
        //spanElt.appendChild(imgChar);
        //let playerDivElt = player.case.$el;
        let playerDivElt = document.getElementById("fight");
        //playerDivElt.appendChild(spanElt);
        playerDivElt.appendChild(imgChar);
        player.$el = imgChar;
        imgChar.classList.add("player");
        this.setAbsolutePosition(player);

        player.$el.style.left = player.absoluteCoord.y + 'px';
        player.$el.style.top = player.absoluteCoord.x + 'px';

        field.characters.push(player);
        player.case.gameManager.players.push(player);
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

    static setAbsolutePosition(player: Character){
        let absoluteX = player.case.position.x*player.case.$el.offsetHeight;
        let absoluteY = player.case.position.y*player.case.$el.offsetWidth;
        let absolutePositionPlayer = new Coord(absoluteX, absoluteY);
        player.absoluteCoord = absolutePositionPlayer; 
    }

}

export default LogicCharacter;