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
    static paintCase(caseToPaint: Case): HTMLDivElement {
        let divElt = document.createElement("div");
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
        divElt.id = String(caseToPaint.positionString);

        caseToPaint.setEl(divElt);
        return divElt;
    }



}

export default CaseLogic;