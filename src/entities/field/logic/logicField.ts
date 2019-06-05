import Case from "../../case/model/case";
import Field from "../model/field";
import CaseLogic from "../../case/logic/caseLogic";
import Weapon from "../../weapon/model/weapon";
import LogicWeapon from "../../weapon/logic/logicWeapon";
import Character from "../../character/model/character";
import LogicCharacter from "../../character/logic/logicCharacter";

//This class will generate all the different objects needed for the game
abstract class LogicField {

   /**
    * 
    * @param numberOfCaseWidth 
    * @param numberOfCaseHeight 
    */
   static generateMap(numberOfCaseWidth: number, numberOfCaseHeight: number): Field {
      let totalNumberOfCases = numberOfCaseWidth * numberOfCaseHeight;
      let numberOfBlockedCases = Math.round(totalNumberOfCases / 6);
      let partyField: Field = new Field(numberOfCaseWidth, numberOfCaseHeight);
      console.log(totalNumberOfCases);
      for (let i = 0; i < totalNumberOfCases; i++) {
         if (numberOfBlockedCases > 0) {
            let blockedCase = new Case(i, CaseLogic.BLOCKED);
            partyField.addCase(blockedCase);
            numberOfBlockedCases = numberOfBlockedCases - 1;
         } else {
            let nonBlockedCase = new Case(i);
            partyField.addCase(nonBlockedCase);
         }
      }
      return partyField;
   }

   /**
    * 
    * @param elementToFill 
    * @param partyField 
    */
   static paintField(elementToFill: HTMLElement, partyField: Field): void {
      let listOfCasesTemp = partyField.duplicateListOfCase();
      let nbrOfRemainingCases: number = listOfCasesTemp.length - 1;
      let nbrOfCaseToAdd: number = listOfCasesTemp.length - 1;
      
      for (let i = 0; i <= nbrOfCaseToAdd; i++) {
         nbrOfRemainingCases = listOfCasesTemp.length - 1;
         CaseLogic.paintCase(partyField, listOfCasesTemp, elementToFill, nbrOfRemainingCases)
      }
   }

   /**
    * 
    * @param partyField 
    */
   static setWeapon(partyField: Field): void {
      for (let i = 0; i < 2; i++) {
         LogicWeapon.paintWeapon(partyField, "/assets/img/weapon/weapon1.png");
      }
      for (let i = 0; i < 2; i++) {
         LogicWeapon.paintWeapon(partyField, "/assets/img/weapon/weapon2.png");
      }
   }

/**
 * 
 * @param partyField 
 */
   static setCharacters(partyField: Field): void {
      LogicCharacter.paintCharacters(partyField, "Exterminator", "/assets/img/characters/avatar1.png");
      LogicCharacter.paintCharacters(partyField, "Predator", "/assets/img/characters/avatar2.png");
   }
}

export default LogicField;