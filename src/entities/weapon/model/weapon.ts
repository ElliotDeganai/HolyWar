import Case from "../../case/model/case";

//This class for the fields
class Weapon {
   //field 
   name: string;
   damage: number;
   iconUrl: string;
   case: Case;
   $el: HTMLElement;

   //constructor 
   constructor(name: string, damage: number, iconUrl: string, weaponCase: Case) {
      this.name = name;
      this.damage = damage;
      this.iconUrl = iconUrl;
      this.case = weaponCase;
   }


}

export default Weapon;