class Case {
    //field 
    imgUrl: string;
    isBlocked: boolean;
    isAvailable: boolean;
    position: number;

    //constructor 
    constructor(imgUrl: string, isBlocked: boolean, isAvailable: boolean, position: number) {
        this.imgUrl = imgUrl;
        this.isBlocked = isBlocked;
        this.isAvailable = isAvailable;
        this.position = position;
    }
}

export default Case;