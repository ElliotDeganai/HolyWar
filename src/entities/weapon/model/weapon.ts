import Case from "../../case/model/case";

//This class for the fields
class Weapon {
   //field 
   damage: number;
   iconUrl: string;
   case: Case;

   //constructor 
   constructor(damage: number, iconUrl: string, weaponCase: Case) {
      this.damage = damage;
      this.iconUrl = iconUrl;
      this.case = weaponCase;
   }


}

export default Weapon;