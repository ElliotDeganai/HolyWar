
import Character from "./character/model/character";
import GameManager from "./gameManager";

abstract class MenuManager {

    static setMenu(gameManager: GameManager){

        this.setInfo(gameManager.players[0], 0);

        gameManager.players[0].$avatarLifeElt = document.querySelectorAll('#' +gameManager.players[0].name+ ' .life-info')[0];

        this.setInfo(gameManager.players[1], 1);
        gameManager.players[1].$avatarLifeElt = document.querySelectorAll('#' +gameManager.players[1].name+ ' .life-info')[0];

        this.updatePlayerTourMenu(gameManager.playerTour);
        
    }

    static setInfo(player: Character, indicePlayer: number){

        switch (indicePlayer) {
            case 0:
                document.getElementsByClassName("player-info")[0].id = player.name;
                break;

            case 1:
                document.getElementsByClassName("player-info")[1].id = player.name;
                break;
        }

        
        let lifeInfoElt = <HTMLDivElement>document.querySelectorAll('#' +player.name+ ' .life-info')[0];
        let divLifeElt = document.createElement("div");
        divLifeElt.textContent = String(player.life);
        divLifeElt.classList.add('life-value'); 
        lifeInfoElt.appendChild(divLifeElt);
        this.setColorInfoLife(player, indicePlayer);

        let weaponInfoElt = <HTMLDivElement>document.querySelectorAll('#' +player.name+ ' .weapon-info')[0];
        let divWeaponElt = document.createElement("div");
        divWeaponElt.textContent = player.weapon.name+ '('+player.weapon.damage+')';
        divWeaponElt.classList.add('weapon-value');
        weaponInfoElt.appendChild(divWeaponElt);

        let avatarIconElt = document.getElementsByClassName('avatar-icon');
        let divAvatarElt = document.createElement("div");
        divAvatarElt.classList.add("avatar-img")
        let avatar = player.iconUrl;
        let imgAvatar = document.createElement("img");
        imgAvatar.src = avatar;


        divAvatarElt.appendChild(imgAvatar);
        avatarIconElt[indicePlayer].appendChild(divAvatarElt);

        let nameInfoElt = <HTMLDivElement>document.querySelectorAll('#' +player.name+ ' .player-name')[0];
        nameInfoElt.textContent = player.name;

        switch (indicePlayer) {
            case 0:
                divAvatarElt.style.left = "2%"
                divLifeElt.style.marginLeft = "5px";
                divWeaponElt.style.marginLeft = "5px";
                imgAvatar.style.transform = "rotateY(180deg)";
                break;

            case 1:
                divAvatarElt.style.right = "5%"
                divLifeElt.style.marginRight = "5px";
                divWeaponElt.style.marginRight = "5px";
                lifeInfoElt.style.flexDirection = "row-reverse";
                weaponInfoElt.style.flexDirection = "row-reverse";
                nameInfoElt.style.flexDirection = "row-reverse";
                break;
        }

    }

    static updateInfoLife(player: Character, indicePlayer: number){

        let lifeInfoElt = <HTMLDivElement>document.querySelectorAll('#' +player.name+ ' .life-value')[0];

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
