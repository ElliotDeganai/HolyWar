import CaseLogic from "../../case/logic/caseLogic";

class Case {
    //field 
    imgUrl: string;
    isBlocked: boolean;
    isAvailable: boolean;
    position: number;
    type: string;

    //constructor 
    constructor(position: number, type: string = CaseLogic.NORMAL, isAvailable: boolean = true) {

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
    }

}

export default Case;