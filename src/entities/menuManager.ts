
import Character from "./character/model/character";
import GameManager from "./gameManager";

abstract class MenuManager {

    static setMenu(gameManager: GameManager){

        this.setIdPlayerInfo(gameManager);

        this.setInfo(gameManager.players[0], 0);

        gameManager.players[0].$avatarLifeElt = document.querySelectorAll('#' +gameManager.players[0].name+ ' .life-info')[0];

        this.setInfo(gameManager.players[1], 1);
        gameManager.players[1].$avatarLifeElt = document.querySelectorAll('#' +gameManager.players[1].name+ ' .life-info')[0];

        this.updatePlayerTourMenu(gameManager.playerTour);
        
    }

    static setIdPlayerInfo(gameManager: GameManager){

                document.getElementsByClassName("player-info")[0].id = gameManager.players[0].name;

                document.getElementsByClassName("player-info")[1].id = gameManager.players[1].name;

    }

    static setInfo(player: Character, indicePlayer: number){
   
        let lifeInfoElt = <HTMLDivElement>document.querySelectorAll('#' +player.name+ ' .life-info')[0];
        let divLifeElt = <HTMLDivElement>document.querySelectorAll('#' +player.name+ ' .life-value')[0];
        divLifeElt.textContent = String(player.life);

        let divDamageElt = <HTMLDivElement>document.querySelectorAll('#' +player.name+ ' .damageTour')[0];

        this.setColorInfoLife(player, indicePlayer);

        let weaponInfoElt = <HTMLDivElement>document.querySelectorAll('#' +player.name+ ' .weapon-info')[0];
        let divWeaponElt = <HTMLDivElement>document.querySelectorAll('#' +player.name+ ' .weapon-value')[0]
        divWeaponElt.textContent = player.weapon.name+ '('+player.weapon.damage+')';

        let divAvatarElt = <HTMLDivElement>document.querySelectorAll('#' +player.name+ ' .avatar-img')[0];
        let avatar = player.iconUrl;
        let imgAvatar = document.createElement("img");
        imgAvatar.src = avatar;
        divAvatarElt.appendChild(imgAvatar);

        let nameInfoElt = <HTMLDivElement>document.querySelectorAll('#' +player.name+ ' .player-name')[0];
        nameInfoElt.textContent = player.name;

        let nameInfoDivElt = <HTMLDivElement>document.querySelectorAll('#' +player.name+ ' .player-name-info')[0];

        switch (indicePlayer) {
            case 0:
                divAvatarElt.style.left = "5%"
                divLifeElt.style.marginLeft = "5px";
                divWeaponElt.style.marginLeft = "5px";
                divDamageElt.style.marginLeft = "5px";
                nameInfoElt.style.marginRight = "5px";
                imgAvatar.style.transform = "rotateY(180deg)";
                break;

            case 1:
                divAvatarElt.style.right = "5%"
                divLifeElt.style.marginRight = "5px";
                divWeaponElt.style.marginRight = "5px";
                divDamageElt.style.marginRight = "5px";
                nameInfoElt.style.marginLeft = "5px";
                lifeInfoElt.style.flexDirection = "row-reverse";
                weaponInfoElt.style.flexDirection = "row-reverse";
                nameInfoElt.style.flexDirection = "row-reverse";
                nameInfoDivElt.style.flexDirection = "row-reverse";
                break;
        }

    }

    static updateInfoLife(player: Character, indicePlayer: number, damage: number){

        let lifeInfoElt = <HTMLDivElement>document.querySelectorAll('#' +player.name+ ' .life-value')[0];
        let damageElt = <HTMLDivElement>document.getElementsByClassName("damageTour")[indicePlayer];
        damageElt.textContent = String("-"+damage);
        

        lifeInfoElt.innerHTML="";
        lifeInfoElt.textContent = String(player.life);

        this.setColorInfoLife(player, indicePlayer);

        
    }

    static setColorInfoLife(player: Character, indicePlayer: number){

        let lifeInfoElt = document.getElementsByClassName("life-value")[indicePlayer];

        if(player.$avatarLifeElt !== undefined){
        if(player.$avatarLifeElt.classList.contains('high-life-level')){
            player.$avatarLifeElt.classList.remove('high-life-level'); 
        }else if(player.$avatarLifeElt.classList.contains('medium-life-level')){
            player.$avatarLifeElt.classList.remove('medium-life-level'); 
        }else if(player.$avatarLifeElt.classList.contains('low-life-level')){
            player.$avatarLifeElt.classList.remove('low-life-level'); 
        }
    }

        if(player.life > 75){
            lifeInfoElt.classList.add('high-life-level');
        }else if (player.life > 30 && player.life <= 75) {
            lifeInfoElt.classList.add('medium-life-level');
        } else {
            lifeInfoElt.classList.add('low-life-level');
        } 
    }

    static updateInfoWeapon(player: Character, indicePlayer: number){
        let weaponInfoElt = document.getElementsByClassName("weapon-value")[indicePlayer];

        weaponInfoElt.innerHTML="";
        weaponInfoElt.textContent = player.weapon.name+ '('+player.weapon.damage+')';
        
    }

    static updatePlayerTourMenu(player: Character){
        let playerElts = document.getElementsByClassName("playerTour");
        if(playerElts[0] !== undefined && playerElts[0] !== null){
        playerElts[0].classList.remove("playerTour");
        }
        let playerTourElt = <HTMLDivElement>document.querySelectorAll('#' +player.name+ ' .avatar-img')[0];
        playerTourElt.classList.add("playerTour");

        

    }

}
export default MenuManager;
