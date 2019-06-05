import Field from "../../field/model/field";
import Weapon from "../../weapon/model/weapon";


abstract class LogicWeapon {

    /**
     * 
     * @param partyField 
     * @param iconWeapon 
     */
    static paintWeapon(partyField: Field, iconWeapon: string): void {
        let caseWeapon = partyField.getAvailableRandomCase();
        let weapon = new Weapon(5, iconWeapon, caseWeapon);
        let imgWeapon: HTMLImageElement = document.createElement("img");
        let spanElt = document.createElement("span");
        spanElt.classList.add("weapon");
        imgWeapon.src = weapon.iconUrl;
        imgWeapon.style.maxHeight = "100%";
        imgWeapon.style.position = "absolute";
        imgWeapon.style.top = "0";
        imgWeapon.style.left = "-75px";
        imgWeapon.style.zIndex = "20";
        spanElt.appendChild(imgWeapon);
        document.getElementById(String(caseWeapon.position)).appendChild(spanElt);
        partyField.listOfCases[caseWeapon.position].isAvailable = false;
    }
}

export default LogicWeapon;