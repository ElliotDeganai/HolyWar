function getData():object {

   let key = "img_field_url";
   let imgUrlJson = [];

   ajaxGet("http://localhost/royalFight/data/fight.json", function (reponse) {
       // Transforme la réponse en tableau d'objets JavaScript
       imgUrlJson = JSON.parse(reponse);
       console.log(imgUrlJson);   
   
});
console.log(imgUrlJson);
return imgUrlJson;
}

//This class for the fields
class Field { 
    //field 
    numberOfCaseWidth:number;
    numberOfCaseHeight:number;
    listOfCases:Array<Case>;
  
    //constructor 
    constructor(numberOfCaseWidth:number, numberOfCaseHeight:number, listOfCases:Array<Case>) { 
       this.numberOfCaseWidth = numberOfCaseWidth;
       this.numberOfCaseHeight = numberOfCaseHeight; 
       this.listOfCases = listOfCases; 
    }  
 
    //function 
    addCase(caseToAdd:Case):void { 
       this.listOfCases.push(caseToAdd);
    }
    
    nbrOfBlockedCase():number{
       let nbrOfBlockedCase:number = 0;
       for(let brick of this.listOfCases){
          if(brick.isBlocked){
            nbrOfBlockedCase = nbrOfBlockedCase + 1;
          }
       }
       return nbrOfBlockedCase;
    }

    getNonBlockedCases():Array<Case>{
      let listOfNonBlockedCases:Array<Case> = [];
      for(let brick of this.listOfCases){
         if(!brick.isBlocked){
            listOfNonBlockedCases.push(brick);
         }
      }
      return listOfNonBlockedCases;
    }
 }

 class Case { 
    //field 
    imgUrl:string;
    isBlocked:boolean;
    isAvailable:boolean;
    position:number;
    
    //constructor 
    constructor(imgUrl:string, isBlocked:boolean, isAvailable:boolean, position:number) { 
       this.imgUrl = imgUrl;
       this.isBlocked = isBlocked; 
       this.isAvailable = isAvailable;
       this.position = position;
    }  
 }

  //This class will generate all the different objects needed for the game
 class Generator { 
 
 
    //function 
    generateMap(numberOfCaseWidth:number, numberOfCaseHeight:number):Field { 
       let totalNumberOfCases: number =  numberOfCaseWidth * numberOfCaseHeight;
       let numberOfBlockedCases: number = Math.round(totalNumberOfCases/5);
       let numberOfNonBlockedCases: number = totalNumberOfCases - numberOfBlockedCases;
       let listOfCases: Array<Case> = [];

       let imgUrlJson = getData();
       
       console.log(imgUrlJson);
       console.log(imgUrlJson);

       let partyField: Field = new Field(numberOfCaseWidth, numberOfCaseHeight, listOfCases);

       console.log(totalNumberOfCases);

       
       for(let i=0; i < totalNumberOfCases; i++){

        
            if(numberOfBlockedCases > 0){
           let blockedCase: Case = new Case("../assets/img/blocked-field/tile-2D.png", true, false, i);
            partyField.addCase(blockedCase);
            numberOfBlockedCases = numberOfBlockedCases - 1;
            } else {
                let nonBlockedCase: Case = new Case("../assets/img/normal-field/tile-2D.png", false, true, i);
                partyField.addCase(nonBlockedCase);               
            }
       
    }



       return partyField;
    } 
 }


 //This class will create and fill the html elemenets of our webpage
 class Painter { 

 
    //function 
    paintField(elementToFill: HTMLElement, partyField:Field):void{ 
        let nbrOfCaseToAdd: number = partyField.listOfCases.length-1;
        let numberOfBlockedCases: number = partyField.nbrOfBlockedCase();
        let listOfNonBlockedCases: Array<Case> = partyField.getNonBlockedCases();
        console.log(nbrOfCaseToAdd)

        for(let i=0; i <= nbrOfCaseToAdd; i++) {
            let elementToAdd: HTMLImageElement = document.createElement("img");
            let indiceCaseFullList: number = Math.round(Math.random()*nbrOfCaseToAdd);
            console.log(indiceCaseFullList);

            let indiceCaseNonBlockedList: number = Math.round(Math.random()*(listOfNonBlockedCases.length-1));
            console.log(indiceCaseNonBlockedList);

            if(numberOfBlockedCases > 0){

            elementToAdd.src = partyField.listOfCases[indiceCaseFullList].imgUrl;
            elementToAdd.classList.add("fond");
            elementToAdd.classList.add("img-responsive");
            elementToAdd.style.width = (Math.round(100/partyField.numberOfCaseWidth))-1 + "%";
            console.log(elementToAdd.style.width );
            elementToAdd.style.height = (Math.round(100/partyField.numberOfCaseHeight))-1 + "%";
            console.log(elementToAdd.style.height);
            elementToFill.appendChild(elementToAdd);

               if(partyField.listOfCases[indiceCaseFullList].isBlocked){
                  numberOfBlockedCases = numberOfBlockedCases - 1;
               }

            }else{
               elementToAdd.src = listOfNonBlockedCases[indiceCaseNonBlockedList].imgUrl;
               elementToAdd.classList.add("fond");
               elementToAdd.classList.add("img-responsive");
               elementToAdd.style.width = (Math.round(100/partyField.numberOfCaseWidth))-1 + "%";
               console.log(elementToAdd.style.width );
               elementToAdd.style.height = (Math.round(100/partyField.numberOfCaseHeight))-1 + "%";
               console.log(elementToAdd.style.height);
               elementToFill.appendChild(elementToAdd);
            }
        }

    } 
 }

//This class for the fields
class Weapon { 
   //field 
   damage:number;
   iconUrl:string;
 
   //constructor 
   constructor(damage:number, iconUrl:string) { 
      this.damage = damage; 
      this.iconUrl = iconUrl; 
   }  

   //function 
   addCase(caseToAdd:Case):void { 
      this.listOfCases.push(caseToAdd);
   }
   
   nbrOfBlockedCase():number{
      let nbrOfBlockedCase:number = 0;
      for(let brick of this.listOfCases){
         if(brick.isBlocked){
           nbrOfBlockedCase = nbrOfBlockedCase + 1;
         }
      }
      return nbrOfBlockedCase;
   }

   getNonBlockedCases():Array<Case>{
     let listOfNonBlockedCases:Array<Case> = [];
     for(let brick of this.listOfCases){
        if(!brick.isBlocked){
           listOfNonBlockedCases.push(brick);
        }
     }
     return listOfNonBlockedCases;
   }
}


 let gen = new Generator();
 let paint = new Painter();
 let fieldForGame = gen.generateMap(8, 6);

 paint.paintField(document.getElementById("fight"), fieldForGame);

 