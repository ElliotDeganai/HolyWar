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
        menuManager_1.default.updateInfoLife(opponent, indexOpponent);
        logger.writteDescription(opponent.name + ' received ' + tourDamage + 'pts of damages.');
        for (var _i = 0, _a = this.case.gameManager.players; _i < _a.length; _i++) {
            var player = _a[_i];
            player.defenseMode = false;
        }
        this.case.gameManager.playerTour = opponent;
        menuManager_1.default.updatePlayerTourMenu(this.case.gameManager.playerTour);
        fightManager_1.default.updatePlayerTourFightMenu(this.case.gameManager.playerTour);
        if (opponent.life === 0) {
            fightManager_1.default.endGame(opponent);
        }
    };
    Character.prototype.defense = function () {
        var _this = this;
        var opponent = this.case.gameManager.field.characters.filter(function (opponent) {
            return (opponent !== _this);
        })[0];
        this.defenseMode = true;
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
    FightManager.setFightMenu = function (gameManager) {
        var divFightMenuElt = document.createElement("div");
        divFightMenuElt.id = "fight-menu";
        var divActions = document.createElement("div");
        var textAction = document.createElement("p");
        textAction.textContent = "What will you do?";
        divActions.appendChild(textAction);
        divActions.id = 'actions';
        var avatar1 = gameManager.players[0].iconUrl;
        var imgAvatar1 = document.createElement("img");
        imgAvatar1.src = avatar1;
        imgAvatar1.style.transform = "rotateY(180deg)";
        var avatar2 = gameManager.players[1].iconUrl;
        var imgAvatar2 = document.createElement("img");
        imgAvatar2.src = avatar2;
        var divCharacters = document.createElement("div");
        divCharacters.classList.add("character-to-fight");
        var divCharacterToFight1 = document.createElement("div");
        divCharacterToFight1.classList.add("character-to-fight1");
        divCharacterToFight1.classList.add(gameManager.players[0].name);
        divCharacterToFight1.appendChild(imgAvatar1);
        var divCharacterToFight2 = document.createElement("div");
        divCharacterToFight2.classList.add("character-to-fight2");
        divCharacterToFight2.classList.add(gameManager.players[1].name);
        divCharacterToFight2.appendChild(imgAvatar2);
        var divButton = document.createElement("div");
        divButton.id = "action-button";
        var attackButton = this.setAttackButton(gameManager);
        var defenseButton = this.setDefenseButton(gameManager);
        divButton.appendChild(attackButton);
        divButton.appendChild(defenseButton);
        divCharacters.appendChild(divCharacterToFight1);
        divCharacters.appendChild(divCharacterToFight2);
        divFightMenuElt.appendChild(divCharacters);
        divFightMenuElt.appendChild(divActions);
        divFightMenuElt.appendChild(divButton);
        document.getElementById("arena").appendChild(divFightMenuElt);
        document.getElementById("fight").classList.add("fight-mode");
        var casesElements = document.getElementsByClassName('case');
        for (var _i = 0, _a = gameManager.field.cases; _i < _a.length; _i++) {
            var row = _a[_i];
            for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
                var caseToCheck = row_1[_b];
                caseToCheck.$el.classList.remove('case-reachable');
                caseToCheck.$el.removeEventListener('click', onclick);
            }
        }
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
        var attackButton = document.createElement("button");
        attackButton.textContent = "Attack";
        attackButton.id = "btnAttack";
        attackButton.onclick = function (event) {
            _this.onClickAttack(event, gameManager);
        };
        return attackButton;
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
        var defenseButton = document.createElement("button");
        defenseButton.id = "btnDefense";
        defenseButton.textContent = "Defense";
        defenseButton.onclick = function (event) {
            _this.onClickDefense(event, gameManager);
        };
        return defenseButton;
    };
    FightManager.onClickDefense = function (event, gameManager) {
        gameManager.playerTour.defense();
    };
    FightManager.endGame = function (player) {
        window.alert('The player ' + player.name + ' lost!!\nThe game will restart.');
        location.reload(true);
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
        this.setInfo(gameManager.players[0], 0);
        gameManager.players[0].$avatarLifeElt = document.querySelectorAll('#' + gameManager.players[0].name + ' .life-info')[0];
        this.setInfo(gameManager.players[1], 1);
        gameManager.players[1].$avatarLifeElt = document.querySelectorAll('#' + gameManager.players[1].name + ' .life-info')[0];
        this.updatePlayerTourMenu(gameManager.playerTour);
    };
    MenuManager.setInfo = function (player, indicePlayer) {
        switch (indicePlayer) {
            case 0:
                document.getElementsByClassName("player-info")[0].id = player.name;
                break;
            case 1:
                document.getElementsByClassName("player-info")[1].id = player.name;
                break;
        }
        var lifeInfoElt = document.querySelectorAll('#' + player.name + ' .life-info')[0];
        var divLifeElt = document.createElement("div");
        divLifeElt.textContent = String(player.life);
        divLifeElt.classList.add('life-value');
        lifeInfoElt.appendChild(divLifeElt);
        this.setColorInfoLife(player, indicePlayer);
        var weaponInfoElt = document.querySelectorAll('#' + player.name + ' .weapon-info')[0];
        var divWeaponElt = document.createElement("div");
        divWeaponElt.textContent = player.weapon.name + '(' + player.weapon.damage + ')';
        divWeaponElt.classList.add('weapon-value');
        weaponInfoElt.appendChild(divWeaponElt);
        var avatarIconElt = document.getElementsByClassName('avatar-icon');
        var divAvatarElt = document.createElement("div");
        divAvatarElt.classList.add("avatar-img");
        var avatar = player.iconUrl;
        var imgAvatar = document.createElement("img");
        imgAvatar.src = avatar;
        divAvatarElt.appendChild(imgAvatar);
        avatarIconElt[indicePlayer].appendChild(divAvatarElt);
        var nameInfoElt = document.querySelectorAll('#' + player.name + ' .player-name')[0];
        nameInfoElt.textContent = player.name;
        switch (indicePlayer) {
            case 0:
                divAvatarElt.style.left = "2%";
                divLifeElt.style.marginLeft = "5px";
                divWeaponElt.style.marginLeft = "5px";
                imgAvatar.style.transform = "rotateY(180deg)";
                break;
            case 1:
                divAvatarElt.style.right = "5%";
                divLifeElt.style.marginRight = "5px";
                divWeaponElt.style.marginRight = "5px";
                lifeInfoElt.style.flexDirection = "row-reverse";
                weaponInfoElt.style.flexDirection = "row-reverse";
                nameInfoElt.style.flexDirection = "row-reverse";
                break;
        }
    };
    MenuManager.updateInfoLife = function (player, indicePlayer) {
        var lifeInfoElt = document.querySelectorAll('#' + player.name + ' .life-value')[0];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZW50aXRpZXMvY2FzZS9sb2dpYy9jYXNlTG9naWMudHMiLCJzcmMvZW50aXRpZXMvY2FzZS9tb2RlbC9jYXNlLnRzIiwic3JjL2VudGl0aWVzL2NoYXJhY3Rlci9sb2dpYy9sb2dpY0NoYXJhY3Rlci50cyIsInNyYy9lbnRpdGllcy9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyLnRzIiwic3JjL2VudGl0aWVzL2Nvb3JkL21vZGVsL2Nvb3JkLnRzIiwic3JjL2VudGl0aWVzL2ZpZWxkL2xvZ2ljL2xvZ2ljRmllbGQudHMiLCJzcmMvZW50aXRpZXMvZmllbGQvbW9kZWwvZmllbGQudHMiLCJzcmMvZW50aXRpZXMvZmlnaHRNYW5hZ2VyLnRzIiwic3JjL2VudGl0aWVzL2dhbWVNYW5hZ2VyLnRzIiwic3JjL2VudGl0aWVzL2xvZ2dlci50cyIsInNyYy9lbnRpdGllcy9tZW51TWFuYWdlci50cyIsInNyYy9lbnRpdGllcy9zaXplL21vZGVsL3NpemUudHMiLCJzcmMvZW50aXRpZXMvd2VhcG9uL2xvZ2ljL2xvZ2ljV2VhcG9uLnRzIiwic3JjL2VudGl0aWVzL3dlYXBvbi9tb2RlbC93ZWFwb24udHMiLCJzcmMvaGVscGVycy9Mb2dpY0hlbHBlci50cyIsInNyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNHQTtJQUFBO0lBa0NBLENBQUM7SUE3Qkc7Ozs7OztPQU1HO0lBQ0ksbUJBQVMsR0FBaEIsVUFBaUIsV0FBaUI7UUFDOUIsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7UUFFbkMsUUFBUSxXQUFXLENBQUMsU0FBUyxFQUFFO1lBQzNCLEtBQUssS0FBSztnQkFDTixNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxN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QyxJQUFBO0FBRUQsa0JBQWUsV0FBVyxDQUFDOzs7O0FDTDNCLHNEQUFpRDtBQUVqRCxJQUFJLFdBQVcsR0FBRyxJQUFJLHFCQUFXLEVBQUUsQ0FBQztBQUNwQyxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgQ2FzZSBmcm9tIFwiLi4vLi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcbmltcG9ydCBGaWVsZCBmcm9tIFwiLi4vLi4vZmllbGQvbW9kZWwvZmllbGRcIjtcclxuXHJcbmFic3RyYWN0IGNsYXNzIENhc2VMb2dpYyB7XHJcblxyXG4gICAgc3RhdGljIEJMT0NLRUQ6IHN0cmluZyA9IFwiQkxPQ0tFRFwiO1xyXG4gICAgc3RhdGljIE5PUk1BTDogc3RyaW5nID0gXCJOT1JNQUxcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHBhcnR5RmllbGQgXHJcbiAgICAgKiBAcGFyYW0gbGlzdE9mQ2FzZXNUZW1wIFxyXG4gICAgICogQHBhcmFtIGVsZW1lbnRUb0ZpbGwgXHJcbiAgICAgKiBAcGFyYW0gbmJyT2ZSZW1haW5pbmdDYXNlcyBcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHBhaW50Q2FzZShjYXNlVG9QYWludDogQ2FzZSk6IEhUTUxEaXZFbGVtZW50IHtcclxuICAgICAgICBsZXQgZGl2RWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkaXZFbHQuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XHJcblxyXG4gICAgICAgIHN3aXRjaCAoY2FzZVRvUGFpbnQuaXNCbG9ja2VkKSB7XHJcbiAgICAgICAgICAgIGNhc2UgZmFsc2U6XHJcbiAgICAgICAgICAgICAgICBkaXZFbHQuY2xhc3NMaXN0LmFkZChcImNhc2VcIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgdHJ1ZTpcclxuICAgICAgICAgICAgICAgIGRpdkVsdC5jbGFzc0xpc3QuYWRkKFwiY2FzZVwiKTtcclxuICAgICAgICAgICAgICAgIGRpdkVsdC5jbGFzc0xpc3QuYWRkKFwiYmxvY2tlZFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkaXZFbHQuaWQgPSBTdHJpbmcoY2FzZVRvUGFpbnQucG9zaXRpb25TdHJpbmcpO1xyXG5cclxuICAgICAgICBjYXNlVG9QYWludC5zZXRFbChkaXZFbHQpO1xyXG4gICAgICAgIHJldHVybiBkaXZFbHQ7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENhc2VMb2dpYzsiLCJpbXBvcnQgQ2FzZUxvZ2ljIGZyb20gXCIuLi8uLi9jYXNlL2xvZ2ljL2Nhc2VMb2dpY1wiO1xyXG5pbXBvcnQgQ29vcmQgZnJvbSBcIi4uLy4uL2Nvb3JkL21vZGVsL2Nvb3JkXCI7XHJcbmltcG9ydCBXZWFwb24gZnJvbSBcIi4uLy4uL3dlYXBvbi9tb2RlbC93ZWFwb25cIjtcclxuaW1wb3J0IExvZ2ljV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbG9naWMvbG9naWNXZWFwb25cIjtcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuLi8uLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gXCIuLi8uLi9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCBHYW1lTWFuYWdlciBmcm9tIFwiLi4vLi4vZ2FtZU1hbmFnZXJcIjtcclxuXHJcbmNsYXNzIENhc2Uge1xyXG4gICAgLy9maWVsZCBcclxuICAgIGltZ1VybDogc3RyaW5nO1xyXG4gICAgaXNCbG9ja2VkOiBib29sZWFuO1xyXG4gICAgaXNBdmFpbGFibGU6IGJvb2xlYW47XHJcbiAgICBwb3NpdGlvbjogQ29vcmQ7XHJcbiAgICBwb3NpdGlvblN0cmluZzogc3RyaW5nO1xyXG4gICAgdHlwZTogc3RyaW5nO1xyXG4gICAgd2VhcG9uOiBXZWFwb247XHJcbiAgICBnYW1lTWFuYWdlcjogR2FtZU1hbmFnZXI7XHJcbiAgICAkZWw6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgIC8vY29uc3RydWN0b3IgXHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjogQ29vcmQsIHR5cGU6IHN0cmluZyA9IENhc2VMb2dpYy5OT1JNQUwsIGlzQXZhaWxhYmxlOiBib29sZWFuID0gdHJ1ZSkge1xyXG5cclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBDYXNlTG9naWMuTk9STUFMOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbWdVcmwgPSBcIi9hc3NldHMvaW1nL25vcm1hbC1maWVsZC90aWxlLTJELnBuZ1wiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc0Jsb2NrZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBDYXNlTG9naWMuQkxPQ0tFRDpcclxuICAgICAgICAgICAgICAgIHRoaXMuaW1nVXJsID0gXCIvYXNzZXRzL2ltZy9ibG9ja2VkLWZpZWxkL3RpbGUtMkQucG5nXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzQmxvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pc0F2YWlsYWJsZSA9IGlzQXZhaWxhYmxlO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uU3RyaW5nID0gU3RyaW5nKHBvc2l0aW9uLngpICsgU3RyaW5nKHBvc2l0aW9uLnkpO1xyXG4gICAgICAgIHRoaXMud2VhcG9uID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjYXNlc0FkamFjZW50KGNhc2VUb0NoZWNrOiBDYXNlKTogQm9vbGVhbntcclxuICAgICAgICBsZXQgaXNTYW1lWCA9IHRoaXMucG9zaXRpb24ueCA9PT0gY2FzZVRvQ2hlY2sucG9zaXRpb24ueDtcclxuICAgICAgICBsZXQgYWJzb2x1dGVEZWx0YVkgPSBNYXRoLmFicyh0aGlzLnBvc2l0aW9uLnktY2FzZVRvQ2hlY2sucG9zaXRpb24ueSk7XHJcbiAgICAgICAgbGV0IGlzU2FtZVkgPSB0aGlzLnBvc2l0aW9uLnkgPT09IGNhc2VUb0NoZWNrLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgbGV0IGFic29sdXRlRGVsdGFYID0gTWF0aC5hYnModGhpcy5wb3NpdGlvbi54LWNhc2VUb0NoZWNrLnBvc2l0aW9uLngpO1xyXG5cclxuICAgICAgICBpZigoaXNTYW1lWCAmJiBhYnNvbHV0ZURlbHRhWSA8PSAxKSB8fCAoaXNTYW1lWSAmJiBhYnNvbHV0ZURlbHRhWCA8PSAxKSl7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhc1dlYXBvbigpe1xyXG4gICAgICAgIGlmKHRoaXMud2VhcG9uICE9PSBudWxsKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW1vdmVXZWFwb24oKXtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLndlYXBvbi4kZWwucmVtb3ZlKCk7XHJcbiAgICAgICAgdGhpcy53ZWFwb24gPSBudWxsO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhZGRXZWFwb24oZmllbGQ6IEZpZWxkLCB3ZWFwb246IFdlYXBvbil7XHJcbiAgICAgICAgdGhpcy53ZWFwb24gPSB3ZWFwb247XHJcbiAgICAgICAgTG9naWNXZWFwb24ucGFpbnRXZWFwb24odGhpcywgd2VhcG9uLCBmaWVsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RWwoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgICAgdGhpcy4kZWwgPSBlbGVtZW50O1xyXG5cclxuICAgICAgICB0aGlzLiRlbC5vbmNsaWNrID0gKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMub25DbGljayhldmVudCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJGVsO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lke1xyXG4gXHJcbiAgICAgICAgICAgIGxldCBjYXNlc0VsZW1lbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2FzZScpO1xyXG4gICAgICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmdhbWVNYW5hZ2VyLmZpZWxkO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYXNlc0VsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FzZXNFbGVtZW50ID0gKDxIVE1MRWxlbWVudD5jYXNlc0VsZW1lbnRzW2ldKTtcclxuICAgICAgICAgICAgICAgIGNhc2VzRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjYXNlLXJlYWNoYWJsZScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgY2FzZVRvR28gPSBmaWVsZC5jYXNlc1t0aGlzLnBvc2l0aW9uLnhdW3RoaXMucG9zaXRpb24ueV07XHJcblxyXG4gICAgICAgICAgICAvLyBEbyBub3RoaW5nIGlmIHBsYXllciBzZWxlY3QgYSBCbG9jayBDYXNlXHJcbiAgICAgICAgICAgIGlmIChjYXNlVG9Hby5pc0Jsb2NrZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZU1hbmFnZXIuc2hvd1JlYWNoYWJsZUNhc2UoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL3dlIGdldCB0aGUgZWxlbWVudCB0YXJnZXRcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZU1hbmFnZXIucGxheWVyVG91ci5tb3ZlVG8odGhpcy5nYW1lTWFuYWdlci5maWVsZCwgY2FzZVRvR28pO1xyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZU1hbmFnZXIuc2hvd1JlYWNoYWJsZUNhc2UoKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBDYXNlOyIsIlxyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4uLy4uL2ZpZWxkL21vZGVsL2ZpZWxkXCI7XHJcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4uLy4uL2NoYXJhY3Rlci9tb2RlbC9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IENhc2UgZnJvbSBcIi4uLy4uL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgQ29vcmQgZnJvbSBcIi4uLy4uL2Nvb3JkL21vZGVsL2Nvb3JkXCI7XHJcbmltcG9ydCBHYW1lTWFuYWdlciBmcm9tIFwiLi4vLi4vZ2FtZU1hbmFnZXJcIjtcclxuXHJcbmFic3RyYWN0IGNsYXNzIExvZ2ljQ2hhcmFjdGVyIHtcclxuXHJcbiAgICBzdGF0aWMgcGFpbnRTdGFydENoYXJhY3RlcnMoZmllbGQ6IEZpZWxkLCBuYW1lQ2hhcmFjdGVyOiBzdHJpbmcsIGljb25Vcmw6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGxldCBwbGF5ZXIgPSBuZXcgQ2hhcmFjdGVyKG5hbWVDaGFyYWN0ZXIsIGljb25VcmwsIGZpZWxkLmdldEF2YWlsYWJsZVJhbmRvbUNhc2UoKSk7XHJcblxyXG4gICAgICAgIGxldCBuZXh0UGxheWVyID0gZmllbGQuY2hhcmFjdGVycy5maWx0ZXIoKG5leHRQbGF5ZXIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIChuZXh0UGxheWVyICE9PSBwbGF5ZXIpO1xyXG4gICAgICAgICAgfSlbMF07XHJcblxyXG5cclxuICAgICAgICBcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBmaWVsZC5jaGFyYWN0ZXJzWzBdICE9PSAndW5kZWZpbmVkJykge1xyXG5cclxuICAgICAgICAgICAgd2hpbGUoZmllbGQuY2hhcmFjdGVyc1swXS5jYXNlLmNhc2VzQWRqYWNlbnQocGxheWVyLmNhc2UpIHx8IHBsYXllci5pc0Nsb3NlZENhc2VzQmxvY2tlZCgpKXtcclxuICAgICAgICAgICAgICAgIHBsYXllciA9IG5ldyBDaGFyYWN0ZXIobmFtZUNoYXJhY3RlciwgaWNvblVybCwgZmllbGQuZ2V0QXZhaWxhYmxlUmFuZG9tQ2FzZSgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgZmllbGQuY2FzZXNbcGxheWVyLmNhc2UucG9zaXRpb24ueF1bcGxheWVyLmNhc2UucG9zaXRpb24ueV0uaXNBdmFpbGFibGUgPSBmYWxzZTtcclxuICAgICAgICBsZXQgaW1nQ2hhcjogSFRNTEltYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgbGV0IHNwYW5FbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuXHJcbiAgICAgICAgc3BhbkVsdC5jbGFzc0xpc3QuYWRkKFwiY2hhclwiKTtcclxuICAgICAgICBpbWdDaGFyLnNyYyA9IHBsYXllci5pY29uVXJsO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUubWF4V2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLm1heEhlaWdodCA9IChNYXRoLnJvdW5kKDEwMCAvIGZpZWxkLnNpemUueCkpKyBcIiVcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUuekluZGV4ID0gXCI1MFwiO1xyXG4gICAgICAgIGxldCBwbGF5ZXJEaXZFbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpZ2h0XCIpO1xyXG4gICAgICAgIHBsYXllckRpdkVsdC5hcHBlbmRDaGlsZChpbWdDaGFyKTtcclxuICAgICAgICBwbGF5ZXIuJGVsID0gaW1nQ2hhcjtcclxuICAgICAgICBpbWdDaGFyLmNsYXNzTGlzdC5hZGQoXCJwbGF5ZXJcIik7XHJcbiAgICAgICAgdGhpcy5zZXRBYnNvbHV0ZVBvc2l0aW9uKHBsYXllcik7XHJcblxyXG4gICAgICAgIHBsYXllci4kZWwuc3R5bGUubGVmdCA9IHBsYXllci5hYnNvbHV0ZUNvb3JkLnkgKyAncHgnO1xyXG4gICAgICAgIHBsYXllci4kZWwuc3R5bGUudG9wID0gcGxheWVyLmFic29sdXRlQ29vcmQueCArICdweCc7XHJcblxyXG4gICAgICAgIGZpZWxkLmNoYXJhY3RlcnMucHVzaChwbGF5ZXIpO1xyXG4gICAgICAgIHBsYXllci5jYXNlLmdhbWVNYW5hZ2VyLnBsYXllcnMucHVzaChwbGF5ZXIpO1xyXG5cclxuICAgICAgICBpZihwbGF5ZXIuY2FzZS5nYW1lTWFuYWdlci5wbGF5ZXJzLmxlbmd0aCA9PT0gMil7XHJcbiAgICAgICAgICAgIGlmKHBsYXllci5jYXNlLnBvc2l0aW9uLnkgPCBuZXh0UGxheWVyLmNhc2UucG9zaXRpb24ueSl7XHJcbiAgICAgICAgICAgICAgICBMb2dpY0NoYXJhY3Rlci5mYWNlT3Bwb25lbnQocGxheWVyKTtcclxuICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIExvZ2ljQ2hhcmFjdGVyLmZhY2VPcHBvbmVudChuZXh0UGxheWVyKTsgIFxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9IFxyXG5cclxuICAgIHN0YXRpYyBwYWludENoYXJhY3RlcnMoZmllbGQ6IEZpZWxkLCBwbGF5ZXI6IENoYXJhY3RlciwgY2FzZVBsYXllcjogQ2FzZSk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgaW1nQ2hhcjogSFRNTEltYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgbGV0IHNwYW5FbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuXHJcbiAgICAgICAgc3BhbkVsdC5jbGFzc0xpc3QuYWRkKFwiY2hhclwiKTtcclxuICAgICAgICBpbWdDaGFyLnNyYyA9IHBsYXllci5pY29uVXJsO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUubWF4V2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLm1heEhlaWdodCA9IFwiNzUlXCI7XHJcbiAgICAgICAgaW1nQ2hhci5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLnRvcCA9IFwiMFwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUubGVmdCA9IFwiMFwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUuekluZGV4ID0gXCI1MFwiO1xyXG4gICAgICAgIGltZ0NoYXIuY2xhc3NMaXN0LmFkZChcInBsYXllclwiKTtcclxuICAgICAgICBzcGFuRWx0LmFwcGVuZENoaWxkKGltZ0NoYXIpO1xyXG4gICAgICAgIGxldCBwbGF5ZXJEaXZFbHQgPSBwbGF5ZXIuY2FzZS4kZWw7XHJcbiAgICAgICAgcGxheWVyRGl2RWx0LmFwcGVuZENoaWxkKHNwYW5FbHQpO1xyXG4gICAgICAgIHBsYXllci4kZWwgPSBzcGFuRWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjaGFyYWN0ZXJBbmltYXRpb24ocGxheWVyOiBDaGFyYWN0ZXIsIG5ld0Nvb3JkOiBDb29yZCl7XHJcblxyXG4gICAgICAgIHBsYXllci4kZWwuc3R5bGUubGVmdCA9IG5ld0Nvb3JkLnkgKyAncHgnO1xyXG4gICAgICAgIHBsYXllci4kZWwuc3R5bGUudG9wID0gbmV3Q29vcmQueCArICdweCc7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBmYWNlT3Bwb25lbnQocGxheWVyOiBDaGFyYWN0ZXIpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHBsYXllcik7XHJcbiAgICAgICAgcGxheWVyLiRlbC5zdHlsZS50cmFuc2Zvcm0gPSBcInJvdGF0ZVkoMTgwZGVnKVwiO1xyXG4gICAgICAgIGlmKHBsYXllci5kaXJlY3Rpb24gPT09ICdsZWZ0Jyl7XHJcbiAgICAgICAgICAgIHBsYXllci5kaXJlY3Rpb24gPSAncmlnaHQnO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBwbGF5ZXIuZGlyZWN0aW9uID0gJ2xlZnQnOyBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGNoZWNrUGxheWVyRGlyZWN0aW9uKGdhbWVNYW5hZ2VyOiBHYW1lTWFuYWdlcil7XHJcbiAgICAgICAgbGV0IHBsYXllckxlZnQgPSBnYW1lTWFuYWdlci5wbGF5ZXJzLmZpbHRlcigocGxheWVyTGVmdCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKHBsYXllckxlZnQuZGlyZWN0aW9uID09PSAncmlnaHQnKTtcclxuICAgICAgICAgIH0pWzBdO1xyXG5cclxuICAgICAgICAgIGxldCBwbGF5ZXJSaWdodCA9IGdhbWVNYW5hZ2VyLnBsYXllcnMuZmlsdGVyKChwbGF5ZXJSaWdodCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKHBsYXllclJpZ2h0LmRpcmVjdGlvbiA9PT0gJ2xlZnQnKTtcclxuICAgICAgICAgIH0pWzBdO1xyXG5cclxuICAgICAgICAgIGlmKHBsYXllckxlZnQuY2FzZS5wb3NpdGlvbi55ID4gcGxheWVyUmlnaHQuY2FzZS5wb3NpdGlvbi55KXtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwbGF5ZXJMZWZ0KTtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwbGF5ZXJSaWdodCk7XHJcbiAgICAgICAgICAgIHRoaXMuZmFjZU9wcG9uZW50KHBsYXllckxlZnQpO1xyXG4gICAgICAgICAgICB0aGlzLmZhY2VPcHBvbmVudChwbGF5ZXJSaWdodCk7XHJcbiAgICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNldEFic29sdXRlUG9zaXRpb24ocGxheWVyOiBDaGFyYWN0ZXIpe1xyXG4gICAgICAgIGxldCBhYnNvbHV0ZVggPSBwbGF5ZXIuY2FzZS5wb3NpdGlvbi54KnBsYXllci5jYXNlLiRlbC5vZmZzZXRIZWlnaHQ7XHJcbiAgICAgICAgbGV0IGFic29sdXRlWSA9IHBsYXllci5jYXNlLnBvc2l0aW9uLnkqcGxheWVyLmNhc2UuJGVsLm9mZnNldFdpZHRoO1xyXG4gICAgICAgIGxldCBhYnNvbHV0ZVBvc2l0aW9uUGxheWVyID0gbmV3IENvb3JkKGFic29sdXRlWCwgYWJzb2x1dGVZKTtcclxuICAgICAgICBwbGF5ZXIuYWJzb2x1dGVDb29yZCA9IGFic29sdXRlUG9zaXRpb25QbGF5ZXI7IFxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTG9naWNDaGFyYWN0ZXI7IiwiaW1wb3J0IENhc2UgZnJvbSBcIi4uLy4uL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbW9kZWwvd2VhcG9uXCI7XHJcbmltcG9ydCBMb2dpY1dlYXBvbiBmcm9tIFwiLi4vLi4vd2VhcG9uL2xvZ2ljL2xvZ2ljV2VhcG9uXCI7XHJcbmltcG9ydCBGaWVsZCBmcm9tIFwiLi4vLi4vZmllbGQvbW9kZWwvZmllbGRcIjtcclxuaW1wb3J0IExvZ2ljQ2hhcmFjdGVyIGZyb20gXCIuLi9sb2dpYy9sb2dpY0NoYXJhY3RlclwiO1xyXG5pbXBvcnQgQ29vcmQgZnJvbSBcIi4uLy4uL2Nvb3JkL21vZGVsL2Nvb3JkXCI7XHJcbmltcG9ydCBNZW51TWFuYWdlciBmcm9tIFwiLi4vLi4vbWVudU1hbmFnZXJcIjtcclxuaW1wb3J0IExvZ2dlciBmcm9tIFwiLi4vLi4vbG9nZ2VyXCI7XHJcbmltcG9ydCBGaWdodE1hbmFnZXIgZnJvbSBcIi4uLy4uL2ZpZ2h0TWFuYWdlclwiO1xyXG5cclxuLy9UaGlzIGNsYXNzIGZvciB0aGUgZmllbGRzXHJcbmNsYXNzIENoYXJhY3RlciB7XHJcbiAgIC8vZmllbGQgXHJcbiAgIG5hbWU6IHN0cmluZztcclxuICAgaWNvblVybDogc3RyaW5nO1xyXG4gICBsaWZlOiBudW1iZXI7XHJcbiAgIGxldmVsOiBudW1iZXI7XHJcbiAgIGNhc2U6IENhc2U7XHJcbiAgIGNsb3NlZENhc2VzOiBBcnJheTxDYXNlPjtcclxuICAgd2VhcG9uOiBXZWFwb247XHJcbiAgIGFic29sdXRlQ29vcmQ6IENvb3JkO1xyXG4gICAkZWw6IEhUTUxFbGVtZW50O1xyXG4gICAkYXZhdGFyRWx0OiBIVE1MRWxlbWVudDsgXHJcbiAgICRhdmF0YXJMaWZlRWx0OiBFbGVtZW50O1xyXG4gICAkYXZhdGFyV2VhcG9uRWx0OiBIVE1MRWxlbWVudDtcclxuICAgZGVmZW5zZU1vZGU6IGJvb2xlYW47XHJcbiAgIGRpcmVjdGlvbjogc3RyaW5nO1xyXG5cclxuICAgLy9jb25zdHJ1Y3RvciBcclxuICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBpY29uVXJsOiBzdHJpbmcsIHN0YXJ0Q2FzZTogQ2FzZSkge1xyXG4gICAgICB0aGlzLmxpZmUgPSAxMDA7XHJcbiAgICAgIHRoaXMubGV2ZWwgPSA1O1xyXG4gICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICB0aGlzLmljb25VcmwgPSBpY29uVXJsO1xyXG4gICAgICB0aGlzLmNhc2UgPSBzdGFydENhc2U7XHJcbiAgICAgIHRoaXMuY2xvc2VkQ2FzZXMgPSB0aGlzLmdldENsb3NlZENhc2VzKCk7XHJcbiAgICAgIHRoaXMud2VhcG9uID0gbmV3IFdlYXBvbihcIlJlZ3VsYXJcIiwgMTAsIFwiL2Fzc2V0cy9pbWcvd2VhcG9uL3dlYXBvbjIucG5nXCIpO1xyXG4gICAgICB0aGlzLmRlZmVuc2VNb2RlID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuZGlyZWN0aW9uID0gXCJsZWZ0XCI7XHJcblxyXG4gICB9XHJcblxyXG4gICB0YWtlV2VhcG9uKGNhc2VXZWFwb246IENhc2UsIGZpZWxkOiBGaWVsZCl7XHJcbiAgICAgIGxldCB3ZWFwb25Ub0Ryb3AgPSB0aGlzLndlYXBvbjtcclxuICAgICAgdGhpcy53ZWFwb24gPSBjYXNlV2VhcG9uLndlYXBvbjtcclxuICAgICAgY2FzZVdlYXBvbi5yZW1vdmVXZWFwb24oKTtcclxuICAgICAgZmllbGQuY2FzZXNbY2FzZVdlYXBvbi5wb3NpdGlvbi54XVtjYXNlV2VhcG9uLnBvc2l0aW9uLnldLndlYXBvbiA9IHdlYXBvblRvRHJvcDtcclxuICAgICAgXHJcbiAgICAgIC8vTG9naWNXZWFwb24ucGFpbnRXZWFwb24oY2FzZVdlYXBvbiwgd2VhcG9uVG9Ecm9wLCBmaWVsZCk7XHJcbiAgIH1cclxuXHJcbiAgIGlzV2F5QmxvY2tlZChjYXNlVG9SZWFjaDogQ2FzZSwgZmllbGQ6IEZpZWxkKTogQm9vbGVhbntcclxuICAgICAgbGV0IGJsb2NrZWQgPSBmYWxzZTtcclxuICAgICAgaWYodGhpcy5jYXNlLnBvc2l0aW9uLnggPT09IGNhc2VUb1JlYWNoLnBvc2l0aW9uLngpe1xyXG4gICAgICAgICBsZXQgeCA9IHRoaXMuY2FzZS5wb3NpdGlvbi54O1xyXG4gICAgICAgICBsZXQgeUluaXQgPSAwO1xyXG4gICAgICAgICBpZih0aGlzLmNhc2UucG9zaXRpb24ueSA8IGNhc2VUb1JlYWNoLnBvc2l0aW9uLnkpe1xyXG4gICAgICAgICB5SW5pdCA9IHRoaXMuY2FzZS5wb3NpdGlvbi55KzE7XHJcbiAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB5SW5pdCA9IGNhc2VUb1JlYWNoLnBvc2l0aW9uLnkrMTsgXHJcbiAgICAgICAgIH1cclxuICAgICAgICAgIGxldCBkZWx0YVkgPSBNYXRoLmFicyh0aGlzLmNhc2UucG9zaXRpb24ueSAtIGNhc2VUb1JlYWNoLnBvc2l0aW9uLnkpO1xyXG4gICAgICAgICAgZm9yKGxldCByb3cgPSAwOyByb3cgPCBkZWx0YVk7IHJvdysrKXtcclxuICAgICAgICAgICAgIGlmKGZpZWxkLmNhc2VzW3hdW3lJbml0K3Jvd10uaXNCbG9ja2VkID09PSB0cnVlKXtcclxuICAgICAgICAgICAgICAgIGJsb2NrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgIH1cclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgIGxldCB4SW5pdCA9IDA7XHJcbiAgICAgICAgIGxldCB5ID0gdGhpcy5jYXNlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgIGlmKHRoaXMuY2FzZS5wb3NpdGlvbi54IDwgY2FzZVRvUmVhY2gucG9zaXRpb24ueCl7XHJcbiAgICAgICAgICAgIHhJbml0ID0gdGhpcy5jYXNlLnBvc2l0aW9uLngrMTtcclxuICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHhJbml0ID0gY2FzZVRvUmVhY2gucG9zaXRpb24ueCsxOyBcclxuICAgICAgICAgfVxyXG4gICAgICAgICAgbGV0IGRlbHRhWCA9IE1hdGguYWJzKHRoaXMuY2FzZS5wb3NpdGlvbi54IC0gY2FzZVRvUmVhY2gucG9zaXRpb24ueCk7XHJcbiAgICAgICAgICBmb3IobGV0IGNvbCA9IDA7IGNvbCA8IGRlbHRhWDsgY29sKyspe1xyXG4gICAgICAgICAgICAgaWYoZmllbGQuY2FzZXNbeEluaXQrY29sXVt5XS5pc0Jsb2NrZWQgPT09IHRydWUpe1xyXG4gICAgICAgICAgICAgICAgYmxvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmKGJsb2NrZWQgPT09IHRydWUpe1xyXG4gICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgaXNDYXNlUmVhY2hhYmxlKGNhc2VUb1JlYWNoOiBDYXNlLCBmaWVsZDogRmllbGQpe1xyXG4gICAgICBsZXQgZGVsdGFYID0gTWF0aC5hYnMoY2FzZVRvUmVhY2gucG9zaXRpb24ueCAtIHRoaXMuY2FzZS5wb3NpdGlvbi54KTtcclxuICAgICAgbGV0IGRlbHRhWSA9IE1hdGguYWJzKGNhc2VUb1JlYWNoLnBvc2l0aW9uLnkgLSB0aGlzLmNhc2UucG9zaXRpb24ueSk7XHJcbiAgICAgIGlmKCBkZWx0YVggPD0gMyAmJiAgZGVsdGFZIDw9IDMgKXtcclxuICAgICAgICAgaWYoY2FzZVRvUmVhY2gucG9zaXRpb24ueCA9PT0gdGhpcy5jYXNlLnBvc2l0aW9uLnggfHwgY2FzZVRvUmVhY2gucG9zaXRpb24ueSA9PT0gdGhpcy5jYXNlLnBvc2l0aW9uLnkpe1xyXG4gICAgICAgICBpZighY2FzZVRvUmVhY2guaXNCbG9ja2VkICYmICF0aGlzLmlzV2F5QmxvY2tlZChjYXNlVG9SZWFjaCwgZmllbGQpKXtcclxuICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgfVxyXG5cclxuICAgZ2V0Q2xvc2VkQ2FzZXMoKTogQXJyYXk8Q2FzZT57XHJcbiAgICAgIGxldCBjbG9zZWRDYXNlcyA9IEFycmF5PENhc2U+KCk7XHJcbiAgICAgIGxldCBzaXplWCA9IHRoaXMuY2FzZS5nYW1lTWFuYWdlci5maWVsZC5zaXplLng7XHJcbiAgICAgIGxldCBzaXplWSA9IHRoaXMuY2FzZS5nYW1lTWFuYWdlci5maWVsZC5zaXplLnk7XHJcbiAgICAgIGxldCBmaWVsZCA9IHRoaXMuY2FzZS5nYW1lTWFuYWdlci5maWVsZDtcclxuXHJcbiAgICAgIGZvcihsZXQgY29sID0gMDsgY29sIDwgc2l6ZVg7IGNvbCsrKXtcclxuICAgICAgICAgZm9yKGxldCByb3cgPSAwOyByb3cgPCBzaXplWTsgcm93Kyspe1xyXG4gICAgICAgICAgICBpZih0aGlzLmNhc2UuY2FzZXNBZGphY2VudChmaWVsZC5jYXNlc1tjb2xdW3Jvd10pKXtcclxuICAgICAgICAgICAgICAgY2xvc2VkQ2FzZXMucHVzaChmaWVsZC5jYXNlc1tjb2xdW3Jvd10pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY2xvc2VkQ2FzZXM7XHJcbiAgIH1cclxuXHJcbiAgIGlzQ2xvc2VkQ2FzZXNCbG9ja2VkKCk6IEJvb2xlYW57XHJcbiAgICAgIGxldCBhbGxCbG9ja2VkID0gdHJ1ZTtcclxuICAgICAgZm9yKGxldCBjYXNlVG9DaGVjayBvZiB0aGlzLmNsb3NlZENhc2VzKXtcclxuICAgICAgICAgaWYoIWNhc2VUb0NoZWNrLmlzQmxvY2tlZCl7XHJcbiAgICAgICAgICAgIGFsbEJsb2NrZWQgPSBmYWxzZTtcclxuICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBhbGxCbG9ja2VkO1xyXG4gICB9XHJcblxyXG4gICBtb3ZlVG8oZmllbGQ6IEZpZWxkLCBjYXNlVG9Nb3ZlOiBDYXNlKXtcclxuICAgICAgbGV0IGNoYW5nZWRXZWFwb24gPSBmYWxzZTtcclxuICAgICAgbGV0IGNhc2VGcm9tID0gdGhpcy5jYXNlO1xyXG4gICAgICBsZXQgcHJldmlvdXNXZWFwb24gPSB0aGlzLndlYXBvbjtcclxuICAgICAgbGV0IGxvZ2dlciA9IHRoaXMuY2FzZS5nYW1lTWFuYWdlci5sb2dnZXI7XHJcbiAgICAgIGlmKHRoaXMuaXNDYXNlUmVhY2hhYmxlKGNhc2VUb01vdmUsIGZpZWxkKSl7XHJcblxyXG4gICAgICAgICBsZXQgbmV4dFBsYXllckFycmF5ID0gZmllbGQuY2hhcmFjdGVycy5maWx0ZXIoKG5leHRQbGF5ZXIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIChuZXh0UGxheWVyICE9PSB0aGlzLmNhc2UuZ2FtZU1hbmFnZXIucGxheWVyVG91cik7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBsZXQgbmV4dFBsYXllciA9IG5leHRQbGF5ZXJBcnJheVswXTtcclxuICAgICAgICAgXHJcbiAgICAgIHRoaXMuY2FzZSA9IGNhc2VUb01vdmU7XHJcbiAgICAgIHRoaXMuY2xvc2VkQ2FzZXMgPSB0aGlzLmdldENsb3NlZENhc2VzKCk7XHJcbiAgICAgIGlmKGNhc2VUb01vdmUuaGFzV2VhcG9uKCkpe1xyXG4gICAgICAgICB0aGlzLnRha2VXZWFwb24odGhpcy5jYXNlLCBmaWVsZCk7XHJcbiAgICAgICAgIGNoYW5nZWRXZWFwb24gPSB0cnVlO1xyXG4gICAgICAgICBsb2dnZXIud3JpdHRlRGVzY3JpcHRpb24oJ1RoZSBwbGF5ZXIgJyArIHRoaXMuY2FzZS5nYW1lTWFuYWdlci5wbGF5ZXJUb3VyLm5hbWUgKyAnIGxldCB0aGUgd2VhcG9uICcrIGNhc2VUb01vdmUud2VhcG9uLm5hbWUgKycgdG8gdGFrZSB0aGUgd2VhcG9uICcgKyB0aGlzLndlYXBvbi5uYW1lICsnLicpO1xyXG4gICAgICAgICBjb25zb2xlLmxvZygnVGhlIHBsYXllciAnICsgdGhpcy5jYXNlLmdhbWVNYW5hZ2VyLnBsYXllclRvdXIubmFtZSArICcgbGV0IHRoZSB3ZWFwb24gJysgY2FzZVRvTW92ZS53ZWFwb24ubmFtZSArJyB0byB0YWtlIHRoZSB3ZWFwb24gJyArIHRoaXMud2VhcG9uLm5hbWUgKycuJyk7XHJcbiAgICAgICAgIE1lbnVNYW5hZ2VyLnVwZGF0ZUluZm9XZWFwb24odGhpcywgdGhpcy5jYXNlLmdhbWVNYW5hZ2VyLnBsYXllcnMuaW5kZXhPZih0aGlzKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGxldCBjb25kaXRpb24xID0gdGhpcy5jYXNlLnBvc2l0aW9uLnkgPCBuZXh0UGxheWVyLmNhc2UucG9zaXRpb24ueSAmJiBjYXNlRnJvbS5wb3NpdGlvbi55ID4gbmV4dFBsYXllci5jYXNlLnBvc2l0aW9uLnk7XHJcbiAgICAgIC8vIGxldCBjb25kaXRpb24yID0gdGhpcy5jYXNlLnBvc2l0aW9uLnkgPiBuZXh0UGxheWVyLmNhc2UucG9zaXRpb24ueSAmJiBjYXNlRnJvbS5wb3NpdGlvbi55IDwgbmV4dFBsYXllci5jYXNlLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICAgICAgTG9naWNDaGFyYWN0ZXIuc2V0QWJzb2x1dGVQb3NpdGlvbih0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIExvZ2ljQ2hhcmFjdGVyLmNoZWNrUGxheWVyRGlyZWN0aW9uKHRoaXMuY2FzZS5nYW1lTWFuYWdlcik7XHJcblxyXG5cclxuICAgICAgICAgIExvZ2ljQ2hhcmFjdGVyLmNoYXJhY3RlckFuaW1hdGlvbih0aGlzLCB0aGlzLmFic29sdXRlQ29vcmQpO1xyXG4gICAgICAgICAgTG9naWNDaGFyYWN0ZXIuY2hlY2tQbGF5ZXJEaXJlY3Rpb24odGhpcy5jYXNlLmdhbWVNYW5hZ2VyKTtcclxuICAgICAgICAgaWYoY2hhbmdlZFdlYXBvbil7XHJcbiAgICAgICAgICAgIExvZ2ljV2VhcG9uLnBhaW50V2VhcG9uKGZpZWxkLmNhc2VzW2Nhc2VGcm9tLnBvc2l0aW9uLnhdW2Nhc2VGcm9tLnBvc2l0aW9uLnldLCBwcmV2aW91c1dlYXBvbiwgZmllbGQpO1xyXG4gICAgICAgICB9XHJcblxyXG5cclxuICAgICAgdGhpcy5jYXNlLmdhbWVNYW5hZ2VyLnBsYXllclRvdXIgPSBuZXh0UGxheWVyO1xyXG4gICAgICBNZW51TWFuYWdlci51cGRhdGVQbGF5ZXJUb3VyTWVudSh0aGlzLmNhc2UuZ2FtZU1hbmFnZXIucGxheWVyVG91cik7XHJcbiAgICAgIGxvZ2dlci53cml0dGVEZXNjcmlwdGlvbignVGhlIHBsYXllciAnICsgdGhpcy5jYXNlLmdhbWVNYW5hZ2VyLnBsYXllclRvdXIubmFtZSArICcgY2FuIHBsYXkuJyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdUaGUgcGxheWVyICcgKyB0aGlzLmNhc2UuZ2FtZU1hbmFnZXIucGxheWVyVG91ci5uYW1lICsgJyBjYW4gcGxheS4nKTtcclxuXHJcbiAgICAgIGlmKHRoaXMuY2FzZS5jYXNlc0FkamFjZW50KG5leHRQbGF5ZXIuY2FzZSkpe1xyXG4gICAgICBGaWdodE1hbmFnZXIuc2V0RmlnaHRNZW51KHRoaXMuY2FzZS5nYW1lTWFuYWdlcik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgICBsb2dnZXIud3JpdHRlRGVzY3JpcHRpb24oXCJUaGlzIHBsYWNlIGlzIHVucmVhY2hhYmxlISFcIik7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhpcyBwbGFjZSBpcyB1bnJlYWNoYWJsZSEhXCIpO1xyXG4gICAgICB9XHJcbiAgIH1cclxuICAgXHJcbiAgIGF0dGFjaygpe1xyXG4gICAgICBsZXQgbG9nZ2VyID0gbmV3IExvZ2dlcigpO1xyXG4gICAgICBsZXQgdG91ckRhbWFnZSA9IDA7XHJcbiAgICAgIGxldCBvcHBvbmVudCA9IHRoaXMuY2FzZS5nYW1lTWFuYWdlci5maWVsZC5jaGFyYWN0ZXJzLmZpbHRlcigob3Bwb25lbnQpID0+IHtcclxuICAgICAgICAgcmV0dXJuIChvcHBvbmVudCAhPT0gdGhpcyk7XHJcbiAgICAgICB9KVswXTtcclxuXHJcbiAgICAgICBsZXQgaW5kZXhPcHBvbmVudCA9IHRoaXMuY2FzZS5nYW1lTWFuYWdlci5maWVsZC5jaGFyYWN0ZXJzLmluZGV4T2Yob3Bwb25lbnQpO1xyXG5cclxuICAgICAgIGlmKG9wcG9uZW50LmRlZmVuc2VNb2RlID09PSB0cnVlKXtcclxuICAgICAgICAgIHRvdXJEYW1hZ2UgPSBNYXRoLnJvdW5kKCh0aGlzLndlYXBvbi5kYW1hZ2UpLzIpO1xyXG4gICAgICAgfWVsc2V7XHJcbiAgICAgICAgIHRvdXJEYW1hZ2UgPSB0aGlzLndlYXBvbi5kYW1hZ2U7XHJcbiAgICAgICB9XHJcbiAgICAgICBvcHBvbmVudC5saWZlID0gb3Bwb25lbnQubGlmZSAtIHRvdXJEYW1hZ2U7XHJcbiAgICAgICBpZihvcHBvbmVudC5saWZlIDwgMCl7XHJcbiAgICAgICAgIG9wcG9uZW50LmxpZmUgPSAwO1xyXG4gICAgICAgfVxyXG4gICAgICAgTWVudU1hbmFnZXIudXBkYXRlSW5mb0xpZmUob3Bwb25lbnQsIGluZGV4T3Bwb25lbnQpO1xyXG4gICAgICAgbG9nZ2VyLndyaXR0ZURlc2NyaXB0aW9uKG9wcG9uZW50Lm5hbWUgKyAnIHJlY2VpdmVkICcgKyB0b3VyRGFtYWdlICsgJ3B0cyBvZiBkYW1hZ2VzLicpO1xyXG5cclxuICAgICAgIGZvcihsZXQgcGxheWVyIG9mIHRoaXMuY2FzZS5nYW1lTWFuYWdlci5wbGF5ZXJzKXtcclxuICAgICAgICAgIHBsYXllci5kZWZlbnNlTW9kZSA9IGZhbHNlO1xyXG4gICAgICAgfVxyXG5cclxuICAgICAgIHRoaXMuY2FzZS5nYW1lTWFuYWdlci5wbGF5ZXJUb3VyID0gb3Bwb25lbnQ7XHJcbiAgICAgICBNZW51TWFuYWdlci51cGRhdGVQbGF5ZXJUb3VyTWVudSh0aGlzLmNhc2UuZ2FtZU1hbmFnZXIucGxheWVyVG91cik7XHJcblxyXG4gICAgICAgRmlnaHRNYW5hZ2VyLnVwZGF0ZVBsYXllclRvdXJGaWdodE1lbnUodGhpcy5jYXNlLmdhbWVNYW5hZ2VyLnBsYXllclRvdXIpO1xyXG5cclxuICAgICAgIGlmKG9wcG9uZW50LmxpZmUgPT09IDApe1xyXG4gICAgICAgICBGaWdodE1hbmFnZXIuZW5kR2FtZShvcHBvbmVudCk7XHJcbiAgICAgIH1cclxuICAgfVxyXG5cclxuICAgZGVmZW5zZSgpe1xyXG5cclxuICAgICAgbGV0IG9wcG9uZW50ID0gdGhpcy5jYXNlLmdhbWVNYW5hZ2VyLmZpZWxkLmNoYXJhY3RlcnMuZmlsdGVyKChvcHBvbmVudCkgPT4ge1xyXG4gICAgICAgICByZXR1cm4gKG9wcG9uZW50ICE9PSB0aGlzKTtcclxuICAgICAgIH0pWzBdO1xyXG5cclxuICAgICAgdGhpcy5kZWZlbnNlTW9kZSA9IHRydWU7XHJcblxyXG4gICAgICB0aGlzLmNhc2UuZ2FtZU1hbmFnZXIucGxheWVyVG91ciA9IG9wcG9uZW50O1xyXG4gICAgICBNZW51TWFuYWdlci51cGRhdGVQbGF5ZXJUb3VyTWVudSh0aGlzLmNhc2UuZ2FtZU1hbmFnZXIucGxheWVyVG91cik7XHJcbiAgICAgIEZpZ2h0TWFuYWdlci51cGRhdGVQbGF5ZXJUb3VyRmlnaHRNZW51KHRoaXMuY2FzZS5nYW1lTWFuYWdlci5wbGF5ZXJUb3VyKTtcclxuICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXI7IiwiLy9UaGlzIGNsYXNzIGZvciB0aGUgZmllbGRzXHJcbmNsYXNzIENvb3JkIHtcclxuICAgIC8vZmllbGQgXHJcbiAgICB4IDogbnVtYmVyO1xyXG4gICAgeSA6IG51bWJlcjtcclxuXHJcbiAgICAvL2NvbnN0cnVjdG9yIFxyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgQ29vcmQ7IiwiaW1wb3J0IENhc2UgZnJvbSBcIi4uLy4uL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4uL21vZGVsL2ZpZWxkXCI7XHJcbmltcG9ydCBDYXNlTG9naWMgZnJvbSBcIi4uLy4uL2Nhc2UvbG9naWMvY2FzZUxvZ2ljXCI7XHJcbmltcG9ydCBXZWFwb24gZnJvbSBcIi4uLy4uL3dlYXBvbi9tb2RlbC93ZWFwb25cIjtcclxuaW1wb3J0IExvZ2ljV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbG9naWMvbG9naWNXZWFwb25cIjtcclxuaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi4vLi4vY2hhcmFjdGVyL21vZGVsL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgTG9naWNDaGFyYWN0ZXIgZnJvbSBcIi4uLy4uL2NoYXJhY3Rlci9sb2dpYy9sb2dpY0NoYXJhY3RlclwiO1xyXG5pbXBvcnQgQ29vcmQgZnJvbSBcIi4uLy4uL2Nvb3JkL21vZGVsL2Nvb3JkXCI7XHJcblxyXG4vL1RoaXMgY2xhc3Mgd2lsbCBnZW5lcmF0ZSBhbGwgdGhlIGRpZmZlcmVudCBvYmplY3RzIG5lZWRlZCBmb3IgdGhlIGdhbWVcclxuYWJzdHJhY3QgY2xhc3MgTG9naWNGaWVsZCB7XHJcblxyXG4gICAvKipcclxuICAgICogXHJcbiAgICAqIEBwYXJhbSB4IFxyXG4gICAgKiBAcGFyYW0geSBcclxuICAgICovXHJcbiAgIHN0YXRpYyBnZW5lcmF0ZU1hcCh4OiBudW1iZXIsIHk6IG51bWJlcik6IEZpZWxkIHtcclxuICAgICAgbGV0IHRvdGFsQ2FzZXMgPSB4ICogeTtcclxuICAgICAgbGV0IGJsb2NrZWRDYXNlcyA9IE1hdGgucm91bmQodG90YWxDYXNlcyAvIDYpO1xyXG4gICAgICBsZXQgZmllbGQ6IEZpZWxkID0gbmV3IEZpZWxkKHgsIHkpO1xyXG5cclxuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgeDsgY29sKyspIHtcclxuICAgICAgICAgZmllbGQuY2FzZXNbY29sXSA9IFtdO1xyXG4gICAgICAgICBmb3IobGV0IHJvdyA9IDA7IHJvdyA8IHk7IHJvdysrKXtcclxuICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gbmV3IENvb3JkKGNvbCwgcm93KTtcclxuXHJcbiAgICAgICAgIGlmIChibG9ja2VkQ2FzZXMgPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBibG9ja2VkQ2FzZSA9IG5ldyBDYXNlKHBvc2l0aW9uLCBDYXNlTG9naWMuQkxPQ0tFRCk7XHJcbiAgICAgICAgICAgIGZpZWxkLmNhc2VzW2NvbF1bcm93XSA9IGJsb2NrZWRDYXNlO1xyXG4gICAgICAgICAgICBibG9ja2VkQ2FzZXMgPSBibG9ja2VkQ2FzZXMgLSAxO1xyXG4gICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgbm9uQmxvY2tlZENhc2UgPSBuZXcgQ2FzZShwb3NpdGlvbik7XHJcbiAgICAgICAgICAgIGZpZWxkLmNhc2VzW2NvbF1bcm93XSA9IG5vbkJsb2NrZWRDYXNlO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBmaWVsZC51bnNvcnRDYXNlcygpO1xyXG5cclxuICAgICAgcmV0dXJuIGZpZWxkO1xyXG4gICB9XHJcblxyXG4gICAvKipcclxuICAgICogXHJcbiAgICAqIEBwYXJhbSBlbGVtZW50VG9GaWxsIFxyXG4gICAgKiBAcGFyYW0gZmllbGQgXHJcbiAgICAqL1xyXG4gICBzdGF0aWMgcGFpbnRGaWVsZChlbGVtZW50VG9GaWxsOiBIVE1MRWxlbWVudCwgZmllbGQ6IEZpZWxkKTogdm9pZCB7XHJcblxyXG4gICAgICBcclxuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgZmllbGQuc2l6ZS54OyBjb2wrKykge1xyXG4gICAgICAgICBsZXQgcm93RWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgcm93RWx0LnN0eWxlLmhlaWdodCA9ICgxMDAgLyBmaWVsZC5zaXplLngpLnRvRml4ZWQoMikrIFwiJVwiO1xyXG4gICAgICAgICByb3dFbHQuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XHJcbiAgICAgICAgIHJvd0VsdC5jbGFzc0xpc3QuYWRkKFwicm93LW1hcFwiKTtcclxuICAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgZmllbGQuc2l6ZS55OyByb3crKyl7XHJcbiAgICAgICAgIGxldCBkaXZFbHQgPSBDYXNlTG9naWMucGFpbnRDYXNlKGZpZWxkLmNhc2VzW2NvbF1bcm93XSk7XHJcbiAgICAgICAgIHJvd0VsdC5hcHBlbmRDaGlsZChkaXZFbHQpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsZW1lbnRUb0ZpbGwuYXBwZW5kQ2hpbGQocm93RWx0KTtcclxuICAgfVxyXG4gICB9XHJcblxyXG5cclxuICAgIHN0YXRpYyBzZXRXZWFwb24oZmllbGQ6IEZpZWxkKTogdm9pZCB7XHJcbiAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKykge1xyXG4gICAgICAgICBsZXQgd2VhcG9uID0gbmV3IFdlYXBvbihcIk1qb2xuaXJcIitpLCAxMCtpLCBcIi9hc3NldHMvaW1nL3dlYXBvbi93ZWFwb24xLnBuZ1wiKTtcclxuICAgICAgICAgZmllbGQud2VhcG9ucy5wdXNoKHdlYXBvbik7XHJcbiAgICAgICB9XHJcbiAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKykge1xyXG4gICAgICAgICBsZXQgd2VhcG9uID0gbmV3IFdlYXBvbihcIlN0b3JtYnJlYWtlclwiK2ksIDIwK2ksIFwiL2Fzc2V0cy9pbWcvd2VhcG9uL3dlYXBvbjEucG5nXCIpO1xyXG4gICAgICAgICBmaWVsZC53ZWFwb25zLnB1c2god2VhcG9uKTtcclxuICAgICAgIH1cclxuICAgICAgIGZvcihsZXQgd2VhcG9uIG9mIGZpZWxkLndlYXBvbnMpe1xyXG4gICAgICAgICAgTG9naWNXZWFwb24ucGFpbnRTdGFydFdlYXBvbihmaWVsZCwgd2VhcG9uKTtcclxuXHJcbiAgICAgICB9XHJcbiAgICB9IFxyXG5cclxuICAgc3RhdGljIHNldENoYXJhY3RlcnMoZmllbGQ6IEZpZWxkKTogdm9pZCB7XHJcbiAgICAgIExvZ2ljQ2hhcmFjdGVyLnBhaW50U3RhcnRDaGFyYWN0ZXJzKGZpZWxkLCBcIkV4dGVybWluYXRvclwiLCBcIi9hc3NldHMvaW1nL2NoYXJhY3RlcnMvYXZhdGFyMS5wbmdcIik7XHJcbiAgICAgIExvZ2ljQ2hhcmFjdGVyLnBhaW50U3RhcnRDaGFyYWN0ZXJzKGZpZWxkLCBcIlByZWRhdG9yXCIsIFwiL2Fzc2V0cy9pbWcvY2hhcmFjdGVycy9hdmF0YXIyLnBuZ1wiKTtcclxuXHJcbiAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTG9naWNGaWVsZDsiLCJpbXBvcnQgQ2FzZSBmcm9tIFwiLi4vLi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcbmltcG9ydCBDb29yZCBmcm9tIFwiLi4vLi4vY29vcmQvbW9kZWwvY29vcmRcIjtcclxuaW1wb3J0IFNpemUgZnJvbSBcIi4uLy4uL3NpemUvbW9kZWwvc2l6ZVwiO1xyXG5pbXBvcnQgV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbW9kZWwvd2VhcG9uXCI7XHJcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4uLy4uL2NoYXJhY3Rlci9tb2RlbC9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IExvZ2ljSGVscGVyIGZyb20gXCIuLi8uLi8uLi9oZWxwZXJzL0xvZ2ljSGVscGVyXCI7XHJcblxyXG5cclxuLy9UaGlzIGNsYXNzIGZvciB0aGUgZmllbGRzXHJcbmNsYXNzIEZpZWxkIHtcclxuICAgIC8vZmllbGQgXHJcbiAgICBzaXplOiBTaXplO1xyXG4gICAgY2FzZXM6IENhc2VbXVtdO1xyXG4gICAgd2VhcG9uczogV2VhcG9uW107XHJcbiAgICBjaGFyYWN0ZXJzOiBDaGFyYWN0ZXJbXTtcclxuICAgICRlbDogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgLy9jb25zdHJ1Y3RvciBcclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5zaXplID0gbmV3IFNpemUoeCx5KTtcclxuICAgICAgICB0aGlzLmNhc2VzID0gQXJyYXk8QXJyYXk8Q2FzZT4+KCk7XHJcbiAgICAgICAgdGhpcy53ZWFwb25zID0gW107XHJcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXJzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBjYXNlVG9BZGQgXHJcbiAgICAgKi9cclxuICAgIGFkZENhc2UoY2FzZVRvQWRkOiBDYXNlW10pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNhc2VzLnB1c2goY2FzZVRvQWRkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGluZGljZUNhc2UgXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZUNhc2UocG9zaXRpb246IENvb3JkKTogdm9pZHtcclxuICAgICAgICB0aGlzLmNhc2VzW3Bvc2l0aW9uLnhdLnNwbGljZShwb3NpdGlvbi55LCAxKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICovXHJcbiAgICBuYnJPZkJsb2NrZWRDYXNlKCk6IG51bWJlciB7XHJcbiAgICAgICAgbGV0IG5ick9mQmxvY2tlZENhc2U6IG51bWJlciA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5zaXplLng7IHJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuc2l6ZS55OyBjb2wrKyl7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhc2VzW3Jvd11bY29sXS5pc0Jsb2NrZWQpIHtcclxuICAgICAgICAgICAgICAgIG5ick9mQmxvY2tlZENhc2UgPSBuYnJPZkJsb2NrZWRDYXNlICsgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICAgICByZXR1cm4gbmJyT2ZCbG9ja2VkQ2FzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICovXHJcbiAgICBnZXROb25CbG9ja2VkQ2FzZXMoKTogQXJyYXk8Q2FzZT4ge1xyXG4gICAgICAgIGxldCBOb25CbG9ja2VkQ2FzZXM6IEFycmF5PENhc2U+ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5zaXplLng7IHJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuc2l6ZS55OyBjb2wrKyl7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jYXNlc1tyb3ddW2NvbF0uaXNCbG9ja2VkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FzZVRvQWRkID0gdGhpcy5jYXNlc1tyb3ddW2NvbF07XHJcbiAgICAgICAgICAgICAgICBOb25CbG9ja2VkQ2FzZXMucHVzaChjYXNlVG9BZGQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgIHJldHVybiBOb25CbG9ja2VkQ2FzZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QmxvY2tlZENhc2VzKCk6IEFycmF5PENhc2U+IHtcclxuICAgICAgICBsZXQgQmxvY2tlZENhc2VzOiBBcnJheTxDYXNlPiA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMuc2l6ZS54OyByb3crKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCB0aGlzLnNpemUueTsgY29sKyspe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYXNlc1tyb3ddW2NvbF0uaXNCbG9ja2VkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FzZVRvQWRkID0gdGhpcy5jYXNlc1tyb3ddW2NvbF07XHJcbiAgICAgICAgICAgICAgICBCbG9ja2VkQ2FzZXMucHVzaChjYXNlVG9BZGQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgIHJldHVybiBCbG9ja2VkQ2FzZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QXZhaWxhYmxlQ2FzZXMoKTogQXJyYXk8Q2FzZT4ge1xyXG4gICAgICAgIGxldCBhdmFpbGFibGVDYXNlczogQXJyYXk8Q2FzZT4gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLnNpemUueDsgcm93KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5zaXplLnk7IGNvbCsrKXtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2FzZXNbcm93XVtjb2xdLmlzQXZhaWxhYmxlICYmICF0aGlzLmNhc2VzW3Jvd11bY29sXS5pc0Jsb2NrZWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjYXNlVG9BZGQgPSB0aGlzLmNhc2VzW3Jvd11bY29sXTtcclxuICAgICAgICAgICAgICAgIGF2YWlsYWJsZUNhc2VzLnB1c2goY2FzZVRvQWRkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICAgICByZXR1cm4gYXZhaWxhYmxlQ2FzZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiBcclxuICAgICAqL1xyXG4gICAgZ2V0Q2FzZUJ5UG9zaXRpb24ocG9zaXRpb246IENvb3JkKTogQ2FzZSB7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY2FzZXNbcG9zaXRpb24ueF1bcG9zaXRpb24ueV0pO1xyXG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FzZXNbcG9zaXRpb24ueF1bcG9zaXRpb24ueV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKi9cclxuICAgIGdldFJhbmRvbUNhc2UoKTogQ2FzZXtcclxuICAgICAgICBsZXQgcmFuZG9tWCA9IExvZ2ljSGVscGVyLmdldFJhbmRvbURpbWVuc2lvbih0aGlzLnNpemUueC0xKTtcclxuICAgICAgICBsZXQgcmFuZG9tWSA9IExvZ2ljSGVscGVyLmdldFJhbmRvbURpbWVuc2lvbih0aGlzLnNpemUueS0xKTtcclxuXHJcbiAgICAgICAgbGV0IHJhbmRvbUNvb3JkID0gbmV3IENvb3JkKHJhbmRvbVgsIHJhbmRvbVkpO1xyXG5cclxuICAgICAgICBsZXQgY2FzZVJhbmRvbSA9IHRoaXMuZ2V0Q2FzZUJ5UG9zaXRpb24ocmFuZG9tQ29vcmQpO1xyXG4gICAgICAgIGxldCBjYXNlVG9DaGVjayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhc2VSYW5kb20ucG9zaXRpb25TdHJpbmcpO1xyXG4gICAgICAgIHdoaWxlKGNhc2VUb0NoZWNrID09PSBudWxsIHx8IGNhc2VUb0NoZWNrID09PSB1bmRlZmluZWQgfHwgY2FzZVJhbmRvbSA9PT0gdW5kZWZpbmVkIHx8IGNhc2VSYW5kb20gPT09IG51bGwpe1xyXG5cclxuICAgICAgICAgICAgbGV0IHJhbmRvbVggPSBMb2dpY0hlbHBlci5nZXRSYW5kb21EaW1lbnNpb24odGhpcy5zaXplLngtMSk7XHJcbiAgICAgICAgICAgIGxldCByYW5kb21ZID0gTG9naWNIZWxwZXIuZ2V0UmFuZG9tRGltZW5zaW9uKHRoaXMuc2l6ZS55LTEpO1xyXG4gICAgXHJcbiAgICAgICAgICAgIGxldCByYW5kb21Db29yZCA9IG5ldyBDb29yZChyYW5kb21YLCByYW5kb21ZKTtcclxuXHJcbiAgICAgICAgICAgIGNhc2VSYW5kb20gPSB0aGlzLmdldENhc2VCeVBvc2l0aW9uKHJhbmRvbUNvb3JkKTtcclxuICAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjYXNlUmFuZG9tO1xyXG4gICAgfVxyXG5cclxuICBcclxuICAgIGdldE5vbkJsb2NrZWRSYW5kb21DYXNlKCk6IENhc2V7XHJcblxyXG4gICAgICAgIGxldCBub25CbG9ja2VkQ2FzZXMgPSB0aGlzLmdldE5vbkJsb2NrZWRDYXNlcygpO1xyXG5cclxuICAgICAgICBsZXQgaW5kaWNlID0gTG9naWNIZWxwZXIuZ2V0UmFuZG9tRGltZW5zaW9uKG5vbkJsb2NrZWRDYXNlcy5sZW5ndGgtMSk7XHJcblxyXG4gICAgICAgIGxldCBub25CbG9ja2VkUmFuZG9tQ2FzZSA9IG5vbkJsb2NrZWRDYXNlc1tpbmRpY2VdO1xyXG5cclxuICAgICAgICByZXR1cm4gbm9uQmxvY2tlZFJhbmRvbUNhc2U7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldEF2YWlsYWJsZVJhbmRvbUNhc2UoKTogQ2FzZXtcclxuICAgICAgICBsZXQgYXZhaWxhYmxlQ2FzZXMgPSB0aGlzLmdldEF2YWlsYWJsZUNhc2VzKCk7XHJcblxyXG4gICAgICAgIGxldCBpbmRpY2UgPSBMb2dpY0hlbHBlci5nZXRSYW5kb21EaW1lbnNpb24oYXZhaWxhYmxlQ2FzZXMubGVuZ3RoLTEpO1xyXG5cclxuICAgICAgICBsZXQgYXZhaWxhYmxlUmFuZG9tQ2FzZSA9IGF2YWlsYWJsZUNhc2VzW2luZGljZV07XHJcblxyXG4gICAgICAgIHJldHVybiBhdmFpbGFibGVSYW5kb21DYXNlO1xyXG4gICAgfSBcclxuXHJcblxyXG4gICAgZHVwbGljYXRlTGlzdE9mQ2FzZSgpOiBDYXNlW117XHJcbiAgICAgICAgbGV0IGNhc2VzVGVtcCA9IEFycmF5PENhc2U+KCk7XHJcbiAgICAgICAgZm9yIChsZXQgcm93PTA7IHJvdyA8IHRoaXMuc2l6ZS54OyByb3crKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IGNvbD0wOyBjb2wgPCB0aGlzLnNpemUueTsgY29sKyspe1xyXG4gICAgICAgICAgIGxldCBjYXNlVG9BZGQgPSB0aGlzLmNhc2VzW3Jvd11bY29sXTtcclxuICAgICAgICAgICBjYXNlc1RlbXAucHVzaChjYXNlVG9BZGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICAgICByZXR1cm4gY2FzZXNUZW1wO1xyXG4gICAgfVxyXG5cclxuICAgIHVuc29ydENhc2VzKCk6IHZvaWR7XHJcbiAgICAgICAgbGV0IGNhc2VzVGVtcCA9IHRoaXMuZHVwbGljYXRlTGlzdE9mQ2FzZSgpO1xyXG5cclxuICAgICAgICBmb3IobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuc2l6ZS54OyBjb2wrKyl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5zaXplLnk7IHJvdysrKXtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kaWNlID0gTG9naWNIZWxwZXIuZ2V0UmFuZG9tRGltZW5zaW9uKGNhc2VzVGVtcC5sZW5ndGgtMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXNlc1tjb2xdW3Jvd10gPSBjYXNlc1RlbXBbaW5kaWNlXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FzZXNbY29sXVtyb3ddLnBvc2l0aW9uLnggPSBjb2w7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhc2VzW2NvbF1bcm93XS5wb3NpdGlvbi55ID0gcm93O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXNlc1tjb2xdW3Jvd10ucG9zaXRpb25TdHJpbmcgPSBTdHJpbmcoY29sKStTdHJpbmcocm93KTtcclxuICAgICAgICAgICAgICAgIGNhc2VzVGVtcC5zcGxpY2UoaW5kaWNlLDEpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRDYXNlQnlFbHQoZWw6IEVsZW1lbnQpOiBDYXNle1xyXG4gICAgICAgIGZvcihsZXQgcm93Q2FzZXMgb2YgdGhpcy5jYXNlcyl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgY2FzZVRvR2V0IG9mIHJvd0Nhc2VzKXtcclxuICAgICAgICAgICAgICAgIGlmKGNhc2VUb0dldC4kZWwgPT09IGVsKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FzZVRvR2V0O1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEZpZWxkOyIsIlxyXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gXCIuL2NoYXJhY3Rlci9tb2RlbC9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IEdhbWVNYW5hZ2VyIGZyb20gXCIuL2dhbWVNYW5hZ2VyXCI7XHJcbmltcG9ydCBMb2dnZXIgZnJvbSBcIi4vbG9nZ2VyXCI7XHJcblxyXG5hYnN0cmFjdCBjbGFzcyBGaWdodE1hbmFnZXIge1xyXG5cclxuICAgIHN0YXRpYyBmaWdodFRvRGVhdGgocGxheWVyMTogQ2hhcmFjdGVyLCBwbGF5ZXIyOiBDaGFyYWN0ZXIpe1xyXG5cclxuICAgICAgICBsZXQgbG9nZ2VyOiBMb2dnZXI7XHJcbiAgICAgICAgbG9nZ2VyLndyaXR0ZURlc2NyaXB0aW9uKCdUaGUgZGVhdGggbWF0Y2ggYmVnaW5zICEhJyk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCcnKVxyXG5cclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2V0RmlnaHRNZW51KGdhbWVNYW5hZ2VyOiBHYW1lTWFuYWdlcil7XHJcbiAgICAgICAgbGV0IGRpdkZpZ2h0TWVudUVsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGl2RmlnaHRNZW51RWx0LmlkID0gXCJmaWdodC1tZW51XCI7XHJcblxyXG4gICAgICAgIGxldCBkaXZBY3Rpb25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICAgICAgbGV0IHRleHRBY3Rpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcclxuICAgICAgICB0ZXh0QWN0aW9uLnRleHRDb250ZW50ID0gXCJXaGF0IHdpbGwgeW91IGRvP1wiO1xyXG4gICAgICAgIGRpdkFjdGlvbnMuYXBwZW5kQ2hpbGQodGV4dEFjdGlvbik7XHJcbiAgICAgICAgZGl2QWN0aW9ucy5pZCA9ICdhY3Rpb25zJztcclxuXHJcbiAgICAgICAgbGV0IGF2YXRhcjEgPSBnYW1lTWFuYWdlci5wbGF5ZXJzWzBdLmljb25Vcmw7XHJcbiAgICAgICAgbGV0IGltZ0F2YXRhcjEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGltZ0F2YXRhcjEuc3JjID0gYXZhdGFyMTtcclxuICAgICAgICBpbWdBdmF0YXIxLnN0eWxlLnRyYW5zZm9ybSA9IFwicm90YXRlWSgxODBkZWcpXCI7XHJcblxyXG4gICAgICAgIGxldCBhdmF0YXIyID0gZ2FtZU1hbmFnZXIucGxheWVyc1sxXS5pY29uVXJsO1xyXG4gICAgICAgIGxldCBpbWdBdmF0YXIyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgICAgICBpbWdBdmF0YXIyLnNyYyA9IGF2YXRhcjI7XHJcblxyXG4gICAgICAgIGxldCBkaXZDaGFyYWN0ZXJzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkaXZDaGFyYWN0ZXJzLmNsYXNzTGlzdC5hZGQoXCJjaGFyYWN0ZXItdG8tZmlnaHRcIik7XHJcblxyXG4gICAgICAgIGxldCBkaXZDaGFyYWN0ZXJUb0ZpZ2h0MSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGl2Q2hhcmFjdGVyVG9GaWdodDEuY2xhc3NMaXN0LmFkZChcImNoYXJhY3Rlci10by1maWdodDFcIik7XHJcbiAgICAgICAgZGl2Q2hhcmFjdGVyVG9GaWdodDEuY2xhc3NMaXN0LmFkZChnYW1lTWFuYWdlci5wbGF5ZXJzWzBdLm5hbWUpO1xyXG4gICAgICAgIGRpdkNoYXJhY3RlclRvRmlnaHQxLmFwcGVuZENoaWxkKGltZ0F2YXRhcjEpO1xyXG5cclxuICAgICAgICBsZXQgZGl2Q2hhcmFjdGVyVG9GaWdodDIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRpdkNoYXJhY3RlclRvRmlnaHQyLmNsYXNzTGlzdC5hZGQoXCJjaGFyYWN0ZXItdG8tZmlnaHQyXCIpO1xyXG4gICAgICAgIGRpdkNoYXJhY3RlclRvRmlnaHQyLmNsYXNzTGlzdC5hZGQoZ2FtZU1hbmFnZXIucGxheWVyc1sxXS5uYW1lKTtcclxuICAgICAgICBkaXZDaGFyYWN0ZXJUb0ZpZ2h0Mi5hcHBlbmRDaGlsZChpbWdBdmF0YXIyKTtcclxuXHJcbiAgICAgICAgbGV0IGRpdkJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGl2QnV0dG9uLmlkID0gXCJhY3Rpb24tYnV0dG9uXCI7XHJcbiAgICAgICAgbGV0IGF0dGFja0J1dHRvbiA9IHRoaXMuc2V0QXR0YWNrQnV0dG9uKGdhbWVNYW5hZ2VyKTtcclxuICAgICAgICBsZXQgZGVmZW5zZUJ1dHRvbiA9IHRoaXMuc2V0RGVmZW5zZUJ1dHRvbihnYW1lTWFuYWdlcik7XHJcbiAgICAgICAgZGl2QnV0dG9uLmFwcGVuZENoaWxkKGF0dGFja0J1dHRvbik7XHJcbiAgICAgICAgZGl2QnV0dG9uLmFwcGVuZENoaWxkKGRlZmVuc2VCdXR0b24pO1xyXG5cclxuICAgICAgICBkaXZDaGFyYWN0ZXJzLmFwcGVuZENoaWxkKGRpdkNoYXJhY3RlclRvRmlnaHQxKTtcclxuICAgICAgICBkaXZDaGFyYWN0ZXJzLmFwcGVuZENoaWxkKGRpdkNoYXJhY3RlclRvRmlnaHQyKTtcclxuICAgICAgICBkaXZGaWdodE1lbnVFbHQuYXBwZW5kQ2hpbGQoZGl2Q2hhcmFjdGVycyk7XHJcbiAgICAgICAgZGl2RmlnaHRNZW51RWx0LmFwcGVuZENoaWxkKGRpdkFjdGlvbnMpO1xyXG4gICAgICAgIGRpdkZpZ2h0TWVudUVsdC5hcHBlbmRDaGlsZChkaXZCdXR0b24pO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFyZW5hXCIpLmFwcGVuZENoaWxkKGRpdkZpZ2h0TWVudUVsdCk7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWdodFwiKS5jbGFzc0xpc3QuYWRkKFwiZmlnaHQtbW9kZVwiKTtcclxuICAgICAgICBsZXQgY2FzZXNFbGVtZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Nhc2UnKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgcm93IG9mIGdhbWVNYW5hZ2VyLmZpZWxkLmNhc2VzKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgY2FzZVRvQ2hlY2sgb2Ygcm93KXtcclxuICAgICAgICAgICAgY2FzZVRvQ2hlY2suJGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2Nhc2UtcmVhY2hhYmxlJyk7XHJcbiAgICAgICAgICAgIGNhc2VUb0NoZWNrLiRlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uY2xpY2spO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAgICAgaWYoZ2FtZU1hbmFnZXIucGxheWVyVG91ciA9PT0gZ2FtZU1hbmFnZXIucGxheWVyc1swXSl7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICtnYW1lTWFuYWdlci5wbGF5ZXJUb3VyLm5hbWUpWzBdLmNsYXNzTGlzdC5hZGQoXCJwbGF5ZXJUb3VyLWZpZ2h0XCIpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuJyArZ2FtZU1hbmFnZXIucGxheWVyc1sxXS5uYW1lKVswXS5jbGFzc0xpc3QuYWRkKFwicGFzc2l2ZVBsYXllci1maWdodFwiKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLicgK2dhbWVNYW5hZ2VyLnBsYXllclRvdXIubmFtZSlbMF0uY2xhc3NMaXN0LmFkZChcInBsYXllclRvdXItZmlnaHRcIik7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy4nICtnYW1lTWFuYWdlci5wbGF5ZXJzWzBdLm5hbWUpWzBdLmNsYXNzTGlzdC5hZGQoXCJwYXNzaXZlUGxheWVyLWZpZ2h0XCIpOyAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2V0QXR0YWNrQnV0dG9uKGdhbWVNYW5hZ2VyOiBHYW1lTWFuYWdlcik6IEhUTUxCdXR0b25FbGVtZW50e1xyXG4gICAgICAgIGxldCBhdHRhY2tCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgICAgIGF0dGFja0J1dHRvbi50ZXh0Q29udGVudCA9IFwiQXR0YWNrXCI7XHJcbiAgICAgICAgYXR0YWNrQnV0dG9uLmlkID0gXCJidG5BdHRhY2tcIjtcclxuICAgICAgICBhdHRhY2tCdXR0b24ub25jbGljayA9IChldmVudDogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2xpY2tBdHRhY2soZXZlbnQsIGdhbWVNYW5hZ2VyKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBhdHRhY2tCdXR0b247XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIG9uQ2xpY2tBdHRhY2soZXZlbnQ6IE1vdXNlRXZlbnQsIGdhbWVNYW5hZ2VyOiBHYW1lTWFuYWdlcik6IHZvaWR7XHJcblxyXG4gICAgICAgIGxldCBvZmZlbnNpdmVQbGF5ZXIgPSBnYW1lTWFuYWdlci5wbGF5ZXJUb3VyO1xyXG4gICAgICAgIGxldCBkZWZlbnNpdmVQbGF5ZXIgPSBnYW1lTWFuYWdlci5maWVsZC5jaGFyYWN0ZXJzLmZpbHRlcigoZGVmZW5zaXZlUGxheWVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAoZGVmZW5zaXZlUGxheWVyICE9PSBvZmZlbnNpdmVQbGF5ZXIpO1xyXG4gICAgICAgICAgfSlbMF07XHJcblxyXG4gICAgICAgICAgb2ZmZW5zaXZlUGxheWVyLmF0dGFjaygpO1xyXG5cclxuICAgIH0gXHJcblxyXG4gICAgc3RhdGljIHNldERlZmVuc2VCdXR0b24oZ2FtZU1hbmFnZXI6IEdhbWVNYW5hZ2VyKTogSFRNTEJ1dHRvbkVsZW1lbnR7XHJcbiAgICAgICAgbGV0IGRlZmVuc2VCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xyXG4gICAgICAgIGRlZmVuc2VCdXR0b24uaWQgPSBcImJ0bkRlZmVuc2VcIjtcclxuICAgICAgICBkZWZlbnNlQnV0dG9uLnRleHRDb250ZW50ID0gXCJEZWZlbnNlXCI7XHJcbiAgICAgICAgZGVmZW5zZUJ1dHRvbi5vbmNsaWNrID0gKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMub25DbGlja0RlZmVuc2UoZXZlbnQsIGdhbWVNYW5hZ2VyKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBkZWZlbnNlQnV0dG9uO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBvbkNsaWNrRGVmZW5zZShldmVudDogTW91c2VFdmVudCwgZ2FtZU1hbmFnZXI6IEdhbWVNYW5hZ2VyKTogdm9pZHtcclxuXHJcbiAgICAgICAgICBnYW1lTWFuYWdlci5wbGF5ZXJUb3VyLmRlZmVuc2UoKTtcclxuXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBlbmRHYW1lKHBsYXllcjogQ2hhcmFjdGVyKXtcclxuICAgICAgICB3aW5kb3cuYWxlcnQoJ1RoZSBwbGF5ZXIgJyArcGxheWVyLm5hbWUrICcgbG9zdCEhXFxuVGhlIGdhbWUgd2lsbCByZXN0YXJ0LicpO1xyXG4gICAgICAgIGxvY2F0aW9uLnJlbG9hZCh0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgdXBkYXRlUGxheWVyVG91ckZpZ2h0TWVudShwbGF5ZXI6IENoYXJhY3Rlcil7XHJcbiAgICAgICAgbGV0IHBsYXllclRvdXJFbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicGxheWVyVG91ci1maWdodFwiKVswXTtcclxuICAgICAgICBsZXQgcGFzc2l2ZVBsYXllckVsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwYXNzaXZlUGxheWVyLWZpZ2h0XCIpWzBdO1xyXG4gIFxyXG4gICAgICAgICAgcGxheWVyVG91ckVsdC5jbGFzc0xpc3QucmVtb3ZlKCdwbGF5ZXJUb3VyLWZpZ2h0Jyk7XHJcbiAgICAgICAgICBwYXNzaXZlUGxheWVyRWx0LmNsYXNzTGlzdC5yZW1vdmUoJ3Bhc3NpdmVQbGF5ZXItZmlnaHQnKTtcclxuXHJcbiAgICAgICAgICAgcGFzc2l2ZVBsYXllckVsdC5jbGFzc0xpc3QuYWRkKCdwbGF5ZXJUb3VyLWZpZ2h0Jyk7XHJcbiAgICAgICAgICBwbGF5ZXJUb3VyRWx0LmNsYXNzTGlzdC5hZGQoJ3Bhc3NpdmVQbGF5ZXItZmlnaHQnKTsgIFxyXG4gICAgfVxyXG4gICAgXHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBGaWdodE1hbmFnZXI7IiwiaW1wb3J0IENhc2UgZnJvbSBcIi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcbmltcG9ydCBGaWVsZCBmcm9tIFwiLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5pbXBvcnQgTG9naWNGaWVsZCBmcm9tIFwiLi9maWVsZC9sb2dpYy9sb2dpY0ZpZWxkXCI7XHJcbmltcG9ydCBDYXNlTG9naWMgZnJvbSBcIi4vY2FzZS9sb2dpYy9jYXNlTG9naWNcIjtcclxuaW1wb3J0IFdlYXBvbiBmcm9tIFwiLi93ZWFwb24vbW9kZWwvd2VhcG9uXCI7XHJcbmltcG9ydCBMb2dpY1dlYXBvbiBmcm9tIFwiLi93ZWFwb24vbG9naWMvbG9naWNXZWFwb25cIjtcclxuaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCBMb2dpY0NoYXJhY3RlciBmcm9tIFwiLi9jaGFyYWN0ZXIvbG9naWMvbG9naWNDaGFyYWN0ZXJcIjtcclxuaW1wb3J0IENvb3JkIGZyb20gXCIuL2Nvb3JkL21vZGVsL2Nvb3JkXCI7XHJcbmltcG9ydCBMb2dnZXIgZnJvbSBcIi4vbG9nZ2VyXCI7XHJcbmltcG9ydCBNZW51TWFuYWdlciBmcm9tIFwiLi9tZW51TWFuYWdlclwiO1xyXG5cclxuY2xhc3MgR2FtZU1hbmFnZXIge1xyXG4gICAgZmllbGQ6IEZpZWxkO1xyXG4gICAgaWQ6IHN0cmluZyA9ICdmaWdodCc7XHJcbiAgICBwbGF5ZXJzOiBBcnJheTxDaGFyYWN0ZXI+O1xyXG4gICAgcGxheWVyVG91cjogQ2hhcmFjdGVyO1xyXG4gICAgbWF4TW92ZTogbnVtYmVyID0gMztcclxuICAgIGxvZ2dlcjogTG9nZ2VyO1xyXG4gICAgbWVudU1hbmFnZXI6IE1lbnVNYW5hZ2VyO1xyXG5cclxuICAgICRlbDogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnBsYXllcnMgPSBuZXcgQXJyYXk8Q2hhcmFjdGVyPigpO1xyXG4gICAgICAgIHRoaXMubG9nZ2VyID0gbmV3IExvZ2dlcigpO1xyXG4gICAgICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0R2FtZU1hbmFnZXIoKXtcclxuICAgICAgICBmb3IobGV0IHJvd0ZpZWxkIG9mIHRoaXMuZmllbGQuY2FzZXMpe1xyXG4gICAgICAgICAgICBmb3IobGV0IGNhc2VUb1VwZGF0ZSBvZiByb3dGaWVsZCl7XHJcbiAgICAgICAgICAgICAgICBjYXNlVG9VcGRhdGUuZ2FtZU1hbmFnZXIgPSB0aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0R2FtZSgpIHtcclxuICAgICAgICB0aGlzLmxvZ2dlci53cml0dGVEZXNjcmlwdGlvbignc3RhcnRpbmcgZ2FtZS4uLicpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdzdGFydGluZyBnYW1lLi4uJyk7XHJcblxyXG4gICAgICAgIGxldCBmaWVsZCA9IExvZ2ljRmllbGQuZ2VuZXJhdGVNYXAoMTAsIDEwKTtcclxuXHJcbiAgICAgICAgdGhpcy5maWVsZCA9IGZpZWxkO1xyXG5cclxuICAgICAgICB0aGlzLnNldEdhbWVNYW5hZ2VyKCk7XHJcblxyXG4gICAgICAgIExvZ2ljRmllbGQucGFpbnRGaWVsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpZ2h0XCIpLCBmaWVsZCk7XHJcblxyXG4gICAgICAgIExvZ2ljRmllbGQuc2V0V2VhcG9uKGZpZWxkKTtcclxuXHJcbiAgICAgICAgTG9naWNGaWVsZC5zZXRDaGFyYWN0ZXJzKGZpZWxkKTtcclxuXHJcbiAgICAgICAgLy8gRmlyc3QgUGxheWVyIHN0YXJ0XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJUb3VyID0gZmllbGQuY2hhcmFjdGVyc1swXTtcclxuICAgICAgICBNZW51TWFuYWdlci5zZXRNZW51KHRoaXMpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2hvd1JlYWNoYWJsZUNhc2UoKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dnZXIud3JpdHRlRGVzY3JpcHRpb24oJ1RoZSBwbGF5ZXIgJyArIHRoaXMucGxheWVyVG91ci5uYW1lICsgJyBjYW4gcGxheS4nKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnVGhlIHBsYXllciAnICsgdGhpcy5wbGF5ZXJUb3VyLm5hbWUgKyAnIGNhbiBwbGF5LicpO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dSZWFjaGFibGVDYXNlKCl7XHJcbiAgICAgICAgZm9yKGxldCBjb2w9MDsgY29sIDwgdGhpcy5maWVsZC5zaXplLng7IGNvbCsrKXtcclxuICAgICAgICAgICAgZm9yKGxldCByb3c9MDsgcm93IDwgdGhpcy5maWVsZC5zaXplLnk7IHJvdysrKXtcclxuICAgICAgICAgICAgICAgIGxldCBjYXNlVG9DaGVjayA9IHRoaXMuZmllbGQuY2FzZXNbY29sXVtyb3ddO1xyXG4gICAgICAgICAgICBpZih0aGlzLnBsYXllclRvdXIuaXNDYXNlUmVhY2hhYmxlKGNhc2VUb0NoZWNrLCB0aGlzLmZpZWxkKSA9PT0gdHJ1ZSAmJiBjYXNlVG9DaGVjayAhPT0gdGhpcy5wbGF5ZXJUb3VyLmNhc2Upe1xyXG4gICAgICAgICAgICAgICAgY2FzZVRvQ2hlY2suJGVsLmNsYXNzTGlzdC5hZGQoXCJjYXNlLXJlYWNoYWJsZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIFxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IEdhbWVNYW5hZ2VyOyIsImltcG9ydCBDYXNlIGZyb20gXCIuL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4vZmllbGQvbW9kZWwvZmllbGRcIjtcclxuaW1wb3J0IExvZ2ljRmllbGQgZnJvbSBcIi4vZmllbGQvbG9naWMvbG9naWNGaWVsZFwiO1xyXG5pbXBvcnQgQ2FzZUxvZ2ljIGZyb20gXCIuL2Nhc2UvbG9naWMvY2FzZUxvZ2ljXCI7XHJcbmltcG9ydCBXZWFwb24gZnJvbSBcIi4vd2VhcG9uL21vZGVsL3dlYXBvblwiO1xyXG5pbXBvcnQgTG9naWNXZWFwb24gZnJvbSBcIi4vd2VhcG9uL2xvZ2ljL2xvZ2ljV2VhcG9uXCI7XHJcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4vY2hhcmFjdGVyL21vZGVsL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgTG9naWNDaGFyYWN0ZXIgZnJvbSBcIi4vY2hhcmFjdGVyL2xvZ2ljL2xvZ2ljQ2hhcmFjdGVyXCI7XHJcbmltcG9ydCBDb29yZCBmcm9tIFwiLi9jb29yZC9tb2RlbC9jb29yZFwiO1xyXG5cclxuY2xhc3MgTG9nZ2VyIHtcclxuICAgIGFjdGl2aXR5OiBBcnJheTxzdHJpbmc+O1xyXG4gICAgJGVsOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmFjdGl2aXR5ID0gQXJyYXk8c3RyaW5nPigpO1xyXG5cclxuICAgICAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhY3Rpdml0eS1pdGVtLWxpc3QnKTtcclxuICAgIH1cclxuXHJcbndyaXR0ZURlc2NyaXB0aW9uKHRleHQ6IHN0cmluZyl7XHJcbiAgICBsZXQgYWN0aXZpdHlFbHQgPSB0aGlzLiRlbDtcclxuICAgIHRoaXMuYWN0aXZpdHkucHVzaCh0ZXh0KTtcclxuICAgIGxldCBsYXN0QWN0aXZpdHlJbmRpY2UgPSB0aGlzLmFjdGl2aXR5Lmxlbmd0aC0xO1xyXG4gICAgbGV0IGRpdkVsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBsZXQgZGl2VGV4dEVsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgbGV0IGl0ZW1MaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbGFzdC1pdGVtJyk7XHJcbiAgICBpZihpdGVtTGlzdFswXSAhPT0gdW5kZWZpbmVkICYmIGl0ZW1MaXN0WzBdICE9PSBudWxsKXtcclxuICAgIGl0ZW1MaXN0WzBdLmNsYXNzTGlzdC5yZW1vdmUoJ2xhc3QtaXRlbScpO1xyXG4gICAgfVxyXG5cclxuICAgIGRpdlRleHRFbHQudGV4dENvbnRlbnQgPSB0aGlzLmFjdGl2aXR5W2xhc3RBY3Rpdml0eUluZGljZV07XHJcblxyXG4gICAgXHJcbiAgICBhY3Rpdml0eUVsdC5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCAnPGRpdiBjbGFzcz1cImFjdGl2aXR5LWl0ZW0gbGFzdC1pdGVtXCI+JysgdGhpcy5hY3Rpdml0eVtsYXN0QWN0aXZpdHlJbmRpY2VdICsnPC9kaXY+Jyk7XHJcblxyXG5cclxufVxyXG5cclxuXHJcblxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IExvZ2dlcjsiLCJcclxuaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCBHYW1lTWFuYWdlciBmcm9tIFwiLi9nYW1lTWFuYWdlclwiO1xyXG5cclxuYWJzdHJhY3QgY2xhc3MgTWVudU1hbmFnZXIge1xyXG5cclxuICAgIHN0YXRpYyBzZXRNZW51KGdhbWVNYW5hZ2VyOiBHYW1lTWFuYWdlcil7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0SW5mbyhnYW1lTWFuYWdlci5wbGF5ZXJzWzBdLCAwKTtcclxuXHJcbiAgICAgICAgZ2FtZU1hbmFnZXIucGxheWVyc1swXS4kYXZhdGFyTGlmZUVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyMnICtnYW1lTWFuYWdlci5wbGF5ZXJzWzBdLm5hbWUrICcgLmxpZmUtaW5mbycpWzBdO1xyXG5cclxuICAgICAgICB0aGlzLnNldEluZm8oZ2FtZU1hbmFnZXIucGxheWVyc1sxXSwgMSk7XHJcbiAgICAgICAgZ2FtZU1hbmFnZXIucGxheWVyc1sxXS4kYXZhdGFyTGlmZUVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyMnICtnYW1lTWFuYWdlci5wbGF5ZXJzWzFdLm5hbWUrICcgLmxpZmUtaW5mbycpWzBdO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVBsYXllclRvdXJNZW51KGdhbWVNYW5hZ2VyLnBsYXllclRvdXIpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzZXRJbmZvKHBsYXllcjogQ2hhcmFjdGVyLCBpbmRpY2VQbGF5ZXI6IG51bWJlcil7XHJcblxyXG4gICAgICAgIHN3aXRjaCAoaW5kaWNlUGxheWVyKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwbGF5ZXItaW5mb1wiKVswXS5pZCA9IHBsYXllci5uYW1lO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicGxheWVyLWluZm9cIilbMV0uaWQgPSBwbGF5ZXIubmFtZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGxpZmVJbmZvRWx0ID0gPEhUTUxEaXZFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyMnICtwbGF5ZXIubmFtZSsgJyAubGlmZS1pbmZvJylbMF07XHJcbiAgICAgICAgbGV0IGRpdkxpZmVFbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRpdkxpZmVFbHQudGV4dENvbnRlbnQgPSBTdHJpbmcocGxheWVyLmxpZmUpO1xyXG4gICAgICAgIGRpdkxpZmVFbHQuY2xhc3NMaXN0LmFkZCgnbGlmZS12YWx1ZScpOyBcclxuICAgICAgICBsaWZlSW5mb0VsdC5hcHBlbmRDaGlsZChkaXZMaWZlRWx0KTtcclxuICAgICAgICB0aGlzLnNldENvbG9ySW5mb0xpZmUocGxheWVyLCBpbmRpY2VQbGF5ZXIpO1xyXG5cclxuICAgICAgICBsZXQgd2VhcG9uSW5mb0VsdCA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcjJyArcGxheWVyLm5hbWUrICcgLndlYXBvbi1pbmZvJylbMF07XHJcbiAgICAgICAgbGV0IGRpdldlYXBvbkVsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGl2V2VhcG9uRWx0LnRleHRDb250ZW50ID0gcGxheWVyLndlYXBvbi5uYW1lKyAnKCcrcGxheWVyLndlYXBvbi5kYW1hZ2UrJyknO1xyXG4gICAgICAgIGRpdldlYXBvbkVsdC5jbGFzc0xpc3QuYWRkKCd3ZWFwb24tdmFsdWUnKTtcclxuICAgICAgICB3ZWFwb25JbmZvRWx0LmFwcGVuZENoaWxkKGRpdldlYXBvbkVsdCk7XHJcblxyXG4gICAgICAgIGxldCBhdmF0YXJJY29uRWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYXZhdGFyLWljb24nKTtcclxuICAgICAgICBsZXQgZGl2QXZhdGFyRWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkaXZBdmF0YXJFbHQuY2xhc3NMaXN0LmFkZChcImF2YXRhci1pbWdcIilcclxuICAgICAgICBsZXQgYXZhdGFyID0gcGxheWVyLmljb25Vcmw7XHJcbiAgICAgICAgbGV0IGltZ0F2YXRhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgaW1nQXZhdGFyLnNyYyA9IGF2YXRhcjtcclxuXHJcblxyXG4gICAgICAgIGRpdkF2YXRhckVsdC5hcHBlbmRDaGlsZChpbWdBdmF0YXIpO1xyXG4gICAgICAgIGF2YXRhckljb25FbHRbaW5kaWNlUGxheWVyXS5hcHBlbmRDaGlsZChkaXZBdmF0YXJFbHQpO1xyXG5cclxuICAgICAgICBsZXQgbmFtZUluZm9FbHQgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnIycgK3BsYXllci5uYW1lKyAnIC5wbGF5ZXItbmFtZScpWzBdO1xyXG4gICAgICAgIG5hbWVJbmZvRWx0LnRleHRDb250ZW50ID0gcGxheWVyLm5hbWU7XHJcblxyXG4gICAgICAgIHN3aXRjaCAoaW5kaWNlUGxheWVyKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIGRpdkF2YXRhckVsdC5zdHlsZS5sZWZ0ID0gXCIyJVwiXHJcbiAgICAgICAgICAgICAgICBkaXZMaWZlRWx0LnN0eWxlLm1hcmdpbkxlZnQgPSBcIjVweFwiO1xyXG4gICAgICAgICAgICAgICAgZGl2V2VhcG9uRWx0LnN0eWxlLm1hcmdpbkxlZnQgPSBcIjVweFwiO1xyXG4gICAgICAgICAgICAgICAgaW1nQXZhdGFyLnN0eWxlLnRyYW5zZm9ybSA9IFwicm90YXRlWSgxODBkZWcpXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIGRpdkF2YXRhckVsdC5zdHlsZS5yaWdodCA9IFwiNSVcIlxyXG4gICAgICAgICAgICAgICAgZGl2TGlmZUVsdC5zdHlsZS5tYXJnaW5SaWdodCA9IFwiNXB4XCI7XHJcbiAgICAgICAgICAgICAgICBkaXZXZWFwb25FbHQuc3R5bGUubWFyZ2luUmlnaHQgPSBcIjVweFwiO1xyXG4gICAgICAgICAgICAgICAgbGlmZUluZm9FbHQuc3R5bGUuZmxleERpcmVjdGlvbiA9IFwicm93LXJldmVyc2VcIjtcclxuICAgICAgICAgICAgICAgIHdlYXBvbkluZm9FbHQuc3R5bGUuZmxleERpcmVjdGlvbiA9IFwicm93LXJldmVyc2VcIjtcclxuICAgICAgICAgICAgICAgIG5hbWVJbmZvRWx0LnN0eWxlLmZsZXhEaXJlY3Rpb24gPSBcInJvdy1yZXZlcnNlXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB1cGRhdGVJbmZvTGlmZShwbGF5ZXI6IENoYXJhY3RlciwgaW5kaWNlUGxheWVyOiBudW1iZXIpe1xyXG5cclxuICAgICAgICBsZXQgbGlmZUluZm9FbHQgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnIycgK3BsYXllci5uYW1lKyAnIC5saWZlLXZhbHVlJylbMF07XHJcblxyXG4gICAgICAgIGxpZmVJbmZvRWx0LmlubmVySFRNTD1cIlwiO1xyXG4gICAgICAgIGxpZmVJbmZvRWx0LnRleHRDb250ZW50ID0gU3RyaW5nKHBsYXllci5saWZlKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRDb2xvckluZm9MaWZlKHBsYXllciwgaW5kaWNlUGxheWVyKTtcclxuXHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNldENvbG9ySW5mb0xpZmUocGxheWVyOiBDaGFyYWN0ZXIsIGluZGljZVBsYXllcjogbnVtYmVyKXtcclxuXHJcbiAgICAgICAgbGV0IGxpZmVJbmZvRWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImxpZmUtdmFsdWVcIilbaW5kaWNlUGxheWVyXTtcclxuXHJcbiAgICAgICAgaWYocGxheWVyLiRhdmF0YXJMaWZlRWx0ICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgIGlmKHBsYXllci4kYXZhdGFyTGlmZUVsdC5jbGFzc0xpc3QuY29udGFpbnMoJ2hpZ2gtbGlmZS1sZXZlbCcpKXtcclxuICAgICAgICAgICAgcGxheWVyLiRhdmF0YXJMaWZlRWx0LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZ2gtbGlmZS1sZXZlbCcpOyBcclxuICAgICAgICB9ZWxzZSBpZihwbGF5ZXIuJGF2YXRhckxpZmVFbHQuY2xhc3NMaXN0LmNvbnRhaW5zKCdtZWRpdW0tbGlmZS1sZXZlbCcpKXtcclxuICAgICAgICAgICAgcGxheWVyLiRhdmF0YXJMaWZlRWx0LmNsYXNzTGlzdC5yZW1vdmUoJ21lZGl1bS1saWZlLWxldmVsJyk7IFxyXG4gICAgICAgIH1lbHNlIGlmKHBsYXllci4kYXZhdGFyTGlmZUVsdC5jbGFzc0xpc3QuY29udGFpbnMoJ2xvdy1saWZlLWxldmVsJykpe1xyXG4gICAgICAgICAgICBwbGF5ZXIuJGF2YXRhckxpZmVFbHQuY2xhc3NMaXN0LnJlbW92ZSgnbG93LWxpZmUtbGV2ZWwnKTsgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICAgICBpZihwbGF5ZXIubGlmZSA+IDc1KXtcclxuICAgICAgICAgICAgbGlmZUluZm9FbHQuY2xhc3NMaXN0LmFkZCgnaGlnaC1saWZlLWxldmVsJyk7XHJcbiAgICAgICAgfWVsc2UgaWYgKHBsYXllci5saWZlID4gMzAgJiYgcGxheWVyLmxpZmUgPD0gNzUpIHtcclxuICAgICAgICAgICAgbGlmZUluZm9FbHQuY2xhc3NMaXN0LmFkZCgnbWVkaXVtLWxpZmUtbGV2ZWwnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsaWZlSW5mb0VsdC5jbGFzc0xpc3QuYWRkKCdsb3ctbGlmZS1sZXZlbCcpO1xyXG4gICAgICAgIH0gXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHVwZGF0ZUluZm9XZWFwb24ocGxheWVyOiBDaGFyYWN0ZXIsIGluZGljZVBsYXllcjogbnVtYmVyKXtcclxuICAgICAgICBsZXQgd2VhcG9uSW5mb0VsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ3ZWFwb24tdmFsdWVcIilbaW5kaWNlUGxheWVyXTtcclxuXHJcbiAgICAgICAgd2VhcG9uSW5mb0VsdC5pbm5lckhUTUw9XCJcIjtcclxuICAgICAgICB3ZWFwb25JbmZvRWx0LnRleHRDb250ZW50ID0gcGxheWVyLndlYXBvbi5uYW1lKyAnKCcrcGxheWVyLndlYXBvbi5kYW1hZ2UrJyknO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB1cGRhdGVQbGF5ZXJUb3VyTWVudShwbGF5ZXI6IENoYXJhY3Rlcil7XHJcbiAgICAgICAgbGV0IHBsYXllckVsdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicGxheWVyVG91clwiKTtcclxuICAgICAgICBpZihwbGF5ZXJFbHRzWzBdICE9PSB1bmRlZmluZWQgJiYgcGxheWVyRWx0c1swXSAhPT0gbnVsbCl7XHJcbiAgICAgICAgcGxheWVyRWx0c1swXS5jbGFzc0xpc3QucmVtb3ZlKFwicGxheWVyVG91clwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHBsYXllclRvdXJFbHQgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnIycgK3BsYXllci5uYW1lKyAnIC5hdmF0YXItaW1nJylbMF07XHJcbiAgICAgICAgcGxheWVyVG91ckVsdC5jbGFzc0xpc3QuYWRkKFwicGxheWVyVG91clwiKTtcclxuXHJcbiAgICAgICAgXHJcblxyXG4gICAgfVxyXG5cclxufVxyXG5leHBvcnQgZGVmYXVsdCBNZW51TWFuYWdlcjtcclxuIiwiLy9UaGlzIGNsYXNzIGZvciB0aGUgZmllbGRzXHJcbmNsYXNzIFNpemUge1xyXG4gICAgLy9maWVsZCBcclxuICAgIHggOiBudW1iZXI7XHJcbiAgICB5IDogbnVtYmVyO1xyXG5cclxuICAgIC8vY29uc3RydWN0b3IgXHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBTaXplOyIsImltcG9ydCBGaWVsZCBmcm9tIFwiLi4vLi4vZmllbGQvbW9kZWwvZmllbGRcIjtcclxuaW1wb3J0IFdlYXBvbiBmcm9tIFwiLi4vLi4vd2VhcG9uL21vZGVsL3dlYXBvblwiO1xyXG5pbXBvcnQgQ2FzZSBmcm9tIFwiLi4vLi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcblxyXG5cclxuYWJzdHJhY3QgY2xhc3MgTG9naWNXZWFwb24ge1xyXG5cclxuXHJcbiAgICBzdGF0aWMgcGFpbnRTdGFydFdlYXBvbihmaWVsZDogRmllbGQsIHdlYXBvbjogV2VhcG9uKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGNhc2VXZWFwb24gPSBmaWVsZC5nZXRBdmFpbGFibGVSYW5kb21DYXNlKCk7XHJcbiAgICAgICAgbGV0IGltZ1dlYXBvbjogSFRNTEltYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgbGV0IHNwYW5FbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBzcGFuRWx0LmNsYXNzTGlzdC5hZGQoXCJ3ZWFwb25cIik7XHJcbiAgICAgICAgaW1nV2VhcG9uLnNyYyA9IHdlYXBvbi5pY29uVXJsO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS5tYXhXaWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS5tYXhIZWlnaHQgPSBcIjUwJVwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUudG9wID0gXCIzMCVcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUubGVmdCA9IFwiMFwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS56SW5kZXggPSBcIjIwXCI7XHJcbiAgICAgICAgc3BhbkVsdC5hcHBlbmRDaGlsZChpbWdXZWFwb24pO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhc2VXZWFwb24ucG9zaXRpb25TdHJpbmcpLmFwcGVuZENoaWxkKHNwYW5FbHQpO1xyXG4gICAgICAgIGZpZWxkLmNhc2VzW2Nhc2VXZWFwb24ucG9zaXRpb24ueF1bY2FzZVdlYXBvbi5wb3NpdGlvbi55XS5pc0F2YWlsYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIGZpZWxkLmNhc2VzW2Nhc2VXZWFwb24ucG9zaXRpb24ueF1bY2FzZVdlYXBvbi5wb3NpdGlvbi55XS53ZWFwb24gPSB3ZWFwb247XHJcbiAgICAgICAgd2VhcG9uLiRlbCA9IHNwYW5FbHQ7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBwYWludFdlYXBvbihjYXNlV2VhcG9uOiBDYXNlLCB3ZWFwb246IFdlYXBvbiwgZmllbGQ6IEZpZWxkKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBpbWdXZWFwb246IEhUTUxJbWFnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGxldCBzcGFuRWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgc3BhbkVsdC5jbGFzc0xpc3QuYWRkKFwid2VhcG9uXCIpO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zcmMgPSB3ZWFwb24uaWNvblVybDtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUubWF4V2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUubWF4SGVpZ2h0ID0gXCI1MCVcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLnRvcCA9IFwiMzAlXCI7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLmxlZnQgPSBcIjBcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUuekluZGV4ID0gXCIyMFwiO1xyXG4gICAgICAgIHNwYW5FbHQuYXBwZW5kQ2hpbGQoaW1nV2VhcG9uKTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYXNlV2VhcG9uLnBvc2l0aW9uU3RyaW5nKS5hcHBlbmRDaGlsZChzcGFuRWx0KTtcclxuICAgICAgICBmaWVsZC5jYXNlc1tjYXNlV2VhcG9uLnBvc2l0aW9uLnhdW2Nhc2VXZWFwb24ucG9zaXRpb24ueV0ud2VhcG9uID0gd2VhcG9uO1xyXG4gICAgICAgIHdlYXBvbi4kZWwgPSBzcGFuRWx0O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMb2dpY1dlYXBvbjsiLCJpbXBvcnQgQ2FzZSBmcm9tIFwiLi4vLi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcblxyXG4vL1RoaXMgY2xhc3MgZm9yIHRoZSBmaWVsZHNcclxuY2xhc3MgV2VhcG9uIHtcclxuICAgLy9maWVsZCBcclxuICAgbmFtZTogc3RyaW5nO1xyXG4gICBkYW1hZ2U6IG51bWJlcjtcclxuICAgaWNvblVybDogc3RyaW5nO1xyXG4gICBjYXNlOiBDYXNlO1xyXG4gICAkZWw6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgLy9jb25zdHJ1Y3RvciBcclxuICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBkYW1hZ2U6IG51bWJlciwgaWNvblVybDogc3RyaW5nKSB7XHJcbiAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgIHRoaXMuZGFtYWdlID0gZGFtYWdlO1xyXG4gICAgICB0aGlzLmljb25VcmwgPSBpY29uVXJsO1xyXG4gICB9XHJcblxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgV2VhcG9uOyIsIlxyXG5hYnN0cmFjdCBjbGFzcyBMb2dpY0hlbHBlciB7XHJcbiAgICBzdGF0aWMgZ2V0UmFuZG9tRGltZW5zaW9uKGRpbWVuc2lvbjogbnVtYmVyKTogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSpkaW1lbnNpb24pO1xyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTG9naWNIZWxwZXI7IiwiXHJcbmltcG9ydCBDYXNlIGZyb20gXCIuL2VudGl0aWVzL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4vZW50aXRpZXMvZmllbGQvbW9kZWwvZmllbGRcIjtcclxuaW1wb3J0IExvZ2ljRmllbGQgZnJvbSBcIi4vZW50aXRpZXMvZmllbGQvbG9naWMvbG9naWNGaWVsZFwiO1xyXG5pbXBvcnQgR2FtZU1hbmFnZXIgZnJvbSBcIi4vZW50aXRpZXMvZ2FtZU1hbmFnZXJcIjtcclxuXHJcbmxldCBnYW1lTWFuYWdlciA9IG5ldyBHYW1lTWFuYWdlcigpO1xyXG5nYW1lTWFuYWdlci5zdGFydEdhbWUoKTtcclxuXHJcblxyXG4iXX0=
