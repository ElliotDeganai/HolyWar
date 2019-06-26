import Case from "../../case/model/case";
import Weapon from "../../weapon/model/weapon";
import LogicWeapon from "../../weapon/logic/logicWeapon";
import Field from "../../field/model/field";
import LogicCharacter from "../logic/logicCharacter";
import Coord from "../../coord/model/coord";

//This class for the fields
class Character {
   //field 
   name: string;
   iconUrl: string;
   life: number;
   level: number;
   case: Case;
   weapon: Weapon;
   absoluteCoord: Coord;
   $el: HTMLElement;

   //constructor 
   constructor(name: string, iconUrl: string, startCase: Case) {
      this.life = 100;
      this.level = 5;
      this.name = name;
      this.iconUrl = iconUrl;
      this.case = startCase;
      this.weapon = new Weapon("basicWeapon", 5, "/assets/img/weapon/weapon1.png");

   }

   takeWeapon(caseWeapon: Case, field: Field){
      let weaponToDrop = this.weapon;
      this.weapon = caseWeapon.weapon;
      field.cases[caseWeapon.position.x][caseWeapon.position.y].weapon = weaponToDrop;
      //LogicWeapon.paintWeapon(caseWeapon, weaponToDrop, field);
   }

   isWayBlocked(caseToReach: Case, field: Field): Boolean{
      let blocked = false;
      if(this.case.position.x === caseToReach.position.x){
         let x = this.case.position.x;
         let yInit = 0;
         if(this.case.position.y < caseToReach.position.y){
         yInit = this.case.position.y+1;
         }else{
            yInit = caseToReach.position.y+1; 
         }
          let deltaY = Math.abs(this.case.position.y - caseToReach.position.y);
          for(let row = 0; row < deltaY; row++){
             if(field.cases[x][yInit+row].isBlocked === true){
                blocked = true;
             }
            
          }
      }else{
         let xInit = 0;
         let y = this.case.position.y;
         if(this.case.position.x < caseToReach.position.x){
            xInit = this.case.position.x+1;
         }else{
            xInit = caseToReach.position.x+1; 
         }
          let deltaX = Math.abs(this.case.position.x - caseToReach.position.x);
          for(let col = 0; col < deltaX; col++){
             if(field.cases[xInit+col][y].isBlocked === true){
                blocked = true;
             }
            
          }
      }
      if(blocked === true){
         return true;
      }else{
         return false;
      }
    }

   isCaseReachable(caseToReach: Case, field: Field){
      let deltaX = Math.abs(caseToReach.position.x - this.case.position.x);
      let deltaY = Math.abs(caseToReach.position.y - this.case.position.y);
      if( deltaX <= 3 &&  deltaY <= 3 ){
         if(caseToReach.position.x === this.case.position.x || caseToReach.position.y === this.case.position.y){
         if(!caseToReach.isBlocked && !this.isWayBlocked(caseToReach, field)){
         return true;
         }else{
            return false
         }
      }
      }else{
         return false;
      }
   }

   moveTo(field: Field, caseToMove: Case){
      if(this.isCaseReachable(caseToMove, field)){

         let nextPlayerArray = field.characters.filter((nextPlayer) => {
            return (nextPlayer !== this.case.gameManager.playerTour);
          });

          let nextPlayer = nextPlayerArray[0];
         
      this.case = caseToMove;
      if(caseToMove.hasWeapon()){
         this.takeWeapon(this.case, field);
         console.log('The player ' + this.case.gameManager.playerTour.name + ' let the weapon '+ caseToMove.weapon.name +' to take the weapon ' + this.weapon.name +'.');
      }
      // this.$el.remove();
      // LogicCharacter.paintCharacters(field, this, caseToMove);

          LogicCharacter.setAbsolutePosition(this);
          LogicCharacter.characterAnimation(this, this.absoluteCoord);

      this.case.gameManager.playerTour = nextPlayer;
      console.log('The player ' + this.case.gameManager.playerTour.name + ' can play.');
      }else{
         console.log("This place is unreachable!!");
      }
   }
}

export default Character;