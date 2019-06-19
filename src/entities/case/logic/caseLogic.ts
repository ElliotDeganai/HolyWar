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
    static paintCase(partyField: Field, caseToPaint: Case, elementToFill: HTMLElement, row: number, col: number): void {
        let divElt = document.createElement("div");
        divElt.style.width = (Math.round(100 / partyField.size.y)) - 1 + "%";
        divElt.style.height = (Math.round(100 / partyField.size.x)) - 1 + "%";
        divElt.style.position = "relative";

        switch (caseToPaint.isBlocked) {
            case false:
                divElt.classList.add("case");
                break;

            case true:
                divElt.classList.add("case");
                divElt.classList.add("blocked");
                break;
        }



        let elementToAdd: HTMLImageElement = document.createElement("img");

        elementToAdd.src = caseToPaint.imgUrl;
        elementToAdd.classList.add("fond");
        elementToAdd.classList.add("img-responsive");
        elementToAdd.style.width = (Math.round(100 / partyField.size.y)) - 1 + "%";
        elementToAdd.style.height = (Math.round(100 / partyField.size.x)) - 1 + "%";
        //divElt.appendChild(elementToAdd);
        divElt.id = String(caseToPaint.positionString);
        elementToFill.appendChild(divElt);
        partyField.cases[caseToPaint.position.x][caseToPaint.position.y].$el = divElt;
    }



}

export default CaseLogic;