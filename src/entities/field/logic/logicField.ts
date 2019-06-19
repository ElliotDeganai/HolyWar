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
   static generateMap(x: number, y: number): Field {
      let totalCases = x * y;
      let blockedCases = Math.round(totalCases / 6);
      let field: Field = new Field(x, y);

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

      return field;
   }

   /**
    * 
    * @param elementToFill 
    * @param field 
    */
   static paintField(elementToFill: HTMLElement, field: Field): void {

      
      for (let col = 0; col < field.size.x; col++) {
         for (let row = 0; row < field.size.y; row++){
         CaseLogic.paintCase(field, field.cases[col][row], elementToFill, row, col);
      }
   }
   }


    static setWeapon(field: Field): void {
       for (let i = 0; i < 2; i++) {
          LogicWeapon.paintStartWeapon(field, "Mjolnir", "/assets/img/weapon/weapon1.png");
       }
       for (let i = 0; i < 2; i++) {
          LogicWeapon.paintStartWeapon(field,"Strombreaker", "/assets/img/weapon/weapon2.png");
       }
    } 

   static setCharacters(field: Field): void {
      LogicCharacter.paintStartCharacters(field, "Exterminator", "/assets/img/characters/avatar1.png");
      LogicCharacter.paintStartCharacters(field, "Predator", "/assets/img/characters/avatar2.png");
   }
}

export default LogicField;