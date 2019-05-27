import Case from "../../case/model/case";

//This class for the fields
class Field {
    //field 
    numberOfCaseWidth: number;
    numberOfCaseHeight: number;
    listOfCases: Array<Case>;

    //constructor 
    constructor(numberOfCaseWidth: number, numberOfCaseHeight: number, listOfCases: Array<Case>) {
        this.numberOfCaseWidth = numberOfCaseWidth;
        this.numberOfCaseHeight = numberOfCaseHeight;
        this.listOfCases = listOfCases;
    }

    /**
     * 
     * @param caseToAdd 
     */
    addCase(caseToAdd: Case): void {
        this.listOfCases.push(caseToAdd);
    }

    /**
     * 
     */
    nbrOfBlockedCase(): number {
        let nbrOfBlockedCase: number = 0;
        for (let brick of this.listOfCases) {
            if (brick.isBlocked) {
                nbrOfBlockedCase = nbrOfBlockedCase + 1;
            }
        }
        return nbrOfBlockedCase;
    }

    /**
     * 
     */
    getNonBlockedCases(): Array<Case> {
        let listOfNonBlockedCases: Array<Case> = [];
        for (let brick of this.listOfCases) {
            if (!brick.isBlocked) {
                listOfNonBlockedCases.push(brick);
            }
        }
        return listOfNonBlockedCases;
    }
}

export default Field;