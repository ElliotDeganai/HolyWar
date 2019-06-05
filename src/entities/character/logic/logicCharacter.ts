
import Field from "../../field/model/field";
import Character from "../../character/model/character";

abstract class LogicCharacter {

    /**
     * 
     * @param partyField 
     * @param nameCharacter 
     * @param iconUrl 
     */
    static paintCharacters(partyField: Field, nameCharacter: string, iconUrl: string): void {
        let player = new Character(nameCharacter, iconUrl, partyField.getAvailableRandomCase());
        partyField.listOfCases[player.case.position].isAvailable = false;
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
        document.getElementById(String(player.case.position)).appendChild(spanElt);
    }

}

export default LogicCharacter;