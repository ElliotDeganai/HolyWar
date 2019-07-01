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
        }
        else {
            logger.writteDescription("This place is unreachable!!");
            console.log("This place is unreachable!!");
        }
    };
    return Character;
}());
exports.default = Character;
},{"../../menuManager":10,"../../weapon/logic/logicWeapon":12,"../../weapon/model/weapon":13,"../logic/logicCharacter":3}],5:[function(require,module,exports){
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
        var field = logicField_1.default.generateMap(8, 8);
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
        // if(player.$avatarLifeElt.classList.contains('high-life-level')){
        //     player.$avatarLifeElt.classList.remove('high-life-level'); 
        // }else if(player.$avatarLifeElt.classList.contains('medium-life-level')){
        //     player.$avatarLifeElt.classList.remove('medium-life-level'); 
        // }else if(player.$avatarLifeElt.classList.contains('low-life-level')){
        //     player.$avatarLifeElt.classList.remove('low-life-level'); 
        // }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZW50aXRpZXMvY2FzZS9sb2dpYy9jYXNlTG9naWMudHMiLCJzcmMvZW50aXRpZXMvY2FzZS9tb2RlbC9jYXNlLnRzIiwic3JjL2VudGl0aWVzL2NoYXJhY3Rlci9sb2dpYy9sb2dpY0NoYXJhY3Rlci50cyIsInNyYy9lbnRpdGllcy9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyLnRzIiwic3JjL2VudGl0aWVzL2Nvb3JkL21vZGVsL2Nvb3JkLnRzIiwic3JjL2VudGl0aWVzL2ZpZWxkL2xvZ2ljL2xvZ2ljRmllbGQudHMiLCJzcmMvZW50aXRpZXMvZmllbGQvbW9kZWwvZmllbGQudHMiLCJzcmMvZW50aXRpZXMvZ2FtZU1hbmFnZXIudHMiLCJzcmMvZW50aXRpZXMvbG9nZ2VyLnRzIiwic3JjL2VudGl0aWVzL21lbnVNYW5hZ2VyLnRzIiwic3JjL2VudGl0aWVzL3NpemUvbW9kZWwvc2l6ZS50cyIsInNyYy9lbnRpdGllcy93ZWFwb24vbG9naWMvbG9naWNXZWFwb24udHMiLCJzcmMvZW50aXRpZXMvd2VhcG9uL21vZGVsL3dlYXBvbi50cyIsInNyYy9oZWxwZXJzL0xvZ2ljSGVscGVyLnRzIiwic3JjL21haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0dBO0lBQUE7SUFrQ0EsQ0FBQztJQTdCRzs7Ozs7O09BTUc7SUFDSSxtQkFBUyxHQUFoQixVQUFpQixXQUFpQjtRQUM5QixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztRQUVuQyxRQUFRLFdBQVcsQ0FBQyxTQUFTLEVBQUU7WUFDM0IsS0FBSyxLQUFLO2dCQUNOLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM3QixNQUFNO1lBRVYs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QUFDO1FBQ3hFLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDMUUsTUFBTSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQztJQUNMLGtCQUFDO0FBQUQsQ0F4Q0EsQUF3Q0MsSUFBQTtBQUVELGtCQUFlLFdBQVcsQ0FBQzs7OztBQzdDM0IsMkJBQTJCO0FBQzNCO0lBUUcsY0FBYztJQUNkLGdCQUFZLElBQVksRUFBRSxNQUFjLEVBQUUsT0FBZTtRQUN0RCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUMxQixDQUFDO0lBR0osYUFBQztBQUFELENBaEJBLEFBZ0JDLElBQUE7QUFFRCxrQkFBZSxNQUFNLENBQUM7Ozs7QUNwQnRCO0lBQUE7SUFNQSxDQUFDO0lBTFUsOEJBQWtCLEdBQXpCLFVBQTBCLFNBQWlCO1FBRXZDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUMsU0FBUyxDQUFDLENBQUM7SUFFL0MsQ0FBQztJQUNMLGtCQUFDO0FBQUQsQ0FOQSxBQU1DLElBQUE7QUFFRCxrQkFBZSxXQUFXLENBQUM7Ozs7QUNMM0Isc0RBQWlEO0FBRWpELElBQUksV0FBVyxHQUFHLElBQUkscUJBQVcsRUFBRSxDQUFDO0FBQ3BDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuLi8uLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5cclxuYWJzdHJhY3QgY2xhc3MgQ2FzZUxvZ2ljIHtcclxuXHJcbiAgICBzdGF0aWMgQkxPQ0tFRDogc3RyaW5nID0gXCJCTE9DS0VEXCI7XHJcbiAgICBzdGF0aWMgTk9STUFMOiBzdHJpbmcgPSBcIk5PUk1BTFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gcGFydHlGaWVsZCBcclxuICAgICAqIEBwYXJhbSBsaXN0T2ZDYXNlc1RlbXAgXHJcbiAgICAgKiBAcGFyYW0gZWxlbWVudFRvRmlsbCBcclxuICAgICAqIEBwYXJhbSBuYnJPZlJlbWFpbmluZ0Nhc2VzIFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcGFpbnRDYXNlKGNhc2VUb1BhaW50OiBDYXNlKTogSFRNTERpdkVsZW1lbnQge1xyXG4gICAgICAgIGxldCBkaXZFbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRpdkVsdC5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcclxuXHJcbiAgICAgICAgc3dpdGNoIChjYXNlVG9QYWludC5pc0Jsb2NrZWQpIHtcclxuICAgICAgICAgICAgY2FzZSBmYWxzZTpcclxuICAgICAgICAgICAgICAgIGRpdkVsdC5jbGFzc0xpc3QuYWRkKFwiY2FzZVwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSB0cnVlOlxyXG4gICAgICAgICAgICAgICAgZGl2RWx0LmNsYXNzTGlzdC5hZGQoXCJjYXNlXCIpO1xyXG4gICAgICAgICAgICAgICAgZGl2RWx0LmNsYXNzTGlzdC5hZGQoXCJibG9ja2VkXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRpdkVsdC5pZCA9IFN0cmluZyhjYXNlVG9QYWludC5wb3NpdGlvblN0cmluZyk7XHJcblxyXG4gICAgICAgIGNhc2VUb1BhaW50LnNldEVsKGRpdkVsdCk7XHJcbiAgICAgICAgcmV0dXJuIGRpdkVsdDtcclxuICAgIH1cclxuXHJcblxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2FzZUxvZ2ljOyIsImltcG9ydCBDYXNlTG9naWMgZnJvbSBcIi4uLy4uL2Nhc2UvbG9naWMvY2FzZUxvZ2ljXCI7XHJcbmltcG9ydCBDb29yZCBmcm9tIFwiLi4vLi4vY29vcmQvbW9kZWwvY29vcmRcIjtcclxuaW1wb3J0IFdlYXBvbiBmcm9tIFwiLi4vLi4vd2VhcG9uL21vZGVsL3dlYXBvblwiO1xyXG5pbXBvcnQgTG9naWNXZWFwb24gZnJvbSBcIi4uLy4uL3dlYXBvbi9sb2dpYy9sb2dpY1dlYXBvblwiO1xyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4uLy4uL2ZpZWxkL21vZGVsL2ZpZWxkXCI7XHJcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4uLy4uL2NoYXJhY3Rlci9tb2RlbC9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IEdhbWVNYW5hZ2VyIGZyb20gXCIuLi8uLi9nYW1lTWFuYWdlclwiO1xyXG5cclxuY2xhc3MgQ2FzZSB7XHJcbiAgICAvL2ZpZWxkIFxyXG4gICAgaW1nVXJsOiBzdHJpbmc7XHJcbiAgICBpc0Jsb2NrZWQ6IGJvb2xlYW47XHJcbiAgICBpc0F2YWlsYWJsZTogYm9vbGVhbjtcclxuICAgIHBvc2l0aW9uOiBDb29yZDtcclxuICAgIHBvc2l0aW9uU3RyaW5nOiBzdHJpbmc7XHJcbiAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICB3ZWFwb246IFdlYXBvbjtcclxuICAgIGdhbWVNYW5hZ2VyOiBHYW1lTWFuYWdlcjtcclxuICAgICRlbDogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgLy9jb25zdHJ1Y3RvciBcclxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uOiBDb29yZCwgdHlwZTogc3RyaW5nID0gQ2FzZUxvZ2ljLk5PUk1BTCwgaXNBdmFpbGFibGU6IGJvb2xlYW4gPSB0cnVlKSB7XHJcblxyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIENhc2VMb2dpYy5OT1JNQUw6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmltZ1VybCA9IFwiL2Fzc2V0cy9pbWcvbm9ybWFsLWZpZWxkL3RpbGUtMkQucG5nXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzQmxvY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIENhc2VMb2dpYy5CTE9DS0VEOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbWdVcmwgPSBcIi9hc3NldHMvaW1nL2Jsb2NrZWQtZmllbGQvdGlsZS0yRC5wbmdcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNCbG9ja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmlzQXZhaWxhYmxlID0gaXNBdmFpbGFibGU7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb25TdHJpbmcgPSBTdHJpbmcocG9zaXRpb24ueCkgKyBTdHJpbmcocG9zaXRpb24ueSk7XHJcbiAgICAgICAgdGhpcy53ZWFwb24gPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNhc2VzQWRqYWNlbnQoY2FzZVRvQ2hlY2s6IENhc2UpOiBCb29sZWFue1xyXG4gICAgICAgIGlmKHRoaXMucG9zaXRpb24ueCA9PT0gY2FzZVRvQ2hlY2sucG9zaXRpb24ueCsxIHx8IHRoaXMucG9zaXRpb24ueCA9PT0gY2FzZVRvQ2hlY2sucG9zaXRpb24ueC0xIHx8IHRoaXMucG9zaXRpb24ueSA9PT0gY2FzZVRvQ2hlY2sucG9zaXRpb24ueSsxIHx8IHRoaXMucG9zaXRpb24ueSA9PT0gY2FzZVRvQ2hlY2sucG9zaXRpb24ueS0xKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGFzV2VhcG9uKCl7XHJcbiAgICAgICAgaWYodGhpcy53ZWFwb24gIT09IG51bGwpe1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbW92ZVdlYXBvbigpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMud2VhcG9uLiRlbC5yZW1vdmUoKTtcclxuICAgICAgICB0aGlzLndlYXBvbiA9IG51bGw7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFkZFdlYXBvbihmaWVsZDogRmllbGQsIHdlYXBvbjogV2VhcG9uKXtcclxuICAgICAgICB0aGlzLndlYXBvbiA9IHdlYXBvbjtcclxuICAgICAgICBMb2dpY1dlYXBvbi5wYWludFdlYXBvbih0aGlzLCB3ZWFwb24sIGZpZWxkKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRFbChlbGVtZW50OiBIVE1MRWxlbWVudCk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgICB0aGlzLiRlbCA9IGVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuJGVsLm9uY2xpY2sgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5vbkNsaWNrKGV2ZW50KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy4kZWw7XHJcbiAgICB9XHJcblxyXG4gICAgb25DbGljayhldmVudDogTW91c2VFdmVudCk6IHZvaWR7XHJcbiBcclxuICAgICAgICAgICAgbGV0IGNhc2VzRWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjYXNlJyk7XHJcbiAgICAgICAgICAgIGxldCBmaWVsZCA9IHRoaXMuZ2FtZU1hbmFnZXIuZmllbGQ7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhc2VzRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBjYXNlc0VsZW1lbnQgPSAoPEhUTUxFbGVtZW50PmNhc2VzRWxlbWVudHNbaV0pO1xyXG4gICAgICAgICAgICAgICAgY2FzZXNFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2Nhc2UtcmVhY2hhYmxlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBlbCA9IGV2ZW50LnRhcmdldHx8ZXZlbnQuc3JjRWxlbWVudDtcclxuICAgICAgICAgICAgbGV0IGNhc2VUb0dvID0gZmllbGQuY2FzZXNbdGhpcy5wb3NpdGlvbi54XVt0aGlzLnBvc2l0aW9uLnldO1xyXG5cclxuICAgICAgICAgICAgLy8gRG8gbm90aGluZyBpZiBwbGF5ZXIgc2VsZWN0IGEgQmxvY2sgQ2FzZVxyXG4gICAgICAgICAgICBpZiAoY2FzZVRvR28uaXNCbG9ja2VkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWVNYW5hZ2VyLnNob3dSZWFjaGFibGVDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy93ZSBnZXQgdGhlIGVsZW1lbnQgdGFyZ2V0XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmdhbWVNYW5hZ2VyLnBsYXllclRvdXIubW92ZVRvKHRoaXMuZ2FtZU1hbmFnZXIuZmllbGQsIGNhc2VUb0dvKTtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmdhbWVNYW5hZ2VyLnNob3dSZWFjaGFibGVDYXNlKCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2FzZTsiLCJcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuLi8uLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gXCIuLi8uLi9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IENvb3JkIGZyb20gXCIuLi8uLi9jb29yZC9tb2RlbC9jb29yZFwiO1xyXG5cclxuY29uc3QgZGltZW5zaW9uQ2FzZSA9IDg0O1xyXG5cclxuYWJzdHJhY3QgY2xhc3MgTG9naWNDaGFyYWN0ZXIge1xyXG5cclxuICAgIHN0YXRpYyBwYWludFN0YXJ0Q2hhcmFjdGVycyhmaWVsZDogRmllbGQsIG5hbWVDaGFyYWN0ZXI6IHN0cmluZywgaWNvblVybDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IHBsYXllciA9IG5ldyBDaGFyYWN0ZXIobmFtZUNoYXJhY3RlciwgaWNvblVybCwgZmllbGQuZ2V0QXZhaWxhYmxlUmFuZG9tQ2FzZSgpKTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBmaWVsZC5jaGFyYWN0ZXJzWzBdICE9PSAndW5kZWZpbmVkJykge1xyXG5cclxuICAgICAgICAgICAgd2hpbGUoZmllbGQuY2hhcmFjdGVyc1swXS5jYXNlLmNhc2VzQWRqYWNlbnQocGxheWVyLmNhc2UpIHx8IHBsYXllci5pc0Nsb3NlZENhc2VzQmxvY2tlZCgpKXtcclxuICAgICAgICAgICAgICAgIHBsYXllciA9IG5ldyBDaGFyYWN0ZXIobmFtZUNoYXJhY3RlciwgaWNvblVybCwgZmllbGQuZ2V0QXZhaWxhYmxlUmFuZG9tQ2FzZSgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgZmllbGQuY2FzZXNbcGxheWVyLmNhc2UucG9zaXRpb24ueF1bcGxheWVyLmNhc2UucG9zaXRpb24ueV0uaXNBdmFpbGFibGUgPSBmYWxzZTtcclxuICAgICAgICBsZXQgaW1nQ2hhcjogSFRNTEltYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgbGV0IHNwYW5FbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuXHJcbiAgICAgICAgc3BhbkVsdC5jbGFzc0xpc3QuYWRkKFwiY2hhclwiKTtcclxuICAgICAgICBpbWdDaGFyLnNyYyA9IHBsYXllci5pY29uVXJsO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUubWF4V2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLm1heEhlaWdodCA9IChNYXRoLnJvdW5kKDEwMCAvIGZpZWxkLnNpemUueCkpKyBcIiVcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUuekluZGV4ID0gXCI1MFwiO1xyXG4gICAgICAgIC8vc3BhbkVsdC5hcHBlbmRDaGlsZChpbWdDaGFyKTtcclxuICAgICAgICAvL2xldCBwbGF5ZXJEaXZFbHQgPSBwbGF5ZXIuY2FzZS4kZWw7XHJcbiAgICAgICAgbGV0IHBsYXllckRpdkVsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlnaHRcIik7XHJcbiAgICAgICAgLy9wbGF5ZXJEaXZFbHQuYXBwZW5kQ2hpbGQoc3BhbkVsdCk7XHJcbiAgICAgICAgcGxheWVyRGl2RWx0LmFwcGVuZENoaWxkKGltZ0NoYXIpO1xyXG4gICAgICAgIHBsYXllci4kZWwgPSBpbWdDaGFyO1xyXG4gICAgICAgIGltZ0NoYXIuY2xhc3NMaXN0LmFkZChcInBsYXllclwiKTtcclxuICAgICAgICB0aGlzLnNldEFic29sdXRlUG9zaXRpb24ocGxheWVyKTtcclxuXHJcbiAgICAgICAgcGxheWVyLiRlbC5zdHlsZS5sZWZ0ID0gcGxheWVyLmFic29sdXRlQ29vcmQueSArICdweCc7XHJcbiAgICAgICAgcGxheWVyLiRlbC5zdHlsZS50b3AgPSBwbGF5ZXIuYWJzb2x1dGVDb29yZC54ICsgJ3B4JztcclxuXHJcbiAgICAgICAgZmllbGQuY2hhcmFjdGVycy5wdXNoKHBsYXllcik7XHJcbiAgICAgICAgcGxheWVyLmNhc2UuZ2FtZU1hbmFnZXIucGxheWVycy5wdXNoKHBsYXllcik7XHJcbiAgICB9IFxyXG5cclxuICAgIHN0YXRpYyBwYWludENoYXJhY3RlcnMoZmllbGQ6IEZpZWxkLCBwbGF5ZXI6IENoYXJhY3RlciwgY2FzZVBsYXllcjogQ2FzZSk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgaW1nQ2hhcjogSFRNTEltYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgbGV0IHNwYW5FbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuXHJcbiAgICAgICAgc3BhbkVsdC5jbGFzc0xpc3QuYWRkKFwiY2hhclwiKTtcclxuICAgICAgICBpbWdDaGFyLnNyYyA9IHBsYXllci5pY29uVXJsO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUubWF4V2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLm1heEhlaWdodCA9IFwiNzUlXCI7XHJcbiAgICAgICAgaW1nQ2hhci5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLnRvcCA9IFwiMFwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUubGVmdCA9IFwiMFwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUuekluZGV4ID0gXCI1MFwiO1xyXG4gICAgICAgIGltZ0NoYXIuY2xhc3NMaXN0LmFkZChcInBsYXllclwiKTtcclxuICAgICAgICBzcGFuRWx0LmFwcGVuZENoaWxkKGltZ0NoYXIpO1xyXG4gICAgICAgIGxldCBwbGF5ZXJEaXZFbHQgPSBwbGF5ZXIuY2FzZS4kZWw7XHJcbiAgICAgICAgcGxheWVyRGl2RWx0LmFwcGVuZENoaWxkKHNwYW5FbHQpO1xyXG4gICAgICAgIHBsYXllci4kZWwgPSBzcGFuRWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjaGFyYWN0ZXJBbmltYXRpb24ocGxheWVyOiBDaGFyYWN0ZXIsIG5ld0Nvb3JkOiBDb29yZCl7XHJcblxyXG4gICAgICAgIHBsYXllci4kZWwuc3R5bGUubGVmdCA9IG5ld0Nvb3JkLnkgKyAncHgnO1xyXG4gICAgICAgIHBsYXllci4kZWwuc3R5bGUudG9wID0gbmV3Q29vcmQueCArICdweCc7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzZXRBYnNvbHV0ZVBvc2l0aW9uKHBsYXllcjogQ2hhcmFjdGVyKXtcclxuICAgICAgICBsZXQgYWJzb2x1dGVYID0gcGxheWVyLmNhc2UucG9zaXRpb24ueCpwbGF5ZXIuY2FzZS4kZWwub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICAgIGxldCBhYnNvbHV0ZVkgPSBwbGF5ZXIuY2FzZS5wb3NpdGlvbi55KnBsYXllci5jYXNlLiRlbC5vZmZzZXRXaWR0aDtcclxuICAgICAgICBsZXQgYWJzb2x1dGVQb3NpdGlvblBsYXllciA9IG5ldyBDb29yZChhYnNvbHV0ZVgsIGFic29sdXRlWSk7XHJcbiAgICAgICAgcGxheWVyLmFic29sdXRlQ29vcmQgPSBhYnNvbHV0ZVBvc2l0aW9uUGxheWVyOyBcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IExvZ2ljQ2hhcmFjdGVyOyIsImltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IFdlYXBvbiBmcm9tIFwiLi4vLi4vd2VhcG9uL21vZGVsL3dlYXBvblwiO1xyXG5pbXBvcnQgTG9naWNXZWFwb24gZnJvbSBcIi4uLy4uL3dlYXBvbi9sb2dpYy9sb2dpY1dlYXBvblwiO1xyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4uLy4uL2ZpZWxkL21vZGVsL2ZpZWxkXCI7XHJcbmltcG9ydCBMb2dpY0NoYXJhY3RlciBmcm9tIFwiLi4vbG9naWMvbG9naWNDaGFyYWN0ZXJcIjtcclxuaW1wb3J0IENvb3JkIGZyb20gXCIuLi8uLi9jb29yZC9tb2RlbC9jb29yZFwiO1xyXG5pbXBvcnQgTWVudU1hbmFnZXIgZnJvbSBcIi4uLy4uL21lbnVNYW5hZ2VyXCI7XHJcblxyXG4vL1RoaXMgY2xhc3MgZm9yIHRoZSBmaWVsZHNcclxuY2xhc3MgQ2hhcmFjdGVyIHtcclxuICAgLy9maWVsZCBcclxuICAgbmFtZTogc3RyaW5nO1xyXG4gICBpY29uVXJsOiBzdHJpbmc7XHJcbiAgIGxpZmU6IG51bWJlcjtcclxuICAgbGV2ZWw6IG51bWJlcjtcclxuICAgY2FzZTogQ2FzZTtcclxuICAgY2xvc2VkQ2FzZXM6IEFycmF5PENhc2U+O1xyXG4gICB3ZWFwb246IFdlYXBvbjtcclxuICAgYWJzb2x1dGVDb29yZDogQ29vcmQ7XHJcbiAgICRlbDogSFRNTEVsZW1lbnQ7XHJcbiAgICRhdmF0YXJFbHQ6IEhUTUxFbGVtZW50OyBcclxuICAgJGF2YXRhckxpZmVFbHQ6IEVsZW1lbnQ7XHJcbiAgICRhdmF0YXJXZWFwb25FbHQ6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgLy9jb25zdHJ1Y3RvciBcclxuICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBpY29uVXJsOiBzdHJpbmcsIHN0YXJ0Q2FzZTogQ2FzZSkge1xyXG4gICAgICB0aGlzLmxpZmUgPSAxMDA7XHJcbiAgICAgIHRoaXMubGV2ZWwgPSA1O1xyXG4gICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICB0aGlzLmljb25VcmwgPSBpY29uVXJsO1xyXG4gICAgICB0aGlzLmNhc2UgPSBzdGFydENhc2U7XHJcbiAgICAgIHRoaXMuY2xvc2VkQ2FzZXMgPSB0aGlzLmdldENsb3NlZENhc2VzKCk7XHJcbiAgICAgIHRoaXMud2VhcG9uID0gbmV3IFdlYXBvbihcIlJlZ3VsYXJcIiwgMTAsIFwiL2Fzc2V0cy9pbWcvd2VhcG9uL3dlYXBvbjIucG5nXCIpO1xyXG5cclxuICAgfVxyXG5cclxuICAgdGFrZVdlYXBvbihjYXNlV2VhcG9uOiBDYXNlLCBmaWVsZDogRmllbGQpe1xyXG4gICAgICBsZXQgd2VhcG9uVG9Ecm9wID0gdGhpcy53ZWFwb247XHJcbiAgICAgIHRoaXMud2VhcG9uID0gY2FzZVdlYXBvbi53ZWFwb247XHJcbiAgICAgIGNhc2VXZWFwb24ucmVtb3ZlV2VhcG9uKCk7XHJcbiAgICAgIGZpZWxkLmNhc2VzW2Nhc2VXZWFwb24ucG9zaXRpb24ueF1bY2FzZVdlYXBvbi5wb3NpdGlvbi55XS53ZWFwb24gPSB3ZWFwb25Ub0Ryb3A7XHJcbiAgICAgIFxyXG4gICAgICAvL0xvZ2ljV2VhcG9uLnBhaW50V2VhcG9uKGNhc2VXZWFwb24sIHdlYXBvblRvRHJvcCwgZmllbGQpO1xyXG4gICB9XHJcblxyXG4gICBpc1dheUJsb2NrZWQoY2FzZVRvUmVhY2g6IENhc2UsIGZpZWxkOiBGaWVsZCk6IEJvb2xlYW57XHJcbiAgICAgIGxldCBibG9ja2VkID0gZmFsc2U7XHJcbiAgICAgIGlmKHRoaXMuY2FzZS5wb3NpdGlvbi54ID09PSBjYXNlVG9SZWFjaC5wb3NpdGlvbi54KXtcclxuICAgICAgICAgbGV0IHggPSB0aGlzLmNhc2UucG9zaXRpb24ueDtcclxuICAgICAgICAgbGV0IHlJbml0ID0gMDtcclxuICAgICAgICAgaWYodGhpcy5jYXNlLnBvc2l0aW9uLnkgPCBjYXNlVG9SZWFjaC5wb3NpdGlvbi55KXtcclxuICAgICAgICAgeUluaXQgPSB0aGlzLmNhc2UucG9zaXRpb24ueSsxO1xyXG4gICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgeUluaXQgPSBjYXNlVG9SZWFjaC5wb3NpdGlvbi55KzE7IFxyXG4gICAgICAgICB9XHJcbiAgICAgICAgICBsZXQgZGVsdGFZID0gTWF0aC5hYnModGhpcy5jYXNlLnBvc2l0aW9uLnkgLSBjYXNlVG9SZWFjaC5wb3NpdGlvbi55KTtcclxuICAgICAgICAgIGZvcihsZXQgcm93ID0gMDsgcm93IDwgZGVsdGFZOyByb3crKyl7XHJcbiAgICAgICAgICAgICBpZihmaWVsZC5jYXNlc1t4XVt5SW5pdCtyb3ddLmlzQmxvY2tlZCA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICBibG9ja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgICBsZXQgeEluaXQgPSAwO1xyXG4gICAgICAgICBsZXQgeSA9IHRoaXMuY2FzZS5wb3NpdGlvbi55O1xyXG4gICAgICAgICBpZih0aGlzLmNhc2UucG9zaXRpb24ueCA8IGNhc2VUb1JlYWNoLnBvc2l0aW9uLngpe1xyXG4gICAgICAgICAgICB4SW5pdCA9IHRoaXMuY2FzZS5wb3NpdGlvbi54KzE7XHJcbiAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB4SW5pdCA9IGNhc2VUb1JlYWNoLnBvc2l0aW9uLngrMTsgXHJcbiAgICAgICAgIH1cclxuICAgICAgICAgIGxldCBkZWx0YVggPSBNYXRoLmFicyh0aGlzLmNhc2UucG9zaXRpb24ueCAtIGNhc2VUb1JlYWNoLnBvc2l0aW9uLngpO1xyXG4gICAgICAgICAgZm9yKGxldCBjb2wgPSAwOyBjb2wgPCBkZWx0YVg7IGNvbCsrKXtcclxuICAgICAgICAgICAgIGlmKGZpZWxkLmNhc2VzW3hJbml0K2NvbF1beV0uaXNCbG9ja2VkID09PSB0cnVlKXtcclxuICAgICAgICAgICAgICAgIGJsb2NrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZihibG9ja2VkID09PSB0cnVlKXtcclxuICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgIGlzQ2FzZVJlYWNoYWJsZShjYXNlVG9SZWFjaDogQ2FzZSwgZmllbGQ6IEZpZWxkKXtcclxuICAgICAgbGV0IGRlbHRhWCA9IE1hdGguYWJzKGNhc2VUb1JlYWNoLnBvc2l0aW9uLnggLSB0aGlzLmNhc2UucG9zaXRpb24ueCk7XHJcbiAgICAgIGxldCBkZWx0YVkgPSBNYXRoLmFicyhjYXNlVG9SZWFjaC5wb3NpdGlvbi55IC0gdGhpcy5jYXNlLnBvc2l0aW9uLnkpO1xyXG4gICAgICBpZiggZGVsdGFYIDw9IDMgJiYgIGRlbHRhWSA8PSAzICl7XHJcbiAgICAgICAgIGlmKGNhc2VUb1JlYWNoLnBvc2l0aW9uLnggPT09IHRoaXMuY2FzZS5wb3NpdGlvbi54IHx8IGNhc2VUb1JlYWNoLnBvc2l0aW9uLnkgPT09IHRoaXMuY2FzZS5wb3NpdGlvbi55KXtcclxuICAgICAgICAgaWYoIWNhc2VUb1JlYWNoLmlzQmxvY2tlZCAmJiAhdGhpcy5pc1dheUJsb2NrZWQoY2FzZVRvUmVhY2gsIGZpZWxkKSl7XHJcbiAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgIH1cclxuXHJcbiAgIGdldENsb3NlZENhc2VzKCk6IEFycmF5PENhc2U+e1xyXG4gICAgICBsZXQgY2xvc2VkQ2FzZXMgPSBBcnJheTxDYXNlPigpO1xyXG4gICAgICBsZXQgc2l6ZVggPSB0aGlzLmNhc2UuZ2FtZU1hbmFnZXIuZmllbGQuc2l6ZS54O1xyXG4gICAgICBsZXQgc2l6ZVkgPSB0aGlzLmNhc2UuZ2FtZU1hbmFnZXIuZmllbGQuc2l6ZS55O1xyXG4gICAgICBsZXQgZmllbGQgPSB0aGlzLmNhc2UuZ2FtZU1hbmFnZXIuZmllbGQ7XHJcblxyXG4gICAgICBmb3IobGV0IGNvbCA9IDA7IGNvbCA8IHNpemVYOyBjb2wrKyl7XHJcbiAgICAgICAgIGZvcihsZXQgcm93ID0gMDsgcm93IDwgc2l6ZVk7IHJvdysrKXtcclxuICAgICAgICAgICAgaWYodGhpcy5jYXNlLmNhc2VzQWRqYWNlbnQoZmllbGQuY2FzZXNbY29sXVtyb3ddKSl7XHJcbiAgICAgICAgICAgICAgIGNsb3NlZENhc2VzLnB1c2goZmllbGQuY2FzZXNbY29sXVtyb3ddKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGNsb3NlZENhc2VzO1xyXG4gICB9XHJcblxyXG4gICBpc0Nsb3NlZENhc2VzQmxvY2tlZCgpOiBCb29sZWFue1xyXG4gICAgICBsZXQgYWxsQmxvY2tlZCA9IHRydWU7XHJcbiAgICAgIGZvcihsZXQgY2FzZVRvQ2hlY2sgb2YgdGhpcy5jbG9zZWRDYXNlcyl7XHJcbiAgICAgICAgIGlmKCFjYXNlVG9DaGVjay5pc0Jsb2NrZWQpe1xyXG4gICAgICAgICAgICBhbGxCbG9ja2VkID0gZmFsc2U7XHJcbiAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gYWxsQmxvY2tlZDtcclxuICAgfVxyXG5cclxuICAgbW92ZVRvKGZpZWxkOiBGaWVsZCwgY2FzZVRvTW92ZTogQ2FzZSl7XHJcbiAgICAgIGxldCBjaGFuZ2VkV2VhcG9uID0gZmFsc2U7XHJcbiAgICAgIGxldCBjYXNlRnJvbSA9IHRoaXMuY2FzZTtcclxuICAgICAgbGV0IHByZXZpb3VzV2VhcG9uID0gdGhpcy53ZWFwb247XHJcbiAgICAgIGxldCBsb2dnZXIgPSB0aGlzLmNhc2UuZ2FtZU1hbmFnZXIubG9nZ2VyO1xyXG4gICAgICBpZih0aGlzLmlzQ2FzZVJlYWNoYWJsZShjYXNlVG9Nb3ZlLCBmaWVsZCkpe1xyXG5cclxuICAgICAgICAgbGV0IG5leHRQbGF5ZXJBcnJheSA9IGZpZWxkLmNoYXJhY3RlcnMuZmlsdGVyKChuZXh0UGxheWVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAobmV4dFBsYXllciAhPT0gdGhpcy5jYXNlLmdhbWVNYW5hZ2VyLnBsYXllclRvdXIpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgbGV0IG5leHRQbGF5ZXIgPSBuZXh0UGxheWVyQXJyYXlbMF07XHJcbiAgICAgICAgIFxyXG4gICAgICB0aGlzLmNhc2UgPSBjYXNlVG9Nb3ZlO1xyXG4gICAgICB0aGlzLmNsb3NlZENhc2VzID0gdGhpcy5nZXRDbG9zZWRDYXNlcygpO1xyXG4gICAgICBpZihjYXNlVG9Nb3ZlLmhhc1dlYXBvbigpKXtcclxuICAgICAgICAgdGhpcy50YWtlV2VhcG9uKHRoaXMuY2FzZSwgZmllbGQpO1xyXG4gICAgICAgICBjaGFuZ2VkV2VhcG9uID0gdHJ1ZTtcclxuICAgICAgICAgbG9nZ2VyLndyaXR0ZURlc2NyaXB0aW9uKCdUaGUgcGxheWVyICcgKyB0aGlzLmNhc2UuZ2FtZU1hbmFnZXIucGxheWVyVG91ci5uYW1lICsgJyBsZXQgdGhlIHdlYXBvbiAnKyBjYXNlVG9Nb3ZlLndlYXBvbi5uYW1lICsnIHRvIHRha2UgdGhlIHdlYXBvbiAnICsgdGhpcy53ZWFwb24ubmFtZSArJy4nKTtcclxuICAgICAgICAgY29uc29sZS5sb2coJ1RoZSBwbGF5ZXIgJyArIHRoaXMuY2FzZS5nYW1lTWFuYWdlci5wbGF5ZXJUb3VyLm5hbWUgKyAnIGxldCB0aGUgd2VhcG9uICcrIGNhc2VUb01vdmUud2VhcG9uLm5hbWUgKycgdG8gdGFrZSB0aGUgd2VhcG9uICcgKyB0aGlzLndlYXBvbi5uYW1lICsnLicpO1xyXG4gICAgICAgICBNZW51TWFuYWdlci51cGRhdGVJbmZvV2VhcG9uKHRoaXMsIHRoaXMuY2FzZS5nYW1lTWFuYWdlci5wbGF5ZXJzLmluZGV4T2YodGhpcykpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAgICAgTG9naWNDaGFyYWN0ZXIuc2V0QWJzb2x1dGVQb3NpdGlvbih0aGlzKTtcclxuICAgICAgICAgIExvZ2ljQ2hhcmFjdGVyLmNoYXJhY3RlckFuaW1hdGlvbih0aGlzLCB0aGlzLmFic29sdXRlQ29vcmQpO1xyXG4gICAgICAgICBpZihjaGFuZ2VkV2VhcG9uKXtcclxuICAgICAgICAgICAgTG9naWNXZWFwb24ucGFpbnRXZWFwb24oZmllbGQuY2FzZXNbY2FzZUZyb20ucG9zaXRpb24ueF1bY2FzZUZyb20ucG9zaXRpb24ueV0sIHByZXZpb3VzV2VhcG9uLCBmaWVsZCk7XHJcbiAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICB0aGlzLmNhc2UuZ2FtZU1hbmFnZXIucGxheWVyVG91ciA9IG5leHRQbGF5ZXI7XHJcbiAgICAgIE1lbnVNYW5hZ2VyLnVwZGF0ZVBsYXllclRvdXJNZW51KHRoaXMuY2FzZS5nYW1lTWFuYWdlci5wbGF5ZXJUb3VyKTtcclxuICAgICAgbG9nZ2VyLndyaXR0ZURlc2NyaXB0aW9uKCdUaGUgcGxheWVyICcgKyB0aGlzLmNhc2UuZ2FtZU1hbmFnZXIucGxheWVyVG91ci5uYW1lICsgJyBjYW4gcGxheS4nKTtcclxuICAgICAgY29uc29sZS5sb2coJ1RoZSBwbGF5ZXIgJyArIHRoaXMuY2FzZS5nYW1lTWFuYWdlci5wbGF5ZXJUb3VyLm5hbWUgKyAnIGNhbiBwbGF5LicpO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICAgbG9nZ2VyLndyaXR0ZURlc2NyaXB0aW9uKFwiVGhpcyBwbGFjZSBpcyB1bnJlYWNoYWJsZSEhXCIpO1xyXG4gICAgICAgICBjb25zb2xlLmxvZyhcIlRoaXMgcGxhY2UgaXMgdW5yZWFjaGFibGUhIVwiKTtcclxuICAgICAgfVxyXG4gICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENoYXJhY3RlcjsiLCIvL1RoaXMgY2xhc3MgZm9yIHRoZSBmaWVsZHNcclxuY2xhc3MgQ29vcmQge1xyXG4gICAgLy9maWVsZCBcclxuICAgIHggOiBudW1iZXI7XHJcbiAgICB5IDogbnVtYmVyO1xyXG5cclxuICAgIC8vY29uc3RydWN0b3IgXHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBDb29yZDsiLCJpbXBvcnQgQ2FzZSBmcm9tIFwiLi4vLi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcbmltcG9ydCBGaWVsZCBmcm9tIFwiLi4vbW9kZWwvZmllbGRcIjtcclxuaW1wb3J0IENhc2VMb2dpYyBmcm9tIFwiLi4vLi4vY2FzZS9sb2dpYy9jYXNlTG9naWNcIjtcclxuaW1wb3J0IFdlYXBvbiBmcm9tIFwiLi4vLi4vd2VhcG9uL21vZGVsL3dlYXBvblwiO1xyXG5pbXBvcnQgTG9naWNXZWFwb24gZnJvbSBcIi4uLy4uL3dlYXBvbi9sb2dpYy9sb2dpY1dlYXBvblwiO1xyXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gXCIuLi8uLi9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCBMb2dpY0NoYXJhY3RlciBmcm9tIFwiLi4vLi4vY2hhcmFjdGVyL2xvZ2ljL2xvZ2ljQ2hhcmFjdGVyXCI7XHJcbmltcG9ydCBDb29yZCBmcm9tIFwiLi4vLi4vY29vcmQvbW9kZWwvY29vcmRcIjtcclxuXHJcbi8vVGhpcyBjbGFzcyB3aWxsIGdlbmVyYXRlIGFsbCB0aGUgZGlmZmVyZW50IG9iamVjdHMgbmVlZGVkIGZvciB0aGUgZ2FtZVxyXG5hYnN0cmFjdCBjbGFzcyBMb2dpY0ZpZWxkIHtcclxuXHJcbiAgIC8qKlxyXG4gICAgKiBcclxuICAgICogQHBhcmFtIHggXHJcbiAgICAqIEBwYXJhbSB5IFxyXG4gICAgKi9cclxuICAgc3RhdGljIGdlbmVyYXRlTWFwKHg6IG51bWJlciwgeTogbnVtYmVyKTogRmllbGQge1xyXG4gICAgICBsZXQgdG90YWxDYXNlcyA9IHggKiB5O1xyXG4gICAgICBsZXQgYmxvY2tlZENhc2VzID0gTWF0aC5yb3VuZCh0b3RhbENhc2VzIC8gNik7XHJcbiAgICAgIGxldCBmaWVsZDogRmllbGQgPSBuZXcgRmllbGQoeCwgeSk7XHJcblxyXG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCB4OyBjb2wrKykge1xyXG4gICAgICAgICBmaWVsZC5jYXNlc1tjb2xdID0gW107XHJcbiAgICAgICAgIGZvcihsZXQgcm93ID0gMDsgcm93IDwgeTsgcm93Kyspe1xyXG4gICAgICAgICAgICBsZXQgcG9zaXRpb24gPSBuZXcgQ29vcmQoY29sLCByb3cpO1xyXG5cclxuICAgICAgICAgaWYgKGJsb2NrZWRDYXNlcyA+IDApIHtcclxuICAgICAgICAgICAgbGV0IGJsb2NrZWRDYXNlID0gbmV3IENhc2UocG9zaXRpb24sIENhc2VMb2dpYy5CTE9DS0VEKTtcclxuICAgICAgICAgICAgZmllbGQuY2FzZXNbY29sXVtyb3ddID0gYmxvY2tlZENhc2U7XHJcbiAgICAgICAgICAgIGJsb2NrZWRDYXNlcyA9IGJsb2NrZWRDYXNlcyAtIDE7XHJcbiAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBub25CbG9ja2VkQ2FzZSA9IG5ldyBDYXNlKHBvc2l0aW9uKTtcclxuICAgICAgICAgICAgZmllbGQuY2FzZXNbY29sXVtyb3ddID0gbm9uQmxvY2tlZENhc2U7XHJcbiAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGZpZWxkLnVuc29ydENhc2VzKCk7XHJcblxyXG4gICAgICByZXR1cm4gZmllbGQ7XHJcbiAgIH1cclxuXHJcbiAgIC8qKlxyXG4gICAgKiBcclxuICAgICogQHBhcmFtIGVsZW1lbnRUb0ZpbGwgXHJcbiAgICAqIEBwYXJhbSBmaWVsZCBcclxuICAgICovXHJcbiAgIHN0YXRpYyBwYWludEZpZWxkKGVsZW1lbnRUb0ZpbGw6IEhUTUxFbGVtZW50LCBmaWVsZDogRmllbGQpOiB2b2lkIHtcclxuXHJcbiAgICAgIFxyXG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBmaWVsZC5zaXplLng7IGNvbCsrKSB7XHJcbiAgICAgICAgIGxldCByb3dFbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICByb3dFbHQuc3R5bGUuaGVpZ2h0ID0gKDEwMCAvIGZpZWxkLnNpemUueCkudG9GaXhlZCgyKSsgXCIlXCI7XHJcbiAgICAgICAgIHJvd0VsdC5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcclxuICAgICAgICAgcm93RWx0LmNsYXNzTGlzdC5hZGQoXCJyb3ctbWFwXCIpO1xyXG4gICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBmaWVsZC5zaXplLnk7IHJvdysrKXtcclxuICAgICAgICAgbGV0IGRpdkVsdCA9IENhc2VMb2dpYy5wYWludENhc2UoZmllbGQuY2FzZXNbY29sXVtyb3ddKTtcclxuICAgICAgICAgcm93RWx0LmFwcGVuZENoaWxkKGRpdkVsdCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxlbWVudFRvRmlsbC5hcHBlbmRDaGlsZChyb3dFbHQpO1xyXG4gICB9XHJcbiAgIH1cclxuXHJcblxyXG4gICAgc3RhdGljIHNldFdlYXBvbihmaWVsZDogRmllbGQpOiB2b2lkIHtcclxuICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjsgaSsrKSB7XHJcbiAgICAgICAgIGxldCB3ZWFwb24gPSBuZXcgV2VhcG9uKFwiTWpvbG5pclwiK2ksIDEwK2ksIFwiL2Fzc2V0cy9pbWcvd2VhcG9uL3dlYXBvbjEucG5nXCIpO1xyXG4gICAgICAgICBmaWVsZC53ZWFwb25zLnB1c2god2VhcG9uKTtcclxuICAgICAgIH1cclxuICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjsgaSsrKSB7XHJcbiAgICAgICAgIGxldCB3ZWFwb24gPSBuZXcgV2VhcG9uKFwiU3Rvcm1icmVha2VyXCIraSwgMjAraSwgXCIvYXNzZXRzL2ltZy93ZWFwb24vd2VhcG9uMS5wbmdcIik7XHJcbiAgICAgICAgIGZpZWxkLndlYXBvbnMucHVzaCh3ZWFwb24pO1xyXG4gICAgICAgfVxyXG4gICAgICAgZm9yKGxldCB3ZWFwb24gb2YgZmllbGQud2VhcG9ucyl7XHJcbiAgICAgICAgICBMb2dpY1dlYXBvbi5wYWludFN0YXJ0V2VhcG9uKGZpZWxkLCB3ZWFwb24pO1xyXG5cclxuICAgICAgIH1cclxuICAgIH0gXHJcblxyXG4gICBzdGF0aWMgc2V0Q2hhcmFjdGVycyhmaWVsZDogRmllbGQpOiB2b2lkIHtcclxuICAgICAgTG9naWNDaGFyYWN0ZXIucGFpbnRTdGFydENoYXJhY3RlcnMoZmllbGQsIFwiRXh0ZXJtaW5hdG9yXCIsIFwiL2Fzc2V0cy9pbWcvY2hhcmFjdGVycy9hdmF0YXIxLnBuZ1wiKTtcclxuICAgICAgTG9naWNDaGFyYWN0ZXIucGFpbnRTdGFydENoYXJhY3RlcnMoZmllbGQsIFwiUHJlZGF0b3JcIiwgXCIvYXNzZXRzL2ltZy9jaGFyYWN0ZXJzL2F2YXRhcjIucG5nXCIpO1xyXG4gICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IExvZ2ljRmllbGQ7IiwiaW1wb3J0IENhc2UgZnJvbSBcIi4uLy4uL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgQ29vcmQgZnJvbSBcIi4uLy4uL2Nvb3JkL21vZGVsL2Nvb3JkXCI7XHJcbmltcG9ydCBTaXplIGZyb20gXCIuLi8uLi9zaXplL21vZGVsL3NpemVcIjtcclxuaW1wb3J0IFdlYXBvbiBmcm9tIFwiLi4vLi4vd2VhcG9uL21vZGVsL3dlYXBvblwiO1xyXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gXCIuLi8uLi9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCBMb2dpY0hlbHBlciBmcm9tIFwiLi4vLi4vLi4vaGVscGVycy9Mb2dpY0hlbHBlclwiO1xyXG5cclxuXHJcbi8vVGhpcyBjbGFzcyBmb3IgdGhlIGZpZWxkc1xyXG5jbGFzcyBGaWVsZCB7XHJcbiAgICAvL2ZpZWxkIFxyXG4gICAgc2l6ZTogU2l6ZTtcclxuICAgIGNhc2VzOiBDYXNlW11bXTtcclxuICAgIHdlYXBvbnM6IFdlYXBvbltdO1xyXG4gICAgY2hhcmFjdGVyczogQ2hhcmFjdGVyW107XHJcbiAgICAkZWw6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgIC8vY29uc3RydWN0b3IgXHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuc2l6ZSA9IG5ldyBTaXplKHgseSk7XHJcbiAgICAgICAgdGhpcy5jYXNlcyA9IEFycmF5PEFycmF5PENhc2U+PigpO1xyXG4gICAgICAgIHRoaXMud2VhcG9ucyA9IFtdO1xyXG4gICAgICAgIHRoaXMuY2hhcmFjdGVycyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gY2FzZVRvQWRkIFxyXG4gICAgICovXHJcbiAgICBhZGRDYXNlKGNhc2VUb0FkZDogQ2FzZVtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jYXNlcy5wdXNoKGNhc2VUb0FkZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBpbmRpY2VDYXNlIFxyXG4gICAgICovXHJcbiAgICByZW1vdmVDYXNlKHBvc2l0aW9uOiBDb29yZCk6IHZvaWR7XHJcbiAgICAgICAgdGhpcy5jYXNlc1twb3NpdGlvbi54XS5zcGxpY2UocG9zaXRpb24ueSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqL1xyXG4gICAgbmJyT2ZCbG9ja2VkQ2FzZSgpOiBudW1iZXIge1xyXG4gICAgICAgIGxldCBuYnJPZkJsb2NrZWRDYXNlOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMuc2l6ZS54OyByb3crKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCB0aGlzLnNpemUueTsgY29sKyspe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYXNlc1tyb3ddW2NvbF0uaXNCbG9ja2VkKSB7XHJcbiAgICAgICAgICAgICAgICBuYnJPZkJsb2NrZWRDYXNlID0gbmJyT2ZCbG9ja2VkQ2FzZSArIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ick9mQmxvY2tlZENhc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqL1xyXG4gICAgZ2V0Tm9uQmxvY2tlZENhc2VzKCk6IEFycmF5PENhc2U+IHtcclxuICAgICAgICBsZXQgTm9uQmxvY2tlZENhc2VzOiBBcnJheTxDYXNlPiA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMuc2l6ZS54OyByb3crKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCB0aGlzLnNpemUueTsgY29sKyspe1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY2FzZXNbcm93XVtjb2xdLmlzQmxvY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhc2VUb0FkZCA9IHRoaXMuY2FzZXNbcm93XVtjb2xdO1xyXG4gICAgICAgICAgICAgICAgTm9uQmxvY2tlZENhc2VzLnB1c2goY2FzZVRvQWRkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICAgICByZXR1cm4gTm9uQmxvY2tlZENhc2VzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEJsb2NrZWRDYXNlcygpOiBBcnJheTxDYXNlPiB7XHJcbiAgICAgICAgbGV0IEJsb2NrZWRDYXNlczogQXJyYXk8Q2FzZT4gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLnNpemUueDsgcm93KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5zaXplLnk7IGNvbCsrKXtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2FzZXNbcm93XVtjb2xdLmlzQmxvY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhc2VUb0FkZCA9IHRoaXMuY2FzZXNbcm93XVtjb2xdO1xyXG4gICAgICAgICAgICAgICAgQmxvY2tlZENhc2VzLnB1c2goY2FzZVRvQWRkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICAgICByZXR1cm4gQmxvY2tlZENhc2VzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEF2YWlsYWJsZUNhc2VzKCk6IEFycmF5PENhc2U+IHtcclxuICAgICAgICBsZXQgYXZhaWxhYmxlQ2FzZXM6IEFycmF5PENhc2U+ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5zaXplLng7IHJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuc2l6ZS55OyBjb2wrKyl7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhc2VzW3Jvd11bY29sXS5pc0F2YWlsYWJsZSAmJiAhdGhpcy5jYXNlc1tyb3ddW2NvbF0uaXNCbG9ja2VkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FzZVRvQWRkID0gdGhpcy5jYXNlc1tyb3ddW2NvbF07XHJcbiAgICAgICAgICAgICAgICBhdmFpbGFibGVDYXNlcy5wdXNoKGNhc2VUb0FkZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAgICAgcmV0dXJuIGF2YWlsYWJsZUNhc2VzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gXHJcbiAgICAgKi9cclxuICAgIGdldENhc2VCeVBvc2l0aW9uKHBvc2l0aW9uOiBDb29yZCk6IENhc2Uge1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNhc2VzW3Bvc2l0aW9uLnhdW3Bvc2l0aW9uLnldKTtcclxuICAgICAgICBpZiAocG9zaXRpb24gPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhc2VzW3Bvc2l0aW9uLnhdW3Bvc2l0aW9uLnldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICovXHJcbiAgICBnZXRSYW5kb21DYXNlKCk6IENhc2V7XHJcbiAgICAgICAgbGV0IHJhbmRvbVggPSBMb2dpY0hlbHBlci5nZXRSYW5kb21EaW1lbnNpb24odGhpcy5zaXplLngtMSk7XHJcbiAgICAgICAgbGV0IHJhbmRvbVkgPSBMb2dpY0hlbHBlci5nZXRSYW5kb21EaW1lbnNpb24odGhpcy5zaXplLnktMSk7XHJcblxyXG4gICAgICAgIGxldCByYW5kb21Db29yZCA9IG5ldyBDb29yZChyYW5kb21YLCByYW5kb21ZKTtcclxuXHJcbiAgICAgICAgbGV0IGNhc2VSYW5kb20gPSB0aGlzLmdldENhc2VCeVBvc2l0aW9uKHJhbmRvbUNvb3JkKTtcclxuICAgICAgICBsZXQgY2FzZVRvQ2hlY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYXNlUmFuZG9tLnBvc2l0aW9uU3RyaW5nKTtcclxuICAgICAgICB3aGlsZShjYXNlVG9DaGVjayA9PT0gbnVsbCB8fCBjYXNlVG9DaGVjayA9PT0gdW5kZWZpbmVkIHx8IGNhc2VSYW5kb20gPT09IHVuZGVmaW5lZCB8fCBjYXNlUmFuZG9tID09PSBudWxsKXtcclxuXHJcbiAgICAgICAgICAgIGxldCByYW5kb21YID0gTG9naWNIZWxwZXIuZ2V0UmFuZG9tRGltZW5zaW9uKHRoaXMuc2l6ZS54LTEpO1xyXG4gICAgICAgICAgICBsZXQgcmFuZG9tWSA9IExvZ2ljSGVscGVyLmdldFJhbmRvbURpbWVuc2lvbih0aGlzLnNpemUueS0xKTtcclxuICAgIFxyXG4gICAgICAgICAgICBsZXQgcmFuZG9tQ29vcmQgPSBuZXcgQ29vcmQocmFuZG9tWCwgcmFuZG9tWSk7XHJcblxyXG4gICAgICAgICAgICBjYXNlUmFuZG9tID0gdGhpcy5nZXRDYXNlQnlQb3NpdGlvbihyYW5kb21Db29yZCk7XHJcbiAgICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2FzZVJhbmRvbTtcclxuICAgIH1cclxuXHJcbiAgXHJcbiAgICBnZXROb25CbG9ja2VkUmFuZG9tQ2FzZSgpOiBDYXNle1xyXG5cclxuICAgICAgICBsZXQgbm9uQmxvY2tlZENhc2VzID0gdGhpcy5nZXROb25CbG9ja2VkQ2FzZXMoKTtcclxuXHJcbiAgICAgICAgbGV0IGluZGljZSA9IExvZ2ljSGVscGVyLmdldFJhbmRvbURpbWVuc2lvbihub25CbG9ja2VkQ2FzZXMubGVuZ3RoLTEpO1xyXG5cclxuICAgICAgICBsZXQgbm9uQmxvY2tlZFJhbmRvbUNhc2UgPSBub25CbG9ja2VkQ2FzZXNbaW5kaWNlXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5vbkJsb2NrZWRSYW5kb21DYXNlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXRBdmFpbGFibGVSYW5kb21DYXNlKCk6IENhc2V7XHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZUNhc2VzID0gdGhpcy5nZXRBdmFpbGFibGVDYXNlcygpO1xyXG5cclxuICAgICAgICBsZXQgaW5kaWNlID0gTG9naWNIZWxwZXIuZ2V0UmFuZG9tRGltZW5zaW9uKGF2YWlsYWJsZUNhc2VzLmxlbmd0aC0xKTtcclxuXHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZVJhbmRvbUNhc2UgPSBhdmFpbGFibGVDYXNlc1tpbmRpY2VdO1xyXG5cclxuICAgICAgICByZXR1cm4gYXZhaWxhYmxlUmFuZG9tQ2FzZTtcclxuICAgIH0gXHJcblxyXG5cclxuICAgIGR1cGxpY2F0ZUxpc3RPZkNhc2UoKTogQ2FzZVtde1xyXG4gICAgICAgIGxldCBjYXNlc1RlbXAgPSBBcnJheTxDYXNlPigpO1xyXG4gICAgICAgIGZvciAobGV0IHJvdz0wOyByb3cgPCB0aGlzLnNpemUueDsgcm93KyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCBjb2w9MDsgY29sIDwgdGhpcy5zaXplLnk7IGNvbCsrKXtcclxuICAgICAgICAgICBsZXQgY2FzZVRvQWRkID0gdGhpcy5jYXNlc1tyb3ddW2NvbF07XHJcbiAgICAgICAgICAgY2FzZXNUZW1wLnB1c2goY2FzZVRvQWRkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNhc2VzVGVtcDtcclxuICAgIH1cclxuXHJcbiAgICB1bnNvcnRDYXNlcygpOiB2b2lke1xyXG4gICAgICAgIGxldCBjYXNlc1RlbXAgPSB0aGlzLmR1cGxpY2F0ZUxpc3RPZkNhc2UoKTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBjb2wgPSAwOyBjb2wgPCB0aGlzLnNpemUueDsgY29sKyspe1xyXG4gICAgICAgICAgICBmb3IobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMuc2l6ZS55OyByb3crKyl7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGluZGljZSA9IExvZ2ljSGVscGVyLmdldFJhbmRvbURpbWVuc2lvbihjYXNlc1RlbXAubGVuZ3RoLTEpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY2FzZXNbY29sXVtyb3ddID0gY2FzZXNUZW1wW2luZGljZV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhc2VzW2NvbF1bcm93XS5wb3NpdGlvbi54ID0gY29sO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXNlc1tjb2xdW3Jvd10ucG9zaXRpb24ueSA9IHJvdztcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FzZXNbY29sXVtyb3ddLnBvc2l0aW9uU3RyaW5nID0gU3RyaW5nKGNvbCkrU3RyaW5nKHJvdyk7XHJcbiAgICAgICAgICAgICAgICBjYXNlc1RlbXAuc3BsaWNlKGluZGljZSwxKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2FzZUJ5RWx0KGVsOiBFbGVtZW50KTogQ2FzZXtcclxuICAgICAgICBmb3IobGV0IHJvd0Nhc2VzIG9mIHRoaXMuY2FzZXMpe1xyXG4gICAgICAgICAgICBmb3IobGV0IGNhc2VUb0dldCBvZiByb3dDYXNlcyl7XHJcbiAgICAgICAgICAgICAgICBpZihjYXNlVG9HZXQuJGVsID09PSBlbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhc2VUb0dldDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBGaWVsZDsiLCJpbXBvcnQgQ2FzZSBmcm9tIFwiLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuL2ZpZWxkL21vZGVsL2ZpZWxkXCI7XHJcbmltcG9ydCBMb2dpY0ZpZWxkIGZyb20gXCIuL2ZpZWxkL2xvZ2ljL2xvZ2ljRmllbGRcIjtcclxuaW1wb3J0IENhc2VMb2dpYyBmcm9tIFwiLi9jYXNlL2xvZ2ljL2Nhc2VMb2dpY1wiO1xyXG5pbXBvcnQgV2VhcG9uIGZyb20gXCIuL3dlYXBvbi9tb2RlbC93ZWFwb25cIjtcclxuaW1wb3J0IExvZ2ljV2VhcG9uIGZyb20gXCIuL3dlYXBvbi9sb2dpYy9sb2dpY1dlYXBvblwiO1xyXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gXCIuL2NoYXJhY3Rlci9tb2RlbC9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IExvZ2ljQ2hhcmFjdGVyIGZyb20gXCIuL2NoYXJhY3Rlci9sb2dpYy9sb2dpY0NoYXJhY3RlclwiO1xyXG5pbXBvcnQgQ29vcmQgZnJvbSBcIi4vY29vcmQvbW9kZWwvY29vcmRcIjtcclxuaW1wb3J0IExvZ2dlciBmcm9tIFwiLi9sb2dnZXJcIjtcclxuaW1wb3J0IE1lbnVNYW5hZ2VyIGZyb20gXCIuL21lbnVNYW5hZ2VyXCI7XHJcblxyXG5jbGFzcyBHYW1lTWFuYWdlciB7XHJcbiAgICBmaWVsZDogRmllbGQ7XHJcbiAgICBpZDogc3RyaW5nID0gJ2ZpZ2h0JztcclxuICAgIHBsYXllcnM6IEFycmF5PENoYXJhY3Rlcj47XHJcbiAgICBwbGF5ZXJUb3VyOiBDaGFyYWN0ZXI7XHJcbiAgICBtYXhNb3ZlOiBudW1iZXIgPSAzO1xyXG4gICAgbG9nZ2VyOiBMb2dnZXI7XHJcbiAgICBtZW51TWFuYWdlcjogTWVudU1hbmFnZXI7XHJcblxyXG4gICAgJGVsOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMucGxheWVycyA9IG5ldyBBcnJheTxDaGFyYWN0ZXI+KCk7XHJcbiAgICAgICAgdGhpcy5sb2dnZXIgPSBuZXcgTG9nZ2VyKCk7XHJcbiAgICAgICAgdGhpcy4kZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRHYW1lTWFuYWdlcigpe1xyXG4gICAgICAgIGZvcihsZXQgcm93RmllbGQgb2YgdGhpcy5maWVsZC5jYXNlcyl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgY2FzZVRvVXBkYXRlIG9mIHJvd0ZpZWxkKXtcclxuICAgICAgICAgICAgICAgIGNhc2VUb1VwZGF0ZS5nYW1lTWFuYWdlciA9IHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnRHYW1lKCkge1xyXG4gICAgICAgIHRoaXMubG9nZ2VyLndyaXR0ZURlc2NyaXB0aW9uKCdzdGFydGluZyBnYW1lLi4uJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3N0YXJ0aW5nIGdhbWUuLi4nKTtcclxuXHJcbiAgICAgICAgbGV0IGZpZWxkID0gTG9naWNGaWVsZC5nZW5lcmF0ZU1hcCg4LCA4KTtcclxuXHJcbiAgICAgICAgdGhpcy5maWVsZCA9IGZpZWxkO1xyXG5cclxuICAgICAgICB0aGlzLnNldEdhbWVNYW5hZ2VyKCk7XHJcblxyXG4gICAgICAgIExvZ2ljRmllbGQucGFpbnRGaWVsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpZ2h0XCIpLCBmaWVsZCk7XHJcblxyXG4gICAgICAgIExvZ2ljRmllbGQuc2V0V2VhcG9uKGZpZWxkKTtcclxuXHJcbiAgICAgICAgTG9naWNGaWVsZC5zZXRDaGFyYWN0ZXJzKGZpZWxkKTtcclxuXHJcbiAgICAgICAgLy8gRmlyc3QgUGxheWVyIHN0YXJ0XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJUb3VyID0gZmllbGQuY2hhcmFjdGVyc1swXTtcclxuICAgICAgICBNZW51TWFuYWdlci5zZXRNZW51KHRoaXMpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2hvd1JlYWNoYWJsZUNhc2UoKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2dnZXIud3JpdHRlRGVzY3JpcHRpb24oJ1RoZSBwbGF5ZXIgJyArIHRoaXMucGxheWVyVG91ci5uYW1lICsgJyBjYW4gcGxheS4nKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnVGhlIHBsYXllciAnICsgdGhpcy5wbGF5ZXJUb3VyLm5hbWUgKyAnIGNhbiBwbGF5LicpO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dSZWFjaGFibGVDYXNlKCl7XHJcbiAgICAgICAgZm9yKGxldCBjb2w9MDsgY29sIDwgdGhpcy5maWVsZC5zaXplLng7IGNvbCsrKXtcclxuICAgICAgICAgICAgZm9yKGxldCByb3c9MDsgcm93IDwgdGhpcy5maWVsZC5zaXplLnk7IHJvdysrKXtcclxuICAgICAgICAgICAgICAgIGxldCBjYXNlVG9DaGVjayA9IHRoaXMuZmllbGQuY2FzZXNbY29sXVtyb3ddO1xyXG4gICAgICAgICAgICBpZih0aGlzLnBsYXllclRvdXIuaXNDYXNlUmVhY2hhYmxlKGNhc2VUb0NoZWNrLCB0aGlzLmZpZWxkKSA9PT0gdHJ1ZSAmJiBjYXNlVG9DaGVjayAhPT0gdGhpcy5wbGF5ZXJUb3VyLmNhc2Upe1xyXG4gICAgICAgICAgICAgICAgY2FzZVRvQ2hlY2suJGVsLmNsYXNzTGlzdC5hZGQoXCJjYXNlLXJlYWNoYWJsZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIFxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IEdhbWVNYW5hZ2VyOyIsImltcG9ydCBDYXNlIGZyb20gXCIuL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4vZmllbGQvbW9kZWwvZmllbGRcIjtcclxuaW1wb3J0IExvZ2ljRmllbGQgZnJvbSBcIi4vZmllbGQvbG9naWMvbG9naWNGaWVsZFwiO1xyXG5pbXBvcnQgQ2FzZUxvZ2ljIGZyb20gXCIuL2Nhc2UvbG9naWMvY2FzZUxvZ2ljXCI7XHJcbmltcG9ydCBXZWFwb24gZnJvbSBcIi4vd2VhcG9uL21vZGVsL3dlYXBvblwiO1xyXG5pbXBvcnQgTG9naWNXZWFwb24gZnJvbSBcIi4vd2VhcG9uL2xvZ2ljL2xvZ2ljV2VhcG9uXCI7XHJcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4vY2hhcmFjdGVyL21vZGVsL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgTG9naWNDaGFyYWN0ZXIgZnJvbSBcIi4vY2hhcmFjdGVyL2xvZ2ljL2xvZ2ljQ2hhcmFjdGVyXCI7XHJcbmltcG9ydCBDb29yZCBmcm9tIFwiLi9jb29yZC9tb2RlbC9jb29yZFwiO1xyXG5cclxuY2xhc3MgTG9nZ2VyIHtcclxuICAgIGFjdGl2aXR5OiBBcnJheTxzdHJpbmc+O1xyXG4gICAgJGVsOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmFjdGl2aXR5ID0gQXJyYXk8c3RyaW5nPigpO1xyXG5cclxuICAgICAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhY3Rpdml0eS1pdGVtLWxpc3QnKTtcclxuICAgIH1cclxuXHJcbndyaXR0ZURlc2NyaXB0aW9uKHRleHQ6IHN0cmluZyl7XHJcbiAgICBsZXQgYWN0aXZpdHlFbHQgPSB0aGlzLiRlbDtcclxuICAgIHRoaXMuYWN0aXZpdHkucHVzaCh0ZXh0KTtcclxuICAgIGxldCBsYXN0QWN0aXZpdHlJbmRpY2UgPSB0aGlzLmFjdGl2aXR5Lmxlbmd0aC0xO1xyXG4gICAgbGV0IGRpdkVsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBsZXQgZGl2VGV4dEVsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgbGV0IGl0ZW1MaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbGFzdC1pdGVtJyk7XHJcbiAgICBpZihpdGVtTGlzdFswXSAhPT0gdW5kZWZpbmVkICYmIGl0ZW1MaXN0WzBdICE9PSBudWxsKXtcclxuICAgIGl0ZW1MaXN0WzBdLmNsYXNzTGlzdC5yZW1vdmUoJ2xhc3QtaXRlbScpO1xyXG4gICAgfVxyXG5cclxuICAgIGRpdlRleHRFbHQudGV4dENvbnRlbnQgPSB0aGlzLmFjdGl2aXR5W2xhc3RBY3Rpdml0eUluZGljZV07XHJcblxyXG4gICAgXHJcbiAgICBhY3Rpdml0eUVsdC5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCAnPGRpdiBjbGFzcz1cImFjdGl2aXR5LWl0ZW0gbGFzdC1pdGVtXCI+JysgdGhpcy5hY3Rpdml0eVtsYXN0QWN0aXZpdHlJbmRpY2VdICsnPC9kaXY+Jyk7XHJcblxyXG5cclxufVxyXG5cclxuXHJcblxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IExvZ2dlcjsiLCJcclxuaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCBHYW1lTWFuYWdlciBmcm9tIFwiLi9nYW1lTWFuYWdlclwiO1xyXG5cclxuYWJzdHJhY3QgY2xhc3MgTWVudU1hbmFnZXIge1xyXG5cclxuICAgIHN0YXRpYyBzZXRNZW51KGdhbWVNYW5hZ2VyOiBHYW1lTWFuYWdlcil7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0SW5mbyhnYW1lTWFuYWdlci5wbGF5ZXJzWzBdLCAwKTtcclxuICAgICAgICBnYW1lTWFuYWdlci5wbGF5ZXJzWzBdLiRhdmF0YXJMaWZlRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNwbGF5ZXIxIC5saWZlLWluZm9cIilbMF07XHJcblxyXG4gICAgICAgIHRoaXMuc2V0SW5mbyhnYW1lTWFuYWdlci5wbGF5ZXJzWzFdLCAxKTtcclxuICAgICAgICBnYW1lTWFuYWdlci5wbGF5ZXJzWzFdLiRhdmF0YXJMaWZlRWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIiNwbGF5ZXIyIC5saWZlLWluZm9cIilbMF07XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlUGxheWVyVG91ck1lbnUoZ2FtZU1hbmFnZXIucGxheWVyVG91cik7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNldEluZm8ocGxheWVyOiBDaGFyYWN0ZXIsIGluZGljZVBsYXllcjogbnVtYmVyKXtcclxuICAgICAgICBsZXQgbGlmZUluZm9FbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdsaWZlLWluZm8nKTtcclxuICAgICAgICBsZXQgZGl2TGlmZUVsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGl2TGlmZUVsdC50ZXh0Q29udGVudCA9IFN0cmluZyhwbGF5ZXIubGlmZSk7XHJcbiAgICAgICAgZGl2TGlmZUVsdC5jbGFzc0xpc3QuYWRkKCdsaWZlLXZhbHVlJyk7XHJcbiAgICAgICAgZGl2TGlmZUVsdC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICBzd2l0Y2ggKGluZGljZVBsYXllcikge1xyXG4gICAgICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgICAgICAgICBkaXZMaWZlRWx0LnN0eWxlLmxlZnQgPSBcIjMwcHhcIlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICBkaXZMaWZlRWx0LnN0eWxlLnJpZ2h0ID0gXCIzMHB4XCJcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkaXZMaWZlRWx0LnN0eWxlLnpJbmRleCA9IFwiMjBcIjsgIFxyXG4gICAgICAgIGxpZmVJbmZvRWx0W2luZGljZVBsYXllcl0uYXBwZW5kQ2hpbGQoZGl2TGlmZUVsdCk7XHJcbiAgICAgICAgdGhpcy5zZXRDb2xvckluZm9MaWZlKHBsYXllciwgaW5kaWNlUGxheWVyKTtcclxuXHJcbiAgICAgICAgbGV0IHdlYXBvbkluZm9FbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd3ZWFwb24taW5mbycpO1xyXG4gICAgICAgIGxldCBkaXZXZWFwb25FbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRpdldlYXBvbkVsdC50ZXh0Q29udGVudCA9IHBsYXllci53ZWFwb24ubmFtZSsgJygnK3BsYXllci53ZWFwb24uZGFtYWdlKycpJztcclxuICAgICAgICBkaXZXZWFwb25FbHQuY2xhc3NMaXN0LmFkZCgnd2VhcG9uLXZhbHVlJyk7XHJcbiAgICAgICAgZGl2V2VhcG9uRWx0LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIHN3aXRjaCAoaW5kaWNlUGxheWVyKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIGRpdldlYXBvbkVsdC5zdHlsZS5sZWZ0ID0gXCIzMHB4XCJcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgZGl2V2VhcG9uRWx0LnN0eWxlLnJpZ2h0ID0gXCIzMHB4XCJcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkaXZXZWFwb25FbHQuc3R5bGUuekluZGV4ID0gXCIyMFwiO1xyXG4gICAgICAgIHdlYXBvbkluZm9FbHRbaW5kaWNlUGxheWVyXS5hcHBlbmRDaGlsZChkaXZXZWFwb25FbHQpO1xyXG5cclxuICAgICAgICBsZXQgYXZhdGFySWNvbkVsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2F2YXRhci1pY29uJyk7XHJcbiAgICAgICAgbGV0IGRpdkF2YXRhckVsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgZGl2QXZhdGFyRWx0LmNsYXNzTGlzdC5hZGQoXCJhdmF0YXItaW1nXCIpXHJcbiAgICAgICAgbGV0IGF2YXRhciA9IHBsYXllci5pY29uVXJsO1xyXG4gICAgICAgIGxldCBpbWdBdmF0YXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGltZ0F2YXRhci5zcmMgPSBhdmF0YXI7XHJcblxyXG4gICAgICAgIGRpdkF2YXRhckVsdC5pZCA9IHBsYXllci5uYW1lO1xyXG4gICAgICAgIGRpdkF2YXRhckVsdC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICBkaXZBdmF0YXJFbHQuc3R5bGUudG9wID0gXCIxMHB4XCI7XHJcbiAgICAgICAgc3dpdGNoIChpbmRpY2VQbGF5ZXIpIHtcclxuICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgZGl2QXZhdGFyRWx0LnN0eWxlLmxlZnQgPSBcIjIlXCJcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgZGl2QXZhdGFyRWx0LnN0eWxlLnJpZ2h0ID0gXCI1JVwiXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgZGl2QXZhdGFyRWx0LnN0eWxlLnpJbmRleCA9IFwiMFwiO1xyXG4gICAgICAgIGRpdkF2YXRhckVsdC5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCI7XHJcbiAgICAgICAgZGl2QXZhdGFyRWx0LmFwcGVuZENoaWxkKGltZ0F2YXRhcik7XHJcbiAgICAgICAgYXZhdGFySWNvbkVsdFtpbmRpY2VQbGF5ZXJdLmFwcGVuZENoaWxkKGRpdkF2YXRhckVsdCk7XHJcblxyXG4gICAgICAgIGxldCBuYW1lSW5mb0VsdCA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwbGF5ZXItbmFtZScpW2luZGljZVBsYXllcl07XHJcbiAgICAgICAgbmFtZUluZm9FbHQudGV4dENvbnRlbnQgPSBwbGF5ZXIubmFtZTtcclxuICAgICAgICBuYW1lSW5mb0VsdC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICBuYW1lSW5mb0VsdC5zdHlsZS50b3AgPSBcIi01cHhcIjtcclxuICAgICAgICBuYW1lSW5mb0VsdC5zdHlsZS5mb250V2VpZ2h0ID0gXCJib2xkXCI7XHJcbiAgICAgICAgc3dpdGNoIChpbmRpY2VQbGF5ZXIpIHtcclxuICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgbmFtZUluZm9FbHQuc3R5bGUubGVmdCA9IFwiMjYlXCJcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgbmFtZUluZm9FbHQuc3R5bGUucmlnaHQgPSBcIjI2JVwiXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHVwZGF0ZUluZm9MaWZlKHBsYXllcjogQ2hhcmFjdGVyLCBpbmRpY2VQbGF5ZXI6IG51bWJlcil7XHJcblxyXG4gICAgICAgIGxldCBsaWZlSW5mb0VsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJsaWZlLXZhbHVlXCIpW2luZGljZVBsYXllcl07XHJcblxyXG4gICAgICAgIGxpZmVJbmZvRWx0LmlubmVySFRNTD1cIlwiO1xyXG4gICAgICAgIGxpZmVJbmZvRWx0LnRleHRDb250ZW50ID0gU3RyaW5nKHBsYXllci5saWZlKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRDb2xvckluZm9MaWZlKHBsYXllciwgaW5kaWNlUGxheWVyKTtcclxuXHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIHNldENvbG9ySW5mb0xpZmUocGxheWVyOiBDaGFyYWN0ZXIsIGluZGljZVBsYXllcjogbnVtYmVyKXtcclxuXHJcbiAgICAgICAgbGV0IGxpZmVJbmZvRWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImxpZmUtdmFsdWVcIilbaW5kaWNlUGxheWVyXTtcclxuXHJcbiAgICAgICAgLy8gaWYocGxheWVyLiRhdmF0YXJMaWZlRWx0LmNsYXNzTGlzdC5jb250YWlucygnaGlnaC1saWZlLWxldmVsJykpe1xyXG4gICAgICAgIC8vICAgICBwbGF5ZXIuJGF2YXRhckxpZmVFbHQuY2xhc3NMaXN0LnJlbW92ZSgnaGlnaC1saWZlLWxldmVsJyk7IFxyXG4gICAgICAgIC8vIH1lbHNlIGlmKHBsYXllci4kYXZhdGFyTGlmZUVsdC5jbGFzc0xpc3QuY29udGFpbnMoJ21lZGl1bS1saWZlLWxldmVsJykpe1xyXG4gICAgICAgIC8vICAgICBwbGF5ZXIuJGF2YXRhckxpZmVFbHQuY2xhc3NMaXN0LnJlbW92ZSgnbWVkaXVtLWxpZmUtbGV2ZWwnKTsgXHJcbiAgICAgICAgLy8gfWVsc2UgaWYocGxheWVyLiRhdmF0YXJMaWZlRWx0LmNsYXNzTGlzdC5jb250YWlucygnbG93LWxpZmUtbGV2ZWwnKSl7XHJcbiAgICAgICAgLy8gICAgIHBsYXllci4kYXZhdGFyTGlmZUVsdC5jbGFzc0xpc3QucmVtb3ZlKCdsb3ctbGlmZS1sZXZlbCcpOyBcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIGlmKHBsYXllci5saWZlID4gNzUpe1xyXG4gICAgICAgICAgICBsaWZlSW5mb0VsdC5jbGFzc0xpc3QuYWRkKCdoaWdoLWxpZmUtbGV2ZWwnKTtcclxuICAgICAgICB9ZWxzZSBpZiAocGxheWVyLmxpZmUgPiAzMCAmJiBwbGF5ZXIubGlmZSA8IDc1KSB7XHJcbiAgICAgICAgICAgIGxpZmVJbmZvRWx0LmNsYXNzTGlzdC5hZGQoJ21lZGl1bS1saWZlLWxldmVsJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGlmZUluZm9FbHQuY2xhc3NMaXN0LmFkZCgnbG93LWxpZmUtbGV2ZWwnKTtcclxuICAgICAgICB9IFxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyB1cGRhdGVJbmZvV2VhcG9uKHBsYXllcjogQ2hhcmFjdGVyLCBpbmRpY2VQbGF5ZXI6IG51bWJlcil7XHJcbiAgICAgICAgbGV0IHdlYXBvbkluZm9FbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwid2VhcG9uLXZhbHVlXCIpW2luZGljZVBsYXllcl07XHJcblxyXG4gICAgICAgIHdlYXBvbkluZm9FbHQuaW5uZXJIVE1MPVwiXCI7XHJcbiAgICAgICAgd2VhcG9uSW5mb0VsdC50ZXh0Q29udGVudCA9IHBsYXllci53ZWFwb24ubmFtZSsgJygnK3BsYXllci53ZWFwb24uZGFtYWdlKycpJztcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgdXBkYXRlUGxheWVyVG91ck1lbnUocGxheWVyOiBDaGFyYWN0ZXIpe1xyXG4gICAgICAgIGxldCBwbGF5ZXJFbHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInBsYXllclRvdXJcIik7XHJcbiAgICAgICAgaWYocGxheWVyRWx0c1swXSAhPT0gdW5kZWZpbmVkICYmIHBsYXllckVsdHNbMF0gIT09IG51bGwpe1xyXG4gICAgICAgIHBsYXllckVsdHNbMF0uY2xhc3NMaXN0LnJlbW92ZShcInBsYXllclRvdXJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBwbGF5ZXJUb3VyRWx0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocGxheWVyLm5hbWUpO1xyXG4gICAgICAgIHBsYXllclRvdXJFbHQuY2xhc3NMaXN0LmFkZChcInBsYXllclRvdXJcIik7XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG5leHBvcnQgZGVmYXVsdCBNZW51TWFuYWdlcjtcclxuIiwiLy9UaGlzIGNsYXNzIGZvciB0aGUgZmllbGRzXHJcbmNsYXNzIFNpemUge1xyXG4gICAgLy9maWVsZCBcclxuICAgIHggOiBudW1iZXI7XHJcbiAgICB5IDogbnVtYmVyO1xyXG5cclxuICAgIC8vY29uc3RydWN0b3IgXHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBTaXplOyIsImltcG9ydCBGaWVsZCBmcm9tIFwiLi4vLi4vZmllbGQvbW9kZWwvZmllbGRcIjtcclxuaW1wb3J0IFdlYXBvbiBmcm9tIFwiLi4vLi4vd2VhcG9uL21vZGVsL3dlYXBvblwiO1xyXG5pbXBvcnQgQ2FzZSBmcm9tIFwiLi4vLi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcblxyXG5cclxuYWJzdHJhY3QgY2xhc3MgTG9naWNXZWFwb24ge1xyXG5cclxuXHJcbiAgICBzdGF0aWMgcGFpbnRTdGFydFdlYXBvbihmaWVsZDogRmllbGQsIHdlYXBvbjogV2VhcG9uKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGNhc2VXZWFwb24gPSBmaWVsZC5nZXRBdmFpbGFibGVSYW5kb21DYXNlKCk7XHJcbiAgICAgICAgbGV0IGltZ1dlYXBvbjogSFRNTEltYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgbGV0IHNwYW5FbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBzcGFuRWx0LmNsYXNzTGlzdC5hZGQoXCJ3ZWFwb25cIik7XHJcbiAgICAgICAgaW1nV2VhcG9uLnNyYyA9IHdlYXBvbi5pY29uVXJsO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS5tYXhXaWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS5tYXhIZWlnaHQgPSBcIjUwJVwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUudG9wID0gXCIzMCVcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUubGVmdCA9IFwiMFwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS56SW5kZXggPSBcIjIwXCI7XHJcbiAgICAgICAgc3BhbkVsdC5hcHBlbmRDaGlsZChpbWdXZWFwb24pO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhc2VXZWFwb24ucG9zaXRpb25TdHJpbmcpLmFwcGVuZENoaWxkKHNwYW5FbHQpO1xyXG4gICAgICAgIGZpZWxkLmNhc2VzW2Nhc2VXZWFwb24ucG9zaXRpb24ueF1bY2FzZVdlYXBvbi5wb3NpdGlvbi55XS5pc0F2YWlsYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIGZpZWxkLmNhc2VzW2Nhc2VXZWFwb24ucG9zaXRpb24ueF1bY2FzZVdlYXBvbi5wb3NpdGlvbi55XS53ZWFwb24gPSB3ZWFwb247XHJcbiAgICAgICAgd2VhcG9uLiRlbCA9IHNwYW5FbHQ7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBwYWludFdlYXBvbihjYXNlV2VhcG9uOiBDYXNlLCB3ZWFwb246IFdlYXBvbiwgZmllbGQ6IEZpZWxkKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBpbWdXZWFwb246IEhUTUxJbWFnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGxldCBzcGFuRWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgc3BhbkVsdC5jbGFzc0xpc3QuYWRkKFwid2VhcG9uXCIpO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zcmMgPSB3ZWFwb24uaWNvblVybDtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUubWF4V2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUubWF4SGVpZ2h0ID0gXCI1MCVcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLnRvcCA9IFwiMzAlXCI7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLmxlZnQgPSBcIjBcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUuekluZGV4ID0gXCIyMFwiO1xyXG4gICAgICAgIHNwYW5FbHQuYXBwZW5kQ2hpbGQoaW1nV2VhcG9uKTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYXNlV2VhcG9uLnBvc2l0aW9uU3RyaW5nKS5hcHBlbmRDaGlsZChzcGFuRWx0KTtcclxuICAgICAgICBmaWVsZC5jYXNlc1tjYXNlV2VhcG9uLnBvc2l0aW9uLnhdW2Nhc2VXZWFwb24ucG9zaXRpb24ueV0ud2VhcG9uID0gd2VhcG9uO1xyXG4gICAgICAgIHdlYXBvbi4kZWwgPSBzcGFuRWx0O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMb2dpY1dlYXBvbjsiLCJpbXBvcnQgQ2FzZSBmcm9tIFwiLi4vLi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcblxyXG4vL1RoaXMgY2xhc3MgZm9yIHRoZSBmaWVsZHNcclxuY2xhc3MgV2VhcG9uIHtcclxuICAgLy9maWVsZCBcclxuICAgbmFtZTogc3RyaW5nO1xyXG4gICBkYW1hZ2U6IG51bWJlcjtcclxuICAgaWNvblVybDogc3RyaW5nO1xyXG4gICBjYXNlOiBDYXNlO1xyXG4gICAkZWw6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgLy9jb25zdHJ1Y3RvciBcclxuICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBkYW1hZ2U6IG51bWJlciwgaWNvblVybDogc3RyaW5nKSB7XHJcbiAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgIHRoaXMuZGFtYWdlID0gZGFtYWdlO1xyXG4gICAgICB0aGlzLmljb25VcmwgPSBpY29uVXJsO1xyXG4gICB9XHJcblxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgV2VhcG9uOyIsIlxyXG5hYnN0cmFjdCBjbGFzcyBMb2dpY0hlbHBlciB7XHJcbiAgICBzdGF0aWMgZ2V0UmFuZG9tRGltZW5zaW9uKGRpbWVuc2lvbjogbnVtYmVyKTogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSpkaW1lbnNpb24pO1xyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTG9naWNIZWxwZXI7IiwiXHJcbmltcG9ydCBDYXNlIGZyb20gXCIuL2VudGl0aWVzL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4vZW50aXRpZXMvZmllbGQvbW9kZWwvZmllbGRcIjtcclxuaW1wb3J0IExvZ2ljRmllbGQgZnJvbSBcIi4vZW50aXRpZXMvZmllbGQvbG9naWMvbG9naWNGaWVsZFwiO1xyXG5pbXBvcnQgR2FtZU1hbmFnZXIgZnJvbSBcIi4vZW50aXRpZXMvZ2FtZU1hbmFnZXJcIjtcclxuXHJcbmxldCBnYW1lTWFuYWdlciA9IG5ldyBHYW1lTWFuYWdlcigpO1xyXG5nYW1lTWFuYWdlci5zdGFydEdhbWUoKTtcclxuXHJcblxyXG4iXX0=
