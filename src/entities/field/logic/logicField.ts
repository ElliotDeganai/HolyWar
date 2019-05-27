import Case from "../../case/model/case";
import Field from "../model/field";

//This class will generate all the different objects needed for the game
abstract class LogicField {

   /**
    * 
    * @param numberOfCaseWidth 
    * @param numberOfCaseHeight 
    */
   static generateMap(numberOfCaseWidth: number, numberOfCaseHeight: number): Field {
      let totalNumberOfCases: number = numberOfCaseWidth * numberOfCaseHeight;
      let numberOfBlockedCases: number = Math.round(totalNumberOfCases / 5);
      let numberOfNonBlockedCases: number = totalNumberOfCases - numberOfBlockedCases;
      let listOfCases: Array<Case> = [];

      let partyField: Field = new Field(numberOfCaseWidth, numberOfCaseHeight, listOfCases);
      console.log(totalNumberOfCases);
      for (let i = 0; i < totalNumberOfCases; i++) {

         if (numberOfBlockedCases > 0) {
            let blockedCase: Case = new Case("/assets/img/blocked-field/tile-2D.png", true, false, i);
            partyField.addCase(blockedCase);
            numberOfBlockedCases = numberOfBlockedCases - 1;
         } else {
            let nonBlockedCase: Case = new Case("/assets/img/normal-field/tile-2D.png", false, true, i);
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
      let nbrOfCaseToAdd: number = partyField.listOfCases.length - 1;
      let numberOfBlockedCases: number = partyField.nbrOfBlockedCase();
      let listOfNonBlockedCases: Array<Case> = partyField.getNonBlockedCases();
      console.log(nbrOfCaseToAdd)

      for (let i = 0; i <= nbrOfCaseToAdd; i++) {
         let elementToAdd: HTMLImageElement = document.createElement("img");
         let indiceCaseFullList: number = Math.round(Math.random() * nbrOfCaseToAdd);
         console.log(indiceCaseFullList);
         let indiceCaseNonBlockedList: number = Math.round(Math.random() * (listOfNonBlockedCases.length - 1));
         console.log(indiceCaseNonBlockedList);

         if (numberOfBlockedCases > 0) {
            elementToAdd.src = partyField.listOfCases[indiceCaseFullList].imgUrl;
            elementToAdd.classList.add("fond");
            elementToAdd.classList.add("img-responsive");
            elementToAdd.style.width = (Math.round(100 / partyField.numberOfCaseWidth)) - 1 + "%";
            console.log(elementToAdd.style.width);
            elementToAdd.style.height = (Math.round(100 / partyField.numberOfCaseHeight)) - 1 + "%";
            console.log(elementToAdd.style.height);
            elementToFill.appendChild(elementToAdd);

            if (partyField.listOfCases[indiceCaseFullList].isBlocked) {
               numberOfBlockedCases = numberOfBlockedCases - 1;
            }

         } else {
            elementToAdd.src = listOfNonBlockedCases[indiceCaseNonBlockedList].imgUrl;
            elementToAdd.classList.add("fond");
            elementToAdd.classList.add("img-responsive");
            elementToAdd.style.width = (Math.round(100 / partyField.numberOfCaseWidth)) - 1 + "%";
            console.log(elementToAdd.style.width);
            elementToAdd.style.height = (Math.round(100 / partyField.numberOfCaseHeight)) - 1 + "%";
            console.log(elementToAdd.style.height);
            elementToFill.appendChild(elementToAdd);
         }
      }
   }
}

export default LogicField;