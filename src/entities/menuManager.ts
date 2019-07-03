
import Character from "./character/model/character";
import GameManager from "./gameManager";

abstract class MenuManager {

    static setMenu(gameManager: GameManager){

        this.setInfo(gameManager.players[0], 0);
        gameManager.players[0].$avatarLifeElt = document.querySelectorAll("#player1 .life-info")[0];

        this.setInfo(gameManager.players[1], 1);
        gameManager.players[1].$avatarLifeElt = document.querySelectorAll("#player2 .life-info")[0];

        this.updatePlayerTourMenu(gameManager.playerTour);
        
    }

    static setInfo(player: Character, indicePlayer: number){
        let lifeInfoElt = document.getElementsByClassName('life-info');
        let divLifeElt = document.createElement("div");
        divLifeElt.textContent = String(player.life);
        divLifeElt.classList.add('life-value');
        divLifeElt.style.position = "absolute";
        switch (indicePlayer) {
            case 0:
                divLifeElt.style.left = "30px"
                break;

            case 1:
                divLifeElt.style.right = "30px"
                break;
        }
        divLifeElt.style.zIndex = "20";  
        lifeInfoElt[indicePlayer].appendChild(divLifeElt);
        this.setColorInfoLife(player, indicePlayer);

        let weaponInfoElt = document.getElementsByClassName('weapon-info');
        let divWeaponElt = document.createElement("div");
        divWeaponElt.textContent = player.weapon.name+ '('+player.weapon.damage+')';
        divWeaponElt.classList.add('weapon-value');
        divWeaponElt.style.position = "absolute";
        switch (indicePlayer) {
            case 0:
                divWeaponElt.style.left = "30px"
                break;

            case 1:
                divWeaponElt.style.right = "30px"
                break;
        }
        divWeaponElt.style.zIndex = "20";
        weaponInfoElt[indicePlayer].appendChild(divWeaponElt);

        let avatarIconElt = document.getElementsByClassName('avatar-icon');
        let divAvatarElt = document.createElement("div");
        divAvatarElt.classList.add("avatar-img")
        let avatar = player.iconUrl;
        let imgAvatar = document.createElement("img");
        imgAvatar.src = avatar;

        divAvatarElt.id = player.name;
        divAvatarElt.style.position = "absolute";
        divAvatarElt.style.top = "10px";
        switch (indicePlayer) {
            case 0:
                divAvatarElt.style.left = "2%"
                break;

            case 1:
                divAvatarElt.style.right = "5%"
                break;
        }
        divAvatarElt.style.zIndex = "0";
        divAvatarElt.style.overflow = "hidden";
        divAvatarElt.appendChild(imgAvatar);
        avatarIconElt[indicePlayer].appendChild(divAvatarElt);

        let nameInfoElt = <HTMLDivElement>document.getElementsByClassName('player-name')[indicePlayer];
        nameInfoElt.textContent = player.name;
        nameInfoElt.style.position = "absolute";
        nameInfoElt.style.top = "-5px";
        nameInfoElt.style.fontWeight = "bold";
        switch (indicePlayer) {
            case 0:
                nameInfoElt.style.left = "26%"
                break;

            case 1:
                nameInfoElt.style.right = "26%"
                break;
        }
    }

    static updateInfoLife(player: Character, indicePlayer: number){

        let lifeInfoElt = document.getElementsByClassName("life-value")[indicePlayer];

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
        }else if (player.life > 30 && player.life < 75) {
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
        let playerTourElt = document.getElementById(player.name);
        playerTourElt.classList.add("playerTour");

    }

}
export default MenuManager;
