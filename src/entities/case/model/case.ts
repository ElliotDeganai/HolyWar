import CaseLogic from "../../case/logic/caseLogic";
import Coord from "../../coord/model/coord";

class Case {
    //field 
    imgUrl: string;
    isBlocked: boolean;
    isAvailable: boolean;
    position: Coord;
    positionString: string;
    type: string;
    $el: HTMLElement;

    //constructor 
    constructor(position: Coord, type: string = CaseLogic.NORMAL, isAvailable: boolean = true) {

        switch (type) {
            case CaseLogic.NORMAL:
                this.imgUrl = "/assets/img/normal-field/tile-2D.png";
                this.isBlocked = false;
                break;

            case CaseLogic.BLOCKED:
                this.imgUrl = "/assets/img/blocked-field/tile-2D.png";
                this.isBlocked = true;
                break;
        }
        this.isAvailable = isAvailable;
        this.position = position;
        this.positionString = String(position.x) + String(position.y);
    }

    casesAdjacent(caseToCheck: Case): Boolean{
        if(this.position.x === caseToCheck.position.x+1 || this.position.x === caseToCheck.position.x-1 || this.position.y === caseToCheck.position.y+1 || this.position.y === caseToCheck.position.y-1){
            return true;
        }else{
            return false;
        }
    }

}

export default Case;