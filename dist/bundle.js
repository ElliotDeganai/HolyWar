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
        if (this.position.x === caseToCheck.position.x + 1 || this.position.x === caseToCheck.position.x - 1 || this.position.y === caseToCheck.position.y + 1 || this.position.y === caseToCheck.position.y - 1) {
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
        var el = event.target || event.srcElement;
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
},{"../../case/logic/caseLogic":1,"../../weapon/logic/logicWeapon":12}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var character_1 = require("../../character/model/character");
var coord_1 = require("../../coord/model/coord");
var dimensionCase = 84;
var LogicCharacter = /** @class */ (function () {
    function LogicCharacter() {
    }
    LogicCharacter.paintStartCharacters = function (field, nameCharacter, iconUrl) {
        var player = new character_1.default(nameCharacter, iconUrl, field.getAvailableRandomCase());
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
        //spanElt.appendChild(imgChar);
        //let playerDivElt = player.case.$el;
        var playerDivElt = document.getElementById("fight");
        //playerDivElt.appendChild(spanElt);
        playerDivElt.appendChild(imgChar);
        player.$el = imgChar;
        imgChar.classList.add("player");
        this.setAbsolutePosition(player);
        player.$el.style.left = player.absoluteCoord.y + 'px';
        player.$el.style.top = player.absoluteCoord.x + 'px';
        field.characters.push(player);
        player.case.gameManager.players.push(player);
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
            logicCharacter_1.default.setAbsolutePosition(this);
            logicCharacter_1.default.characterAnimation(this, this.absoluteCoord);
            if (changedWeapon) {
                logicWeapon_1.default.paintWeapon(field.cases[caseFrom.position.x][caseFrom.position.y], previousWeapon, field);
            }
            this.case.gameManager.playerTour = nextPlayer;
            menuManager_1.default.updatePlayerTourMenu(this.case.gameManager.playerTour);
            logger.writteDescription('The player ' + this.case.gameManager.playerTour.name + ' can play.');
            console.log('The player ' + this.case.gameManager.playerTour.name + ' can play.');
            //FightManager.setFightMenu(this.case.gameManager);
        }
        else {
            logger.writteDescription("This place is unreachable!!");
            console.log("This place is unreachable!!");
        }
    };
    Character.prototype.attack = function () {
        var _this = this;
        var logger = new logger_1.default();
        var opponent = this.case.gameManager.field.characters.filter(function (opponent) {
            return (opponent !== _this);
        })[0];
        var indexOpponent = this.case.gameManager.field.characters.indexOf(opponent);
        if (opponent.defenseMode === true) {
            opponent.life = Math.round((opponent.life - this.weapon.damage) / 2);
        }
        else {
            opponent.life = opponent.life - this.weapon.damage;
        }
        menuManager_1.default.updateInfoLife(opponent, indexOpponent);
        logger.writteDescription(opponent.name + ' received ' + this.weapon.damage + 'pts of damages.');
    };
    Character.prototype.defense = function () {
        this.defenseMode = true;
    };
    return Character;
}());
exports.default = Character;
},{"../../logger":9,"../../menuManager":10,"../../weapon/logic/logicWeapon":12,"../../weapon/model/weapon":13,"../logic/logicCharacter":3}],5:[function(require,module,exports){
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
},{"../../case/logic/caseLogic":1,"../../case/model/case":2,"../../character/logic/logicCharacter":3,"../../coord/model/coord":5,"../../weapon/logic/logicWeapon":12,"../../weapon/model/weapon":13,"../model/field":7}],7:[function(require,module,exports){
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
},{"../../../helpers/LogicHelper":14,"../../coord/model/coord":5,"../../size/model/size":11}],8:[function(require,module,exports){
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
},{"./field/logic/logicField":6,"./logger":9,"./menuManager":10}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MenuManager = /** @class */ (function () {
    function MenuManager() {
    }
    MenuManager.setMenu = function (gameManager) {
        this.setInfo(gameManager.players[0], 0);
        gameManager.players[0].$avatarLifeElt = document.querySelectorAll("#player1 .life-info")[0];
        this.setInfo(gameManager.players[1], 1);
        gameManager.players[1].$avatarLifeElt = document.querySelectorAll("#player2 .life-info")[0];
        this.updatePlayerTourMenu(gameManager.playerTour);
    };
    MenuManager.setInfo = function (player, indicePlayer) {
        var lifeInfoElt = document.getElementsByClassName('life-info');
        var divLifeElt = document.createElement("div");
        divLifeElt.textContent = String(player.life);
        divLifeElt.classList.add('life-value');
        divLifeElt.style.position = "absolute";
        switch (indicePlayer) {
            case 0:
                divLifeElt.style.left = "30px";
                break;
            case 1:
                divLifeElt.style.right = "30px";
                break;
        }
        divLifeElt.style.zIndex = "20";
        lifeInfoElt[indicePlayer].appendChild(divLifeElt);
        this.setColorInfoLife(player, indicePlayer);
        var weaponInfoElt = document.getElementsByClassName('weapon-info');
        var divWeaponElt = document.createElement("div");
        divWeaponElt.textContent = player.weapon.name + '(' + player.weapon.damage + ')';
        divWeaponElt.classList.add('weapon-value');
        divWeaponElt.style.position = "absolute";
        switch (indicePlayer) {
            case 0:
                divWeaponElt.style.left = "30px";
                break;
            case 1:
                divWeaponElt.style.right = "30px";
                break;
        }
        divWeaponElt.style.zIndex = "20";
        weaponInfoElt[indicePlayer].appendChild(divWeaponElt);
        var avatarIconElt = document.getElementsByClassName('avatar-icon');
        var divAvatarElt = document.createElement("div");
        divAvatarElt.classList.add("avatar-img");
        var avatar = player.iconUrl;
        var imgAvatar = document.createElement("img");
        imgAvatar.src = avatar;
        divAvatarElt.id = player.name;
        divAvatarElt.style.position = "absolute";
        divAvatarElt.style.top = "10px";
        switch (indicePlayer) {
            case 0:
                divAvatarElt.style.left = "2%";
                break;
            case 1:
                divAvatarElt.style.right = "5%";
                break;
        }
        divAvatarElt.style.zIndex = "0";
        divAvatarElt.style.overflow = "hidden";
        divAvatarElt.appendChild(imgAvatar);
        avatarIconElt[indicePlayer].appendChild(divAvatarElt);
        var nameInfoElt = document.getElementsByClassName('player-name')[indicePlayer];
        nameInfoElt.textContent = player.name;
        nameInfoElt.style.position = "absolute";
        nameInfoElt.style.top = "-5px";
        nameInfoElt.style.fontWeight = "bold";
        switch (indicePlayer) {
            case 0:
                nameInfoElt.style.left = "26%";
                break;
            case 1:
                nameInfoElt.style.right = "26%";
                break;
        }
    };
    MenuManager.updateInfoLife = function (player, indicePlayer) {
        var lifeInfoElt = document.getElementsByClassName("life-value")[indicePlayer];
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
        else if (player.life > 30 && player.life < 75) {
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
        var playerTourElt = document.getElementById(player.name);
        playerTourElt.classList.add("playerTour");
    };
    return MenuManager;
}());
exports.default = MenuManager;
},{}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gameManager_1 = require("./entities/gameManager");
var gameManager = new gameManager_1.default();
gameManager.startGame();
},{"./entities/gameManager":8}]},{},[15])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZW50aXRpZXMvY2FzZS9sb2dpYy9jYXNlTG9naWMudHMiLCJzcmMvZW50aXRpZXMvY2FzZS9tb2RlbC9jYXNlLnRzIiwic3JjL2VudGl0aWVzL2NoYXJhY3Rlci9sb2dpYy9sb2dpY0NoYXJhY3Rlci50cyIsInNyYy9lbnRpdGllcy9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyLnRzIiwic3JjL2VudGl0aWVzL2Nvb3JkL21vZGVsL2Nvb3JkLnRzIiwic3JjL2VudGl0aWVzL2ZpZWxkL2xvZ2ljL2xvZ2ljRmllbGQudHMiLCJzcmMvZW50aXRpZXMvZmllbGQvbW9kZWwvZmllbGQudHMiLCJzcmMvZW50aXRpZXMvZ2FtZU1hbmFnZXIudHMiLCJzcmMvZW50aXRpZXMvbG9nZ2VyLnRzIiwic3JjL2VudGl0aWVzL21lbnVNYW5hZ2VyLnRzIiwic3JjL2VudGl0aWVzL3NpemUvbW9kZWwvc2l6ZS50cyIsInNyYy9lbnRpdGllcy93ZWFwb24vbG9naWMvbG9naWNXZWFwb24udHMiLCJzcmMvZW50aXRpZXMvd2VhcG9uL21vZGVsL3dlYXBvbi50cyIsInNyYy9oZWxwZXJzL0xvZ2ljSGVscGVyLnRzIiwic3JjL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0dBO0lBQUE7SUFrQ0EsQ0FBQztJQTdCRzs7Ozs7O09BTUc7SUFDSSxtQkFBUyxHQUFoQixVQUFpQixXQUFpQjtRQUM5QixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztRQUVuQyxRQUFRLFdBQVcsQ0FBQyxTQUFTLEVBQUU7WUFDM0IsS0FBSyxLQUFLO2dCQUNOLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM3QixNQUFNO1lBRVYsS0FBSyxJQUFJO2dCQUNMLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM3QixNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDaEMsTUFBTTtTQUNiO1FBQ0QsTUFBTSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRS9DLFdBQVcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUIsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQTVCTSxpQkFBTyxHQUFXLFNBQVMsQ0FBQztJQUM1QixnQkFBTSxHQUFXLFFBQVEsQ0FBQztJQStCckMsZ0JBQUM7Q0FsQ0QsQUFrQ0MsSUFBQTtBQUVELGtCQUFlLFNBQVMsQ0FBQzs7OztBQ3ZDekIsd0RBQW1EO0FBR25ELDhEQUF5RDtBQUt6RDtJQVlJLGNBQWM7SUFDZCxjQUFZLFFBQWUsRUFBRSxJQUErQixFQUFFLFdBQTJCO1FBQTVELHFCQUFBLEVBQUEsT0FBZSxtQkFBUyxDQUFDLE1BQU07UUFBRSw0QkFBQSxFQUFBLGtCQUEyQjtRQUVyRixRQUFRLElBQUksRUFBRTtZQUNWLEtBQUssbUJBQVMsQ0FBQyxNQUFNO2dCQUNqQixJQUFJLENBQUMsTUFBTSxHQUFHLHNDQUFzQyxDQUFDO2dCQUNyRCxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztnQkFDdkIsTUFBTTtZQUVWLEtBQUssbUJBQVMsQ0FBQyxPQUFPO2dCQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLHVDQUF1QyxDQUFDO2dCQUN0RCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDdEIsTUFBTTtTQUNiO1FBQ0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDdkIsQ0FBQztJQUVELDRCQUFhLEdBQWIsVUFBYyxXQUFpQjtRQUMzQixJQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFDLENBQUMsRUFBQztZQUM1TCxPQUFPLElBQUksQ0FBQztTQUNmO2FBQUk7WUFDRCxPQUFPLEtBQUssQ0FBQztTQUNoQjtJQUNMLENBQUM7SUFFRCx3QkFBUyxHQUFUO1FBQ0ksSUFBRyxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksRUFBQztZQUNwQixPQUFPLElBQUksQ0FBQztTQUNmO2FBQUk7WUFDRCxPQUFPLEtBQUssQ0FBQztTQUNoQjtJQUNMLENBQUM7SUFJRCwyQkFBWSxHQUFaO1FBRUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFFdkIsQ0FBQztJQUVELHdCQUFTLEdBQVQsVUFBVSxLQUFZLEVBQUUsTUFBYztRQUNsQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixxQkFBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxvQkFBSyxHQUFMLFVBQU0sT0FBb0I7UUFBMUIsaUJBUUM7UUFQRyxJQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQztRQUVuQixJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxVQUFDLEtBQWlCO1lBQ2pDLEtBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEIsQ0FBQyxDQUFDO1FBRUYsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxzQkFBTyxHQUFQLFVBQVEsS0FBaUI7UUFFakIsSUFBSSxhQUFhLEdBQUcsUUFBUSxDQUFDLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO1FBRW5DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzNDLElBQUksWUFBWSxHQUFpQixhQUFhLENBQUMsQ0FBQyxDQUFFLENBQUM7WUFDbkQsWUFBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztTQUNuRDtRQUVELElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxNQUFNLElBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUN4QyxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3RCwyQ0FBMkM7UUFDM0MsSUFBSSxRQUFRLENBQUMsU0FBUyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUNyQyxPQUFPO1NBQ1Y7UUFDRCwyQkFBMkI7UUFFM0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBR3JFLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUU3QyxDQUFDO0lBR0wsV0FBQztBQUFELENBcEdBLEFBb0dDLElBQUE7QUFJRCxrQkFBZSxJQUFJLENBQUM7Ozs7QUM5R3BCLDZEQUF3RDtBQUV4RCxpREFBNEM7QUFFNUMsSUFBTSxhQUFhLEdBQUcsRUFBRSxDQUFDO0FBRXpCO0lBQUE7SUEwRUEsQ0FBQztJQXhFVSxtQ0FBb0IsR0FBM0IsVUFBNEIsS0FBWSxFQUFFLGFBQXFCLEVBQUUsT0FBZTtRQUM1RSxJQUFJLE1BQU0sR0FBRyxJQUFJLG1CQUFTLENBQUMsYUFBYSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDO1FBR25GLElBQUksT0FBTyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLFdBQVcsRUFBRTtZQUU1QyxPQUFNLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLG9CQUFvQixFQUFFLEVBQUM7Z0JBQ3ZGLE1BQU0sR0FBRyxJQUFJLG1CQUFTLENBQUMsYUFBYSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDO2FBQ2xGO1NBRUY7UUFFSCxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDaEYsSUFBSSxPQUFPLEdBQXFCLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUQsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU3QyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QixPQUFPLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDN0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO1FBQ2hDLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFFLEdBQUcsQ0FBQztRQUNoRSxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7UUFDcEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQzVCLCtCQUErQjtRQUMvQixxQ0FBcUM7UUFDckMsSUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwRCxvQ0FBb0M7UUFDcEMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQztRQUNyQixPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFakMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN0RCxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBRXJELEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVNLDhCQUFlLEdBQXRCLFVBQXVCLEtBQVksRUFBRSxNQUFpQixFQUFFLFVBQWdCO1FBRXBFLElBQUksT0FBTyxHQUFxQixRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlELElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFN0MsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUIsT0FBTyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQzdCLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztRQUNoQyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDaEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO1FBQ3BDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUN4QixPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7UUFDekIsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQzVCLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hDLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0IsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDbkMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsQyxNQUFNLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQztJQUN6QixDQUFDO0lBRU0saUNBQWtCLEdBQXpCLFVBQTBCLE1BQWlCLEVBQUUsUUFBZTtRQUV4RCxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDMUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBRTdDLENBQUM7SUFFTSxrQ0FBbUIsR0FBMUIsVUFBMkIsTUFBaUI7UUFDeEMsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztRQUNwRSxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO1FBQ25FLElBQUksc0JBQXNCLEdBQUcsSUFBSSxlQUFLLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzdELE1BQU0sQ0FBQyxhQUFhLEdBQUcsc0JBQXNCLENBQUM7SUFDbEQsQ0FBQztJQUVMLHFCQUFDO0FBQUQsQ0ExRUEsQUEwRUMsSUFBQTtBQUVELGtCQUFlLGNBQWMsQ0FBQzs7OztBQ25GOUIsb0RBQStDO0FBQy9DLDhEQUF5RDtBQUV6RCwwREFBcUQ7QUFFckQsaURBQTRDO0FBQzVDLHVDQUFrQztBQUdsQywyQkFBMkI7QUFDM0I7SUFnQkcsY0FBYztJQUNkLG1CQUFZLElBQVksRUFBRSxPQUFlLEVBQUUsU0FBZTtRQUN2RCxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNoQixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxnQkFBTSxDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztRQUMxRSxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUU1QixDQUFDO0lBRUQsOEJBQVUsR0FBVixVQUFXLFVBQWdCLEVBQUUsS0FBWTtRQUN0QyxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUNoQyxVQUFVLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDMUIsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQztRQUVoRiwyREFBMkQ7SUFDOUQsQ0FBQztJQUVELGdDQUFZLEdBQVosVUFBYSxXQUFpQixFQUFFLEtBQVk7UUFDekMsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLElBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFDO1lBQ2hELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDZCxJQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQztnQkFDakQsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7YUFDOUI7aUJBQUk7Z0JBQ0YsS0FBSyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQzthQUNuQztZQUNBLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckUsS0FBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQztnQkFDbEMsSUFBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLEtBQUssSUFBSSxFQUFDO29CQUM3QyxPQUFPLEdBQUcsSUFBSSxDQUFDO2lCQUNqQjthQUVIO1NBQ0o7YUFBSTtZQUNGLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNkLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBQztnQkFDOUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7YUFDakM7aUJBQUk7Z0JBQ0YsS0FBSyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQzthQUNuQztZQUNBLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckUsS0FBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLE1BQU0sRUFBRSxHQUFHLEVBQUUsRUFBQztnQkFDbEMsSUFBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssSUFBSSxFQUFDO29CQUM3QyxPQUFPLEdBQUcsSUFBSSxDQUFDO2lCQUNqQjthQUVIO1NBQ0o7UUFDRCxJQUFHLE9BQU8sS0FBSyxJQUFJLEVBQUM7WUFDakIsT0FBTyxJQUFJLENBQUM7U0FDZDthQUFJO1lBQ0YsT0FBTyxLQUFLLENBQUM7U0FDZjtJQUNILENBQUM7SUFFRixtQ0FBZSxHQUFmLFVBQWdCLFdBQWlCLEVBQUUsS0FBWTtRQUM1QyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckUsSUFBSSxNQUFNLElBQUksQ0FBQyxJQUFLLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDOUIsSUFBRyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFDO2dCQUN0RyxJQUFHLENBQUMsV0FBVyxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxFQUFDO29CQUNwRSxPQUFPLElBQUksQ0FBQztpQkFDWDtxQkFBSTtvQkFDRixPQUFPLEtBQUssQ0FBQTtpQkFDZDthQUNIO1NBQ0E7YUFBSTtZQUNGLE9BQU8sS0FBSyxDQUFDO1NBQ2Y7SUFDSixDQUFDO0lBRUQsa0NBQWMsR0FBZDtRQUNHLElBQUksV0FBVyxHQUFHLEtBQUssRUFBUSxDQUFDO1FBQ2hDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQy9DLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQy9DLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztRQUV4QyxLQUFJLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFDO1lBQ2pDLEtBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUM7Z0JBQ2pDLElBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDO29CQUMvQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDMUM7YUFDSDtTQUNIO1FBQ0QsT0FBTyxXQUFXLENBQUM7SUFDdEIsQ0FBQztJQUVELHdDQUFvQixHQUFwQjtRQUNHLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQztRQUN0QixLQUF1QixVQUFnQixFQUFoQixLQUFBLElBQUksQ0FBQyxXQUFXLEVBQWhCLGNBQWdCLEVBQWhCLElBQWdCLEVBQUM7WUFBcEMsSUFBSSxXQUFXLFNBQUE7WUFDaEIsSUFBRyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUM7Z0JBQ3ZCLFVBQVUsR0FBRyxLQUFLLENBQUM7YUFDckI7U0FDSDtRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ3JCLENBQUM7SUFFRCwwQkFBTSxHQUFOLFVBQU8sS0FBWSxFQUFFLFVBQWdCO1FBQXJDLGlCQXVDQztRQXRDRSxJQUFJLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDMUIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN6QixJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQ2pDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztRQUMxQyxJQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxFQUFDO1lBRXhDLElBQUksZUFBZSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQUMsVUFBVTtnQkFDdEQsT0FBTyxDQUFDLFVBQVUsS0FBSyxLQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzRCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksVUFBVSxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV4QyxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztZQUN2QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN6QyxJQUFHLFVBQVUsQ0FBQyxTQUFTLEVBQUUsRUFBQztnQkFDdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNsQyxhQUFhLEdBQUcsSUFBSSxDQUFDO2dCQUNyQixNQUFNLENBQUMsaUJBQWlCLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsa0JBQWtCLEdBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUUsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzdLLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsa0JBQWtCLEdBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUUsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ2hLLHFCQUFXLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUNsRjtZQUVHLHdCQUFjLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekMsd0JBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzdELElBQUcsYUFBYSxFQUFDO2dCQUNkLHFCQUFXLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUN4RztZQUdKLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7WUFDOUMscUJBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNuRSxNQUFNLENBQUMsaUJBQWlCLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUM7WUFDL0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxZQUFZLENBQUMsQ0FBQztZQUNsRixtREFBbUQ7U0FDbEQ7YUFBSTtZQUNGLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBQ3hELE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztTQUM3QztJQUNKLENBQUM7SUFFRCwwQkFBTSxHQUFOO1FBQUEsaUJBZUM7UUFkRSxJQUFJLE1BQU0sR0FBRyxJQUFJLGdCQUFNLEVBQUUsQ0FBQztRQUMxQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFDLFFBQVE7WUFDbkUsT0FBTyxDQUFDLFFBQVEsS0FBSyxLQUFJLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVOLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTdFLElBQUcsUUFBUSxDQUFDLFdBQVcsS0FBSyxJQUFJLEVBQUM7WUFDOUIsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3JFO2FBQUk7WUFDSCxRQUFRLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7U0FDcEQ7UUFDRCxxQkFBVyxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDcEQsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLGlCQUFpQixDQUFDLENBQUM7SUFDcEcsQ0FBQztJQUVELDJCQUFPLEdBQVA7UUFDRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztJQUMzQixDQUFDO0lBQ0osZ0JBQUM7QUFBRCxDQXJMQSxBQXFMQyxJQUFBO0FBRUQsa0JBQWUsU0FBUyxDQUFDOzs7O0FDbE16QiwyQkFBMkI7QUFDM0I7SUFLSSxjQUFjO0lBQ2QsZUFBWSxDQUFTLEVBQUUsQ0FBUztRQUM1QixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2YsQ0FBQztJQUNMLFlBQUM7QUFBRCxDQVZBLEFBVUMsSUFBQTtBQUNELGtCQUFlLEtBQUssQ0FBQzs7OztBQ1pyQiw4Q0FBeUM7QUFDekMsd0NBQW1DO0FBQ25DLHdEQUFtRDtBQUNuRCxvREFBK0M7QUFDL0MsOERBQXlEO0FBRXpELHVFQUFrRTtBQUNsRSxpREFBNEM7QUFFNUMsd0VBQXdFO0FBQ3hFO0lBQUE7SUF5RUEsQ0FBQztJQXZFRTs7OztPQUlHO0lBQ0ksc0JBQVcsR0FBbEIsVUFBbUIsQ0FBUyxFQUFFLENBQVM7UUFDcEMsSUFBSSxVQUFVLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM5QyxJQUFJLEtBQUssR0FBVSxJQUFJLGVBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbkMsS0FBSyxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUMvQixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN0QixLQUFJLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFDO2dCQUM3QixJQUFJLFFBQVEsR0FBRyxJQUFJLGVBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBRXRDLElBQUksWUFBWSxHQUFHLENBQUMsRUFBRTtvQkFDbkIsSUFBSSxXQUFXLEdBQUcsSUFBSSxjQUFJLENBQUMsUUFBUSxFQUFFLG1CQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ3hELEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDO29CQUNwQyxZQUFZLEdBQUcsWUFBWSxHQUFHLENBQUMsQ0FBQztpQkFDbEM7cUJBQU07b0JBQ0osSUFBSSxjQUFjLEdBQUcsSUFBSSxjQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ3hDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsY0FBYyxDQUFDO2lCQUN6QzthQUNIO1NBQ0E7UUFDRCxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFcEIsT0FBTyxLQUFLLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxxQkFBVSxHQUFqQixVQUFrQixhQUEwQixFQUFFLEtBQVk7UUFHdkQsS0FBSyxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQzFDLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUUsR0FBRyxDQUFDO1lBQzNELE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztZQUNuQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNoQyxLQUFLLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUM7Z0JBQzVDLElBQUksTUFBTSxHQUFHLG1CQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUM3QjtZQUNELGFBQWEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDcEM7SUFDRCxDQUFDO0lBR08sb0JBQVMsR0FBaEIsVUFBaUIsS0FBWTtRQUMxQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzFCLElBQUksTUFBTSxHQUFHLElBQUksZ0JBQU0sQ0FBQyxTQUFTLEdBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBQyxDQUFDLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztZQUM3RSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM1QjtRQUNELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDMUIsSUFBSSxNQUFNLEdBQUcsSUFBSSxnQkFBTSxDQUFDLGNBQWMsR0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFDLENBQUMsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO1lBQ2xGLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzVCO1FBQ0QsS0FBa0IsVUFBYSxFQUFiLEtBQUEsS0FBSyxDQUFDLE9BQU8sRUFBYixjQUFhLEVBQWIsSUFBYSxFQUFDO1lBQTVCLElBQUksTUFBTSxTQUFBO1lBQ1gscUJBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FFOUM7SUFDSixDQUFDO0lBRUssd0JBQWEsR0FBcEIsVUFBcUIsS0FBWTtRQUM5Qix3QkFBYyxDQUFDLG9CQUFvQixDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUUsb0NBQW9DLENBQUMsQ0FBQztRQUNqRyx3QkFBYyxDQUFDLG9CQUFvQixDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsb0NBQW9DLENBQUMsQ0FBQztJQUNoRyxDQUFDO0lBQ0osaUJBQUM7QUFBRCxDQXpFQSxBQXlFQyxJQUFBO0FBRUQsa0JBQWUsVUFBVSxDQUFDOzs7O0FDcEYxQixpREFBNEM7QUFDNUMsOENBQXlDO0FBR3pDLDREQUF1RDtBQUd2RCwyQkFBMkI7QUFDM0I7SUFRSSxjQUFjO0lBQ2QsZUFBWSxDQUFTLEVBQUUsQ0FBUztRQUM1QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssRUFBZSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7O09BR0c7SUFDSCx1QkFBTyxHQUFQLFVBQVEsU0FBaUI7UUFDckIsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVEOzs7T0FHRztJQUNILDBCQUFVLEdBQVYsVUFBVyxRQUFlO1FBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRDs7T0FFRztJQUNILGdDQUFnQixHQUFoQjtRQUNJLElBQUksZ0JBQWdCLEdBQVcsQ0FBQyxDQUFDO1FBQ2pDLEtBQUssSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUN4QyxLQUFLLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUM7Z0JBQzNDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUU7b0JBQ2hDLGdCQUFnQixHQUFHLGdCQUFnQixHQUFHLENBQUMsQ0FBQztpQkFDM0M7YUFDSjtTQUNKO1FBQ0csT0FBTyxnQkFBZ0IsQ0FBQztJQUM1QixDQUFDO0lBRUQ7O09BRUc7SUFDSCxrQ0FBa0IsR0FBbEI7UUFDSSxJQUFJLGVBQWUsR0FBZ0IsRUFBRSxDQUFDO1FBQ3RDLEtBQUssSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUN4QyxLQUFLLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUM7Z0JBQzNDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRTtvQkFDakMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDckMsZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztpQkFDbkM7YUFDSjtTQUNKO1FBQ0csT0FBTyxlQUFlLENBQUM7SUFDM0IsQ0FBQztJQUVELCtCQUFlLEdBQWY7UUFDSSxJQUFJLFlBQVksR0FBZ0IsRUFBRSxDQUFDO1FBQ25DLEtBQUssSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUN4QyxLQUFLLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUM7Z0JBQzNDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUU7b0JBQ2hDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3JDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7aUJBQ2hDO2FBQ0o7U0FDSjtRQUNHLE9BQU8sWUFBWSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxpQ0FBaUIsR0FBakI7UUFDSSxJQUFJLGNBQWMsR0FBZ0IsRUFBRSxDQUFDO1FBQ3JDLEtBQUssSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUN4QyxLQUFLLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUM7Z0JBQzNDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRTtvQkFDckUsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDckMsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztpQkFDbEM7YUFDSjtTQUNKO1FBQ0csT0FBTyxjQUFjLENBQUM7SUFDMUIsQ0FBQztJQUVEOzs7T0FHRztJQUNILGlDQUFpQixHQUFqQixVQUFrQixRQUFlO1FBRTdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEQsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFDO1lBQ3ZCLE9BQU8sU0FBUyxDQUFDO1NBQ3BCO2FBQUk7WUFDRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM3QztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNILDZCQUFhLEdBQWI7UUFDSSxJQUFJLE9BQU8sR0FBRyxxQkFBVyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVELElBQUksT0FBTyxHQUFHLHFCQUFXLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUM7UUFFNUQsSUFBSSxXQUFXLEdBQUcsSUFBSSxlQUFLLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRTlDLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNyRCxJQUFJLFdBQVcsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNyRSxPQUFNLFdBQVcsS0FBSyxJQUFJLElBQUksV0FBVyxLQUFLLFNBQVMsSUFBSSxVQUFVLEtBQUssU0FBUyxJQUFJLFVBQVUsS0FBSyxJQUFJLEVBQUM7WUFFdkcsSUFBSSxTQUFPLEdBQUcscUJBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1RCxJQUFJLFNBQU8sR0FBRyxxQkFBVyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTVELElBQUksYUFBVyxHQUFHLElBQUksZUFBSyxDQUFDLFNBQU8sRUFBRSxTQUFPLENBQUMsQ0FBQztZQUU5QyxVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQVcsQ0FBQyxDQUFDO1NBQ25EO1FBQ0YsT0FBTyxVQUFVLENBQUM7SUFDdEIsQ0FBQztJQUdELHVDQUF1QixHQUF2QjtRQUVJLElBQUksZUFBZSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBRWhELElBQUksTUFBTSxHQUFHLHFCQUFXLENBQUMsa0JBQWtCLENBQUMsZUFBZSxDQUFDLE1BQU0sR0FBQyxDQUFDLENBQUMsQ0FBQztRQUV0RSxJQUFJLG9CQUFvQixHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVuRCxPQUFPLG9CQUFvQixDQUFDO0lBQ2hDLENBQUM7SUFHRCxzQ0FBc0IsR0FBdEI7UUFDSSxJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUU5QyxJQUFJLE1BQU0sR0FBRyxxQkFBVyxDQUFDLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLENBQUM7UUFFckUsSUFBSSxtQkFBbUIsR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFakQsT0FBTyxtQkFBbUIsQ0FBQztJQUMvQixDQUFDO0lBR0QsbUNBQW1CLEdBQW5CO1FBQ0ksSUFBSSxTQUFTLEdBQUcsS0FBSyxFQUFRLENBQUM7UUFDOUIsS0FBSyxJQUFJLEdBQUcsR0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ3RDLEtBQUksSUFBSSxHQUFHLEdBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBQztnQkFDekMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDckMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUM1QjtTQUNKO1FBQ0csT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUVELDJCQUFXLEdBQVg7UUFDSSxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUUzQyxLQUFJLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUM7WUFDdEMsS0FBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFDO2dCQUV0QyxJQUFJLE1BQU0sR0FBRyxxQkFBVyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBRWhFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM5RCxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUMsQ0FBQzthQUU5QjtTQUNKO0lBQ0wsQ0FBQztJQUVELDRCQUFZLEdBQVosVUFBYSxFQUFXO1FBQ3BCLEtBQW9CLFVBQVUsRUFBVixLQUFBLElBQUksQ0FBQyxLQUFLLEVBQVYsY0FBVSxFQUFWLElBQVUsRUFBQztZQUEzQixJQUFJLFFBQVEsU0FBQTtZQUNaLEtBQXFCLFVBQVEsRUFBUixxQkFBUSxFQUFSLHNCQUFRLEVBQVIsSUFBUSxFQUFDO2dCQUExQixJQUFJLFNBQVMsaUJBQUE7Z0JBQ2IsSUFBRyxTQUFTLENBQUMsR0FBRyxLQUFLLEVBQUUsRUFBQztvQkFDcEIsT0FBTyxTQUFTLENBQUM7aUJBRXBCO2FBQ0o7U0FDSjtJQUNMLENBQUM7SUFDTCxZQUFDO0FBQUQsQ0E3TEEsQUE2TEMsSUFBQTtBQUVELGtCQUFlLEtBQUssQ0FBQzs7OztBQ3RNckIsdURBQWtEO0FBT2xELG1DQUE4QjtBQUM5Qiw2Q0FBd0M7QUFFeEM7SUFXSTs7T0FFRztJQUNIO1FBWkEsT0FBRSxHQUFXLE9BQU8sQ0FBQztRQUdyQixZQUFPLEdBQVcsQ0FBQyxDQUFDO1FBVWhCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxLQUFLLEVBQWEsQ0FBQztRQUN0QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksZ0JBQU0sRUFBRSxDQUFDO1FBQzNCLElBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELG9DQUFjLEdBQWQ7UUFDSSxLQUFvQixVQUFnQixFQUFoQixLQUFBLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFoQixjQUFnQixFQUFoQixJQUFnQixFQUFDO1lBQWpDLElBQUksUUFBUSxTQUFBO1lBQ1osS0FBd0IsVUFBUSxFQUFSLHFCQUFRLEVBQVIsc0JBQVEsRUFBUixJQUFRLEVBQUM7Z0JBQTdCLElBQUksWUFBWSxpQkFBQTtnQkFDaEIsWUFBWSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7YUFDbkM7U0FDSjtJQUNMLENBQUM7SUFFRCwrQkFBUyxHQUFUO1FBQ0ksSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2xELE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUVoQyxJQUFJLEtBQUssR0FBRyxvQkFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFM0MsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFFbkIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXRCLG9CQUFVLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFL0Qsb0JBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFNUIsb0JBQVUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFaEMscUJBQXFCO1FBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxxQkFBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUkxQixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUV6QixJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxZQUFZLENBQUMsQ0FBQztRQUNuRixPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxZQUFZLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBRUQsdUNBQWlCLEdBQWpCO1FBQ0ksS0FBSSxJQUFJLEdBQUcsR0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBQztZQUMxQyxLQUFJLElBQUksR0FBRyxHQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFDO2dCQUMxQyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDakQsSUFBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksSUFBSSxXQUFXLEtBQUssSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUM7b0JBQ3pHLFdBQVcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2lCQUNuRDthQUNKO1NBQ0o7SUFDRCxDQUFDO0lBS0wsa0JBQUM7QUFBRCxDQXRFQSxBQXNFQyxJQUFBO0FBQ0Qsa0JBQWUsV0FBVyxDQUFDOzs7O0FDekUzQjtJQUlJO1FBQ0ksSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLEVBQVUsQ0FBQztRQUVoQyxJQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUwsa0NBQWlCLEdBQWpCLFVBQWtCLElBQVk7UUFDMUIsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QixJQUFJLGtCQUFrQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQztRQUNoRCxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFL0MsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzVELElBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFDO1lBQ3JELFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ3pDO1FBRUQsVUFBVSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFHM0QsV0FBVyxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSx1Q0FBdUMsR0FBRSxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEdBQUUsUUFBUSxDQUFDLENBQUM7SUFHdkksQ0FBQztJQUlELGFBQUM7QUFBRCxDQWhDQSxBQWdDQyxJQUFBO0FBQ0Qsa0JBQWUsTUFBTSxDQUFDOzs7O0FDdkN0QjtJQUFBO0lBK0lBLENBQUM7SUE3SVUsbUJBQU8sR0FBZCxVQUFlLFdBQXdCO1FBRW5DLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4QyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU1RixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDeEMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFNUYsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUV0RCxDQUFDO0lBRU0sbUJBQU8sR0FBZCxVQUFlLE1BQWlCLEVBQUUsWUFBb0I7UUFDbEQsSUFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQy9ELElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0MsVUFBVSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3ZDLFVBQVUsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztRQUN2QyxRQUFRLFlBQVksRUFBRTtZQUNsQixLQUFLLENBQUM7Z0JBQ0YsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFBO2dCQUM5QixNQUFNO1lBRVYsS0FBSyxDQUFDO2dCQUNGLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQTtnQkFDL0IsTUFBTTtTQUNiO1FBQ0QsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQy9CLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztRQUU1QyxJQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsc0JBQXNCLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbkUsSUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqRCxZQUFZLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFFLEdBQUcsR0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBQyxHQUFHLENBQUM7UUFDNUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDM0MsWUFBWSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO1FBQ3pDLFFBQVEsWUFBWSxFQUFFO1lBQ2xCLEtBQUssQ0FBQztnQkFDRixZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUE7Z0JBQ2hDLE1BQU07WUFFVixLQUFLLENBQUM7Z0JBQ0YsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFBO2dCQUNqQyxNQUFNO1NBQ2I7UUFDRCxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDakMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUV0RCxJQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsc0JBQXNCLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbkUsSUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqRCxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUN4QyxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQzVCLElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUM7UUFFdkIsWUFBWSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQzlCLFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztRQUN6QyxZQUFZLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUM7UUFDaEMsUUFBUSxZQUFZLEVBQUU7WUFDbEIsS0FBSyxDQUFDO2dCQUNGLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtnQkFDOUIsTUFBTTtZQUVWLEtBQUssQ0FBQztnQkFDRixZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUE7Z0JBQy9CLE1BQU07U0FDYjtRQUNELFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNoQyxZQUFZLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDdkMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNwQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRXRELElBQUksV0FBVyxHQUFtQixRQUFRLENBQUMsc0JBQXNCLENBQUMsYUFBYSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDL0YsV0FBVyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ3RDLFdBQVcsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztRQUN4QyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUM7UUFDL0IsV0FBVyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO1FBQ3RDLFFBQVEsWUFBWSxFQUFFO1lBQ2xCLEtBQUssQ0FBQztnQkFDRixXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUE7Z0JBQzlCLE1BQU07WUFFVixLQUFLLENBQUM7Z0JBQ0YsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO2dCQUMvQixNQUFNO1NBQ2I7SUFDTCxDQUFDO0lBRU0sMEJBQWMsR0FBckIsVUFBc0IsTUFBaUIsRUFBRSxZQUFvQjtRQUV6RCxJQUFJLFdBQVcsR0FBRyxRQUFRLENBQUMsc0JBQXNCLENBQUMsWUFBWSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFOUUsV0FBVyxDQUFDLFNBQVMsR0FBQyxFQUFFLENBQUM7UUFDekIsV0FBVyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTlDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFHaEQsQ0FBQztJQUVNLDRCQUFnQixHQUF2QixVQUF3QixNQUFpQixFQUFFLFlBQW9CO1FBRTNELElBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUU5RSxJQUFHLE1BQU0sQ0FBQyxjQUFjLEtBQUssU0FBUyxFQUFDO1lBQ3ZDLElBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLEVBQUM7Z0JBQzNELE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2FBQzdEO2lCQUFLLElBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLEVBQUM7Z0JBQ25FLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2FBQy9EO2lCQUFLLElBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEVBQUM7Z0JBQ2hFLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2FBQzVEO1NBQ0o7UUFFRyxJQUFHLE1BQU0sQ0FBQyxJQUFJLEdBQUcsRUFBRSxFQUFDO1lBQ2hCLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FDaEQ7YUFBSyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEdBQUcsRUFBRSxJQUFJLE1BQU0sQ0FBQyxJQUFJLEdBQUcsRUFBRSxFQUFFO1lBQzVDLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7U0FDbEQ7YUFBTTtZQUNILFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDL0M7SUFDTCxDQUFDO0lBRU0sNEJBQWdCLEdBQXZCLFVBQXdCLE1BQWlCLEVBQUUsWUFBb0I7UUFDM0QsSUFBSSxhQUFhLEdBQUcsUUFBUSxDQUFDLHNCQUFzQixDQUFDLGNBQWMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRWxGLGFBQWEsQ0FBQyxTQUFTLEdBQUMsRUFBRSxDQUFDO1FBQzNCLGFBQWEsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUUsR0FBRyxHQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFDLEdBQUcsQ0FBQztJQUVqRixDQUFDO0lBRU0sZ0NBQW9CLEdBQTNCLFVBQTRCLE1BQWlCO1FBQ3pDLElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMvRCxJQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBQztZQUN6RCxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUM1QztRQUNELElBQUksYUFBYSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pELGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBRTlDLENBQUM7SUFFTCxrQkFBQztBQUFELENBL0lBLEFBK0lDLElBQUE7QUFDRCxrQkFBZSxXQUFXLENBQUM7Ozs7QUNwSjNCLDJCQUEyQjtBQUMzQjtJQUtJLGNBQWM7SUFDZCxjQUFZLENBQVMsRUFBRSxDQUFTO1FBQzVCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZixDQUFDO0lBQ0wsV0FBQztBQUFELENBVkEsQUFVQyxJQUFBO0FBQ0Qsa0JBQWUsSUFBSSxDQUFDOzs7O0FDUHBCO0lBQUE7SUF3Q0EsQ0FBQztJQXJDVSw0QkFBZ0IsR0FBdkIsVUFBd0IsS0FBWSxFQUFFLE1BQWM7UUFDaEQsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDaEQsSUFBSSxTQUFTLEdBQXFCLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEUsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3QyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoQyxTQUFTLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDL0IsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO1FBQ2xDLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUNsQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7UUFDdEMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO1FBQzVCLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUMzQixTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDOUIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMvQixRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEUsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUM5RSxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQzFFLE1BQU0sQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDO0lBRXpCLENBQUM7SUFFTSx1QkFBVyxHQUFsQixVQUFtQixVQUFnQixFQUFFLE1BQWMsRUFBRSxLQUFZO1FBRTdELElBQUksU0FBUyxHQUFxQixRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hFLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDN0MsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEMsU0FBUyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQy9CLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztRQUNsQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDbEMsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO1FBQ3RDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQztRQUM1QixTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7UUFDM0IsU0FBUyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQzlCLE9BQU8sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDL0IsUUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hFLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDMUUsTUFBTSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQztJQUNMLGtCQUFDO0FBQUQsQ0F4Q0EsQUF3Q0MsSUFBQTtBQUVELGtCQUFlLFdBQVcsQ0FBQzs7OztBQzdDM0IsMkJBQTJCO0FBQzNCO0lBUUcsY0FBYztJQUNkLGdCQUFZLElBQVksRUFBRSxNQUFjLEVBQUUsT0FBZTtRQUN0RCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUMxQixDQUFDO0lBR0osYUFBQztBQUFELENBaEJBLEFBZ0JDLElBQUE7QUFFRCxrQkFBZSxNQUFNLENBQUM7Ozs7QUNwQnRCO0lBQUE7SUFNQSxDQUFDO0lBTFUsOEJBQWtCLEdBQXpCLFVBQTBCLFNBQWlCO1FBRXZDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUMsU0FBUyxDQUFDLENBQUM7SUFFL0MsQ0FBQztJQUNMLGtCQUFDO0FBQUQsQ0FOQSxBQU1DLElBQUE7QUFFRCxrQkFBZSxXQUFXLENBQUM7Ozs7QUNMM0Isc0RBQWlEO0FBRWpELElBQUksV0FBVyxHQUFHLElBQUkscUJBQVcsRUFBRSxDQUFDO0FBQ3BDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuLi8uLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5cclxuYWJzdHJhY3QgY2xhc3MgQ2FzZUxvZ2ljIHtcclxuXHJcbiAgICBzdGF0aWMgQkxPQ0tFRDogc3RyaW5nID0gXCJCTE9DS0VEXCI7XHJcbiAgICBzdGF0aWMgTk9STUFMOiBzdHJpbmcgPSBcIk5PUk1BTFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gcGFydHlGaWVsZCBcclxuICAgICAqIEBwYXJhbSBsaXN0T2ZDYXNlc1RlbXAgXHJcbiAgICAgKiBAcGFyYW0gZWxlbWVudFRvRmlsbCBcclxuICAgICAqIEBwYXJhbSBuYnJPZlJlbWFpbmluZ0Nhc2VzIFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcGFpbnRDYXNlKGNhc2VUb1BhaW50OiBDYXNlKTogSFRNTERpdkVsZW1lbnQge1xyXG4gICAgICAgIGxldCBkaXZFbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRpdkVsdC5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcclxuXHJcbiAgICAgICAgc3dpdGNoIChjYXNlVG9QYWludC5pc0Jsb2NrZWQpIHtcclxuICAgICAgICAgICAgY2FzZSBmYWxzZTpcclxuICAgICAgICAgICAgICAgIGRpdkVsdC5jbGFzc0xpc3QuYWRkKFwiY2FzZVwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSB0cnVlOlxyXG4gICAgICAgICAgICAgICAgZGl2RWx0LmNsYXNzTGlzdC5hZGQoXCJjYXNlXCIpO1xyXG4gICAgICAgICAgICAgICAgZGl2RWx0LmNsYXNzTGlzdC5hZGQoXCJibG9ja2VkXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRpdkVsdC5pZCA9IFN0cmluZyhjYXNlVG9QYWludC5wb3NpdGlvblN0cmluZyk7XHJcblxyXG4gICAgICAgIGNhc2VUb1BhaW50LnNldEVsKGRpdkVsdCk7XHJcbiAgICAgICAgcmV0dXJuIGRpdkVsdDtcclxuICAgIH1cclxuXHJcblxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2FzZUxvZ2ljOyIsImltcG9ydCBDYXNlTG9naWMgZnJvbSBcIi4uLy4uL2Nhc2UvbG9naWMvY2FzZUxvZ2ljXCI7XHJcbmltcG9ydCBDb29yZCBmcm9tIFwiLi4vLi4vY29vcmQvbW9kZWwvY29vcmRcIjtcclxuaW1wb3J0IFdlYXBvbiBmcm9tIFwiLi4vLi4vd2VhcG9uL21vZGVsL3dlYXBvblwiO1xyXG5pbXBvcnQgTG9naWNXZWFwb24gZnJvbSBcIi4uLy4uL3dlYXBvbi9sb2dpYy9sb2dpY1dlYXBvblwiO1xyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4uLy4uL2ZpZWxkL21vZGVsL2ZpZWxkXCI7XHJcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4uLy4uL2NoYXJhY3Rlci9tb2RlbC9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IEdhbWVNYW5hZ2VyIGZyb20gXCIuLi8uLi9nYW1lTWFuYWdlclwiO1xyXG5cclxuY2xhc3MgQ2FzZSB7XHJcbiAgICAvL2ZpZWxkIFxyXG4gICAgaW1nVXJsOiBzdHJpbmc7XHJcbiAgICBpc0Jsb2NrZWQ6IGJvb2xlYW47XHJcbiAgICBpc0F2YWlsYWJsZTogYm9vbGVhbjtcclxuICAgIHBvc2l0aW9uOiBDb29yZDtcclxuICAgIHBvc2l0aW9uU3RyaW5nOiBzdHJpbmc7XHJcbiAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICB3ZWFwb246IFdlYXBvbjtcclxuICAgIGdhbWVNYW5hZ2VyOiBHYW1lTWFuYWdlcjtcclxuICAgICRlbDogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgLy9jb25zdHJ1Y3RvciBcclxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uOiBDb29yZCwgdHlwZTogc3RyaW5nID0gQ2FzZUxvZ2ljLk5PUk1BTCwgaXNBdmFpbGFibGU6IGJvb2xlYW4gPSB0cnVlKSB7XHJcblxyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIENhc2VMb2dpYy5OT1JNQUw6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmltZ1VybCA9IFwiL2Fzc2V0cy9pbWcvbm9ybWFsLWZpZWxkL3RpbGUtMkQucG5nXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzQmxvY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIENhc2VMb2dpYy5CTE9DS0VEOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbWdVcmwgPSBcIi9hc3NldHMvaW1nL2Jsb2NrZWQtZmllbGQvdGlsZS0yRC5wbmdcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNCbG9ja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmlzQXZhaWxhYmxlID0gaXNBdmFpbGFibGU7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb25TdHJpbmcgPSBTdHJpbmcocG9zaXRpb24ueCkgKyBTdHJpbmcocG9zaXRpb24ueSk7XHJcbiAgICAgICAgdGhpcy53ZWFwb24gPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNhc2VzQWRqYWNlbnQoY2FzZVRvQ2hlY2s6IENhc2UpOiBCb29sZWFue1xyXG4gICAgICAgIGlmKHRoaXMucG9zaXRpb24ueCA9PT0gY2FzZVRvQ2hlY2sucG9zaXRpb24ueCsxIHx8IHRoaXMucG9zaXRpb24ueCA9PT0gY2FzZVRvQ2hlY2sucG9zaXRpb24ueC0xIHx8IHRoaXMucG9zaXRpb24ueSA9PT0gY2FzZVRvQ2hlY2sucG9zaXRpb24ueSsxIHx8IHRoaXMucG9zaXRpb24ueSA9PT0gY2FzZVRvQ2hlY2sucG9zaXRpb24ueS0xKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGFzV2VhcG9uKCl7XHJcbiAgICAgICAgaWYodGhpcy53ZWFwb24gIT09IG51bGwpe1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbW92ZVdlYXBvbigpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMud2VhcG9uLiRlbC5yZW1vdmUoKTtcclxuICAgICAgICB0aGlzLndlYXBvbiA9IG51bGw7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFkZFdlYXBvbihmaWVsZDogRmllbGQsIHdlYXBvbjogV2VhcG9uKXtcclxuICAgICAgICB0aGlzLndlYXBvbiA9IHdlYXBvbjtcclxuICAgICAgICBMb2dpY1dlYXBvbi5wYWludFdlYXBvbih0aGlzLCB3ZWFwb24sIGZpZWxkKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRFbChlbGVtZW50OiBIVE1MRWxlbWVudCk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgICB0aGlzLiRlbCA9IGVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuJGVsLm9uY2xpY2sgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5vbkNsaWNrKGV2ZW50KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy4kZWw7XHJcbiAgICB9XHJcblxyXG4gICAgb25DbGljayhldmVudDogTW91c2VFdmVudCk6IHZvaWR7XHJcbiBcclxuICAgICAgICAgICAgbGV0IGNhc2VzRWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjYXNlJyk7XHJcbiAgICAgICAgICAgIGxldCBmaWVsZCA9IHRoaXMuZ2FtZU1hbmFnZXIuZmllbGQ7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhc2VzRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBjYXNlc0VsZW1lbnQgPSAoPEhUTUxFbGVtZW50PmNhc2VzRWxlbWVudHNbaV0pO1xyXG4gICAgICAgICAgICAgICAgY2FzZXNFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2Nhc2UtcmVhY2hhYmxlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBlbCA9IGV2ZW50LnRhcmdldHx8ZXZlbnQuc3JjRWxlbWVudDtcclxuICAgICAgICAgICAgbGV0IGNhc2VUb0dvID0gZmllbGQuY2FzZXNbdGhpcy5wb3NpdGlvbi54XVt0aGlzLnBvc2l0aW9uLnldO1xyXG5cclxuICAgICAgICAgICAgLy8gRG8gbm90aGluZyBpZiBwbGF5ZXIgc2VsZWN0IGEgQmxvY2sgQ2FzZVxyXG4gICAgICAgICAgICBpZiAoY2FzZVRvR28uaXNCbG9ja2VkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWVNYW5hZ2VyLnNob3dSZWFjaGFibGVDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy93ZSBnZXQgdGhlIGVsZW1lbnQgdGFyZ2V0XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmdhbWVNYW5hZ2VyLnBsYXllclRvdXIubW92ZVRvKHRoaXMuZ2FtZU1hbmFnZXIuZmllbGQsIGNhc2VUb0dvKTtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmdhbWVNYW5hZ2VyLnNob3dSZWFjaGFibGVDYXNlKCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2FzZTsiLCJcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuLi8uLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gXCIuLi8uLi9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IENvb3JkIGZyb20gXCIuLi8uLi9jb29yZC9tb2RlbC9jb29yZFwiO1xyXG5cclxuY29uc3QgZGltZW5zaW9uQ2FzZSA9IDg0O1xyXG5cclxuYWJzdHJhY3QgY2xhc3MgTG9naWNDaGFyYWN0ZXIge1xyXG5cclxuICAgIHN0YXRpYyBwYWludFN0YXJ0Q2hhcmFjdGVycyhmaWVsZDogRmllbGQsIG5hbWVDaGFyYWN0ZXI6IHN0cmluZywgaWNvblVybDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IHBsYXllciA9IG5ldyBDaGFyYWN0ZXIobmFtZUNoYXJhY3RlciwgaWNvblVybCwgZmllbGQuZ2V0QXZhaWxhYmxlUmFuZG9tQ2FzZSgpKTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBmaWVsZC5jaGFyYWN0ZXJzWzBdICE9PSAndW5kZWZpbmVkJykge1xyXG5cclxuICAgICAgICAgICAgd2hpbGUoZmllbGQuY2hhcmFjdGVyc1swXS5jYXNlLmNhc2VzQWRqYWNlbnQocGxheWVyLmNhc2UpIHx8IHBsYXllci5pc0Nsb3NlZENhc2VzQmxvY2tlZCgpKXtcclxuICAgICAgICAgICAgICAgIHBsYXllciA9IG5ldyBDaGFyYWN0ZXIobmFtZUNoYXJhY3RlciwgaWNvblVybCwgZmllbGQuZ2V0QXZhaWxhYmxlUmFuZG9tQ2FzZSgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgZmllbGQuY2FzZXNbcGxheWVyLmNhc2UucG9zaXRpb24ueF1bcGxheWVyLmNhc2UucG9zaXRpb24ueV0uaXNBdmFpbGFibGUgPSBmYWxzZTtcclxuICAgICAgICBsZXQgaW1nQ2hhcjogSFRNTEltYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgbGV0IHNwYW5FbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuXHJcbiAgICAgICAgc3BhbkVsdC5jbGFzc0xpc3QuYWRkKFwiY2hhclwiKTtcclxuICAgICAgICBpbWdDaGFyLnNyYyA9IHBsYXllci5pY29uVXJsO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUubWF4V2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLm1heEhlaWdodCA9IChNYXRoLnJvdW5kKDEwMCAvIGZpZWxkLnNpemUueCkpKyBcIiVcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUuekluZGV4ID0gXCI1MFwiO1xyXG4gICAgICAgIC8vc3BhbkVsdC5hcHBlbmRDaGlsZChpbWdDaGFyKTtcclxuICAgICAgICAvL2xldCBwbGF5ZXJEaXZFbHQgPSBwbGF5ZXIuY2FzZS4kZWw7XHJcbiAgICAgICAgbGV0IHBsYXllckRpdkVsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlnaHRcIik7XHJcbiAgICAgICAgLy9wbGF5ZXJEaXZFbHQuYXBwZW5kQ2hpbGQoc3BhbkVsdCk7XHJcbiAgICAgICAgcGxheWVyRGl2RWx0LmFwcGVuZENoaWxkKGltZ0NoYXIpO1xyXG4gICAgICAgIHBsYXllci4kZWwgPSBpbWdDaGFyO1xyXG4gICAgICAgIGltZ0NoYXIuY2xhc3NMaXN0LmFkZChcInBsYXllclwiKTtcclxuICAgICAgICB0aGlzLnNldEFic29sdXRlUG9zaXRpb24ocGxheWVyKTtcclxuXHJcbiAgICAgICAgcGxheWVyLiRlbC5zdHlsZS5sZWZ0ID0gcGxheWVyLmFic29sdXRlQ29vcmQueSArICdweCc7XHJcbiAgICAgICAgcGxheWVyLiRlbC5zdHlsZS50b3AgPSBwbGF5ZXIuYWJzb2x1dGVDb29yZC54ICsgJ3B4JztcclxuXHJcbiAgICAgICAgZmllbGQuY2hhcmFjdGVycy5wdXNoKHBsYXllcik7XHJcbiAgICAgICAgcGxheWVyLmNhc2UuZ2FtZU1hbmFnZXIucGxheWVycy5wdXNoKHBsYXllcik7XHJcbiAgICB9IFxyXG5cclxuICAgIHN0YXRpYyBwYWludENoYXJhY3RlcnMoZmllbGQ6IEZpZWxkLCBwbGF5ZXI6IENoYXJhY3RlciwgY2FzZVBsYXllcjogQ2FzZSk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgaW1nQ2hhcjogSFRNTEltYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgbGV0IHNwYW5FbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuXHJcbiAgICAgICAgc3BhbkVsdC5jbGFzc0xpc3QuYWRkKFwiY2hhclwiKTtcclxuICAgICAgICBpbWdDaGFyLnNyYyA9IHBsYXllci5pY29uVXJsO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUubWF4V2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLm1heEhlaWdodCA9IFwiNzUlXCI7XHJcbiAgICAgICAgaW1nQ2hhci5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLnRvcCA9IFwiMFwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUubGVmdCA9IFwiMFwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUuekluZGV4ID0gXCI1MFwiO1xyXG4gICAgICAgIGltZ0NoYXIuY2xhc3NMaXN0LmFkZChcInBsYXllclwiKTtcclxuICAgICAgICBzcGFuRWx0LmFwcGVuZENoaWxkKGltZ0NoYXIpO1xyXG4gICAgICAgIGxldCBwbGF5ZXJEaXZFbHQgPSBwbGF5ZXIuY2FzZS4kZWw7XHJcbiAgICAgICAgcGxheWVyRGl2RWx0LmFwcGVuZENoaWxkKHNwYW5FbHQpO1xyXG4gICAgICAgIHBsYXllci4kZWwgPSBzcGFuRWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjaGFyYWN0ZXJBbmltYXRpb24ocGxheWVyOiBDaGFyYWN0ZXIsIG5ld0Nvb3JkOiBDb29yZCl7XHJcblxyXG4gICAgICAgIHBsYXllci4kZWwuc3R5bGUubGVmdCA9IG5ld0Nvb3JkLnkgKyAncHgnO1xyXG4gICAgICAgIHBsYXllci4kZWwuc3R5bGUudG9wID0gbmV3Q29vcmQueCArICdweCc7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzZXRBYnNvbHV0ZVBvc2l0aW9uKHBsYXllcjogQ2hhcmFjdGVyKXtcclxuICAgICAgICBsZXQgYWJzb2x1dGVYID0gcGxheWVyLmNhc2UucG9zaXRpb24ueCpwbGF5ZXIuY2FzZS4kZWwub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICAgIGxldCBhYnNvbHV0ZVkgPSBwbGF5ZXIuY2FzZS5wb3NpdGlvbi55KnBsYXllci5jYXNlLiRlbC5vZmZzZXRXaWR0aDtcclxuICAgICAgICBsZXQgYWJzb2x1dGVQb3NpdGlvblBsYXllciA9IG5ldyBDb29yZChhYnNvbHV0ZVgsIGFic29sdXRlWSk7XHJcbiAgICAgICAgcGxheWVyLmFic29sdXRlQ29vcmQgPSBhYnNvbHV0ZVBvc2l0aW9uUGxheWVyOyBcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IExvZ2ljQ2hhcmFjdGVyOyIsImltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IFdlYXBvbiBmcm9tIFwiLi4vLi4vd2VhcG9uL21vZGVsL3dlYXBvblwiO1xyXG5pbXBvcnQgTG9naWNXZWFwb24gZnJvbSBcIi4uLy4uL3dlYXBvbi9sb2dpYy9sb2dpY1dlYXBvblwiO1xyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4uLy4uL2ZpZWxkL21vZGVsL2ZpZWxkXCI7XHJcbmltcG9ydCBMb2dpY0NoYXJhY3RlciBmcm9tIFwiLi4vbG9naWMvbG9naWNDaGFyYWN0ZXJcIjtcclxuaW1wb3J0IENvb3JkIGZyb20gXCIuLi8uLi9jb29yZC9tb2RlbC9jb29yZFwiO1xyXG5pbXBvcnQgTWVudU1hbmFnZXIgZnJvbSBcIi4uLy4uL21lbnVNYW5hZ2VyXCI7XHJcbmltcG9ydCBMb2dnZXIgZnJvbSBcIi4uLy4uL2xvZ2dlclwiO1xyXG5pbXBvcnQgRmlnaHRNYW5hZ2VyIGZyb20gXCIuLi8uLi9maWdodE1hbmFnZXJcIjtcclxuXHJcbi8vVGhpcyBjbGFzcyBmb3IgdGhlIGZpZWxkc1xyXG5jbGFzcyBDaGFyYWN0ZXIge1xyXG4gICAvL2ZpZWxkIFxyXG4gICBuYW1lOiBzdHJpbmc7XHJcbiAgIGljb25Vcmw6IHN0cmluZztcclxuICAgbGlmZTogbnVtYmVyO1xyXG4gICBsZXZlbDogbnVtYmVyO1xyXG4gICBjYXNlOiBDYXNlO1xyXG4gICBjbG9zZWRDYXNlczogQXJyYXk8Q2FzZT47XHJcbiAgIHdlYXBvbjogV2VhcG9uO1xyXG4gICBhYnNvbHV0ZUNvb3JkOiBDb29yZDtcclxuICAgJGVsOiBIVE1MRWxlbWVudDtcclxuICAgJGF2YXRhckVsdDogSFRNTEVsZW1lbnQ7IFxyXG4gICAkYXZhdGFyTGlmZUVsdDogRWxlbWVudDtcclxuICAgJGF2YXRhcldlYXBvbkVsdDogSFRNTEVsZW1lbnQ7XHJcbiAgIGRlZmVuc2VNb2RlOiBib29sZWFuO1xyXG5cclxuICAgLy9jb25zdHJ1Y3RvciBcclxuICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBpY29uVXJsOiBzdHJpbmcsIHN0YXJ0Q2FzZTogQ2FzZSkge1xyXG4gICAgICB0aGlzLmxpZmUgPSAxMDA7XHJcbiAgICAgIHRoaXMubGV2ZWwgPSA1O1xyXG4gICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICB0aGlzLmljb25VcmwgPSBpY29uVXJsO1xyXG4gICAgICB0aGlzLmNhc2UgPSBzdGFydENhc2U7XHJcbiAgICAgIHRoaXMuY2xvc2VkQ2FzZXMgPSB0aGlzLmdldENsb3NlZENhc2VzKCk7XHJcbiAgICAgIHRoaXMud2VhcG9uID0gbmV3IFdlYXBvbihcIlJlZ3VsYXJcIiwgMTAsIFwiL2Fzc2V0cy9pbWcvd2VhcG9uL3dlYXBvbjIucG5nXCIpO1xyXG4gICAgICB0aGlzLmRlZmVuc2VNb2RlID0gZmFsc2U7XHJcblxyXG4gICB9XHJcblxyXG4gICB0YWtlV2VhcG9uKGNhc2VXZWFwb246IENhc2UsIGZpZWxkOiBGaWVsZCl7XHJcbiAgICAgIGxldCB3ZWFwb25Ub0Ryb3AgPSB0aGlzLndlYXBvbjtcclxuICAgICAgdGhpcy53ZWFwb24gPSBjYXNlV2VhcG9uLndlYXBvbjtcclxuICAgICAgY2FzZVdlYXBvbi5yZW1vdmVXZWFwb24oKTtcclxuICAgICAgZmllbGQuY2FzZXNbY2FzZVdlYXBvbi5wb3NpdGlvbi54XVtjYXNlV2VhcG9uLnBvc2l0aW9uLnldLndlYXBvbiA9IHdlYXBvblRvRHJvcDtcclxuICAgICAgXHJcbiAgICAgIC8vTG9naWNXZWFwb24ucGFpbnRXZWFwb24oY2FzZVdlYXBvbiwgd2VhcG9uVG9Ecm9wLCBmaWVsZCk7XHJcbiAgIH1cclxuXHJcbiAgIGlzV2F5QmxvY2tlZChjYXNlVG9SZWFjaDogQ2FzZSwgZmllbGQ6IEZpZWxkKTogQm9vbGVhbntcclxuICAgICAgbGV0IGJsb2NrZWQgPSBmYWxzZTtcclxuICAgICAgaWYodGhpcy5jYXNlLnBvc2l0aW9uLnggPT09IGNhc2VUb1JlYWNoLnBvc2l0aW9uLngpe1xyXG4gICAgICAgICBsZXQgeCA9IHRoaXMuY2FzZS5wb3NpdGlvbi54O1xyXG4gICAgICAgICBsZXQgeUluaXQgPSAwO1xyXG4gICAgICAgICBpZih0aGlzLmNhc2UucG9zaXRpb24ueSA8IGNhc2VUb1JlYWNoLnBvc2l0aW9uLnkpe1xyXG4gICAgICAgICB5SW5pdCA9IHRoaXMuY2FzZS5wb3NpdGlvbi55KzE7XHJcbiAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB5SW5pdCA9IGNhc2VUb1JlYWNoLnBvc2l0aW9uLnkrMTsgXHJcbiAgICAgICAgIH1cclxuICAgICAgICAgIGxldCBkZWx0YVkgPSBNYXRoLmFicyh0aGlzLmNhc2UucG9zaXRpb24ueSAtIGNhc2VUb1JlYWNoLnBvc2l0aW9uLnkpO1xyXG4gICAgICAgICAgZm9yKGxldCByb3cgPSAwOyByb3cgPCBkZWx0YVk7IHJvdysrKXtcclxuICAgICAgICAgICAgIGlmKGZpZWxkLmNhc2VzW3hdW3lJbml0K3Jvd10uaXNCbG9ja2VkID09PSB0cnVlKXtcclxuICAgICAgICAgICAgICAgIGJsb2NrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgIH1cclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgIGxldCB4SW5pdCA9IDA7XHJcbiAgICAgICAgIGxldCB5ID0gdGhpcy5jYXNlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgIGlmKHRoaXMuY2FzZS5wb3NpdGlvbi54IDwgY2FzZVRvUmVhY2gucG9zaXRpb24ueCl7XHJcbiAgICAgICAgICAgIHhJbml0ID0gdGhpcy5jYXNlLnBvc2l0aW9uLngrMTtcclxuICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHhJbml0ID0gY2FzZVRvUmVhY2gucG9zaXRpb24ueCsxOyBcclxuICAgICAgICAgfVxyXG4gICAgICAgICAgbGV0IGRlbHRhWCA9IE1hdGguYWJzKHRoaXMuY2FzZS5wb3NpdGlvbi54IC0gY2FzZVRvUmVhY2gucG9zaXRpb24ueCk7XHJcbiAgICAgICAgICBmb3IobGV0IGNvbCA9IDA7IGNvbCA8IGRlbHRhWDsgY29sKyspe1xyXG4gICAgICAgICAgICAgaWYoZmllbGQuY2FzZXNbeEluaXQrY29sXVt5XS5pc0Jsb2NrZWQgPT09IHRydWUpe1xyXG4gICAgICAgICAgICAgICAgYmxvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmKGJsb2NrZWQgPT09IHRydWUpe1xyXG4gICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgaXNDYXNlUmVhY2hhYmxlKGNhc2VUb1JlYWNoOiBDYXNlLCBmaWVsZDogRmllbGQpe1xyXG4gICAgICBsZXQgZGVsdGFYID0gTWF0aC5hYnMoY2FzZVRvUmVhY2gucG9zaXRpb24ueCAtIHRoaXMuY2FzZS5wb3NpdGlvbi54KTtcclxuICAgICAgbGV0IGRlbHRhWSA9IE1hdGguYWJzKGNhc2VUb1JlYWNoLnBvc2l0aW9uLnkgLSB0aGlzLmNhc2UucG9zaXRpb24ueSk7XHJcbiAgICAgIGlmKCBkZWx0YVggPD0gMyAmJiAgZGVsdGFZIDw9IDMgKXtcclxuICAgICAgICAgaWYoY2FzZVRvUmVhY2gucG9zaXRpb24ueCA9PT0gdGhpcy5jYXNlLnBvc2l0aW9uLnggfHwgY2FzZVRvUmVhY2gucG9zaXRpb24ueSA9PT0gdGhpcy5jYXNlLnBvc2l0aW9uLnkpe1xyXG4gICAgICAgICBpZighY2FzZVRvUmVhY2guaXNCbG9ja2VkICYmICF0aGlzLmlzV2F5QmxvY2tlZChjYXNlVG9SZWFjaCwgZmllbGQpKXtcclxuICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgfVxyXG5cclxuICAgZ2V0Q2xvc2VkQ2FzZXMoKTogQXJyYXk8Q2FzZT57XHJcbiAgICAgIGxldCBjbG9zZWRDYXNlcyA9IEFycmF5PENhc2U+KCk7XHJcbiAgICAgIGxldCBzaXplWCA9IHRoaXMuY2FzZS5nYW1lTWFuYWdlci5maWVsZC5zaXplLng7XHJcbiAgICAgIGxldCBzaXplWSA9IHRoaXMuY2FzZS5nYW1lTWFuYWdlci5maWVsZC5zaXplLnk7XHJcbiAgICAgIGxldCBmaWVsZCA9IHRoaXMuY2FzZS5nYW1lTWFuYWdlci5maWVsZDtcclxuXHJcbiAgICAgIGZvcihsZXQgY29sID0gMDsgY29sIDwgc2l6ZVg7IGNvbCsrKXtcclxuICAgICAgICAgZm9yKGxldCByb3cgPSAwOyByb3cgPCBzaXplWTsgcm93Kyspe1xyXG4gICAgICAgICAgICBpZih0aGlzLmNhc2UuY2FzZXNBZGphY2VudChmaWVsZC5jYXNlc1tjb2xdW3Jvd10pKXtcclxuICAgICAgICAgICAgICAgY2xvc2VkQ2FzZXMucHVzaChmaWVsZC5jYXNlc1tjb2xdW3Jvd10pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY2xvc2VkQ2FzZXM7XHJcbiAgIH1cclxuXHJcbiAgIGlzQ2xvc2VkQ2FzZXNCbG9ja2VkKCk6IEJvb2xlYW57XHJcbiAgICAgIGxldCBhbGxCbG9ja2VkID0gdHJ1ZTtcclxuICAgICAgZm9yKGxldCBjYXNlVG9DaGVjayBvZiB0aGlzLmNsb3NlZENhc2VzKXtcclxuICAgICAgICAgaWYoIWNhc2VUb0NoZWNrLmlzQmxvY2tlZCl7XHJcbiAgICAgICAgICAgIGFsbEJsb2NrZWQgPSBmYWxzZTtcclxuICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBhbGxCbG9ja2VkO1xyXG4gICB9XHJcblxyXG4gICBtb3ZlVG8oZmllbGQ6IEZpZWxkLCBjYXNlVG9Nb3ZlOiBDYXNlKXtcclxuICAgICAgbGV0IGNoYW5nZWRXZWFwb24gPSBmYWxzZTtcclxuICAgICAgbGV0IGNhc2VGcm9tID0gdGhpcy5jYXNlO1xyXG4gICAgICBsZXQgcHJldmlvdXNXZWFwb24gPSB0aGlzLndlYXBvbjtcclxuICAgICAgbGV0IGxvZ2dlciA9IHRoaXMuY2FzZS5nYW1lTWFuYWdlci5sb2dnZXI7XHJcbiAgICAgIGlmKHRoaXMuaXNDYXNlUmVhY2hhYmxlKGNhc2VUb01vdmUsIGZpZWxkKSl7XHJcblxyXG4gICAgICAgICBsZXQgbmV4dFBsYXllckFycmF5ID0gZmllbGQuY2hhcmFjdGVycy5maWx0ZXIoKG5leHRQbGF5ZXIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIChuZXh0UGxheWVyICE9PSB0aGlzLmNhc2UuZ2FtZU1hbmFnZXIucGxheWVyVG91cik7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBsZXQgbmV4dFBsYXllciA9IG5leHRQbGF5ZXJBcnJheVswXTtcclxuICAgICAgICAgXHJcbiAgICAgIHRoaXMuY2FzZSA9IGNhc2VUb01vdmU7XHJcbiAgICAgIHRoaXMuY2xvc2VkQ2FzZXMgPSB0aGlzLmdldENsb3NlZENhc2VzKCk7XHJcbiAgICAgIGlmKGNhc2VUb01vdmUuaGFzV2VhcG9uKCkpe1xyXG4gICAgICAgICB0aGlzLnRha2VXZWFwb24odGhpcy5jYXNlLCBmaWVsZCk7XHJcbiAgICAgICAgIGNoYW5nZWRXZWFwb24gPSB0cnVlO1xyXG4gICAgICAgICBsb2dnZXIud3JpdHRlRGVzY3JpcHRpb24oJ1RoZSBwbGF5ZXIgJyArIHRoaXMuY2FzZS5nYW1lTWFuYWdlci5wbGF5ZXJUb3VyLm5hbWUgKyAnIGxldCB0aGUgd2VhcG9uICcrIGNhc2VUb01vdmUud2VhcG9uLm5hbWUgKycgdG8gdGFrZSB0aGUgd2VhcG9uICcgKyB0aGlzLndlYXBvbi5uYW1lICsnLicpO1xyXG4gICAgICAgICBjb25zb2xlLmxvZygnVGhlIHBsYXllciAnICsgdGhpcy5jYXNlLmdhbWVNYW5hZ2VyLnBsYXllclRvdXIubmFtZSArICcgbGV0IHRoZSB3ZWFwb24gJysgY2FzZVRvTW92ZS53ZWFwb24ubmFtZSArJyB0byB0YWtlIHRoZSB3ZWFwb24gJyArIHRoaXMud2VhcG9uLm5hbWUgKycuJyk7XHJcbiAgICAgICAgIE1lbnVNYW5hZ2VyLnVwZGF0ZUluZm9XZWFwb24odGhpcywgdGhpcy5jYXNlLmdhbWVNYW5hZ2VyLnBsYXllcnMuaW5kZXhPZih0aGlzKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICAgICBMb2dpY0NoYXJhY3Rlci5zZXRBYnNvbHV0ZVBvc2l0aW9uKHRoaXMpO1xyXG4gICAgICAgICAgTG9naWNDaGFyYWN0ZXIuY2hhcmFjdGVyQW5pbWF0aW9uKHRoaXMsIHRoaXMuYWJzb2x1dGVDb29yZCk7XHJcbiAgICAgICAgIGlmKGNoYW5nZWRXZWFwb24pe1xyXG4gICAgICAgICAgICBMb2dpY1dlYXBvbi5wYWludFdlYXBvbihmaWVsZC5jYXNlc1tjYXNlRnJvbS5wb3NpdGlvbi54XVtjYXNlRnJvbS5wb3NpdGlvbi55XSwgcHJldmlvdXNXZWFwb24sIGZpZWxkKTtcclxuICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgIHRoaXMuY2FzZS5nYW1lTWFuYWdlci5wbGF5ZXJUb3VyID0gbmV4dFBsYXllcjtcclxuICAgICAgTWVudU1hbmFnZXIudXBkYXRlUGxheWVyVG91ck1lbnUodGhpcy5jYXNlLmdhbWVNYW5hZ2VyLnBsYXllclRvdXIpO1xyXG4gICAgICBsb2dnZXIud3JpdHRlRGVzY3JpcHRpb24oJ1RoZSBwbGF5ZXIgJyArIHRoaXMuY2FzZS5nYW1lTWFuYWdlci5wbGF5ZXJUb3VyLm5hbWUgKyAnIGNhbiBwbGF5LicpO1xyXG4gICAgICBjb25zb2xlLmxvZygnVGhlIHBsYXllciAnICsgdGhpcy5jYXNlLmdhbWVNYW5hZ2VyLnBsYXllclRvdXIubmFtZSArICcgY2FuIHBsYXkuJyk7XHJcbiAgICAgIC8vRmlnaHRNYW5hZ2VyLnNldEZpZ2h0TWVudSh0aGlzLmNhc2UuZ2FtZU1hbmFnZXIpO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICAgbG9nZ2VyLndyaXR0ZURlc2NyaXB0aW9uKFwiVGhpcyBwbGFjZSBpcyB1bnJlYWNoYWJsZSEhXCIpO1xyXG4gICAgICAgICBjb25zb2xlLmxvZyhcIlRoaXMgcGxhY2UgaXMgdW5yZWFjaGFibGUhIVwiKTtcclxuICAgICAgfVxyXG4gICB9XHJcbiAgIFxyXG4gICBhdHRhY2soKXtcclxuICAgICAgbGV0IGxvZ2dlciA9IG5ldyBMb2dnZXIoKTtcclxuICAgICAgbGV0IG9wcG9uZW50ID0gdGhpcy5jYXNlLmdhbWVNYW5hZ2VyLmZpZWxkLmNoYXJhY3RlcnMuZmlsdGVyKChvcHBvbmVudCkgPT4ge1xyXG4gICAgICAgICByZXR1cm4gKG9wcG9uZW50ICE9PSB0aGlzKTtcclxuICAgICAgIH0pWzBdO1xyXG5cclxuICAgICAgIGxldCBpbmRleE9wcG9uZW50ID0gdGhpcy5jYXNlLmdhbWVNYW5hZ2VyLmZpZWxkLmNoYXJhY3RlcnMuaW5kZXhPZihvcHBvbmVudCk7XHJcblxyXG4gICAgICAgaWYob3Bwb25lbnQuZGVmZW5zZU1vZGUgPT09IHRydWUpe1xyXG4gICAgICAgICAgb3Bwb25lbnQubGlmZSA9IE1hdGgucm91bmQoKG9wcG9uZW50LmxpZmUgLSB0aGlzLndlYXBvbi5kYW1hZ2UpLzIpO1xyXG4gICAgICAgfWVsc2V7XHJcbiAgICAgICAgIG9wcG9uZW50LmxpZmUgPSBvcHBvbmVudC5saWZlIC0gdGhpcy53ZWFwb24uZGFtYWdlO1xyXG4gICAgICAgfVxyXG4gICAgICAgTWVudU1hbmFnZXIudXBkYXRlSW5mb0xpZmUob3Bwb25lbnQsIGluZGV4T3Bwb25lbnQpO1xyXG4gICAgICAgbG9nZ2VyLndyaXR0ZURlc2NyaXB0aW9uKG9wcG9uZW50Lm5hbWUgKyAnIHJlY2VpdmVkICcgKyB0aGlzLndlYXBvbi5kYW1hZ2UgKyAncHRzIG9mIGRhbWFnZXMuJyk7XHJcbiAgIH1cclxuXHJcbiAgIGRlZmVuc2UoKXtcclxuICAgICAgdGhpcy5kZWZlbnNlTW9kZSA9IHRydWU7XHJcbiAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2hhcmFjdGVyOyIsIi8vVGhpcyBjbGFzcyBmb3IgdGhlIGZpZWxkc1xyXG5jbGFzcyBDb29yZCB7XHJcbiAgICAvL2ZpZWxkIFxyXG4gICAgeCA6IG51bWJlcjtcclxuICAgIHkgOiBudW1iZXI7XHJcblxyXG4gICAgLy9jb25zdHJ1Y3RvciBcclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IENvb3JkOyIsImltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuLi9tb2RlbC9maWVsZFwiO1xyXG5pbXBvcnQgQ2FzZUxvZ2ljIGZyb20gXCIuLi8uLi9jYXNlL2xvZ2ljL2Nhc2VMb2dpY1wiO1xyXG5pbXBvcnQgV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbW9kZWwvd2VhcG9uXCI7XHJcbmltcG9ydCBMb2dpY1dlYXBvbiBmcm9tIFwiLi4vLi4vd2VhcG9uL2xvZ2ljL2xvZ2ljV2VhcG9uXCI7XHJcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4uLy4uL2NoYXJhY3Rlci9tb2RlbC9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IExvZ2ljQ2hhcmFjdGVyIGZyb20gXCIuLi8uLi9jaGFyYWN0ZXIvbG9naWMvbG9naWNDaGFyYWN0ZXJcIjtcclxuaW1wb3J0IENvb3JkIGZyb20gXCIuLi8uLi9jb29yZC9tb2RlbC9jb29yZFwiO1xyXG5cclxuLy9UaGlzIGNsYXNzIHdpbGwgZ2VuZXJhdGUgYWxsIHRoZSBkaWZmZXJlbnQgb2JqZWN0cyBuZWVkZWQgZm9yIHRoZSBnYW1lXHJcbmFic3RyYWN0IGNsYXNzIExvZ2ljRmllbGQge1xyXG5cclxuICAgLyoqXHJcbiAgICAqIFxyXG4gICAgKiBAcGFyYW0geCBcclxuICAgICogQHBhcmFtIHkgXHJcbiAgICAqL1xyXG4gICBzdGF0aWMgZ2VuZXJhdGVNYXAoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBGaWVsZCB7XHJcbiAgICAgIGxldCB0b3RhbENhc2VzID0geCAqIHk7XHJcbiAgICAgIGxldCBibG9ja2VkQ2FzZXMgPSBNYXRoLnJvdW5kKHRvdGFsQ2FzZXMgLyA2KTtcclxuICAgICAgbGV0IGZpZWxkOiBGaWVsZCA9IG5ldyBGaWVsZCh4LCB5KTtcclxuXHJcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHg7IGNvbCsrKSB7XHJcbiAgICAgICAgIGZpZWxkLmNhc2VzW2NvbF0gPSBbXTtcclxuICAgICAgICAgZm9yKGxldCByb3cgPSAwOyByb3cgPCB5OyByb3crKyl7XHJcbiAgICAgICAgICAgIGxldCBwb3NpdGlvbiA9IG5ldyBDb29yZChjb2wsIHJvdyk7XHJcblxyXG4gICAgICAgICBpZiAoYmxvY2tlZENhc2VzID4gMCkge1xyXG4gICAgICAgICAgICBsZXQgYmxvY2tlZENhc2UgPSBuZXcgQ2FzZShwb3NpdGlvbiwgQ2FzZUxvZ2ljLkJMT0NLRUQpO1xyXG4gICAgICAgICAgICBmaWVsZC5jYXNlc1tjb2xdW3Jvd10gPSBibG9ja2VkQ2FzZTtcclxuICAgICAgICAgICAgYmxvY2tlZENhc2VzID0gYmxvY2tlZENhc2VzIC0gMTtcclxuICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IG5vbkJsb2NrZWRDYXNlID0gbmV3IENhc2UocG9zaXRpb24pO1xyXG4gICAgICAgICAgICBmaWVsZC5jYXNlc1tjb2xdW3Jvd10gPSBub25CbG9ja2VkQ2FzZTtcclxuICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZmllbGQudW5zb3J0Q2FzZXMoKTtcclxuXHJcbiAgICAgIHJldHVybiBmaWVsZDtcclxuICAgfVxyXG5cclxuICAgLyoqXHJcbiAgICAqIFxyXG4gICAgKiBAcGFyYW0gZWxlbWVudFRvRmlsbCBcclxuICAgICogQHBhcmFtIGZpZWxkIFxyXG4gICAgKi9cclxuICAgc3RhdGljIHBhaW50RmllbGQoZWxlbWVudFRvRmlsbDogSFRNTEVsZW1lbnQsIGZpZWxkOiBGaWVsZCk6IHZvaWQge1xyXG5cclxuICAgICAgXHJcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGZpZWxkLnNpemUueDsgY29sKyspIHtcclxuICAgICAgICAgbGV0IHJvd0VsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgIHJvd0VsdC5zdHlsZS5oZWlnaHQgPSAoMTAwIC8gZmllbGQuc2l6ZS54KS50b0ZpeGVkKDIpKyBcIiVcIjtcclxuICAgICAgICAgcm93RWx0LnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiO1xyXG4gICAgICAgICByb3dFbHQuY2xhc3NMaXN0LmFkZChcInJvdy1tYXBcIik7XHJcbiAgICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGZpZWxkLnNpemUueTsgcm93Kyspe1xyXG4gICAgICAgICBsZXQgZGl2RWx0ID0gQ2FzZUxvZ2ljLnBhaW50Q2FzZShmaWVsZC5jYXNlc1tjb2xdW3Jvd10pO1xyXG4gICAgICAgICByb3dFbHQuYXBwZW5kQ2hpbGQoZGl2RWx0KTtcclxuICAgICAgfVxyXG4gICAgICBlbGVtZW50VG9GaWxsLmFwcGVuZENoaWxkKHJvd0VsdCk7XHJcbiAgIH1cclxuICAgfVxyXG5cclxuXHJcbiAgICBzdGF0aWMgc2V0V2VhcG9uKGZpZWxkOiBGaWVsZCk6IHZvaWQge1xyXG4gICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpKyspIHtcclxuICAgICAgICAgbGV0IHdlYXBvbiA9IG5ldyBXZWFwb24oXCJNam9sbmlyXCIraSwgMTAraSwgXCIvYXNzZXRzL2ltZy93ZWFwb24vd2VhcG9uMS5wbmdcIik7XHJcbiAgICAgICAgIGZpZWxkLndlYXBvbnMucHVzaCh3ZWFwb24pO1xyXG4gICAgICAgfVxyXG4gICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpKyspIHtcclxuICAgICAgICAgbGV0IHdlYXBvbiA9IG5ldyBXZWFwb24oXCJTdG9ybWJyZWFrZXJcIitpLCAyMCtpLCBcIi9hc3NldHMvaW1nL3dlYXBvbi93ZWFwb24xLnBuZ1wiKTtcclxuICAgICAgICAgZmllbGQud2VhcG9ucy5wdXNoKHdlYXBvbik7XHJcbiAgICAgICB9XHJcbiAgICAgICBmb3IobGV0IHdlYXBvbiBvZiBmaWVsZC53ZWFwb25zKXtcclxuICAgICAgICAgIExvZ2ljV2VhcG9uLnBhaW50U3RhcnRXZWFwb24oZmllbGQsIHdlYXBvbik7XHJcblxyXG4gICAgICAgfVxyXG4gICAgfSBcclxuXHJcbiAgIHN0YXRpYyBzZXRDaGFyYWN0ZXJzKGZpZWxkOiBGaWVsZCk6IHZvaWQge1xyXG4gICAgICBMb2dpY0NoYXJhY3Rlci5wYWludFN0YXJ0Q2hhcmFjdGVycyhmaWVsZCwgXCJFeHRlcm1pbmF0b3JcIiwgXCIvYXNzZXRzL2ltZy9jaGFyYWN0ZXJzL2F2YXRhcjEucG5nXCIpO1xyXG4gICAgICBMb2dpY0NoYXJhY3Rlci5wYWludFN0YXJ0Q2hhcmFjdGVycyhmaWVsZCwgXCJQcmVkYXRvclwiLCBcIi9hc3NldHMvaW1nL2NoYXJhY3RlcnMvYXZhdGFyMi5wbmdcIik7XHJcbiAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTG9naWNGaWVsZDsiLCJpbXBvcnQgQ2FzZSBmcm9tIFwiLi4vLi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcbmltcG9ydCBDb29yZCBmcm9tIFwiLi4vLi4vY29vcmQvbW9kZWwvY29vcmRcIjtcclxuaW1wb3J0IFNpemUgZnJvbSBcIi4uLy4uL3NpemUvbW9kZWwvc2l6ZVwiO1xyXG5pbXBvcnQgV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbW9kZWwvd2VhcG9uXCI7XHJcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4uLy4uL2NoYXJhY3Rlci9tb2RlbC9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IExvZ2ljSGVscGVyIGZyb20gXCIuLi8uLi8uLi9oZWxwZXJzL0xvZ2ljSGVscGVyXCI7XHJcblxyXG5cclxuLy9UaGlzIGNsYXNzIGZvciB0aGUgZmllbGRzXHJcbmNsYXNzIEZpZWxkIHtcclxuICAgIC8vZmllbGQgXHJcbiAgICBzaXplOiBTaXplO1xyXG4gICAgY2FzZXM6IENhc2VbXVtdO1xyXG4gICAgd2VhcG9uczogV2VhcG9uW107XHJcbiAgICBjaGFyYWN0ZXJzOiBDaGFyYWN0ZXJbXTtcclxuICAgICRlbDogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgLy9jb25zdHJ1Y3RvciBcclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5zaXplID0gbmV3IFNpemUoeCx5KTtcclxuICAgICAgICB0aGlzLmNhc2VzID0gQXJyYXk8QXJyYXk8Q2FzZT4+KCk7XHJcbiAgICAgICAgdGhpcy53ZWFwb25zID0gW107XHJcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXJzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBjYXNlVG9BZGQgXHJcbiAgICAgKi9cclxuICAgIGFkZENhc2UoY2FzZVRvQWRkOiBDYXNlW10pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNhc2VzLnB1c2goY2FzZVRvQWRkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGluZGljZUNhc2UgXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZUNhc2UocG9zaXRpb246IENvb3JkKTogdm9pZHtcclxuICAgICAgICB0aGlzLmNhc2VzW3Bvc2l0aW9uLnhdLnNwbGljZShwb3NpdGlvbi55LCAxKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICovXHJcbiAgICBuYnJPZkJsb2NrZWRDYXNlKCk6IG51bWJlciB7XHJcbiAgICAgICAgbGV0IG5ick9mQmxvY2tlZENhc2U6IG51bWJlciA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5zaXplLng7IHJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuc2l6ZS55OyBjb2wrKyl7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhc2VzW3Jvd11bY29sXS5pc0Jsb2NrZWQpIHtcclxuICAgICAgICAgICAgICAgIG5ick9mQmxvY2tlZENhc2UgPSBuYnJPZkJsb2NrZWRDYXNlICsgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICAgICByZXR1cm4gbmJyT2ZCbG9ja2VkQ2FzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICovXHJcbiAgICBnZXROb25CbG9ja2VkQ2FzZXMoKTogQXJyYXk8Q2FzZT4ge1xyXG4gICAgICAgIGxldCBOb25CbG9ja2VkQ2FzZXM6IEFycmF5PENhc2U+ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5zaXplLng7IHJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuc2l6ZS55OyBjb2wrKyl7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jYXNlc1tyb3ddW2NvbF0uaXNCbG9ja2VkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FzZVRvQWRkID0gdGhpcy5jYXNlc1tyb3ddW2NvbF07XHJcbiAgICAgICAgICAgICAgICBOb25CbG9ja2VkQ2FzZXMucHVzaChjYXNlVG9BZGQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgIHJldHVybiBOb25CbG9ja2VkQ2FzZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QmxvY2tlZENhc2VzKCk6IEFycmF5PENhc2U+IHtcclxuICAgICAgICBsZXQgQmxvY2tlZENhc2VzOiBBcnJheTxDYXNlPiA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMuc2l6ZS54OyByb3crKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCB0aGlzLnNpemUueTsgY29sKyspe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYXNlc1tyb3ddW2NvbF0uaXNCbG9ja2VkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FzZVRvQWRkID0gdGhpcy5jYXNlc1tyb3ddW2NvbF07XHJcbiAgICAgICAgICAgICAgICBCbG9ja2VkQ2FzZXMucHVzaChjYXNlVG9BZGQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgIHJldHVybiBCbG9ja2VkQ2FzZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QXZhaWxhYmxlQ2FzZXMoKTogQXJyYXk8Q2FzZT4ge1xyXG4gICAgICAgIGxldCBhdmFpbGFibGVDYXNlczogQXJyYXk8Q2FzZT4gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLnNpemUueDsgcm93KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5zaXplLnk7IGNvbCsrKXtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2FzZXNbcm93XVtjb2xdLmlzQXZhaWxhYmxlICYmICF0aGlzLmNhc2VzW3Jvd11bY29sXS5pc0Jsb2NrZWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjYXNlVG9BZGQgPSB0aGlzLmNhc2VzW3Jvd11bY29sXTtcclxuICAgICAgICAgICAgICAgIGF2YWlsYWJsZUNhc2VzLnB1c2goY2FzZVRvQWRkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICAgICByZXR1cm4gYXZhaWxhYmxlQ2FzZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiBcclxuICAgICAqL1xyXG4gICAgZ2V0Q2FzZUJ5UG9zaXRpb24ocG9zaXRpb246IENvb3JkKTogQ2FzZSB7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY2FzZXNbcG9zaXRpb24ueF1bcG9zaXRpb24ueV0pO1xyXG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FzZXNbcG9zaXRpb24ueF1bcG9zaXRpb24ueV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKi9cclxuICAgIGdldFJhbmRvbUNhc2UoKTogQ2FzZXtcclxuICAgICAgICBsZXQgcmFuZG9tWCA9IExvZ2ljSGVscGVyLmdldFJhbmRvbURpbWVuc2lvbih0aGlzLnNpemUueC0xKTtcclxuICAgICAgICBsZXQgcmFuZG9tWSA9IExvZ2ljSGVscGVyLmdldFJhbmRvbURpbWVuc2lvbih0aGlzLnNpemUueS0xKTtcclxuXHJcbiAgICAgICAgbGV0IHJhbmRvbUNvb3JkID0gbmV3IENvb3JkKHJhbmRvbVgsIHJhbmRvbVkpO1xyXG5cclxuICAgICAgICBsZXQgY2FzZVJhbmRvbSA9IHRoaXMuZ2V0Q2FzZUJ5UG9zaXRpb24ocmFuZG9tQ29vcmQpO1xyXG4gICAgICAgIGxldCBjYXNlVG9DaGVjayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhc2VSYW5kb20ucG9zaXRpb25TdHJpbmcpO1xyXG4gICAgICAgIHdoaWxlKGNhc2VUb0NoZWNrID09PSBudWxsIHx8IGNhc2VUb0NoZWNrID09PSB1bmRlZmluZWQgfHwgY2FzZVJhbmRvbSA9PT0gdW5kZWZpbmVkIHx8IGNhc2VSYW5kb20gPT09IG51bGwpe1xyXG5cclxuICAgICAgICAgICAgbGV0IHJhbmRvbVggPSBMb2dpY0hlbHBlci5nZXRSYW5kb21EaW1lbnNpb24odGhpcy5zaXplLngtMSk7XHJcbiAgICAgICAgICAgIGxldCByYW5kb21ZID0gTG9naWNIZWxwZXIuZ2V0UmFuZG9tRGltZW5zaW9uKHRoaXMuc2l6ZS55LTEpO1xyXG4gICAgXHJcbiAgICAgICAgICAgIGxldCByYW5kb21Db29yZCA9IG5ldyBDb29yZChyYW5kb21YLCByYW5kb21ZKTtcclxuXHJcbiAgICAgICAgICAgIGNhc2VSYW5kb20gPSB0aGlzLmdldENhc2VCeVBvc2l0aW9uKHJhbmRvbUNvb3JkKTtcclxuICAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjYXNlUmFuZG9tO1xyXG4gICAgfVxyXG5cclxuICBcclxuICAgIGdldE5vbkJsb2NrZWRSYW5kb21DYXNlKCk6IENhc2V7XHJcblxyXG4gICAgICAgIGxldCBub25CbG9ja2VkQ2FzZXMgPSB0aGlzLmdldE5vbkJsb2NrZWRDYXNlcygpO1xyXG5cclxuICAgICAgICBsZXQgaW5kaWNlID0gTG9naWNIZWxwZXIuZ2V0UmFuZG9tRGltZW5zaW9uKG5vbkJsb2NrZWRDYXNlcy5sZW5ndGgtMSk7XHJcblxyXG4gICAgICAgIGxldCBub25CbG9ja2VkUmFuZG9tQ2FzZSA9IG5vbkJsb2NrZWRDYXNlc1tpbmRpY2VdO1xyXG5cclxuICAgICAgICByZXR1cm4gbm9uQmxvY2tlZFJhbmRvbUNhc2U7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldEF2YWlsYWJsZVJhbmRvbUNhc2UoKTogQ2FzZXtcclxuICAgICAgICBsZXQgYXZhaWxhYmxlQ2FzZXMgPSB0aGlzLmdldEF2YWlsYWJsZUNhc2VzKCk7XHJcblxyXG4gICAgICAgIGxldCBpbmRpY2UgPSBMb2dpY0hlbHBlci5nZXRSYW5kb21EaW1lbnNpb24oYXZhaWxhYmxlQ2FzZXMubGVuZ3RoLTEpO1xyXG5cclxuICAgICAgICBsZXQgYXZhaWxhYmxlUmFuZG9tQ2FzZSA9IGF2YWlsYWJsZUNhc2VzW2luZGljZV07XHJcblxyXG4gICAgICAgIHJldHVybiBhdmFpbGFibGVSYW5kb21DYXNlO1xyXG4gICAgfSBcclxuXHJcblxyXG4gICAgZHVwbGljYXRlTGlzdE9mQ2FzZSgpOiBDYXNlW117XHJcbiAgICAgICAgbGV0IGNhc2VzVGVtcCA9IEFycmF5PENhc2U+KCk7XHJcbiAgICAgICAgZm9yIChsZXQgcm93PTA7IHJvdyA8IHRoaXMuc2l6ZS54OyByb3crKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IGNvbD0wOyBjb2wgPCB0aGlzLnNpemUueTsgY29sKyspe1xyXG4gICAgICAgICAgIGxldCBjYXNlVG9BZGQgPSB0aGlzLmNhc2VzW3Jvd11bY29sXTtcclxuICAgICAgICAgICBjYXNlc1RlbXAucHVzaChjYXNlVG9BZGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICAgICByZXR1cm4gY2FzZXNUZW1wO1xyXG4gICAgfVxyXG5cclxuICAgIHVuc29ydENhc2VzKCk6IHZvaWR7XHJcbiAgICAgICAgbGV0IGNhc2VzVGVtcCA9IHRoaXMuZHVwbGljYXRlTGlzdE9mQ2FzZSgpO1xyXG5cclxuICAgICAgICBmb3IobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuc2l6ZS54OyBjb2wrKyl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5zaXplLnk7IHJvdysrKXtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kaWNlID0gTG9naWNIZWxwZXIuZ2V0UmFuZG9tRGltZW5zaW9uKGNhc2VzVGVtcC5sZW5ndGgtMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXNlc1tjb2xdW3Jvd10gPSBjYXNlc1RlbXBbaW5kaWNlXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FzZXNbY29sXVtyb3ddLnBvc2l0aW9uLnggPSBjb2w7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhc2VzW2NvbF1bcm93XS5wb3NpdGlvbi55ID0gcm93O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXNlc1tjb2xdW3Jvd10ucG9zaXRpb25TdHJpbmcgPSBTdHJpbmcoY29sKStTdHJpbmcocm93KTtcclxuICAgICAgICAgICAgICAgIGNhc2VzVGVtcC5zcGxpY2UoaW5kaWNlLDEpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRDYXNlQnlFbHQoZWw6IEVsZW1lbnQpOiBDYXNle1xyXG4gICAgICAgIGZvcihsZXQgcm93Q2FzZXMgb2YgdGhpcy5jYXNlcyl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgY2FzZVRvR2V0IG9mIHJvd0Nhc2VzKXtcclxuICAgICAgICAgICAgICAgIGlmKGNhc2VUb0dldC4kZWwgPT09IGVsKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FzZVRvR2V0O1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEZpZWxkOyIsImltcG9ydCBDYXNlIGZyb20gXCIuL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4vZmllbGQvbW9kZWwvZmllbGRcIjtcclxuaW1wb3J0IExvZ2ljRmllbGQgZnJvbSBcIi4vZmllbGQvbG9naWMvbG9naWNGaWVsZFwiO1xyXG5pbXBvcnQgQ2FzZUxvZ2ljIGZyb20gXCIuL2Nhc2UvbG9naWMvY2FzZUxvZ2ljXCI7XHJcbmltcG9ydCBXZWFwb24gZnJvbSBcIi4vd2VhcG9uL21vZGVsL3dlYXBvblwiO1xyXG5pbXBvcnQgTG9naWNXZWFwb24gZnJvbSBcIi4vd2VhcG9uL2xvZ2ljL2xvZ2ljV2VhcG9uXCI7XHJcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4vY2hhcmFjdGVyL21vZGVsL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgTG9naWNDaGFyYWN0ZXIgZnJvbSBcIi4vY2hhcmFjdGVyL2xvZ2ljL2xvZ2ljQ2hhcmFjdGVyXCI7XHJcbmltcG9ydCBDb29yZCBmcm9tIFwiLi9jb29yZC9tb2RlbC9jb29yZFwiO1xyXG5pbXBvcnQgTG9nZ2VyIGZyb20gXCIuL2xvZ2dlclwiO1xyXG5pbXBvcnQgTWVudU1hbmFnZXIgZnJvbSBcIi4vbWVudU1hbmFnZXJcIjtcclxuXHJcbmNsYXNzIEdhbWVNYW5hZ2VyIHtcclxuICAgIGZpZWxkOiBGaWVsZDtcclxuICAgIGlkOiBzdHJpbmcgPSAnZmlnaHQnO1xyXG4gICAgcGxheWVyczogQXJyYXk8Q2hhcmFjdGVyPjtcclxuICAgIHBsYXllclRvdXI6IENoYXJhY3RlcjtcclxuICAgIG1heE1vdmU6IG51bWJlciA9IDM7XHJcbiAgICBsb2dnZXI6IExvZ2dlcjtcclxuICAgIG1lbnVNYW5hZ2VyOiBNZW51TWFuYWdlcjtcclxuXHJcbiAgICAkZWw6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gbmV3IEFycmF5PENoYXJhY3Rlcj4oKTtcclxuICAgICAgICB0aGlzLmxvZ2dlciA9IG5ldyBMb2dnZXIoKTtcclxuICAgICAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEdhbWVNYW5hZ2VyKCl7XHJcbiAgICAgICAgZm9yKGxldCByb3dGaWVsZCBvZiB0aGlzLmZpZWxkLmNhc2VzKXtcclxuICAgICAgICAgICAgZm9yKGxldCBjYXNlVG9VcGRhdGUgb2Ygcm93RmllbGQpe1xyXG4gICAgICAgICAgICAgICAgY2FzZVRvVXBkYXRlLmdhbWVNYW5hZ2VyID0gdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGFydEdhbWUoKSB7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIud3JpdHRlRGVzY3JpcHRpb24oJ3N0YXJ0aW5nIGdhbWUuLi4nKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnc3RhcnRpbmcgZ2FtZS4uLicpO1xyXG5cclxuICAgICAgICBsZXQgZmllbGQgPSBMb2dpY0ZpZWxkLmdlbmVyYXRlTWFwKDEwLCAxMCk7XHJcblxyXG4gICAgICAgIHRoaXMuZmllbGQgPSBmaWVsZDtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRHYW1lTWFuYWdlcigpO1xyXG5cclxuICAgICAgICBMb2dpY0ZpZWxkLnBhaW50RmllbGQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWdodFwiKSwgZmllbGQpO1xyXG5cclxuICAgICAgICBMb2dpY0ZpZWxkLnNldFdlYXBvbihmaWVsZCk7XHJcblxyXG4gICAgICAgIExvZ2ljRmllbGQuc2V0Q2hhcmFjdGVycyhmaWVsZCk7XHJcblxyXG4gICAgICAgIC8vIEZpcnN0IFBsYXllciBzdGFydFxyXG4gICAgICAgIHRoaXMucGxheWVyVG91ciA9IGZpZWxkLmNoYXJhY3RlcnNbMF07XHJcbiAgICAgICAgTWVudU1hbmFnZXIuc2V0TWVudSh0aGlzKTtcclxuXHJcblxyXG5cclxuICAgICAgICB0aGlzLnNob3dSZWFjaGFibGVDYXNlKCk7XHJcblxyXG4gICAgICAgIHRoaXMubG9nZ2VyLndyaXR0ZURlc2NyaXB0aW9uKCdUaGUgcGxheWVyICcgKyB0aGlzLnBsYXllclRvdXIubmFtZSArICcgY2FuIHBsYXkuJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1RoZSBwbGF5ZXIgJyArIHRoaXMucGxheWVyVG91ci5uYW1lICsgJyBjYW4gcGxheS4nKTtcclxuICAgIH1cclxuXHJcbiAgICBzaG93UmVhY2hhYmxlQ2FzZSgpe1xyXG4gICAgICAgIGZvcihsZXQgY29sPTA7IGNvbCA8IHRoaXMuZmllbGQuc2l6ZS54OyBjb2wrKyl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgcm93PTA7IHJvdyA8IHRoaXMuZmllbGQuc2l6ZS55OyByb3crKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FzZVRvQ2hlY2sgPSB0aGlzLmZpZWxkLmNhc2VzW2NvbF1bcm93XTtcclxuICAgICAgICAgICAgaWYodGhpcy5wbGF5ZXJUb3VyLmlzQ2FzZVJlYWNoYWJsZShjYXNlVG9DaGVjaywgdGhpcy5maWVsZCkgPT09IHRydWUgJiYgY2FzZVRvQ2hlY2sgIT09IHRoaXMucGxheWVyVG91ci5jYXNlKXtcclxuICAgICAgICAgICAgICAgIGNhc2VUb0NoZWNrLiRlbC5jbGFzc0xpc3QuYWRkKFwiY2FzZS1yZWFjaGFibGVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBcclxufVxyXG5leHBvcnQgZGVmYXVsdCBHYW1lTWFuYWdlcjsiLCJpbXBvcnQgQ2FzZSBmcm9tIFwiLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuL2ZpZWxkL21vZGVsL2ZpZWxkXCI7XHJcbmltcG9ydCBMb2dpY0ZpZWxkIGZyb20gXCIuL2ZpZWxkL2xvZ2ljL2xvZ2ljRmllbGRcIjtcclxuaW1wb3J0IENhc2VMb2dpYyBmcm9tIFwiLi9jYXNlL2xvZ2ljL2Nhc2VMb2dpY1wiO1xyXG5pbXBvcnQgV2VhcG9uIGZyb20gXCIuL3dlYXBvbi9tb2RlbC93ZWFwb25cIjtcclxuaW1wb3J0IExvZ2ljV2VhcG9uIGZyb20gXCIuL3dlYXBvbi9sb2dpYy9sb2dpY1dlYXBvblwiO1xyXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gXCIuL2NoYXJhY3Rlci9tb2RlbC9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IExvZ2ljQ2hhcmFjdGVyIGZyb20gXCIuL2NoYXJhY3Rlci9sb2dpYy9sb2dpY0NoYXJhY3RlclwiO1xyXG5pbXBvcnQgQ29vcmQgZnJvbSBcIi4vY29vcmQvbW9kZWwvY29vcmRcIjtcclxuXHJcbmNsYXNzIExvZ2dlciB7XHJcbiAgICBhY3Rpdml0eTogQXJyYXk8c3RyaW5nPjtcclxuICAgICRlbDogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5hY3Rpdml0eSA9IEFycmF5PHN0cmluZz4oKTtcclxuXHJcbiAgICAgICAgdGhpcy4kZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWN0aXZpdHktaXRlbS1saXN0Jyk7XHJcbiAgICB9XHJcblxyXG53cml0dGVEZXNjcmlwdGlvbih0ZXh0OiBzdHJpbmcpe1xyXG4gICAgbGV0IGFjdGl2aXR5RWx0ID0gdGhpcy4kZWw7XHJcbiAgICB0aGlzLmFjdGl2aXR5LnB1c2godGV4dCk7XHJcbiAgICBsZXQgbGFzdEFjdGl2aXR5SW5kaWNlID0gdGhpcy5hY3Rpdml0eS5sZW5ndGgtMTtcclxuICAgIGxldCBkaXZFbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IGRpdlRleHRFbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG5cclxuICAgIGxldCBpdGVtTGlzdCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2xhc3QtaXRlbScpO1xyXG4gICAgaWYoaXRlbUxpc3RbMF0gIT09IHVuZGVmaW5lZCAmJiBpdGVtTGlzdFswXSAhPT0gbnVsbCl7XHJcbiAgICBpdGVtTGlzdFswXS5jbGFzc0xpc3QucmVtb3ZlKCdsYXN0LWl0ZW0nKTtcclxuICAgIH1cclxuXHJcbiAgICBkaXZUZXh0RWx0LnRleHRDb250ZW50ID0gdGhpcy5hY3Rpdml0eVtsYXN0QWN0aXZpdHlJbmRpY2VdO1xyXG5cclxuICAgIFxyXG4gICAgYWN0aXZpdHlFbHQuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmJlZ2luJywgJzxkaXYgY2xhc3M9XCJhY3Rpdml0eS1pdGVtIGxhc3QtaXRlbVwiPicrIHRoaXMuYWN0aXZpdHlbbGFzdEFjdGl2aXR5SW5kaWNlXSArJzwvZGl2PicpO1xyXG5cclxuXHJcbn1cclxuXHJcblxyXG5cclxufVxyXG5leHBvcnQgZGVmYXVsdCBMb2dnZXI7IiwiXHJcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4vY2hhcmFjdGVyL21vZGVsL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgR2FtZU1hbmFnZXIgZnJvbSBcIi4vZ2FtZU1hbmFnZXJcIjtcclxuXHJcbmFic3RyYWN0IGNsYXNzIE1lbnVNYW5hZ2VyIHtcclxuXHJcbiAgICBzdGF0aWMgc2V0TWVudShnYW1lTWFuYWdlcjogR2FtZU1hbmFnZXIpe1xyXG5cclxuICAgICAgICB0aGlzLnNldEluZm8oZ2FtZU1hbmFnZXIucGxheWVyc1swXSwgMCk7XHJcbiAgICAgICAgZ2FtZU1hbmFnZXIucGxheWVyc1swXS4kYXZhdGFyTGlmZUVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjcGxheWVyMSAubGlmZS1pbmZvXCIpWzBdO1xyXG5cclxuICAgICAgICB0aGlzLnNldEluZm8oZ2FtZU1hbmFnZXIucGxheWVyc1sxXSwgMSk7XHJcbiAgICAgICAgZ2FtZU1hbmFnZXIucGxheWVyc1sxXS4kYXZhdGFyTGlmZUVsdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIjcGxheWVyMiAubGlmZS1pbmZvXCIpWzBdO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVBsYXllclRvdXJNZW51KGdhbWVNYW5hZ2VyLnBsYXllclRvdXIpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzZXRJbmZvKHBsYXllcjogQ2hhcmFjdGVyLCBpbmRpY2VQbGF5ZXI6IG51bWJlcil7XHJcbiAgICAgICAgbGV0IGxpZmVJbmZvRWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbGlmZS1pbmZvJyk7XHJcbiAgICAgICAgbGV0IGRpdkxpZmVFbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRpdkxpZmVFbHQudGV4dENvbnRlbnQgPSBTdHJpbmcocGxheWVyLmxpZmUpO1xyXG4gICAgICAgIGRpdkxpZmVFbHQuY2xhc3NMaXN0LmFkZCgnbGlmZS12YWx1ZScpO1xyXG4gICAgICAgIGRpdkxpZmVFbHQuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICAgICAgc3dpdGNoIChpbmRpY2VQbGF5ZXIpIHtcclxuICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgZGl2TGlmZUVsdC5zdHlsZS5sZWZ0ID0gXCIzMHB4XCJcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgZGl2TGlmZUVsdC5zdHlsZS5yaWdodCA9IFwiMzBweFwiXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgZGl2TGlmZUVsdC5zdHlsZS56SW5kZXggPSBcIjIwXCI7ICBcclxuICAgICAgICBsaWZlSW5mb0VsdFtpbmRpY2VQbGF5ZXJdLmFwcGVuZENoaWxkKGRpdkxpZmVFbHQpO1xyXG4gICAgICAgIHRoaXMuc2V0Q29sb3JJbmZvTGlmZShwbGF5ZXIsIGluZGljZVBsYXllcik7XHJcblxyXG4gICAgICAgIGxldCB3ZWFwb25JbmZvRWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnd2VhcG9uLWluZm8nKTtcclxuICAgICAgICBsZXQgZGl2V2VhcG9uRWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkaXZXZWFwb25FbHQudGV4dENvbnRlbnQgPSBwbGF5ZXIud2VhcG9uLm5hbWUrICcoJytwbGF5ZXIud2VhcG9uLmRhbWFnZSsnKSc7XHJcbiAgICAgICAgZGl2V2VhcG9uRWx0LmNsYXNzTGlzdC5hZGQoJ3dlYXBvbi12YWx1ZScpO1xyXG4gICAgICAgIGRpdldlYXBvbkVsdC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICBzd2l0Y2ggKGluZGljZVBsYXllcikge1xyXG4gICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICBkaXZXZWFwb25FbHQuc3R5bGUubGVmdCA9IFwiMzBweFwiXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIGRpdldlYXBvbkVsdC5zdHlsZS5yaWdodCA9IFwiMzBweFwiXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgZGl2V2VhcG9uRWx0LnN0eWxlLnpJbmRleCA9IFwiMjBcIjtcclxuICAgICAgICB3ZWFwb25JbmZvRWx0W2luZGljZVBsYXllcl0uYXBwZW5kQ2hpbGQoZGl2V2VhcG9uRWx0KTtcclxuXHJcbiAgICAgICAgbGV0IGF2YXRhckljb25FbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhdmF0YXItaWNvbicpO1xyXG4gICAgICAgIGxldCBkaXZBdmF0YXJFbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRpdkF2YXRhckVsdC5jbGFzc0xpc3QuYWRkKFwiYXZhdGFyLWltZ1wiKVxyXG4gICAgICAgIGxldCBhdmF0YXIgPSBwbGF5ZXIuaWNvblVybDtcclxuICAgICAgICBsZXQgaW1nQXZhdGFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgICAgICBpbWdBdmF0YXIuc3JjID0gYXZhdGFyO1xyXG5cclxuICAgICAgICBkaXZBdmF0YXJFbHQuaWQgPSBwbGF5ZXIubmFtZTtcclxuICAgICAgICBkaXZBdmF0YXJFbHQuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICAgICAgZGl2QXZhdGFyRWx0LnN0eWxlLnRvcCA9IFwiMTBweFwiO1xyXG4gICAgICAgIHN3aXRjaCAoaW5kaWNlUGxheWVyKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIGRpdkF2YXRhckVsdC5zdHlsZS5sZWZ0ID0gXCIyJVwiXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIGRpdkF2YXRhckVsdC5zdHlsZS5yaWdodCA9IFwiNSVcIlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRpdkF2YXRhckVsdC5zdHlsZS56SW5kZXggPSBcIjBcIjtcclxuICAgICAgICBkaXZBdmF0YXJFbHQuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xyXG4gICAgICAgIGRpdkF2YXRhckVsdC5hcHBlbmRDaGlsZChpbWdBdmF0YXIpO1xyXG4gICAgICAgIGF2YXRhckljb25FbHRbaW5kaWNlUGxheWVyXS5hcHBlbmRDaGlsZChkaXZBdmF0YXJFbHQpO1xyXG5cclxuICAgICAgICBsZXQgbmFtZUluZm9FbHQgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGxheWVyLW5hbWUnKVtpbmRpY2VQbGF5ZXJdO1xyXG4gICAgICAgIG5hbWVJbmZvRWx0LnRleHRDb250ZW50ID0gcGxheWVyLm5hbWU7XHJcbiAgICAgICAgbmFtZUluZm9FbHQuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICAgICAgbmFtZUluZm9FbHQuc3R5bGUudG9wID0gXCItNXB4XCI7XHJcbiAgICAgICAgbmFtZUluZm9FbHQuc3R5bGUuZm9udFdlaWdodCA9IFwiYm9sZFwiO1xyXG4gICAgICAgIHN3aXRjaCAoaW5kaWNlUGxheWVyKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIG5hbWVJbmZvRWx0LnN0eWxlLmxlZnQgPSBcIjI2JVwiXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIG5hbWVJbmZvRWx0LnN0eWxlLnJpZ2h0ID0gXCIyNiVcIlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB1cGRhdGVJbmZvTGlmZShwbGF5ZXI6IENoYXJhY3RlciwgaW5kaWNlUGxheWVyOiBudW1iZXIpe1xyXG5cclxuICAgICAgICBsZXQgbGlmZUluZm9FbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwibGlmZS12YWx1ZVwiKVtpbmRpY2VQbGF5ZXJdO1xyXG5cclxuICAgICAgICBsaWZlSW5mb0VsdC5pbm5lckhUTUw9XCJcIjtcclxuICAgICAgICBsaWZlSW5mb0VsdC50ZXh0Q29udGVudCA9IFN0cmluZyhwbGF5ZXIubGlmZSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0Q29sb3JJbmZvTGlmZShwbGF5ZXIsIGluZGljZVBsYXllcik7XHJcblxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzZXRDb2xvckluZm9MaWZlKHBsYXllcjogQ2hhcmFjdGVyLCBpbmRpY2VQbGF5ZXI6IG51bWJlcil7XHJcblxyXG4gICAgICAgIGxldCBsaWZlSW5mb0VsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJsaWZlLXZhbHVlXCIpW2luZGljZVBsYXllcl07XHJcblxyXG4gICAgICAgIGlmKHBsYXllci4kYXZhdGFyTGlmZUVsdCAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICBpZihwbGF5ZXIuJGF2YXRhckxpZmVFbHQuY2xhc3NMaXN0LmNvbnRhaW5zKCdoaWdoLWxpZmUtbGV2ZWwnKSl7XHJcbiAgICAgICAgICAgIHBsYXllci4kYXZhdGFyTGlmZUVsdC5jbGFzc0xpc3QucmVtb3ZlKCdoaWdoLWxpZmUtbGV2ZWwnKTsgXHJcbiAgICAgICAgfWVsc2UgaWYocGxheWVyLiRhdmF0YXJMaWZlRWx0LmNsYXNzTGlzdC5jb250YWlucygnbWVkaXVtLWxpZmUtbGV2ZWwnKSl7XHJcbiAgICAgICAgICAgIHBsYXllci4kYXZhdGFyTGlmZUVsdC5jbGFzc0xpc3QucmVtb3ZlKCdtZWRpdW0tbGlmZS1sZXZlbCcpOyBcclxuICAgICAgICB9ZWxzZSBpZihwbGF5ZXIuJGF2YXRhckxpZmVFbHQuY2xhc3NMaXN0LmNvbnRhaW5zKCdsb3ctbGlmZS1sZXZlbCcpKXtcclxuICAgICAgICAgICAgcGxheWVyLiRhdmF0YXJMaWZlRWx0LmNsYXNzTGlzdC5yZW1vdmUoJ2xvdy1saWZlLWxldmVsJyk7IFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAgICAgaWYocGxheWVyLmxpZmUgPiA3NSl7XHJcbiAgICAgICAgICAgIGxpZmVJbmZvRWx0LmNsYXNzTGlzdC5hZGQoJ2hpZ2gtbGlmZS1sZXZlbCcpO1xyXG4gICAgICAgIH1lbHNlIGlmIChwbGF5ZXIubGlmZSA+IDMwICYmIHBsYXllci5saWZlIDwgNzUpIHtcclxuICAgICAgICAgICAgbGlmZUluZm9FbHQuY2xhc3NMaXN0LmFkZCgnbWVkaXVtLWxpZmUtbGV2ZWwnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsaWZlSW5mb0VsdC5jbGFzc0xpc3QuYWRkKCdsb3ctbGlmZS1sZXZlbCcpO1xyXG4gICAgICAgIH0gXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHVwZGF0ZUluZm9XZWFwb24ocGxheWVyOiBDaGFyYWN0ZXIsIGluZGljZVBsYXllcjogbnVtYmVyKXtcclxuICAgICAgICBsZXQgd2VhcG9uSW5mb0VsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJ3ZWFwb24tdmFsdWVcIilbaW5kaWNlUGxheWVyXTtcclxuXHJcbiAgICAgICAgd2VhcG9uSW5mb0VsdC5pbm5lckhUTUw9XCJcIjtcclxuICAgICAgICB3ZWFwb25JbmZvRWx0LnRleHRDb250ZW50ID0gcGxheWVyLndlYXBvbi5uYW1lKyAnKCcrcGxheWVyLndlYXBvbi5kYW1hZ2UrJyknO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB1cGRhdGVQbGF5ZXJUb3VyTWVudShwbGF5ZXI6IENoYXJhY3Rlcil7XHJcbiAgICAgICAgbGV0IHBsYXllckVsdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicGxheWVyVG91clwiKTtcclxuICAgICAgICBpZihwbGF5ZXJFbHRzWzBdICE9PSB1bmRlZmluZWQgJiYgcGxheWVyRWx0c1swXSAhPT0gbnVsbCl7XHJcbiAgICAgICAgcGxheWVyRWx0c1swXS5jbGFzc0xpc3QucmVtb3ZlKFwicGxheWVyVG91clwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHBsYXllclRvdXJFbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwbGF5ZXIubmFtZSk7XHJcbiAgICAgICAgcGxheWVyVG91ckVsdC5jbGFzc0xpc3QuYWRkKFwicGxheWVyVG91clwiKTtcclxuXHJcbiAgICB9XHJcblxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IE1lbnVNYW5hZ2VyO1xyXG4iLCIvL1RoaXMgY2xhc3MgZm9yIHRoZSBmaWVsZHNcclxuY2xhc3MgU2l6ZSB7XHJcbiAgICAvL2ZpZWxkIFxyXG4gICAgeCA6IG51bWJlcjtcclxuICAgIHkgOiBudW1iZXI7XHJcblxyXG4gICAgLy9jb25zdHJ1Y3RvciBcclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFNpemU7IiwiaW1wb3J0IEZpZWxkIGZyb20gXCIuLi8uLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5pbXBvcnQgV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbW9kZWwvd2VhcG9uXCI7XHJcbmltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuXHJcblxyXG5hYnN0cmFjdCBjbGFzcyBMb2dpY1dlYXBvbiB7XHJcblxyXG5cclxuICAgIHN0YXRpYyBwYWludFN0YXJ0V2VhcG9uKGZpZWxkOiBGaWVsZCwgd2VhcG9uOiBXZWFwb24pOiB2b2lkIHtcclxuICAgICAgICBsZXQgY2FzZVdlYXBvbiA9IGZpZWxkLmdldEF2YWlsYWJsZVJhbmRvbUNhc2UoKTtcclxuICAgICAgICBsZXQgaW1nV2VhcG9uOiBIVE1MSW1hZ2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgICAgICBsZXQgc3BhbkVsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIHNwYW5FbHQuY2xhc3NMaXN0LmFkZChcIndlYXBvblwiKTtcclxuICAgICAgICBpbWdXZWFwb24uc3JjID0gd2VhcG9uLmljb25Vcmw7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLm1heFdpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLm1heEhlaWdodCA9IFwiNTAlXCI7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS50b3AgPSBcIjMwJVwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS5sZWZ0ID0gXCIwXCI7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLnpJbmRleCA9IFwiMjBcIjtcclxuICAgICAgICBzcGFuRWx0LmFwcGVuZENoaWxkKGltZ1dlYXBvbik7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FzZVdlYXBvbi5wb3NpdGlvblN0cmluZykuYXBwZW5kQ2hpbGQoc3BhbkVsdCk7XHJcbiAgICAgICAgZmllbGQuY2FzZXNbY2FzZVdlYXBvbi5wb3NpdGlvbi54XVtjYXNlV2VhcG9uLnBvc2l0aW9uLnldLmlzQXZhaWxhYmxlID0gZmFsc2U7XHJcbiAgICAgICAgZmllbGQuY2FzZXNbY2FzZVdlYXBvbi5wb3NpdGlvbi54XVtjYXNlV2VhcG9uLnBvc2l0aW9uLnldLndlYXBvbiA9IHdlYXBvbjtcclxuICAgICAgICB3ZWFwb24uJGVsID0gc3BhbkVsdDtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhdGljIHBhaW50V2VhcG9uKGNhc2VXZWFwb246IENhc2UsIHdlYXBvbjogV2VhcG9uLCBmaWVsZDogRmllbGQpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IGltZ1dlYXBvbjogSFRNTEltYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgbGV0IHNwYW5FbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBzcGFuRWx0LmNsYXNzTGlzdC5hZGQoXCJ3ZWFwb25cIik7XHJcbiAgICAgICAgaW1nV2VhcG9uLnNyYyA9IHdlYXBvbi5pY29uVXJsO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS5tYXhXaWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS5tYXhIZWlnaHQgPSBcIjUwJVwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUudG9wID0gXCIzMCVcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUubGVmdCA9IFwiMFwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS56SW5kZXggPSBcIjIwXCI7XHJcbiAgICAgICAgc3BhbkVsdC5hcHBlbmRDaGlsZChpbWdXZWFwb24pO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhc2VXZWFwb24ucG9zaXRpb25TdHJpbmcpLmFwcGVuZENoaWxkKHNwYW5FbHQpO1xyXG4gICAgICAgIGZpZWxkLmNhc2VzW2Nhc2VXZWFwb24ucG9zaXRpb24ueF1bY2FzZVdlYXBvbi5wb3NpdGlvbi55XS53ZWFwb24gPSB3ZWFwb247XHJcbiAgICAgICAgd2VhcG9uLiRlbCA9IHNwYW5FbHQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IExvZ2ljV2VhcG9uOyIsImltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuXHJcbi8vVGhpcyBjbGFzcyBmb3IgdGhlIGZpZWxkc1xyXG5jbGFzcyBXZWFwb24ge1xyXG4gICAvL2ZpZWxkIFxyXG4gICBuYW1lOiBzdHJpbmc7XHJcbiAgIGRhbWFnZTogbnVtYmVyO1xyXG4gICBpY29uVXJsOiBzdHJpbmc7XHJcbiAgIGNhc2U6IENhc2U7XHJcbiAgICRlbDogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAvL2NvbnN0cnVjdG9yIFxyXG4gICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGRhbWFnZTogbnVtYmVyLCBpY29uVXJsOiBzdHJpbmcpIHtcclxuICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgdGhpcy5kYW1hZ2UgPSBkYW1hZ2U7XHJcbiAgICAgIHRoaXMuaWNvblVybCA9IGljb25Vcmw7XHJcbiAgIH1cclxuXHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBXZWFwb247IiwiXHJcbmFic3RyYWN0IGNsYXNzIExvZ2ljSGVscGVyIHtcclxuICAgIHN0YXRpYyBnZXRSYW5kb21EaW1lbnNpb24oZGltZW5zaW9uOiBudW1iZXIpOiBudW1iZXIge1xyXG5cclxuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKmRpbWVuc2lvbik7XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMb2dpY0hlbHBlcjsiLCJcclxuaW1wb3J0IENhc2UgZnJvbSBcIi4vZW50aXRpZXMvY2FzZS9tb2RlbC9jYXNlXCI7XHJcbmltcG9ydCBGaWVsZCBmcm9tIFwiLi9lbnRpdGllcy9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5pbXBvcnQgTG9naWNGaWVsZCBmcm9tIFwiLi9lbnRpdGllcy9maWVsZC9sb2dpYy9sb2dpY0ZpZWxkXCI7XHJcbmltcG9ydCBHYW1lTWFuYWdlciBmcm9tIFwiLi9lbnRpdGllcy9nYW1lTWFuYWdlclwiO1xyXG5cclxubGV0IGdhbWVNYW5hZ2VyID0gbmV3IEdhbWVNYW5hZ2VyKCk7XHJcbmdhbWVNYW5hZ2VyLnN0YXJ0R2FtZSgpO1xyXG5cclxuXHJcbiJdfQ==
