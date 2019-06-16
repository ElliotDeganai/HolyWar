import Field from "../../field/model/field";
import Weapon from "../../weapon/model/weapon";


abstract class LogicWeapon {


    static paintWeapon(field: Field,name: string, iconWeapon: string): void {
        let caseWeapon = field.getAvailableRandomCase();
        let weapon = new Weapon(name, 5, iconWeapon, caseWeapon);
        let imgWeapon: HTMLImageElement = document.createElement("img");
        let spanElt = document.createElement("span");
        spanElt.classList.add("weapon");
        imgWeapon.src = weapon.iconUrl;
        imgWeapon.style.maxHeight = "100%";
        imgWeapon.style.position = "absolute";
        imgWeapon.style.top = "0";
        imgWeapon.style.left = "0";
        imgWeapon.style.zIndex = "20";
        spanElt.appendChild(imgWeapon);
        document.getElementById(caseWeapon.positionString).appendChild(spanElt);
        field.cases[caseWeapon.position.x][caseWeapon.position.y].isAvailable = false;
        weapon.$el = spanElt;
        field.weapons.push(weapon);
    } 
}

export default LogicWeapon;