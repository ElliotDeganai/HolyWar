import Case from "../../case/model/case";
import Weapon from "../../weapon/model/weapon";
import LogicWeapon from "../../weapon/logic/logicWeapon";
import Field from "../../field/model/field";
import LogicCharacter from "../logic/logicCharacter";
import Coord from "../../coord/model/coord";
import MenuManager from "../../menuManager";
import Logger from "../../logger";
import FightManager from "../../fightManager";

//This class for the fields
class Character {
   //field 
   name: string;
   iconUrl: string;
   life: number;
   level: number;
   case: Case;
   closedCases: Array<Case>;
   weapon: Weapon;
   absoluteCoord: Coord;
   $el: HTMLElement;
   $avatarElt: HTMLElement; 
   $avatarLifeElt: Element;
   $avatarWeaponElt: HTMLElement;
   defenseMode: boolean;
   direction: string;
   colorText: string;

   //constructor 
   constructor(name: string, iconUrl: string, startCase: Case) {
      this.life = 100;
      this.level = 5;
      this.name = name;
      this.iconUrl = iconUrl;
      this.case = startCase;
      this.closedCases = this.getClosedCases();
      this.weapon = new Weapon("Regular", 10, "/assets/img/weapon/weapon2.png");
      this.defenseMode = false;
      this.direction = "left";

   }

   takeWeapon(caseWeapon: Case, field: Field){
      let weaponToDrop = this.weapon;
      this.weapon = caseWeapon.weapon;
      caseWeapon.removeWeapon();
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

   getClosedCases(): Array<Case>{
      let closedCases = Array<Case>();
      let sizeX = this.case.gameManager.field.size.x;
      let sizeY = this.case.gameManager.field.size.y;
      let field = this.case.gameManager.field;

      for(let col = 0; col < sizeX; col++){
         for(let row = 0; row < sizeY; row++){
            if(this.case.casesAdjacent(field.cases[col][row])){
               closedCases.push(field.cases[col][row]);
            }
         }
      }
      return closedCases;
   }

   isClosedCasesBlocked(): Boolean{
      let allBlocked = true;
      for(let caseToCheck of this.closedCases){
         if(!caseToCheck.isBlocked){
            allBlocked = false;
         }
      }
      return allBlocked;
   }

   getCasesOnTheWay(caseToReach: Case, field: Field): Array<Case>{
      let casePlayer = this.case;
      let casePlayerX = casePlayer.position.x;
      let casePlayerY = casePlayer.position.y;
      let caseToReachX = caseToReach.position.x;
      let caseToReachY = caseToReach.position.y;
      let casesOnTheWay = [];
      let caseTemp: Case;

      if(casePlayer.areCasesAlignedX(caseToReach)){
         if(casePlayerX < caseToReachX){
            for(let i=casePlayerX; i<=caseToReachX; i++){
               caseTemp = field.cases[i][casePlayerY];
               casesOnTheWay.push(caseTemp);
            }
         }else{
            for(let i=caseToReachX; i<=casePlayerX; i++){
               caseTemp = field.cases[i][casePlayerY];
               casesOnTheWay.push(caseTemp);
            }  
         }
      }else{
         if(casePlayerY < caseToReachY){
            for(let j=casePlayerY; j<=caseToReachY; j++){
               caseTemp = field.cases[casePlayerX][j];
               casesOnTheWay.push(caseTemp);
            }
         }else{
            for(let j=caseToReachY; j<=casePlayerY; j++){
               caseTemp = field.cases[casePlayerX][j];
               casesOnTheWay.push(caseTemp);
            }  
         }
      }
      return casesOnTheWay;
   }

   moveTo(field: Field, caseToMove: Case){

      if(caseToMove.gameManager.isFinished === true){
         return;
      }

      let changedWeapon = false;
      let caseFrom = this.case;
      let previousWeapon = this.weapon;
      let logger = this.case.gameManager.logger;
      if(this.isCaseReachable(caseToMove, field)){

         let nextPlayerArray = field.characters.filter((nextPlayer) => {
            return (nextPlayer !== this.case.gameManager.playerTour);
          });

          let nextPlayer = nextPlayerArray[0];
         
      this.case = caseToMove;
      this.closedCases = this.getClosedCases();
      if(caseToMove.hasWeapon()){
         this.takeWeapon(this.case, field);
         changedWeapon = true;
         this.case.gameManager.soundPickUpWeapon.play();
         logger.writteDescription(this.case.gameManager.playerTour.name + ' changed ' + this.case.gameManager.logger.iconLoggerAttack +'.', this.case.gameManager, this.case.gameManager.playerTour);
         console.log('The player ' + this.case.gameManager.playerTour.name + ' let the weapon '+ caseToMove.weapon.name +' to take the weapon ' + this.weapon.name +'.');
         MenuManager.updateInfoWeapon(this, this.case.gameManager.players.indexOf(this));
      }

          LogicCharacter.setAbsolutePosition(this);


          LogicCharacter.characterAnimation(this, this.absoluteCoord);
          LogicCharacter.checkPlayerDirection(this.case.gameManager);
          
         if(changedWeapon){
            LogicWeapon.paintWeapon(field.cases[caseFrom.position.x][caseFrom.position.y], previousWeapon, field);
         }


      this.case.gameManager.playerTour = nextPlayer;
      MenuManager.updatePlayerTourMenu(this.case.gameManager.playerTour);
      logger.writteDescription(this.case.gameManager.playerTour.name + ' can play.', this.case.gameManager, nextPlayer);
      console.log('The player ' + this.case.gameManager.playerTour.name + ' can play.');

      if(this.case.casesAdjacent(nextPlayer.case)){
         FightManager.setFightMenuDelay(this.case.gameManager);
      }

      }else{
         logger.writteDescription("This place is unreachable!!", this.case.gameManager);
         console.log("This place is unreachable!!");
      }

      console.log(field.characters);
   }
   
   attack(){
      let logger = new Logger();
      let tourDamage = 0;
      let opponent = this.case.gameManager.field.characters.filter((opponent) => {
         return (opponent !== this);
       })[0];

       let indexOpponent = this.case.gameManager.field.characters.indexOf(opponent);

       if(opponent.defenseMode === true){
          tourDamage = Math.round((this.weapon.damage)/2);
       }else{
         tourDamage = this.weapon.damage;
       }
       opponent.life = opponent.life - tourDamage;
       if(opponent.life < 0){
         opponent.life = 0;
       }

       this.case.gameManager.soundAttack.play();
       MenuManager.updateInfoLife(opponent, indexOpponent, tourDamage);
       logger.writteDescription(opponent.name +' '+ this.case.gameManager.logger.iconLoggerLife + ' -' + tourDamage + 'pts.', this.case.gameManager, opponent);

       if(opponent.defenseMode === true){
         opponent.defenseMode = false;
         let nameInfoDivElt = <HTMLDivElement>document.querySelectorAll('#' +opponent.name+ ' .player-name-info')[0];
         nameInfoDivElt.removeChild(document.querySelectorAll('#' +opponent.name+ ' .defense-mode')[0]);

       }



       MenuManager.updateDamageTourMenu(this, opponent);
       this.case.gameManager.playerTour = opponent;
       MenuManager.updatePlayerTourMenu(this.case.gameManager.playerTour);

       FightManager.updatePlayerTourFightMenu(this.case.gameManager.playerTour);

       if(opponent.life === 0){
         FightManager.endGame(this);
      }
   }

   defense(){

      if(this.defenseMode === true){
         this.case.gameManager.logger.writteDescription('You are already in '+ this.case.gameManager.logger.iconLoggerDefense +'.', this.case.gameManager, this);
         return;
      }

      let divShieldElt = document.createElement("div");
      divShieldElt.classList.add("defense-mode");
      let imgShield = document.createElement("img");
      let nameInfoDivElt = <HTMLDivElement>document.querySelectorAll('#' +this.name+ ' .player-name-info')[0];

      imgShield.src = "/assets/img/fight-menu/shield.png";
      imgShield.classList.add("shield-fight-img");

      divShieldElt.appendChild(imgShield);
      nameInfoDivElt.appendChild(divShieldElt);

      let opponent = this.case.gameManager.field.characters.filter((opponent) => {
         return (opponent !== this);
       })[0];

      this.defenseMode = true;

      this.case.gameManager.soundDefenseMode.play();
      this.case.gameManager.logger.writteDescription(this.name + ' is ready to '+ this.case.gameManager.logger.iconLoggerDefense + '.', this.case.gameManager, this);

      this.case.gameManager.playerTour = opponent;
      MenuManager.updatePlayerTourMenu(this.case.gameManager.playerTour);
      FightManager.updatePlayerTourFightMenu(this.case.gameManager.playerTour);
   }
}

export default Character;