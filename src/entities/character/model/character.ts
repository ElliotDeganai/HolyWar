import Case from "../../case/model/case";
import Weapon from "../../weapon/model/weapon";
import LogicWeapon from "../../weapon/logic/logicWeapon";
import Field from "../../field/model/field";
import LogicCharacter from "../logic/logicCharacter";

//This class for the fields
class Character {
   //field 
   name: string;
   iconUrl: string;
   life: number;
   level: number;
   case: Case;
   weapon: Weapon;
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

   takeWeapon(field: Field){
      let caseWeapon = this.case;
      let weaponToDrop = this.weapon;
      this.weapon = this.case.weapon;
      LogicWeapon.paintWeapon(caseWeapon, weaponToDrop, field);
   }

   isCaseReachable(caseToReach: Case){
      let deltaX = Math.abs(caseToReach.position.x - this.case.position.x);
      let deltaY = Math.abs(caseToReach.position.y - this.case.position.y);
      if( deltaX > 3 ||  deltaY > 3){
         return true;
      }else{
         return false;
      }
   }

   moveTo(field: Field, caseToMove: Case){
      if(this.isCaseReachable(caseToMove)){
         
      this.case = caseToMove;
      document.getElementById(this.case.positionString).removeChild(this.$el);
      LogicCharacter.paintCharacters(field, this, caseToMove);

      }else{
         console.log("This place is unreachable!!");
      }
   }
}

export default Character;