
import Field from "../../field/model/field";
import Character from "../../character/model/character";
import Case from "../../case/model/case";
import Coord from "../../coord/model/coord";

abstract class LogicCharacter {

    static paintCharacters(field: Field, nameCharacter: string, iconUrl: string): void {
        let player = new Character(nameCharacter, iconUrl, field.getAvailableRandomCase());

        if (typeof field.characters[0] !== 'undefined') {

            while(field.characters[0].case.casesAdjacent(player.case)){
                player = new Character(nameCharacter, iconUrl, field.getAvailableRandomCase());
            }

          }

        field.cases[player.case.position.x][player.case.position.y].isAvailable = false;
        let imgChar: HTMLImageElement = document.createElement("img");
        let spanElt = document.createElement("span");

        spanElt.classList.add("char");
        imgChar.src = player.iconUrl;
        imgChar.style.maxWidth = "100%";
        imgChar.style.maxHeight = "80px";
        imgChar.style.position = "absolute";
        imgChar.style.top = "-25px";
        imgChar.style.left = "15px";
        imgChar.style.zIndex = "10";
        spanElt.appendChild(imgChar);
        let playerDivElt = player.case.$el;
        playerDivElt.appendChild(spanElt);
        player.$el = spanElt;
        field.characters.push(player);
    } 

}

export default LogicCharacter;