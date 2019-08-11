import Case from "../../case/model/case";
import Field from "../model/field";
import CaseLogic from "../../case/logic/caseLogic";
import Weapon from "../../weapon/model/weapon";
import LogicWeapon from "../../weapon/logic/logicWeapon";
import Character from "../../character/model/character";
import LogicCharacter from "../../character/logic/logicCharacter";
import Coord from "../../coord/model/coord";

//This class will generate all the different objects needed for the game
abstract class LogicField {

   /**
    * 
    * @param x 
    * @param y 
    */

   static calculateCaseDimension(elementArena: HTMLElement, elementFight: HTMLElement,field: Field){
      let arenaStyle = getComputedStyle(elementArena);
      let fightStyle = getComputedStyle(elementFight);
      let fightEltWidth = parseInt(arenaStyle.width, 10);
      let fightEltHeight = parseInt(fightStyle.height, 10);
      field.caseHeight = fightEltWidth/field.size.y;
      field.caseWidht = fightEltHeight/field.size.x;
   }

   static generateMap(x: number, y: number): Field {
      let totalCases = x * y;
      let blockedCases = Math.round(totalCases / 6);
      let field: Field = new Field(x, y);
      LogicField.calculateCaseDimension(document.getElementById("arena"), document.getElementById("fight"),field);

      for (let col = 0; col < x; col++) {
         field.cases[col] = [];
         for(let row = 0; row < y; row++){
            let position = new Coord(col, row);

         if (blockedCases > 0) {
            let blockedCase = new Case(position, CaseLogic.BLOCKED);
            field.cases[col][row] = blockedCase;
            blockedCases = blockedCases - 1;
         } else {
            let nonBlockedCase = new Case(position);
            field.cases[col][row] = nonBlockedCase;
         }
      }
      }
      field.unsortCases();
      field.$el = document.getElementById("fight");

      return field;
   }

   /**
    * 
    * @param elementToFill 
    * @param field 
    */
   static paintField(elementToFill: HTMLElement, field: Field): void {

      
      for (let col = 0; col < field.size.x; col++) {
         let rowElt = document.createElement("div");
         rowElt.style.height = (100 / field.size.x).toFixed(2)+ "%";
         rowElt.style.position = "relative";
         rowElt.classList.add("row-map");
         for (let row = 0; row < field.size.y; row++){
         let divElt = CaseLogic.paintCase(field.cases[col][row]);
         rowElt.appendChild(divElt);
      }
      elementToFill.appendChild(rowElt);
   }
   }


    static setWeapon(field: Field): void {
       for (let i = 0; i < 2; i++) {
         let weapon = new Weapon("Mjolnir"+i, 10+i, "/assets/img/weapon/weapon1.png");
         field.weapons.push(weapon);
       }
       for (let i = 0; i < 2; i++) {
         let weapon = new Weapon("Stormbreaker"+i, 20+i, "/assets/img/weapon/weapon1.png");
         field.weapons.push(weapon);
       }
       for(let weapon of field.weapons){
          LogicWeapon.paintStartWeapon(field, weapon);

       }
    } 

   static setCharacters(field: Field): void {
      LogicCharacter.paintStartCharacters(field, "Exterminator", "/assets/img/characters/avatar1.png");
      
      LogicCharacter.paintStartCharacters(field, "Predator", "/assets/img/characters/avatar2.png");
      console.log(field.characters);
   }
}

export default LogicField;