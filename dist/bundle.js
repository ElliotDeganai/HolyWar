(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CaseLogic = /** @class */ (function () {
    function CaseLogic() {
    }
    /**
     *
     * @param partyField
     * @param listOfCasesTemp
     * @param elementToFill
     * @param nbrOfRemainingCases
     */
    CaseLogic.paintCase = function (caseToPaint) {
        var divElt = document.createElement("div");
        divElt.style.position = "relative";
        switch (caseToPaint.isBlocked) {
            case false:
                divElt.classList.add("case");
                break;
            case true:
                divElt.classList.add("case");
                divElt.classList.add("blocked");
                break;
        }
        divElt.id = String(caseToPaint.positionString);
        caseToPaint.setEl(divElt);
        return divElt;
    };
    CaseLogic.BLOCKED = "BLOCKED";
    CaseLogic.NORMAL = "NORMAL";
    return CaseLogic;
}());
exports.default = CaseLogic;
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var caseLogic_1 = require("../../case/logic/caseLogic");
var logicWeapon_1 = require("../../weapon/logic/logicWeapon");
var Case = /** @class */ (function () {
    //constructor 
    function Case(position, type, isAvailable) {
        if (type === void 0) { type = caseLogic_1.default.NORMAL; }
        if (isAvailable === void 0) { isAvailable = true; }
        switch (type) {
            case caseLogic_1.default.NORMAL:
                this.imgUrl = "/assets/img/normal-field/tile-2D.png";
                this.isBlocked = false;
                break;
            case caseLogic_1.default.BLOCKED:
                this.imgUrl = "/assets/img/blocked-field/tile-2D.png";
                this.isBlocked = true;
                break;
        }
        this.isAvailable = isAvailable;
        this.position = position;
        this.positionString = String(position.x) + String(position.y);
        this.weapon = null;
    }
    Case.prototype.casesAdjacent = function (caseToCheck) {
        var isSameX = this.position.x === caseToCheck.position.x;
        var absoluteDeltaY = Math.abs(this.position.y - caseToCheck.position.y);
        var isSameY = this.position.y === caseToCheck.position.y;
        var absoluteDeltaX = Math.abs(this.position.x - caseToCheck.position.x);
        if ((isSameX && absoluteDeltaY <= 1) || (isSameY && absoluteDeltaX <= 1)) {
            return true;
        }
        else {
            return false;
        }
    };
    Case.prototype.hasWeapon = function () {
        if (this.weapon !== null) {
            return true;
        }
        else {
            return false;
        }
    };
    Case.prototype.removeWeapon = function () {
        this.weapon.$el.remove();
        this.weapon = null;
    };
    Case.prototype.addWeapon = function (field, weapon) {
        this.weapon = weapon;
        logicWeapon_1.default.paintWeapon(this, weapon, field);
    };
    Case.prototype.setEl = function (element) {
        var _this = this;
        this.$el = element;
        this.$el.onclick = function (event) {
            _this.onClick(event);
        };
        return this.$el;
    };
    Case.prototype.onClick = function (event) {
        var casesElements = document.getElementsByClassName('case');
        var field = this.gameManager.field;
        for (var i = 0; i < casesElements.length; i++) {
            var casesElement = casesElements[i];
            casesElement.classList.remove('case-reachable');
        }
        var caseToGo = field.cases[this.position.x][this.position.y];
        // Do nothing if player select a Block Case
        if (caseToGo.isBlocked) {
            this.gameManager.showReachableCase();
            return;
        }
        //we get the element target
        this.gameManager.playerTour.moveTo(this.gameManager.field, caseToGo);
        this.gameManager.showReachableCase();
    };
    return Case;
}());
exports.default = Case;
},{"../../case/logic/caseLogic":1,"../../weapon/logic/logicWeapon":13}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var character_1 = require("../../character/model/character");
var coord_1 = require("../../coord/model/coord");
var LogicCharacter = /** @class */ (function () {
    function LogicCharacter() {
    }
    LogicCharacter.paintStartCharacters = function (field, nameCharacter, iconUrl) {
        var player = new character_1.default(nameCharacter, iconUrl, field.getAvailableRandomCase());
        var nextPlayer = field.characters.filter(function (nextPlayer) {
            return (nextPlayer !== player);
        })[0];
        if (typeof field.characters[0] !== 'undefined') {
            while (field.characters[0].case.casesAdjacent(player.case) || player.isClosedCasesBlocked()) {
                player = new character_1.default(nameCharacter, iconUrl, field.getAvailableRandomCase());
            }
        }
        field.cases[player.case.position.x][player.case.position.y].isAvailable = false;
        var imgChar = document.createElement("img");
        var spanElt = document.createElement("span");
        spanElt.classList.add("char");
        imgChar.src = player.iconUrl;
        imgChar.style.maxWidth = "100%";
        imgChar.style.maxHeight = (Math.round(100 / field.size.x)) + "%";
        imgChar.style.position = "absolute";
        imgChar.style.zIndex = "50";
        var playerDivElt = document.getElementById("fight");
        playerDivElt.appendChild(imgChar);
        player.$el = imgChar;
        imgChar.classList.add("player");
        this.setAbsolutePosition(player);
        player.$el.style.left = player.absoluteCoord.y + 'px';
        player.$el.style.top = player.absoluteCoord.x + 'px';
        field.characters.push(player);
        player.case.gameManager.players.push(player);
        if (player.case.gameManager.players.length === 2) {
            if (player.case.position.y < nextPlayer.case.position.y) {
                LogicCharacter.faceOpponent(player);
            }
            else {
                LogicCharacter.faceOpponent(nextPlayer);
            }
        }
    };
    LogicCharacter.paintCharacters = function (field, player, casePlayer) {
        var imgChar = document.createElement("img");
        var spanElt = document.createElement("span");
        spanElt.classList.add("char");
        imgChar.src = player.iconUrl;
        imgChar.style.maxWidth = "100%";
        imgChar.style.maxHeight = "75%";
        imgChar.style.position = "absolute";
        imgChar.style.top = "0";
        imgChar.style.left = "0";
        imgChar.style.zIndex = "50";
        imgChar.classList.add("player");
        spanElt.appendChild(imgChar);
        var playerDivElt = player.case.$el;
        playerDivElt.appendChild(spanElt);
        player.$el = spanElt;
    };
    LogicCharacter.characterAnimation = function (player, newCoord) {
        player.$el.style.left = newCoord.y + 'px';
        player.$el.style.top = newCoord.x + 'px';
    };
    LogicCharacter.faceOpponent = function (player) {
        console.log(player);
        player.$el.style.transform = "rotateY(180deg)";
        if (player.direction === 'left') {
            player.direction = 'right';
        }
        else {
            player.direction = 'left';
        }
    };
    LogicCharacter.checkPlayerDirection = function (gameManager) {
        var playerLeft = gameManager.players.filter(function (playerLeft) {
            return (playerLeft.direction === 'right');
        })[0];
        var playerRight = gameManager.players.filter(function (playerRight) {
            return (playerRight.direction === 'left');
        })[0];
        if (playerLeft.case.position.y > playerRight.case.position.y) {
            console.log(playerLeft);
            console.log(playerRight);
            this.faceOpponent(playerLeft);
            this.faceOpponent(playerRight);
        }
    };
    LogicCharacter.setAbsolutePosition = function (player) {
        var absoluteX = player.case.position.x * player.case.$el.offsetHeight;
        var absoluteY = player.case.position.y * player.case.$el.offsetWidth;
        var absolutePositionPlayer = new coord_1.default(absoluteX, absoluteY);
        player.absoluteCoord = absolutePositionPlayer;
    };
    return LogicCharacter;
}());
exports.default = LogicCharacter;
},{"../../character/model/character":4,"../../coord/model/coord":5}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var weapon_1 = require("../../weapon/model/weapon");
var logicWeapon_1 = require("../../weapon/logic/logicWeapon");
var logicCharacter_1 = require("../logic/logicCharacter");
var menuManager_1 = require("../../menuManager");
var logger_1 = require("../../logger");
var fightManager_1 = require("../../fightManager");
//This class for the fields
var Character = /** @class */ (function () {
    //constructor 
    function Character(name, iconUrl, startCase) {
        this.life = 100;
        this.level = 5;
        this.name = name;
        this.iconUrl = iconUrl;
        this.case = startCase;
        this.closedCases = this.getClosedCases();
        this.weapon = new weapon_1.default("Regular", 10, "/assets/img/weapon/weapon2.png");
        this.defenseMode = false;
        this.direction = "left";
    }
    Character.prototype.takeWeapon = function (caseWeapon, field) {
        var weaponToDrop = this.weapon;
        this.weapon = caseWeapon.weapon;
        caseWeapon.removeWeapon();
        field.cases[caseWeapon.position.x][caseWeapon.position.y].weapon = weaponToDrop;
        //LogicWeapon.paintWeapon(caseWeapon, weaponToDrop, field);
    };
    Character.prototype.isWayBlocked = function (caseToReach, field) {
        var blocked = false;
        if (this.case.position.x === caseToReach.position.x) {
            var x = this.case.position.x;
            var yInit = 0;
            if (this.case.position.y < caseToReach.position.y) {
                yInit = this.case.position.y + 1;
            }
            else {
                yInit = caseToReach.position.y + 1;
            }
            var deltaY = Math.abs(this.case.position.y - caseToReach.position.y);
            for (var row = 0; row < deltaY; row++) {
                if (field.cases[x][yInit + row].isBlocked === true) {
                    blocked = true;
                }
            }
        }
        else {
            var xInit = 0;
            var y = this.case.position.y;
            if (this.case.position.x < caseToReach.position.x) {
                xInit = this.case.position.x + 1;
            }
            else {
                xInit = caseToReach.position.x + 1;
            }
            var deltaX = Math.abs(this.case.position.x - caseToReach.position.x);
            for (var col = 0; col < deltaX; col++) {
                if (field.cases[xInit + col][y].isBlocked === true) {
                    blocked = true;
                }
            }
        }
        if (blocked === true) {
            return true;
        }
        else {
            return false;
        }
    };
    Character.prototype.isCaseReachable = function (caseToReach, field) {
        var deltaX = Math.abs(caseToReach.position.x - this.case.position.x);
        var deltaY = Math.abs(caseToReach.position.y - this.case.position.y);
        if (deltaX <= 3 && deltaY <= 3) {
            if (caseToReach.position.x === this.case.position.x || caseToReach.position.y === this.case.position.y) {
                if (!caseToReach.isBlocked && !this.isWayBlocked(caseToReach, field)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        else {
            return false;
        }
    };
    Character.prototype.getClosedCases = function () {
        var closedCases = Array();
        var sizeX = this.case.gameManager.field.size.x;
        var sizeY = this.case.gameManager.field.size.y;
        var field = this.case.gameManager.field;
        for (var col = 0; col < sizeX; col++) {
            for (var row = 0; row < sizeY; row++) {
                if (this.case.casesAdjacent(field.cases[col][row])) {
                    closedCases.push(field.cases[col][row]);
                }
            }
        }
        return closedCases;
    };
    Character.prototype.isClosedCasesBlocked = function () {
        var allBlocked = true;
        for (var _i = 0, _a = this.closedCases; _i < _a.length; _i++) {
            var caseToCheck = _a[_i];
            if (!caseToCheck.isBlocked) {
                allBlocked = false;
            }
        }
        return allBlocked;
    };
    Character.prototype.moveTo = function (field, caseToMove) {
        var _this = this;
        if (caseToMove.gameManager.isFinished === true) {
            return;
        }
        var changedWeapon = false;
        var caseFrom = this.case;
        var previousWeapon = this.weapon;
        var logger = this.case.gameManager.logger;
        if (this.isCaseReachable(caseToMove, field)) {
            var nextPlayerArray = field.characters.filter(function (nextPlayer) {
                return (nextPlayer !== _this.case.gameManager.playerTour);
            });
            var nextPlayer = nextPlayerArray[0];
            this.case = caseToMove;
            this.closedCases = this.getClosedCases();
            if (caseToMove.hasWeapon()) {
                this.takeWeapon(this.case, field);
                changedWeapon = true;
                logger.writteDescription('The player ' + this.case.gameManager.playerTour.name + ' let the weapon ' + caseToMove.weapon.name + ' to take the weapon ' + this.weapon.name + '.');
                console.log('The player ' + this.case.gameManager.playerTour.name + ' let the weapon ' + caseToMove.weapon.name + ' to take the weapon ' + this.weapon.name + '.');
                menuManager_1.default.updateInfoWeapon(this, this.case.gameManager.players.indexOf(this));
            }
            // let condition1 = this.case.position.y < nextPlayer.case.position.y && caseFrom.position.y > nextPlayer.case.position.y;
            // let condition2 = this.case.position.y > nextPlayer.case.position.y && caseFrom.position.y < nextPlayer.case.position.y;
            logicCharacter_1.default.setAbsolutePosition(this);
            logicCharacter_1.default.checkPlayerDirection(this.case.gameManager);
            logicCharacter_1.default.characterAnimation(this, this.absoluteCoord);
            logicCharacter_1.default.checkPlayerDirection(this.case.gameManager);
            if (changedWeapon) {
                logicWeapon_1.default.paintWeapon(field.cases[caseFrom.position.x][caseFrom.position.y], previousWeapon, field);
            }
            this.case.gameManager.playerTour = nextPlayer;
            menuManager_1.default.updatePlayerTourMenu(this.case.gameManager.playerTour);
            logger.writteDescription('The player ' + this.case.gameManager.playerTour.name + ' can play.');
            console.log('The player ' + this.case.gameManager.playerTour.name + ' can play.');
            if (this.case.casesAdjacent(nextPlayer.case)) {
                fightManager_1.default.setFightMenu(this.case.gameManager);
            }
        }
        else {
            logger.writteDescription("This place is unreachable!!");
            console.log("This place is unreachable!!");
        }
    };
    Character.prototype.attack = function () {
        var _this = this;
        var logger = new logger_1.default();
        var tourDamage = 0;
        var opponent = this.case.gameManager.field.characters.filter(function (opponent) {
            return (opponent !== _this);
        })[0];
        var indexOpponent = this.case.gameManager.field.characters.indexOf(opponent);
        if (opponent.defenseMode === true) {
            tourDamage = Math.round((this.weapon.damage) / 2);
        }
        else {
            tourDamage = this.weapon.damage;
        }
        opponent.life = opponent.life - tourDamage;
        if (opponent.life < 0) {
            opponent.life = 0;
        }
        menuManager_1.default.updateInfoLife(opponent, indexOpponent, tourDamage);
        logger.writteDescription(opponent.name + ' received ' + tourDamage + 'pts of damages.');
        if (opponent.defenseMode === true) {
            opponent.defenseMode = false;
            var nameInfoDivElt = document.querySelectorAll('#' + opponent.name + ' .player-name-info')[0];
            nameInfoDivElt.removeChild(document.querySelectorAll('#' + opponent.name + ' .defense-mode')[0]);
        }
        this.case.gameManager.playerTour = opponent;
        menuManager_1.default.updatePlayerTourMenu(this.case.gameManager.playerTour);
        fightManager_1.default.updatePlayerTourFightMenu(this.case.gameManager.playerTour);
        if (opponent.life === 0) {
            fightManager_1.default.endGame(this);
        }
    };
    Character.prototype.defense = function () {
        var _this = this;
        if (this.defenseMode === true) {
            this.case.gameManager.logger.writteDescription("You are already in defense mode");
            return;
        }
        var divShieldElt = document.createElement("div");
        divShieldElt.classList.add("defense-mode");
        var imgShield = document.createElement("img");
        var nameInfoDivElt = document.querySelectorAll('#' + this.name + ' .player-name-info')[0];
        imgShield.src = "/assets/img/fight-menu/shield.png";
        imgShield.classList.add("shield-fight-img");
        divShieldElt.appendChild(imgShield);
        nameInfoDivElt.appendChild(divShieldElt);
        var opponent = this.case.gameManager.field.characters.filter(function (opponent) {
            return (opponent !== _this);
        })[0];
        this.defenseMode = true;
        this.case.gameManager.logger.writteDescription(this.name + ' is ready to defend himself.');
        this.case.gameManager.playerTour = opponent;
        menuManager_1.default.updatePlayerTourMenu(this.case.gameManager.playerTour);
        fightManager_1.default.updatePlayerTourFightMenu(this.case.gameManager.playerTour);
    };
    return Character;
}());
exports.default = Character;
},{"../../fightManager":8,"../../logger":10,"../../menuManager":11,"../../weapon/logic/logicWeapon":13,"../../weapon/model/weapon":14,"../logic/logicCharacter":3}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//This class for the fields
var Coord = /** @class */ (function () {
    //constructor 
    function Coord(x, y) {
        this.x = x;
        this.y = y;
    }
    return Coord;
}());
exports.default = Coord;
},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var case_1 = require("../../case/model/case");
var field_1 = require("../model/field");
var caseLogic_1 = require("../../case/logic/caseLogic");
var weapon_1 = require("../../weapon/model/weapon");
var logicWeapon_1 = require("../../weapon/logic/logicWeapon");
var logicCharacter_1 = require("../../character/logic/logicCharacter");
var coord_1 = require("../../coord/model/coord");
//This class will generate all the different objects needed for the game
var LogicField = /** @class */ (function () {
    function LogicField() {
    }
    /**
     *
     * @param x
     * @param y
     */
    LogicField.generateMap = function (x, y) {
        var totalCases = x * y;
        var blockedCases = Math.round(totalCases / 6);
        var field = new field_1.default(x, y);
        var arenaStyle = getComputedStyle(document.getElementById("arena"));
        //let fightEltWidth = Number(arenaStyle.width) - 2*arenaStyle.
        console.log(Number(arenaStyle.width));
        console.log(arenaStyle.padding);
        console.log(Number(arenaStyle.width) - Number(arenaStyle.padding));
        for (var col = 0; col < x; col++) {
            field.cases[col] = [];
            for (var row = 0; row < y; row++) {
                var position = new coord_1.default(col, row);
                if (blockedCases > 0) {
                    var blockedCase = new case_1.default(position, caseLogic_1.default.BLOCKED);
                    field.cases[col][row] = blockedCase;
                    blockedCases = blockedCases - 1;
                }
                else {
                    var nonBlockedCase = new case_1.default(position);
                    field.cases[col][row] = nonBlockedCase;
                }
            }
        }
        field.unsortCases();
        field.$el = document.getElementById("fight");
        return field;
    };
    /**
     *
     * @param elementToFill
     * @param field
     */
    LogicField.paintField = function (elementToFill, field) {
        for (var col = 0; col < field.size.x; col++) {
            var rowElt = document.createElement("div");
            rowElt.style.height = (100 / field.size.x).toFixed(2) + "%";
            rowElt.style.position = "relative";
            rowElt.classList.add("row-map");
            for (var row = 0; row < field.size.y; row++) {
                var divElt = caseLogic_1.default.paintCase(field.cases[col][row]);
                rowElt.appendChild(divElt);
            }
            elementToFill.appendChild(rowElt);
        }
    };
    LogicField.setWeapon = function (field) {
        for (var i = 0; i < 2; i++) {
            var weapon = new weapon_1.default("Mjolnir" + i, 10 + i, "/assets/img/weapon/weapon1.png");
            field.weapons.push(weapon);
        }
        for (var i = 0; i < 2; i++) {
            var weapon = new weapon_1.default("Stormbreaker" + i, 20 + i, "/assets/img/weapon/weapon1.png");
            field.weapons.push(weapon);
        }
        for (var _i = 0, _a = field.weapons; _i < _a.length; _i++) {
            var weapon = _a[_i];
            logicWeapon_1.default.paintStartWeapon(field, weapon);
        }
    };
    LogicField.setCharacters = function (field) {
        logicCharacter_1.default.paintStartCharacters(field, "Exterminator", "/assets/img/characters/avatar1.png");
        logicCharacter_1.default.paintStartCharacters(field, "Predator", "/assets/img/characters/avatar2.png");
    };
    return LogicField;
}());
exports.default = LogicField;
},{"../../case/logic/caseLogic":1,"../../case/model/case":2,"../../character/logic/logicCharacter":3,"../../coord/model/coord":5,"../../weapon/logic/logicWeapon":13,"../../weapon/model/weapon":14,"../model/field":7}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var coord_1 = require("../../coord/model/coord");
var size_1 = require("../../size/model/size");
var LogicHelper_1 = require("../../../helpers/LogicHelper");
//This class for the fields
var Field = /** @class */ (function () {
    //constructor 
    function Field(x, y) {
        this.size = new size_1.default(x, y);
        this.cases = Array();
        this.weapons = [];
        this.characters = [];
    }
    /**
     *
     * @param caseToAdd
     */
    Field.prototype.addCase = function (caseToAdd) {
        this.cases.push(caseToAdd);
    };
    /**
     *
     * @param indiceCase
     */
    Field.prototype.removeCase = function (position) {
        this.cases[position.x].splice(position.y, 1);
    };
    /**
     *
     */
    Field.prototype.nbrOfBlockedCase = function () {
        var nbrOfBlockedCase = 0;
        for (var row = 0; row < this.size.x; row++) {
            for (var col = 0; col < this.size.y; col++) {
                if (this.cases[row][col].isBlocked) {
                    nbrOfBlockedCase = nbrOfBlockedCase + 1;
                }
            }
        }
        return nbrOfBlockedCase;
    };
    /**
     *
     */
    Field.prototype.getNonBlockedCases = function () {
        var NonBlockedCases = [];
        for (var row = 0; row < this.size.x; row++) {
            for (var col = 0; col < this.size.y; col++) {
                if (!this.cases[row][col].isBlocked) {
                    var caseToAdd = this.cases[row][col];
                    NonBlockedCases.push(caseToAdd);
                }
            }
        }
        return NonBlockedCases;
    };
    Field.prototype.getBlockedCases = function () {
        var BlockedCases = [];
        for (var row = 0; row < this.size.x; row++) {
            for (var col = 0; col < this.size.y; col++) {
                if (this.cases[row][col].isBlocked) {
                    var caseToAdd = this.cases[row][col];
                    BlockedCases.push(caseToAdd);
                }
            }
        }
        return BlockedCases;
    };
    Field.prototype.getAvailableCases = function () {
        var availableCases = [];
        for (var row = 0; row < this.size.x; row++) {
            for (var col = 0; col < this.size.y; col++) {
                if (this.cases[row][col].isAvailable && !this.cases[row][col].isBlocked) {
                    var caseToAdd = this.cases[row][col];
                    availableCases.push(caseToAdd);
                }
            }
        }
        return availableCases;
    };
    /**
     *
     * @param position
     */
    Field.prototype.getCaseByPosition = function (position) {
        console.log(this.cases[position.x][position.y]);
        if (position === undefined) {
            return undefined;
        }
        else {
            return this.cases[position.x][position.y];
        }
    };
    /**
     *
     */
    Field.prototype.getRandomCase = function () {
        var randomX = LogicHelper_1.default.getRandomDimension(this.size.x - 1);
        var randomY = LogicHelper_1.default.getRandomDimension(this.size.y - 1);
        var randomCoord = new coord_1.default(randomX, randomY);
        var caseRandom = this.getCaseByPosition(randomCoord);
        var caseToCheck = document.getElementById(caseRandom.positionString);
        while (caseToCheck === null || caseToCheck === undefined || caseRandom === undefined || caseRandom === null) {
            var randomX_1 = LogicHelper_1.default.getRandomDimension(this.size.x - 1);
            var randomY_1 = LogicHelper_1.default.getRandomDimension(this.size.y - 1);
            var randomCoord_1 = new coord_1.default(randomX_1, randomY_1);
            caseRandom = this.getCaseByPosition(randomCoord_1);
        }
        return caseRandom;
    };
    Field.prototype.getNonBlockedRandomCase = function () {
        var nonBlockedCases = this.getNonBlockedCases();
        var indice = LogicHelper_1.default.getRandomDimension(nonBlockedCases.length - 1);
        var nonBlockedRandomCase = nonBlockedCases[indice];
        return nonBlockedRandomCase;
    };
    Field.prototype.getAvailableRandomCase = function () {
        var availableCases = this.getAvailableCases();
        var indice = LogicHelper_1.default.getRandomDimension(availableCases.length - 1);
        var availableRandomCase = availableCases[indice];
        return availableRandomCase;
    };
    Field.prototype.duplicateListOfCase = function () {
        var casesTemp = Array();
        for (var row = 0; row < this.size.x; row++) {
            for (var col = 0; col < this.size.y; col++) {
                var caseToAdd = this.cases[row][col];
                casesTemp.push(caseToAdd);
            }
        }
        return casesTemp;
    };
    Field.prototype.unsortCases = function () {
        var casesTemp = this.duplicateListOfCase();
        for (var col = 0; col < this.size.x; col++) {
            for (var row = 0; row < this.size.y; row++) {
                var indice = LogicHelper_1.default.getRandomDimension(casesTemp.length - 1);
                this.cases[col][row] = casesTemp[indice];
                this.cases[col][row].position.x = col;
                this.cases[col][row].position.y = row;
                this.cases[col][row].positionString = String(col) + String(row);
                casesTemp.splice(indice, 1);
            }
        }
    };
    Field.prototype.getCaseByElt = function (el) {
        for (var _i = 0, _a = this.cases; _i < _a.length; _i++) {
            var rowCases = _a[_i];
            for (var _b = 0, rowCases_1 = rowCases; _b < rowCases_1.length; _b++) {
                var caseToGet = rowCases_1[_b];
                if (caseToGet.$el === el) {
                    return caseToGet;
                }
            }
        }
    };
    return Field;
}());
exports.default = Field;
},{"../../../helpers/LogicHelper":15,"../../coord/model/coord":5,"../../size/model/size":12}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FightManager = /** @class */ (function () {
    function FightManager() {
    }
    FightManager.fightToDeath = function (player1, player2) {
        var logger;
        logger.writteDescription('The death match begins !!');
        document.getElementById('');
    };
    FightManager.setIdPlayerInfo = function (gameManager, element) {
        document.getElementsByClassName("character-to-fight-avatar")[0].id = gameManager.players[0].name;
        document.getElementsByClassName("character-to-fight-avatar")[1].id = gameManager.players[1].name;
    };
    FightManager.setFightMenu = function (gameManager) {
        gameManager.isFinished = true;
        var divFightMenuElt = document.getElementById("fight-menu");
        divFightMenuElt.style.display = "block";
        var avatar1 = gameManager.players[0].iconUrl;
        var imgAvatar1 = document.createElement("img");
        imgAvatar1.src = avatar1;
        imgAvatar1.style.transform = "rotateY(180deg)";
        var avatar2 = gameManager.players[1].iconUrl;
        var imgAvatar2 = document.createElement("img");
        imgAvatar2.src = avatar2;
        var divCharacterToFight1 = document.getElementsByClassName("character-to-fight-avatar")[0];
        divCharacterToFight1.classList.add(gameManager.players[0].name);
        divCharacterToFight1.appendChild(imgAvatar1);
        var divCharacterToFight2 = document.getElementsByClassName("character-to-fight-avatar")[1];
        divCharacterToFight2.classList.add(gameManager.players[1].name);
        divCharacterToFight2.appendChild(imgAvatar2);
        this.setAttackButton(gameManager);
        this.setDefenseButton(gameManager);
        document.getElementById("arena").appendChild(divFightMenuElt);
        document.getElementById("fight").classList.add("fight-mode");
        if (gameManager.playerTour === gameManager.players[0]) {
            document.querySelectorAll('.' + gameManager.playerTour.name)[0].classList.add("playerTour-fight");
            document.querySelectorAll('.' + gameManager.players[1].name)[0].classList.add("passivePlayer-fight");
        }
        else {
            document.querySelectorAll('.' + gameManager.playerTour.name)[0].classList.add("playerTour-fight");
            document.querySelectorAll('.' + gameManager.players[0].name)[0].classList.add("passivePlayer-fight");
        }
    };
    FightManager.setAttackButton = function (gameManager) {
        var _this = this;
        var attackButton = document.querySelectorAll('#btnAttack')[0];
        attackButton.onclick = function (event) {
            _this.onClickAttack(event, gameManager);
        };
    };
    FightManager.onClickAttack = function (event, gameManager) {
        var offensivePlayer = gameManager.playerTour;
        var defensivePlayer = gameManager.field.characters.filter(function (defensivePlayer) {
            return (defensivePlayer !== offensivePlayer);
        })[0];
        offensivePlayer.attack();
    };
    FightManager.setDefenseButton = function (gameManager) {
        var _this = this;
        var defenseButton = document.querySelectorAll('#btnDefense')[0];
        defenseButton.onclick = function (event) {
            _this.onClickDefense(event, gameManager);
        };
    };
    FightManager.onClickDefense = function (event, gameManager) {
        gameManager.playerTour.defense();
    };
    FightManager.onClickReload = function (event) {
        location.reload();
    };
    FightManager.endGame = function (player) {
        //window.alert('The player ' +player.name+ ' lost!!\nThe game will restart.');
        //location.reload(true);
        var _this = this;
        document.getElementById("endGame-modal").style.display = "block";
        document.getElementById("arena").style.filter = "brightness(50%)";
        document.getElementById("winner").textContent = player.name + " win the game!!!";
        var winnerImg = document.createElement("img");
        winnerImg.src = player.iconUrl;
        document.getElementById("winner-img").appendChild(winnerImg);
        var refresh = document.getElementById("endGame-img-reload");
        refresh.onclick = function (event) {
            _this.onClickReload(event);
        };
    };
    FightManager.updatePlayerTourFightMenu = function (player) {
        var playerTourElt = document.getElementsByClassName("playerTour-fight")[0];
        var passivePlayerElt = document.getElementsByClassName("passivePlayer-fight")[0];
        playerTourElt.classList.remove('playerTour-fight');
        passivePlayerElt.classList.remove('passivePlayer-fight');
        passivePlayerElt.classList.add('playerTour-fight');
        playerTourElt.classList.add('passivePlayer-fight');
    };
    return FightManager;
}());
exports.default = FightManager;
},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logicField_1 = require("./field/logic/logicField");
var logger_1 = require("./logger");
var menuManager_1 = require("./menuManager");
var GameManager = /** @class */ (function () {
    /**
     *
     */
    function GameManager() {
        this.id = 'fight';
        this.maxMove = 3;
        this.players = new Array();
        this.logger = new logger_1.default();
        this.$el = document.getElementById(this.id);
        this.isFinished = false;
    }
    GameManager.prototype.setGameManager = function () {
        for (var _i = 0, _a = this.field.cases; _i < _a.length; _i++) {
            var rowField = _a[_i];
            for (var _b = 0, rowField_1 = rowField; _b < rowField_1.length; _b++) {
                var caseToUpdate = rowField_1[_b];
                caseToUpdate.gameManager = this;
            }
        }
    };
    GameManager.prototype.startGame = function () {
        this.logger.writteDescription('starting game...');
        console.log('starting game...');
        var field = logicField_1.default.generateMap(10, 10);
        this.field = field;
        this.setGameManager();
        logicField_1.default.paintField(document.getElementById("fight"), field);
        logicField_1.default.setWeapon(field);
        logicField_1.default.setCharacters(field);
        // First Player start
        this.playerTour = field.characters[0];
        menuManager_1.default.setMenu(this);
        this.showReachableCase();
        this.logger.writteDescription('The player ' + this.playerTour.name + ' can play.');
        console.log('The player ' + this.playerTour.name + ' can play.');
    };
    GameManager.prototype.showReachableCase = function () {
        for (var col = 0; col < this.field.size.x; col++) {
            for (var row = 0; row < this.field.size.y; row++) {
                var caseToCheck = this.field.cases[col][row];
                if (this.playerTour.isCaseReachable(caseToCheck, this.field) === true && caseToCheck !== this.playerTour.case) {
                    caseToCheck.$el.classList.add("case-reachable");
                }
            }
        }
    };
    return GameManager;
}());
exports.default = GameManager;
},{"./field/logic/logicField":6,"./logger":10,"./menuManager":11}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger = /** @class */ (function () {
    function Logger() {
        this.activity = Array();
        this.$el = document.getElementById('activity-item-list');
    }
    Logger.prototype.writteDescription = function (text) {
        var activityElt = this.$el;
        this.activity.push(text);
        var lastActivityIndice = this.activity.length - 1;
        var divElt = document.createElement("div");
        var divTextElt = document.createElement("div");
        var itemList = document.getElementsByClassName('last-item');
        if (itemList[0] !== undefined && itemList[0] !== null) {
            itemList[0].classList.remove('last-item');
        }
        divTextElt.textContent = this.activity[lastActivityIndice];
        activityElt.insertAdjacentHTML('afterbegin', '<div class="activity-item last-item">' + this.activity[lastActivityIndice] + '</div>');
    };
    return Logger;
}());
exports.default = Logger;
},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MenuManager = /** @class */ (function () {
    function MenuManager() {
    }
    MenuManager.setMenu = function (gameManager) {
        this.setIdPlayerInfo(gameManager);
        this.setInfo(gameManager.players[0], 0);
        gameManager.players[0].$avatarLifeElt = document.querySelectorAll('#' + gameManager.players[0].name + ' .life-info')[0];
        this.setInfo(gameManager.players[1], 1);
        gameManager.players[1].$avatarLifeElt = document.querySelectorAll('#' + gameManager.players[1].name + ' .life-info')[0];
        this.updatePlayerTourMenu(gameManager.playerTour);
    };
    MenuManager.setIdPlayerInfo = function (gameManager) {
        document.getElementsByClassName("player-info")[0].id = gameManager.players[0].name;
        document.getElementsByClassName("player-info")[1].id = gameManager.players[1].name;
    };
    MenuManager.setInfo = function (player, indicePlayer) {
        var lifeInfoElt = document.querySelectorAll('#' + player.name + ' .life-info')[0];
        var divLifeElt = document.querySelectorAll('#' + player.name + ' .life-value')[0];
        divLifeElt.textContent = String(player.life);
        var divDamageElt = document.querySelectorAll('#' + player.name + ' .damageTour')[0];
        this.setColorInfoLife(player, indicePlayer);
        var weaponInfoElt = document.querySelectorAll('#' + player.name + ' .weapon-info')[0];
        var divWeaponElt = document.querySelectorAll('#' + player.name + ' .weapon-value')[0];
        divWeaponElt.textContent = player.weapon.name + '(' + player.weapon.damage + ')';
        var divAvatarElt = document.querySelectorAll('#' + player.name + ' .avatar-img')[0];
        var avatar = player.iconUrl;
        var imgAvatar = document.createElement("img");
        imgAvatar.src = avatar;
        divAvatarElt.appendChild(imgAvatar);
        var nameInfoElt = document.querySelectorAll('#' + player.name + ' .player-name')[0];
        nameInfoElt.textContent = player.name;
        var nameInfoDivElt = document.querySelectorAll('#' + player.name + ' .player-name-info')[0];
        switch (indicePlayer) {
            case 0:
                divAvatarElt.style.left = "5%";
                divLifeElt.style.marginLeft = "5px";
                divWeaponElt.style.marginLeft = "5px";
                divDamageElt.style.marginLeft = "5px";
                nameInfoElt.style.marginRight = "5px";
                imgAvatar.style.transform = "rotateY(180deg)";
                break;
            case 1:
                divAvatarElt.style.right = "5%";
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
    };
    MenuManager.updateInfoLife = function (player, indicePlayer, damage) {
        var lifeInfoElt = document.querySelectorAll('#' + player.name + ' .life-value')[0];
        var damageElt = document.getElementsByClassName("damageTour")[indicePlayer];
        damageElt.textContent = String("-" + damage);
        lifeInfoElt.innerHTML = "";
        lifeInfoElt.textContent = String(player.life);
        this.setColorInfoLife(player, indicePlayer);
    };
    MenuManager.setColorInfoLife = function (player, indicePlayer) {
        var lifeInfoElt = document.getElementsByClassName("life-value")[indicePlayer];
        if (player.$avatarLifeElt !== undefined) {
            if (player.$avatarLifeElt.classList.contains('high-life-level')) {
                player.$avatarLifeElt.classList.remove('high-life-level');
            }
            else if (player.$avatarLifeElt.classList.contains('medium-life-level')) {
                player.$avatarLifeElt.classList.remove('medium-life-level');
            }
            else if (player.$avatarLifeElt.classList.contains('low-life-level')) {
                player.$avatarLifeElt.classList.remove('low-life-level');
            }
        }
        if (player.life > 75) {
            lifeInfoElt.classList.add('high-life-level');
        }
        else if (player.life > 30 && player.life <= 75) {
            lifeInfoElt.classList.add('medium-life-level');
        }
        else {
            lifeInfoElt.classList.add('low-life-level');
        }
    };
    MenuManager.updateInfoWeapon = function (player, indicePlayer) {
        var weaponInfoElt = document.getElementsByClassName("weapon-value")[indicePlayer];
        weaponInfoElt.innerHTML = "";
        weaponInfoElt.textContent = player.weapon.name + '(' + player.weapon.damage + ')';
    };
    MenuManager.updatePlayerTourMenu = function (player) {
        var playerElts = document.getElementsByClassName("playerTour");
        if (playerElts[0] !== undefined && playerElts[0] !== null) {
            playerElts[0].classList.remove("playerTour");
        }
        var playerTourElt = document.querySelectorAll('#' + player.name + ' .avatar-img')[0];
        playerTourElt.classList.add("playerTour");
    };
    return MenuManager;
}());
exports.default = MenuManager;
},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//This class for the fields
var Size = /** @class */ (function () {
    //constructor 
    function Size(x, y) {
        this.x = x;
        this.y = y;
    }
    return Size;
}());
exports.default = Size;
},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogicWeapon = /** @class */ (function () {
    function LogicWeapon() {
    }
    LogicWeapon.paintStartWeapon = function (field, weapon) {
        var caseWeapon = field.getAvailableRandomCase();
        var imgWeapon = document.createElement("img");
        var spanElt = document.createElement("span");
        spanElt.classList.add("weapon");
        imgWeapon.src = weapon.iconUrl;
        imgWeapon.style.maxWidth = "100%";
        imgWeapon.style.maxHeight = "50%";
        imgWeapon.style.position = "absolute";
        imgWeapon.style.top = "30%";
        imgWeapon.style.left = "0";
        imgWeapon.style.zIndex = "20";
        spanElt.appendChild(imgWeapon);
        document.getElementById(caseWeapon.positionString).appendChild(spanElt);
        field.cases[caseWeapon.position.x][caseWeapon.position.y].isAvailable = false;
        field.cases[caseWeapon.position.x][caseWeapon.position.y].weapon = weapon;
        weapon.$el = spanElt;
    };
    LogicWeapon.paintWeapon = function (caseWeapon, weapon, field) {
        var imgWeapon = document.createElement("img");
        var spanElt = document.createElement("span");
        spanElt.classList.add("weapon");
        imgWeapon.src = weapon.iconUrl;
        imgWeapon.style.maxWidth = "100%";
        imgWeapon.style.maxHeight = "50%";
        imgWeapon.style.position = "absolute";
        imgWeapon.style.top = "30%";
        imgWeapon.style.left = "0";
        imgWeapon.style.zIndex = "20";
        spanElt.appendChild(imgWeapon);
        document.getElementById(caseWeapon.positionString).appendChild(spanElt);
        field.cases[caseWeapon.position.x][caseWeapon.position.y].weapon = weapon;
        weapon.$el = spanElt;
    };
    return LogicWeapon;
}());
exports.default = LogicWeapon;
},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//This class for the fields
var Weapon = /** @class */ (function () {
    //constructor 
    function Weapon(name, damage, iconUrl) {
        this.name = name;
        this.damage = damage;
        this.iconUrl = iconUrl;
    }
    return Weapon;
}());
exports.default = Weapon;
},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogicHelper = /** @class */ (function () {
    function LogicHelper() {
    }
    LogicHelper.getRandomDimension = function (dimension) {
        return Math.round(Math.random() * dimension);
    };
    return LogicHelper;
}());
exports.default = LogicHelper;
},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gameManager_1 = require("./entities/gameManager");
var gameManager = new gameManager_1.default();
gameManager.startGame();
},{"./entities/gameManager":9}]},{},[16])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZW50aXRpZXMvY2FzZS9sb2dpYy9jYXNlTG9naWMudHMiLCJzcmMvZW50aXRpZXMvY2FzZS9tb2RlbC9jYXNlLnRzIiwic3JjL2VudGl0aWVzL2NoYXJhY3Rlci9sb2dpYy9sb2dpY0NoYXJhY3Rlci50cyIsInNyYy9lbnRpdGllcy9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyLnRzIiwic3JjL2VudGl0aWVzL2Nvb3JkL21vZGVsL2Nvb3JkLnRzIiwic3JjL2VudGl0aWVzL2ZpZWxkL2xvZ2ljL2xvZ2ljRmllbGQudHMiLCJzcmMvZW50aXRpZXMvZmllbGQvbW9kZWwvZmllbGQudHMiLCJzcmMvZW50aXRpZXMvZmlnaHRNYW5hZ2VyLnRzIiwic3JjL2VudGl0aWVzL2dhbWVNYW5hZ2VyLnRzIiwic3JjL2VudGl0aWVzL2xvZ2dlci50cyIsInNyYy9lbnRpdGllcy9tZW51TWFuYWdlci50cyIsInNyYy9lbnRpdGllcy9zaXplL21vZGVsL3NpemUudHMiLCJzcmMvZW50aXRpZXMvd2VhcG9uL2xvZ2ljL2xvZ2ljV2VhcG9uLnRzIiwic3JjL2VudGl0aWVzL3dlYXBvbi9tb2RlbC93ZWFwb24udHMiLCJzcmMvaGVscGVycy9Mb2dpY0hlbHBlci50cyIsInNyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNHQTtJQUFBO0lBa0NBLENBQUM7SUE3Qkc7Ozs7OztPQU1HO0lBQ0ksbUJBQVMsR0FBaEIsVUFBaUIsV0FBaUI7UUFDOUIsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7UUFFbkMsUUFBUSxXQUFXLENBQUMsU0FBUyxFQUFFO1lBQzNCLEtBQUssS0FBSztnQkFDTixNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDN0IsTUFBTTtZQUVWLEtBQUssSUFBSTtnQkFDTCxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDN0IsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ2hDLE1BQU07U0FDYjtRQUNELE1BQU0sQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUUvQyxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFCLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUE1Qk0saUJBQU8sR0FBVyxTQUFTLENBQUM7SUFDNUIsZ0JBQU0sR0FBVyxRQUFRLENBQUM7SUErQnJDLGdCQUFDO0NBbENELEFBa0NDLElBQUE7QUFFRCxrQkFBZSxTQUFTLENBQUM7Ozs7QUN2Q3pCLHdEQUFtRDtBQUduRCw4REFBeUQ7QUFLekQ7SUFZSSxjQUFjO0lBQ2QsY0FBWSxRQUFlLEVBQUUsSUFBK0IsRUFBRSxXQUEyQjtRQUE1RCxxQkFBQSxFQUFBLE9BQWUsbUJBQVMsQ0FBQyxNQUFNO1FBQUUsNEJBQUEsRUFBQSxrQkFBMkI7UUFFckYsUUFBUSxJQUFJLEVBQUU7WUFDVixLQUFLLG1CQUFTLENBQUMsTUFBTTtnQkFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxzQ0FBc0MsQ0FBQztnQkFDckQsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7Z0JBQ3ZCLE1BQU07WUFFVixLQUFLLG1CQUFTLENBQUMsT0FBTztnQkFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyx1Q0FBdUMsQ0FBQztnQkFDdEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7Z0JBQ3RCLE1BQU07U0FDYjtRQUNELElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCw0QkFBYSxHQUFiLFVBQWMsV0FBaUI7UUFDM0IsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDekQsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3pELElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0RSxJQUFHLENBQUMsT0FBTyxJQUFJLGNBQWMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxjQUFjLElBQUksQ0FBQyxDQUFDLEVBQUM7WUFDcEUsT0FBTyxJQUFJLENBQUM7U0FDZjthQUFJO1lBQ0QsT0FBTyxLQUFLLENBQUM7U0FDaEI7SUFDTCxDQUFDO0lBRUQsd0JBQVMsR0FBVDtRQUNJLElBQUcsSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUM7WUFDcEIsT0FBTyxJQUFJLENBQUM7U0FDZjthQUFJO1lBQ0QsT0FBTyxLQUFLLENBQUM7U0FDaEI7SUFDTCxDQUFDO0lBSUQsMkJBQVksR0FBWjtRQUVJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBRXZCLENBQUM7SUFFRCx3QkFBUyxHQUFULFVBQVUsS0FBWSxFQUFFLE1BQWM7UUFDbEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIscUJBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQsb0JBQUssR0FBTCxVQUFNLE9BQW9CO1FBQTFCLGlCQVFDO1FBUEcsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7UUFFbkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsVUFBQyxLQUFpQjtZQUNqQyxLQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQztRQUVGLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNwQixDQUFDO0lBRUQsc0JBQU8sR0FBUCxVQUFRLEtBQWlCO1FBRWpCLElBQUksYUFBYSxHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1RCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztRQUVuQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMzQyxJQUFJLFlBQVksR0FBaUIsYUFBYSxDQUFDLENBQUMsQ0FBRSxDQUFDO1lBQ25ELFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDbkQ7UUFFRCxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3RCwyQ0FBMkM7UUFDM0MsSUFBSSxRQUFRLENBQUMsU0FBUyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUNyQyxPQUFPO1NBQ1Y7UUFDRCwyQkFBMkI7UUFFM0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBR3JFLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUU3QyxDQUFDO0lBR0wsV0FBQztBQUFELENBeEdBLEFBd0dDLElBQUE7QUFJRCxrQkFBZSxJQUFJLENBQUM7Ozs7QUNsSHBCLDZEQUF3RDtBQUV4RCxpREFBNEM7QUFHNUM7SUFBQTtJQWdIQSxDQUFDO0lBOUdVLG1DQUFvQixHQUEzQixVQUE0QixLQUFZLEVBQUUsYUFBcUIsRUFBRSxPQUFlO1FBQzVFLElBQUksTUFBTSxHQUFHLElBQUksbUJBQVMsQ0FBQyxhQUFhLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLENBQUM7UUFFbkYsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQyxVQUFVO1lBQ2hELE9BQU8sQ0FBQyxVQUFVLEtBQUssTUFBTSxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFLUixJQUFJLE9BQU8sS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxXQUFXLEVBQUU7WUFFNUMsT0FBTSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxFQUFDO2dCQUN2RixNQUFNLEdBQUcsSUFBSSxtQkFBUyxDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLHNCQUFzQixFQUFFLENBQUMsQ0FBQzthQUNsRjtTQUVGO1FBRUgsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ2hGLElBQUksT0FBTyxHQUFxQixRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlELElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFN0MsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUIsT0FBTyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQzdCLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztRQUNoQyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRSxHQUFHLENBQUM7UUFDaEUsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO1FBQ3BDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUM1QixJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3BELFlBQVksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEMsTUFBTSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7UUFDckIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWpDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDdEQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUVyRCxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTdDLElBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUM7WUFDNUMsSUFBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFDO2dCQUNuRCxjQUFjLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3JDO2lCQUFJO2dCQUNILGNBQWMsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDekM7U0FDTjtJQUNMLENBQUM7SUFFTSw4QkFBZSxHQUF0QixVQUF1QixLQUFZLEVBQUUsTUFBaUIsRUFBRSxVQUFnQjtRQUVwRSxJQUFJLE9BQU8sR0FBcUIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5RCxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTdDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlCLE9BQU8sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUM3QixPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7UUFDaEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2hDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztRQUNwQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDeEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ3pCLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUM1QixPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdCLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQ25DLFlBQVksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEMsTUFBTSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQztJQUVNLGlDQUFrQixHQUF6QixVQUEwQixNQUFpQixFQUFFLFFBQWU7UUFFeEQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQzFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUU3QyxDQUFDO0lBRU0sMkJBQVksR0FBbkIsVUFBb0IsTUFBaUI7UUFDakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwQixNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsaUJBQWlCLENBQUM7UUFDL0MsSUFBRyxNQUFNLENBQUMsU0FBUyxLQUFLLE1BQU0sRUFBQztZQUMzQixNQUFNLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztTQUM5QjthQUFJO1lBQ0QsTUFBTSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7U0FDN0I7SUFDTCxDQUFDO0lBRU0sbUNBQW9CLEdBQTNCLFVBQTRCLFdBQXdCO1FBQ2hELElBQUksVUFBVSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsVUFBVTtZQUNuRCxPQUFPLENBQUMsVUFBVSxDQUFDLFNBQVMsS0FBSyxPQUFPLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVOLElBQUksV0FBVyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsV0FBVztZQUN2RCxPQUFPLENBQUMsV0FBVyxDQUFDLFNBQVMsS0FBSyxNQUFNLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVOLElBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQztZQUN4RCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDM0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ2hDO0lBQ1AsQ0FBQztJQUVNLGtDQUFtQixHQUExQixVQUEyQixNQUFpQjtRQUN4QyxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDO1FBQ3BFLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUM7UUFDbkUsSUFBSSxzQkFBc0IsR0FBRyxJQUFJLGVBQUssQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDN0QsTUFBTSxDQUFDLGFBQWEsR0FBRyxzQkFBc0IsQ0FBQztJQUNsRCxDQUFDO0lBRUwscUJBQUM7QUFBRCxDQWhIQSxBQWdIQyxJQUFBO0FBRUQsa0JBQWUsY0FBYyxDQUFDOzs7O0FDeEg5QixvREFBK0M7QUFDL0MsOERBQXlEO0FBRXpELDBEQUFxRDtBQUVyRCxpREFBNEM7QUFDNUMsdUNBQWtDO0FBQ2xDLG1EQUE4QztBQUU5QywyQkFBMkI7QUFDM0I7SUFpQkcsY0FBYztJQUNkLG1CQUFZLElBQVksRUFBRSxPQUFlLEVBQUUsU0FBZTtRQUN2RCxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNoQixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxnQkFBTSxDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztRQUMxRSxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztJQUUzQixDQUFDO0lBRUQsOEJBQVUsR0FBVixVQUFXLFVBQWdCLEVBQUUsS0FBWTtRQUN0QyxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUNoQyxVQUFVLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDMUIsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQztRQUVoRiwyREFBMkQ7SUFDOUQsQ0FBQztJQUVELGdDQUFZLEdBQVosVUFBYSxXQUFpQixFQUFFLEtBQVk7UUFDekMsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLElBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFDO1lBQ2hELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDZCxJQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQztnQkFDakQsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7YUFDOUI7aUJBQUk7Z0JBQ0YsS0FBSyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQzthQUNuQztZQUNBLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckUsS0FBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQztnQkFDbEMsSUFBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLEtBQUssSUFBSSxFQUFDO29CQUM3QyxPQUFPLEdBQUcsSUFBSSxDQUFDO2lCQUNqQjthQUVIO1NBQ0o7YUFBSTtZQUNGLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNkLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQztnQkFDOUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7YUFDakM7aUJBQUk7Z0JBQ0YsS0FBSyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQzthQUNuQztZQUNBLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckUsS0FBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQztnQkFDbEMsSUFBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssSUFBSSxFQUFDO29CQUM3QyxPQUFPLEdBQUcsSUFBSSxDQUFDO2lCQUNqQjthQUVIO1NBQ0o7UUFDRCxJQUFHLE9BQU8sS0FBSyxJQUFJLEVBQUM7WUFDakIsT0FBTyxJQUFJLENBQUM7U0FDZDthQUFJO1lBQ0YsT0FBTyxLQUFLLENBQUM7U0FDZjtJQUNILENBQUM7SUFFRixtQ0FBZSxHQUFmLFVBQWdCLFdBQWlCLEVBQUUsS0FBWTtRQUM1QyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckUsSUFBSSxNQUFNLElBQUksQ0FBQyxJQUFLLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDOUIsSUFBRyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFDO2dCQUN0RyxJQUFHLENBQUMsV0FBVyxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxFQUFDO29CQUNwRSxPQUFPLElBQUksQ0FBQztpQkFDWDtxQkFBSTtvQkFDRixPQUFPLEtBQUssQ0FBQTtpQkFDZDthQUNIO1NBQ0E7YUFBSTtZQUNGLE9BQU8sS0FBSyxDQUFDO1NBQ2Y7SUFDSixDQUFDO0lBRUQsa0NBQWMsR0FBZDtRQUNHLElBQUksV0FBVyxHQUFHLEtBQUssRUFBUSxDQUFDO1FBQ2hDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQy9DLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQy9DLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztRQUV4QyxLQUFJLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFDO1lBQ2pDLEtBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUM7Z0JBQ2pDLElBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDO29CQUMvQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDMUM7YUFDSDtTQUNIO1FBQ0QsT0FBTyxXQUFXLENBQUM7SUFDdEIsQ0FBQztJQUVELHdDQUFvQixHQUFwQjtRQUNHLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQztRQUN0QixLQUF1QixVQUFnQixFQUFoQixLQUFBLElBQUksQ0FBQyxXQUFXLEVBQWhCLGNBQWdCLEVBQWhCLElBQWdCLEVBQUM7WUFBcEMsSUFBSSxXQUFXLFNBQUE7WUFDaEIsSUFBRyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUM7Z0JBQ3ZCLFVBQVUsR0FBRyxLQUFLLENBQUM7YUFDckI7U0FDSDtRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ3JCLENBQUM7SUFFRCwwQkFBTSxHQUFOLFVBQU8sS0FBWSxFQUFFLFVBQWdCO1FBQXJDLGlCQXdEQztRQXRERSxJQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsVUFBVSxLQUFLLElBQUksRUFBQztZQUMzQyxPQUFPO1NBQ1Q7UUFFRCxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDMUIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN6QixJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ2pDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztRQUMxQyxJQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxFQUFDO1lBRXhDLElBQUksZUFBZSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQUMsVUFBVTtnQkFDdEQsT0FBTyxDQUFDLFVBQVUsS0FBSyxLQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzRCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksVUFBVSxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV4QyxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztZQUN2QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN6QyxJQUFHLFVBQVUsQ0FBQyxTQUFTLEVBQUUsRUFBQztnQkFDdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNsQyxhQUFhLEdBQUcsSUFBSSxDQUFDO2dCQUNyQixNQUFNLENBQUMsaUJBQWlCLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsa0JBQWtCLEdBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUUsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzdLLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsa0JBQWtCLEdBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUUsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ2hLLHFCQUFXLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUNsRjtZQUVELDBIQUEwSDtZQUMxSCwwSEFBMEg7WUFFdEgsd0JBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUV2Qyx3QkFBYyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFHN0Qsd0JBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzVELHdCQUFjLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUM1RCxJQUFHLGFBQWEsRUFBQztnQkFDZCxxQkFBVyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxjQUFjLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDeEc7WUFHSixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1lBQzlDLHFCQUFXLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDbkUsTUFBTSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLFlBQVksQ0FBQyxDQUFDO1lBQy9GLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUM7WUFFbEYsSUFBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUM7Z0JBQzVDLHNCQUFZLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDaEQ7U0FFQTthQUFJO1lBQ0YsTUFBTSxDQUFDLGlCQUFpQixDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFDeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1NBQzdDO0lBQ0osQ0FBQztJQUVELDBCQUFNLEdBQU47UUFBQSxpQkFzQ0M7UUFyQ0UsSUFBSSxNQUFNLEdBQUcsSUFBSSxnQkFBTSxFQUFFLENBQUM7UUFDMUIsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQUMsUUFBUTtZQUNuRSxPQUFPLENBQUMsUUFBUSxLQUFLLEtBQUksQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRU4sSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFN0UsSUFBRyxRQUFRLENBQUMsV0FBVyxLQUFLLElBQUksRUFBQztZQUM5QixVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEQ7YUFBSTtZQUNILFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztTQUNqQztRQUNELFFBQVEsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7UUFDM0MsSUFBRyxRQUFRLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBQztZQUNuQixRQUFRLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztTQUNuQjtRQUNELHFCQUFXLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDaEUsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsWUFBWSxHQUFHLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDO1FBRXhGLElBQUcsUUFBUSxDQUFDLFdBQVcsS0FBSyxJQUFJLEVBQUM7WUFDL0IsUUFBUSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDN0IsSUFBSSxjQUFjLEdBQW1CLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEdBQUUsUUFBUSxDQUFDLElBQUksR0FBRSxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVHLGNBQWMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsR0FBRSxRQUFRLENBQUMsSUFBSSxHQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUVoRztRQUlELElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7UUFDNUMscUJBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVuRSxzQkFBWSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRXpFLElBQUcsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUM7WUFDckIsc0JBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDN0I7SUFDSixDQUFDO0lBRUQsMkJBQU8sR0FBUDtRQUFBLGlCQTZCQztRQTNCRSxJQUFHLElBQUksQ0FBQyxXQUFXLEtBQUssSUFBSSxFQUFDO1lBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1lBQ2xGLE9BQU87U0FDVDtRQUVELElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakQsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDM0MsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QyxJQUFJLGNBQWMsR0FBbUIsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsR0FBRSxJQUFJLENBQUMsSUFBSSxHQUFFLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFeEcsU0FBUyxDQUFDLEdBQUcsR0FBRyxtQ0FBbUMsQ0FBQztRQUNwRCxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBRTVDLFlBQVksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDcEMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUV6QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFDLFFBQVE7WUFDbkUsT0FBTyxDQUFDLFFBQVEsS0FBSyxLQUFJLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVQLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBRXhCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLDhCQUE4QixDQUFDLENBQUM7UUFFM0YsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQztRQUM1QyxxQkFBVyxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ25FLHNCQUFZLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUNKLGdCQUFDO0FBQUQsQ0ExUEEsQUEwUEMsSUFBQTtBQUVELGtCQUFlLFNBQVMsQ0FBQzs7OztBQ3ZRekIsMkJBQTJCO0FBQzNCO0lBS0ksY0FBYztJQUNkLGVBQVksQ0FBUyxFQUFFLENBQVM7UUFDNUIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLENBQUM7SUFDTCxZQUFDO0FBQUQsQ0FWQSxBQVVDLElBQUE7QUFDRCxrQkFBZSxLQUFLLENBQUM7Ozs7QUNackIsOENBQXlDO0FBQ3pDLHdDQUFtQztBQUNuQyx3REFBbUQ7QUFDbkQsb0RBQStDO0FBQy9DLDhEQUF5RDtBQUV6RCx1RUFBa0U7QUFDbEUsaURBQTRDO0FBRTVDLHdFQUF3RTtBQUN4RTtJQUFBO0lBaUZBLENBQUM7SUEvRUU7Ozs7T0FJRztJQUNJLHNCQUFXLEdBQWxCLFVBQW1CLENBQVMsRUFBRSxDQUFTO1FBQ3BDLElBQUksVUFBVSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkIsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDOUMsSUFBSSxLQUFLLEdBQVUsSUFBSSxlQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ25DLElBQUksVUFBVSxHQUFHLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNwRSw4REFBOEQ7UUFFOUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUVuRSxLQUFLLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQy9CLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3RCLEtBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUM7Z0JBQzdCLElBQUksUUFBUSxHQUFHLElBQUksZUFBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFFdEMsSUFBSSxZQUFZLEdBQUcsQ0FBQyxFQUFFO29CQUNuQixJQUFJLFdBQVcsR0FBRyxJQUFJLGNBQUksQ0FBQyxRQUFRLEVBQUUsbUJBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDeEQsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUM7b0JBQ3BDLFlBQVksR0FBRyxZQUFZLEdBQUcsQ0FBQyxDQUFDO2lCQUNsQztxQkFBTTtvQkFDSixJQUFJLGNBQWMsR0FBRyxJQUFJLGNBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDeEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxjQUFjLENBQUM7aUJBQ3pDO2FBQ0g7U0FDQTtRQUNELEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNwQixLQUFLLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFN0MsT0FBTyxLQUFLLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxxQkFBVSxHQUFqQixVQUFrQixhQUEwQixFQUFFLEtBQVk7UUFHdkQsS0FBSyxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQzFDLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUUsR0FBRyxDQUFDO1lBQzNELE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztZQUNuQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNoQyxLQUFLLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUM7Z0JBQzVDLElBQUksTUFBTSxHQUFHLG1CQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUM3QjtZQUNELGFBQWEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDcEM7SUFDRCxDQUFDO0lBR08sb0JBQVMsR0FBaEIsVUFBaUIsS0FBWTtRQUMxQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzFCLElBQUksTUFBTSxHQUFHLElBQUksZ0JBQU0sQ0FBQyxTQUFTLEdBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBQyxDQUFDLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztZQUM3RSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM1QjtRQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDMUIsSUFBSSxNQUFNLEdBQUcsSUFBSSxnQkFBTSxDQUFDLGNBQWMsR0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFDLENBQUMsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO1lBQ2xGLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzVCO1FBQ0QsS0FBa0IsVUFBYSxFQUFiLEtBQUEsS0FBSyxDQUFDLE9BQU8sRUFBYixjQUFhLEVBQWIsSUFBYSxFQUFDO1lBQTVCLElBQUksTUFBTSxTQUFBO1lBQ1gscUJBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FFOUM7SUFDSixDQUFDO0lBRUssd0JBQWEsR0FBcEIsVUFBcUIsS0FBWTtRQUM5Qix3QkFBYyxDQUFDLG9CQUFvQixDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUUsb0NBQW9DLENBQUMsQ0FBQztRQUNqRyx3QkFBYyxDQUFDLG9CQUFvQixDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsb0NBQW9DLENBQUMsQ0FBQztJQUVoRyxDQUFDO0lBQ0osaUJBQUM7QUFBRCxDQWpGQSxBQWlGQyxJQUFBO0FBRUQsa0JBQWUsVUFBVSxDQUFDOzs7O0FDNUYxQixpREFBNEM7QUFDNUMsOENBQXlDO0FBR3pDLDREQUF1RDtBQUd2RCwyQkFBMkI7QUFDM0I7SUFRSSxjQUFjO0lBQ2QsZUFBWSxDQUFTLEVBQUUsQ0FBUztRQUM1QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssRUFBZSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7O09BR0c7SUFDSCx1QkFBTyxHQUFQLFVBQVEsU0FBaUI7UUFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVEOzs7T0FHRztJQUNILDBCQUFVLEdBQVYsVUFBVyxRQUFlO1FBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRDs7T0FFRztJQUNILGdDQUFnQixHQUFoQjtRQUNJLElBQUksZ0JBQWdCLEdBQVcsQ0FBQyxDQUFDO1FBQ2pDLEtBQUssSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUN4QyxLQUFLLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUM7Z0JBQzNDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUU7b0JBQ2hDLGdCQUFnQixHQUFHLGdCQUFnQixHQUFHLENBQUMsQ0FBQztpQkFDM0M7YUFDSjtTQUNKO1FBQ0csT0FBTyxnQkFBZ0IsQ0FBQztJQUM1QixDQUFDO0lBRUQ7O09BRUc7SUFDSCxrQ0FBa0IsR0FBbEI7UUFDSSxJQUFJLGVBQWUsR0FBZ0IsRUFBRSxDQUFDO1FBQ3RDLEtBQUssSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUN4QyxLQUFLLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUM7Z0JBQzNDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRTtvQkFDakMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDckMsZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztpQkFDbkM7YUFDSjtTQUNKO1FBQ0csT0FBTyxlQUFlLENBQUM7SUFDM0IsQ0FBQztJQUVELCtCQUFlLEdBQWY7UUFDSSxJQUFJLFlBQVksR0FBZ0IsRUFBRSxDQUFDO1FBQ25DLEtBQUssSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUN4QyxLQUFLLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUM7Z0JBQzNDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUU7b0JBQ2hDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3JDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7aUJBQ2hDO2FBQ0o7U0FDSjtRQUNHLE9BQU8sWUFBWSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxpQ0FBaUIsR0FBakI7UUFDSSxJQUFJLGNBQWMsR0FBZ0IsRUFBRSxDQUFDO1FBQ3JDLEtBQUssSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUN4QyxLQUFLLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUM7Z0JBQzNDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRTtvQkFDckUsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDckMsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztpQkFDbEM7YUFDSjtTQUNKO1FBQ0csT0FBTyxjQUFjLENBQUM7SUFDMUIsQ0FBQztJQUVEOzs7T0FHRztJQUNILGlDQUFpQixHQUFqQixVQUFrQixRQUFlO1FBRTdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEQsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFDO1lBQ3ZCLE9BQU8sU0FBUyxDQUFDO1NBQ3BCO2FBQUk7WUFDRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM3QztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNILDZCQUFhLEdBQWI7UUFDSSxJQUFJLE9BQU8sR0FBRyxxQkFBVyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVELElBQUksT0FBTyxHQUFHLHFCQUFXLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUM7UUFFNUQsSUFBSSxXQUFXLEdBQUcsSUFBSSxlQUFLLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRTlDLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNyRCxJQUFJLFdBQVcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNyRSxPQUFNLFdBQVcsS0FBSyxJQUFJLElBQUksV0FBVyxLQUFLLFNBQVMsSUFBSSxVQUFVLEtBQUssU0FBUyxJQUFJLFVBQVUsS0FBSyxJQUFJLEVBQUM7WUFFdkcsSUFBSSxTQUFPLEdBQUcscUJBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RCxJQUFJLFNBQU8sR0FBRyxxQkFBVyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTVELElBQUksYUFBVyxHQUFHLElBQUksZUFBSyxDQUFDLFNBQU8sRUFBRSxTQUFPLENBQUMsQ0FBQztZQUU5QyxVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQVcsQ0FBQyxDQUFDO1NBQ25EO1FBQ0YsT0FBTyxVQUFVLENBQUM7SUFDdEIsQ0FBQztJQUdELHVDQUF1QixHQUF2QjtRQUVJLElBQUksZUFBZSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBRWhELElBQUksTUFBTSxHQUFHLHFCQUFXLENBQUMsa0JBQWtCLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0RSxJQUFJLG9CQUFvQixHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVuRCxPQUFPLG9CQUFvQixDQUFDO0lBQ2hDLENBQUM7SUFHRCxzQ0FBc0IsR0FBdEI7UUFDSSxJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUU5QyxJQUFJLE1BQU0sR0FBRyxxQkFBVyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLENBQUM7UUFFckUsSUFBSSxtQkFBbUIsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFakQsT0FBTyxtQkFBbUIsQ0FBQztJQUMvQixDQUFDO0lBR0QsbUNBQW1CLEdBQW5CO1FBQ0ksSUFBSSxTQUFTLEdBQUcsS0FBSyxFQUFRLENBQUM7UUFDOUIsS0FBSyxJQUFJLEdBQUcsR0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ3RDLEtBQUksSUFBSSxHQUFHLEdBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBQztnQkFDekMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDckMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUM1QjtTQUNKO1FBQ0csT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUVELDJCQUFXLEdBQVg7UUFDSSxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUUzQyxLQUFJLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUM7WUFDdEMsS0FBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFDO2dCQUV0QyxJQUFJLE1BQU0sR0FBRyxxQkFBVyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRWhFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM5RCxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUMsQ0FBQzthQUU5QjtTQUNKO0lBQ0wsQ0FBQztJQUVELDRCQUFZLEdBQVosVUFBYSxFQUFXO1FBQ3BCLEtBQW9CLFVBQVUsRUFBVixLQUFBLElBQUksQ0FBQyxLQUFLLEVBQVYsY0FBVSxFQUFWLElBQVUsRUFBQztZQUEzQixJQUFJLFFBQVEsU0FBQTtZQUNaLEtBQXFCLFVBQVEsRUFBUixxQkFBUSxFQUFSLHNCQUFRLEVBQVIsSUFBUSxFQUFDO2dCQUExQixJQUFJLFNBQVMsaUJBQUE7Z0JBQ2IsSUFBRyxTQUFTLENBQUMsR0FBRyxLQUFLLEVBQUUsRUFBQztvQkFDcEIsT0FBTyxTQUFTLENBQUM7aUJBRXBCO2FBQ0o7U0FDSjtJQUNMLENBQUM7SUFDTCxZQUFDO0FBQUQsQ0E3TEEsQUE2TEMsSUFBQTtBQUVELGtCQUFlLEtBQUssQ0FBQzs7OztBQ25NckI7SUFBQTtJQTBJQSxDQUFDO0lBeElVLHlCQUFZLEdBQW5CLFVBQW9CLE9BQWtCLEVBQUUsT0FBa0I7UUFFdEQsSUFBSSxNQUFjLENBQUM7UUFDbkIsTUFBTSxDQUFDLGlCQUFpQixDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFFdEQsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUcvQixDQUFDO0lBRU0sNEJBQWUsR0FBdEIsVUFBdUIsV0FBd0IsRUFBRSxPQUFnQjtRQUU3RCxRQUFRLENBQUMsc0JBQXNCLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFFakcsUUFBUSxDQUFDLHNCQUFzQixDQUFDLDJCQUEyQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBRXpHLENBQUM7SUFFVSx5QkFBWSxHQUFuQixVQUFvQixXQUF3QjtRQUV4QyxXQUFXLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUU5QixJQUFJLGVBQWUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzVELGVBQWUsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUV4QyxJQUFJLE9BQU8sR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUM3QyxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9DLFVBQVUsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDO1FBQ3pCLFVBQVUsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLGlCQUFpQixDQUFDO1FBRS9DLElBQUksT0FBTyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQzdDLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0MsVUFBVSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7UUFFekIsSUFBSSxvQkFBb0IsR0FBRyxRQUFRLENBQUMsc0JBQXNCLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRixvQkFBb0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEUsb0JBQW9CLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRTdDLElBQUksb0JBQW9CLEdBQUcsUUFBUSxDQUFDLHNCQUFzQixDQUFDLDJCQUEyQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0Ysb0JBQW9CLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hFLG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUU3QyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUduQyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUM5RCxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7UUFLN0QsSUFBRyxXQUFXLENBQUMsVUFBVSxLQUFLLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUM7WUFDakQsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsR0FBRSxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUNqRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxHQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1NBQ3ZHO2FBQUk7WUFDRCxRQUFRLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxHQUFFLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ2pHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEdBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7U0FDdkc7SUFDTCxDQUFDO0lBRU0sNEJBQWUsR0FBdEIsVUFBdUIsV0FBd0I7UUFBL0MsaUJBTUM7UUFKRyxJQUFJLFlBQVksR0FBbUIsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlFLFlBQVksQ0FBQyxPQUFPLEdBQUcsVUFBQyxLQUFpQjtZQUNyQyxLQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUM7SUFDTixDQUFDO0lBRU0sMEJBQWEsR0FBcEIsVUFBcUIsS0FBaUIsRUFBRSxXQUF3QjtRQUU1RCxJQUFJLGVBQWUsR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDO1FBQzdDLElBQUksZUFBZSxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFDLGVBQWU7WUFDdEUsT0FBTyxDQUFDLGVBQWUsS0FBSyxlQUFlLENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVOLGVBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUUvQixDQUFDO0lBRU0sNkJBQWdCLEdBQXZCLFVBQXdCLFdBQXdCO1FBQWhELGlCQU1DO1FBSkcsSUFBSSxhQUFhLEdBQW1CLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRixhQUFhLENBQUMsT0FBTyxHQUFHLFVBQUMsS0FBaUI7WUFDdEMsS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVNLDJCQUFjLEdBQXJCLFVBQXNCLEtBQWlCLEVBQUUsV0FBd0I7UUFFM0QsV0FBVyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUV2QyxDQUFDO0lBRU0sMEJBQWEsR0FBcEIsVUFBcUIsS0FBaUI7UUFFbEMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBRXhCLENBQUM7SUFFUSxvQkFBTyxHQUFkLFVBQWUsTUFBaUI7UUFDNUIsOEVBQThFO1FBQzlFLHdCQUF3QjtRQUY1QixpQkFxQkM7UUFqQkcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUNqRSxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsaUJBQWlCLENBQUM7UUFFbEUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksR0FBRyxrQkFBa0IsQ0FBQztRQUVqRixJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUUvQixRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUU3RCxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDNUQsT0FBTyxDQUFDLE9BQU8sR0FBRyxVQUFDLEtBQWlCO1lBQ2hDLEtBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDO0lBSU4sQ0FBQztJQUVNLHNDQUF5QixHQUFoQyxVQUFpQyxNQUFpQjtRQUM5QyxJQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsc0JBQXNCLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzRSxJQUFJLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRS9FLGFBQWEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDbkQsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBRXhELGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNwRCxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBRXpELENBQUM7SUFHTCxtQkFBQztBQUFELENBMUlBLEFBMElDLElBQUE7QUFFRCxrQkFBZSxZQUFZLENBQUM7Ozs7QUMvSTVCLHVEQUFrRDtBQU9sRCxtQ0FBOEI7QUFDOUIsNkNBQXdDO0FBRXhDO0lBWUk7O09BRUc7SUFDSDtRQWJBLE9BQUUsR0FBVyxPQUFPLENBQUM7UUFHckIsWUFBTyxHQUFXLENBQUMsQ0FBQztRQVdoQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksS0FBSyxFQUFhLENBQUM7UUFDdEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGdCQUFNLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBQzVCLENBQUM7SUFFRCxvQ0FBYyxHQUFkO1FBQ0ksS0FBb0IsVUFBZ0IsRUFBaEIsS0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBaEIsY0FBZ0IsRUFBaEIsSUFBZ0IsRUFBQztZQUFqQyxJQUFJLFFBQVEsU0FBQTtZQUNaLEtBQXdCLFVBQVEsRUFBUixxQkFBUSxFQUFSLHNCQUFRLEVBQVIsSUFBUSxFQUFDO2dCQUE3QixJQUFJLFlBQVksaUJBQUE7Z0JBQ2hCLFlBQVksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO2FBQ25DO1NBQ0o7SUFDTCxDQUFDO0lBRUQsK0JBQVMsR0FBVDtRQUNJLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNsRCxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFaEMsSUFBSSxLQUFLLEdBQUcsb0JBQVUsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRTNDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRW5CLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUV0QixvQkFBVSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRS9ELG9CQUFVLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTVCLG9CQUFVLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWhDLHFCQUFxQjtRQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMscUJBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFJMUIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFFekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUM7UUFDbkYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUVELHVDQUFpQixHQUFqQjtRQUNJLEtBQUksSUFBSSxHQUFHLEdBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUM7WUFDMUMsS0FBSSxJQUFJLEdBQUcsR0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBQztnQkFDMUMsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2pELElBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLElBQUksV0FBVyxLQUFLLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFDO29CQUN6RyxXQUFXLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztpQkFDbkQ7YUFDSjtTQUNKO0lBQ0QsQ0FBQztJQUtMLGtCQUFDO0FBQUQsQ0F4RUEsQUF3RUMsSUFBQTtBQUNELGtCQUFlLFdBQVcsQ0FBQzs7OztBQzNFM0I7SUFJSTtRQUNJLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxFQUFVLENBQUM7UUFFaEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVMLGtDQUFpQixHQUFqQixVQUFrQixJQUFZO1FBQzFCLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekIsSUFBSSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUM7UUFDaEQsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRS9DLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUM1RCxJQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBQztZQUNyRCxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUN6QztRQUVELFVBQVUsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBRzNELFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsdUNBQXVDLEdBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxHQUFFLFFBQVEsQ0FBQyxDQUFDO0lBR3ZJLENBQUM7SUFJRCxhQUFDO0FBQUQsQ0FoQ0EsQUFnQ0MsSUFBQTtBQUNELGtCQUFlLE1BQU0sQ0FBQzs7OztBQ3ZDdEI7SUFBQTtJQXFJQSxDQUFDO0lBbklVLG1CQUFPLEdBQWQsVUFBZSxXQUF3QjtRQUVuQyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRWxDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV4QyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxHQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXRILElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4QyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxHQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXRILElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFdEQsQ0FBQztJQUVNLDJCQUFlLEdBQXRCLFVBQXVCLFdBQXdCO1FBRW5DLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFFbkYsUUFBUSxDQUFDLHNCQUFzQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUUvRixDQUFDO0lBRU0sbUJBQU8sR0FBZCxVQUFlLE1BQWlCLEVBQUUsWUFBb0I7UUFFbEQsSUFBSSxXQUFXLEdBQW1CLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEdBQUUsTUFBTSxDQUFDLElBQUksR0FBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoRyxJQUFJLFVBQVUsR0FBbUIsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsR0FBRSxNQUFNLENBQUMsSUFBSSxHQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hHLFVBQVUsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU3QyxJQUFJLFlBQVksR0FBbUIsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsR0FBRSxNQUFNLENBQUMsSUFBSSxHQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWxHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFFNUMsSUFBSSxhQUFhLEdBQW1CLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEdBQUUsTUFBTSxDQUFDLElBQUksR0FBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRyxJQUFJLFlBQVksR0FBbUIsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsR0FBRSxNQUFNLENBQUMsSUFBSSxHQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkcsWUFBWSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRSxHQUFHLEdBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUMsR0FBRyxDQUFDO1FBRTVFLElBQUksWUFBWSxHQUFtQixRQUFRLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxHQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEcsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUM1QixJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDO1FBQ3ZCLFlBQVksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFcEMsSUFBSSxXQUFXLEdBQW1CLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEdBQUUsTUFBTSxDQUFDLElBQUksR0FBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRyxXQUFXLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFFdEMsSUFBSSxjQUFjLEdBQW1CLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEdBQUUsTUFBTSxDQUFDLElBQUksR0FBRSxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTFHLFFBQVEsWUFBWSxFQUFFO1lBQ2xCLEtBQUssQ0FBQztnQkFDRixZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7Z0JBQzlCLFVBQVUsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztnQkFDcEMsWUFBWSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO2dCQUN0QyxZQUFZLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7Z0JBQ3RDLFdBQVcsQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztnQkFDdEMsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsaUJBQWlCLENBQUM7Z0JBQzlDLE1BQU07WUFFVixLQUFLLENBQUM7Z0JBQ0YsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFBO2dCQUMvQixVQUFVLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7Z0JBQ3JDLFlBQVksQ0FBQyxLQUFLLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztnQkFDdkMsWUFBWSxDQUFDLEtBQUssQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO2dCQUN2QyxXQUFXLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7Z0JBQ3JDLFdBQVcsQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztnQkFDaEQsYUFBYSxDQUFDLEtBQUssQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO2dCQUNsRCxXQUFXLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7Z0JBQ2hELGNBQWMsQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztnQkFDbkQsTUFBTTtTQUNiO0lBRUwsQ0FBQztJQUVNLDBCQUFjLEdBQXJCLFVBQXNCLE1BQWlCLEVBQUUsWUFBb0IsRUFBRSxNQUFjO1FBRXpFLElBQUksV0FBVyxHQUFtQixRQUFRLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxHQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakcsSUFBSSxTQUFTLEdBQW1CLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM1RixTQUFTLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEdBQUMsTUFBTSxDQUFDLENBQUM7UUFHM0MsV0FBVyxDQUFDLFNBQVMsR0FBQyxFQUFFLENBQUM7UUFDekIsV0FBVyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTlDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFHaEQsQ0FBQztJQUVNLDRCQUFnQixHQUF2QixVQUF3QixNQUFpQixFQUFFLFlBQW9CO1FBRTNELElBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUU5RSxJQUFHLE1BQU0sQ0FBQyxjQUFjLEtBQUssU0FBUyxFQUFDO1lBQ3ZDLElBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEVBQUM7Z0JBQzNELE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2FBQzdEO2lCQUFLLElBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLEVBQUM7Z0JBQ25FLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2FBQy9EO2lCQUFLLElBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEVBQUM7Z0JBQ2hFLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2FBQzVEO1NBQ0o7UUFFRyxJQUFHLE1BQU0sQ0FBQyxJQUFJLEdBQUcsRUFBRSxFQUFDO1lBQ2hCLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FDaEQ7YUFBSyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEdBQUcsRUFBRSxJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSxFQUFFO1lBQzdDLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7U0FDbEQ7YUFBTTtZQUNILFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDL0M7SUFDTCxDQUFDO0lBRU0sNEJBQWdCLEdBQXZCLFVBQXdCLE1BQWlCLEVBQUUsWUFBb0I7UUFDM0QsSUFBSSxhQUFhLEdBQUcsUUFBUSxDQUFDLHNCQUFzQixDQUFDLGNBQWMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRWxGLGFBQWEsQ0FBQyxTQUFTLEdBQUMsRUFBRSxDQUFDO1FBQzNCLGFBQWEsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUUsR0FBRyxHQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFDLEdBQUcsQ0FBQztJQUVqRixDQUFDO0lBRU0sZ0NBQW9CLEdBQTNCLFVBQTRCLE1BQWlCO1FBQ3pDLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMvRCxJQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBQztZQUN6RCxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUM1QztRQUNELElBQUksYUFBYSxHQUFtQixRQUFRLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxHQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkcsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7SUFJOUMsQ0FBQztJQUVMLGtCQUFDO0FBQUQsQ0FySUEsQUFxSUMsSUFBQTtBQUNELGtCQUFlLFdBQVcsQ0FBQzs7OztBQzFJM0IsMkJBQTJCO0FBQzNCO0lBS0ksY0FBYztJQUNkLGNBQVksQ0FBUyxFQUFFLENBQVM7UUFDNUIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNmLENBQUM7SUFDTCxXQUFDO0FBQUQsQ0FWQSxBQVVDLElBQUE7QUFDRCxrQkFBZSxJQUFJLENBQUM7Ozs7QUNQcEI7SUFBQTtJQXdDQSxDQUFDO0lBckNVLDRCQUFnQixHQUF2QixVQUF3QixLQUFZLEVBQUUsTUFBYztRQUNoRCxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUNoRCxJQUFJLFNBQVMsR0FBcUIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRSxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUMvQixTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7UUFDbEMsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2xDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztRQUN0QyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUM7UUFDNUIsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQzNCLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUM5QixPQUFPLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQy9CLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4RSxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQzlFLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDMUUsTUFBTSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7SUFFekIsQ0FBQztJQUVNLHVCQUFXLEdBQWxCLFVBQW1CLFVBQWdCLEVBQUUsTUFBYyxFQUFFLEtBQVk7UUFFN0QsSUFBSSxTQUFTLEdBQXFCLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEUsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoQyxTQUFTLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDL0IsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO1FBQ2xDLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUNsQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7UUFDdEMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO1FBQzVCLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUMzQixTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDOUIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMvQixRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEUsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUMxRSxNQUFNLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQztJQUN6QixDQUFDO0lBQ0wsa0JBQUM7QUFBRCxDQXhDQSxBQXdDQyxJQUFBO0FBRUQsa0JBQWUsV0FBVyxDQUFDOzs7O0FDN0MzQiwyQkFBMkI7QUFDM0I7SUFRRyxjQUFjO0lBQ2QsZ0JBQVksSUFBWSxFQUFFLE1BQWMsRUFBRSxPQUFlO1FBQ3RELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQzFCLENBQUM7SUFHSixhQUFDO0FBQUQsQ0FoQkEsQUFnQkMsSUFBQTtBQUVELGtCQUFlLE1BQU0sQ0FBQzs7OztBQ3BCdEI7SUFBQTtJQU1BLENBQUM7SUFMVSw4QkFBa0IsR0FBekIsVUFBMEIsU0FBaUI7UUFFdkMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBQyxTQUFTLENBQUMsQ0FBQztJQUUvQyxDQUFDO0lBQ0wsa0JBQUM7QUFBRCxDQU5BLEFBTUMsSUFBQTtBQUVELGtCQUFlLFdBQVcsQ0FBQzs7OztBQ0wzQixzREFBaUQ7QUFFakQsSUFBSSxXQUFXLEdBQUcsSUFBSSxxQkFBVyxFQUFFLENBQUM7QUFDcEMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IENhc2UgZnJvbSBcIi4uLy4uL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4uLy4uL2ZpZWxkL21vZGVsL2ZpZWxkXCI7XHJcblxyXG5hYnN0cmFjdCBjbGFzcyBDYXNlTG9naWMge1xyXG5cclxuICAgIHN0YXRpYyBCTE9DS0VEOiBzdHJpbmcgPSBcIkJMT0NLRURcIjtcclxuICAgIHN0YXRpYyBOT1JNQUw6IHN0cmluZyA9IFwiTk9STUFMXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBwYXJ0eUZpZWxkIFxyXG4gICAgICogQHBhcmFtIGxpc3RPZkNhc2VzVGVtcCBcclxuICAgICAqIEBwYXJhbSBlbGVtZW50VG9GaWxsIFxyXG4gICAgICogQHBhcmFtIG5ick9mUmVtYWluaW5nQ2FzZXMgXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBwYWludENhc2UoY2FzZVRvUGFpbnQ6IENhc2UpOiBIVE1MRGl2RWxlbWVudCB7XHJcbiAgICAgICAgbGV0IGRpdkVsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGl2RWx0LnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGNhc2VUb1BhaW50LmlzQmxvY2tlZCkge1xyXG4gICAgICAgICAgICBjYXNlIGZhbHNlOlxyXG4gICAgICAgICAgICAgICAgZGl2RWx0LmNsYXNzTGlzdC5hZGQoXCJjYXNlXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIHRydWU6XHJcbiAgICAgICAgICAgICAgICBkaXZFbHQuY2xhc3NMaXN0LmFkZChcImNhc2VcIik7XHJcbiAgICAgICAgICAgICAgICBkaXZFbHQuY2xhc3NMaXN0LmFkZChcImJsb2NrZWRcIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgZGl2RWx0LmlkID0gU3RyaW5nKGNhc2VUb1BhaW50LnBvc2l0aW9uU3RyaW5nKTtcclxuXHJcbiAgICAgICAgY2FzZVRvUGFpbnQuc2V0RWwoZGl2RWx0KTtcclxuICAgICAgICByZXR1cm4gZGl2RWx0O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDYXNlTG9naWM7IiwiaW1wb3J0IENhc2VMb2dpYyBmcm9tIFwiLi4vLi4vY2FzZS9sb2dpYy9jYXNlTG9naWNcIjtcclxuaW1wb3J0IENvb3JkIGZyb20gXCIuLi8uLi9jb29yZC9tb2RlbC9jb29yZFwiO1xyXG5pbXBvcnQgV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbW9kZWwvd2VhcG9uXCI7XHJcbmltcG9ydCBMb2dpY1dlYXBvbiBmcm9tIFwiLi4vLi4vd2VhcG9uL2xvZ2ljL2xvZ2ljV2VhcG9uXCI7XHJcbmltcG9ydCBGaWVsZCBmcm9tIFwiLi4vLi4vZmllbGQvbW9kZWwvZmllbGRcIjtcclxuaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi4vLi4vY2hhcmFjdGVyL21vZGVsL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgR2FtZU1hbmFnZXIgZnJvbSBcIi4uLy4uL2dhbWVNYW5hZ2VyXCI7XHJcblxyXG5jbGFzcyBDYXNlIHtcclxuICAgIC8vZmllbGQgXHJcbiAgICBpbWdVcmw6IHN0cmluZztcclxuICAgIGlzQmxvY2tlZDogYm9vbGVhbjtcclxuICAgIGlzQXZhaWxhYmxlOiBib29sZWFuO1xyXG4gICAgcG9zaXRpb246IENvb3JkO1xyXG4gICAgcG9zaXRpb25TdHJpbmc6IHN0cmluZztcclxuICAgIHR5cGU6IHN0cmluZztcclxuICAgIHdlYXBvbjogV2VhcG9uO1xyXG4gICAgZ2FtZU1hbmFnZXI6IEdhbWVNYW5hZ2VyO1xyXG4gICAgJGVsOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICAvL2NvbnN0cnVjdG9yIFxyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb246IENvb3JkLCB0eXBlOiBzdHJpbmcgPSBDYXNlTG9naWMuTk9STUFMLCBpc0F2YWlsYWJsZTogYm9vbGVhbiA9IHRydWUpIHtcclxuXHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgQ2FzZUxvZ2ljLk5PUk1BTDpcclxuICAgICAgICAgICAgICAgIHRoaXMuaW1nVXJsID0gXCIvYXNzZXRzL2ltZy9ub3JtYWwtZmllbGQvdGlsZS0yRC5wbmdcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNCbG9ja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgQ2FzZUxvZ2ljLkJMT0NLRUQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmltZ1VybCA9IFwiL2Fzc2V0cy9pbWcvYmxvY2tlZC1maWVsZC90aWxlLTJELnBuZ1wiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc0Jsb2NrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaXNBdmFpbGFibGUgPSBpc0F2YWlsYWJsZTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvblN0cmluZyA9IFN0cmluZyhwb3NpdGlvbi54KSArIFN0cmluZyhwb3NpdGlvbi55KTtcclxuICAgICAgICB0aGlzLndlYXBvbiA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY2FzZXNBZGphY2VudChjYXNlVG9DaGVjazogQ2FzZSk6IEJvb2xlYW57XHJcbiAgICAgICAgbGV0IGlzU2FtZVggPSB0aGlzLnBvc2l0aW9uLnggPT09IGNhc2VUb0NoZWNrLnBvc2l0aW9uLng7XHJcbiAgICAgICAgbGV0IGFic29sdXRlRGVsdGFZID0gTWF0aC5hYnModGhpcy5wb3NpdGlvbi55LWNhc2VUb0NoZWNrLnBvc2l0aW9uLnkpO1xyXG4gICAgICAgIGxldCBpc1NhbWVZID0gdGhpcy5wb3NpdGlvbi55ID09PSBjYXNlVG9DaGVjay5wb3NpdGlvbi55O1xyXG4gICAgICAgIGxldCBhYnNvbHV0ZURlbHRhWCA9IE1hdGguYWJzKHRoaXMucG9zaXRpb24ueC1jYXNlVG9DaGVjay5wb3NpdGlvbi54KTtcclxuXHJcbiAgICAgICAgaWYoKGlzU2FtZVggJiYgYWJzb2x1dGVEZWx0YVkgPD0gMSkgfHwgKGlzU2FtZVkgJiYgYWJzb2x1dGVEZWx0YVggPD0gMSkpe1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoYXNXZWFwb24oKXtcclxuICAgICAgICBpZih0aGlzLndlYXBvbiAhPT0gbnVsbCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVtb3ZlV2VhcG9uKCl7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy53ZWFwb24uJGVsLnJlbW92ZSgpO1xyXG4gICAgICAgIHRoaXMud2VhcG9uID0gbnVsbDtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYWRkV2VhcG9uKGZpZWxkOiBGaWVsZCwgd2VhcG9uOiBXZWFwb24pe1xyXG4gICAgICAgIHRoaXMud2VhcG9uID0gd2VhcG9uO1xyXG4gICAgICAgIExvZ2ljV2VhcG9uLnBhaW50V2VhcG9uKHRoaXMsIHdlYXBvbiwgZmllbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEVsKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICAgIHRoaXMuJGVsID0gZWxlbWVudDtcclxuXHJcbiAgICAgICAgdGhpcy4kZWwub25jbGljayA9IChldmVudDogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2xpY2soZXZlbnQpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLiRlbDtcclxuICAgIH1cclxuXHJcbiAgICBvbkNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZHtcclxuIFxyXG4gICAgICAgICAgICBsZXQgY2FzZXNFbGVtZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Nhc2UnKTtcclxuICAgICAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5nYW1lTWFuYWdlci5maWVsZDtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2FzZXNFbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhc2VzRWxlbWVudCA9ICg8SFRNTEVsZW1lbnQ+Y2FzZXNFbGVtZW50c1tpXSk7XHJcbiAgICAgICAgICAgICAgICBjYXNlc0VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY2FzZS1yZWFjaGFibGUnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGNhc2VUb0dvID0gZmllbGQuY2FzZXNbdGhpcy5wb3NpdGlvbi54XVt0aGlzLnBvc2l0aW9uLnldO1xyXG5cclxuICAgICAgICAgICAgLy8gRG8gbm90aGluZyBpZiBwbGF5ZXIgc2VsZWN0IGEgQmxvY2sgQ2FzZVxyXG4gICAgICAgICAgICBpZiAoY2FzZVRvR28uaXNCbG9ja2VkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWVNYW5hZ2VyLnNob3dSZWFjaGFibGVDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy93ZSBnZXQgdGhlIGVsZW1lbnQgdGFyZ2V0XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmdhbWVNYW5hZ2VyLnBsYXllclRvdXIubW92ZVRvKHRoaXMuZ2FtZU1hbmFnZXIuZmllbGQsIGNhc2VUb0dvKTtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmdhbWVNYW5hZ2VyLnNob3dSZWFjaGFibGVDYXNlKCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2FzZTsiLCJcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuLi8uLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gXCIuLi8uLi9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IENvb3JkIGZyb20gXCIuLi8uLi9jb29yZC9tb2RlbC9jb29yZFwiO1xyXG5pbXBvcnQgR2FtZU1hbmFnZXIgZnJvbSBcIi4uLy4uL2dhbWVNYW5hZ2VyXCI7XHJcblxyXG5hYnN0cmFjdCBjbGFzcyBMb2dpY0NoYXJhY3RlciB7XHJcblxyXG4gICAgc3RhdGljIHBhaW50U3RhcnRDaGFyYWN0ZXJzKGZpZWxkOiBGaWVsZCwgbmFtZUNoYXJhY3Rlcjogc3RyaW5nLCBpY29uVXJsOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBsZXQgcGxheWVyID0gbmV3IENoYXJhY3RlcihuYW1lQ2hhcmFjdGVyLCBpY29uVXJsLCBmaWVsZC5nZXRBdmFpbGFibGVSYW5kb21DYXNlKCkpO1xyXG5cclxuICAgICAgICBsZXQgbmV4dFBsYXllciA9IGZpZWxkLmNoYXJhY3RlcnMuZmlsdGVyKChuZXh0UGxheWVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAobmV4dFBsYXllciAhPT0gcGxheWVyKTtcclxuICAgICAgICAgIH0pWzBdO1xyXG5cclxuXHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgZmllbGQuY2hhcmFjdGVyc1swXSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlKGZpZWxkLmNoYXJhY3RlcnNbMF0uY2FzZS5jYXNlc0FkamFjZW50KHBsYXllci5jYXNlKSB8fCBwbGF5ZXIuaXNDbG9zZWRDYXNlc0Jsb2NrZWQoKSl7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIgPSBuZXcgQ2hhcmFjdGVyKG5hbWVDaGFyYWN0ZXIsIGljb25VcmwsIGZpZWxkLmdldEF2YWlsYWJsZVJhbmRvbUNhc2UoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIGZpZWxkLmNhc2VzW3BsYXllci5jYXNlLnBvc2l0aW9uLnhdW3BsYXllci5jYXNlLnBvc2l0aW9uLnldLmlzQXZhaWxhYmxlID0gZmFsc2U7XHJcbiAgICAgICAgbGV0IGltZ0NoYXI6IEhUTUxJbWFnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGxldCBzcGFuRWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcblxyXG4gICAgICAgIHNwYW5FbHQuY2xhc3NMaXN0LmFkZChcImNoYXJcIik7XHJcbiAgICAgICAgaW1nQ2hhci5zcmMgPSBwbGF5ZXIuaWNvblVybDtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLm1heFdpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgICAgaW1nQ2hhci5zdHlsZS5tYXhIZWlnaHQgPSAoTWF0aC5yb3VuZCgxMDAgLyBmaWVsZC5zaXplLngpKSsgXCIlXCI7XHJcbiAgICAgICAgaW1nQ2hhci5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLnpJbmRleCA9IFwiNTBcIjtcclxuICAgICAgICBsZXQgcGxheWVyRGl2RWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWdodFwiKTtcclxuICAgICAgICBwbGF5ZXJEaXZFbHQuYXBwZW5kQ2hpbGQoaW1nQ2hhcik7XHJcbiAgICAgICAgcGxheWVyLiRlbCA9IGltZ0NoYXI7XHJcbiAgICAgICAgaW1nQ2hhci5jbGFzc0xpc3QuYWRkKFwicGxheWVyXCIpO1xyXG4gICAgICAgIHRoaXMuc2V0QWJzb2x1dGVQb3NpdGlvbihwbGF5ZXIpO1xyXG5cclxuICAgICAgICBwbGF5ZXIuJGVsLnN0eWxlLmxlZnQgPSBwbGF5ZXIuYWJzb2x1dGVDb29yZC55ICsgJ3B4JztcclxuICAgICAgICBwbGF5ZXIuJGVsLnN0eWxlLnRvcCA9IHBsYXllci5hYnNvbHV0ZUNvb3JkLnggKyAncHgnO1xyXG5cclxuICAgICAgICBmaWVsZC5jaGFyYWN0ZXJzLnB1c2gocGxheWVyKTtcclxuICAgICAgICBwbGF5ZXIuY2FzZS5nYW1lTWFuYWdlci5wbGF5ZXJzLnB1c2gocGxheWVyKTtcclxuXHJcbiAgICAgICAgaWYocGxheWVyLmNhc2UuZ2FtZU1hbmFnZXIucGxheWVycy5sZW5ndGggPT09IDIpe1xyXG4gICAgICAgICAgICBpZihwbGF5ZXIuY2FzZS5wb3NpdGlvbi55IDwgbmV4dFBsYXllci5jYXNlLnBvc2l0aW9uLnkpe1xyXG4gICAgICAgICAgICAgICAgTG9naWNDaGFyYWN0ZXIuZmFjZU9wcG9uZW50KHBsYXllcik7XHJcbiAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBMb2dpY0NoYXJhY3Rlci5mYWNlT3Bwb25lbnQobmV4dFBsYXllcik7ICBcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSBcclxuXHJcbiAgICBzdGF0aWMgcGFpbnRDaGFyYWN0ZXJzKGZpZWxkOiBGaWVsZCwgcGxheWVyOiBDaGFyYWN0ZXIsIGNhc2VQbGF5ZXI6IENhc2UpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IGltZ0NoYXI6IEhUTUxJbWFnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGxldCBzcGFuRWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcblxyXG4gICAgICAgIHNwYW5FbHQuY2xhc3NMaXN0LmFkZChcImNoYXJcIik7XHJcbiAgICAgICAgaW1nQ2hhci5zcmMgPSBwbGF5ZXIuaWNvblVybDtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLm1heFdpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgICAgaW1nQ2hhci5zdHlsZS5tYXhIZWlnaHQgPSBcIjc1JVwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICAgICAgaW1nQ2hhci5zdHlsZS50b3AgPSBcIjBcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLmxlZnQgPSBcIjBcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLnpJbmRleCA9IFwiNTBcIjtcclxuICAgICAgICBpbWdDaGFyLmNsYXNzTGlzdC5hZGQoXCJwbGF5ZXJcIik7XHJcbiAgICAgICAgc3BhbkVsdC5hcHBlbmRDaGlsZChpbWdDaGFyKTtcclxuICAgICAgICBsZXQgcGxheWVyRGl2RWx0ID0gcGxheWVyLmNhc2UuJGVsO1xyXG4gICAgICAgIHBsYXllckRpdkVsdC5hcHBlbmRDaGlsZChzcGFuRWx0KTtcclxuICAgICAgICBwbGF5ZXIuJGVsID0gc3BhbkVsdDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY2hhcmFjdGVyQW5pbWF0aW9uKHBsYXllcjogQ2hhcmFjdGVyLCBuZXdDb29yZDogQ29vcmQpe1xyXG5cclxuICAgICAgICBwbGF5ZXIuJGVsLnN0eWxlLmxlZnQgPSBuZXdDb29yZC55ICsgJ3B4JztcclxuICAgICAgICBwbGF5ZXIuJGVsLnN0eWxlLnRvcCA9IG5ld0Nvb3JkLnggKyAncHgnO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZmFjZU9wcG9uZW50KHBsYXllcjogQ2hhcmFjdGVyKXtcclxuICAgICAgICBjb25zb2xlLmxvZyhwbGF5ZXIpO1xyXG4gICAgICAgIHBsYXllci4kZWwuc3R5bGUudHJhbnNmb3JtID0gXCJyb3RhdGVZKDE4MGRlZylcIjtcclxuICAgICAgICBpZihwbGF5ZXIuZGlyZWN0aW9uID09PSAnbGVmdCcpe1xyXG4gICAgICAgICAgICBwbGF5ZXIuZGlyZWN0aW9uID0gJ3JpZ2h0JztcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcGxheWVyLmRpcmVjdGlvbiA9ICdsZWZ0JzsgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjaGVja1BsYXllckRpcmVjdGlvbihnYW1lTWFuYWdlcjogR2FtZU1hbmFnZXIpe1xyXG4gICAgICAgIGxldCBwbGF5ZXJMZWZ0ID0gZ2FtZU1hbmFnZXIucGxheWVycy5maWx0ZXIoKHBsYXllckxlZnQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIChwbGF5ZXJMZWZ0LmRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jyk7XHJcbiAgICAgICAgICB9KVswXTtcclxuXHJcbiAgICAgICAgICBsZXQgcGxheWVyUmlnaHQgPSBnYW1lTWFuYWdlci5wbGF5ZXJzLmZpbHRlcigocGxheWVyUmlnaHQpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIChwbGF5ZXJSaWdodC5kaXJlY3Rpb24gPT09ICdsZWZ0Jyk7XHJcbiAgICAgICAgICB9KVswXTtcclxuXHJcbiAgICAgICAgICBpZihwbGF5ZXJMZWZ0LmNhc2UucG9zaXRpb24ueSA+IHBsYXllclJpZ2h0LmNhc2UucG9zaXRpb24ueSl7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cocGxheWVyTGVmdCk7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2cocGxheWVyUmlnaHQpO1xyXG4gICAgICAgICAgICB0aGlzLmZhY2VPcHBvbmVudChwbGF5ZXJMZWZ0KTtcclxuICAgICAgICAgICAgdGhpcy5mYWNlT3Bwb25lbnQocGxheWVyUmlnaHQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzZXRBYnNvbHV0ZVBvc2l0aW9uKHBsYXllcjogQ2hhcmFjdGVyKXtcclxuICAgICAgICBsZXQgYWJzb2x1dGVYID0gcGxheWVyLmNhc2UucG9zaXRpb24ueCpwbGF5ZXIuY2FzZS4kZWwub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICAgIGxldCBhYnNvbHV0ZVkgPSBwbGF5ZXIuY2FzZS5wb3NpdGlvbi55KnBsYXllci5jYXNlLiRlbC5vZmZzZXRXaWR0aDtcclxuICAgICAgICBsZXQgYWJzb2x1dGVQb3NpdGlvblBsYXllciA9IG5ldyBDb29yZChhYnNvbHV0ZVgsIGFic29sdXRlWSk7XHJcbiAgICAgICAgcGxheWVyLmFic29sdXRlQ29vcmQgPSBhYnNvbHV0ZVBvc2l0aW9uUGxheWVyOyBcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IExvZ2ljQ2hhcmFjdGVyOyIsImltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IFdlYXBvbiBmcm9tIFwiLi4vLi4vd2VhcG9uL21vZGVsL3dlYXBvblwiO1xyXG5pbXBvcnQgTG9naWNXZWFwb24gZnJvbSBcIi4uLy4uL3dlYXBvbi9sb2dpYy9sb2dpY1dlYXBvblwiO1xyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4uLy4uL2ZpZWxkL21vZGVsL2ZpZWxkXCI7XHJcbmltcG9ydCBMb2dpY0NoYXJhY3RlciBmcm9tIFwiLi4vbG9naWMvbG9naWNDaGFyYWN0ZXJcIjtcclxuaW1wb3J0IENvb3JkIGZyb20gXCIuLi8uLi9jb29yZC9tb2RlbC9jb29yZFwiO1xyXG5pbXBvcnQgTWVudU1hbmFnZXIgZnJvbSBcIi4uLy4uL21lbnVNYW5hZ2VyXCI7XHJcbmltcG9ydCBMb2dnZXIgZnJvbSBcIi4uLy4uL2xvZ2dlclwiO1xyXG5pbXBvcnQgRmlnaHRNYW5hZ2VyIGZyb20gXCIuLi8uLi9maWdodE1hbmFnZXJcIjtcclxuXHJcbi8vVGhpcyBjbGFzcyBmb3IgdGhlIGZpZWxkc1xyXG5jbGFzcyBDaGFyYWN0ZXIge1xyXG4gICAvL2ZpZWxkIFxyXG4gICBuYW1lOiBzdHJpbmc7XHJcbiAgIGljb25Vcmw6IHN0cmluZztcclxuICAgbGlmZTogbnVtYmVyO1xyXG4gICBsZXZlbDogbnVtYmVyO1xyXG4gICBjYXNlOiBDYXNlO1xyXG4gICBjbG9zZWRDYXNlczogQXJyYXk8Q2FzZT47XHJcbiAgIHdlYXBvbjogV2VhcG9uO1xyXG4gICBhYnNvbHV0ZUNvb3JkOiBDb29yZDtcclxuICAgJGVsOiBIVE1MRWxlbWVudDtcclxuICAgJGF2YXRhckVsdDogSFRNTEVsZW1lbnQ7IFxyXG4gICAkYXZhdGFyTGlmZUVsdDogRWxlbWVudDtcclxuICAgJGF2YXRhcldlYXBvbkVsdDogSFRNTEVsZW1lbnQ7XHJcbiAgIGRlZmVuc2VNb2RlOiBib29sZWFuO1xyXG4gICBkaXJlY3Rpb246IHN0cmluZztcclxuXHJcbiAgIC8vY29uc3RydWN0b3IgXHJcbiAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgaWNvblVybDogc3RyaW5nLCBzdGFydENhc2U6IENhc2UpIHtcclxuICAgICAgdGhpcy5saWZlID0gMTAwO1xyXG4gICAgICB0aGlzLmxldmVsID0gNTtcclxuICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgdGhpcy5pY29uVXJsID0gaWNvblVybDtcclxuICAgICAgdGhpcy5jYXNlID0gc3RhcnRDYXNlO1xyXG4gICAgICB0aGlzLmNsb3NlZENhc2VzID0gdGhpcy5nZXRDbG9zZWRDYXNlcygpO1xyXG4gICAgICB0aGlzLndlYXBvbiA9IG5ldyBXZWFwb24oXCJSZWd1bGFyXCIsIDEwLCBcIi9hc3NldHMvaW1nL3dlYXBvbi93ZWFwb24yLnBuZ1wiKTtcclxuICAgICAgdGhpcy5kZWZlbnNlTW9kZSA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmRpcmVjdGlvbiA9IFwibGVmdFwiO1xyXG5cclxuICAgfVxyXG5cclxuICAgdGFrZVdlYXBvbihjYXNlV2VhcG9uOiBDYXNlLCBmaWVsZDogRmllbGQpe1xyXG4gICAgICBsZXQgd2VhcG9uVG9Ecm9wID0gdGhpcy53ZWFwb247XHJcbiAgICAgIHRoaXMud2VhcG9uID0gY2FzZVdlYXBvbi53ZWFwb247XHJcbiAgICAgIGNhc2VXZWFwb24ucmVtb3ZlV2VhcG9uKCk7XHJcbiAgICAgIGZpZWxkLmNhc2VzW2Nhc2VXZWFwb24ucG9zaXRpb24ueF1bY2FzZVdlYXBvbi5wb3NpdGlvbi55XS53ZWFwb24gPSB3ZWFwb25Ub0Ryb3A7XHJcbiAgICAgIFxyXG4gICAgICAvL0xvZ2ljV2VhcG9uLnBhaW50V2VhcG9uKGNhc2VXZWFwb24sIHdlYXBvblRvRHJvcCwgZmllbGQpO1xyXG4gICB9XHJcblxyXG4gICBpc1dheUJsb2NrZWQoY2FzZVRvUmVhY2g6IENhc2UsIGZpZWxkOiBGaWVsZCk6IEJvb2xlYW57XHJcbiAgICAgIGxldCBibG9ja2VkID0gZmFsc2U7XHJcbiAgICAgIGlmKHRoaXMuY2FzZS5wb3NpdGlvbi54ID09PSBjYXNlVG9SZWFjaC5wb3NpdGlvbi54KXtcclxuICAgICAgICAgbGV0IHggPSB0aGlzLmNhc2UucG9zaXRpb24ueDtcclxuICAgICAgICAgbGV0IHlJbml0ID0gMDtcclxuICAgICAgICAgaWYodGhpcy5jYXNlLnBvc2l0aW9uLnkgPCBjYXNlVG9SZWFjaC5wb3NpdGlvbi55KXtcclxuICAgICAgICAgeUluaXQgPSB0aGlzLmNhc2UucG9zaXRpb24ueSsxO1xyXG4gICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgeUluaXQgPSBjYXNlVG9SZWFjaC5wb3NpdGlvbi55KzE7IFxyXG4gICAgICAgICB9XHJcbiAgICAgICAgICBsZXQgZGVsdGFZID0gTWF0aC5hYnModGhpcy5jYXNlLnBvc2l0aW9uLnkgLSBjYXNlVG9SZWFjaC5wb3NpdGlvbi55KTtcclxuICAgICAgICAgIGZvcihsZXQgcm93ID0gMDsgcm93IDwgZGVsdGFZOyByb3crKyl7XHJcbiAgICAgICAgICAgICBpZihmaWVsZC5jYXNlc1t4XVt5SW5pdCtyb3ddLmlzQmxvY2tlZCA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICBibG9ja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgICBsZXQgeEluaXQgPSAwO1xyXG4gICAgICAgICBsZXQgeSA9IHRoaXMuY2FzZS5wb3NpdGlvbi55O1xyXG4gICAgICAgICBpZih0aGlzLmNhc2UucG9zaXRpb24ueCA8IGNhc2VUb1JlYWNoLnBvc2l0aW9uLngpe1xyXG4gICAgICAgICAgICB4SW5pdCA9IHRoaXMuY2FzZS5wb3NpdGlvbi54KzE7XHJcbiAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB4SW5pdCA9IGNhc2VUb1JlYWNoLnBvc2l0aW9uLngrMTsgXHJcbiAgICAgICAgIH1cclxuICAgICAgICAgIGxldCBkZWx0YVggPSBNYXRoLmFicyh0aGlzLmNhc2UucG9zaXRpb24ueCAtIGNhc2VUb1JlYWNoLnBvc2l0aW9uLngpO1xyXG4gICAgICAgICAgZm9yKGxldCBjb2wgPSAwOyBjb2wgPCBkZWx0YVg7IGNvbCsrKXtcclxuICAgICAgICAgICAgIGlmKGZpZWxkLmNhc2VzW3hJbml0K2NvbF1beV0uaXNCbG9ja2VkID09PSB0cnVlKXtcclxuICAgICAgICAgICAgICAgIGJsb2NrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZihibG9ja2VkID09PSB0cnVlKXtcclxuICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgIGlzQ2FzZVJlYWNoYWJsZShjYXNlVG9SZWFjaDogQ2FzZSwgZmllbGQ6IEZpZWxkKXtcclxuICAgICAgbGV0IGRlbHRhWCA9IE1hdGguYWJzKGNhc2VUb1JlYWNoLnBvc2l0aW9uLnggLSB0aGlzLmNhc2UucG9zaXRpb24ueCk7XHJcbiAgICAgIGxldCBkZWx0YVkgPSBNYXRoLmFicyhjYXNlVG9SZWFjaC5wb3NpdGlvbi55IC0gdGhpcy5jYXNlLnBvc2l0aW9uLnkpO1xyXG4gICAgICBpZiggZGVsdGFYIDw9IDMgJiYgIGRlbHRhWSA8PSAzICl7XHJcbiAgICAgICAgIGlmKGNhc2VUb1JlYWNoLnBvc2l0aW9uLnggPT09IHRoaXMuY2FzZS5wb3NpdGlvbi54IHx8IGNhc2VUb1JlYWNoLnBvc2l0aW9uLnkgPT09IHRoaXMuY2FzZS5wb3NpdGlvbi55KXtcclxuICAgICAgICAgaWYoIWNhc2VUb1JlYWNoLmlzQmxvY2tlZCAmJiAhdGhpcy5pc1dheUJsb2NrZWQoY2FzZVRvUmVhY2gsIGZpZWxkKSl7XHJcbiAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgIH1cclxuXHJcbiAgIGdldENsb3NlZENhc2VzKCk6IEFycmF5PENhc2U+e1xyXG4gICAgICBsZXQgY2xvc2VkQ2FzZXMgPSBBcnJheTxDYXNlPigpO1xyXG4gICAgICBsZXQgc2l6ZVggPSB0aGlzLmNhc2UuZ2FtZU1hbmFnZXIuZmllbGQuc2l6ZS54O1xyXG4gICAgICBsZXQgc2l6ZVkgPSB0aGlzLmNhc2UuZ2FtZU1hbmFnZXIuZmllbGQuc2l6ZS55O1xyXG4gICAgICBsZXQgZmllbGQgPSB0aGlzLmNhc2UuZ2FtZU1hbmFnZXIuZmllbGQ7XHJcblxyXG4gICAgICBmb3IobGV0IGNvbCA9IDA7IGNvbCA8IHNpemVYOyBjb2wrKyl7XHJcbiAgICAgICAgIGZvcihsZXQgcm93ID0gMDsgcm93IDwgc2l6ZVk7IHJvdysrKXtcclxuICAgICAgICAgICAgaWYodGhpcy5jYXNlLmNhc2VzQWRqYWNlbnQoZmllbGQuY2FzZXNbY29sXVtyb3ddKSl7XHJcbiAgICAgICAgICAgICAgIGNsb3NlZENhc2VzLnB1c2goZmllbGQuY2FzZXNbY29sXVtyb3ddKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGNsb3NlZENhc2VzO1xyXG4gICB9XHJcblxyXG4gICBpc0Nsb3NlZENhc2VzQmxvY2tlZCgpOiBCb29sZWFue1xyXG4gICAgICBsZXQgYWxsQmxvY2tlZCA9IHRydWU7XHJcbiAgICAgIGZvcihsZXQgY2FzZVRvQ2hlY2sgb2YgdGhpcy5jbG9zZWRDYXNlcyl7XHJcbiAgICAgICAgIGlmKCFjYXNlVG9DaGVjay5pc0Jsb2NrZWQpe1xyXG4gICAgICAgICAgICBhbGxCbG9ja2VkID0gZmFsc2U7XHJcbiAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gYWxsQmxvY2tlZDtcclxuICAgfVxyXG5cclxuICAgbW92ZVRvKGZpZWxkOiBGaWVsZCwgY2FzZVRvTW92ZTogQ2FzZSl7XHJcblxyXG4gICAgICBpZihjYXNlVG9Nb3ZlLmdhbWVNYW5hZ2VyLmlzRmluaXNoZWQgPT09IHRydWUpe1xyXG4gICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBjaGFuZ2VkV2VhcG9uID0gZmFsc2U7XHJcbiAgICAgIGxldCBjYXNlRnJvbSA9IHRoaXMuY2FzZTtcclxuICAgICAgbGV0IHByZXZpb3VzV2VhcG9uID0gdGhpcy53ZWFwb247XHJcbiAgICAgIGxldCBsb2dnZXIgPSB0aGlzLmNhc2UuZ2FtZU1hbmFnZXIubG9nZ2VyO1xyXG4gICAgICBpZih0aGlzLmlzQ2FzZVJlYWNoYWJsZShjYXNlVG9Nb3ZlLCBmaWVsZCkpe1xyXG5cclxuICAgICAgICAgbGV0IG5leHRQbGF5ZXJBcnJheSA9IGZpZWxkLmNoYXJhY3RlcnMuZmlsdGVyKChuZXh0UGxheWVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAobmV4dFBsYXllciAhPT0gdGhpcy5jYXNlLmdhbWVNYW5hZ2VyLnBsYXllclRvdXIpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgbGV0IG5leHRQbGF5ZXIgPSBuZXh0UGxheWVyQXJyYXlbMF07XHJcbiAgICAgICAgIFxyXG4gICAgICB0aGlzLmNhc2UgPSBjYXNlVG9Nb3ZlO1xyXG4gICAgICB0aGlzLmNsb3NlZENhc2VzID0gdGhpcy5nZXRDbG9zZWRDYXNlcygpO1xyXG4gICAgICBpZihjYXNlVG9Nb3ZlLmhhc1dlYXBvbigpKXtcclxuICAgICAgICAgdGhpcy50YWtlV2VhcG9uKHRoaXMuY2FzZSwgZmllbGQpO1xyXG4gICAgICAgICBjaGFuZ2VkV2VhcG9uID0gdHJ1ZTtcclxuICAgICAgICAgbG9nZ2VyLndyaXR0ZURlc2NyaXB0aW9uKCdUaGUgcGxheWVyICcgKyB0aGlzLmNhc2UuZ2FtZU1hbmFnZXIucGxheWVyVG91ci5uYW1lICsgJyBsZXQgdGhlIHdlYXBvbiAnKyBjYXNlVG9Nb3ZlLndlYXBvbi5uYW1lICsnIHRvIHRha2UgdGhlIHdlYXBvbiAnICsgdGhpcy53ZWFwb24ubmFtZSArJy4nKTtcclxuICAgICAgICAgY29uc29sZS5sb2coJ1RoZSBwbGF5ZXIgJyArIHRoaXMuY2FzZS5nYW1lTWFuYWdlci5wbGF5ZXJUb3VyLm5hbWUgKyAnIGxldCB0aGUgd2VhcG9uICcrIGNhc2VUb01vdmUud2VhcG9uLm5hbWUgKycgdG8gdGFrZSB0aGUgd2VhcG9uICcgKyB0aGlzLndlYXBvbi5uYW1lICsnLicpO1xyXG4gICAgICAgICBNZW51TWFuYWdlci51cGRhdGVJbmZvV2VhcG9uKHRoaXMsIHRoaXMuY2FzZS5nYW1lTWFuYWdlci5wbGF5ZXJzLmluZGV4T2YodGhpcykpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBsZXQgY29uZGl0aW9uMSA9IHRoaXMuY2FzZS5wb3NpdGlvbi55IDwgbmV4dFBsYXllci5jYXNlLnBvc2l0aW9uLnkgJiYgY2FzZUZyb20ucG9zaXRpb24ueSA+IG5leHRQbGF5ZXIuY2FzZS5wb3NpdGlvbi55O1xyXG4gICAgICAvLyBsZXQgY29uZGl0aW9uMiA9IHRoaXMuY2FzZS5wb3NpdGlvbi55ID4gbmV4dFBsYXllci5jYXNlLnBvc2l0aW9uLnkgJiYgY2FzZUZyb20ucG9zaXRpb24ueSA8IG5leHRQbGF5ZXIuY2FzZS5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgICAgIExvZ2ljQ2hhcmFjdGVyLnNldEFic29sdXRlUG9zaXRpb24odGhpcyk7XHJcblxyXG4gICAgICAgICAgICBMb2dpY0NoYXJhY3Rlci5jaGVja1BsYXllckRpcmVjdGlvbih0aGlzLmNhc2UuZ2FtZU1hbmFnZXIpO1xyXG5cclxuXHJcbiAgICAgICAgICBMb2dpY0NoYXJhY3Rlci5jaGFyYWN0ZXJBbmltYXRpb24odGhpcywgdGhpcy5hYnNvbHV0ZUNvb3JkKTtcclxuICAgICAgICAgIExvZ2ljQ2hhcmFjdGVyLmNoZWNrUGxheWVyRGlyZWN0aW9uKHRoaXMuY2FzZS5nYW1lTWFuYWdlcik7XHJcbiAgICAgICAgIGlmKGNoYW5nZWRXZWFwb24pe1xyXG4gICAgICAgICAgICBMb2dpY1dlYXBvbi5wYWludFdlYXBvbihmaWVsZC5jYXNlc1tjYXNlRnJvbS5wb3NpdGlvbi54XVtjYXNlRnJvbS5wb3NpdGlvbi55XSwgcHJldmlvdXNXZWFwb24sIGZpZWxkKTtcclxuICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgIHRoaXMuY2FzZS5nYW1lTWFuYWdlci5wbGF5ZXJUb3VyID0gbmV4dFBsYXllcjtcclxuICAgICAgTWVudU1hbmFnZXIudXBkYXRlUGxheWVyVG91ck1lbnUodGhpcy5jYXNlLmdhbWVNYW5hZ2VyLnBsYXllclRvdXIpO1xyXG4gICAgICBsb2dnZXIud3JpdHRlRGVzY3JpcHRpb24oJ1RoZSBwbGF5ZXIgJyArIHRoaXMuY2FzZS5nYW1lTWFuYWdlci5wbGF5ZXJUb3VyLm5hbWUgKyAnIGNhbiBwbGF5LicpO1xyXG4gICAgICBjb25zb2xlLmxvZygnVGhlIHBsYXllciAnICsgdGhpcy5jYXNlLmdhbWVNYW5hZ2VyLnBsYXllclRvdXIubmFtZSArICcgY2FuIHBsYXkuJyk7XHJcblxyXG4gICAgICBpZih0aGlzLmNhc2UuY2FzZXNBZGphY2VudChuZXh0UGxheWVyLmNhc2UpKXtcclxuICAgICAgRmlnaHRNYW5hZ2VyLnNldEZpZ2h0TWVudSh0aGlzLmNhc2UuZ2FtZU1hbmFnZXIpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICAgbG9nZ2VyLndyaXR0ZURlc2NyaXB0aW9uKFwiVGhpcyBwbGFjZSBpcyB1bnJlYWNoYWJsZSEhXCIpO1xyXG4gICAgICAgICBjb25zb2xlLmxvZyhcIlRoaXMgcGxhY2UgaXMgdW5yZWFjaGFibGUhIVwiKTtcclxuICAgICAgfVxyXG4gICB9XHJcbiAgIFxyXG4gICBhdHRhY2soKXtcclxuICAgICAgbGV0IGxvZ2dlciA9IG5ldyBMb2dnZXIoKTtcclxuICAgICAgbGV0IHRvdXJEYW1hZ2UgPSAwO1xyXG4gICAgICBsZXQgb3Bwb25lbnQgPSB0aGlzLmNhc2UuZ2FtZU1hbmFnZXIuZmllbGQuY2hhcmFjdGVycy5maWx0ZXIoKG9wcG9uZW50KSA9PiB7XHJcbiAgICAgICAgIHJldHVybiAob3Bwb25lbnQgIT09IHRoaXMpO1xyXG4gICAgICAgfSlbMF07XHJcblxyXG4gICAgICAgbGV0IGluZGV4T3Bwb25lbnQgPSB0aGlzLmNhc2UuZ2FtZU1hbmFnZXIuZmllbGQuY2hhcmFjdGVycy5pbmRleE9mKG9wcG9uZW50KTtcclxuXHJcbiAgICAgICBpZihvcHBvbmVudC5kZWZlbnNlTW9kZSA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICB0b3VyRGFtYWdlID0gTWF0aC5yb3VuZCgodGhpcy53ZWFwb24uZGFtYWdlKS8yKTtcclxuICAgICAgIH1lbHNle1xyXG4gICAgICAgICB0b3VyRGFtYWdlID0gdGhpcy53ZWFwb24uZGFtYWdlO1xyXG4gICAgICAgfVxyXG4gICAgICAgb3Bwb25lbnQubGlmZSA9IG9wcG9uZW50LmxpZmUgLSB0b3VyRGFtYWdlO1xyXG4gICAgICAgaWYob3Bwb25lbnQubGlmZSA8IDApe1xyXG4gICAgICAgICBvcHBvbmVudC5saWZlID0gMDtcclxuICAgICAgIH1cclxuICAgICAgIE1lbnVNYW5hZ2VyLnVwZGF0ZUluZm9MaWZlKG9wcG9uZW50LCBpbmRleE9wcG9uZW50LCB0b3VyRGFtYWdlKTtcclxuICAgICAgIGxvZ2dlci53cml0dGVEZXNjcmlwdGlvbihvcHBvbmVudC5uYW1lICsgJyByZWNlaXZlZCAnICsgdG91ckRhbWFnZSArICdwdHMgb2YgZGFtYWdlcy4nKTtcclxuXHJcbiAgICAgICBpZihvcHBvbmVudC5kZWZlbnNlTW9kZSA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgIG9wcG9uZW50LmRlZmVuc2VNb2RlID0gZmFsc2U7XHJcbiAgICAgICAgIGxldCBuYW1lSW5mb0RpdkVsdCA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjJyArb3Bwb25lbnQubmFtZSsgJyAucGxheWVyLW5hbWUtaW5mbycpWzBdO1xyXG4gICAgICAgICBuYW1lSW5mb0RpdkVsdC5yZW1vdmVDaGlsZChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjJyArb3Bwb25lbnQubmFtZSsgJyAuZGVmZW5zZS1tb2RlJylbMF0pO1xyXG5cclxuICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgICAgIHRoaXMuY2FzZS5nYW1lTWFuYWdlci5wbGF5ZXJUb3VyID0gb3Bwb25lbnQ7XHJcbiAgICAgICBNZW51TWFuYWdlci51cGRhdGVQbGF5ZXJUb3VyTWVudSh0aGlzLmNhc2UuZ2FtZU1hbmFnZXIucGxheWVyVG91cik7XHJcblxyXG4gICAgICAgRmlnaHRNYW5hZ2VyLnVwZGF0ZVBsYXllclRvdXJGaWdodE1lbnUodGhpcy5jYXNlLmdhbWVNYW5hZ2VyLnBsYXllclRvdXIpO1xyXG5cclxuICAgICAgIGlmKG9wcG9uZW50LmxpZmUgPT09IDApe1xyXG4gICAgICAgICBGaWdodE1hbmFnZXIuZW5kR2FtZSh0aGlzKTtcclxuICAgICAgfVxyXG4gICB9XHJcblxyXG4gICBkZWZlbnNlKCl7XHJcblxyXG4gICAgICBpZih0aGlzLmRlZmVuc2VNb2RlID09PSB0cnVlKXtcclxuICAgICAgICAgdGhpcy5jYXNlLmdhbWVNYW5hZ2VyLmxvZ2dlci53cml0dGVEZXNjcmlwdGlvbihcIllvdSBhcmUgYWxyZWFkeSBpbiBkZWZlbnNlIG1vZGVcIik7XHJcbiAgICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGRpdlNoaWVsZEVsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgIGRpdlNoaWVsZEVsdC5jbGFzc0xpc3QuYWRkKFwiZGVmZW5zZS1tb2RlXCIpO1xyXG4gICAgICBsZXQgaW1nU2hpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgICAgbGV0IG5hbWVJbmZvRGl2RWx0ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyMnICt0aGlzLm5hbWUrICcgLnBsYXllci1uYW1lLWluZm8nKVswXTtcclxuXHJcbiAgICAgIGltZ1NoaWVsZC5zcmMgPSBcIi9hc3NldHMvaW1nL2ZpZ2h0LW1lbnUvc2hpZWxkLnBuZ1wiO1xyXG4gICAgICBpbWdTaGllbGQuY2xhc3NMaXN0LmFkZChcInNoaWVsZC1maWdodC1pbWdcIik7XHJcblxyXG4gICAgICBkaXZTaGllbGRFbHQuYXBwZW5kQ2hpbGQoaW1nU2hpZWxkKTtcclxuICAgICAgbmFtZUluZm9EaXZFbHQuYXBwZW5kQ2hpbGQoZGl2U2hpZWxkRWx0KTtcclxuXHJcbiAgICAgIGxldCBvcHBvbmVudCA9IHRoaXMuY2FzZS5nYW1lTWFuYWdlci5maWVsZC5jaGFyYWN0ZXJzLmZpbHRlcigob3Bwb25lbnQpID0+IHtcclxuICAgICAgICAgcmV0dXJuIChvcHBvbmVudCAhPT0gdGhpcyk7XHJcbiAgICAgICB9KVswXTtcclxuXHJcbiAgICAgIHRoaXMuZGVmZW5zZU1vZGUgPSB0cnVlO1xyXG5cclxuICAgICAgdGhpcy5jYXNlLmdhbWVNYW5hZ2VyLmxvZ2dlci53cml0dGVEZXNjcmlwdGlvbih0aGlzLm5hbWUgKyAnIGlzIHJlYWR5IHRvIGRlZmVuZCBoaW1zZWxmLicpO1xyXG5cclxuICAgICAgdGhpcy5jYXNlLmdhbWVNYW5hZ2VyLnBsYXllclRvdXIgPSBvcHBvbmVudDtcclxuICAgICAgTWVudU1hbmFnZXIudXBkYXRlUGxheWVyVG91ck1lbnUodGhpcy5jYXNlLmdhbWVNYW5hZ2VyLnBsYXllclRvdXIpO1xyXG4gICAgICBGaWdodE1hbmFnZXIudXBkYXRlUGxheWVyVG91ckZpZ2h0TWVudSh0aGlzLmNhc2UuZ2FtZU1hbmFnZXIucGxheWVyVG91cik7XHJcbiAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2hhcmFjdGVyOyIsIi8vVGhpcyBjbGFzcyBmb3IgdGhlIGZpZWxkc1xyXG5jbGFzcyBDb29yZCB7XHJcbiAgICAvL2ZpZWxkIFxyXG4gICAgeCA6IG51bWJlcjtcclxuICAgIHkgOiBudW1iZXI7XHJcblxyXG4gICAgLy9jb25zdHJ1Y3RvciBcclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IENvb3JkOyIsImltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuLi9tb2RlbC9maWVsZFwiO1xyXG5pbXBvcnQgQ2FzZUxvZ2ljIGZyb20gXCIuLi8uLi9jYXNlL2xvZ2ljL2Nhc2VMb2dpY1wiO1xyXG5pbXBvcnQgV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbW9kZWwvd2VhcG9uXCI7XHJcbmltcG9ydCBMb2dpY1dlYXBvbiBmcm9tIFwiLi4vLi4vd2VhcG9uL2xvZ2ljL2xvZ2ljV2VhcG9uXCI7XHJcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4uLy4uL2NoYXJhY3Rlci9tb2RlbC9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IExvZ2ljQ2hhcmFjdGVyIGZyb20gXCIuLi8uLi9jaGFyYWN0ZXIvbG9naWMvbG9naWNDaGFyYWN0ZXJcIjtcclxuaW1wb3J0IENvb3JkIGZyb20gXCIuLi8uLi9jb29yZC9tb2RlbC9jb29yZFwiO1xyXG5cclxuLy9UaGlzIGNsYXNzIHdpbGwgZ2VuZXJhdGUgYWxsIHRoZSBkaWZmZXJlbnQgb2JqZWN0cyBuZWVkZWQgZm9yIHRoZSBnYW1lXHJcbmFic3RyYWN0IGNsYXNzIExvZ2ljRmllbGQge1xyXG5cclxuICAgLyoqXHJcbiAgICAqIFxyXG4gICAgKiBAcGFyYW0geCBcclxuICAgICogQHBhcmFtIHkgXHJcbiAgICAqL1xyXG4gICBzdGF0aWMgZ2VuZXJhdGVNYXAoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBGaWVsZCB7XHJcbiAgICAgIGxldCB0b3RhbENhc2VzID0geCAqIHk7XHJcbiAgICAgIGxldCBibG9ja2VkQ2FzZXMgPSBNYXRoLnJvdW5kKHRvdGFsQ2FzZXMgLyA2KTtcclxuICAgICAgbGV0IGZpZWxkOiBGaWVsZCA9IG5ldyBGaWVsZCh4LCB5KTtcclxuICAgICAgbGV0IGFyZW5hU3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYXJlbmFcIikpO1xyXG4gICAgICAvL2xldCBmaWdodEVsdFdpZHRoID0gTnVtYmVyKGFyZW5hU3R5bGUud2lkdGgpIC0gMiphcmVuYVN0eWxlLlxyXG5cclxuICAgICAgY29uc29sZS5sb2coTnVtYmVyKGFyZW5hU3R5bGUud2lkdGgpKTtcclxuICAgICAgY29uc29sZS5sb2coYXJlbmFTdHlsZS5wYWRkaW5nKTtcclxuICAgICAgY29uc29sZS5sb2coTnVtYmVyKGFyZW5hU3R5bGUud2lkdGgpIC0gTnVtYmVyKGFyZW5hU3R5bGUucGFkZGluZykpO1xyXG5cclxuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgeDsgY29sKyspIHtcclxuICAgICAgICAgZmllbGQuY2FzZXNbY29sXSA9IFtdO1xyXG4gICAgICAgICBmb3IobGV0IHJvdyA9IDA7IHJvdyA8IHk7IHJvdysrKXtcclxuICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gbmV3IENvb3JkKGNvbCwgcm93KTtcclxuXHJcbiAgICAgICAgIGlmIChibG9ja2VkQ2FzZXMgPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBibG9ja2VkQ2FzZSA9IG5ldyBDYXNlKHBvc2l0aW9uLCBDYXNlTG9naWMuQkxPQ0tFRCk7XHJcbiAgICAgICAgICAgIGZpZWxkLmNhc2VzW2NvbF1bcm93XSA9IGJsb2NrZWRDYXNlO1xyXG4gICAgICAgICAgICBibG9ja2VkQ2FzZXMgPSBibG9ja2VkQ2FzZXMgLSAxO1xyXG4gICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgbm9uQmxvY2tlZENhc2UgPSBuZXcgQ2FzZShwb3NpdGlvbik7XHJcbiAgICAgICAgICAgIGZpZWxkLmNhc2VzW2NvbF1bcm93XSA9IG5vbkJsb2NrZWRDYXNlO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBmaWVsZC51bnNvcnRDYXNlcygpO1xyXG4gICAgICBmaWVsZC4kZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpZ2h0XCIpO1xyXG5cclxuICAgICAgcmV0dXJuIGZpZWxkO1xyXG4gICB9XHJcblxyXG4gICAvKipcclxuICAgICogXHJcbiAgICAqIEBwYXJhbSBlbGVtZW50VG9GaWxsIFxyXG4gICAgKiBAcGFyYW0gZmllbGQgXHJcbiAgICAqL1xyXG4gICBzdGF0aWMgcGFpbnRGaWVsZChlbGVtZW50VG9GaWxsOiBIVE1MRWxlbWVudCwgZmllbGQ6IEZpZWxkKTogdm9pZCB7XHJcblxyXG4gICAgICBcclxuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgZmllbGQuc2l6ZS54OyBjb2wrKykge1xyXG4gICAgICAgICBsZXQgcm93RWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgcm93RWx0LnN0eWxlLmhlaWdodCA9ICgxMDAgLyBmaWVsZC5zaXplLngpLnRvRml4ZWQoMikrIFwiJVwiO1xyXG4gICAgICAgICByb3dFbHQuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XHJcbiAgICAgICAgIHJvd0VsdC5jbGFzc0xpc3QuYWRkKFwicm93LW1hcFwiKTtcclxuICAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgZmllbGQuc2l6ZS55OyByb3crKyl7XHJcbiAgICAgICAgIGxldCBkaXZFbHQgPSBDYXNlTG9naWMucGFpbnRDYXNlKGZpZWxkLmNhc2VzW2NvbF1bcm93XSk7XHJcbiAgICAgICAgIHJvd0VsdC5hcHBlbmRDaGlsZChkaXZFbHQpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsZW1lbnRUb0ZpbGwuYXBwZW5kQ2hpbGQocm93RWx0KTtcclxuICAgfVxyXG4gICB9XHJcblxyXG5cclxuICAgIHN0YXRpYyBzZXRXZWFwb24oZmllbGQ6IEZpZWxkKTogdm9pZCB7XHJcbiAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKykge1xyXG4gICAgICAgICBsZXQgd2VhcG9uID0gbmV3IFdlYXBvbihcIk1qb2xuaXJcIitpLCAxMCtpLCBcIi9hc3NldHMvaW1nL3dlYXBvbi93ZWFwb24xLnBuZ1wiKTtcclxuICAgICAgICAgZmllbGQud2VhcG9ucy5wdXNoKHdlYXBvbik7XHJcbiAgICAgICB9XHJcbiAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKykge1xyXG4gICAgICAgICBsZXQgd2VhcG9uID0gbmV3IFdlYXBvbihcIlN0b3JtYnJlYWtlclwiK2ksIDIwK2ksIFwiL2Fzc2V0cy9pbWcvd2VhcG9uL3dlYXBvbjEucG5nXCIpO1xyXG4gICAgICAgICBmaWVsZC53ZWFwb25zLnB1c2god2VhcG9uKTtcclxuICAgICAgIH1cclxuICAgICAgIGZvcihsZXQgd2VhcG9uIG9mIGZpZWxkLndlYXBvbnMpe1xyXG4gICAgICAgICAgTG9naWNXZWFwb24ucGFpbnRTdGFydFdlYXBvbihmaWVsZCwgd2VhcG9uKTtcclxuXHJcbiAgICAgICB9XHJcbiAgICB9IFxyXG5cclxuICAgc3RhdGljIHNldENoYXJhY3RlcnMoZmllbGQ6IEZpZWxkKTogdm9pZCB7XHJcbiAgICAgIExvZ2ljQ2hhcmFjdGVyLnBhaW50U3RhcnRDaGFyYWN0ZXJzKGZpZWxkLCBcIkV4dGVybWluYXRvclwiLCBcIi9hc3NldHMvaW1nL2NoYXJhY3RlcnMvYXZhdGFyMS5wbmdcIik7XHJcbiAgICAgIExvZ2ljQ2hhcmFjdGVyLnBhaW50U3RhcnRDaGFyYWN0ZXJzKGZpZWxkLCBcIlByZWRhdG9yXCIsIFwiL2Fzc2V0cy9pbWcvY2hhcmFjdGVycy9hdmF0YXIyLnBuZ1wiKTtcclxuXHJcbiAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTG9naWNGaWVsZDsiLCJpbXBvcnQgQ2FzZSBmcm9tIFwiLi4vLi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcbmltcG9ydCBDb29yZCBmcm9tIFwiLi4vLi4vY29vcmQvbW9kZWwvY29vcmRcIjtcclxuaW1wb3J0IFNpemUgZnJvbSBcIi4uLy4uL3NpemUvbW9kZWwvc2l6ZVwiO1xyXG5pbXBvcnQgV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbW9kZWwvd2VhcG9uXCI7XHJcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4uLy4uL2NoYXJhY3Rlci9tb2RlbC9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IExvZ2ljSGVscGVyIGZyb20gXCIuLi8uLi8uLi9oZWxwZXJzL0xvZ2ljSGVscGVyXCI7XHJcblxyXG5cclxuLy9UaGlzIGNsYXNzIGZvciB0aGUgZmllbGRzXHJcbmNsYXNzIEZpZWxkIHtcclxuICAgIC8vZmllbGQgXHJcbiAgICBzaXplOiBTaXplO1xyXG4gICAgY2FzZXM6IENhc2VbXVtdO1xyXG4gICAgd2VhcG9uczogV2VhcG9uW107XHJcbiAgICBjaGFyYWN0ZXJzOiBDaGFyYWN0ZXJbXTtcclxuICAgICRlbDogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgLy9jb25zdHJ1Y3RvciBcclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5zaXplID0gbmV3IFNpemUoeCx5KTtcclxuICAgICAgICB0aGlzLmNhc2VzID0gQXJyYXk8QXJyYXk8Q2FzZT4+KCk7XHJcbiAgICAgICAgdGhpcy53ZWFwb25zID0gW107XHJcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXJzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBjYXNlVG9BZGQgXHJcbiAgICAgKi9cclxuICAgIGFkZENhc2UoY2FzZVRvQWRkOiBDYXNlW10pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNhc2VzLnB1c2goY2FzZVRvQWRkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGluZGljZUNhc2UgXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZUNhc2UocG9zaXRpb246IENvb3JkKTogdm9pZHtcclxuICAgICAgICB0aGlzLmNhc2VzW3Bvc2l0aW9uLnhdLnNwbGljZShwb3NpdGlvbi55LCAxKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICovXHJcbiAgICBuYnJPZkJsb2NrZWRDYXNlKCk6IG51bWJlciB7XHJcbiAgICAgICAgbGV0IG5ick9mQmxvY2tlZENhc2U6IG51bWJlciA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5zaXplLng7IHJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuc2l6ZS55OyBjb2wrKyl7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhc2VzW3Jvd11bY29sXS5pc0Jsb2NrZWQpIHtcclxuICAgICAgICAgICAgICAgIG5ick9mQmxvY2tlZENhc2UgPSBuYnJPZkJsb2NrZWRDYXNlICsgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICAgICByZXR1cm4gbmJyT2ZCbG9ja2VkQ2FzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICovXHJcbiAgICBnZXROb25CbG9ja2VkQ2FzZXMoKTogQXJyYXk8Q2FzZT4ge1xyXG4gICAgICAgIGxldCBOb25CbG9ja2VkQ2FzZXM6IEFycmF5PENhc2U+ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5zaXplLng7IHJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuc2l6ZS55OyBjb2wrKyl7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jYXNlc1tyb3ddW2NvbF0uaXNCbG9ja2VkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FzZVRvQWRkID0gdGhpcy5jYXNlc1tyb3ddW2NvbF07XHJcbiAgICAgICAgICAgICAgICBOb25CbG9ja2VkQ2FzZXMucHVzaChjYXNlVG9BZGQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgIHJldHVybiBOb25CbG9ja2VkQ2FzZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QmxvY2tlZENhc2VzKCk6IEFycmF5PENhc2U+IHtcclxuICAgICAgICBsZXQgQmxvY2tlZENhc2VzOiBBcnJheTxDYXNlPiA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMuc2l6ZS54OyByb3crKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCB0aGlzLnNpemUueTsgY29sKyspe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYXNlc1tyb3ddW2NvbF0uaXNCbG9ja2VkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FzZVRvQWRkID0gdGhpcy5jYXNlc1tyb3ddW2NvbF07XHJcbiAgICAgICAgICAgICAgICBCbG9ja2VkQ2FzZXMucHVzaChjYXNlVG9BZGQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgIHJldHVybiBCbG9ja2VkQ2FzZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QXZhaWxhYmxlQ2FzZXMoKTogQXJyYXk8Q2FzZT4ge1xyXG4gICAgICAgIGxldCBhdmFpbGFibGVDYXNlczogQXJyYXk8Q2FzZT4gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLnNpemUueDsgcm93KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5zaXplLnk7IGNvbCsrKXtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2FzZXNbcm93XVtjb2xdLmlzQXZhaWxhYmxlICYmICF0aGlzLmNhc2VzW3Jvd11bY29sXS5pc0Jsb2NrZWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjYXNlVG9BZGQgPSB0aGlzLmNhc2VzW3Jvd11bY29sXTtcclxuICAgICAgICAgICAgICAgIGF2YWlsYWJsZUNhc2VzLnB1c2goY2FzZVRvQWRkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICAgICByZXR1cm4gYXZhaWxhYmxlQ2FzZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiBcclxuICAgICAqL1xyXG4gICAgZ2V0Q2FzZUJ5UG9zaXRpb24ocG9zaXRpb246IENvb3JkKTogQ2FzZSB7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY2FzZXNbcG9zaXRpb24ueF1bcG9zaXRpb24ueV0pO1xyXG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FzZXNbcG9zaXRpb24ueF1bcG9zaXRpb24ueV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKi9cclxuICAgIGdldFJhbmRvbUNhc2UoKTogQ2FzZXtcclxuICAgICAgICBsZXQgcmFuZG9tWCA9IExvZ2ljSGVscGVyLmdldFJhbmRvbURpbWVuc2lvbih0aGlzLnNpemUueC0xKTtcclxuICAgICAgICBsZXQgcmFuZG9tWSA9IExvZ2ljSGVscGVyLmdldFJhbmRvbURpbWVuc2lvbih0aGlzLnNpemUueS0xKTtcclxuXHJcbiAgICAgICAgbGV0IHJhbmRvbUNvb3JkID0gbmV3IENvb3JkKHJhbmRvbVgsIHJhbmRvbVkpO1xyXG5cclxuICAgICAgICBsZXQgY2FzZVJhbmRvbSA9IHRoaXMuZ2V0Q2FzZUJ5UG9zaXRpb24ocmFuZG9tQ29vcmQpO1xyXG4gICAgICAgIGxldCBjYXNlVG9DaGVjayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhc2VSYW5kb20ucG9zaXRpb25TdHJpbmcpO1xyXG4gICAgICAgIHdoaWxlKGNhc2VUb0NoZWNrID09PSBudWxsIHx8IGNhc2VUb0NoZWNrID09PSB1bmRlZmluZWQgfHwgY2FzZVJhbmRvbSA9PT0gdW5kZWZpbmVkIHx8IGNhc2VSYW5kb20gPT09IG51bGwpe1xyXG5cclxuICAgICAgICAgICAgbGV0IHJhbmRvbVggPSBMb2dpY0hlbHBlci5nZXRSYW5kb21EaW1lbnNpb24odGhpcy5zaXplLngtMSk7XHJcbiAgICAgICAgICAgIGxldCByYW5kb21ZID0gTG9naWNIZWxwZXIuZ2V0UmFuZG9tRGltZW5zaW9uKHRoaXMuc2l6ZS55LTEpO1xyXG4gICAgXHJcbiAgICAgICAgICAgIGxldCByYW5kb21Db29yZCA9IG5ldyBDb29yZChyYW5kb21YLCByYW5kb21ZKTtcclxuXHJcbiAgICAgICAgICAgIGNhc2VSYW5kb20gPSB0aGlzLmdldENhc2VCeVBvc2l0aW9uKHJhbmRvbUNvb3JkKTtcclxuICAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjYXNlUmFuZG9tO1xyXG4gICAgfVxyXG5cclxuICBcclxuICAgIGdldE5vbkJsb2NrZWRSYW5kb21DYXNlKCk6IENhc2V7XHJcblxyXG4gICAgICAgIGxldCBub25CbG9ja2VkQ2FzZXMgPSB0aGlzLmdldE5vbkJsb2NrZWRDYXNlcygpO1xyXG5cclxuICAgICAgICBsZXQgaW5kaWNlID0gTG9naWNIZWxwZXIuZ2V0UmFuZG9tRGltZW5zaW9uKG5vbkJsb2NrZWRDYXNlcy5sZW5ndGgtMSk7XHJcblxyXG4gICAgICAgIGxldCBub25CbG9ja2VkUmFuZG9tQ2FzZSA9IG5vbkJsb2NrZWRDYXNlc1tpbmRpY2VdO1xyXG5cclxuICAgICAgICByZXR1cm4gbm9uQmxvY2tlZFJhbmRvbUNhc2U7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldEF2YWlsYWJsZVJhbmRvbUNhc2UoKTogQ2FzZXtcclxuICAgICAgICBsZXQgYXZhaWxhYmxlQ2FzZXMgPSB0aGlzLmdldEF2YWlsYWJsZUNhc2VzKCk7XHJcblxyXG4gICAgICAgIGxldCBpbmRpY2UgPSBMb2dpY0hlbHBlci5nZXRSYW5kb21EaW1lbnNpb24oYXZhaWxhYmxlQ2FzZXMubGVuZ3RoLTEpO1xyXG5cclxuICAgICAgICBsZXQgYXZhaWxhYmxlUmFuZG9tQ2FzZSA9IGF2YWlsYWJsZUNhc2VzW2luZGljZV07XHJcblxyXG4gICAgICAgIHJldHVybiBhdmFpbGFibGVSYW5kb21DYXNlO1xyXG4gICAgfSBcclxuXHJcblxyXG4gICAgZHVwbGljYXRlTGlzdE9mQ2FzZSgpOiBDYXNlW117XHJcbiAgICAgICAgbGV0IGNhc2VzVGVtcCA9IEFycmF5PENhc2U+KCk7XHJcbiAgICAgICAgZm9yIChsZXQgcm93PTA7IHJvdyA8IHRoaXMuc2l6ZS54OyByb3crKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IGNvbD0wOyBjb2wgPCB0aGlzLnNpemUueTsgY29sKyspe1xyXG4gICAgICAgICAgIGxldCBjYXNlVG9BZGQgPSB0aGlzLmNhc2VzW3Jvd11bY29sXTtcclxuICAgICAgICAgICBjYXNlc1RlbXAucHVzaChjYXNlVG9BZGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICAgICByZXR1cm4gY2FzZXNUZW1wO1xyXG4gICAgfVxyXG5cclxuICAgIHVuc29ydENhc2VzKCk6IHZvaWR7XHJcbiAgICAgICAgbGV0IGNhc2VzVGVtcCA9IHRoaXMuZHVwbGljYXRlTGlzdE9mQ2FzZSgpO1xyXG5cclxuICAgICAgICBmb3IobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuc2l6ZS54OyBjb2wrKyl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5zaXplLnk7IHJvdysrKXtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kaWNlID0gTG9naWNIZWxwZXIuZ2V0UmFuZG9tRGltZW5zaW9uKGNhc2VzVGVtcC5sZW5ndGgtMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXNlc1tjb2xdW3Jvd10gPSBjYXNlc1RlbXBbaW5kaWNlXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FzZXNbY29sXVtyb3ddLnBvc2l0aW9uLnggPSBjb2w7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhc2VzW2NvbF1bcm93XS5wb3NpdGlvbi55ID0gcm93O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXNlc1tjb2xdW3Jvd10ucG9zaXRpb25TdHJpbmcgPSBTdHJpbmcoY29sKStTdHJpbmcocm93KTtcclxuICAgICAgICAgICAgICAgIGNhc2VzVGVtcC5zcGxpY2UoaW5kaWNlLDEpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRDYXNlQnlFbHQoZWw6IEVsZW1lbnQpOiBDYXNle1xyXG4gICAgICAgIGZvcihsZXQgcm93Q2FzZXMgb2YgdGhpcy5jYXNlcyl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgY2FzZVRvR2V0IG9mIHJvd0Nhc2VzKXtcclxuICAgICAgICAgICAgICAgIGlmKGNhc2VUb0dldC4kZWwgPT09IGVsKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FzZVRvR2V0O1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEZpZWxkOyIsIlxyXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gXCIuL2NoYXJhY3Rlci9tb2RlbC9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IEdhbWVNYW5hZ2VyIGZyb20gXCIuL2dhbWVNYW5hZ2VyXCI7XHJcbmltcG9ydCBMb2dnZXIgZnJvbSBcIi4vbG9nZ2VyXCI7XHJcblxyXG5hYnN0cmFjdCBjbGFzcyBGaWdodE1hbmFnZXIge1xyXG5cclxuICAgIHN0YXRpYyBmaWdodFRvRGVhdGgocGxheWVyMTogQ2hhcmFjdGVyLCBwbGF5ZXIyOiBDaGFyYWN0ZXIpe1xyXG5cclxuICAgICAgICBsZXQgbG9nZ2VyOiBMb2dnZXI7XHJcbiAgICAgICAgbG9nZ2VyLndyaXR0ZURlc2NyaXB0aW9uKCdUaGUgZGVhdGggbWF0Y2ggYmVnaW5zICEhJyk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCcnKVxyXG5cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2V0SWRQbGF5ZXJJbmZvKGdhbWVNYW5hZ2VyOiBHYW1lTWFuYWdlciwgZWxlbWVudDogRWxlbWVudCl7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjaGFyYWN0ZXItdG8tZmlnaHQtYXZhdGFyXCIpWzBdLmlkID0gZ2FtZU1hbmFnZXIucGxheWVyc1swXS5uYW1lO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY2hhcmFjdGVyLXRvLWZpZ2h0LWF2YXRhclwiKVsxXS5pZCA9IGdhbWVNYW5hZ2VyLnBsYXllcnNbMV0ubmFtZTtcclxuXHJcbn1cclxuXHJcbiAgICBzdGF0aWMgc2V0RmlnaHRNZW51KGdhbWVNYW5hZ2VyOiBHYW1lTWFuYWdlcil7XHJcblxyXG4gICAgICAgIGdhbWVNYW5hZ2VyLmlzRmluaXNoZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICBsZXQgZGl2RmlnaHRNZW51RWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWdodC1tZW51XCIpO1xyXG4gICAgICAgIGRpdkZpZ2h0TWVudUVsdC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG5cclxuICAgICAgICBsZXQgYXZhdGFyMSA9IGdhbWVNYW5hZ2VyLnBsYXllcnNbMF0uaWNvblVybDtcclxuICAgICAgICBsZXQgaW1nQXZhdGFyMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgaW1nQXZhdGFyMS5zcmMgPSBhdmF0YXIxO1xyXG4gICAgICAgIGltZ0F2YXRhcjEuc3R5bGUudHJhbnNmb3JtID0gXCJyb3RhdGVZKDE4MGRlZylcIjtcclxuXHJcbiAgICAgICAgbGV0IGF2YXRhcjIgPSBnYW1lTWFuYWdlci5wbGF5ZXJzWzFdLmljb25Vcmw7XHJcbiAgICAgICAgbGV0IGltZ0F2YXRhcjIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGltZ0F2YXRhcjIuc3JjID0gYXZhdGFyMjtcclxuXHJcbiAgICAgICAgbGV0IGRpdkNoYXJhY3RlclRvRmlnaHQxID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImNoYXJhY3Rlci10by1maWdodC1hdmF0YXJcIilbMF07XHJcbiAgICAgICAgZGl2Q2hhcmFjdGVyVG9GaWdodDEuY2xhc3NMaXN0LmFkZChnYW1lTWFuYWdlci5wbGF5ZXJzWzBdLm5hbWUpO1xyXG4gICAgICAgIGRpdkNoYXJhY3RlclRvRmlnaHQxLmFwcGVuZENoaWxkKGltZ0F2YXRhcjEpO1xyXG5cclxuICAgICAgICBsZXQgZGl2Q2hhcmFjdGVyVG9GaWdodDIgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiY2hhcmFjdGVyLXRvLWZpZ2h0LWF2YXRhclwiKVsxXTtcclxuICAgICAgICBkaXZDaGFyYWN0ZXJUb0ZpZ2h0Mi5jbGFzc0xpc3QuYWRkKGdhbWVNYW5hZ2VyLnBsYXllcnNbMV0ubmFtZSk7XHJcbiAgICAgICAgZGl2Q2hhcmFjdGVyVG9GaWdodDIuYXBwZW5kQ2hpbGQoaW1nQXZhdGFyMik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zZXRBdHRhY2tCdXR0b24oZ2FtZU1hbmFnZXIpO1xyXG4gICAgICAgIHRoaXMuc2V0RGVmZW5zZUJ1dHRvbihnYW1lTWFuYWdlcik7XHJcblxyXG5cclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFyZW5hXCIpLmFwcGVuZENoaWxkKGRpdkZpZ2h0TWVudUVsdCk7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWdodFwiKS5jbGFzc0xpc3QuYWRkKFwiZmlnaHQtbW9kZVwiKTtcclxuXHJcblxyXG4gICAgXHJcblxyXG4gICAgICAgIGlmKGdhbWVNYW5hZ2VyLnBsYXllclRvdXIgPT09IGdhbWVNYW5hZ2VyLnBsYXllcnNbMF0pe1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArZ2FtZU1hbmFnZXIucGxheWVyVG91ci5uYW1lKVswXS5jbGFzc0xpc3QuYWRkKFwicGxheWVyVG91ci1maWdodFwiKTtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicgK2dhbWVNYW5hZ2VyLnBsYXllcnNbMV0ubmFtZSlbMF0uY2xhc3NMaXN0LmFkZChcInBhc3NpdmVQbGF5ZXItZmlnaHRcIik7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICtnYW1lTWFuYWdlci5wbGF5ZXJUb3VyLm5hbWUpWzBdLmNsYXNzTGlzdC5hZGQoXCJwbGF5ZXJUb3VyLWZpZ2h0XCIpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArZ2FtZU1hbmFnZXIucGxheWVyc1swXS5uYW1lKVswXS5jbGFzc0xpc3QuYWRkKFwicGFzc2l2ZVBsYXllci1maWdodFwiKTsgICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNldEF0dGFja0J1dHRvbihnYW1lTWFuYWdlcjogR2FtZU1hbmFnZXIpe1xyXG5cclxuICAgICAgICBsZXQgYXR0YWNrQnV0dG9uID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyNidG5BdHRhY2snKVswXTtcclxuICAgICAgICBhdHRhY2tCdXR0b24ub25jbGljayA9IChldmVudDogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2xpY2tBdHRhY2soZXZlbnQsIGdhbWVNYW5hZ2VyKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBvbkNsaWNrQXR0YWNrKGV2ZW50OiBNb3VzZUV2ZW50LCBnYW1lTWFuYWdlcjogR2FtZU1hbmFnZXIpOiB2b2lke1xyXG5cclxuICAgICAgICBsZXQgb2ZmZW5zaXZlUGxheWVyID0gZ2FtZU1hbmFnZXIucGxheWVyVG91cjtcclxuICAgICAgICBsZXQgZGVmZW5zaXZlUGxheWVyID0gZ2FtZU1hbmFnZXIuZmllbGQuY2hhcmFjdGVycy5maWx0ZXIoKGRlZmVuc2l2ZVBsYXllcikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKGRlZmVuc2l2ZVBsYXllciAhPT0gb2ZmZW5zaXZlUGxheWVyKTtcclxuICAgICAgICAgIH0pWzBdO1xyXG5cclxuICAgICAgICAgIG9mZmVuc2l2ZVBsYXllci5hdHRhY2soKTtcclxuXHJcbiAgICB9IFxyXG5cclxuICAgIHN0YXRpYyBzZXREZWZlbnNlQnV0dG9uKGdhbWVNYW5hZ2VyOiBHYW1lTWFuYWdlcil7IFxyXG5cclxuICAgICAgICBsZXQgZGVmZW5zZUJ1dHRvbiA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjYnRuRGVmZW5zZScpWzBdO1xyXG4gICAgICAgIGRlZmVuc2VCdXR0b24ub25jbGljayA9IChldmVudDogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2xpY2tEZWZlbnNlKGV2ZW50LCBnYW1lTWFuYWdlcik7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgb25DbGlja0RlZmVuc2UoZXZlbnQ6IE1vdXNlRXZlbnQsIGdhbWVNYW5hZ2VyOiBHYW1lTWFuYWdlcik6IHZvaWR7XHJcblxyXG4gICAgICAgICAgZ2FtZU1hbmFnZXIucGxheWVyVG91ci5kZWZlbnNlKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBvbkNsaWNrUmVsb2FkKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZHtcclxuXHJcbiAgICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XHJcblxyXG4gIH1cclxuICAgIFxyXG4gICAgc3RhdGljIGVuZEdhbWUocGxheWVyOiBDaGFyYWN0ZXIpe1xyXG4gICAgICAgIC8vd2luZG93LmFsZXJ0KCdUaGUgcGxheWVyICcgK3BsYXllci5uYW1lKyAnIGxvc3QhIVxcblRoZSBnYW1lIHdpbGwgcmVzdGFydC4nKTtcclxuICAgICAgICAvL2xvY2F0aW9uLnJlbG9hZCh0cnVlKTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbmRHYW1lLW1vZGFsXCIpLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcmVuYVwiKS5zdHlsZS5maWx0ZXIgPSBcImJyaWdodG5lc3MoNTAlKVwiO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndpbm5lclwiKS50ZXh0Q29udGVudCA9IHBsYXllci5uYW1lICsgXCIgd2luIHRoZSBnYW1lISEhXCI7XHJcblxyXG4gICAgICAgIGxldCB3aW5uZXJJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIHdpbm5lckltZy5zcmMgPSBwbGF5ZXIuaWNvblVybDtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3aW5uZXItaW1nXCIpLmFwcGVuZENoaWxkKHdpbm5lckltZyk7XHJcblxyXG4gICAgICAgIGxldCByZWZyZXNoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbmRHYW1lLWltZy1yZWxvYWRcIik7XHJcbiAgICAgICAgcmVmcmVzaC5vbmNsaWNrID0gKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMub25DbGlja1JlbG9hZChldmVudCk7XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgdXBkYXRlUGxheWVyVG91ckZpZ2h0TWVudShwbGF5ZXI6IENoYXJhY3Rlcil7XHJcbiAgICAgICAgbGV0IHBsYXllclRvdXJFbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicGxheWVyVG91ci1maWdodFwiKVswXTtcclxuICAgICAgICBsZXQgcGFzc2l2ZVBsYXllckVsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwYXNzaXZlUGxheWVyLWZpZ2h0XCIpWzBdO1xyXG4gIFxyXG4gICAgICAgICAgcGxheWVyVG91ckVsdC5jbGFzc0xpc3QucmVtb3ZlKCdwbGF5ZXJUb3VyLWZpZ2h0Jyk7XHJcbiAgICAgICAgICBwYXNzaXZlUGxheWVyRWx0LmNsYXNzTGlzdC5yZW1vdmUoJ3Bhc3NpdmVQbGF5ZXItZmlnaHQnKTtcclxuXHJcbiAgICAgICAgICAgcGFzc2l2ZVBsYXllckVsdC5jbGFzc0xpc3QuYWRkKCdwbGF5ZXJUb3VyLWZpZ2h0Jyk7XHJcbiAgICAgICAgICBwbGF5ZXJUb3VyRWx0LmNsYXNzTGlzdC5hZGQoJ3Bhc3NpdmVQbGF5ZXItZmlnaHQnKTsgIFxyXG5cclxuICAgIH1cclxuICAgIFxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRmlnaHRNYW5hZ2VyOyIsImltcG9ydCBDYXNlIGZyb20gXCIuL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4vZmllbGQvbW9kZWwvZmllbGRcIjtcclxuaW1wb3J0IExvZ2ljRmllbGQgZnJvbSBcIi4vZmllbGQvbG9naWMvbG9naWNGaWVsZFwiO1xyXG5pbXBvcnQgQ2FzZUxvZ2ljIGZyb20gXCIuL2Nhc2UvbG9naWMvY2FzZUxvZ2ljXCI7XHJcbmltcG9ydCBXZWFwb24gZnJvbSBcIi4vd2VhcG9uL21vZGVsL3dlYXBvblwiO1xyXG5pbXBvcnQgTG9naWNXZWFwb24gZnJvbSBcIi4vd2VhcG9uL2xvZ2ljL2xvZ2ljV2VhcG9uXCI7XHJcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4vY2hhcmFjdGVyL21vZGVsL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgTG9naWNDaGFyYWN0ZXIgZnJvbSBcIi4vY2hhcmFjdGVyL2xvZ2ljL2xvZ2ljQ2hhcmFjdGVyXCI7XHJcbmltcG9ydCBDb29yZCBmcm9tIFwiLi9jb29yZC9tb2RlbC9jb29yZFwiO1xyXG5pbXBvcnQgTG9nZ2VyIGZyb20gXCIuL2xvZ2dlclwiO1xyXG5pbXBvcnQgTWVudU1hbmFnZXIgZnJvbSBcIi4vbWVudU1hbmFnZXJcIjtcclxuXHJcbmNsYXNzIEdhbWVNYW5hZ2VyIHtcclxuICAgIGZpZWxkOiBGaWVsZDtcclxuICAgIGlkOiBzdHJpbmcgPSAnZmlnaHQnO1xyXG4gICAgcGxheWVyczogQXJyYXk8Q2hhcmFjdGVyPjtcclxuICAgIHBsYXllclRvdXI6IENoYXJhY3RlcjtcclxuICAgIG1heE1vdmU6IG51bWJlciA9IDM7XHJcbiAgICBsb2dnZXI6IExvZ2dlcjtcclxuICAgIG1lbnVNYW5hZ2VyOiBNZW51TWFuYWdlcjtcclxuICAgIGlzRmluaXNoZWQ6IGJvb2xlYW47XHJcblxyXG4gICAgJGVsOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMucGxheWVycyA9IG5ldyBBcnJheTxDaGFyYWN0ZXI+KCk7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyKCk7XHJcbiAgICAgICAgdGhpcy4kZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkKTtcclxuICAgICAgICB0aGlzLmlzRmluaXNoZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRHYW1lTWFuYWdlcigpe1xyXG4gICAgICAgIGZvcihsZXQgcm93RmllbGQgb2YgdGhpcy5maWVsZC5jYXNlcyl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgY2FzZVRvVXBkYXRlIG9mIHJvd0ZpZWxkKXtcclxuICAgICAgICAgICAgICAgIGNhc2VUb1VwZGF0ZS5nYW1lTWFuYWdlciA9IHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnRHYW1lKCkge1xyXG4gICAgICAgIHRoaXMubG9nZ2VyLndyaXR0ZURlc2NyaXB0aW9uKCdzdGFydGluZyBnYW1lLi4uJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3N0YXJ0aW5nIGdhbWUuLi4nKTtcclxuXHJcbiAgICAgICAgbGV0IGZpZWxkID0gTG9naWNGaWVsZC5nZW5lcmF0ZU1hcCgxMCwgMTApO1xyXG5cclxuICAgICAgICB0aGlzLmZpZWxkID0gZmllbGQ7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0R2FtZU1hbmFnZXIoKTtcclxuXHJcbiAgICAgICAgTG9naWNGaWVsZC5wYWludEZpZWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlnaHRcIiksIGZpZWxkKTtcclxuXHJcbiAgICAgICAgTG9naWNGaWVsZC5zZXRXZWFwb24oZmllbGQpO1xyXG5cclxuICAgICAgICBMb2dpY0ZpZWxkLnNldENoYXJhY3RlcnMoZmllbGQpO1xyXG5cclxuICAgICAgICAvLyBGaXJzdCBQbGF5ZXIgc3RhcnRcclxuICAgICAgICB0aGlzLnBsYXllclRvdXIgPSBmaWVsZC5jaGFyYWN0ZXJzWzBdO1xyXG4gICAgICAgIE1lbnVNYW5hZ2VyLnNldE1lbnUodGhpcyk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zaG93UmVhY2hhYmxlQ2FzZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmxvZ2dlci53cml0dGVEZXNjcmlwdGlvbignVGhlIHBsYXllciAnICsgdGhpcy5wbGF5ZXJUb3VyLm5hbWUgKyAnIGNhbiBwbGF5LicpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdUaGUgcGxheWVyICcgKyB0aGlzLnBsYXllclRvdXIubmFtZSArICcgY2FuIHBsYXkuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1JlYWNoYWJsZUNhc2UoKXtcclxuICAgICAgICBmb3IobGV0IGNvbD0wOyBjb2wgPCB0aGlzLmZpZWxkLnNpemUueDsgY29sKyspe1xyXG4gICAgICAgICAgICBmb3IobGV0IHJvdz0wOyByb3cgPCB0aGlzLmZpZWxkLnNpemUueTsgcm93Kyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhc2VUb0NoZWNrID0gdGhpcy5maWVsZC5jYXNlc1tjb2xdW3Jvd107XHJcbiAgICAgICAgICAgIGlmKHRoaXMucGxheWVyVG91ci5pc0Nhc2VSZWFjaGFibGUoY2FzZVRvQ2hlY2ssIHRoaXMuZmllbGQpID09PSB0cnVlICYmIGNhc2VUb0NoZWNrICE9PSB0aGlzLnBsYXllclRvdXIuY2FzZSl7XHJcbiAgICAgICAgICAgICAgICBjYXNlVG9DaGVjay4kZWwuY2xhc3NMaXN0LmFkZChcImNhc2UtcmVhY2hhYmxlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgXHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgR2FtZU1hbmFnZXI7IiwiaW1wb3J0IENhc2UgZnJvbSBcIi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcbmltcG9ydCBGaWVsZCBmcm9tIFwiLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5pbXBvcnQgTG9naWNGaWVsZCBmcm9tIFwiLi9maWVsZC9sb2dpYy9sb2dpY0ZpZWxkXCI7XHJcbmltcG9ydCBDYXNlTG9naWMgZnJvbSBcIi4vY2FzZS9sb2dpYy9jYXNlTG9naWNcIjtcclxuaW1wb3J0IFdlYXBvbiBmcm9tIFwiLi93ZWFwb24vbW9kZWwvd2VhcG9uXCI7XHJcbmltcG9ydCBMb2dpY1dlYXBvbiBmcm9tIFwiLi93ZWFwb24vbG9naWMvbG9naWNXZWFwb25cIjtcclxuaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCBMb2dpY0NoYXJhY3RlciBmcm9tIFwiLi9jaGFyYWN0ZXIvbG9naWMvbG9naWNDaGFyYWN0ZXJcIjtcclxuaW1wb3J0IENvb3JkIGZyb20gXCIuL2Nvb3JkL21vZGVsL2Nvb3JkXCI7XHJcblxyXG5jbGFzcyBMb2dnZXIge1xyXG4gICAgYWN0aXZpdHk6IEFycmF5PHN0cmluZz47XHJcbiAgICAkZWw6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuYWN0aXZpdHkgPSBBcnJheTxzdHJpbmc+KCk7XHJcblxyXG4gICAgICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FjdGl2aXR5LWl0ZW0tbGlzdCcpO1xyXG4gICAgfVxyXG5cclxud3JpdHRlRGVzY3JpcHRpb24odGV4dDogc3RyaW5nKXtcclxuICAgIGxldCBhY3Rpdml0eUVsdCA9IHRoaXMuJGVsO1xyXG4gICAgdGhpcy5hY3Rpdml0eS5wdXNoKHRleHQpO1xyXG4gICAgbGV0IGxhc3RBY3Rpdml0eUluZGljZSA9IHRoaXMuYWN0aXZpdHkubGVuZ3RoLTE7XHJcbiAgICBsZXQgZGl2RWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGxldCBkaXZUZXh0RWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICBsZXQgaXRlbUxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdsYXN0LWl0ZW0nKTtcclxuICAgIGlmKGl0ZW1MaXN0WzBdICE9PSB1bmRlZmluZWQgJiYgaXRlbUxpc3RbMF0gIT09IG51bGwpe1xyXG4gICAgaXRlbUxpc3RbMF0uY2xhc3NMaXN0LnJlbW92ZSgnbGFzdC1pdGVtJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZGl2VGV4dEVsdC50ZXh0Q29udGVudCA9IHRoaXMuYWN0aXZpdHlbbGFzdEFjdGl2aXR5SW5kaWNlXTtcclxuXHJcbiAgICBcclxuICAgIGFjdGl2aXR5RWx0Lmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJiZWdpbicsICc8ZGl2IGNsYXNzPVwiYWN0aXZpdHktaXRlbSBsYXN0LWl0ZW1cIj4nKyB0aGlzLmFjdGl2aXR5W2xhc3RBY3Rpdml0eUluZGljZV0gKyc8L2Rpdj4nKTtcclxuXHJcblxyXG59XHJcblxyXG5cclxuXHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgTG9nZ2VyOyIsIlxyXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gXCIuL2NoYXJhY3Rlci9tb2RlbC9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IEdhbWVNYW5hZ2VyIGZyb20gXCIuL2dhbWVNYW5hZ2VyXCI7XHJcblxyXG5hYnN0cmFjdCBjbGFzcyBNZW51TWFuYWdlciB7XHJcblxyXG4gICAgc3RhdGljIHNldE1lbnUoZ2FtZU1hbmFnZXI6IEdhbWVNYW5hZ2VyKXtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRJZFBsYXllckluZm8oZ2FtZU1hbmFnZXIpO1xyXG5cclxuICAgICAgICB0aGlzLnNldEluZm8oZ2FtZU1hbmFnZXIucGxheWVyc1swXSwgMCk7XHJcblxyXG4gICAgICAgIGdhbWVNYW5hZ2VyLnBsYXllcnNbMF0uJGF2YXRhckxpZmVFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjJyArZ2FtZU1hbmFnZXIucGxheWVyc1swXS5uYW1lKyAnIC5saWZlLWluZm8nKVswXTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRJbmZvKGdhbWVNYW5hZ2VyLnBsYXllcnNbMV0sIDEpO1xyXG4gICAgICAgIGdhbWVNYW5hZ2VyLnBsYXllcnNbMV0uJGF2YXRhckxpZmVFbHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjJyArZ2FtZU1hbmFnZXIucGxheWVyc1sxXS5uYW1lKyAnIC5saWZlLWluZm8nKVswXTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVQbGF5ZXJUb3VyTWVudShnYW1lTWFuYWdlci5wbGF5ZXJUb3VyKTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2V0SWRQbGF5ZXJJbmZvKGdhbWVNYW5hZ2VyOiBHYW1lTWFuYWdlcil7XHJcblxyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInBsYXllci1pbmZvXCIpWzBdLmlkID0gZ2FtZU1hbmFnZXIucGxheWVyc1swXS5uYW1lO1xyXG5cclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwbGF5ZXItaW5mb1wiKVsxXS5pZCA9IGdhbWVNYW5hZ2VyLnBsYXllcnNbMV0ubmFtZTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNldEluZm8ocGxheWVyOiBDaGFyYWN0ZXIsIGluZGljZVBsYXllcjogbnVtYmVyKXtcclxuICAgXHJcbiAgICAgICAgbGV0IGxpZmVJbmZvRWx0ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyMnICtwbGF5ZXIubmFtZSsgJyAubGlmZS1pbmZvJylbMF07XHJcbiAgICAgICAgbGV0IGRpdkxpZmVFbHQgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnIycgK3BsYXllci5uYW1lKyAnIC5saWZlLXZhbHVlJylbMF07XHJcbiAgICAgICAgZGl2TGlmZUVsdC50ZXh0Q29udGVudCA9IFN0cmluZyhwbGF5ZXIubGlmZSk7XHJcblxyXG4gICAgICAgIGxldCBkaXZEYW1hZ2VFbHQgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnIycgK3BsYXllci5uYW1lKyAnIC5kYW1hZ2VUb3VyJylbMF07XHJcblxyXG4gICAgICAgIHRoaXMuc2V0Q29sb3JJbmZvTGlmZShwbGF5ZXIsIGluZGljZVBsYXllcik7XHJcblxyXG4gICAgICAgIGxldCB3ZWFwb25JbmZvRWx0ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyMnICtwbGF5ZXIubmFtZSsgJyAud2VhcG9uLWluZm8nKVswXTtcclxuICAgICAgICBsZXQgZGl2V2VhcG9uRWx0ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyMnICtwbGF5ZXIubmFtZSsgJyAud2VhcG9uLXZhbHVlJylbMF1cclxuICAgICAgICBkaXZXZWFwb25FbHQudGV4dENvbnRlbnQgPSBwbGF5ZXIud2VhcG9uLm5hbWUrICcoJytwbGF5ZXIud2VhcG9uLmRhbWFnZSsnKSc7XHJcblxyXG4gICAgICAgIGxldCBkaXZBdmF0YXJFbHQgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnIycgK3BsYXllci5uYW1lKyAnIC5hdmF0YXItaW1nJylbMF07XHJcbiAgICAgICAgbGV0IGF2YXRhciA9IHBsYXllci5pY29uVXJsO1xyXG4gICAgICAgIGxldCBpbWdBdmF0YXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGltZ0F2YXRhci5zcmMgPSBhdmF0YXI7XHJcbiAgICAgICAgZGl2QXZhdGFyRWx0LmFwcGVuZENoaWxkKGltZ0F2YXRhcik7XHJcblxyXG4gICAgICAgIGxldCBuYW1lSW5mb0VsdCA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjJyArcGxheWVyLm5hbWUrICcgLnBsYXllci1uYW1lJylbMF07XHJcbiAgICAgICAgbmFtZUluZm9FbHQudGV4dENvbnRlbnQgPSBwbGF5ZXIubmFtZTtcclxuXHJcbiAgICAgICAgbGV0IG5hbWVJbmZvRGl2RWx0ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyMnICtwbGF5ZXIubmFtZSsgJyAucGxheWVyLW5hbWUtaW5mbycpWzBdO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGluZGljZVBsYXllcikge1xyXG4gICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICBkaXZBdmF0YXJFbHQuc3R5bGUubGVmdCA9IFwiNSVcIlxyXG4gICAgICAgICAgICAgICAgZGl2TGlmZUVsdC5zdHlsZS5tYXJnaW5MZWZ0ID0gXCI1cHhcIjtcclxuICAgICAgICAgICAgICAgIGRpdldlYXBvbkVsdC5zdHlsZS5tYXJnaW5MZWZ0ID0gXCI1cHhcIjtcclxuICAgICAgICAgICAgICAgIGRpdkRhbWFnZUVsdC5zdHlsZS5tYXJnaW5MZWZ0ID0gXCI1cHhcIjtcclxuICAgICAgICAgICAgICAgIG5hbWVJbmZvRWx0LnN0eWxlLm1hcmdpblJpZ2h0ID0gXCI1cHhcIjtcclxuICAgICAgICAgICAgICAgIGltZ0F2YXRhci5zdHlsZS50cmFuc2Zvcm0gPSBcInJvdGF0ZVkoMTgwZGVnKVwiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICBkaXZBdmF0YXJFbHQuc3R5bGUucmlnaHQgPSBcIjUlXCJcclxuICAgICAgICAgICAgICAgIGRpdkxpZmVFbHQuc3R5bGUubWFyZ2luUmlnaHQgPSBcIjVweFwiO1xyXG4gICAgICAgICAgICAgICAgZGl2V2VhcG9uRWx0LnN0eWxlLm1hcmdpblJpZ2h0ID0gXCI1cHhcIjtcclxuICAgICAgICAgICAgICAgIGRpdkRhbWFnZUVsdC5zdHlsZS5tYXJnaW5SaWdodCA9IFwiNXB4XCI7XHJcbiAgICAgICAgICAgICAgICBuYW1lSW5mb0VsdC5zdHlsZS5tYXJnaW5MZWZ0ID0gXCI1cHhcIjtcclxuICAgICAgICAgICAgICAgIGxpZmVJbmZvRWx0LnN0eWxlLmZsZXhEaXJlY3Rpb24gPSBcInJvdy1yZXZlcnNlXCI7XHJcbiAgICAgICAgICAgICAgICB3ZWFwb25JbmZvRWx0LnN0eWxlLmZsZXhEaXJlY3Rpb24gPSBcInJvdy1yZXZlcnNlXCI7XHJcbiAgICAgICAgICAgICAgICBuYW1lSW5mb0VsdC5zdHlsZS5mbGV4RGlyZWN0aW9uID0gXCJyb3ctcmV2ZXJzZVwiO1xyXG4gICAgICAgICAgICAgICAgbmFtZUluZm9EaXZFbHQuc3R5bGUuZmxleERpcmVjdGlvbiA9IFwicm93LXJldmVyc2VcIjtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHVwZGF0ZUluZm9MaWZlKHBsYXllcjogQ2hhcmFjdGVyLCBpbmRpY2VQbGF5ZXI6IG51bWJlciwgZGFtYWdlOiBudW1iZXIpe1xyXG5cclxuICAgICAgICBsZXQgbGlmZUluZm9FbHQgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnIycgK3BsYXllci5uYW1lKyAnIC5saWZlLXZhbHVlJylbMF07XHJcbiAgICAgICAgbGV0IGRhbWFnZUVsdCA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiZGFtYWdlVG91clwiKVtpbmRpY2VQbGF5ZXJdO1xyXG4gICAgICAgIGRhbWFnZUVsdC50ZXh0Q29udGVudCA9IFN0cmluZyhcIi1cIitkYW1hZ2UpO1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBsaWZlSW5mb0VsdC5pbm5lckhUTUw9XCJcIjtcclxuICAgICAgICBsaWZlSW5mb0VsdC50ZXh0Q29udGVudCA9IFN0cmluZyhwbGF5ZXIubGlmZSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0Q29sb3JJbmZvTGlmZShwbGF5ZXIsIGluZGljZVBsYXllcik7XHJcblxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzZXRDb2xvckluZm9MaWZlKHBsYXllcjogQ2hhcmFjdGVyLCBpbmRpY2VQbGF5ZXI6IG51bWJlcil7XHJcblxyXG4gICAgICAgIGxldCBsaWZlSW5mb0VsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJsaWZlLXZhbHVlXCIpW2luZGljZVBsYXllcl07XHJcblxyXG4gICAgICAgIGlmKHBsYXllci4kYXZhdGFyTGlmZUVsdCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICBpZihwbGF5ZXIuJGF2YXRhckxpZmVFbHQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWdoLWxpZmUtbGV2ZWwnKSl7XHJcbiAgICAgICAgICAgIHBsYXllci4kYXZhdGFyTGlmZUVsdC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdoLWxpZmUtbGV2ZWwnKTsgXHJcbiAgICAgICAgfWVsc2UgaWYocGxheWVyLiRhdmF0YXJMaWZlRWx0LmNsYXNzTGlzdC5jb250YWlucygnbWVkaXVtLWxpZmUtbGV2ZWwnKSl7XHJcbiAgICAgICAgICAgIHBsYXllci4kYXZhdGFyTGlmZUVsdC5jbGFzc0xpc3QucmVtb3ZlKCdtZWRpdW0tbGlmZS1sZXZlbCcpOyBcclxuICAgICAgICB9ZWxzZSBpZihwbGF5ZXIuJGF2YXRhckxpZmVFbHQuY2xhc3NMaXN0LmNvbnRhaW5zKCdsb3ctbGlmZS1sZXZlbCcpKXtcclxuICAgICAgICAgICAgcGxheWVyLiRhdmF0YXJMaWZlRWx0LmNsYXNzTGlzdC5yZW1vdmUoJ2xvdy1saWZlLWxldmVsJyk7IFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAgICAgaWYocGxheWVyLmxpZmUgPiA3NSl7XHJcbiAgICAgICAgICAgIGxpZmVJbmZvRWx0LmNsYXNzTGlzdC5hZGQoJ2hpZ2gtbGlmZS1sZXZlbCcpO1xyXG4gICAgICAgIH1lbHNlIGlmIChwbGF5ZXIubGlmZSA+IDMwICYmIHBsYXllci5saWZlIDw9IDc1KSB7XHJcbiAgICAgICAgICAgIGxpZmVJbmZvRWx0LmNsYXNzTGlzdC5hZGQoJ21lZGl1bS1saWZlLWxldmVsJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGlmZUluZm9FbHQuY2xhc3NMaXN0LmFkZCgnbG93LWxpZmUtbGV2ZWwnKTtcclxuICAgICAgICB9IFxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB1cGRhdGVJbmZvV2VhcG9uKHBsYXllcjogQ2hhcmFjdGVyLCBpbmRpY2VQbGF5ZXI6IG51bWJlcil7XHJcbiAgICAgICAgbGV0IHdlYXBvbkluZm9FbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwid2VhcG9uLXZhbHVlXCIpW2luZGljZVBsYXllcl07XHJcblxyXG4gICAgICAgIHdlYXBvbkluZm9FbHQuaW5uZXJIVE1MPVwiXCI7XHJcbiAgICAgICAgd2VhcG9uSW5mb0VsdC50ZXh0Q29udGVudCA9IHBsYXllci53ZWFwb24ubmFtZSsgJygnK3BsYXllci53ZWFwb24uZGFtYWdlKycpJztcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgdXBkYXRlUGxheWVyVG91ck1lbnUocGxheWVyOiBDaGFyYWN0ZXIpe1xyXG4gICAgICAgIGxldCBwbGF5ZXJFbHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInBsYXllclRvdXJcIik7XHJcbiAgICAgICAgaWYocGxheWVyRWx0c1swXSAhPT0gdW5kZWZpbmVkICYmIHBsYXllckVsdHNbMF0gIT09IG51bGwpe1xyXG4gICAgICAgIHBsYXllckVsdHNbMF0uY2xhc3NMaXN0LnJlbW92ZShcInBsYXllclRvdXJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBwbGF5ZXJUb3VyRWx0ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyMnICtwbGF5ZXIubmFtZSsgJyAuYXZhdGFyLWltZycpWzBdO1xyXG4gICAgICAgIHBsYXllclRvdXJFbHQuY2xhc3NMaXN0LmFkZChcInBsYXllclRvdXJcIik7XHJcblxyXG4gICAgICAgIFxyXG5cclxuICAgIH1cclxuXHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgTWVudU1hbmFnZXI7XHJcbiIsIi8vVGhpcyBjbGFzcyBmb3IgdGhlIGZpZWxkc1xyXG5jbGFzcyBTaXplIHtcclxuICAgIC8vZmllbGQgXHJcbiAgICB4IDogbnVtYmVyO1xyXG4gICAgeSA6IG51bWJlcjtcclxuXHJcbiAgICAvL2NvbnN0cnVjdG9yIFxyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgU2l6ZTsiLCJpbXBvcnQgRmllbGQgZnJvbSBcIi4uLy4uL2ZpZWxkL21vZGVsL2ZpZWxkXCI7XHJcbmltcG9ydCBXZWFwb24gZnJvbSBcIi4uLy4uL3dlYXBvbi9tb2RlbC93ZWFwb25cIjtcclxuaW1wb3J0IENhc2UgZnJvbSBcIi4uLy4uL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5cclxuXHJcbmFic3RyYWN0IGNsYXNzIExvZ2ljV2VhcG9uIHtcclxuXHJcblxyXG4gICAgc3RhdGljIHBhaW50U3RhcnRXZWFwb24oZmllbGQ6IEZpZWxkLCB3ZWFwb246IFdlYXBvbik6IHZvaWQge1xyXG4gICAgICAgIGxldCBjYXNlV2VhcG9uID0gZmllbGQuZ2V0QXZhaWxhYmxlUmFuZG9tQ2FzZSgpO1xyXG4gICAgICAgIGxldCBpbWdXZWFwb246IEhUTUxJbWFnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGxldCBzcGFuRWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgc3BhbkVsdC5jbGFzc0xpc3QuYWRkKFwid2VhcG9uXCIpO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zcmMgPSB3ZWFwb24uaWNvblVybDtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUubWF4V2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUubWF4SGVpZ2h0ID0gXCI1MCVcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLnRvcCA9IFwiMzAlXCI7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLmxlZnQgPSBcIjBcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUuekluZGV4ID0gXCIyMFwiO1xyXG4gICAgICAgIHNwYW5FbHQuYXBwZW5kQ2hpbGQoaW1nV2VhcG9uKTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYXNlV2VhcG9uLnBvc2l0aW9uU3RyaW5nKS5hcHBlbmRDaGlsZChzcGFuRWx0KTtcclxuICAgICAgICBmaWVsZC5jYXNlc1tjYXNlV2VhcG9uLnBvc2l0aW9uLnhdW2Nhc2VXZWFwb24ucG9zaXRpb24ueV0uaXNBdmFpbGFibGUgPSBmYWxzZTtcclxuICAgICAgICBmaWVsZC5jYXNlc1tjYXNlV2VhcG9uLnBvc2l0aW9uLnhdW2Nhc2VXZWFwb24ucG9zaXRpb24ueV0ud2VhcG9uID0gd2VhcG9uO1xyXG4gICAgICAgIHdlYXBvbi4kZWwgPSBzcGFuRWx0O1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBzdGF0aWMgcGFpbnRXZWFwb24oY2FzZVdlYXBvbjogQ2FzZSwgd2VhcG9uOiBXZWFwb24sIGZpZWxkOiBGaWVsZCk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgaW1nV2VhcG9uOiBIVE1MSW1hZ2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgICAgICBsZXQgc3BhbkVsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIHNwYW5FbHQuY2xhc3NMaXN0LmFkZChcIndlYXBvblwiKTtcclxuICAgICAgICBpbWdXZWFwb24uc3JjID0gd2VhcG9uLmljb25Vcmw7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLm1heFdpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLm1heEhlaWdodCA9IFwiNTAlXCI7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS50b3AgPSBcIjMwJVwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS5sZWZ0ID0gXCIwXCI7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLnpJbmRleCA9IFwiMjBcIjtcclxuICAgICAgICBzcGFuRWx0LmFwcGVuZENoaWxkKGltZ1dlYXBvbik7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FzZVdlYXBvbi5wb3NpdGlvblN0cmluZykuYXBwZW5kQ2hpbGQoc3BhbkVsdCk7XHJcbiAgICAgICAgZmllbGQuY2FzZXNbY2FzZVdlYXBvbi5wb3NpdGlvbi54XVtjYXNlV2VhcG9uLnBvc2l0aW9uLnldLndlYXBvbiA9IHdlYXBvbjtcclxuICAgICAgICB3ZWFwb24uJGVsID0gc3BhbkVsdDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTG9naWNXZWFwb247IiwiaW1wb3J0IENhc2UgZnJvbSBcIi4uLy4uL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5cclxuLy9UaGlzIGNsYXNzIGZvciB0aGUgZmllbGRzXHJcbmNsYXNzIFdlYXBvbiB7XHJcbiAgIC8vZmllbGQgXHJcbiAgIG5hbWU6IHN0cmluZztcclxuICAgZGFtYWdlOiBudW1iZXI7XHJcbiAgIGljb25Vcmw6IHN0cmluZztcclxuICAgY2FzZTogQ2FzZTtcclxuICAgJGVsOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgIC8vY29uc3RydWN0b3IgXHJcbiAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgZGFtYWdlOiBudW1iZXIsIGljb25Vcmw6IHN0cmluZykge1xyXG4gICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICB0aGlzLmRhbWFnZSA9IGRhbWFnZTtcclxuICAgICAgdGhpcy5pY29uVXJsID0gaWNvblVybDtcclxuICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFdlYXBvbjsiLCJcclxuYWJzdHJhY3QgY2xhc3MgTG9naWNIZWxwZXIge1xyXG4gICAgc3RhdGljIGdldFJhbmRvbURpbWVuc2lvbihkaW1lbnNpb246IG51bWJlcik6IG51bWJlciB7XHJcblxyXG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkqZGltZW5zaW9uKTtcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IExvZ2ljSGVscGVyOyIsIlxyXG5pbXBvcnQgQ2FzZSBmcm9tIFwiLi9lbnRpdGllcy9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuL2VudGl0aWVzL2ZpZWxkL21vZGVsL2ZpZWxkXCI7XHJcbmltcG9ydCBMb2dpY0ZpZWxkIGZyb20gXCIuL2VudGl0aWVzL2ZpZWxkL2xvZ2ljL2xvZ2ljRmllbGRcIjtcclxuaW1wb3J0IEdhbWVNYW5hZ2VyIGZyb20gXCIuL2VudGl0aWVzL2dhbWVNYW5hZ2VyXCI7XHJcblxyXG5sZXQgZ2FtZU1hbmFnZXIgPSBuZXcgR2FtZU1hbmFnZXIoKTtcclxuZ2FtZU1hbmFnZXIuc3RhcnRHYW1lKCk7XHJcblxyXG5cclxuIl19
