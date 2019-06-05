import Case from "../../case/model/case";
import Field from "../../field/model/field";

abstract class CaseLogic {

    static BLOCKED: string = "BLOCKED";
    static NORMAL: string = "NORMAL";

    /**
     * 
     * @param partyField 
     * @param listOfCasesTemp 
     * @param elementToFill 
     * @param nbrOfRemainingCases 
     */
    static paintCase(partyField: Field, listOfCasesTemp: Array<Case>, elementToFill: HTMLElement, nbrOfRemainingCases: number): void {
        let divElt = document.createElement("div");
        divElt.style.display = "inline";
        divElt.style.width = (Math.round(100 / partyField.numberOfCaseWidth)) - 1 + "%";
        divElt.style.height = (Math.round(100 / partyField.numberOfCaseHeight)) - 1 + "%";
        divElt.style.position = "relative";
        let elementToAdd: HTMLImageElement = document.createElement("img");
        let indiceCaseFullList: number = Math.round(Math.random() * nbrOfRemainingCases);
        elementToAdd.src = listOfCasesTemp[indiceCaseFullList].imgUrl;
        elementToAdd.classList.add("fond");
        elementToAdd.classList.add("img-responsive");
        elementToAdd.style.width = (Math.round(100 / partyField.numberOfCaseWidth)) - 1 + "%";
        elementToAdd.style.height = (Math.round(100 / partyField.numberOfCaseHeight)) - 1 + "%";
        divElt.appendChild(elementToAdd);
        divElt.id = String(listOfCasesTemp[indiceCaseFullList].position);
        elementToFill.appendChild(divElt);
        listOfCasesTemp.splice(indiceCaseFullList, 1);
        console.log(listOfCasesTemp.length);
    }



}

export default CaseLogic;