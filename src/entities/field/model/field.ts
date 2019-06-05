import Case from "../../case/model/case";

//This class for the fields
class Field {
    //field 
    numberOfCaseWidth: number;
    numberOfCaseHeight: number;
    listOfCases: Array<Case>;

    //constructor 
    constructor(numberOfCaseWidth: number, numberOfCaseHeight: number) {
        this.numberOfCaseWidth = numberOfCaseWidth;
        this.numberOfCaseHeight = numberOfCaseHeight;
        this.listOfCases = new Array<Case>();
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
     * @param indiceCase 
     */
    removeCase(indiceCase: number): void{
        this.listOfCases.splice(indiceCase, 1);
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

    /**
     * 
     * @param position 
     */
    getCaseByPosition(position: number): Case {
        if(this.listOfCases[position] === null || this.listOfCases[position] === undefined){
            console.log(undefined);
            console.log(position);
            return undefined;
        }else{
            return this.listOfCases[position];
        }
    }

    /**
     * 
     */
    getRandomCase(): Case{
        let caseRandom = this.getCaseByPosition(Math.round(Math.random()*this.listOfCases.length));
        let caseToCheck = document.getElementById(String(caseRandom.position));
        while(caseToCheck === null || caseToCheck === undefined || caseRandom === undefined || caseRandom === null){
            caseRandom = this.getCaseByPosition(Math.round(Math.random()*this.listOfCases.length));
         }
        return caseRandom;
    }

    /**
     * 
     */
    getNonBlockedRandomCase(): Case{
        console.log((this.listOfCases.length-1));
        let caseRandom = this.listOfCases[Math.round(Math.random()*(this.listOfCases.length-1))];
        while(document.getElementById(String(caseRandom.position)) === null || document.getElementById(String(caseRandom.position)) === undefined || caseRandom === undefined || caseRandom === null || caseRandom.isBlocked === true){
            caseRandom = this.listOfCases[Math.round(Math.random()*(this.listOfCases.length-1))];
         }
        return caseRandom;
    }

    /**
     * 
     */
    getAvailableRandomCase(): Case{
        console.log((this.listOfCases.length-1));
        let caseRandom = this.listOfCases[Math.round(Math.random()*(this.listOfCases.length-1))];
        while(document.getElementById(String(caseRandom.position)) === null || document.getElementById(String(caseRandom.position)) === undefined || caseRandom === undefined || caseRandom === null || caseRandom.isBlocked === true || caseRandom.isAvailable === false){
            caseRandom = this.listOfCases[Math.round(Math.random()*(this.listOfCases.length-1))];
         }
        return caseRandom;
    }

    duplicateListOfCase(): Array<Case>{
        let listOfCasesTemp: Array<Case> = [];
        for (let CaseTemp of this.listOfCases) {
           let caseToAdd = CaseTemp;
           listOfCasesTemp.push(caseToAdd);
        }
        return listOfCasesTemp;
    }
}

export default Field;