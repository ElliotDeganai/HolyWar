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
},{"../../case/logic/caseLogic":1,"../../weapon/logic/logicWeapon":10}],3:[function(require,module,exports){
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
        this.weapon = new weapon_1.default("basicWeapon", 10, "/assets/img/weapon/weapon2.png");
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
                console.log('The player ' + this.case.gameManager.playerTour.name + ' let the weapon ' + caseToMove.weapon.name + ' to take the weapon ' + this.weapon.name + '.');
            }
            // this.$el.remove();
            // LogicCharacter.paintCharacters(field, this, caseToMove);
            logicCharacter_1.default.setAbsolutePosition(this);
            logicCharacter_1.default.characterAnimation(this, this.absoluteCoord);
            if (changedWeapon) {
                logicWeapon_1.default.paintWeapon(field.cases[caseFrom.position.x][caseFrom.position.y], previousWeapon, field);
            }
            this.case.gameManager.playerTour = nextPlayer;
            console.log('The player ' + this.case.gameManager.playerTour.name + ' can play.');
        }
        else {
            console.log("This place is unreachable!!");
        }
    };
    return Character;
}());
exports.default = Character;
},{"../../weapon/logic/logicWeapon":10,"../../weapon/model/weapon":11,"../logic/logicCharacter":3}],5:[function(require,module,exports){
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
},{"../../case/logic/caseLogic":1,"../../case/model/case":2,"../../character/logic/logicCharacter":3,"../../coord/model/coord":5,"../../weapon/logic/logicWeapon":10,"../../weapon/model/weapon":11,"../model/field":7}],7:[function(require,module,exports){
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
},{"../../../helpers/LogicHelper":12,"../../coord/model/coord":5,"../../size/model/size":9}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logicField_1 = require("./field/logic/logicField");
var GameManager = /** @class */ (function () {
    /**
     *
     */
    function GameManager() {
        this.id = 'fight';
        this.maxMove = 3;
        this.players = new Array();
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
        console.log('starting game...');
        var field = logicField_1.default.generateMap(8, 8);
        this.field = field;
        this.setGameManager();
        logicField_1.default.paintField(document.getElementById("fight"), field);
        logicField_1.default.setWeapon(field);
        logicField_1.default.setCharacters(field);
        // First Player start
        this.playerTour = field.characters[0];
        this.showReachableCase();
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
},{"./field/logic/logicField":6}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gameManager_1 = require("./entities/gameManager");
var gameManager = new gameManager_1.default();
gameManager.startGame();
},{"./entities/gameManager":8}]},{},[13])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZW50aXRpZXMvY2FzZS9sb2dpYy9jYXNlTG9naWMudHMiLCJzcmMvZW50aXRpZXMvY2FzZS9tb2RlbC9jYXNlLnRzIiwic3JjL2VudGl0aWVzL2NoYXJhY3Rlci9sb2dpYy9sb2dpY0NoYXJhY3Rlci50cyIsInNyYy9lbnRpdGllcy9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyLnRzIiwic3JjL2VudGl0aWVzL2Nvb3JkL21vZGVsL2Nvb3JkLnRzIiwic3JjL2VudGl0aWVzL2ZpZWxkL2xvZ2ljL2xvZ2ljRmllbGQudHMiLCJzcmMvZW50aXRpZXMvZmllbGQvbW9kZWwvZmllbGQudHMiLCJzcmMvZW50aXRpZXMvZ2FtZU1hbmFnZXIudHMiLCJzcmMvZW50aXRpZXMvc2l6ZS9tb2RlbC9zaXplLnRzIiwic3JjL2VudGl0aWVzL3dlYXBvbi9sb2dpYy9sb2dpY1dlYXBvbi50cyIsInNyYy9lbnRpdGllcy93ZWFwb24vbW9kZWwvd2VhcG9uLnRzIiwic3JjL2hlbHBlcnMvTG9naWNIZWxwZXIudHMiLCJzcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDR0E7SUFBQTtJQWtDQSxDQUFDO0lBN0JHOzs7Ozs7T0FNRztJQUNJLG1CQUFTLEdBQWhCLFVBQWlCLFdBQWlCO1FBQzlCLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO1FBRW5DLFFBQVEsV0FBVyxDQUFDLFNBQVMsRUFBRTtZQUMzQixLQUFLLEtBQUs7Z0JBQ04sTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzdCLE1BQU07WUFFVixLQUFLLElBQUk7Z0JBQ0wsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFD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UUFBUSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hFLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDMUUsTUFBTSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQztJQUNMLGtCQUFDO0FBQUQsQ0F4Q0EsQUF3Q0MsSUFBQTtBQUVELGtCQUFlLFdBQVcsQ0FBQzs7OztBQzdDM0IsMkJBQTJCO0FBQzNCO0lBUUcsY0FBYztJQUNkLGdCQUFZLElBQVksRUFBRSxNQUFjLEVBQUUsT0FBZTtRQUN0RCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUMxQixDQUFDO0lBR0osYUFBQztBQUFELENBaEJBLEFBZ0JDLElBQUE7QUFFRCxrQkFBZSxNQUFNLENBQUM7Ozs7QUNwQnRCO0lBQUE7SUFNQSxDQUFDO0lBTFUsOEJBQWtCLEdBQXpCLFVBQTBCLFNBQWlCO1FBRXZDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUMsU0FBUyxDQUFDLENBQUM7SUFFL0MsQ0FBQztJQUNMLGtCQUFDO0FBQUQsQ0FOQSxBQU1DLElBQUE7QUFFRCxrQkFBZSxXQUFXLENBQUM7Ozs7QUNMM0Isc0RBQWlEO0FBRWpELElBQUksV0FBVyxHQUFHLElBQUkscUJBQVcsRUFBRSxDQUFDO0FBQ3BDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuLi8uLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5cclxuYWJzdHJhY3QgY2xhc3MgQ2FzZUxvZ2ljIHtcclxuXHJcbiAgICBzdGF0aWMgQkxPQ0tFRDogc3RyaW5nID0gXCJCTE9DS0VEXCI7XHJcbiAgICBzdGF0aWMgTk9STUFMOiBzdHJpbmcgPSBcIk5PUk1BTFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gcGFydHlGaWVsZCBcclxuICAgICAqIEBwYXJhbSBsaXN0T2ZDYXNlc1RlbXAgXHJcbiAgICAgKiBAcGFyYW0gZWxlbWVudFRvRmlsbCBcclxuICAgICAqIEBwYXJhbSBuYnJPZlJlbWFpbmluZ0Nhc2VzIFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcGFpbnRDYXNlKGNhc2VUb1BhaW50OiBDYXNlKTogSFRNTERpdkVsZW1lbnQge1xyXG4gICAgICAgIGxldCBkaXZFbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRpdkVsdC5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcclxuXHJcbiAgICAgICAgc3dpdGNoIChjYXNlVG9QYWludC5pc0Jsb2NrZWQpIHtcclxuICAgICAgICAgICAgY2FzZSBmYWxzZTpcclxuICAgICAgICAgICAgICAgIGRpdkVsdC5jbGFzc0xpc3QuYWRkKFwiY2FzZVwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSB0cnVlOlxyXG4gICAgICAgICAgICAgICAgZGl2RWx0LmNsYXNzTGlzdC5hZGQoXCJjYXNlXCIpO1xyXG4gICAgICAgICAgICAgICAgZGl2RWx0LmNsYXNzTGlzdC5hZGQoXCJibG9ja2VkXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRpdkVsdC5pZCA9IFN0cmluZyhjYXNlVG9QYWludC5wb3NpdGlvblN0cmluZyk7XHJcblxyXG4gICAgICAgIGNhc2VUb1BhaW50LnNldEVsKGRpdkVsdCk7XHJcbiAgICAgICAgcmV0dXJuIGRpdkVsdDtcclxuICAgIH1cclxuXHJcblxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2FzZUxvZ2ljOyIsImltcG9ydCBDYXNlTG9naWMgZnJvbSBcIi4uLy4uL2Nhc2UvbG9naWMvY2FzZUxvZ2ljXCI7XHJcbmltcG9ydCBDb29yZCBmcm9tIFwiLi4vLi4vY29vcmQvbW9kZWwvY29vcmRcIjtcclxuaW1wb3J0IFdlYXBvbiBmcm9tIFwiLi4vLi4vd2VhcG9uL21vZGVsL3dlYXBvblwiO1xyXG5pbXBvcnQgTG9naWNXZWFwb24gZnJvbSBcIi4uLy4uL3dlYXBvbi9sb2dpYy9sb2dpY1dlYXBvblwiO1xyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4uLy4uL2ZpZWxkL21vZGVsL2ZpZWxkXCI7XHJcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4uLy4uL2NoYXJhY3Rlci9tb2RlbC9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IEdhbWVNYW5hZ2VyIGZyb20gXCIuLi8uLi9nYW1lTWFuYWdlclwiO1xyXG5cclxuY2xhc3MgQ2FzZSB7XHJcbiAgICAvL2ZpZWxkIFxyXG4gICAgaW1nVXJsOiBzdHJpbmc7XHJcbiAgICBpc0Jsb2NrZWQ6IGJvb2xlYW47XHJcbiAgICBpc0F2YWlsYWJsZTogYm9vbGVhbjtcclxuICAgIHBvc2l0aW9uOiBDb29yZDtcclxuICAgIHBvc2l0aW9uU3RyaW5nOiBzdHJpbmc7XHJcbiAgICB0eXBlOiBzdHJpbmc7XHJcbiAgICB3ZWFwb246IFdlYXBvbjtcclxuICAgIGdhbWVNYW5hZ2VyOiBHYW1lTWFuYWdlcjtcclxuICAgICRlbDogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgLy9jb25zdHJ1Y3RvciBcclxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uOiBDb29yZCwgdHlwZTogc3RyaW5nID0gQ2FzZUxvZ2ljLk5PUk1BTCwgaXNBdmFpbGFibGU6IGJvb2xlYW4gPSB0cnVlKSB7XHJcblxyXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIENhc2VMb2dpYy5OT1JNQUw6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmltZ1VybCA9IFwiL2Fzc2V0cy9pbWcvbm9ybWFsLWZpZWxkL3RpbGUtMkQucG5nXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzQmxvY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIENhc2VMb2dpYy5CTE9DS0VEOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbWdVcmwgPSBcIi9hc3NldHMvaW1nL2Jsb2NrZWQtZmllbGQvdGlsZS0yRC5wbmdcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNCbG9ja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmlzQXZhaWxhYmxlID0gaXNBdmFpbGFibGU7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb25TdHJpbmcgPSBTdHJpbmcocG9zaXRpb24ueCkgKyBTdHJpbmcocG9zaXRpb24ueSk7XHJcbiAgICAgICAgdGhpcy53ZWFwb24gPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNhc2VzQWRqYWNlbnQoY2FzZVRvQ2hlY2s6IENhc2UpOiBCb29sZWFue1xyXG4gICAgICAgIGlmKHRoaXMucG9zaXRpb24ueCA9PT0gY2FzZVRvQ2hlY2sucG9zaXRpb24ueCsxIHx8IHRoaXMucG9zaXRpb24ueCA9PT0gY2FzZVRvQ2hlY2sucG9zaXRpb24ueC0xIHx8IHRoaXMucG9zaXRpb24ueSA9PT0gY2FzZVRvQ2hlY2sucG9zaXRpb24ueSsxIHx8IHRoaXMucG9zaXRpb24ueSA9PT0gY2FzZVRvQ2hlY2sucG9zaXRpb24ueS0xKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGFzV2VhcG9uKCl7XHJcbiAgICAgICAgaWYodGhpcy53ZWFwb24gIT09IG51bGwpe1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlbW92ZVdlYXBvbigpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMud2VhcG9uLiRlbC5yZW1vdmUoKTtcclxuICAgICAgICB0aGlzLndlYXBvbiA9IG51bGw7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFkZFdlYXBvbihmaWVsZDogRmllbGQsIHdlYXBvbjogV2VhcG9uKXtcclxuICAgICAgICB0aGlzLndlYXBvbiA9IHdlYXBvbjtcclxuICAgICAgICBMb2dpY1dlYXBvbi5wYWludFdlYXBvbih0aGlzLCB3ZWFwb24sIGZpZWxkKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRFbChlbGVtZW50OiBIVE1MRWxlbWVudCk6IEhUTUxFbGVtZW50IHtcclxuICAgICAgICB0aGlzLiRlbCA9IGVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuJGVsLm9uY2xpY2sgPSAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5vbkNsaWNrKGV2ZW50KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy4kZWw7XHJcbiAgICB9XHJcblxyXG4gICAgb25DbGljayhldmVudDogTW91c2VFdmVudCk6IHZvaWR7XHJcbiBcclxuICAgICAgICAgICAgbGV0IGNhc2VzRWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdjYXNlJyk7XHJcbiAgICAgICAgICAgIGxldCBmaWVsZCA9IHRoaXMuZ2FtZU1hbmFnZXIuZmllbGQ7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhc2VzRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBjYXNlc0VsZW1lbnQgPSAoPEhUTUxFbGVtZW50PmNhc2VzRWxlbWVudHNbaV0pO1xyXG4gICAgICAgICAgICAgICAgY2FzZXNFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2Nhc2UtcmVhY2hhYmxlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHZhciBlbCA9IGV2ZW50LnRhcmdldHx8ZXZlbnQuc3JjRWxlbWVudDtcclxuICAgICAgICAgICAgbGV0IGNhc2VUb0dvID0gZmllbGQuY2FzZXNbdGhpcy5wb3NpdGlvbi54XVt0aGlzLnBvc2l0aW9uLnldO1xyXG5cclxuICAgICAgICAgICAgLy8gRG8gbm90aGluZyBpZiBwbGF5ZXIgc2VsZWN0IGEgQmxvY2sgQ2FzZVxyXG4gICAgICAgICAgICBpZiAoY2FzZVRvR28uaXNCbG9ja2VkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWVNYW5hZ2VyLnNob3dSZWFjaGFibGVDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy93ZSBnZXQgdGhlIGVsZW1lbnQgdGFyZ2V0XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmdhbWVNYW5hZ2VyLnBsYXllclRvdXIubW92ZVRvKHRoaXMuZ2FtZU1hbmFnZXIuZmllbGQsIGNhc2VUb0dvKTtcclxuXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmdhbWVNYW5hZ2VyLnNob3dSZWFjaGFibGVDYXNlKCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2FzZTsiLCJcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuLi8uLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gXCIuLi8uLi9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IENvb3JkIGZyb20gXCIuLi8uLi9jb29yZC9tb2RlbC9jb29yZFwiO1xyXG5cclxuY29uc3QgZGltZW5zaW9uQ2FzZSA9IDg0O1xyXG5cclxuYWJzdHJhY3QgY2xhc3MgTG9naWNDaGFyYWN0ZXIge1xyXG5cclxuICAgIHN0YXRpYyBwYWludFN0YXJ0Q2hhcmFjdGVycyhmaWVsZDogRmllbGQsIG5hbWVDaGFyYWN0ZXI6IHN0cmluZywgaWNvblVybDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IHBsYXllciA9IG5ldyBDaGFyYWN0ZXIobmFtZUNoYXJhY3RlciwgaWNvblVybCwgZmllbGQuZ2V0QXZhaWxhYmxlUmFuZG9tQ2FzZSgpKTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBmaWVsZC5jaGFyYWN0ZXJzWzBdICE9PSAndW5kZWZpbmVkJykge1xyXG5cclxuICAgICAgICAgICAgd2hpbGUoZmllbGQuY2hhcmFjdGVyc1swXS5jYXNlLmNhc2VzQWRqYWNlbnQocGxheWVyLmNhc2UpIHx8IHBsYXllci5pc0Nsb3NlZENhc2VzQmxvY2tlZCgpKXtcclxuICAgICAgICAgICAgICAgIHBsYXllciA9IG5ldyBDaGFyYWN0ZXIobmFtZUNoYXJhY3RlciwgaWNvblVybCwgZmllbGQuZ2V0QXZhaWxhYmxlUmFuZG9tQ2FzZSgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgZmllbGQuY2FzZXNbcGxheWVyLmNhc2UucG9zaXRpb24ueF1bcGxheWVyLmNhc2UucG9zaXRpb24ueV0uaXNBdmFpbGFibGUgPSBmYWxzZTtcclxuICAgICAgICBsZXQgaW1nQ2hhcjogSFRNTEltYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgbGV0IHNwYW5FbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuXHJcbiAgICAgICAgc3BhbkVsdC5jbGFzc0xpc3QuYWRkKFwiY2hhclwiKTtcclxuICAgICAgICBpbWdDaGFyLnNyYyA9IHBsYXllci5pY29uVXJsO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUubWF4V2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLm1heEhlaWdodCA9IChNYXRoLnJvdW5kKDEwMCAvIGZpZWxkLnNpemUueCkpKyBcIiVcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUuekluZGV4ID0gXCI1MFwiO1xyXG4gICAgICAgIC8vc3BhbkVsdC5hcHBlbmRDaGlsZChpbWdDaGFyKTtcclxuICAgICAgICAvL2xldCBwbGF5ZXJEaXZFbHQgPSBwbGF5ZXIuY2FzZS4kZWw7XHJcbiAgICAgICAgbGV0IHBsYXllckRpdkVsdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlnaHRcIik7XHJcbiAgICAgICAgLy9wbGF5ZXJEaXZFbHQuYXBwZW5kQ2hpbGQoc3BhbkVsdCk7XHJcbiAgICAgICAgcGxheWVyRGl2RWx0LmFwcGVuZENoaWxkKGltZ0NoYXIpO1xyXG4gICAgICAgIHBsYXllci4kZWwgPSBpbWdDaGFyO1xyXG4gICAgICAgIGltZ0NoYXIuY2xhc3NMaXN0LmFkZChcInBsYXllclwiKTtcclxuICAgICAgICB0aGlzLnNldEFic29sdXRlUG9zaXRpb24ocGxheWVyKTtcclxuXHJcbiAgICAgICAgcGxheWVyLiRlbC5zdHlsZS5sZWZ0ID0gcGxheWVyLmFic29sdXRlQ29vcmQueSArICdweCc7XHJcbiAgICAgICAgcGxheWVyLiRlbC5zdHlsZS50b3AgPSBwbGF5ZXIuYWJzb2x1dGVDb29yZC54ICsgJ3B4JztcclxuXHJcbiAgICAgICAgZmllbGQuY2hhcmFjdGVycy5wdXNoKHBsYXllcik7XHJcbiAgICB9IFxyXG5cclxuICAgIHN0YXRpYyBwYWludENoYXJhY3RlcnMoZmllbGQ6IEZpZWxkLCBwbGF5ZXI6IENoYXJhY3RlciwgY2FzZVBsYXllcjogQ2FzZSk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgaW1nQ2hhcjogSFRNTEltYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgbGV0IHNwYW5FbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuXHJcbiAgICAgICAgc3BhbkVsdC5jbGFzc0xpc3QuYWRkKFwiY2hhclwiKTtcclxuICAgICAgICBpbWdDaGFyLnNyYyA9IHBsYXllci5pY29uVXJsO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUubWF4V2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLm1heEhlaWdodCA9IFwiNzUlXCI7XHJcbiAgICAgICAgaW1nQ2hhci5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLnRvcCA9IFwiMFwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUubGVmdCA9IFwiMFwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUuekluZGV4ID0gXCI1MFwiO1xyXG4gICAgICAgIGltZ0NoYXIuY2xhc3NMaXN0LmFkZChcInBsYXllclwiKTtcclxuICAgICAgICBzcGFuRWx0LmFwcGVuZENoaWxkKGltZ0NoYXIpO1xyXG4gICAgICAgIGxldCBwbGF5ZXJEaXZFbHQgPSBwbGF5ZXIuY2FzZS4kZWw7XHJcbiAgICAgICAgcGxheWVyRGl2RWx0LmFwcGVuZENoaWxkKHNwYW5FbHQpO1xyXG4gICAgICAgIHBsYXllci4kZWwgPSBzcGFuRWx0O1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjaGFyYWN0ZXJBbmltYXRpb24ocGxheWVyOiBDaGFyYWN0ZXIsIG5ld0Nvb3JkOiBDb29yZCl7XHJcblxyXG4gICAgICAgIHBsYXllci4kZWwuc3R5bGUubGVmdCA9IG5ld0Nvb3JkLnkgKyAncHgnO1xyXG4gICAgICAgIHBsYXllci4kZWwuc3R5bGUudG9wID0gbmV3Q29vcmQueCArICdweCc7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBzZXRBYnNvbHV0ZVBvc2l0aW9uKHBsYXllcjogQ2hhcmFjdGVyKXtcclxuICAgICAgICBsZXQgYWJzb2x1dGVYID0gcGxheWVyLmNhc2UucG9zaXRpb24ueCpwbGF5ZXIuY2FzZS4kZWwub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICAgIGxldCBhYnNvbHV0ZVkgPSBwbGF5ZXIuY2FzZS5wb3NpdGlvbi55KnBsYXllci5jYXNlLiRlbC5vZmZzZXRXaWR0aDtcclxuICAgICAgICBsZXQgYWJzb2x1dGVQb3NpdGlvblBsYXllciA9IG5ldyBDb29yZChhYnNvbHV0ZVgsIGFic29sdXRlWSk7XHJcbiAgICAgICAgcGxheWVyLmFic29sdXRlQ29vcmQgPSBhYnNvbHV0ZVBvc2l0aW9uUGxheWVyOyBcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IExvZ2ljQ2hhcmFjdGVyOyIsImltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IFdlYXBvbiBmcm9tIFwiLi4vLi4vd2VhcG9uL21vZGVsL3dlYXBvblwiO1xyXG5pbXBvcnQgTG9naWNXZWFwb24gZnJvbSBcIi4uLy4uL3dlYXBvbi9sb2dpYy9sb2dpY1dlYXBvblwiO1xyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4uLy4uL2ZpZWxkL21vZGVsL2ZpZWxkXCI7XHJcbmltcG9ydCBMb2dpY0NoYXJhY3RlciBmcm9tIFwiLi4vbG9naWMvbG9naWNDaGFyYWN0ZXJcIjtcclxuaW1wb3J0IENvb3JkIGZyb20gXCIuLi8uLi9jb29yZC9tb2RlbC9jb29yZFwiO1xyXG5cclxuLy9UaGlzIGNsYXNzIGZvciB0aGUgZmllbGRzXHJcbmNsYXNzIENoYXJhY3RlciB7XHJcbiAgIC8vZmllbGQgXHJcbiAgIG5hbWU6IHN0cmluZztcclxuICAgaWNvblVybDogc3RyaW5nO1xyXG4gICBsaWZlOiBudW1iZXI7XHJcbiAgIGxldmVsOiBudW1iZXI7XHJcbiAgIGNhc2U6IENhc2U7XHJcbiAgIGNsb3NlZENhc2VzOiBBcnJheTxDYXNlPjtcclxuICAgd2VhcG9uOiBXZWFwb247XHJcbiAgIGFic29sdXRlQ29vcmQ6IENvb3JkO1xyXG4gICAkZWw6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgLy9jb25zdHJ1Y3RvciBcclxuICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBpY29uVXJsOiBzdHJpbmcsIHN0YXJ0Q2FzZTogQ2FzZSkge1xyXG4gICAgICB0aGlzLmxpZmUgPSAxMDA7XHJcbiAgICAgIHRoaXMubGV2ZWwgPSA1O1xyXG4gICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICB0aGlzLmljb25VcmwgPSBpY29uVXJsO1xyXG4gICAgICB0aGlzLmNhc2UgPSBzdGFydENhc2U7XHJcbiAgICAgIHRoaXMuY2xvc2VkQ2FzZXMgPSB0aGlzLmdldENsb3NlZENhc2VzKCk7XHJcbiAgICAgIHRoaXMud2VhcG9uID0gbmV3IFdlYXBvbihcImJhc2ljV2VhcG9uXCIsIDEwLCBcIi9hc3NldHMvaW1nL3dlYXBvbi93ZWFwb24yLnBuZ1wiKTtcclxuXHJcbiAgIH1cclxuXHJcbiAgIHRha2VXZWFwb24oY2FzZVdlYXBvbjogQ2FzZSwgZmllbGQ6IEZpZWxkKXtcclxuICAgICAgbGV0IHdlYXBvblRvRHJvcCA9IHRoaXMud2VhcG9uO1xyXG4gICAgICB0aGlzLndlYXBvbiA9IGNhc2VXZWFwb24ud2VhcG9uO1xyXG4gICAgICBjYXNlV2VhcG9uLnJlbW92ZVdlYXBvbigpO1xyXG4gICAgICBmaWVsZC5jYXNlc1tjYXNlV2VhcG9uLnBvc2l0aW9uLnhdW2Nhc2VXZWFwb24ucG9zaXRpb24ueV0ud2VhcG9uID0gd2VhcG9uVG9Ecm9wO1xyXG4gICAgICBcclxuICAgICAgLy9Mb2dpY1dlYXBvbi5wYWludFdlYXBvbihjYXNlV2VhcG9uLCB3ZWFwb25Ub0Ryb3AsIGZpZWxkKTtcclxuICAgfVxyXG5cclxuICAgaXNXYXlCbG9ja2VkKGNhc2VUb1JlYWNoOiBDYXNlLCBmaWVsZDogRmllbGQpOiBCb29sZWFue1xyXG4gICAgICBsZXQgYmxvY2tlZCA9IGZhbHNlO1xyXG4gICAgICBpZih0aGlzLmNhc2UucG9zaXRpb24ueCA9PT0gY2FzZVRvUmVhY2gucG9zaXRpb24ueCl7XHJcbiAgICAgICAgIGxldCB4ID0gdGhpcy5jYXNlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgIGxldCB5SW5pdCA9IDA7XHJcbiAgICAgICAgIGlmKHRoaXMuY2FzZS5wb3NpdGlvbi55IDwgY2FzZVRvUmVhY2gucG9zaXRpb24ueSl7XHJcbiAgICAgICAgIHlJbml0ID0gdGhpcy5jYXNlLnBvc2l0aW9uLnkrMTtcclxuICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHlJbml0ID0gY2FzZVRvUmVhY2gucG9zaXRpb24ueSsxOyBcclxuICAgICAgICAgfVxyXG4gICAgICAgICAgbGV0IGRlbHRhWSA9IE1hdGguYWJzKHRoaXMuY2FzZS5wb3NpdGlvbi55IC0gY2FzZVRvUmVhY2gucG9zaXRpb24ueSk7XHJcbiAgICAgICAgICBmb3IobGV0IHJvdyA9IDA7IHJvdyA8IGRlbHRhWTsgcm93Kyspe1xyXG4gICAgICAgICAgICAgaWYoZmllbGQuY2FzZXNbeF1beUluaXQrcm93XS5pc0Jsb2NrZWQgPT09IHRydWUpe1xyXG4gICAgICAgICAgICAgICAgYmxvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgfVxyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICAgbGV0IHhJbml0ID0gMDtcclxuICAgICAgICAgbGV0IHkgPSB0aGlzLmNhc2UucG9zaXRpb24ueTtcclxuICAgICAgICAgaWYodGhpcy5jYXNlLnBvc2l0aW9uLnggPCBjYXNlVG9SZWFjaC5wb3NpdGlvbi54KXtcclxuICAgICAgICAgICAgeEluaXQgPSB0aGlzLmNhc2UucG9zaXRpb24ueCsxO1xyXG4gICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgeEluaXQgPSBjYXNlVG9SZWFjaC5wb3NpdGlvbi54KzE7IFxyXG4gICAgICAgICB9XHJcbiAgICAgICAgICBsZXQgZGVsdGFYID0gTWF0aC5hYnModGhpcy5jYXNlLnBvc2l0aW9uLnggLSBjYXNlVG9SZWFjaC5wb3NpdGlvbi54KTtcclxuICAgICAgICAgIGZvcihsZXQgY29sID0gMDsgY29sIDwgZGVsdGFYOyBjb2wrKyl7XHJcbiAgICAgICAgICAgICBpZihmaWVsZC5jYXNlc1t4SW5pdCtjb2xdW3ldLmlzQmxvY2tlZCA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICBibG9ja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYoYmxvY2tlZCA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICBpc0Nhc2VSZWFjaGFibGUoY2FzZVRvUmVhY2g6IENhc2UsIGZpZWxkOiBGaWVsZCl7XHJcbiAgICAgIGxldCBkZWx0YVggPSBNYXRoLmFicyhjYXNlVG9SZWFjaC5wb3NpdGlvbi54IC0gdGhpcy5jYXNlLnBvc2l0aW9uLngpO1xyXG4gICAgICBsZXQgZGVsdGFZID0gTWF0aC5hYnMoY2FzZVRvUmVhY2gucG9zaXRpb24ueSAtIHRoaXMuY2FzZS5wb3NpdGlvbi55KTtcclxuICAgICAgaWYoIGRlbHRhWCA8PSAzICYmICBkZWx0YVkgPD0gMyApe1xyXG4gICAgICAgICBpZihjYXNlVG9SZWFjaC5wb3NpdGlvbi54ID09PSB0aGlzLmNhc2UucG9zaXRpb24ueCB8fCBjYXNlVG9SZWFjaC5wb3NpdGlvbi55ID09PSB0aGlzLmNhc2UucG9zaXRpb24ueSl7XHJcbiAgICAgICAgIGlmKCFjYXNlVG9SZWFjaC5pc0Jsb2NrZWQgJiYgIXRoaXMuaXNXYXlCbG9ja2VkKGNhc2VUb1JlYWNoLCBmaWVsZCkpe1xyXG4gICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICB9XHJcblxyXG4gICBnZXRDbG9zZWRDYXNlcygpOiBBcnJheTxDYXNlPntcclxuICAgICAgbGV0IGNsb3NlZENhc2VzID0gQXJyYXk8Q2FzZT4oKTtcclxuICAgICAgbGV0IHNpemVYID0gdGhpcy5jYXNlLmdhbWVNYW5hZ2VyLmZpZWxkLnNpemUueDtcclxuICAgICAgbGV0IHNpemVZID0gdGhpcy5jYXNlLmdhbWVNYW5hZ2VyLmZpZWxkLnNpemUueTtcclxuICAgICAgbGV0IGZpZWxkID0gdGhpcy5jYXNlLmdhbWVNYW5hZ2VyLmZpZWxkO1xyXG5cclxuICAgICAgZm9yKGxldCBjb2wgPSAwOyBjb2wgPCBzaXplWDsgY29sKyspe1xyXG4gICAgICAgICBmb3IobGV0IHJvdyA9IDA7IHJvdyA8IHNpemVZOyByb3crKyl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY2FzZS5jYXNlc0FkamFjZW50KGZpZWxkLmNhc2VzW2NvbF1bcm93XSkpe1xyXG4gICAgICAgICAgICAgICBjbG9zZWRDYXNlcy5wdXNoKGZpZWxkLmNhc2VzW2NvbF1bcm93XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjbG9zZWRDYXNlcztcclxuICAgfVxyXG5cclxuICAgaXNDbG9zZWRDYXNlc0Jsb2NrZWQoKTogQm9vbGVhbntcclxuICAgICAgbGV0IGFsbEJsb2NrZWQgPSB0cnVlO1xyXG4gICAgICBmb3IobGV0IGNhc2VUb0NoZWNrIG9mIHRoaXMuY2xvc2VkQ2FzZXMpe1xyXG4gICAgICAgICBpZighY2FzZVRvQ2hlY2suaXNCbG9ja2VkKXtcclxuICAgICAgICAgICAgYWxsQmxvY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGFsbEJsb2NrZWQ7XHJcbiAgIH1cclxuXHJcbiAgIG1vdmVUbyhmaWVsZDogRmllbGQsIGNhc2VUb01vdmU6IENhc2Upe1xyXG4gICAgICBsZXQgY2hhbmdlZFdlYXBvbiA9IGZhbHNlO1xyXG4gICAgICBsZXQgY2FzZUZyb20gPSB0aGlzLmNhc2U7XHJcbiAgICAgIGxldCBwcmV2aW91c1dlYXBvbiA9IHRoaXMud2VhcG9uO1xyXG4gICAgICBpZih0aGlzLmlzQ2FzZVJlYWNoYWJsZShjYXNlVG9Nb3ZlLCBmaWVsZCkpe1xyXG5cclxuICAgICAgICAgbGV0IG5leHRQbGF5ZXJBcnJheSA9IGZpZWxkLmNoYXJhY3RlcnMuZmlsdGVyKChuZXh0UGxheWVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAobmV4dFBsYXllciAhPT0gdGhpcy5jYXNlLmdhbWVNYW5hZ2VyLnBsYXllclRvdXIpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgbGV0IG5leHRQbGF5ZXIgPSBuZXh0UGxheWVyQXJyYXlbMF07XHJcbiAgICAgICAgIFxyXG4gICAgICB0aGlzLmNhc2UgPSBjYXNlVG9Nb3ZlO1xyXG4gICAgICB0aGlzLmNsb3NlZENhc2VzID0gdGhpcy5nZXRDbG9zZWRDYXNlcygpO1xyXG4gICAgICBpZihjYXNlVG9Nb3ZlLmhhc1dlYXBvbigpKXtcclxuICAgICAgICAgdGhpcy50YWtlV2VhcG9uKHRoaXMuY2FzZSwgZmllbGQpO1xyXG4gICAgICAgICBjaGFuZ2VkV2VhcG9uID0gdHJ1ZTtcclxuICAgICAgICAgY29uc29sZS5sb2coJ1RoZSBwbGF5ZXIgJyArIHRoaXMuY2FzZS5nYW1lTWFuYWdlci5wbGF5ZXJUb3VyLm5hbWUgKyAnIGxldCB0aGUgd2VhcG9uICcrIGNhc2VUb01vdmUud2VhcG9uLm5hbWUgKycgdG8gdGFrZSB0aGUgd2VhcG9uICcgKyB0aGlzLndlYXBvbi5uYW1lICsnLicpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIHRoaXMuJGVsLnJlbW92ZSgpO1xyXG4gICAgICAvLyBMb2dpY0NoYXJhY3Rlci5wYWludENoYXJhY3RlcnMoZmllbGQsIHRoaXMsIGNhc2VUb01vdmUpO1xyXG5cclxuICAgICAgICAgIExvZ2ljQ2hhcmFjdGVyLnNldEFic29sdXRlUG9zaXRpb24odGhpcyk7XHJcbiAgICAgICAgICBMb2dpY0NoYXJhY3Rlci5jaGFyYWN0ZXJBbmltYXRpb24odGhpcywgdGhpcy5hYnNvbHV0ZUNvb3JkKTtcclxuICAgICAgICAgaWYoY2hhbmdlZFdlYXBvbil7XHJcbiAgICAgICAgICAgIExvZ2ljV2VhcG9uLnBhaW50V2VhcG9uKGZpZWxkLmNhc2VzW2Nhc2VGcm9tLnBvc2l0aW9uLnhdW2Nhc2VGcm9tLnBvc2l0aW9uLnldLCBwcmV2aW91c1dlYXBvbiwgZmllbGQpO1xyXG4gICAgICAgICB9XHJcblxyXG5cclxuICAgICAgdGhpcy5jYXNlLmdhbWVNYW5hZ2VyLnBsYXllclRvdXIgPSBuZXh0UGxheWVyO1xyXG4gICAgICBjb25zb2xlLmxvZygnVGhlIHBsYXllciAnICsgdGhpcy5jYXNlLmdhbWVNYW5hZ2VyLnBsYXllclRvdXIubmFtZSArICcgY2FuIHBsYXkuJyk7XHJcbiAgICAgIH1lbHNle1xyXG4gICAgICAgICBjb25zb2xlLmxvZyhcIlRoaXMgcGxhY2UgaXMgdW5yZWFjaGFibGUhIVwiKTtcclxuICAgICAgfVxyXG4gICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENoYXJhY3RlcjsiLCIvL1RoaXMgY2xhc3MgZm9yIHRoZSBmaWVsZHNcclxuY2xhc3MgQ29vcmQge1xyXG4gICAgLy9maWVsZCBcclxuICAgIHggOiBudW1iZXI7XHJcbiAgICB5IDogbnVtYmVyO1xyXG5cclxuICAgIC8vY29uc3RydWN0b3IgXHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBDb29yZDsiLCJpbXBvcnQgQ2FzZSBmcm9tIFwiLi4vLi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcbmltcG9ydCBGaWVsZCBmcm9tIFwiLi4vbW9kZWwvZmllbGRcIjtcclxuaW1wb3J0IENhc2VMb2dpYyBmcm9tIFwiLi4vLi4vY2FzZS9sb2dpYy9jYXNlTG9naWNcIjtcclxuaW1wb3J0IFdlYXBvbiBmcm9tIFwiLi4vLi4vd2VhcG9uL21vZGVsL3dlYXBvblwiO1xyXG5pbXBvcnQgTG9naWNXZWFwb24gZnJvbSBcIi4uLy4uL3dlYXBvbi9sb2dpYy9sb2dpY1dlYXBvblwiO1xyXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gXCIuLi8uLi9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCBMb2dpY0NoYXJhY3RlciBmcm9tIFwiLi4vLi4vY2hhcmFjdGVyL2xvZ2ljL2xvZ2ljQ2hhcmFjdGVyXCI7XHJcbmltcG9ydCBDb29yZCBmcm9tIFwiLi4vLi4vY29vcmQvbW9kZWwvY29vcmRcIjtcclxuXHJcbi8vVGhpcyBjbGFzcyB3aWxsIGdlbmVyYXRlIGFsbCB0aGUgZGlmZmVyZW50IG9iamVjdHMgbmVlZGVkIGZvciB0aGUgZ2FtZVxyXG5hYnN0cmFjdCBjbGFzcyBMb2dpY0ZpZWxkIHtcclxuXHJcbiAgIC8qKlxyXG4gICAgKiBcclxuICAgICogQHBhcmFtIHggXHJcbiAgICAqIEBwYXJhbSB5IFxyXG4gICAgKi9cclxuICAgc3RhdGljIGdlbmVyYXRlTWFwKHg6IG51bWJlciwgeTogbnVtYmVyKTogRmllbGQge1xyXG4gICAgICBsZXQgdG90YWxDYXNlcyA9IHggKiB5O1xyXG4gICAgICBsZXQgYmxvY2tlZENhc2VzID0gTWF0aC5yb3VuZCh0b3RhbENhc2VzIC8gNik7XHJcbiAgICAgIGxldCBmaWVsZDogRmllbGQgPSBuZXcgRmllbGQoeCwgeSk7XHJcblxyXG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCB4OyBjb2wrKykge1xyXG4gICAgICAgICBmaWVsZC5jYXNlc1tjb2xdID0gW107XHJcbiAgICAgICAgIGZvcihsZXQgcm93ID0gMDsgcm93IDwgeTsgcm93Kyspe1xyXG4gICAgICAgICAgICBsZXQgcG9zaXRpb24gPSBuZXcgQ29vcmQoY29sLCByb3cpO1xyXG5cclxuICAgICAgICAgaWYgKGJsb2NrZWRDYXNlcyA+IDApIHtcclxuICAgICAgICAgICAgbGV0IGJsb2NrZWRDYXNlID0gbmV3IENhc2UocG9zaXRpb24sIENhc2VMb2dpYy5CTE9DS0VEKTtcclxuICAgICAgICAgICAgZmllbGQuY2FzZXNbY29sXVtyb3ddID0gYmxvY2tlZENhc2U7XHJcbiAgICAgICAgICAgIGJsb2NrZWRDYXNlcyA9IGJsb2NrZWRDYXNlcyAtIDE7XHJcbiAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBub25CbG9ja2VkQ2FzZSA9IG5ldyBDYXNlKHBvc2l0aW9uKTtcclxuICAgICAgICAgICAgZmllbGQuY2FzZXNbY29sXVtyb3ddID0gbm9uQmxvY2tlZENhc2U7XHJcbiAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGZpZWxkLnVuc29ydENhc2VzKCk7XHJcblxyXG4gICAgICByZXR1cm4gZmllbGQ7XHJcbiAgIH1cclxuXHJcbiAgIC8qKlxyXG4gICAgKiBcclxuICAgICogQHBhcmFtIGVsZW1lbnRUb0ZpbGwgXHJcbiAgICAqIEBwYXJhbSBmaWVsZCBcclxuICAgICovXHJcbiAgIHN0YXRpYyBwYWludEZpZWxkKGVsZW1lbnRUb0ZpbGw6IEhUTUxFbGVtZW50LCBmaWVsZDogRmllbGQpOiB2b2lkIHtcclxuXHJcbiAgICAgIFxyXG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBmaWVsZC5zaXplLng7IGNvbCsrKSB7XHJcbiAgICAgICAgIGxldCByb3dFbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICByb3dFbHQuc3R5bGUuaGVpZ2h0ID0gKDEwMCAvIGZpZWxkLnNpemUueCkudG9GaXhlZCgyKSsgXCIlXCI7XHJcbiAgICAgICAgIHJvd0VsdC5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcclxuICAgICAgICAgcm93RWx0LmNsYXNzTGlzdC5hZGQoXCJyb3ctbWFwXCIpO1xyXG4gICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBmaWVsZC5zaXplLnk7IHJvdysrKXtcclxuICAgICAgICAgbGV0IGRpdkVsdCA9IENhc2VMb2dpYy5wYWludENhc2UoZmllbGQuY2FzZXNbY29sXVtyb3ddKTtcclxuICAgICAgICAgcm93RWx0LmFwcGVuZENoaWxkKGRpdkVsdCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxlbWVudFRvRmlsbC5hcHBlbmRDaGlsZChyb3dFbHQpO1xyXG4gICB9XHJcbiAgIH1cclxuXHJcblxyXG4gICAgc3RhdGljIHNldFdlYXBvbihmaWVsZDogRmllbGQpOiB2b2lkIHtcclxuICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjsgaSsrKSB7XHJcbiAgICAgICAgIGxldCB3ZWFwb24gPSBuZXcgV2VhcG9uKFwiTWpvbG5pclwiK2ksIDEwK2ksIFwiL2Fzc2V0cy9pbWcvd2VhcG9uL3dlYXBvbjEucG5nXCIpO1xyXG4gICAgICAgICBmaWVsZC53ZWFwb25zLnB1c2god2VhcG9uKTtcclxuICAgICAgIH1cclxuICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjsgaSsrKSB7XHJcbiAgICAgICAgIGxldCB3ZWFwb24gPSBuZXcgV2VhcG9uKFwiU3Rvcm1icmVha2VyXCIraSwgMjAraSwgXCIvYXNzZXRzL2ltZy93ZWFwb24vd2VhcG9uMS5wbmdcIik7XHJcbiAgICAgICAgIGZpZWxkLndlYXBvbnMucHVzaCh3ZWFwb24pO1xyXG4gICAgICAgfVxyXG4gICAgICAgZm9yKGxldCB3ZWFwb24gb2YgZmllbGQud2VhcG9ucyl7XHJcbiAgICAgICAgICBMb2dpY1dlYXBvbi5wYWludFN0YXJ0V2VhcG9uKGZpZWxkLCB3ZWFwb24pO1xyXG5cclxuICAgICAgIH1cclxuICAgIH0gXHJcblxyXG4gICBzdGF0aWMgc2V0Q2hhcmFjdGVycyhmaWVsZDogRmllbGQpOiB2b2lkIHtcclxuICAgICAgTG9naWNDaGFyYWN0ZXIucGFpbnRTdGFydENoYXJhY3RlcnMoZmllbGQsIFwiRXh0ZXJtaW5hdG9yXCIsIFwiL2Fzc2V0cy9pbWcvY2hhcmFjdGVycy9hdmF0YXIxLnBuZ1wiKTtcclxuICAgICAgTG9naWNDaGFyYWN0ZXIucGFpbnRTdGFydENoYXJhY3RlcnMoZmllbGQsIFwiUHJlZGF0b3JcIiwgXCIvYXNzZXRzL2ltZy9jaGFyYWN0ZXJzL2F2YXRhcjIucG5nXCIpO1xyXG4gICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IExvZ2ljRmllbGQ7IiwiaW1wb3J0IENhc2UgZnJvbSBcIi4uLy4uL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgQ29vcmQgZnJvbSBcIi4uLy4uL2Nvb3JkL21vZGVsL2Nvb3JkXCI7XHJcbmltcG9ydCBTaXplIGZyb20gXCIuLi8uLi9zaXplL21vZGVsL3NpemVcIjtcclxuaW1wb3J0IFdlYXBvbiBmcm9tIFwiLi4vLi4vd2VhcG9uL21vZGVsL3dlYXBvblwiO1xyXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gXCIuLi8uLi9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCBMb2dpY0hlbHBlciBmcm9tIFwiLi4vLi4vLi4vaGVscGVycy9Mb2dpY0hlbHBlclwiO1xyXG5cclxuXHJcbi8vVGhpcyBjbGFzcyBmb3IgdGhlIGZpZWxkc1xyXG5jbGFzcyBGaWVsZCB7XHJcbiAgICAvL2ZpZWxkIFxyXG4gICAgc2l6ZTogU2l6ZTtcclxuICAgIGNhc2VzOiBDYXNlW11bXTtcclxuICAgIHdlYXBvbnM6IFdlYXBvbltdO1xyXG4gICAgY2hhcmFjdGVyczogQ2hhcmFjdGVyW107XHJcbiAgICAkZWw6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgIC8vY29uc3RydWN0b3IgXHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuc2l6ZSA9IG5ldyBTaXplKHgseSk7XHJcbiAgICAgICAgdGhpcy5jYXNlcyA9IEFycmF5PEFycmF5PENhc2U+PigpO1xyXG4gICAgICAgIHRoaXMud2VhcG9ucyA9IFtdO1xyXG4gICAgICAgIHRoaXMuY2hhcmFjdGVycyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gY2FzZVRvQWRkIFxyXG4gICAgICovXHJcbiAgICBhZGRDYXNlKGNhc2VUb0FkZDogQ2FzZVtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5jYXNlcy5wdXNoKGNhc2VUb0FkZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBpbmRpY2VDYXNlIFxyXG4gICAgICovXHJcbiAgICByZW1vdmVDYXNlKHBvc2l0aW9uOiBDb29yZCk6IHZvaWR7XHJcbiAgICAgICAgdGhpcy5jYXNlc1twb3NpdGlvbi54XS5zcGxpY2UocG9zaXRpb24ueSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqL1xyXG4gICAgbmJyT2ZCbG9ja2VkQ2FzZSgpOiBudW1iZXIge1xyXG4gICAgICAgIGxldCBuYnJPZkJsb2NrZWRDYXNlOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMuc2l6ZS54OyByb3crKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCB0aGlzLnNpemUueTsgY29sKyspe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYXNlc1tyb3ddW2NvbF0uaXNCbG9ja2VkKSB7XHJcbiAgICAgICAgICAgICAgICBuYnJPZkJsb2NrZWRDYXNlID0gbmJyT2ZCbG9ja2VkQ2FzZSArIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ick9mQmxvY2tlZENhc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqL1xyXG4gICAgZ2V0Tm9uQmxvY2tlZENhc2VzKCk6IEFycmF5PENhc2U+IHtcclxuICAgICAgICBsZXQgTm9uQmxvY2tlZENhc2VzOiBBcnJheTxDYXNlPiA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMuc2l6ZS54OyByb3crKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCB0aGlzLnNpemUueTsgY29sKyspe1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY2FzZXNbcm93XVtjb2xdLmlzQmxvY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhc2VUb0FkZCA9IHRoaXMuY2FzZXNbcm93XVtjb2xdO1xyXG4gICAgICAgICAgICAgICAgTm9uQmxvY2tlZENhc2VzLnB1c2goY2FzZVRvQWRkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICAgICByZXR1cm4gTm9uQmxvY2tlZENhc2VzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEJsb2NrZWRDYXNlcygpOiBBcnJheTxDYXNlPiB7XHJcbiAgICAgICAgbGV0IEJsb2NrZWRDYXNlczogQXJyYXk8Q2FzZT4gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLnNpemUueDsgcm93KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5zaXplLnk7IGNvbCsrKXtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2FzZXNbcm93XVtjb2xdLmlzQmxvY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhc2VUb0FkZCA9IHRoaXMuY2FzZXNbcm93XVtjb2xdO1xyXG4gICAgICAgICAgICAgICAgQmxvY2tlZENhc2VzLnB1c2goY2FzZVRvQWRkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICAgICByZXR1cm4gQmxvY2tlZENhc2VzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEF2YWlsYWJsZUNhc2VzKCk6IEFycmF5PENhc2U+IHtcclxuICAgICAgICBsZXQgYXZhaWxhYmxlQ2FzZXM6IEFycmF5PENhc2U+ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5zaXplLng7IHJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuc2l6ZS55OyBjb2wrKyl7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhc2VzW3Jvd11bY29sXS5pc0F2YWlsYWJsZSAmJiAhdGhpcy5jYXNlc1tyb3ddW2NvbF0uaXNCbG9ja2VkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FzZVRvQWRkID0gdGhpcy5jYXNlc1tyb3ddW2NvbF07XHJcbiAgICAgICAgICAgICAgICBhdmFpbGFibGVDYXNlcy5wdXNoKGNhc2VUb0FkZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAgICAgcmV0dXJuIGF2YWlsYWJsZUNhc2VzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gXHJcbiAgICAgKi9cclxuICAgIGdldENhc2VCeVBvc2l0aW9uKHBvc2l0aW9uOiBDb29yZCk6IENhc2Uge1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNhc2VzW3Bvc2l0aW9uLnhdW3Bvc2l0aW9uLnldKTtcclxuICAgICAgICBpZiAocG9zaXRpb24gPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhc2VzW3Bvc2l0aW9uLnhdW3Bvc2l0aW9uLnldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICovXHJcbiAgICBnZXRSYW5kb21DYXNlKCk6IENhc2V7XHJcbiAgICAgICAgbGV0IHJhbmRvbVggPSBMb2dpY0hlbHBlci5nZXRSYW5kb21EaW1lbnNpb24odGhpcy5zaXplLngtMSk7XHJcbiAgICAgICAgbGV0IHJhbmRvbVkgPSBMb2dpY0hlbHBlci5nZXRSYW5kb21EaW1lbnNpb24odGhpcy5zaXplLnktMSk7XHJcblxyXG4gICAgICAgIGxldCByYW5kb21Db29yZCA9IG5ldyBDb29yZChyYW5kb21YLCByYW5kb21ZKTtcclxuXHJcbiAgICAgICAgbGV0IGNhc2VSYW5kb20gPSB0aGlzLmdldENhc2VCeVBvc2l0aW9uKHJhbmRvbUNvb3JkKTtcclxuICAgICAgICBsZXQgY2FzZVRvQ2hlY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYXNlUmFuZG9tLnBvc2l0aW9uU3RyaW5nKTtcclxuICAgICAgICB3aGlsZShjYXNlVG9DaGVjayA9PT0gbnVsbCB8fCBjYXNlVG9DaGVjayA9PT0gdW5kZWZpbmVkIHx8IGNhc2VSYW5kb20gPT09IHVuZGVmaW5lZCB8fCBjYXNlUmFuZG9tID09PSBudWxsKXtcclxuXHJcbiAgICAgICAgICAgIGxldCByYW5kb21YID0gTG9naWNIZWxwZXIuZ2V0UmFuZG9tRGltZW5zaW9uKHRoaXMuc2l6ZS54LTEpO1xyXG4gICAgICAgICAgICBsZXQgcmFuZG9tWSA9IExvZ2ljSGVscGVyLmdldFJhbmRvbURpbWVuc2lvbih0aGlzLnNpemUueS0xKTtcclxuICAgIFxyXG4gICAgICAgICAgICBsZXQgcmFuZG9tQ29vcmQgPSBuZXcgQ29vcmQocmFuZG9tWCwgcmFuZG9tWSk7XHJcblxyXG4gICAgICAgICAgICBjYXNlUmFuZG9tID0gdGhpcy5nZXRDYXNlQnlQb3NpdGlvbihyYW5kb21Db29yZCk7XHJcbiAgICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2FzZVJhbmRvbTtcclxuICAgIH1cclxuXHJcbiAgXHJcbiAgICBnZXROb25CbG9ja2VkUmFuZG9tQ2FzZSgpOiBDYXNle1xyXG5cclxuICAgICAgICBsZXQgbm9uQmxvY2tlZENhc2VzID0gdGhpcy5nZXROb25CbG9ja2VkQ2FzZXMoKTtcclxuXHJcbiAgICAgICAgbGV0IGluZGljZSA9IExvZ2ljSGVscGVyLmdldFJhbmRvbURpbWVuc2lvbihub25CbG9ja2VkQ2FzZXMubGVuZ3RoLTEpO1xyXG5cclxuICAgICAgICBsZXQgbm9uQmxvY2tlZFJhbmRvbUNhc2UgPSBub25CbG9ja2VkQ2FzZXNbaW5kaWNlXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5vbkJsb2NrZWRSYW5kb21DYXNlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBnZXRBdmFpbGFibGVSYW5kb21DYXNlKCk6IENhc2V7XHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZUNhc2VzID0gdGhpcy5nZXRBdmFpbGFibGVDYXNlcygpO1xyXG5cclxuICAgICAgICBsZXQgaW5kaWNlID0gTG9naWNIZWxwZXIuZ2V0UmFuZG9tRGltZW5zaW9uKGF2YWlsYWJsZUNhc2VzLmxlbmd0aC0xKTtcclxuXHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZVJhbmRvbUNhc2UgPSBhdmFpbGFibGVDYXNlc1tpbmRpY2VdO1xyXG5cclxuICAgICAgICByZXR1cm4gYXZhaWxhYmxlUmFuZG9tQ2FzZTtcclxuICAgIH0gXHJcblxyXG5cclxuICAgIGR1cGxpY2F0ZUxpc3RPZkNhc2UoKTogQ2FzZVtde1xyXG4gICAgICAgIGxldCBjYXNlc1RlbXAgPSBBcnJheTxDYXNlPigpO1xyXG4gICAgICAgIGZvciAobGV0IHJvdz0wOyByb3cgPCB0aGlzLnNpemUueDsgcm93KyspIHtcclxuICAgICAgICAgICAgZm9yKGxldCBjb2w9MDsgY29sIDwgdGhpcy5zaXplLnk7IGNvbCsrKXtcclxuICAgICAgICAgICBsZXQgY2FzZVRvQWRkID0gdGhpcy5jYXNlc1tyb3ddW2NvbF07XHJcbiAgICAgICAgICAgY2FzZXNUZW1wLnB1c2goY2FzZVRvQWRkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNhc2VzVGVtcDtcclxuICAgIH1cclxuXHJcbiAgICB1bnNvcnRDYXNlcygpOiB2b2lke1xyXG4gICAgICAgIGxldCBjYXNlc1RlbXAgPSB0aGlzLmR1cGxpY2F0ZUxpc3RPZkNhc2UoKTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBjb2wgPSAwOyBjb2wgPCB0aGlzLnNpemUueDsgY29sKyspe1xyXG4gICAgICAgICAgICBmb3IobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMuc2l6ZS55OyByb3crKyl7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGluZGljZSA9IExvZ2ljSGVscGVyLmdldFJhbmRvbURpbWVuc2lvbihjYXNlc1RlbXAubGVuZ3RoLTEpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY2FzZXNbY29sXVtyb3ddID0gY2FzZXNUZW1wW2luZGljZV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhc2VzW2NvbF1bcm93XS5wb3NpdGlvbi54ID0gY29sO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXNlc1tjb2xdW3Jvd10ucG9zaXRpb24ueSA9IHJvdztcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FzZXNbY29sXVtyb3ddLnBvc2l0aW9uU3RyaW5nID0gU3RyaW5nKGNvbCkrU3RyaW5nKHJvdyk7XHJcbiAgICAgICAgICAgICAgICBjYXNlc1RlbXAuc3BsaWNlKGluZGljZSwxKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q2FzZUJ5RWx0KGVsOiBFbGVtZW50KTogQ2FzZXtcclxuICAgICAgICBmb3IobGV0IHJvd0Nhc2VzIG9mIHRoaXMuY2FzZXMpe1xyXG4gICAgICAgICAgICBmb3IobGV0IGNhc2VUb0dldCBvZiByb3dDYXNlcyl7XHJcbiAgICAgICAgICAgICAgICBpZihjYXNlVG9HZXQuJGVsID09PSBlbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNhc2VUb0dldDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBGaWVsZDsiLCJpbXBvcnQgQ2FzZSBmcm9tIFwiLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuL2ZpZWxkL21vZGVsL2ZpZWxkXCI7XHJcbmltcG9ydCBMb2dpY0ZpZWxkIGZyb20gXCIuL2ZpZWxkL2xvZ2ljL2xvZ2ljRmllbGRcIjtcclxuaW1wb3J0IENhc2VMb2dpYyBmcm9tIFwiLi9jYXNlL2xvZ2ljL2Nhc2VMb2dpY1wiO1xyXG5pbXBvcnQgV2VhcG9uIGZyb20gXCIuL3dlYXBvbi9tb2RlbC93ZWFwb25cIjtcclxuaW1wb3J0IExvZ2ljV2VhcG9uIGZyb20gXCIuL3dlYXBvbi9sb2dpYy9sb2dpY1dlYXBvblwiO1xyXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gXCIuL2NoYXJhY3Rlci9tb2RlbC9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IExvZ2ljQ2hhcmFjdGVyIGZyb20gXCIuL2NoYXJhY3Rlci9sb2dpYy9sb2dpY0NoYXJhY3RlclwiO1xyXG5pbXBvcnQgQ29vcmQgZnJvbSBcIi4vY29vcmQvbW9kZWwvY29vcmRcIjtcclxuXHJcbmNsYXNzIEdhbWVNYW5hZ2VyIHtcclxuICAgIGZpZWxkOiBGaWVsZDtcclxuICAgIGlkOiBzdHJpbmcgPSAnZmlnaHQnO1xyXG4gICAgcGxheWVyczogQXJyYXk8Q2hhcmFjdGVyPjtcclxuICAgIHBsYXllclRvdXI6IENoYXJhY3RlcjtcclxuICAgIG1heE1vdmU6IG51bWJlciA9IDM7XHJcblxyXG4gICAgJGVsOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMucGxheWVycyA9IG5ldyBBcnJheTxDaGFyYWN0ZXI+KCk7XHJcbiAgICAgICAgdGhpcy4kZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRHYW1lTWFuYWdlcigpe1xyXG4gICAgICAgIGZvcihsZXQgcm93RmllbGQgb2YgdGhpcy5maWVsZC5jYXNlcyl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgY2FzZVRvVXBkYXRlIG9mIHJvd0ZpZWxkKXtcclxuICAgICAgICAgICAgICAgIGNhc2VUb1VwZGF0ZS5nYW1lTWFuYWdlciA9IHRoaXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnRHYW1lKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdzdGFydGluZyBnYW1lLi4uJyk7XHJcblxyXG4gICAgICAgIGxldCBmaWVsZCA9IExvZ2ljRmllbGQuZ2VuZXJhdGVNYXAoOCwgOCk7XHJcblxyXG4gICAgICAgIHRoaXMuZmllbGQgPSBmaWVsZDtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRHYW1lTWFuYWdlcigpO1xyXG5cclxuICAgICAgICBMb2dpY0ZpZWxkLnBhaW50RmllbGQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWdodFwiKSwgZmllbGQpO1xyXG5cclxuICAgICAgICBMb2dpY0ZpZWxkLnNldFdlYXBvbihmaWVsZCk7XHJcblxyXG4gICAgICAgIExvZ2ljRmllbGQuc2V0Q2hhcmFjdGVycyhmaWVsZCk7XHJcblxyXG4gICAgICAgIC8vIEZpcnN0IFBsYXllciBzdGFydFxyXG4gICAgICAgIHRoaXMucGxheWVyVG91ciA9IGZpZWxkLmNoYXJhY3RlcnNbMF07XHJcblxyXG5cclxuXHJcblxyXG4gICAgICAgIHRoaXMuc2hvd1JlYWNoYWJsZUNhc2UoKTtcclxuXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdUaGUgcGxheWVyICcgKyB0aGlzLnBsYXllclRvdXIubmFtZSArICcgY2FuIHBsYXkuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1JlYWNoYWJsZUNhc2UoKXtcclxuICAgICAgICBmb3IobGV0IGNvbD0wOyBjb2wgPCB0aGlzLmZpZWxkLnNpemUueDsgY29sKyspe1xyXG4gICAgICAgICAgICBmb3IobGV0IHJvdz0wOyByb3cgPCB0aGlzLmZpZWxkLnNpemUueTsgcm93Kyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhc2VUb0NoZWNrID0gdGhpcy5maWVsZC5jYXNlc1tjb2xdW3Jvd107XHJcbiAgICAgICAgICAgIGlmKHRoaXMucGxheWVyVG91ci5pc0Nhc2VSZWFjaGFibGUoY2FzZVRvQ2hlY2ssIHRoaXMuZmllbGQpID09PSB0cnVlICYmIGNhc2VUb0NoZWNrICE9PSB0aGlzLnBsYXllclRvdXIuY2FzZSl7XHJcbiAgICAgICAgICAgICAgICBjYXNlVG9DaGVjay4kZWwuY2xhc3NMaXN0LmFkZChcImNhc2UtcmVhY2hhYmxlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgXHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgR2FtZU1hbmFnZXI7IiwiLy9UaGlzIGNsYXNzIGZvciB0aGUgZmllbGRzXHJcbmNsYXNzIFNpemUge1xyXG4gICAgLy9maWVsZCBcclxuICAgIHggOiBudW1iZXI7XHJcbiAgICB5IDogbnVtYmVyO1xyXG5cclxuICAgIC8vY29uc3RydWN0b3IgXHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBTaXplOyIsImltcG9ydCBGaWVsZCBmcm9tIFwiLi4vLi4vZmllbGQvbW9kZWwvZmllbGRcIjtcclxuaW1wb3J0IFdlYXBvbiBmcm9tIFwiLi4vLi4vd2VhcG9uL21vZGVsL3dlYXBvblwiO1xyXG5pbXBvcnQgQ2FzZSBmcm9tIFwiLi4vLi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcblxyXG5cclxuYWJzdHJhY3QgY2xhc3MgTG9naWNXZWFwb24ge1xyXG5cclxuXHJcbiAgICBzdGF0aWMgcGFpbnRTdGFydFdlYXBvbihmaWVsZDogRmllbGQsIHdlYXBvbjogV2VhcG9uKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGNhc2VXZWFwb24gPSBmaWVsZC5nZXRBdmFpbGFibGVSYW5kb21DYXNlKCk7XHJcbiAgICAgICAgbGV0IGltZ1dlYXBvbjogSFRNTEltYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgbGV0IHNwYW5FbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBzcGFuRWx0LmNsYXNzTGlzdC5hZGQoXCJ3ZWFwb25cIik7XHJcbiAgICAgICAgaW1nV2VhcG9uLnNyYyA9IHdlYXBvbi5pY29uVXJsO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS5tYXhXaWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS5tYXhIZWlnaHQgPSBcIjUwJVwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUudG9wID0gXCIzMCVcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUubGVmdCA9IFwiMFwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS56SW5kZXggPSBcIjIwXCI7XHJcbiAgICAgICAgc3BhbkVsdC5hcHBlbmRDaGlsZChpbWdXZWFwb24pO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhc2VXZWFwb24ucG9zaXRpb25TdHJpbmcpLmFwcGVuZENoaWxkKHNwYW5FbHQpO1xyXG4gICAgICAgIGZpZWxkLmNhc2VzW2Nhc2VXZWFwb24ucG9zaXRpb24ueF1bY2FzZVdlYXBvbi5wb3NpdGlvbi55XS5pc0F2YWlsYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIGZpZWxkLmNhc2VzW2Nhc2VXZWFwb24ucG9zaXRpb24ueF1bY2FzZVdlYXBvbi5wb3NpdGlvbi55XS53ZWFwb24gPSB3ZWFwb247XHJcbiAgICAgICAgd2VhcG9uLiRlbCA9IHNwYW5FbHQ7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBwYWludFdlYXBvbihjYXNlV2VhcG9uOiBDYXNlLCB3ZWFwb246IFdlYXBvbiwgZmllbGQ6IEZpZWxkKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBpbWdXZWFwb246IEhUTUxJbWFnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGxldCBzcGFuRWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgc3BhbkVsdC5jbGFzc0xpc3QuYWRkKFwid2VhcG9uXCIpO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zcmMgPSB3ZWFwb24uaWNvblVybDtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUubWF4V2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUubWF4SGVpZ2h0ID0gXCI1MCVcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLnRvcCA9IFwiMzAlXCI7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLmxlZnQgPSBcIjBcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUuekluZGV4ID0gXCIyMFwiO1xyXG4gICAgICAgIHNwYW5FbHQuYXBwZW5kQ2hpbGQoaW1nV2VhcG9uKTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYXNlV2VhcG9uLnBvc2l0aW9uU3RyaW5nKS5hcHBlbmRDaGlsZChzcGFuRWx0KTtcclxuICAgICAgICBmaWVsZC5jYXNlc1tjYXNlV2VhcG9uLnBvc2l0aW9uLnhdW2Nhc2VXZWFwb24ucG9zaXRpb24ueV0ud2VhcG9uID0gd2VhcG9uO1xyXG4gICAgICAgIHdlYXBvbi4kZWwgPSBzcGFuRWx0O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMb2dpY1dlYXBvbjsiLCJpbXBvcnQgQ2FzZSBmcm9tIFwiLi4vLi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcblxyXG4vL1RoaXMgY2xhc3MgZm9yIHRoZSBmaWVsZHNcclxuY2xhc3MgV2VhcG9uIHtcclxuICAgLy9maWVsZCBcclxuICAgbmFtZTogc3RyaW5nO1xyXG4gICBkYW1hZ2U6IG51bWJlcjtcclxuICAgaWNvblVybDogc3RyaW5nO1xyXG4gICBjYXNlOiBDYXNlO1xyXG4gICAkZWw6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgLy9jb25zdHJ1Y3RvciBcclxuICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBkYW1hZ2U6IG51bWJlciwgaWNvblVybDogc3RyaW5nKSB7XHJcbiAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgIHRoaXMuZGFtYWdlID0gZGFtYWdlO1xyXG4gICAgICB0aGlzLmljb25VcmwgPSBpY29uVXJsO1xyXG4gICB9XHJcblxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgV2VhcG9uOyIsIlxyXG5hYnN0cmFjdCBjbGFzcyBMb2dpY0hlbHBlciB7XHJcbiAgICBzdGF0aWMgZ2V0UmFuZG9tRGltZW5zaW9uKGRpbWVuc2lvbjogbnVtYmVyKTogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSpkaW1lbnNpb24pO1xyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTG9naWNIZWxwZXI7IiwiXHJcbmltcG9ydCBDYXNlIGZyb20gXCIuL2VudGl0aWVzL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4vZW50aXRpZXMvZmllbGQvbW9kZWwvZmllbGRcIjtcclxuaW1wb3J0IExvZ2ljRmllbGQgZnJvbSBcIi4vZW50aXRpZXMvZmllbGQvbG9naWMvbG9naWNGaWVsZFwiO1xyXG5pbXBvcnQgR2FtZU1hbmFnZXIgZnJvbSBcIi4vZW50aXRpZXMvZ2FtZU1hbmFnZXJcIjtcclxuXHJcbmxldCBnYW1lTWFuYWdlciA9IG5ldyBHYW1lTWFuYWdlcigpO1xyXG5nYW1lTWFuYWdlci5zdGFydEdhbWUoKTtcclxuXHJcblxyXG4iXX0=
