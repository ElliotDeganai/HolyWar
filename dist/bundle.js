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
    CaseLogic.paintCase = function (partyField, caseToPaint, elementToFill, row, col) {
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
        if (!this.weapon === null) {
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
        imgChar.style.maxHeight = "80px";
        imgChar.style.position = "absolute";
        imgChar.style.top = "0";
        imgChar.style.left = "15px";
        imgChar.style.zIndex = "10";
        spanElt.appendChild(imgChar);
        var playerDivElt = player.case.$el;
        playerDivElt.appendChild(spanElt);
        player.$el = spanElt;
        field.characters.push(player);
    };
    LogicCharacter.paintCharacters = function (field, player, casePlayer) {
        var imgChar = document.createElement("img");
        var spanElt = document.createElement("span");
        spanElt.classList.add("char");
        imgChar.src = player.iconUrl;
        imgChar.style.maxWidth = "100%";
        imgChar.style.maxHeight = "80px";
        imgChar.style.position = "absolute";
        imgChar.style.top = "0px";
        imgChar.style.left = "15px";
        imgChar.style.zIndex = "10";
        spanElt.appendChild(imgChar);
        var playerDivElt = player.case.$el;
        playerDivElt.appendChild(spanElt);
        player.$el = spanElt;
    };
    return LogicCharacter;
}());
exports.default = LogicCharacter;
},{"../../character/model/character":4}],4:[function(require,module,exports){
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
    Character.prototype.takeWeapon = function (field) {
        var caseWeapon = this.case;
        var weaponToDrop = this.weapon;
        this.weapon = this.case.weapon;
        //LogicWeapon.paintWeapon(caseWeapon, weaponToDrop, field);
    };
    Character.prototype.isCaseReachable = function (caseToReach) {
        var deltaX = Math.abs(caseToReach.position.x - this.case.position.x);
        var deltaY = Math.abs(caseToReach.position.y - this.case.position.y);
        if (deltaX <= 3 && deltaY <= 3) {
            if (caseToReach.position.x === this.case.position.x || caseToReach.position.y === this.case.position.y) {
                if (!caseToReach.isBlocked) {
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
        if (this.isCaseReachable(caseToMove)) {
            var nextPlayerArray = field.characters.filter(function (nextPlayer) {
                return (nextPlayer !== _this.case.gameManager.playerTour);
            });
            var nextPlayer = nextPlayerArray[0];
            this.case = caseToMove;
            this.$el.remove();
            logicCharacter_1.default.paintCharacters(field, this, caseToMove);
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
                var divElt = caseLogic_1.default.paintCase(field, field.cases[col][row], elementToFill, row, col);
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
        var field = logicField_1.default.generateMap(8, 8);
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
                if (this.playerTour.isCaseReachable(caseToCheck) === true && caseToCheck !== this.playerTour.case) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZW50aXRpZXMvY2FzZS9sb2dpYy9jYXNlTG9naWMudHMiLCJzcmMvZW50aXRpZXMvY2FzZS9tb2RlbC9jYXNlLnRzIiwic3JjL2VudGl0aWVzL2NoYXJhY3Rlci9sb2dpYy9sb2dpY0NoYXJhY3Rlci50cyIsInNyYy9lbnRpdGllcy9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyLnRzIiwic3JjL2VudGl0aWVzL2Nvb3JkL21vZGVsL2Nvb3JkLnRzIiwic3JjL2VudGl0aWVzL2ZpZWxkL2xvZ2ljL2xvZ2ljRmllbGQudHMiLCJzcmMvZW50aXRpZXMvZmllbGQvbW9kZWwvZmllbGQudHMiLCJzcmMvZW50aXRpZXMvZ2FtZU1hbmFnZXIudHMiLCJzcmMvZW50aXRpZXMvc2l6ZS9tb2RlbC9zaXplLnRzIiwic3JjL2VudGl0aWVzL3dlYXBvbi9sb2dpYy9sb2dpY1dlYXBvbi50cyIsInNyYy9lbnRpdGllcy93ZWFwb24vbW9kZWwvd2VhcG9uLnRzIiwic3JjL2hlbHBlcnMvTG9naWNIZWxwZXIudHMiLCJzcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDR0E7SUFBQTtJQWtDQSxDQUFDO0lBN0JHOzs7Ozs7T0FNRztJQUNJLG1CQUFTLEdBQWhCLFVBQWlCLFVBQWlCLEVBQUUsV0FBaUIsRUFBRSxhQUEwQixFQUFFLEdBQVcsRUFBRSxHQUFXO1FBQ3ZHLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO1FBRW5DLFFBQVEsV0FBVyxDQUFDLFNBQVMsRUFBRTtZQUMzQixLQUFLLEtBQUs7Z0JBQ04sTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzdCLE1BQU07WUFFVixLQUFLLElBQUk7Z0JB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Qzs7OztBQ0wzQixzREFBaUQ7QUFFakQsSUFBSSxXQUFXLEdBQUcsSUFBSSxxQkFBVyxFQUFFLENBQUM7QUFDcEMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ3hCLDJCQUEyQjtBQUMzQixXQUFXLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuLi8uLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5cclxuYWJzdHJhY3QgY2xhc3MgQ2FzZUxvZ2ljIHtcclxuXHJcbiAgICBzdGF0aWMgQkxPQ0tFRDogc3RyaW5nID0gXCJCTE9DS0VEXCI7XHJcbiAgICBzdGF0aWMgTk9STUFMOiBzdHJpbmcgPSBcIk5PUk1BTFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gcGFydHlGaWVsZCBcclxuICAgICAqIEBwYXJhbSBsaXN0T2ZDYXNlc1RlbXAgXHJcbiAgICAgKiBAcGFyYW0gZWxlbWVudFRvRmlsbCBcclxuICAgICAqIEBwYXJhbSBuYnJPZlJlbWFpbmluZ0Nhc2VzIFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcGFpbnRDYXNlKHBhcnR5RmllbGQ6IEZpZWxkLCBjYXNlVG9QYWludDogQ2FzZSwgZWxlbWVudFRvRmlsbDogSFRNTEVsZW1lbnQsIHJvdzogbnVtYmVyLCBjb2w6IG51bWJlcik6IEhUTUxEaXZFbGVtZW50IHtcclxuICAgICAgICBsZXQgZGl2RWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkaXZFbHQuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XHJcblxyXG4gICAgICAgIHN3aXRjaCAoY2FzZVRvUGFpbnQuaXNCbG9ja2VkKSB7XHJcbiAgICAgICAgICAgIGNhc2UgZmFsc2U6XHJcbiAgICAgICAgICAgICAgICBkaXZFbHQuY2xhc3NMaXN0LmFkZChcImNhc2VcIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgdHJ1ZTpcclxuICAgICAgICAgICAgICAgIGRpdkVsdC5jbGFzc0xpc3QuYWRkKFwiY2FzZVwiKTtcclxuICAgICAgICAgICAgICAgIGRpdkVsdC5jbGFzc0xpc3QuYWRkKFwiYmxvY2tlZFwiKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkaXZFbHQuaWQgPSBTdHJpbmcoY2FzZVRvUGFpbnQucG9zaXRpb25TdHJpbmcpO1xyXG5cclxuICAgICAgICBjYXNlVG9QYWludC5zZXRFbChkaXZFbHQpO1xyXG4gICAgICAgIHJldHVybiBkaXZFbHQ7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENhc2VMb2dpYzsiLCJpbXBvcnQgQ2FzZUxvZ2ljIGZyb20gXCIuLi8uLi9jYXNlL2xvZ2ljL2Nhc2VMb2dpY1wiO1xyXG5pbXBvcnQgQ29vcmQgZnJvbSBcIi4uLy4uL2Nvb3JkL21vZGVsL2Nvb3JkXCI7XHJcbmltcG9ydCBXZWFwb24gZnJvbSBcIi4uLy4uL3dlYXBvbi9tb2RlbC93ZWFwb25cIjtcclxuaW1wb3J0IExvZ2ljV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbG9naWMvbG9naWNXZWFwb25cIjtcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuLi8uLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gXCIuLi8uLi9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCBHYW1lTWFuYWdlciBmcm9tIFwiLi4vLi4vZ2FtZU1hbmFnZXJcIjtcclxuXHJcbmNsYXNzIENhc2Uge1xyXG4gICAgLy9maWVsZCBcclxuICAgIGltZ1VybDogc3RyaW5nO1xyXG4gICAgaXNCbG9ja2VkOiBib29sZWFuO1xyXG4gICAgaXNBdmFpbGFibGU6IGJvb2xlYW47XHJcbiAgICBwb3NpdGlvbjogQ29vcmQ7XHJcbiAgICBwb3NpdGlvblN0cmluZzogc3RyaW5nO1xyXG4gICAgdHlwZTogc3RyaW5nO1xyXG4gICAgd2VhcG9uOiBXZWFwb247XHJcbiAgICBnYW1lTWFuYWdlcjogR2FtZU1hbmFnZXI7XHJcbiAgICAkZWw6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgIC8vY29uc3RydWN0b3IgXHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjogQ29vcmQsIHR5cGU6IHN0cmluZyA9IENhc2VMb2dpYy5OT1JNQUwsIGlzQXZhaWxhYmxlOiBib29sZWFuID0gdHJ1ZSkge1xyXG5cclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBDYXNlTG9naWMuTk9STUFMOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbWdVcmwgPSBcIi9hc3NldHMvaW1nL25vcm1hbC1maWVsZC90aWxlLTJELnBuZ1wiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc0Jsb2NrZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBDYXNlTG9naWMuQkxPQ0tFRDpcclxuICAgICAgICAgICAgICAgIHRoaXMuaW1nVXJsID0gXCIvYXNzZXRzL2ltZy9ibG9ja2VkLWZpZWxkL3RpbGUtMkQucG5nXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzQmxvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pc0F2YWlsYWJsZSA9IGlzQXZhaWxhYmxlO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uU3RyaW5nID0gU3RyaW5nKHBvc2l0aW9uLngpICsgU3RyaW5nKHBvc2l0aW9uLnkpO1xyXG4gICAgICAgIHRoaXMud2VhcG9uID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjYXNlc0FkamFjZW50KGNhc2VUb0NoZWNrOiBDYXNlKTogQm9vbGVhbntcclxuICAgICAgICBpZih0aGlzLnBvc2l0aW9uLnggPT09IGNhc2VUb0NoZWNrLnBvc2l0aW9uLngrMSB8fCB0aGlzLnBvc2l0aW9uLnggPT09IGNhc2VUb0NoZWNrLnBvc2l0aW9uLngtMSB8fCB0aGlzLnBvc2l0aW9uLnkgPT09IGNhc2VUb0NoZWNrLnBvc2l0aW9uLnkrMSB8fCB0aGlzLnBvc2l0aW9uLnkgPT09IGNhc2VUb0NoZWNrLnBvc2l0aW9uLnktMSl7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhc1dlYXBvbigpe1xyXG4gICAgICAgIGlmKCF0aGlzLndlYXBvbiA9PT0gbnVsbCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgcmVtb3ZlV2VhcG9uKCl7XHJcbiAgICAgICAgdGhpcy53ZWFwb24gPSBudWxsO1xyXG4gICAgICAgIHRoaXMud2VhcG9uLiRlbC5yZW1vdmUoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYWRkV2VhcG9uKGZpZWxkOiBGaWVsZCwgd2VhcG9uOiBXZWFwb24pe1xyXG4gICAgICAgIHRoaXMud2VhcG9uID0gd2VhcG9uO1xyXG4gICAgICAgIExvZ2ljV2VhcG9uLnBhaW50V2VhcG9uKHRoaXMsIHdlYXBvbiwgZmllbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEVsKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogSFRNTEVsZW1lbnQge1xyXG4gICAgICAgIHRoaXMuJGVsID0gZWxlbWVudDtcclxuXHJcbiAgICAgICAgdGhpcy4kZWwub25jbGljayA9IChldmVudDogTW91c2VFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2xpY2soZXZlbnQpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLiRlbDtcclxuICAgIH1cclxuXHJcbiAgICBvbkNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZHtcclxuIFxyXG4gICAgICAgICAgICBsZXQgY2FzZXNFbGVtZW50cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Nhc2UnKTtcclxuICAgICAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5nYW1lTWFuYWdlci5maWVsZDtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2FzZXNFbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhc2VzRWxlbWVudCA9ICg8SFRNTEVsZW1lbnQ+Y2FzZXNFbGVtZW50c1tpXSk7XHJcbiAgICAgICAgICAgICAgICBjYXNlc0VsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnY2FzZS1yZWFjaGFibGUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdmFyIGVsID0gZXZlbnQudGFyZ2V0fHxldmVudC5zcmNFbGVtZW50O1xyXG4gICAgICAgICAgICBsZXQgY2FzZVRvR28gPSBmaWVsZC5jYXNlc1t0aGlzLnBvc2l0aW9uLnhdW3RoaXMucG9zaXRpb24ueV07XHJcblxyXG4gICAgICAgICAgICAvLyBEbyBub3RoaW5nIGlmIHBsYXllciBzZWxlY3QgYSBCbG9jayBDYXNlXHJcbiAgICAgICAgICAgIGlmIChjYXNlVG9Hby5pc0Jsb2NrZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZU1hbmFnZXIuc2hvd1JlYWNoYWJsZUNhc2UoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL3dlIGdldCB0aGUgZWxlbWVudCB0YXJnZXRcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZU1hbmFnZXIucGxheWVyVG91ci5tb3ZlVG8odGhpcy5nYW1lTWFuYWdlci5maWVsZCwgY2FzZVRvR28pO1xyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZU1hbmFnZXIuc2hvd1JlYWNoYWJsZUNhc2UoKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBDYXNlOyIsIlxyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4uLy4uL2ZpZWxkL21vZGVsL2ZpZWxkXCI7XHJcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4uLy4uL2NoYXJhY3Rlci9tb2RlbC9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IENhc2UgZnJvbSBcIi4uLy4uL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgQ29vcmQgZnJvbSBcIi4uLy4uL2Nvb3JkL21vZGVsL2Nvb3JkXCI7XHJcblxyXG5hYnN0cmFjdCBjbGFzcyBMb2dpY0NoYXJhY3RlciB7XHJcblxyXG4gICAgc3RhdGljIHBhaW50U3RhcnRDaGFyYWN0ZXJzKGZpZWxkOiBGaWVsZCwgbmFtZUNoYXJhY3Rlcjogc3RyaW5nLCBpY29uVXJsOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBsZXQgcGxheWVyID0gbmV3IENoYXJhY3RlcihuYW1lQ2hhcmFjdGVyLCBpY29uVXJsLCBmaWVsZC5nZXRBdmFpbGFibGVSYW5kb21DYXNlKCkpO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGZpZWxkLmNoYXJhY3RlcnNbMF0gIT09ICd1bmRlZmluZWQnKSB7XHJcblxyXG4gICAgICAgICAgICB3aGlsZShmaWVsZC5jaGFyYWN0ZXJzWzBdLmNhc2UuY2FzZXNBZGphY2VudChwbGF5ZXIuY2FzZSkpe1xyXG4gICAgICAgICAgICAgICAgcGxheWVyID0gbmV3IENoYXJhY3RlcihuYW1lQ2hhcmFjdGVyLCBpY29uVXJsLCBmaWVsZC5nZXRBdmFpbGFibGVSYW5kb21DYXNlKCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICBmaWVsZC5jYXNlc1twbGF5ZXIuY2FzZS5wb3NpdGlvbi54XVtwbGF5ZXIuY2FzZS5wb3NpdGlvbi55XS5pc0F2YWlsYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIGxldCBpbWdDaGFyOiBIVE1MSW1hZ2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgICAgICBsZXQgc3BhbkVsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG5cclxuICAgICAgICBzcGFuRWx0LmNsYXNzTGlzdC5hZGQoXCJjaGFyXCIpO1xyXG4gICAgICAgIGltZ0NoYXIuc3JjID0gcGxheWVyLmljb25Vcmw7XHJcbiAgICAgICAgaW1nQ2hhci5zdHlsZS5tYXhXaWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUubWF4SGVpZ2h0ID0gXCI4MHB4XCI7XHJcbiAgICAgICAgaW1nQ2hhci5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLnRvcCA9IFwiMFwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUubGVmdCA9IFwiMTVweFwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUuekluZGV4ID0gXCIxMFwiO1xyXG4gICAgICAgIHNwYW5FbHQuYXBwZW5kQ2hpbGQoaW1nQ2hhcik7XHJcbiAgICAgICAgbGV0IHBsYXllckRpdkVsdCA9IHBsYXllci5jYXNlLiRlbDtcclxuICAgICAgICBwbGF5ZXJEaXZFbHQuYXBwZW5kQ2hpbGQoc3BhbkVsdCk7XHJcbiAgICAgICAgcGxheWVyLiRlbCA9IHNwYW5FbHQ7XHJcbiAgICAgICAgZmllbGQuY2hhcmFjdGVycy5wdXNoKHBsYXllcik7XHJcbiAgICB9IFxyXG5cclxuICAgIHN0YXRpYyBwYWludENoYXJhY3RlcnMoZmllbGQ6IEZpZWxkLCBwbGF5ZXI6IENoYXJhY3RlciwgY2FzZVBsYXllcjogQ2FzZSk6IHZvaWQge1xyXG5cclxuICAgICAgICBcclxuICAgICAgICBsZXQgaW1nQ2hhcjogSFRNTEltYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgbGV0IHNwYW5FbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuXHJcbiAgICAgICAgc3BhbkVsdC5jbGFzc0xpc3QuYWRkKFwiY2hhclwiKTtcclxuICAgICAgICBpbWdDaGFyLnNyYyA9IHBsYXllci5pY29uVXJsO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUubWF4V2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLm1heEhlaWdodCA9IFwiODBweFwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICAgICAgaW1nQ2hhci5zdHlsZS50b3AgPSBcIjBweFwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUubGVmdCA9IFwiMTVweFwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUuekluZGV4ID0gXCIxMFwiO1xyXG4gICAgICAgIHNwYW5FbHQuYXBwZW5kQ2hpbGQoaW1nQ2hhcik7XHJcbiAgICAgICAgbGV0IHBsYXllckRpdkVsdCA9IHBsYXllci5jYXNlLiRlbDtcclxuICAgICAgICBwbGF5ZXJEaXZFbHQuYXBwZW5kQ2hpbGQoc3BhbkVsdCk7XHJcbiAgICAgICAgcGxheWVyLiRlbCA9IHNwYW5FbHQ7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMb2dpY0NoYXJhY3RlcjsiLCJpbXBvcnQgQ2FzZSBmcm9tIFwiLi4vLi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcbmltcG9ydCBXZWFwb24gZnJvbSBcIi4uLy4uL3dlYXBvbi9tb2RlbC93ZWFwb25cIjtcclxuaW1wb3J0IExvZ2ljV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbG9naWMvbG9naWNXZWFwb25cIjtcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuLi8uLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5pbXBvcnQgTG9naWNDaGFyYWN0ZXIgZnJvbSBcIi4uL2xvZ2ljL2xvZ2ljQ2hhcmFjdGVyXCI7XHJcblxyXG4vL1RoaXMgY2xhc3MgZm9yIHRoZSBmaWVsZHNcclxuY2xhc3MgQ2hhcmFjdGVyIHtcclxuICAgLy9maWVsZCBcclxuICAgbmFtZTogc3RyaW5nO1xyXG4gICBpY29uVXJsOiBzdHJpbmc7XHJcbiAgIGxpZmU6IG51bWJlcjtcclxuICAgbGV2ZWw6IG51bWJlcjtcclxuICAgY2FzZTogQ2FzZTtcclxuICAgd2VhcG9uOiBXZWFwb247XHJcbiAgICRlbDogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAvL2NvbnN0cnVjdG9yIFxyXG4gICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGljb25Vcmw6IHN0cmluZywgc3RhcnRDYXNlOiBDYXNlKSB7XHJcbiAgICAgIHRoaXMubGlmZSA9IDEwMDtcclxuICAgICAgdGhpcy5sZXZlbCA9IDU7XHJcbiAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgIHRoaXMuaWNvblVybCA9IGljb25Vcmw7XHJcbiAgICAgIHRoaXMuY2FzZSA9IHN0YXJ0Q2FzZTtcclxuICAgICAgdGhpcy53ZWFwb24gPSBuZXcgV2VhcG9uKFwiYmFzaWNXZWFwb25cIiwgNSwgXCIvYXNzZXRzL2ltZy93ZWFwb24vd2VhcG9uMS5wbmdcIik7XHJcblxyXG4gICB9XHJcblxyXG4gICB0YWtlV2VhcG9uKGZpZWxkOiBGaWVsZCl7XHJcbiAgICAgIGxldCBjYXNlV2VhcG9uID0gdGhpcy5jYXNlO1xyXG4gICAgICBsZXQgd2VhcG9uVG9Ecm9wID0gdGhpcy53ZWFwb247XHJcbiAgICAgIHRoaXMud2VhcG9uID0gdGhpcy5jYXNlLndlYXBvbjtcclxuICAgICAgLy9Mb2dpY1dlYXBvbi5wYWludFdlYXBvbihjYXNlV2VhcG9uLCB3ZWFwb25Ub0Ryb3AsIGZpZWxkKTtcclxuICAgfVxyXG5cclxuICAgaXNDYXNlUmVhY2hhYmxlKGNhc2VUb1JlYWNoOiBDYXNlKXtcclxuICAgICAgbGV0IGRlbHRhWCA9IE1hdGguYWJzKGNhc2VUb1JlYWNoLnBvc2l0aW9uLnggLSB0aGlzLmNhc2UucG9zaXRpb24ueCk7XHJcbiAgICAgIGxldCBkZWx0YVkgPSBNYXRoLmFicyhjYXNlVG9SZWFjaC5wb3NpdGlvbi55IC0gdGhpcy5jYXNlLnBvc2l0aW9uLnkpO1xyXG4gICAgICBpZiggZGVsdGFYIDw9IDMgJiYgIGRlbHRhWSA8PSAzICl7XHJcbiAgICAgICAgIGlmKGNhc2VUb1JlYWNoLnBvc2l0aW9uLnggPT09IHRoaXMuY2FzZS5wb3NpdGlvbi54IHx8IGNhc2VUb1JlYWNoLnBvc2l0aW9uLnkgPT09IHRoaXMuY2FzZS5wb3NpdGlvbi55KXtcclxuICAgICAgICAgaWYoIWNhc2VUb1JlYWNoLmlzQmxvY2tlZCl7XHJcbiAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgIH1cclxuXHJcbiAgIG1vdmVUbyhmaWVsZDogRmllbGQsIGNhc2VUb01vdmU6IENhc2Upe1xyXG4gICAgICBpZih0aGlzLmlzQ2FzZVJlYWNoYWJsZShjYXNlVG9Nb3ZlKSl7XHJcblxyXG4gICAgICAgICBsZXQgbmV4dFBsYXllckFycmF5ID0gZmllbGQuY2hhcmFjdGVycy5maWx0ZXIoKG5leHRQbGF5ZXIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIChuZXh0UGxheWVyICE9PSB0aGlzLmNhc2UuZ2FtZU1hbmFnZXIucGxheWVyVG91cik7XHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBsZXQgbmV4dFBsYXllciA9IG5leHRQbGF5ZXJBcnJheVswXTtcclxuICAgICAgICAgXHJcbiAgICAgIHRoaXMuY2FzZSA9IGNhc2VUb01vdmU7XHJcbiAgICAgIHRoaXMuJGVsLnJlbW92ZSgpO1xyXG4gICAgICBMb2dpY0NoYXJhY3Rlci5wYWludENoYXJhY3RlcnMoZmllbGQsIHRoaXMsIGNhc2VUb01vdmUpO1xyXG4gICAgICB0aGlzLmNhc2UuZ2FtZU1hbmFnZXIucGxheWVyVG91ciA9IG5leHRQbGF5ZXI7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdUaGUgcGxheWVyICcgKyB0aGlzLmNhc2UuZ2FtZU1hbmFnZXIucGxheWVyVG91ci5uYW1lICsgJyBjYW4gcGxheS4nKTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhpcyBwbGFjZSBpcyB1bnJlYWNoYWJsZSEhXCIpO1xyXG4gICAgICB9XHJcbiAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2hhcmFjdGVyOyIsIi8vVGhpcyBjbGFzcyBmb3IgdGhlIGZpZWxkc1xyXG5jbGFzcyBDb29yZCB7XHJcbiAgICAvL2ZpZWxkIFxyXG4gICAgeCA6IG51bWJlcjtcclxuICAgIHkgOiBudW1iZXI7XHJcblxyXG4gICAgLy9jb25zdHJ1Y3RvciBcclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IENvb3JkOyIsImltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuLi9tb2RlbC9maWVsZFwiO1xyXG5pbXBvcnQgQ2FzZUxvZ2ljIGZyb20gXCIuLi8uLi9jYXNlL2xvZ2ljL2Nhc2VMb2dpY1wiO1xyXG5pbXBvcnQgV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbW9kZWwvd2VhcG9uXCI7XHJcbmltcG9ydCBMb2dpY1dlYXBvbiBmcm9tIFwiLi4vLi4vd2VhcG9uL2xvZ2ljL2xvZ2ljV2VhcG9uXCI7XHJcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4uLy4uL2NoYXJhY3Rlci9tb2RlbC9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IExvZ2ljQ2hhcmFjdGVyIGZyb20gXCIuLi8uLi9jaGFyYWN0ZXIvbG9naWMvbG9naWNDaGFyYWN0ZXJcIjtcclxuaW1wb3J0IENvb3JkIGZyb20gXCIuLi8uLi9jb29yZC9tb2RlbC9jb29yZFwiO1xyXG5cclxuLy9UaGlzIGNsYXNzIHdpbGwgZ2VuZXJhdGUgYWxsIHRoZSBkaWZmZXJlbnQgb2JqZWN0cyBuZWVkZWQgZm9yIHRoZSBnYW1lXHJcbmFic3RyYWN0IGNsYXNzIExvZ2ljRmllbGQge1xyXG5cclxuICAgLyoqXHJcbiAgICAqIFxyXG4gICAgKiBAcGFyYW0geCBcclxuICAgICogQHBhcmFtIHkgXHJcbiAgICAqL1xyXG4gICBzdGF0aWMgZ2VuZXJhdGVNYXAoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBGaWVsZCB7XHJcbiAgICAgIGxldCB0b3RhbENhc2VzID0geCAqIHk7XHJcbiAgICAgIGxldCBibG9ja2VkQ2FzZXMgPSBNYXRoLnJvdW5kKHRvdGFsQ2FzZXMgLyA2KTtcclxuICAgICAgbGV0IGZpZWxkOiBGaWVsZCA9IG5ldyBGaWVsZCh4LCB5KTtcclxuXHJcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHg7IGNvbCsrKSB7XHJcbiAgICAgICAgIGZpZWxkLmNhc2VzW2NvbF0gPSBbXTtcclxuICAgICAgICAgZm9yKGxldCByb3cgPSAwOyByb3cgPCB5OyByb3crKyl7XHJcbiAgICAgICAgICAgIGxldCBwb3NpdGlvbiA9IG5ldyBDb29yZChjb2wsIHJvdyk7XHJcblxyXG4gICAgICAgICBpZiAoYmxvY2tlZENhc2VzID4gMCkge1xyXG4gICAgICAgICAgICBsZXQgYmxvY2tlZENhc2UgPSBuZXcgQ2FzZShwb3NpdGlvbiwgQ2FzZUxvZ2ljLkJMT0NLRUQpO1xyXG4gICAgICAgICAgICBmaWVsZC5jYXNlc1tjb2xdW3Jvd10gPSBibG9ja2VkQ2FzZTtcclxuICAgICAgICAgICAgYmxvY2tlZENhc2VzID0gYmxvY2tlZENhc2VzIC0gMTtcclxuICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IG5vbkJsb2NrZWRDYXNlID0gbmV3IENhc2UocG9zaXRpb24pO1xyXG4gICAgICAgICAgICBmaWVsZC5jYXNlc1tjb2xdW3Jvd10gPSBub25CbG9ja2VkQ2FzZTtcclxuICAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZmllbGQudW5zb3J0Q2FzZXMoKTtcclxuXHJcbiAgICAgIHJldHVybiBmaWVsZDtcclxuICAgfVxyXG5cclxuICAgLyoqXHJcbiAgICAqIFxyXG4gICAgKiBAcGFyYW0gZWxlbWVudFRvRmlsbCBcclxuICAgICogQHBhcmFtIGZpZWxkIFxyXG4gICAgKi9cclxuICAgc3RhdGljIHBhaW50RmllbGQoZWxlbWVudFRvRmlsbDogSFRNTEVsZW1lbnQsIGZpZWxkOiBGaWVsZCk6IHZvaWQge1xyXG5cclxuICAgICAgXHJcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGZpZWxkLnNpemUueDsgY29sKyspIHtcclxuICAgICAgICAgbGV0IHJvd0VsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgIHJvd0VsdC5zdHlsZS5oZWlnaHQgPSAoTWF0aC5yb3VuZCgxMDAgLyBmaWVsZC5zaXplLngpKSsgXCIlXCI7XHJcbiAgICAgICAgIHJvd0VsdC5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcclxuICAgICAgICAgcm93RWx0LmNsYXNzTGlzdC5hZGQoXCJyb3ctbWFwXCIpO1xyXG4gICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBmaWVsZC5zaXplLnk7IHJvdysrKXtcclxuICAgICAgICAgbGV0IGRpdkVsdCA9IENhc2VMb2dpYy5wYWludENhc2UoZmllbGQsIGZpZWxkLmNhc2VzW2NvbF1bcm93XSwgZWxlbWVudFRvRmlsbCwgcm93LCBjb2wpO1xyXG4gICAgICAgICByb3dFbHQuYXBwZW5kQ2hpbGQoZGl2RWx0KTtcclxuICAgICAgfVxyXG4gICAgICBlbGVtZW50VG9GaWxsLmFwcGVuZENoaWxkKHJvd0VsdCk7XHJcbiAgIH1cclxuICAgfVxyXG5cclxuXHJcbiAgICBzdGF0aWMgc2V0V2VhcG9uKGZpZWxkOiBGaWVsZCk6IHZvaWQge1xyXG4gICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpKyspIHtcclxuICAgICAgICAgbGV0IHdlYXBvbiA9IG5ldyBXZWFwb24oXCJNam9sbmlyXCIraSwgMTAsIFwiL2Fzc2V0cy9pbWcvd2VhcG9uL3dlYXBvbjEucG5nXCIpO1xyXG4gICAgICAgICBmaWVsZC53ZWFwb25zLnB1c2god2VhcG9uKTtcclxuICAgICAgIH1cclxuICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjsgaSsrKSB7XHJcbiAgICAgICAgIGxldCB3ZWFwb24gPSBuZXcgV2VhcG9uKFwiU3Rvcm1icmVha2VyXCIraSwgMTAsIFwiL2Fzc2V0cy9pbWcvd2VhcG9uL3dlYXBvbjIucG5nXCIpO1xyXG4gICAgICAgICBmaWVsZC53ZWFwb25zLnB1c2god2VhcG9uKTtcclxuICAgICAgIH1cclxuICAgICAgIGZvcihsZXQgd2VhcG9uIG9mIGZpZWxkLndlYXBvbnMpe1xyXG4gICAgICAgICAgTG9naWNXZWFwb24ucGFpbnRTdGFydFdlYXBvbihmaWVsZCwgd2VhcG9uKTtcclxuXHJcbiAgICAgICB9XHJcbiAgICB9IFxyXG5cclxuICAgc3RhdGljIHNldENoYXJhY3RlcnMoZmllbGQ6IEZpZWxkKTogdm9pZCB7XHJcbiAgICAgIExvZ2ljQ2hhcmFjdGVyLnBhaW50U3RhcnRDaGFyYWN0ZXJzKGZpZWxkLCBcIkV4dGVybWluYXRvclwiLCBcIi9hc3NldHMvaW1nL2NoYXJhY3RlcnMvYXZhdGFyMS5wbmdcIik7XHJcbiAgICAgIExvZ2ljQ2hhcmFjdGVyLnBhaW50U3RhcnRDaGFyYWN0ZXJzKGZpZWxkLCBcIlByZWRhdG9yXCIsIFwiL2Fzc2V0cy9pbWcvY2hhcmFjdGVycy9hdmF0YXIyLnBuZ1wiKTtcclxuICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMb2dpY0ZpZWxkOyIsImltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IENvb3JkIGZyb20gXCIuLi8uLi9jb29yZC9tb2RlbC9jb29yZFwiO1xyXG5pbXBvcnQgU2l6ZSBmcm9tIFwiLi4vLi4vc2l6ZS9tb2RlbC9zaXplXCI7XHJcbmltcG9ydCBXZWFwb24gZnJvbSBcIi4uLy4uL3dlYXBvbi9tb2RlbC93ZWFwb25cIjtcclxuaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi4vLi4vY2hhcmFjdGVyL21vZGVsL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgTG9naWNIZWxwZXIgZnJvbSBcIi4uLy4uLy4uL2hlbHBlcnMvTG9naWNIZWxwZXJcIjtcclxuXHJcblxyXG4vL1RoaXMgY2xhc3MgZm9yIHRoZSBmaWVsZHNcclxuY2xhc3MgRmllbGQge1xyXG4gICAgLy9maWVsZCBcclxuICAgIHNpemU6IFNpemU7XHJcbiAgICBjYXNlczogQ2FzZVtdW107XHJcbiAgICB3ZWFwb25zOiBXZWFwb25bXTtcclxuICAgIGNoYXJhY3RlcnM6IENoYXJhY3RlcltdO1xyXG4gICAgJGVsOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICAvL2NvbnN0cnVjdG9yIFxyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnNpemUgPSBuZXcgU2l6ZSh4LHkpO1xyXG4gICAgICAgIHRoaXMuY2FzZXMgPSBBcnJheTxBcnJheTxDYXNlPj4oKTtcclxuICAgICAgICB0aGlzLndlYXBvbnMgPSBbXTtcclxuICAgICAgICB0aGlzLmNoYXJhY3RlcnMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGNhc2VUb0FkZCBcclxuICAgICAqL1xyXG4gICAgYWRkQ2FzZShjYXNlVG9BZGQ6IENhc2VbXSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY2FzZXMucHVzaChjYXNlVG9BZGQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gaW5kaWNlQ2FzZSBcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlQ2FzZShwb3NpdGlvbjogQ29vcmQpOiB2b2lke1xyXG4gICAgICAgIHRoaXMuY2FzZXNbcG9zaXRpb24ueF0uc3BsaWNlKHBvc2l0aW9uLnksIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKi9cclxuICAgIG5ick9mQmxvY2tlZENhc2UoKTogbnVtYmVyIHtcclxuICAgICAgICBsZXQgbmJyT2ZCbG9ja2VkQ2FzZTogbnVtYmVyID0gMDtcclxuICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLnNpemUueDsgcm93KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5zaXplLnk7IGNvbCsrKXtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2FzZXNbcm93XVtjb2xdLmlzQmxvY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgbmJyT2ZCbG9ja2VkQ2FzZSA9IG5ick9mQmxvY2tlZENhc2UgKyAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgIHJldHVybiBuYnJPZkJsb2NrZWRDYXNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKi9cclxuICAgIGdldE5vbkJsb2NrZWRDYXNlcygpOiBBcnJheTxDYXNlPiB7XHJcbiAgICAgICAgbGV0IE5vbkJsb2NrZWRDYXNlczogQXJyYXk8Q2FzZT4gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLnNpemUueDsgcm93KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5zaXplLnk7IGNvbCsrKXtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNhc2VzW3Jvd11bY29sXS5pc0Jsb2NrZWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjYXNlVG9BZGQgPSB0aGlzLmNhc2VzW3Jvd11bY29sXTtcclxuICAgICAgICAgICAgICAgIE5vbkJsb2NrZWRDYXNlcy5wdXNoKGNhc2VUb0FkZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAgICAgcmV0dXJuIE5vbkJsb2NrZWRDYXNlcztcclxuICAgIH1cclxuXHJcbiAgICBnZXRCbG9ja2VkQ2FzZXMoKTogQXJyYXk8Q2FzZT4ge1xyXG4gICAgICAgIGxldCBCbG9ja2VkQ2FzZXM6IEFycmF5PENhc2U+ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5zaXplLng7IHJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuc2l6ZS55OyBjb2wrKyl7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhc2VzW3Jvd11bY29sXS5pc0Jsb2NrZWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjYXNlVG9BZGQgPSB0aGlzLmNhc2VzW3Jvd11bY29sXTtcclxuICAgICAgICAgICAgICAgIEJsb2NrZWRDYXNlcy5wdXNoKGNhc2VUb0FkZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAgICAgcmV0dXJuIEJsb2NrZWRDYXNlcztcclxuICAgIH1cclxuXHJcbiAgICBnZXRBdmFpbGFibGVDYXNlcygpOiBBcnJheTxDYXNlPiB7XHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZUNhc2VzOiBBcnJheTxDYXNlPiA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMuc2l6ZS54OyByb3crKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCB0aGlzLnNpemUueTsgY29sKyspe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYXNlc1tyb3ddW2NvbF0uaXNBdmFpbGFibGUgJiYgIXRoaXMuY2FzZXNbcm93XVtjb2xdLmlzQmxvY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhc2VUb0FkZCA9IHRoaXMuY2FzZXNbcm93XVtjb2xdO1xyXG4gICAgICAgICAgICAgICAgYXZhaWxhYmxlQ2FzZXMucHVzaChjYXNlVG9BZGQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgIHJldHVybiBhdmFpbGFibGVDYXNlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIFxyXG4gICAgICovXHJcbiAgICBnZXRDYXNlQnlQb3NpdGlvbihwb3NpdGlvbjogQ29vcmQpOiBDYXNlIHtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5jYXNlc1twb3NpdGlvbi54XVtwb3NpdGlvbi55XSk7XHJcbiAgICAgICAgaWYgKHBvc2l0aW9uID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYXNlc1twb3NpdGlvbi54XVtwb3NpdGlvbi55XTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqL1xyXG4gICAgZ2V0UmFuZG9tQ2FzZSgpOiBDYXNle1xyXG4gICAgICAgIGxldCByYW5kb21YID0gTG9naWNIZWxwZXIuZ2V0UmFuZG9tRGltZW5zaW9uKHRoaXMuc2l6ZS54LTEpO1xyXG4gICAgICAgIGxldCByYW5kb21ZID0gTG9naWNIZWxwZXIuZ2V0UmFuZG9tRGltZW5zaW9uKHRoaXMuc2l6ZS55LTEpO1xyXG5cclxuICAgICAgICBsZXQgcmFuZG9tQ29vcmQgPSBuZXcgQ29vcmQocmFuZG9tWCwgcmFuZG9tWSk7XHJcblxyXG4gICAgICAgIGxldCBjYXNlUmFuZG9tID0gdGhpcy5nZXRDYXNlQnlQb3NpdGlvbihyYW5kb21Db29yZCk7XHJcbiAgICAgICAgbGV0IGNhc2VUb0NoZWNrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FzZVJhbmRvbS5wb3NpdGlvblN0cmluZyk7XHJcbiAgICAgICAgd2hpbGUoY2FzZVRvQ2hlY2sgPT09IG51bGwgfHwgY2FzZVRvQ2hlY2sgPT09IHVuZGVmaW5lZCB8fCBjYXNlUmFuZG9tID09PSB1bmRlZmluZWQgfHwgY2FzZVJhbmRvbSA9PT0gbnVsbCl7XHJcblxyXG4gICAgICAgICAgICBsZXQgcmFuZG9tWCA9IExvZ2ljSGVscGVyLmdldFJhbmRvbURpbWVuc2lvbih0aGlzLnNpemUueC0xKTtcclxuICAgICAgICAgICAgbGV0IHJhbmRvbVkgPSBMb2dpY0hlbHBlci5nZXRSYW5kb21EaW1lbnNpb24odGhpcy5zaXplLnktMSk7XHJcbiAgICBcclxuICAgICAgICAgICAgbGV0IHJhbmRvbUNvb3JkID0gbmV3IENvb3JkKHJhbmRvbVgsIHJhbmRvbVkpO1xyXG5cclxuICAgICAgICAgICAgY2FzZVJhbmRvbSA9IHRoaXMuZ2V0Q2FzZUJ5UG9zaXRpb24ocmFuZG9tQ29vcmQpO1xyXG4gICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNhc2VSYW5kb207XHJcbiAgICB9XHJcblxyXG4gIFxyXG4gICAgZ2V0Tm9uQmxvY2tlZFJhbmRvbUNhc2UoKTogQ2FzZXtcclxuXHJcbiAgICAgICAgbGV0IG5vbkJsb2NrZWRDYXNlcyA9IHRoaXMuZ2V0Tm9uQmxvY2tlZENhc2VzKCk7XHJcblxyXG4gICAgICAgIGxldCBpbmRpY2UgPSBMb2dpY0hlbHBlci5nZXRSYW5kb21EaW1lbnNpb24obm9uQmxvY2tlZENhc2VzLmxlbmd0aC0xKTtcclxuXHJcbiAgICAgICAgbGV0IG5vbkJsb2NrZWRSYW5kb21DYXNlID0gbm9uQmxvY2tlZENhc2VzW2luZGljZV07XHJcblxyXG4gICAgICAgIHJldHVybiBub25CbG9ja2VkUmFuZG9tQ2FzZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0QXZhaWxhYmxlUmFuZG9tQ2FzZSgpOiBDYXNle1xyXG4gICAgICAgIGxldCBhdmFpbGFibGVDYXNlcyA9IHRoaXMuZ2V0QXZhaWxhYmxlQ2FzZXMoKTtcclxuXHJcbiAgICAgICAgbGV0IGluZGljZSA9IExvZ2ljSGVscGVyLmdldFJhbmRvbURpbWVuc2lvbihhdmFpbGFibGVDYXNlcy5sZW5ndGgtMSk7XHJcblxyXG4gICAgICAgIGxldCBhdmFpbGFibGVSYW5kb21DYXNlID0gYXZhaWxhYmxlQ2FzZXNbaW5kaWNlXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGF2YWlsYWJsZVJhbmRvbUNhc2U7XHJcbiAgICB9IFxyXG5cclxuXHJcbiAgICBkdXBsaWNhdGVMaXN0T2ZDYXNlKCk6IENhc2VbXXtcclxuICAgICAgICBsZXQgY2FzZXNUZW1wID0gQXJyYXk8Q2FzZT4oKTtcclxuICAgICAgICBmb3IgKGxldCByb3c9MDsgcm93IDwgdGhpcy5zaXplLng7IHJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgY29sPTA7IGNvbCA8IHRoaXMuc2l6ZS55OyBjb2wrKyl7XHJcbiAgICAgICAgICAgbGV0IGNhc2VUb0FkZCA9IHRoaXMuY2FzZXNbcm93XVtjb2xdO1xyXG4gICAgICAgICAgIGNhc2VzVGVtcC5wdXNoKGNhc2VUb0FkZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgIHJldHVybiBjYXNlc1RlbXA7XHJcbiAgICB9XHJcblxyXG4gICAgdW5zb3J0Q2FzZXMoKTogdm9pZHtcclxuICAgICAgICBsZXQgY2FzZXNUZW1wID0gdGhpcy5kdXBsaWNhdGVMaXN0T2ZDYXNlKCk7XHJcblxyXG4gICAgICAgIGZvcihsZXQgY29sID0gMDsgY29sIDwgdGhpcy5zaXplLng7IGNvbCsrKXtcclxuICAgICAgICAgICAgZm9yKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLnNpemUueTsgcm93Kyspe1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBpbmRpY2UgPSBMb2dpY0hlbHBlci5nZXRSYW5kb21EaW1lbnNpb24oY2FzZXNUZW1wLmxlbmd0aC0xKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhc2VzW2NvbF1bcm93XSA9IGNhc2VzVGVtcFtpbmRpY2VdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXNlc1tjb2xdW3Jvd10ucG9zaXRpb24ueCA9IGNvbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FzZXNbY29sXVtyb3ddLnBvc2l0aW9uLnkgPSByb3c7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhc2VzW2NvbF1bcm93XS5wb3NpdGlvblN0cmluZyA9IFN0cmluZyhjb2wpK1N0cmluZyhyb3cpO1xyXG4gICAgICAgICAgICAgICAgY2FzZXNUZW1wLnNwbGljZShpbmRpY2UsMSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldENhc2VCeUVsdChlbDogRWxlbWVudCk6IENhc2V7XHJcbiAgICAgICAgZm9yKGxldCByb3dDYXNlcyBvZiB0aGlzLmNhc2VzKXtcclxuICAgICAgICAgICAgZm9yKGxldCBjYXNlVG9HZXQgb2Ygcm93Q2FzZXMpe1xyXG4gICAgICAgICAgICAgICAgaWYoY2FzZVRvR2V0LiRlbCA9PT0gZWwpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYXNlVG9HZXQ7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRmllbGQ7IiwiaW1wb3J0IENhc2UgZnJvbSBcIi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcbmltcG9ydCBGaWVsZCBmcm9tIFwiLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5pbXBvcnQgTG9naWNGaWVsZCBmcm9tIFwiLi9maWVsZC9sb2dpYy9sb2dpY0ZpZWxkXCI7XHJcbmltcG9ydCBDYXNlTG9naWMgZnJvbSBcIi4vY2FzZS9sb2dpYy9jYXNlTG9naWNcIjtcclxuaW1wb3J0IFdlYXBvbiBmcm9tIFwiLi93ZWFwb24vbW9kZWwvd2VhcG9uXCI7XHJcbmltcG9ydCBMb2dpY1dlYXBvbiBmcm9tIFwiLi93ZWFwb24vbG9naWMvbG9naWNXZWFwb25cIjtcclxuaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCBMb2dpY0NoYXJhY3RlciBmcm9tIFwiLi9jaGFyYWN0ZXIvbG9naWMvbG9naWNDaGFyYWN0ZXJcIjtcclxuaW1wb3J0IENvb3JkIGZyb20gXCIuL2Nvb3JkL21vZGVsL2Nvb3JkXCI7XHJcblxyXG5jbGFzcyBHYW1lTWFuYWdlciB7XHJcbiAgICBmaWVsZDogRmllbGQ7XHJcbiAgICBpZDogc3RyaW5nID0gJ2ZpZ2h0JztcclxuICAgIHBsYXllcnM6IEFycmF5PENoYXJhY3Rlcj47XHJcbiAgICBwbGF5ZXJUb3VyOiBDaGFyYWN0ZXI7XHJcbiAgICBtYXhNb3ZlOiBudW1iZXIgPSAzO1xyXG5cclxuICAgICRlbDogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnBsYXllcnMgPSBuZXcgQXJyYXk8Q2hhcmFjdGVyPigpO1xyXG4gICAgICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0R2FtZU1hbmFnZXIoKXtcclxuICAgICAgICBmb3IobGV0IHJvd0ZpZWxkIG9mIHRoaXMuZmllbGQuY2FzZXMpe1xyXG4gICAgICAgICAgICBmb3IobGV0IGNhc2VUb1VwZGF0ZSBvZiByb3dGaWVsZCl7XHJcbiAgICAgICAgICAgICAgICBjYXNlVG9VcGRhdGUuZ2FtZU1hbmFnZXIgPSB0aGlzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0R2FtZSgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnc3RhcnRpbmcgZ2FtZS4uLicpO1xyXG5cclxuICAgICAgICBsZXQgZmllbGQgPSBMb2dpY0ZpZWxkLmdlbmVyYXRlTWFwKDgsIDgpO1xyXG5cclxuICAgICAgICBMb2dpY0ZpZWxkLnBhaW50RmllbGQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWdodFwiKSwgZmllbGQpO1xyXG5cclxuICAgICAgICBMb2dpY0ZpZWxkLnNldFdlYXBvbihmaWVsZCk7XHJcblxyXG4gICAgICAgIExvZ2ljRmllbGQuc2V0Q2hhcmFjdGVycyhmaWVsZCk7XHJcblxyXG4gICAgICAgIC8vIEZpcnN0IFBsYXllciBzdGFydFxyXG4gICAgICAgIHRoaXMucGxheWVyVG91ciA9IGZpZWxkLmNoYXJhY3RlcnNbMF07XHJcblxyXG4gICAgICAgIHRoaXMuZmllbGQgPSBmaWVsZDtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRHYW1lTWFuYWdlcigpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdUaGUgcGxheWVyICcgKyB0aGlzLnBsYXllclRvdXIubmFtZSArICcgY2FuIHBsYXkuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1JlYWNoYWJsZUNhc2UoKXtcclxuICAgICAgICBmb3IobGV0IGNvbD0wOyBjb2wgPCB0aGlzLmZpZWxkLnNpemUueDsgY29sKyspe1xyXG4gICAgICAgICAgICBmb3IobGV0IHJvdz0wOyByb3cgPCB0aGlzLmZpZWxkLnNpemUueTsgcm93Kyspe1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhc2VUb0NoZWNrID0gdGhpcy5maWVsZC5jYXNlc1tjb2xdW3Jvd107XHJcbiAgICAgICAgICAgICAgICBsZXQgYmxvY2tGYWNlZCA9IDA7XHJcbiAgICAgICAgICAgIGlmKHRoaXMucGxheWVyVG91ci5pc0Nhc2VSZWFjaGFibGUoY2FzZVRvQ2hlY2spID09PSB0cnVlICYmIGNhc2VUb0NoZWNrICE9PSB0aGlzLnBsYXllclRvdXIuY2FzZSl7XHJcbiAgICAgICAgICAgICAgICBjYXNlVG9DaGVjay4kZWwuY2xhc3NMaXN0LmFkZChcImNhc2UtcmVhY2hhYmxlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgXHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgR2FtZU1hbmFnZXI7IiwiLy9UaGlzIGNsYXNzIGZvciB0aGUgZmllbGRzXHJcbmNsYXNzIFNpemUge1xyXG4gICAgLy9maWVsZCBcclxuICAgIHggOiBudW1iZXI7XHJcbiAgICB5IDogbnVtYmVyO1xyXG5cclxuICAgIC8vY29uc3RydWN0b3IgXHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBTaXplOyIsImltcG9ydCBGaWVsZCBmcm9tIFwiLi4vLi4vZmllbGQvbW9kZWwvZmllbGRcIjtcclxuaW1wb3J0IFdlYXBvbiBmcm9tIFwiLi4vLi4vd2VhcG9uL21vZGVsL3dlYXBvblwiO1xyXG5pbXBvcnQgQ2FzZSBmcm9tIFwiLi4vLi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcblxyXG5cclxuYWJzdHJhY3QgY2xhc3MgTG9naWNXZWFwb24ge1xyXG5cclxuXHJcbiAgICBzdGF0aWMgcGFpbnRTdGFydFdlYXBvbihmaWVsZDogRmllbGQsIHdlYXBvbjogV2VhcG9uKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IGNhc2VXZWFwb24gPSBmaWVsZC5nZXRBdmFpbGFibGVSYW5kb21DYXNlKCk7XHJcbiAgICAgICAgbGV0IGltZ1dlYXBvbjogSFRNTEltYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgbGV0IHNwYW5FbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBzcGFuRWx0LmNsYXNzTGlzdC5hZGQoXCJ3ZWFwb25cIik7XHJcbiAgICAgICAgaW1nV2VhcG9uLnNyYyA9IHdlYXBvbi5pY29uVXJsO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS5tYXhXaWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS5tYXhIZWlnaHQgPSBcIjUwJVwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUudG9wID0gXCIzMCVcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUubGVmdCA9IFwiMFwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS56SW5kZXggPSBcIjIwXCI7XHJcbiAgICAgICAgc3BhbkVsdC5hcHBlbmRDaGlsZChpbWdXZWFwb24pO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhc2VXZWFwb24ucG9zaXRpb25TdHJpbmcpLmFwcGVuZENoaWxkKHNwYW5FbHQpO1xyXG4gICAgICAgIGZpZWxkLmNhc2VzW2Nhc2VXZWFwb24ucG9zaXRpb24ueF1bY2FzZVdlYXBvbi5wb3NpdGlvbi55XS5pc0F2YWlsYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIGZpZWxkLmNhc2VzW2Nhc2VXZWFwb24ucG9zaXRpb24ueF1bY2FzZVdlYXBvbi5wb3NpdGlvbi55XS53ZWFwb24gPSB3ZWFwb247XHJcbiAgICAgICAgd2VhcG9uLiRlbCA9IHNwYW5FbHQ7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBwYWludFdlYXBvbihjYXNlV2VhcG9uOiBDYXNlLCB3ZWFwb246IFdlYXBvbiwgZmllbGQ6IEZpZWxkKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBpbWdXZWFwb246IEhUTUxJbWFnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGxldCBzcGFuRWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgc3BhbkVsdC5jbGFzc0xpc3QuYWRkKFwid2VhcG9uXCIpO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zcmMgPSB3ZWFwb24uaWNvblVybDtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUubWF4SGVpZ2h0ID0gXCIxMDAlXCI7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS50b3AgPSBcIjBcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUubGVmdCA9IFwiMFwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS56SW5kZXggPSBcIjIwXCI7XHJcbiAgICAgICAgc3BhbkVsdC5hcHBlbmRDaGlsZChpbWdXZWFwb24pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGNhc2VXZWFwb24ucG9zaXRpb25TdHJpbmcpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhc2VXZWFwb24ucG9zaXRpb25TdHJpbmcpLmFwcGVuZENoaWxkKHNwYW5FbHQpO1xyXG4gICAgICAgIHdlYXBvbi4kZWwgPSBzcGFuRWx0O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMb2dpY1dlYXBvbjsiLCJpbXBvcnQgQ2FzZSBmcm9tIFwiLi4vLi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcblxyXG4vL1RoaXMgY2xhc3MgZm9yIHRoZSBmaWVsZHNcclxuY2xhc3MgV2VhcG9uIHtcclxuICAgLy9maWVsZCBcclxuICAgbmFtZTogc3RyaW5nO1xyXG4gICBkYW1hZ2U6IG51bWJlcjtcclxuICAgaWNvblVybDogc3RyaW5nO1xyXG4gICBjYXNlOiBDYXNlO1xyXG4gICAkZWw6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgLy9jb25zdHJ1Y3RvciBcclxuICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBkYW1hZ2U6IG51bWJlciwgaWNvblVybDogc3RyaW5nKSB7XHJcbiAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgIHRoaXMuZGFtYWdlID0gZGFtYWdlO1xyXG4gICAgICB0aGlzLmljb25VcmwgPSBpY29uVXJsO1xyXG4gICB9XHJcblxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgV2VhcG9uOyIsIlxyXG5hYnN0cmFjdCBjbGFzcyBMb2dpY0hlbHBlciB7XHJcbiAgICBzdGF0aWMgZ2V0UmFuZG9tRGltZW5zaW9uKGRpbWVuc2lvbjogbnVtYmVyKTogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSpkaW1lbnNpb24pO1xyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTG9naWNIZWxwZXI7IiwiXHJcbmltcG9ydCBDYXNlIGZyb20gXCIuL2VudGl0aWVzL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4vZW50aXRpZXMvZmllbGQvbW9kZWwvZmllbGRcIjtcclxuaW1wb3J0IExvZ2ljRmllbGQgZnJvbSBcIi4vZW50aXRpZXMvZmllbGQvbG9naWMvbG9naWNGaWVsZFwiO1xyXG5pbXBvcnQgR2FtZU1hbmFnZXIgZnJvbSBcIi4vZW50aXRpZXMvZ2FtZU1hbmFnZXJcIjtcclxuXHJcbmxldCBnYW1lTWFuYWdlciA9IG5ldyBHYW1lTWFuYWdlcigpO1xyXG5nYW1lTWFuYWdlci5zdGFydEdhbWUoKTtcclxuLy9nYW1lTWFuYWdlci5tb3ZlUGxheWVyKCk7XHJcbmdhbWVNYW5hZ2VyLnNob3dSZWFjaGFibGVDYXNlKCk7XHJcblxyXG4iXX0=
