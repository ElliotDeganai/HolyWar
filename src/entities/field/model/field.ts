import Case from "../../case/model/case";
import Coord from "../../coord/model/coord";
import Size from "../../size/model/size";
import Weapon from "../../weapon/model/weapon";
import Character from "../../character/model/character";
import LogicHelper from "../../../helpers/LogicHelper";


//This class for the fields
class Field {
    //field 
    size: Size;
    cases: Case[][];
    weapons: Weapon[];
    characters: Character[];
    caseWidht: number;
    caseHeight: number;
    $el: HTMLElement;

    //constructor 
    constructor(x: number, y: number) {
        this.size = new Size(x,y);
        this.cases = Array<Array<Case>>();
        this.weapons = [];
        this.characters = [];
    }

    /**
     * 
     * @param caseToAdd 
     */
    addCase(caseToAdd: Case[]): void {
        this.cases.push(caseToAdd);
    }

    /**
     * 
     * @param indiceCase 
     */
    removeCase(position: Coord): void{
        this.cases[position.x].splice(position.y, 1);
    }

    /**
     * 
     */
    nbrOfBlockedCase(): number {
        let nbrOfBlockedCase: number = 0;
        for (let row = 0; row < this.size.x; row++) {
            for (let col = 0; col < this.size.y; col++){
            if (this.cases[row][col].isBlocked) {
                nbrOfBlockedCase = nbrOfBlockedCase + 1;
            }
        }
    }
        return nbrOfBlockedCase;
    }

    /**
     * 
     */
    getNonBlockedCases(): Array<Case> {
        let NonBlockedCases: Array<Case> = [];
        for (let row = 0; row < this.size.x; row++) {
            for (let col = 0; col < this.size.y; col++){
            if (!this.cases[row][col].isBlocked) {
                let caseToAdd = this.cases[row][col];
                NonBlockedCases.push(caseToAdd);
            }
        }
    }
        return NonBlockedCases;
    }

    getBlockedCases(): Array<Case> {
        let BlockedCases: Array<Case> = [];
        for (let row = 0; row < this.size.x; row++) {
            for (let col = 0; col < this.size.y; col++){
            if (this.cases[row][col].isBlocked) {
                let caseToAdd = this.cases[row][col];
                BlockedCases.push(caseToAdd);
            }
        }
    }
        return BlockedCases;
    }

    getAvailableCases(): Array<Case> {
        let availableCases: Array<Case> = [];
        for (let row = 0; row < this.size.x; row++) {
            for (let col = 0; col < this.size.y; col++){
            if (this.cases[row][col].isAvailable && !this.cases[row][col].isBlocked) {
                let caseToAdd = this.cases[row][col];
                availableCases.push(caseToAdd);
            }
        }
    }
        return availableCases;
    }

    /**
     * 
     * @param position 
     */
    getCaseByPosition(position: Coord): Case {

        console.log(this.cases[position.x][position.y]);
        if (position === undefined){
            return undefined;
        }else{
            return this.cases[position.x][position.y];
        }
    }

    /**
     * 
     */
    getRandomCase(): Case{
        let randomX = LogicHelper.getRandomDimension(this.size.x-1);
        let randomY = LogicHelper.getRandomDimension(this.size.y-1);

        let randomCoord = new Coord(randomX, randomY);

        let caseRandom = this.getCaseByPosition(randomCoord);
        let caseToCheck = document.getElementById(caseRandom.positionString);
        while(caseToCheck === null || caseToCheck === undefined || caseRandom === undefined || caseRandom === null){

            let randomX = LogicHelper.getRandomDimension(this.size.x-1);
            let randomY = LogicHelper.getRandomDimension(this.size.y-1);
    
            let randomCoord = new Coord(randomX, randomY);

            caseRandom = this.getCaseByPosition(randomCoord);
         }
        return caseRandom;
    }

  
    getNonBlockedRandomCase(): Case{

        let nonBlockedCases = this.getNonBlockedCases();

        let indice = LogicHelper.getRandomDimension(nonBlockedCases.length-1);

        let nonBlockedRandomCase = nonBlockedCases[indice];

        return nonBlockedRandomCase;
    }


    getAvailableRandomCase(): Case{
        let availableCases = this.getAvailableCases();

        let indice = LogicHelper.getRandomDimension(availableCases.length-1);

        let availableRandomCase = availableCases[indice];

        return availableRandomCase;
    } 


    duplicateListOfCase(): Case[]{
        let casesTemp = Array<Case>();
        for (let row=0; row < this.size.x; row++) {
            for(let col=0; col < this.size.y; col++){
           let caseToAdd = this.cases[row][col];
           casesTemp.push(caseToAdd);
        }
    }
        return casesTemp;
    }

    unsortCases(): void{
        let casesTemp = this.duplicateListOfCase();

        for(let col = 0; col < this.size.x; col++){
            for(let row = 0; row < this.size.y; row++){

                let indice = LogicHelper.getRandomDimension(casesTemp.length-1);

                this.cases[col][row] = casesTemp[indice];
                this.cases[col][row].position.x = col;
                this.cases[col][row].position.y = row;
                this.cases[col][row].positionString = String(col)+String(row);
                casesTemp.splice(indice,1);

            }
        }
    }

    getCaseByElt(el: Element): Case{
        for(let rowCases of this.cases){
            for(let caseToGet of rowCases){
                if(caseToGet.$el === el){
                    return caseToGet;
                
                }
            }
        }
    }
}

export default Field;