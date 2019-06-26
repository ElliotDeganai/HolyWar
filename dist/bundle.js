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
        this.weapon = null;
        this.weapon.$el.remove();
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
            while (field.characters[0].case.casesAdjacent(player.case)) {
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
        this.weapon = new weapon_1.default("basicWeapon", 5, "/assets/img/weapon/weapon1.png");
    }
    Character.prototype.takeWeapon = function (caseWeapon, field) {
        var weaponToDrop = this.weapon;
        this.weapon = caseWeapon.weapon;
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
    Character.prototype.moveTo = function (field, caseToMove) {
        var _this = this;
        if (this.isCaseReachable(caseToMove, field)) {
            var nextPlayerArray = field.characters.filter(function (nextPlayer) {
                return (nextPlayer !== _this.case.gameManager.playerTour);
            });
            var nextPlayer = nextPlayerArray[0];
            this.case = caseToMove;
            if (caseToMove.hasWeapon()) {
                this.takeWeapon(this.case, field);
                console.log('The player ' + this.case.gameManager.playerTour.name + ' let the weapon ' + caseToMove.weapon.name + ' to take the weapon ' + this.weapon.name + '.');
            }
            // this.$el.remove();
            // LogicCharacter.paintCharacters(field, this, caseToMove);
            logicCharacter_1.default.setAbsolutePosition(this);
            logicCharacter_1.default.characterAnimation(this, this.absoluteCoord);
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
},{"../../weapon/model/weapon":11,"../logic/logicCharacter":3}],5:[function(require,module,exports){
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
            rowElt.style.height = (Math.round(100 / field.size.x)) + "%";
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
            var weapon = new weapon_1.default("Mjolnir" + i, 10, "/assets/img/weapon/weapon1.png");
            field.weapons.push(weapon);
        }
        for (var i = 0; i < 2; i++) {
            var weapon = new weapon_1.default("Stormbreaker" + i, 10, "/assets/img/weapon/weapon2.png");
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
        var field = logicField_1.default.generateMap(10, 10);
        logicField_1.default.paintField(document.getElementById("fight"), field);
        logicField_1.default.setWeapon(field);
        logicField_1.default.setCharacters(field);
        // First Player start
        this.playerTour = field.characters[0];
        this.field = field;
        this.setGameManager();
        console.log('The player ' + this.playerTour.name + ' can play.');
    };
    GameManager.prototype.showReachableCase = function () {
        for (var col = 0; col < this.field.size.x; col++) {
            for (var row = 0; row < this.field.size.y; row++) {
                var caseToCheck = this.field.cases[col][row];
                var blockFaced = 0;
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
        imgWeapon.style.maxHeight = "100%";
        imgWeapon.style.position = "absolute";
        imgWeapon.style.top = "0";
        imgWeapon.style.left = "0";
        imgWeapon.style.zIndex = "20";
        spanElt.appendChild(imgWeapon);
        console.log(caseWeapon.positionString);
        document.getElementById(caseWeapon.positionString).appendChild(spanElt);
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
//gameManager.movePlayer();
gameManager.showReachableCase();
},{"./entities/gameManager":8}]},{},[13])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZW50aXRpZXMvY2FzZS9sb2dpYy9jYXNlTG9naWMudHMiLCJzcmMvZW50aXRpZXMvY2FzZS9tb2RlbC9jYXNlLnRzIiwic3JjL2VudGl0aWVzL2NoYXJhY3Rlci9sb2dpYy9sb2dpY0NoYXJhY3Rlci50cyIsInNyYy9lbnRpdGllcy9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyLnRzIiwic3JjL2VudGl0aWVzL2Nvb3JkL21vZGVsL2Nvb3JkLnRzIiwic3JjL2VudGl0aWVzL2ZpZWxkL2xvZ2ljL2xvZ2ljRmllbGQudHMiLCJzcmMvZW50aXRpZXMvZmllbGQvbW9kZWwvZmllbGQudHMiLCJzcmMvZW50aXRpZXMvZ2FtZU1hbmFnZXIudHMiLCJzcmMvZW50aXRpZXMvc2l6ZS9tb2RlbC9zaXplLnRzIiwic3JjL2VudGl0aWVzL3dlYXBvbi9sb2dpYy9sb2dpY1dlYXBvbi50cyIsInNyYy9lbnRpdGllcy93ZWFwb24vbW9kZWwvd2VhcG9uLnRzIiwic3JjL2hlbHBlcnMvTG9naWNIZWxwZXIudHMiLCJzcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDR0E7SUFBQTtJQWtDQSxDQUFDO0lBN0JHOzs7Ozs7T0FNRztJQUNJLG1CQUFTLEdBQWhCLFVBQWlCLFdBQWlCO1FBQzlCLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO1FBRW5DLFFBQVEsV0FBVyxDQUFDLFNBQVMsRUFBRTtZQUMzQixLQUFLLEtBQUs7Z0JBQ04sTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzdCLE1BQU07WUFFVixLQUFLLElBQUk7Z0JBQ0wsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFD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LEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUMsU0FBUyxDQUFDLENBQUM7SUFFL0MsQ0FBQztJQUNMLGtCQUFDO0FBQUQsQ0FOQSxBQU1DLElBQUE7QUFFRCxrQkFBZSxXQUFXLENBQUM7Ozs7QUNMM0Isc0RBQWlEO0FBRWpELElBQUksV0FBVyxHQUFHLElBQUkscUJBQVcsRUFBRSxDQUFDO0FBQ3BDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUN4QiwyQkFBMkI7QUFDM0IsV0FBVyxDQUFDLGlCQUFpQixFQUFFLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgQ2FzZSBmcm9tIFwiLi4vLi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcbmltcG9ydCBGaWVsZCBmcm9tIFwiLi4vLi4vZmllbGQvbW9kZWwvZmllbGRcIjtcclxuXHJcbmFic3RyYWN0IGNsYXNzIENhc2VMb2dpYyB7XHJcblxyXG4gICAgc3RhdGljIEJMT0NLRUQ6IHN0cmluZyA9IFwiQkxPQ0tFRFwiO1xyXG4gICAgc3RhdGljIE5PUk1BTDogc3RyaW5nID0gXCJOT1JNQUxcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHBhcnR5RmllbGQgXHJcbiAgICAgKiBAcGFyYW0gbGlzdE9mQ2FzZXNUZW1wIFxyXG4gICAgICogQHBhcmFtIGVsZW1lbnRUb0ZpbGwgXHJcbiAgICAgKiBAcGFyYW0gbmJyT2ZSZW1haW5pbmdDYXNlcyBcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHBhaW50Q2FzZShjYXNlVG9QYWludDogQ2FzZSk6IEhUTUxEaXZFbGVtZW50IHtcclxuICAgICAgICBsZXQgZGl2RWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkaXZFbHQuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XHJcblxyXG4gICAgICAgIHN3aXRjaCAoY2FzZVRvUGFpbnQuaXNCbG9ja2VkKSB7XHJcbiAgICAgICAgICAgIGNhc2UgZmFsc2U6XHJcbiAgICAgICAgICAgICAgICBkaXZFbHQuY2xhc3NMaXN0LmFkZChcImNhc2VcIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgdHJ1ZTpcclxuICAgICAgICAgICAgICAgIGRpdkVsdC5jbGFzc0xpc3QuYWRkKFwiY2FzZVwiKTtcclxuICAgICAgICAgICAgICAgIGRpdkVsdC5jbGFzc0xpc3QuYWRkKFwiYmxvY2tlZFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkaXZFbHQuaWQgPSBTdHJpbmcoY2FzZVRvUGFpbnQucG9zaXRpb25TdHJpbmcpO1xyXG5cclxuICAgICAgICBjYXNlVG9QYWludC5zZXRFbChkaXZFbHQpO1xyXG4gICAgICAgIHJldHVybiBkaXZFbHQ7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENhc2VMb2dpYzsiLCJpbXBvcnQgQ2FzZUxvZ2ljIGZyb20gXCIuLi8uLi9jYXNlL2xvZ2ljL2Nhc2VMb2dpY1wiO1xyXG5pbXBvcnQgQ29vcmQgZnJvbSBcIi4uLy4uL2Nvb3JkL21vZGVsL2Nvb3JkXCI7XHJcbmltcG9ydCBXZWFwb24gZnJvbSBcIi4uLy4uL3dlYXBvbi9tb2RlbC93ZWFwb25cIjtcclxuaW1wb3J0IExvZ2ljV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbG9naWMvbG9naWNXZWFwb25cIjtcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuLi8uLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gXCIuLi8uLi9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCBHYW1lTWFuYWdlciBmcm9tIFwiLi4vLi4vZ2FtZU1hbmFnZXJcIjtcclxuXHJcbmNsYXNzIENhc2Uge1xyXG4gICAgLy9maWVsZCBcclxuICAgIGltZ1VybDogc3RyaW5nO1xyXG4gICAgaXNCbG9ja2VkOiBib29sZWFuO1xyXG4gICAgaXNBdmFpbGFibGU6IGJvb2xlYW47XHJcbiAgICBwb3NpdGlvbjogQ29vcmQ7XHJcbiAgICBwb3NpdGlvblN0cmluZzogc3RyaW5nO1xyXG4gICAgdHlwZTogc3RyaW5nO1xyXG4gICAgd2VhcG9uOiBXZWFwb247XHJcbiAgICBnYW1lTWFuYWdlcjogR2FtZU1hbmFnZXI7XHJcbiAgICAkZWw6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgIC8vY29uc3RydWN0b3IgXHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjogQ29vcmQsIHR5cGU6IHN0cmluZyA9IENhc2VMb2dpYy5OT1JNQUwsIGlzQXZhaWxhYmxlOiBib29sZWFuID0gdHJ1ZSkge1xyXG5cclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBDYXNlTG9naWMuTk9STUFMOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbWdVcmwgPSBcIi9hc3NldHMvaW1nL25vcm1hbC1maWVsZC90aWxlLTJELnBuZ1wiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc0Jsb2NrZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBDYXNlTG9naWMuQkxPQ0tFRDpcclxuICAgICAgICAgICAgICAgIHRoaXMuaW1nVXJsID0gXCIvYXNzZXRzL2ltZy9ibG9ja2VkLWZpZWxkL3RpbGUtMkQucG5nXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzQmxvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pc0F2YWlsYWJsZSA9IGlzQXZhaWxhYmxlO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uU3RyaW5nID0gU3RyaW5nKHBvc2l0aW9uLngpICsgU3RyaW5nKHBvc2l0aW9uLnkpO1xyXG4gICAgICAgIHRoaXMud2VhcG9uID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjYXNlc0FkamFjZW50KGNhc2VUb0NoZWNrOiBDYXNlKTogQm9vbGVhbntcclxuICAgICAgICBpZih0aGlzLnBvc2l0aW9uLnggPT09IGNhc2VUb0NoZWNrLnBvc2l0aW9uLngrMSB8fCB0aGlzLnBvc2l0aW9uLnggPT09IGNhc2VUb0NoZWNrLnBvc2l0aW9uLngtMSB8fCB0aGlzLnBvc2l0aW9uLnkgPT09IGNhc2VUb0NoZWNrLnBvc2l0aW9uLnkrMSB8fCB0aGlzLnBvc2l0aW9uLnkgPT09IGNhc2VUb0NoZWNrLnBvc2l0aW9uLnktMSl7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhc1dlYXBvbigpe1xyXG4gICAgICAgIGlmKHRoaXMud2VhcG9uICE9PSBudWxsKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICByZW1vdmVXZWFwb24oKXtcclxuICAgICAgICB0aGlzLndlYXBvbiA9IG51bGw7XHJcbiAgICAgICAgdGhpcy53ZWFwb24uJGVsLnJlbW92ZSgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhZGRXZWFwb24oZmllbGQ6IEZpZWxkLCB3ZWFwb246IFdlYXBvbil7XHJcbiAgICAgICAgdGhpcy53ZWFwb24gPSB3ZWFwb247XHJcbiAgICAgICAgTG9naWNXZWFwb24ucGFpbnRXZWFwb24odGhpcywgd2VhcG9uLCBmaWVsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0RWwoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudCB7XHJcbiAgICAgICAgdGhpcy4kZWwgPSBlbGVtZW50O1xyXG5cclxuICAgICAgICB0aGlzLiRlbC5vbmNsaWNrID0gKGV2ZW50OiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMub25DbGljayhldmVudCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuJGVsO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lke1xyXG4gXHJcbiAgICAgICAgICAgIGxldCBjYXNlc0VsZW1lbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2FzZScpO1xyXG4gICAgICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmdhbWVNYW5hZ2VyLmZpZWxkO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYXNlc0VsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FzZXNFbGVtZW50ID0gKDxIVE1MRWxlbWVudD5jYXNlc0VsZW1lbnRzW2ldKTtcclxuICAgICAgICAgICAgICAgIGNhc2VzRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdjYXNlLXJlYWNoYWJsZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB2YXIgZWwgPSBldmVudC50YXJnZXR8fGV2ZW50LnNyY0VsZW1lbnQ7XHJcbiAgICAgICAgICAgIGxldCBjYXNlVG9HbyA9IGZpZWxkLmNhc2VzW3RoaXMucG9zaXRpb24ueF1bdGhpcy5wb3NpdGlvbi55XTtcclxuXHJcbiAgICAgICAgICAgIC8vIERvIG5vdGhpbmcgaWYgcGxheWVyIHNlbGVjdCBhIEJsb2NrIENhc2VcclxuICAgICAgICAgICAgaWYgKGNhc2VUb0dvLmlzQmxvY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nYW1lTWFuYWdlci5zaG93UmVhY2hhYmxlQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vd2UgZ2V0IHRoZSBlbGVtZW50IHRhcmdldFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5nYW1lTWFuYWdlci5wbGF5ZXJUb3VyLm1vdmVUbyh0aGlzLmdhbWVNYW5hZ2VyLmZpZWxkLCBjYXNlVG9Hbyk7XHJcblxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5nYW1lTWFuYWdlci5zaG93UmVhY2hhYmxlQ2FzZSgpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENhc2U7IiwiXHJcbmltcG9ydCBGaWVsZCBmcm9tIFwiLi4vLi4vZmllbGQvbW9kZWwvZmllbGRcIjtcclxuaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi4vLi4vY2hhcmFjdGVyL21vZGVsL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgQ2FzZSBmcm9tIFwiLi4vLi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcbmltcG9ydCBDb29yZCBmcm9tIFwiLi4vLi4vY29vcmQvbW9kZWwvY29vcmRcIjtcclxuXHJcbmNvbnN0IGRpbWVuc2lvbkNhc2UgPSA4NDtcclxuXHJcbmFic3RyYWN0IGNsYXNzIExvZ2ljQ2hhcmFjdGVyIHtcclxuXHJcbiAgICBzdGF0aWMgcGFpbnRTdGFydENoYXJhY3RlcnMoZmllbGQ6IEZpZWxkLCBuYW1lQ2hhcmFjdGVyOiBzdHJpbmcsIGljb25Vcmw6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGxldCBwbGF5ZXIgPSBuZXcgQ2hhcmFjdGVyKG5hbWVDaGFyYWN0ZXIsIGljb25VcmwsIGZpZWxkLmdldEF2YWlsYWJsZVJhbmRvbUNhc2UoKSk7XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgZmllbGQuY2hhcmFjdGVyc1swXSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlKGZpZWxkLmNoYXJhY3RlcnNbMF0uY2FzZS5jYXNlc0FkamFjZW50KHBsYXllci5jYXNlKSl7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIgPSBuZXcgQ2hhcmFjdGVyKG5hbWVDaGFyYWN0ZXIsIGljb25VcmwsIGZpZWxkLmdldEF2YWlsYWJsZVJhbmRvbUNhc2UoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIGZpZWxkLmNhc2VzW3BsYXllci5jYXNlLnBvc2l0aW9uLnhdW3BsYXllci5jYXNlLnBvc2l0aW9uLnldLmlzQXZhaWxhYmxlID0gZmFsc2U7XHJcbiAgICAgICAgbGV0IGltZ0NoYXI6IEhUTUxJbWFnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGxldCBzcGFuRWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcblxyXG4gICAgICAgIHNwYW5FbHQuY2xhc3NMaXN0LmFkZChcImNoYXJcIik7XHJcbiAgICAgICAgaW1nQ2hhci5zcmMgPSBwbGF5ZXIuaWNvblVybDtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLm1heFdpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgICAgaW1nQ2hhci5zdHlsZS5tYXhIZWlnaHQgPSAoTWF0aC5yb3VuZCgxMDAgLyBmaWVsZC5zaXplLngpKSsgXCIlXCI7XHJcbiAgICAgICAgaW1nQ2hhci5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLnpJbmRleCA9IFwiNTBcIjtcclxuICAgICAgICAvL3NwYW5FbHQuYXBwZW5kQ2hpbGQoaW1nQ2hhcik7XHJcbiAgICAgICAgLy9sZXQgcGxheWVyRGl2RWx0ID0gcGxheWVyLmNhc2UuJGVsO1xyXG4gICAgICAgIGxldCBwbGF5ZXJEaXZFbHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpZ2h0XCIpO1xyXG4gICAgICAgIC8vcGxheWVyRGl2RWx0LmFwcGVuZENoaWxkKHNwYW5FbHQpO1xyXG4gICAgICAgIHBsYXllckRpdkVsdC5hcHBlbmRDaGlsZChpbWdDaGFyKTtcclxuICAgICAgICBwbGF5ZXIuJGVsID0gaW1nQ2hhcjtcclxuICAgICAgICBpbWdDaGFyLmNsYXNzTGlzdC5hZGQoXCJwbGF5ZXJcIik7XHJcbiAgICAgICAgdGhpcy5zZXRBYnNvbHV0ZVBvc2l0aW9uKHBsYXllcik7XHJcblxyXG4gICAgICAgIHBsYXllci4kZWwuc3R5bGUubGVmdCA9IHBsYXllci5hYnNvbHV0ZUNvb3JkLnkgKyAncHgnO1xyXG4gICAgICAgIHBsYXllci4kZWwuc3R5bGUudG9wID0gcGxheWVyLmFic29sdXRlQ29vcmQueCArICdweCc7XHJcblxyXG4gICAgICAgIGZpZWxkLmNoYXJhY3RlcnMucHVzaChwbGF5ZXIpO1xyXG4gICAgfSBcclxuXHJcbiAgICBzdGF0aWMgcGFpbnRDaGFyYWN0ZXJzKGZpZWxkOiBGaWVsZCwgcGxheWVyOiBDaGFyYWN0ZXIsIGNhc2VQbGF5ZXI6IENhc2UpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IGltZ0NoYXI6IEhUTUxJbWFnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGxldCBzcGFuRWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcblxyXG4gICAgICAgIHNwYW5FbHQuY2xhc3NMaXN0LmFkZChcImNoYXJcIik7XHJcbiAgICAgICAgaW1nQ2hhci5zcmMgPSBwbGF5ZXIuaWNvblVybDtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLm1heFdpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgICAgaW1nQ2hhci5zdHlsZS5tYXhIZWlnaHQgPSBcIjc1JVwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICAgICAgaW1nQ2hhci5zdHlsZS50b3AgPSBcIjBcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLmxlZnQgPSBcIjBcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLnpJbmRleCA9IFwiNTBcIjtcclxuICAgICAgICBpbWdDaGFyLmNsYXNzTGlzdC5hZGQoXCJwbGF5ZXJcIik7XHJcbiAgICAgICAgc3BhbkVsdC5hcHBlbmRDaGlsZChpbWdDaGFyKTtcclxuICAgICAgICBsZXQgcGxheWVyRGl2RWx0ID0gcGxheWVyLmNhc2UuJGVsO1xyXG4gICAgICAgIHBsYXllckRpdkVsdC5hcHBlbmRDaGlsZChzcGFuRWx0KTtcclxuICAgICAgICBwbGF5ZXIuJGVsID0gc3BhbkVsdDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgY2hhcmFjdGVyQW5pbWF0aW9uKHBsYXllcjogQ2hhcmFjdGVyLCBuZXdDb29yZDogQ29vcmQpe1xyXG5cclxuICAgICAgICBwbGF5ZXIuJGVsLnN0eWxlLmxlZnQgPSBuZXdDb29yZC55ICsgJ3B4JztcclxuICAgICAgICBwbGF5ZXIuJGVsLnN0eWxlLnRvcCA9IG5ld0Nvb3JkLnggKyAncHgnO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgc2V0QWJzb2x1dGVQb3NpdGlvbihwbGF5ZXI6IENoYXJhY3Rlcil7XHJcbiAgICAgICAgbGV0IGFic29sdXRlWCA9IHBsYXllci5jYXNlLnBvc2l0aW9uLngqcGxheWVyLmNhc2UuJGVsLm9mZnNldEhlaWdodDtcclxuICAgICAgICBsZXQgYWJzb2x1dGVZID0gcGxheWVyLmNhc2UucG9zaXRpb24ueSpwbGF5ZXIuY2FzZS4kZWwub2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgbGV0IGFic29sdXRlUG9zaXRpb25QbGF5ZXIgPSBuZXcgQ29vcmQoYWJzb2x1dGVYLCBhYnNvbHV0ZVkpO1xyXG4gICAgICAgIHBsYXllci5hYnNvbHV0ZUNvb3JkID0gYWJzb2x1dGVQb3NpdGlvblBsYXllcjsgXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMb2dpY0NoYXJhY3RlcjsiLCJpbXBvcnQgQ2FzZSBmcm9tIFwiLi4vLi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcbmltcG9ydCBXZWFwb24gZnJvbSBcIi4uLy4uL3dlYXBvbi9tb2RlbC93ZWFwb25cIjtcclxuaW1wb3J0IExvZ2ljV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbG9naWMvbG9naWNXZWFwb25cIjtcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuLi8uLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5pbXBvcnQgTG9naWNDaGFyYWN0ZXIgZnJvbSBcIi4uL2xvZ2ljL2xvZ2ljQ2hhcmFjdGVyXCI7XHJcbmltcG9ydCBDb29yZCBmcm9tIFwiLi4vLi4vY29vcmQvbW9kZWwvY29vcmRcIjtcclxuXHJcbi8vVGhpcyBjbGFzcyBmb3IgdGhlIGZpZWxkc1xyXG5jbGFzcyBDaGFyYWN0ZXIge1xyXG4gICAvL2ZpZWxkIFxyXG4gICBuYW1lOiBzdHJpbmc7XHJcbiAgIGljb25Vcmw6IHN0cmluZztcclxuICAgbGlmZTogbnVtYmVyO1xyXG4gICBsZXZlbDogbnVtYmVyO1xyXG4gICBjYXNlOiBDYXNlO1xyXG4gICB3ZWFwb246IFdlYXBvbjtcclxuICAgYWJzb2x1dGVDb29yZDogQ29vcmQ7XHJcbiAgICRlbDogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAvL2NvbnN0cnVjdG9yIFxyXG4gICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGljb25Vcmw6IHN0cmluZywgc3RhcnRDYXNlOiBDYXNlKSB7XHJcbiAgICAgIHRoaXMubGlmZSA9IDEwMDtcclxuICAgICAgdGhpcy5sZXZlbCA9IDU7XHJcbiAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgIHRoaXMuaWNvblVybCA9IGljb25Vcmw7XHJcbiAgICAgIHRoaXMuY2FzZSA9IHN0YXJ0Q2FzZTtcclxuICAgICAgdGhpcy53ZWFwb24gPSBuZXcgV2VhcG9uKFwiYmFzaWNXZWFwb25cIiwgNSwgXCIvYXNzZXRzL2ltZy93ZWFwb24vd2VhcG9uMS5wbmdcIik7XHJcblxyXG4gICB9XHJcblxyXG4gICB0YWtlV2VhcG9uKGNhc2VXZWFwb246IENhc2UsIGZpZWxkOiBGaWVsZCl7XHJcbiAgICAgIGxldCB3ZWFwb25Ub0Ryb3AgPSB0aGlzLndlYXBvbjtcclxuICAgICAgdGhpcy53ZWFwb24gPSBjYXNlV2VhcG9uLndlYXBvbjtcclxuICAgICAgZmllbGQuY2FzZXNbY2FzZVdlYXBvbi5wb3NpdGlvbi54XVtjYXNlV2VhcG9uLnBvc2l0aW9uLnldLndlYXBvbiA9IHdlYXBvblRvRHJvcDtcclxuICAgICAgLy9Mb2dpY1dlYXBvbi5wYWludFdlYXBvbihjYXNlV2VhcG9uLCB3ZWFwb25Ub0Ryb3AsIGZpZWxkKTtcclxuICAgfVxyXG5cclxuICAgaXNXYXlCbG9ja2VkKGNhc2VUb1JlYWNoOiBDYXNlLCBmaWVsZDogRmllbGQpOiBCb29sZWFue1xyXG4gICAgICBsZXQgYmxvY2tlZCA9IGZhbHNlO1xyXG4gICAgICBpZih0aGlzLmNhc2UucG9zaXRpb24ueCA9PT0gY2FzZVRvUmVhY2gucG9zaXRpb24ueCl7XHJcbiAgICAgICAgIGxldCB4ID0gdGhpcy5jYXNlLnBvc2l0aW9uLng7XHJcbiAgICAgICAgIGxldCB5SW5pdCA9IDA7XHJcbiAgICAgICAgIGlmKHRoaXMuY2FzZS5wb3NpdGlvbi55IDwgY2FzZVRvUmVhY2gucG9zaXRpb24ueSl7XHJcbiAgICAgICAgIHlJbml0ID0gdGhpcy5jYXNlLnBvc2l0aW9uLnkrMTtcclxuICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHlJbml0ID0gY2FzZVRvUmVhY2gucG9zaXRpb24ueSsxOyBcclxuICAgICAgICAgfVxyXG4gICAgICAgICAgbGV0IGRlbHRhWSA9IE1hdGguYWJzKHRoaXMuY2FzZS5wb3NpdGlvbi55IC0gY2FzZVRvUmVhY2gucG9zaXRpb24ueSk7XHJcbiAgICAgICAgICBmb3IobGV0IHJvdyA9IDA7IHJvdyA8IGRlbHRhWTsgcm93Kyspe1xyXG4gICAgICAgICAgICAgaWYoZmllbGQuY2FzZXNbeF1beUluaXQrcm93XS5pc0Jsb2NrZWQgPT09IHRydWUpe1xyXG4gICAgICAgICAgICAgICAgYmxvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgfVxyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICAgbGV0IHhJbml0ID0gMDtcclxuICAgICAgICAgbGV0IHkgPSB0aGlzLmNhc2UucG9zaXRpb24ueTtcclxuICAgICAgICAgaWYodGhpcy5jYXNlLnBvc2l0aW9uLnggPCBjYXNlVG9SZWFjaC5wb3NpdGlvbi54KXtcclxuICAgICAgICAgICAgeEluaXQgPSB0aGlzLmNhc2UucG9zaXRpb24ueCsxO1xyXG4gICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgeEluaXQgPSBjYXNlVG9SZWFjaC5wb3NpdGlvbi54KzE7IFxyXG4gICAgICAgICB9XHJcbiAgICAgICAgICBsZXQgZGVsdGFYID0gTWF0aC5hYnModGhpcy5jYXNlLnBvc2l0aW9uLnggLSBjYXNlVG9SZWFjaC5wb3NpdGlvbi54KTtcclxuICAgICAgICAgIGZvcihsZXQgY29sID0gMDsgY29sIDwgZGVsdGFYOyBjb2wrKyl7XHJcbiAgICAgICAgICAgICBpZihmaWVsZC5jYXNlc1t4SW5pdCtjb2xdW3ldLmlzQmxvY2tlZCA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICBibG9ja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYoYmxvY2tlZCA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICBpc0Nhc2VSZWFjaGFibGUoY2FzZVRvUmVhY2g6IENhc2UsIGZpZWxkOiBGaWVsZCl7XHJcbiAgICAgIGxldCBkZWx0YVggPSBNYXRoLmFicyhjYXNlVG9SZWFjaC5wb3NpdGlvbi54IC0gdGhpcy5jYXNlLnBvc2l0aW9uLngpO1xyXG4gICAgICBsZXQgZGVsdGFZID0gTWF0aC5hYnMoY2FzZVRvUmVhY2gucG9zaXRpb24ueSAtIHRoaXMuY2FzZS5wb3NpdGlvbi55KTtcclxuICAgICAgaWYoIGRlbHRhWCA8PSAzICYmICBkZWx0YVkgPD0gMyApe1xyXG4gICAgICAgICBpZihjYXNlVG9SZWFjaC5wb3NpdGlvbi54ID09PSB0aGlzLmNhc2UucG9zaXRpb24ueCB8fCBjYXNlVG9SZWFjaC5wb3NpdGlvbi55ID09PSB0aGlzLmNhc2UucG9zaXRpb24ueSl7XHJcbiAgICAgICAgIGlmKCFjYXNlVG9SZWFjaC5pc0Jsb2NrZWQgJiYgIXRoaXMuaXNXYXlCbG9ja2VkKGNhc2VUb1JlYWNoLCBmaWVsZCkpe1xyXG4gICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICB9XHJcblxyXG4gICBtb3ZlVG8oZmllbGQ6IEZpZWxkLCBjYXNlVG9Nb3ZlOiBDYXNlKXtcclxuICAgICAgaWYodGhpcy5pc0Nhc2VSZWFjaGFibGUoY2FzZVRvTW92ZSwgZmllbGQpKXtcclxuXHJcbiAgICAgICAgIGxldCBuZXh0UGxheWVyQXJyYXkgPSBmaWVsZC5jaGFyYWN0ZXJzLmZpbHRlcigobmV4dFBsYXllcikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKG5leHRQbGF5ZXIgIT09IHRoaXMuY2FzZS5nYW1lTWFuYWdlci5wbGF5ZXJUb3VyKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIGxldCBuZXh0UGxheWVyID0gbmV4dFBsYXllckFycmF5WzBdO1xyXG4gICAgICAgICBcclxuICAgICAgdGhpcy5jYXNlID0gY2FzZVRvTW92ZTtcclxuICAgICAgaWYoY2FzZVRvTW92ZS5oYXNXZWFwb24oKSl7XHJcbiAgICAgICAgIHRoaXMudGFrZVdlYXBvbih0aGlzLmNhc2UsIGZpZWxkKTtcclxuICAgICAgICAgY29uc29sZS5sb2coJ1RoZSBwbGF5ZXIgJyArIHRoaXMuY2FzZS5nYW1lTWFuYWdlci5wbGF5ZXJUb3VyLm5hbWUgKyAnIGxldCB0aGUgd2VhcG9uICcrIGNhc2VUb01vdmUud2VhcG9uLm5hbWUgKycgdG8gdGFrZSB0aGUgd2VhcG9uICcgKyB0aGlzLndlYXBvbi5uYW1lICsnLicpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIHRoaXMuJGVsLnJlbW92ZSgpO1xyXG4gICAgICAvLyBMb2dpY0NoYXJhY3Rlci5wYWludENoYXJhY3RlcnMoZmllbGQsIHRoaXMsIGNhc2VUb01vdmUpO1xyXG5cclxuICAgICAgICAgIExvZ2ljQ2hhcmFjdGVyLnNldEFic29sdXRlUG9zaXRpb24odGhpcyk7XHJcbiAgICAgICAgICBMb2dpY0NoYXJhY3Rlci5jaGFyYWN0ZXJBbmltYXRpb24odGhpcywgdGhpcy5hYnNvbHV0ZUNvb3JkKTtcclxuXHJcbiAgICAgIHRoaXMuY2FzZS5nYW1lTWFuYWdlci5wbGF5ZXJUb3VyID0gbmV4dFBsYXllcjtcclxuICAgICAgY29uc29sZS5sb2coJ1RoZSBwbGF5ZXIgJyArIHRoaXMuY2FzZS5nYW1lTWFuYWdlci5wbGF5ZXJUb3VyLm5hbWUgKyAnIGNhbiBwbGF5LicpO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICAgY29uc29sZS5sb2coXCJUaGlzIHBsYWNlIGlzIHVucmVhY2hhYmxlISFcIik7XHJcbiAgICAgIH1cclxuICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXI7IiwiLy9UaGlzIGNsYXNzIGZvciB0aGUgZmllbGRzXHJcbmNsYXNzIENvb3JkIHtcclxuICAgIC8vZmllbGQgXHJcbiAgICB4IDogbnVtYmVyO1xyXG4gICAgeSA6IG51bWJlcjtcclxuXHJcbiAgICAvL2NvbnN0cnVjdG9yIFxyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgQ29vcmQ7IiwiaW1wb3J0IENhc2UgZnJvbSBcIi4uLy4uL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4uL21vZGVsL2ZpZWxkXCI7XHJcbmltcG9ydCBDYXNlTG9naWMgZnJvbSBcIi4uLy4uL2Nhc2UvbG9naWMvY2FzZUxvZ2ljXCI7XHJcbmltcG9ydCBXZWFwb24gZnJvbSBcIi4uLy4uL3dlYXBvbi9tb2RlbC93ZWFwb25cIjtcclxuaW1wb3J0IExvZ2ljV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbG9naWMvbG9naWNXZWFwb25cIjtcclxuaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi4vLi4vY2hhcmFjdGVyL21vZGVsL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgTG9naWNDaGFyYWN0ZXIgZnJvbSBcIi4uLy4uL2NoYXJhY3Rlci9sb2dpYy9sb2dpY0NoYXJhY3RlclwiO1xyXG5pbXBvcnQgQ29vcmQgZnJvbSBcIi4uLy4uL2Nvb3JkL21vZGVsL2Nvb3JkXCI7XHJcblxyXG4vL1RoaXMgY2xhc3Mgd2lsbCBnZW5lcmF0ZSBhbGwgdGhlIGRpZmZlcmVudCBvYmplY3RzIG5lZWRlZCBmb3IgdGhlIGdhbWVcclxuYWJzdHJhY3QgY2xhc3MgTG9naWNGaWVsZCB7XHJcblxyXG4gICAvKipcclxuICAgICogXHJcbiAgICAqIEBwYXJhbSB4IFxyXG4gICAgKiBAcGFyYW0geSBcclxuICAgICovXHJcbiAgIHN0YXRpYyBnZW5lcmF0ZU1hcCh4OiBudW1iZXIsIHk6IG51bWJlcik6IEZpZWxkIHtcclxuICAgICAgbGV0IHRvdGFsQ2FzZXMgPSB4ICogeTtcclxuICAgICAgbGV0IGJsb2NrZWRDYXNlcyA9IE1hdGgucm91bmQodG90YWxDYXNlcyAvIDYpO1xyXG4gICAgICBsZXQgZmllbGQ6IEZpZWxkID0gbmV3IEZpZWxkKHgsIHkpO1xyXG5cclxuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgeDsgY29sKyspIHtcclxuICAgICAgICAgZmllbGQuY2FzZXNbY29sXSA9IFtdO1xyXG4gICAgICAgICBmb3IobGV0IHJvdyA9IDA7IHJvdyA8IHk7IHJvdysrKXtcclxuICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gbmV3IENvb3JkKGNvbCwgcm93KTtcclxuXHJcbiAgICAgICAgIGlmIChibG9ja2VkQ2FzZXMgPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBibG9ja2VkQ2FzZSA9IG5ldyBDYXNlKHBvc2l0aW9uLCBDYXNlTG9naWMuQkxPQ0tFRCk7XHJcbiAgICAgICAgICAgIGZpZWxkLmNhc2VzW2NvbF1bcm93XSA9IGJsb2NrZWRDYXNlO1xyXG4gICAgICAgICAgICBibG9ja2VkQ2FzZXMgPSBibG9ja2VkQ2FzZXMgLSAxO1xyXG4gICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgbm9uQmxvY2tlZENhc2UgPSBuZXcgQ2FzZShwb3NpdGlvbik7XHJcbiAgICAgICAgICAgIGZpZWxkLmNhc2VzW2NvbF1bcm93XSA9IG5vbkJsb2NrZWRDYXNlO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBmaWVsZC51bnNvcnRDYXNlcygpO1xyXG5cclxuICAgICAgcmV0dXJuIGZpZWxkO1xyXG4gICB9XHJcblxyXG4gICAvKipcclxuICAgICogXHJcbiAgICAqIEBwYXJhbSBlbGVtZW50VG9GaWxsIFxyXG4gICAgKiBAcGFyYW0gZmllbGQgXHJcbiAgICAqL1xyXG4gICBzdGF0aWMgcGFpbnRGaWVsZChlbGVtZW50VG9GaWxsOiBIVE1MRWxlbWVudCwgZmllbGQ6IEZpZWxkKTogdm9pZCB7XHJcblxyXG4gICAgICBcclxuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgZmllbGQuc2l6ZS54OyBjb2wrKykge1xyXG4gICAgICAgICBsZXQgcm93RWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgcm93RWx0LnN0eWxlLmhlaWdodCA9IChNYXRoLnJvdW5kKDEwMCAvIGZpZWxkLnNpemUueCkpKyBcIiVcIjtcclxuICAgICAgICAgcm93RWx0LnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiO1xyXG4gICAgICAgICByb3dFbHQuY2xhc3NMaXN0LmFkZChcInJvdy1tYXBcIik7XHJcbiAgICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGZpZWxkLnNpemUueTsgcm93Kyspe1xyXG4gICAgICAgICBsZXQgZGl2RWx0ID0gQ2FzZUxvZ2ljLnBhaW50Q2FzZShmaWVsZC5jYXNlc1tjb2xdW3Jvd10pO1xyXG4gICAgICAgICByb3dFbHQuYXBwZW5kQ2hpbGQoZGl2RWx0KTtcclxuICAgICAgfVxyXG4gICAgICBlbGVtZW50VG9GaWxsLmFwcGVuZENoaWxkKHJvd0VsdCk7XHJcbiAgIH1cclxuICAgfVxyXG5cclxuXHJcbiAgICBzdGF0aWMgc2V0V2VhcG9uKGZpZWxkOiBGaWVsZCk6IHZvaWQge1xyXG4gICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpKyspIHtcclxuICAgICAgICAgbGV0IHdlYXBvbiA9IG5ldyBXZWFwb24oXCJNam9sbmlyXCIraSwgMTAsIFwiL2Fzc2V0cy9pbWcvd2VhcG9uL3dlYXBvbjEucG5nXCIpO1xyXG4gICAgICAgICBmaWVsZC53ZWFwb25zLnB1c2god2VhcG9uKTtcclxuICAgICAgIH1cclxuICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjsgaSsrKSB7XHJcbiAgICAgICAgIGxldCB3ZWFwb24gPSBuZXcgV2VhcG9uKFwiU3Rvcm1icmVha2VyXCIraSwgMTAsIFwiL2Fzc2V0cy9pbWcvd2VhcG9uL3dlYXBvbjIucG5nXCIpO1xyXG4gICAgICAgICBmaWVsZC53ZWFwb25zLnB1c2god2VhcG9uKTtcclxuICAgICAgIH1cclxuICAgICAgIGZvcihsZXQgd2VhcG9uIG9mIGZpZWxkLndlYXBvbnMpe1xyXG4gICAgICAgICAgTG9naWNXZWFwb24ucGFpbnRTdGFydFdlYXBvbihmaWVsZCwgd2VhcG9uKTtcclxuXHJcbiAgICAgICB9XHJcbiAgICB9IFxyXG5cclxuICAgc3RhdGljIHNldENoYXJhY3RlcnMoZmllbGQ6IEZpZWxkKTogdm9pZCB7XHJcbiAgICAgIExvZ2ljQ2hhcmFjdGVyLnBhaW50U3RhcnRDaGFyYWN0ZXJzKGZpZWxkLCBcIkV4dGVybWluYXRvclwiLCBcIi9hc3NldHMvaW1nL2NoYXJhY3RlcnMvYXZhdGFyMS5wbmdcIik7XHJcbiAgICAgIExvZ2ljQ2hhcmFjdGVyLnBhaW50U3RhcnRDaGFyYWN0ZXJzKGZpZWxkLCBcIlByZWRhdG9yXCIsIFwiL2Fzc2V0cy9pbWcvY2hhcmFjdGVycy9hdmF0YXIyLnBuZ1wiKTtcclxuICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMb2dpY0ZpZWxkOyIsImltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IENvb3JkIGZyb20gXCIuLi8uLi9jb29yZC9tb2RlbC9jb29yZFwiO1xyXG5pbXBvcnQgU2l6ZSBmcm9tIFwiLi4vLi4vc2l6ZS9tb2RlbC9zaXplXCI7XHJcbmltcG9ydCBXZWFwb24gZnJvbSBcIi4uLy4uL3dlYXBvbi9tb2RlbC93ZWFwb25cIjtcclxuaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi4vLi4vY2hhcmFjdGVyL21vZGVsL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgTG9naWNIZWxwZXIgZnJvbSBcIi4uLy4uLy4uL2hlbHBlcnMvTG9naWNIZWxwZXJcIjtcclxuXHJcblxyXG4vL1RoaXMgY2xhc3MgZm9yIHRoZSBmaWVsZHNcclxuY2xhc3MgRmllbGQge1xyXG4gICAgLy9maWVsZCBcclxuICAgIHNpemU6IFNpemU7XHJcbiAgICBjYXNlczogQ2FzZVtdW107XHJcbiAgICB3ZWFwb25zOiBXZWFwb25bXTtcclxuICAgIGNoYXJhY3RlcnM6IENoYXJhY3RlcltdO1xyXG4gICAgJGVsOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICAvL2NvbnN0cnVjdG9yIFxyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnNpemUgPSBuZXcgU2l6ZSh4LHkpO1xyXG4gICAgICAgIHRoaXMuY2FzZXMgPSBBcnJheTxBcnJheTxDYXNlPj4oKTtcclxuICAgICAgICB0aGlzLndlYXBvbnMgPSBbXTtcclxuICAgICAgICB0aGlzLmNoYXJhY3RlcnMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGNhc2VUb0FkZCBcclxuICAgICAqL1xyXG4gICAgYWRkQ2FzZShjYXNlVG9BZGQ6IENhc2VbXSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY2FzZXMucHVzaChjYXNlVG9BZGQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gaW5kaWNlQ2FzZSBcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlQ2FzZShwb3NpdGlvbjogQ29vcmQpOiB2b2lke1xyXG4gICAgICAgIHRoaXMuY2FzZXNbcG9zaXRpb24ueF0uc3BsaWNlKHBvc2l0aW9uLnksIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKi9cclxuICAgIG5ick9mQmxvY2tlZENhc2UoKTogbnVtYmVyIHtcclxuICAgICAgICBsZXQgbmJyT2ZCbG9ja2VkQ2FzZTogbnVtYmVyID0gMDtcclxuICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLnNpemUueDsgcm93KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5zaXplLnk7IGNvbCsrKXtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2FzZXNbcm93XVtjb2xdLmlzQmxvY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgbmJyT2ZCbG9ja2VkQ2FzZSA9IG5ick9mQmxvY2tlZENhc2UgKyAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgIHJldHVybiBuYnJPZkJsb2NrZWRDYXNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKi9cclxuICAgIGdldE5vbkJsb2NrZWRDYXNlcygpOiBBcnJheTxDYXNlPiB7XHJcbiAgICAgICAgbGV0IE5vbkJsb2NrZWRDYXNlczogQXJyYXk8Q2FzZT4gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLnNpemUueDsgcm93KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5zaXplLnk7IGNvbCsrKXtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNhc2VzW3Jvd11bY29sXS5pc0Jsb2NrZWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjYXNlVG9BZGQgPSB0aGlzLmNhc2VzW3Jvd11bY29sXTtcclxuICAgICAgICAgICAgICAgIE5vbkJsb2NrZWRDYXNlcy5wdXNoKGNhc2VUb0FkZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAgICAgcmV0dXJuIE5vbkJsb2NrZWRDYXNlcztcclxuICAgIH1cclxuXHJcbiAgICBnZXRCbG9ja2VkQ2FzZXMoKTogQXJyYXk8Q2FzZT4ge1xyXG4gICAgICAgIGxldCBCbG9ja2VkQ2FzZXM6IEFycmF5PENhc2U+ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5zaXplLng7IHJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuc2l6ZS55OyBjb2wrKyl7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhc2VzW3Jvd11bY29sXS5pc0Jsb2NrZWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjYXNlVG9BZGQgPSB0aGlzLmNhc2VzW3Jvd11bY29sXTtcclxuICAgICAgICAgICAgICAgIEJsb2NrZWRDYXNlcy5wdXNoKGNhc2VUb0FkZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAgICAgcmV0dXJuIEJsb2NrZWRDYXNlcztcclxuICAgIH1cclxuXHJcbiAgICBnZXRBdmFpbGFibGVDYXNlcygpOiBBcnJheTxDYXNlPiB7XHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZUNhc2VzOiBBcnJheTxDYXNlPiA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMuc2l6ZS54OyByb3crKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCB0aGlzLnNpemUueTsgY29sKyspe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYXNlc1tyb3ddW2NvbF0uaXNBdmFpbGFibGUgJiYgIXRoaXMuY2FzZXNbcm93XVtjb2xdLmlzQmxvY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhc2VUb0FkZCA9IHRoaXMuY2FzZXNbcm93XVtjb2xdO1xyXG4gICAgICAgICAgICAgICAgYXZhaWxhYmxlQ2FzZXMucHVzaChjYXNlVG9BZGQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgIHJldHVybiBhdmFpbGFibGVDYXNlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIFxyXG4gICAgICovXHJcbiAgICBnZXRDYXNlQnlQb3NpdGlvbihwb3NpdGlvbjogQ29vcmQpOiBDYXNlIHtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5jYXNlc1twb3NpdGlvbi54XVtwb3NpdGlvbi55XSk7XHJcbiAgICAgICAgaWYgKHBvc2l0aW9uID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYXNlc1twb3NpdGlvbi54XVtwb3NpdGlvbi55XTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqL1xyXG4gICAgZ2V0UmFuZG9tQ2FzZSgpOiBDYXNle1xyXG4gICAgICAgIGxldCByYW5kb21YID0gTG9naWNIZWxwZXIuZ2V0UmFuZG9tRGltZW5zaW9uKHRoaXMuc2l6ZS54LTEpO1xyXG4gICAgICAgIGxldCByYW5kb21ZID0gTG9naWNIZWxwZXIuZ2V0UmFuZG9tRGltZW5zaW9uKHRoaXMuc2l6ZS55LTEpO1xyXG5cclxuICAgICAgICBsZXQgcmFuZG9tQ29vcmQgPSBuZXcgQ29vcmQocmFuZG9tWCwgcmFuZG9tWSk7XHJcblxyXG4gICAgICAgIGxldCBjYXNlUmFuZG9tID0gdGhpcy5nZXRDYXNlQnlQb3NpdGlvbihyYW5kb21Db29yZCk7XHJcbiAgICAgICAgbGV0IGNhc2VUb0NoZWNrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FzZVJhbmRvbS5wb3NpdGlvblN0cmluZyk7XHJcbiAgICAgICAgd2hpbGUoY2FzZVRvQ2hlY2sgPT09IG51bGwgfHwgY2FzZVRvQ2hlY2sgPT09IHVuZGVmaW5lZCB8fCBjYXNlUmFuZG9tID09PSB1bmRlZmluZWQgfHwgY2FzZVJhbmRvbSA9PT0gbnVsbCl7XHJcblxyXG4gICAgICAgICAgICBsZXQgcmFuZG9tWCA9IExvZ2ljSGVscGVyLmdldFJhbmRvbURpbWVuc2lvbih0aGlzLnNpemUueC0xKTtcclxuICAgICAgICAgICAgbGV0IHJhbmRvbVkgPSBMb2dpY0hlbHBlci5nZXRSYW5kb21EaW1lbnNpb24odGhpcy5zaXplLnktMSk7XHJcbiAgICBcclxuICAgICAgICAgICAgbGV0IHJhbmRvbUNvb3JkID0gbmV3IENvb3JkKHJhbmRvbVgsIHJhbmRvbVkpO1xyXG5cclxuICAgICAgICAgICAgY2FzZVJhbmRvbSA9IHRoaXMuZ2V0Q2FzZUJ5UG9zaXRpb24ocmFuZG9tQ29vcmQpO1xyXG4gICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNhc2VSYW5kb207XHJcbiAgICB9XHJcblxyXG4gIFxyXG4gICAgZ2V0Tm9uQmxvY2tlZFJhbmRvbUNhc2UoKTogQ2FzZXtcclxuXHJcbiAgICAgICAgbGV0IG5vbkJsb2NrZWRDYXNlcyA9IHRoaXMuZ2V0Tm9uQmxvY2tlZENhc2VzKCk7XHJcblxyXG4gICAgICAgIGxldCBpbmRpY2UgPSBMb2dpY0hlbHBlci5nZXRSYW5kb21EaW1lbnNpb24obm9uQmxvY2tlZENhc2VzLmxlbmd0aC0xKTtcclxuXHJcbiAgICAgICAgbGV0IG5vbkJsb2NrZWRSYW5kb21DYXNlID0gbm9uQmxvY2tlZENhc2VzW2luZGljZV07XHJcblxyXG4gICAgICAgIHJldHVybiBub25CbG9ja2VkUmFuZG9tQ2FzZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0QXZhaWxhYmxlUmFuZG9tQ2FzZSgpOiBDYXNle1xyXG4gICAgICAgIGxldCBhdmFpbGFibGVDYXNlcyA9IHRoaXMuZ2V0QXZhaWxhYmxlQ2FzZXMoKTtcclxuXHJcbiAgICAgICAgbGV0IGluZGljZSA9IExvZ2ljSGVscGVyLmdldFJhbmRvbURpbWVuc2lvbihhdmFpbGFibGVDYXNlcy5sZW5ndGgtMSk7XHJcblxyXG4gICAgICAgIGxldCBhdmFpbGFibGVSYW5kb21DYXNlID0gYXZhaWxhYmxlQ2FzZXNbaW5kaWNlXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGF2YWlsYWJsZVJhbmRvbUNhc2U7XHJcbiAgICB9IFxyXG5cclxuXHJcbiAgICBkdXBsaWNhdGVMaXN0T2ZDYXNlKCk6IENhc2VbXXtcclxuICAgICAgICBsZXQgY2FzZXNUZW1wID0gQXJyYXk8Q2FzZT4oKTtcclxuICAgICAgICBmb3IgKGxldCByb3c9MDsgcm93IDwgdGhpcy5zaXplLng7IHJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgY29sPTA7IGNvbCA8IHRoaXMuc2l6ZS55OyBjb2wrKyl7XHJcbiAgICAgICAgICAgbGV0IGNhc2VUb0FkZCA9IHRoaXMuY2FzZXNbcm93XVtjb2xdO1xyXG4gICAgICAgICAgIGNhc2VzVGVtcC5wdXNoKGNhc2VUb0FkZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgIHJldHVybiBjYXNlc1RlbXA7XHJcbiAgICB9XHJcblxyXG4gICAgdW5zb3J0Q2FzZXMoKTogdm9pZHtcclxuICAgICAgICBsZXQgY2FzZXNUZW1wID0gdGhpcy5kdXBsaWNhdGVMaXN0T2ZDYXNlKCk7XHJcblxyXG4gICAgICAgIGZvcihsZXQgY29sID0gMDsgY29sIDwgdGhpcy5zaXplLng7IGNvbCsrKXtcclxuICAgICAgICAgICAgZm9yKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLnNpemUueTsgcm93Kyspe1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBpbmRpY2UgPSBMb2dpY0hlbHBlci5nZXRSYW5kb21EaW1lbnNpb24oY2FzZXNUZW1wLmxlbmd0aC0xKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhc2VzW2NvbF1bcm93XSA9IGNhc2VzVGVtcFtpbmRpY2VdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXNlc1tjb2xdW3Jvd10ucG9zaXRpb24ueCA9IGNvbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FzZXNbY29sXVtyb3ddLnBvc2l0aW9uLnkgPSByb3c7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhc2VzW2NvbF1bcm93XS5wb3NpdGlvblN0cmluZyA9IFN0cmluZyhjb2wpK1N0cmluZyhyb3cpO1xyXG4gICAgICAgICAgICAgICAgY2FzZXNUZW1wLnNwbGljZShpbmRpY2UsMSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldENhc2VCeUVsdChlbDogRWxlbWVudCk6IENhc2V7XHJcbiAgICAgICAgZm9yKGxldCByb3dDYXNlcyBvZiB0aGlzLmNhc2VzKXtcclxuICAgICAgICAgICAgZm9yKGxldCBjYXNlVG9HZXQgb2Ygcm93Q2FzZXMpe1xyXG4gICAgICAgICAgICAgICAgaWYoY2FzZVRvR2V0LiRlbCA9PT0gZWwpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYXNlVG9HZXQ7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRmllbGQ7IiwiaW1wb3J0IENhc2UgZnJvbSBcIi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcbmltcG9ydCBGaWVsZCBmcm9tIFwiLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5pbXBvcnQgTG9naWNGaWVsZCBmcm9tIFwiLi9maWVsZC9sb2dpYy9sb2dpY0ZpZWxkXCI7XHJcbmltcG9ydCBDYXNlTG9naWMgZnJvbSBcIi4vY2FzZS9sb2dpYy9jYXNlTG9naWNcIjtcclxuaW1wb3J0IFdlYXBvbiBmcm9tIFwiLi93ZWFwb24vbW9kZWwvd2VhcG9uXCI7XHJcbmltcG9ydCBMb2dpY1dlYXBvbiBmcm9tIFwiLi93ZWFwb24vbG9naWMvbG9naWNXZWFwb25cIjtcclxuaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCBMb2dpY0NoYXJhY3RlciBmcm9tIFwiLi9jaGFyYWN0ZXIvbG9naWMvbG9naWNDaGFyYWN0ZXJcIjtcclxuaW1wb3J0IENvb3JkIGZyb20gXCIuL2Nvb3JkL21vZGVsL2Nvb3JkXCI7XHJcblxyXG5jbGFzcyBHYW1lTWFuYWdlciB7XHJcbiAgICBmaWVsZDogRmllbGQ7XHJcbiAgICBpZDogc3RyaW5nID0gJ2ZpZ2h0JztcclxuICAgIHBsYXllcnM6IEFycmF5PENoYXJhY3Rlcj47XHJcbiAgICBwbGF5ZXJUb3VyOiBDaGFyYWN0ZXI7XHJcbiAgICBtYXhNb3ZlOiBudW1iZXIgPSAzO1xyXG5cclxuICAgICRlbDogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnBsYXllcnMgPSBuZXcgQXJyYXk8Q2hhcmFjdGVyPigpO1xyXG4gICAgICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0R2FtZU1hbmFnZXIoKXtcclxuICAgICAgICBmb3IobGV0IHJvd0ZpZWxkIG9mIHRoaXMuZmllbGQuY2FzZXMpe1xyXG4gICAgICAgICAgICBmb3IobGV0IGNhc2VUb1VwZGF0ZSBvZiByb3dGaWVsZCl7XHJcbiAgICAgICAgICAgICAgICBjYXNlVG9VcGRhdGUuZ2FtZU1hbmFnZXIgPSB0aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0R2FtZSgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnc3RhcnRpbmcgZ2FtZS4uLicpO1xyXG5cclxuICAgICAgICBsZXQgZmllbGQgPSBMb2dpY0ZpZWxkLmdlbmVyYXRlTWFwKDEwLCAxMCk7XHJcblxyXG4gICAgICAgIExvZ2ljRmllbGQucGFpbnRGaWVsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpZ2h0XCIpLCBmaWVsZCk7XHJcblxyXG4gICAgICAgIExvZ2ljRmllbGQuc2V0V2VhcG9uKGZpZWxkKTtcclxuXHJcbiAgICAgICAgTG9naWNGaWVsZC5zZXRDaGFyYWN0ZXJzKGZpZWxkKTtcclxuXHJcbiAgICAgICAgLy8gRmlyc3QgUGxheWVyIHN0YXJ0XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJUb3VyID0gZmllbGQuY2hhcmFjdGVyc1swXTtcclxuXHJcbiAgICAgICAgdGhpcy5maWVsZCA9IGZpZWxkO1xyXG5cclxuICAgICAgICB0aGlzLnNldEdhbWVNYW5hZ2VyKCk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ1RoZSBwbGF5ZXIgJyArIHRoaXMucGxheWVyVG91ci5uYW1lICsgJyBjYW4gcGxheS4nKTtcclxuICAgIH1cclxuXHJcbiAgICBzaG93UmVhY2hhYmxlQ2FzZSgpe1xyXG4gICAgICAgIGZvcihsZXQgY29sPTA7IGNvbCA8IHRoaXMuZmllbGQuc2l6ZS54OyBjb2wrKyl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgcm93PTA7IHJvdyA8IHRoaXMuZmllbGQuc2l6ZS55OyByb3crKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FzZVRvQ2hlY2sgPSB0aGlzLmZpZWxkLmNhc2VzW2NvbF1bcm93XTtcclxuICAgICAgICAgICAgICAgIGxldCBibG9ja0ZhY2VkID0gMDtcclxuICAgICAgICAgICAgaWYodGhpcy5wbGF5ZXJUb3VyLmlzQ2FzZVJlYWNoYWJsZShjYXNlVG9DaGVjaywgdGhpcy5maWVsZCkgPT09IHRydWUgJiYgY2FzZVRvQ2hlY2sgIT09IHRoaXMucGxheWVyVG91ci5jYXNlKXtcclxuICAgICAgICAgICAgICAgIGNhc2VUb0NoZWNrLiRlbC5jbGFzc0xpc3QuYWRkKFwiY2FzZS1yZWFjaGFibGVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBcclxufVxyXG5leHBvcnQgZGVmYXVsdCBHYW1lTWFuYWdlcjsiLCIvL1RoaXMgY2xhc3MgZm9yIHRoZSBmaWVsZHNcclxuY2xhc3MgU2l6ZSB7XHJcbiAgICAvL2ZpZWxkIFxyXG4gICAgeCA6IG51bWJlcjtcclxuICAgIHkgOiBudW1iZXI7XHJcblxyXG4gICAgLy9jb25zdHJ1Y3RvciBcclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFNpemU7IiwiaW1wb3J0IEZpZWxkIGZyb20gXCIuLi8uLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5pbXBvcnQgV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbW9kZWwvd2VhcG9uXCI7XHJcbmltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuXHJcblxyXG5hYnN0cmFjdCBjbGFzcyBMb2dpY1dlYXBvbiB7XHJcblxyXG5cclxuICAgIHN0YXRpYyBwYWludFN0YXJ0V2VhcG9uKGZpZWxkOiBGaWVsZCwgd2VhcG9uOiBXZWFwb24pOiB2b2lkIHtcclxuICAgICAgICBsZXQgY2FzZVdlYXBvbiA9IGZpZWxkLmdldEF2YWlsYWJsZVJhbmRvbUNhc2UoKTtcclxuICAgICAgICBsZXQgaW1nV2VhcG9uOiBIVE1MSW1hZ2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgICAgICBsZXQgc3BhbkVsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG4gICAgICAgIHNwYW5FbHQuY2xhc3NMaXN0LmFkZChcIndlYXBvblwiKTtcclxuICAgICAgICBpbWdXZWFwb24uc3JjID0gd2VhcG9uLmljb25Vcmw7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLm1heFdpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLm1heEhlaWdodCA9IFwiNTAlXCI7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS50b3AgPSBcIjMwJVwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS5sZWZ0ID0gXCIwXCI7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLnpJbmRleCA9IFwiMjBcIjtcclxuICAgICAgICBzcGFuRWx0LmFwcGVuZENoaWxkKGltZ1dlYXBvbik7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FzZVdlYXBvbi5wb3NpdGlvblN0cmluZykuYXBwZW5kQ2hpbGQoc3BhbkVsdCk7XHJcbiAgICAgICAgZmllbGQuY2FzZXNbY2FzZVdlYXBvbi5wb3NpdGlvbi54XVtjYXNlV2VhcG9uLnBvc2l0aW9uLnldLmlzQXZhaWxhYmxlID0gZmFsc2U7XHJcbiAgICAgICAgZmllbGQuY2FzZXNbY2FzZVdlYXBvbi5wb3NpdGlvbi54XVtjYXNlV2VhcG9uLnBvc2l0aW9uLnldLndlYXBvbiA9IHdlYXBvbjtcclxuICAgICAgICB3ZWFwb24uJGVsID0gc3BhbkVsdDtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIFxyXG4gICAgc3RhdGljIHBhaW50V2VhcG9uKGNhc2VXZWFwb246IENhc2UsIHdlYXBvbjogV2VhcG9uLCBmaWVsZDogRmllbGQpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IGltZ1dlYXBvbjogSFRNTEltYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgbGV0IHNwYW5FbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBzcGFuRWx0LmNsYXNzTGlzdC5hZGQoXCJ3ZWFwb25cIik7XHJcbiAgICAgICAgaW1nV2VhcG9uLnNyYyA9IHdlYXBvbi5pY29uVXJsO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS5tYXhIZWlnaHQgPSBcIjEwMCVcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLnRvcCA9IFwiMFwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS5sZWZ0ID0gXCIwXCI7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLnpJbmRleCA9IFwiMjBcIjtcclxuICAgICAgICBzcGFuRWx0LmFwcGVuZENoaWxkKGltZ1dlYXBvbik7XHJcbiAgICAgICAgY29uc29sZS5sb2coY2FzZVdlYXBvbi5wb3NpdGlvblN0cmluZyk7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FzZVdlYXBvbi5wb3NpdGlvblN0cmluZykuYXBwZW5kQ2hpbGQoc3BhbkVsdCk7XHJcbiAgICAgICAgd2VhcG9uLiRlbCA9IHNwYW5FbHQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IExvZ2ljV2VhcG9uOyIsImltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuXHJcbi8vVGhpcyBjbGFzcyBmb3IgdGhlIGZpZWxkc1xyXG5jbGFzcyBXZWFwb24ge1xyXG4gICAvL2ZpZWxkIFxyXG4gICBuYW1lOiBzdHJpbmc7XHJcbiAgIGRhbWFnZTogbnVtYmVyO1xyXG4gICBpY29uVXJsOiBzdHJpbmc7XHJcbiAgIGNhc2U6IENhc2U7XHJcbiAgICRlbDogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAvL2NvbnN0cnVjdG9yIFxyXG4gICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGRhbWFnZTogbnVtYmVyLCBpY29uVXJsOiBzdHJpbmcpIHtcclxuICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgdGhpcy5kYW1hZ2UgPSBkYW1hZ2U7XHJcbiAgICAgIHRoaXMuaWNvblVybCA9IGljb25Vcmw7XHJcbiAgIH1cclxuXHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBXZWFwb247IiwiXHJcbmFic3RyYWN0IGNsYXNzIExvZ2ljSGVscGVyIHtcclxuICAgIHN0YXRpYyBnZXRSYW5kb21EaW1lbnNpb24oZGltZW5zaW9uOiBudW1iZXIpOiBudW1iZXIge1xyXG5cclxuICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKmRpbWVuc2lvbik7XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMb2dpY0hlbHBlcjsiLCJcclxuaW1wb3J0IENhc2UgZnJvbSBcIi4vZW50aXRpZXMvY2FzZS9tb2RlbC9jYXNlXCI7XHJcbmltcG9ydCBGaWVsZCBmcm9tIFwiLi9lbnRpdGllcy9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5pbXBvcnQgTG9naWNGaWVsZCBmcm9tIFwiLi9lbnRpdGllcy9maWVsZC9sb2dpYy9sb2dpY0ZpZWxkXCI7XHJcbmltcG9ydCBHYW1lTWFuYWdlciBmcm9tIFwiLi9lbnRpdGllcy9nYW1lTWFuYWdlclwiO1xyXG5cclxubGV0IGdhbWVNYW5hZ2VyID0gbmV3IEdhbWVNYW5hZ2VyKCk7XHJcbmdhbWVNYW5hZ2VyLnN0YXJ0R2FtZSgpO1xyXG4vL2dhbWVNYW5hZ2VyLm1vdmVQbGF5ZXIoKTtcclxuZ2FtZU1hbmFnZXIuc2hvd1JlYWNoYWJsZUNhc2UoKTtcclxuXHJcbiJdfQ==
