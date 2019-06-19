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
        divElt.style.width = (Math.round(100 / partyField.size.y)) - 1 + "%";
        divElt.style.height = (Math.round(100 / partyField.size.x)) - 1 + "%";
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
        var elementToAdd = document.createElement("img");
        elementToAdd.src = caseToPaint.imgUrl;
        elementToAdd.classList.add("fond");
        elementToAdd.classList.add("img-responsive");
        elementToAdd.style.width = (Math.round(100 / partyField.size.y)) - 1 + "%";
        elementToAdd.style.height = (Math.round(100 / partyField.size.x)) - 1 + "%";
        //divElt.appendChild(elementToAdd);
        divElt.id = String(caseToPaint.positionString);
        elementToFill.appendChild(divElt);
        partyField.cases[caseToPaint.position.x][caseToPaint.position.y].$el = divElt;
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
        document.getElementById(this.positionString).removeChild(this.weapon.$el);
    };
    Case.prototype.addWeapon = function (field, weapon) {
        this.weapon = weapon;
        logicWeapon_1.default.paintWeapon(this, weapon, field);
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
        imgChar.style.top = "-25px";
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
        imgChar.style.top = "-25px";
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
        this.weapon = new weapon_1.default("basicWeapon", 5, "/assets/img/weapon/weapon1.png");
    }
    Character.prototype.takeWeapon = function (field) {
        var caseWeapon = this.case;
        var weaponToDrop = this.weapon;
        this.weapon = this.case.weapon;
        logicWeapon_1.default.paintWeapon(caseWeapon, weaponToDrop, field);
    };
    Character.prototype.isCaseReachable = function (caseToReach) {
        var deltaX = Math.abs(caseToReach.position.x - this.case.position.x);
        var deltaY = Math.abs(caseToReach.position.y - this.case.position.y);
        if (deltaX > 3 || deltaY > 3) {
            return true;
        }
        else {
            return false;
        }
    };
    Character.prototype.moveTo = function (field, caseToMove) {
        if (this.isCaseReachable(caseToMove)) {
            this.case = caseToMove;
            this.$el.remove();
            logicCharacter_1.default.paintCharacters(field, this, caseToMove);
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
            for (var row = 0; row < field.size.y; row++) {
                caseLogic_1.default.paintCase(field, field.cases[col][row], elementToFill, row, col);
            }
        }
    };
    LogicField.setWeapon = function (field) {
        for (var i = 0; i < 2; i++) {
            logicWeapon_1.default.paintStartWeapon(field, "Mjolnir", "/assets/img/weapon/weapon1.png");
        }
        for (var i = 0; i < 2; i++) {
            logicWeapon_1.default.paintStartWeapon(field, "Strombreaker", "/assets/img/weapon/weapon2.png");
        }
    };
    LogicField.setCharacters = function (field) {
        logicCharacter_1.default.paintStartCharacters(field, "Exterminator", "/assets/img/characters/avatar1.png");
        logicCharacter_1.default.paintStartCharacters(field, "Predator", "/assets/img/characters/avatar2.png");
    };
    return LogicField;
}());
exports.default = LogicField;
},{"../../case/logic/caseLogic":1,"../../case/model/case":2,"../../character/logic/logicCharacter":3,"../../coord/model/coord":5,"../../weapon/logic/logicWeapon":10,"../model/field":7}],7:[function(require,module,exports){
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
    GameManager.prototype.startGame = function () {
        console.log('starting game...');
        var field = logicField_1.default.generateMap(6, 8);
        logicField_1.default.paintField(document.getElementById("fight"), field);
        logicField_1.default.setWeapon(field);
        logicField_1.default.setCharacters(field);
        // First Player start
        this.playerTour = field.characters[0];
        console.log('The player ' + this.playerTour.name + ' can play.');
    };
    GameManager.prototype.movePlayer = function () {
        document.getElementById('fight').addEventListener('click', function (event) {
            //we get the element target
            var el = event.target || event.srcElement;
            console.log(el);
        });
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
var weapon_1 = require("../../weapon/model/weapon");
var LogicWeapon = /** @class */ (function () {
    function LogicWeapon() {
    }
    LogicWeapon.paintStartWeapon = function (field, name, iconWeapon) {
        var caseWeapon = field.getAvailableRandomCase();
        var weapon = new weapon_1.default(name, 5, iconWeapon);
        caseWeapon.addWeapon(field, weapon);
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
        document.getElementById(caseWeapon.positionString).appendChild(spanElt);
        field.cases[caseWeapon.position.x][caseWeapon.position.y].isAvailable = false;
        field.cases[caseWeapon.position.x][caseWeapon.position.y].weapon = weapon;
        weapon.$el = spanElt;
        field.weapons.push(weapon);
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
        document.getElementById(caseWeapon.positionString).appendChild(spanElt);
        weapon.$el = spanElt;
    };
    return LogicWeapon;
}());
exports.default = LogicWeapon;
},{"../../weapon/model/weapon":11}],11:[function(require,module,exports){
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
gameManager.movePlayer();
},{"./entities/gameManager":8}]},{},[13])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZW50aXRpZXMvY2FzZS9sb2dpYy9jYXNlTG9naWMudHMiLCJzcmMvZW50aXRpZXMvY2FzZS9tb2RlbC9jYXNlLnRzIiwic3JjL2VudGl0aWVzL2NoYXJhY3Rlci9sb2dpYy9sb2dpY0NoYXJhY3Rlci50cyIsInNyYy9lbnRpdGllcy9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyLnRzIiwic3JjL2VudGl0aWVzL2Nvb3JkL21vZGVsL2Nvb3JkLnRzIiwic3JjL2VudGl0aWVzL2ZpZWxkL2xvZ2ljL2xvZ2ljRmllbGQudHMiLCJzcmMvZW50aXRpZXMvZmllbGQvbW9kZWwvZmllbGQudHMiLCJzcmMvZW50aXRpZXMvZ2FtZU1hbmFnZXIudHMiLCJzcmMvZW50aXRpZXMvc2l6ZS9tb2RlbC9zaXplLnRzIiwic3JjL2VudGl0aWVzL3dlYXBvbi9sb2dpYy9sb2dpY1dlYXBvbi50cyIsInNyYy9lbnRpdGllcy93ZWFwb24vbW9kZWwvd2VhcG9uLnRzIiwic3JjL2hlbHBlcnMvTG9naWNIZWxwZXIudHMiLCJzcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDR0E7SUFBQTtJQThDQSxDQUFDO0lBekNHOzs7Ozs7T0FNRztJQUNJLG1CQUFTLEdBQWhCLFVBQWlCLFVBQWlCLEVBQUUsV0FBaUIsRUFBRSxhQUEwQixFQUFFLEdBQVcsRUFBRSxHQUFXO1FBQ3ZHLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUNyRSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLElB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O1FBQy9CLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4RSxNQUFNLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQztJQUN6QixDQUFDO0lBQ0wsa0JBQUM7QUFBRCxDQXZDQSxBQXVDQyxJQUFBO0FBRUQsa0JBQWUsV0FBVyxDQUFDOzs7O0FDNUMzQiwyQkFBMkI7QUFDM0I7SUFRRyxjQUFjO0lBQ2QsZ0JBQVksSUFBWSxFQUFFLE1BQWMsRUFBRSxPQUFlO1FBQ3RELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQzFCLENBQUM7SUFHSixhQUFDO0FBQUQsQ0FoQkEsQUFnQkMsSUFBQTtBQUVELGtCQUFlLE1BQU0sQ0FBQzs7OztBQ3BCdEI7SUFBQTtJQU1BLENBQUM7SUFMVSw4QkFBa0IsR0FBekIsVUFBMEIsU0FBaUI7UUFFdkMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBQyxTQUFTLENBQUMsQ0FBQztJQUUvQyxDQUFDO0lBQ0wsa0JBQUM7QUFBRCxDQU5BLEFBTUMsSUFBQTtBQUVELGtCQUFlLFdBQVcsQ0FBQzs7OztBQ0wzQixzREFBaUQ7QUFFakQsSUFBSSxXQUFXLEdBQUcsSUFBSSxxQkFBVyxFQUFFLENBQUM7QUFDcEMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ3hCLFdBQVcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuLi8uLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5cclxuYWJzdHJhY3QgY2xhc3MgQ2FzZUxvZ2ljIHtcclxuXHJcbiAgICBzdGF0aWMgQkxPQ0tFRDogc3RyaW5nID0gXCJCTE9DS0VEXCI7XHJcbiAgICBzdGF0aWMgTk9STUFMOiBzdHJpbmcgPSBcIk5PUk1BTFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gcGFydHlGaWVsZCBcclxuICAgICAqIEBwYXJhbSBsaXN0T2ZDYXNlc1RlbXAgXHJcbiAgICAgKiBAcGFyYW0gZWxlbWVudFRvRmlsbCBcclxuICAgICAqIEBwYXJhbSBuYnJPZlJlbWFpbmluZ0Nhc2VzIFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcGFpbnRDYXNlKHBhcnR5RmllbGQ6IEZpZWxkLCBjYXNlVG9QYWludDogQ2FzZSwgZWxlbWVudFRvRmlsbDogSFRNTEVsZW1lbnQsIHJvdzogbnVtYmVyLCBjb2w6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGxldCBkaXZFbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRpdkVsdC5zdHlsZS53aWR0aCA9IChNYXRoLnJvdW5kKDEwMCAvIHBhcnR5RmllbGQuc2l6ZS55KSkgLSAxICsgXCIlXCI7XHJcbiAgICAgICAgZGl2RWx0LnN0eWxlLmhlaWdodCA9IChNYXRoLnJvdW5kKDEwMCAvIHBhcnR5RmllbGQuc2l6ZS54KSkgLSAxICsgXCIlXCI7XHJcbiAgICAgICAgZGl2RWx0LnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGNhc2VUb1BhaW50LmlzQmxvY2tlZCkge1xyXG4gICAgICAgICAgICBjYXNlIGZhbHNlOlxyXG4gICAgICAgICAgICAgICAgZGl2RWx0LmNsYXNzTGlzdC5hZGQoXCJjYXNlXCIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIHRydWU6XHJcbiAgICAgICAgICAgICAgICBkaXZFbHQuY2xhc3NMaXN0LmFkZChcImNhc2VcIik7XHJcbiAgICAgICAgICAgICAgICBkaXZFbHQuY2xhc3NMaXN0LmFkZChcImJsb2NrZWRcIik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgbGV0IGVsZW1lbnRUb0FkZDogSFRNTEltYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcblxyXG4gICAgICAgIGVsZW1lbnRUb0FkZC5zcmMgPSBjYXNlVG9QYWludC5pbWdVcmw7XHJcbiAgICAgICAgZWxlbWVudFRvQWRkLmNsYXNzTGlzdC5hZGQoXCJmb25kXCIpO1xyXG4gICAgICAgIGVsZW1lbnRUb0FkZC5jbGFzc0xpc3QuYWRkKFwiaW1nLXJlc3BvbnNpdmVcIik7XHJcbiAgICAgICAgZWxlbWVudFRvQWRkLnN0eWxlLndpZHRoID0gKE1hdGgucm91bmQoMTAwIC8gcGFydHlGaWVsZC5zaXplLnkpKSAtIDEgKyBcIiVcIjtcclxuICAgICAgICBlbGVtZW50VG9BZGQuc3R5bGUuaGVpZ2h0ID0gKE1hdGgucm91bmQoMTAwIC8gcGFydHlGaWVsZC5zaXplLngpKSAtIDEgKyBcIiVcIjtcclxuICAgICAgICAvL2RpdkVsdC5hcHBlbmRDaGlsZChlbGVtZW50VG9BZGQpO1xyXG4gICAgICAgIGRpdkVsdC5pZCA9IFN0cmluZyhjYXNlVG9QYWludC5wb3NpdGlvblN0cmluZyk7XHJcbiAgICAgICAgZWxlbWVudFRvRmlsbC5hcHBlbmRDaGlsZChkaXZFbHQpO1xyXG4gICAgICAgIHBhcnR5RmllbGQuY2FzZXNbY2FzZVRvUGFpbnQucG9zaXRpb24ueF1bY2FzZVRvUGFpbnQucG9zaXRpb24ueV0uJGVsID0gZGl2RWx0O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDYXNlTG9naWM7IiwiaW1wb3J0IENhc2VMb2dpYyBmcm9tIFwiLi4vLi4vY2FzZS9sb2dpYy9jYXNlTG9naWNcIjtcclxuaW1wb3J0IENvb3JkIGZyb20gXCIuLi8uLi9jb29yZC9tb2RlbC9jb29yZFwiO1xyXG5pbXBvcnQgV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbW9kZWwvd2VhcG9uXCI7XHJcbmltcG9ydCBMb2dpY1dlYXBvbiBmcm9tIFwiLi4vLi4vd2VhcG9uL2xvZ2ljL2xvZ2ljV2VhcG9uXCI7XHJcbmltcG9ydCBGaWVsZCBmcm9tIFwiLi4vLi4vZmllbGQvbW9kZWwvZmllbGRcIjtcclxuXHJcbmNsYXNzIENhc2Uge1xyXG4gICAgLy9maWVsZCBcclxuICAgIGltZ1VybDogc3RyaW5nO1xyXG4gICAgaXNCbG9ja2VkOiBib29sZWFuO1xyXG4gICAgaXNBdmFpbGFibGU6IGJvb2xlYW47XHJcbiAgICBwb3NpdGlvbjogQ29vcmQ7XHJcbiAgICBwb3NpdGlvblN0cmluZzogc3RyaW5nO1xyXG4gICAgdHlwZTogc3RyaW5nO1xyXG4gICAgd2VhcG9uOiBXZWFwb247XHJcbiAgICAkZWw6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgIC8vY29uc3RydWN0b3IgXHJcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbjogQ29vcmQsIHR5cGU6IHN0cmluZyA9IENhc2VMb2dpYy5OT1JNQUwsIGlzQXZhaWxhYmxlOiBib29sZWFuID0gdHJ1ZSkge1xyXG5cclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBDYXNlTG9naWMuTk9STUFMOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbWdVcmwgPSBcIi9hc3NldHMvaW1nL25vcm1hbC1maWVsZC90aWxlLTJELnBuZ1wiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc0Jsb2NrZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBDYXNlTG9naWMuQkxPQ0tFRDpcclxuICAgICAgICAgICAgICAgIHRoaXMuaW1nVXJsID0gXCIvYXNzZXRzL2ltZy9ibG9ja2VkLWZpZWxkL3RpbGUtMkQucG5nXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzQmxvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pc0F2YWlsYWJsZSA9IGlzQXZhaWxhYmxlO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uU3RyaW5nID0gU3RyaW5nKHBvc2l0aW9uLngpICsgU3RyaW5nKHBvc2l0aW9uLnkpO1xyXG4gICAgICAgIHRoaXMud2VhcG9uID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjYXNlc0FkamFjZW50KGNhc2VUb0NoZWNrOiBDYXNlKTogQm9vbGVhbntcclxuICAgICAgICBpZih0aGlzLnBvc2l0aW9uLnggPT09IGNhc2VUb0NoZWNrLnBvc2l0aW9uLngrMSB8fCB0aGlzLnBvc2l0aW9uLnggPT09IGNhc2VUb0NoZWNrLnBvc2l0aW9uLngtMSB8fCB0aGlzLnBvc2l0aW9uLnkgPT09IGNhc2VUb0NoZWNrLnBvc2l0aW9uLnkrMSB8fCB0aGlzLnBvc2l0aW9uLnkgPT09IGNhc2VUb0NoZWNrLnBvc2l0aW9uLnktMSl7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhc1dlYXBvbigpe1xyXG4gICAgICAgIGlmKCF0aGlzLndlYXBvbiA9PT0gbnVsbCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZVdlYXBvbigpe1xyXG4gICAgICAgIHRoaXMud2VhcG9uID0gbnVsbDtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnBvc2l0aW9uU3RyaW5nKS5yZW1vdmVDaGlsZCh0aGlzLndlYXBvbi4kZWwpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhZGRXZWFwb24oZmllbGQ6IEZpZWxkLCB3ZWFwb246IFdlYXBvbil7XHJcbiAgICAgICAgdGhpcy53ZWFwb24gPSB3ZWFwb247XHJcbiAgICAgICAgTG9naWNXZWFwb24ucGFpbnRXZWFwb24odGhpcywgd2VhcG9uLCBmaWVsZCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDYXNlOyIsIlxyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4uLy4uL2ZpZWxkL21vZGVsL2ZpZWxkXCI7XHJcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4uLy4uL2NoYXJhY3Rlci9tb2RlbC9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IENhc2UgZnJvbSBcIi4uLy4uL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgQ29vcmQgZnJvbSBcIi4uLy4uL2Nvb3JkL21vZGVsL2Nvb3JkXCI7XHJcblxyXG5hYnN0cmFjdCBjbGFzcyBMb2dpY0NoYXJhY3RlciB7XHJcblxyXG4gICAgc3RhdGljIHBhaW50U3RhcnRDaGFyYWN0ZXJzKGZpZWxkOiBGaWVsZCwgbmFtZUNoYXJhY3Rlcjogc3RyaW5nLCBpY29uVXJsOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBsZXQgcGxheWVyID0gbmV3IENoYXJhY3RlcihuYW1lQ2hhcmFjdGVyLCBpY29uVXJsLCBmaWVsZC5nZXRBdmFpbGFibGVSYW5kb21DYXNlKCkpO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGZpZWxkLmNoYXJhY3RlcnNbMF0gIT09ICd1bmRlZmluZWQnKSB7XHJcblxyXG4gICAgICAgICAgICB3aGlsZShmaWVsZC5jaGFyYWN0ZXJzWzBdLmNhc2UuY2FzZXNBZGphY2VudChwbGF5ZXIuY2FzZSkpe1xyXG4gICAgICAgICAgICAgICAgcGxheWVyID0gbmV3IENoYXJhY3RlcihuYW1lQ2hhcmFjdGVyLCBpY29uVXJsLCBmaWVsZC5nZXRBdmFpbGFibGVSYW5kb21DYXNlKCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICBmaWVsZC5jYXNlc1twbGF5ZXIuY2FzZS5wb3NpdGlvbi54XVtwbGF5ZXIuY2FzZS5wb3NpdGlvbi55XS5pc0F2YWlsYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIGxldCBpbWdDaGFyOiBIVE1MSW1hZ2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgICAgICBsZXQgc3BhbkVsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG5cclxuICAgICAgICBzcGFuRWx0LmNsYXNzTGlzdC5hZGQoXCJjaGFyXCIpO1xyXG4gICAgICAgIGltZ0NoYXIuc3JjID0gcGxheWVyLmljb25Vcmw7XHJcbiAgICAgICAgaW1nQ2hhci5zdHlsZS5tYXhXaWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUubWF4SGVpZ2h0ID0gXCI4MHB4XCI7XHJcbiAgICAgICAgaW1nQ2hhci5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLnRvcCA9IFwiLTI1cHhcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLmxlZnQgPSBcIjE1cHhcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLnpJbmRleCA9IFwiMTBcIjtcclxuICAgICAgICBzcGFuRWx0LmFwcGVuZENoaWxkKGltZ0NoYXIpO1xyXG4gICAgICAgIGxldCBwbGF5ZXJEaXZFbHQgPSBwbGF5ZXIuY2FzZS4kZWw7XHJcbiAgICAgICAgcGxheWVyRGl2RWx0LmFwcGVuZENoaWxkKHNwYW5FbHQpO1xyXG4gICAgICAgIHBsYXllci4kZWwgPSBzcGFuRWx0O1xyXG4gICAgICAgIGZpZWxkLmNoYXJhY3RlcnMucHVzaChwbGF5ZXIpO1xyXG4gICAgfSBcclxuXHJcbiAgICBzdGF0aWMgcGFpbnRDaGFyYWN0ZXJzKGZpZWxkOiBGaWVsZCwgcGxheWVyOiBDaGFyYWN0ZXIsIGNhc2VQbGF5ZXI6IENhc2UpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGltZ0NoYXI6IEhUTUxJbWFnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGxldCBzcGFuRWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcblxyXG4gICAgICAgIHNwYW5FbHQuY2xhc3NMaXN0LmFkZChcImNoYXJcIik7XHJcbiAgICAgICAgaW1nQ2hhci5zcmMgPSBwbGF5ZXIuaWNvblVybDtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLm1heFdpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgICAgaW1nQ2hhci5zdHlsZS5tYXhIZWlnaHQgPSBcIjgwcHhcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUudG9wID0gXCItMjVweFwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUubGVmdCA9IFwiMTVweFwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUuekluZGV4ID0gXCIxMFwiO1xyXG4gICAgICAgIHNwYW5FbHQuYXBwZW5kQ2hpbGQoaW1nQ2hhcik7XHJcbiAgICAgICAgbGV0IHBsYXllckRpdkVsdCA9IHBsYXllci5jYXNlLiRlbDtcclxuICAgICAgICBwbGF5ZXJEaXZFbHQuYXBwZW5kQ2hpbGQoc3BhbkVsdCk7XHJcbiAgICAgICAgcGxheWVyLiRlbCA9IHNwYW5FbHQ7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMb2dpY0NoYXJhY3RlcjsiLCJpbXBvcnQgQ2FzZSBmcm9tIFwiLi4vLi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcbmltcG9ydCBXZWFwb24gZnJvbSBcIi4uLy4uL3dlYXBvbi9tb2RlbC93ZWFwb25cIjtcclxuaW1wb3J0IExvZ2ljV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbG9naWMvbG9naWNXZWFwb25cIjtcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuLi8uLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5pbXBvcnQgTG9naWNDaGFyYWN0ZXIgZnJvbSBcIi4uL2xvZ2ljL2xvZ2ljQ2hhcmFjdGVyXCI7XHJcblxyXG4vL1RoaXMgY2xhc3MgZm9yIHRoZSBmaWVsZHNcclxuY2xhc3MgQ2hhcmFjdGVyIHtcclxuICAgLy9maWVsZCBcclxuICAgbmFtZTogc3RyaW5nO1xyXG4gICBpY29uVXJsOiBzdHJpbmc7XHJcbiAgIGxpZmU6IG51bWJlcjtcclxuICAgbGV2ZWw6IG51bWJlcjtcclxuICAgY2FzZTogQ2FzZTtcclxuICAgd2VhcG9uOiBXZWFwb247XHJcbiAgICRlbDogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAvL2NvbnN0cnVjdG9yIFxyXG4gICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGljb25Vcmw6IHN0cmluZywgc3RhcnRDYXNlOiBDYXNlKSB7XHJcbiAgICAgIHRoaXMubGlmZSA9IDEwMDtcclxuICAgICAgdGhpcy5sZXZlbCA9IDU7XHJcbiAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgIHRoaXMuaWNvblVybCA9IGljb25Vcmw7XHJcbiAgICAgIHRoaXMuY2FzZSA9IHN0YXJ0Q2FzZTtcclxuICAgICAgdGhpcy53ZWFwb24gPSBuZXcgV2VhcG9uKFwiYmFzaWNXZWFwb25cIiwgNSwgXCIvYXNzZXRzL2ltZy93ZWFwb24vd2VhcG9uMS5wbmdcIik7XHJcblxyXG4gICB9XHJcblxyXG4gICB0YWtlV2VhcG9uKGZpZWxkOiBGaWVsZCl7XHJcbiAgICAgIGxldCBjYXNlV2VhcG9uID0gdGhpcy5jYXNlO1xyXG4gICAgICBsZXQgd2VhcG9uVG9Ecm9wID0gdGhpcy53ZWFwb247XHJcbiAgICAgIHRoaXMud2VhcG9uID0gdGhpcy5jYXNlLndlYXBvbjtcclxuICAgICAgTG9naWNXZWFwb24ucGFpbnRXZWFwb24oY2FzZVdlYXBvbiwgd2VhcG9uVG9Ecm9wLCBmaWVsZCk7XHJcbiAgIH1cclxuXHJcbiAgIGlzQ2FzZVJlYWNoYWJsZShjYXNlVG9SZWFjaDogQ2FzZSl7XHJcbiAgICAgIGxldCBkZWx0YVggPSBNYXRoLmFicyhjYXNlVG9SZWFjaC5wb3NpdGlvbi54IC0gdGhpcy5jYXNlLnBvc2l0aW9uLngpO1xyXG4gICAgICBsZXQgZGVsdGFZID0gTWF0aC5hYnMoY2FzZVRvUmVhY2gucG9zaXRpb24ueSAtIHRoaXMuY2FzZS5wb3NpdGlvbi55KTtcclxuICAgICAgaWYoIGRlbHRhWCA+IDMgfHwgIGRlbHRhWSA+IDMpe1xyXG4gICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICB9XHJcblxyXG4gICBtb3ZlVG8oZmllbGQ6IEZpZWxkLCBjYXNlVG9Nb3ZlOiBDYXNlKXtcclxuICAgICAgaWYodGhpcy5pc0Nhc2VSZWFjaGFibGUoY2FzZVRvTW92ZSkpe1xyXG4gICAgICAgICBcclxuICAgICAgdGhpcy5jYXNlID0gY2FzZVRvTW92ZTtcclxuICAgICAgdGhpcy4kZWwucmVtb3ZlKCk7XHJcbiAgICAgIExvZ2ljQ2hhcmFjdGVyLnBhaW50Q2hhcmFjdGVycyhmaWVsZCwgdGhpcywgY2FzZVRvTW92ZSk7XHJcblxyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICAgY29uc29sZS5sb2coXCJUaGlzIHBsYWNlIGlzIHVucmVhY2hhYmxlISFcIik7XHJcbiAgICAgIH1cclxuICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXI7IiwiLy9UaGlzIGNsYXNzIGZvciB0aGUgZmllbGRzXHJcbmNsYXNzIENvb3JkIHtcclxuICAgIC8vZmllbGQgXHJcbiAgICB4IDogbnVtYmVyO1xyXG4gICAgeSA6IG51bWJlcjtcclxuXHJcbiAgICAvL2NvbnN0cnVjdG9yIFxyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgQ29vcmQ7IiwiaW1wb3J0IENhc2UgZnJvbSBcIi4uLy4uL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4uL21vZGVsL2ZpZWxkXCI7XHJcbmltcG9ydCBDYXNlTG9naWMgZnJvbSBcIi4uLy4uL2Nhc2UvbG9naWMvY2FzZUxvZ2ljXCI7XHJcbmltcG9ydCBXZWFwb24gZnJvbSBcIi4uLy4uL3dlYXBvbi9tb2RlbC93ZWFwb25cIjtcclxuaW1wb3J0IExvZ2ljV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbG9naWMvbG9naWNXZWFwb25cIjtcclxuaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi4vLi4vY2hhcmFjdGVyL21vZGVsL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgTG9naWNDaGFyYWN0ZXIgZnJvbSBcIi4uLy4uL2NoYXJhY3Rlci9sb2dpYy9sb2dpY0NoYXJhY3RlclwiO1xyXG5pbXBvcnQgQ29vcmQgZnJvbSBcIi4uLy4uL2Nvb3JkL21vZGVsL2Nvb3JkXCI7XHJcblxyXG4vL1RoaXMgY2xhc3Mgd2lsbCBnZW5lcmF0ZSBhbGwgdGhlIGRpZmZlcmVudCBvYmplY3RzIG5lZWRlZCBmb3IgdGhlIGdhbWVcclxuYWJzdHJhY3QgY2xhc3MgTG9naWNGaWVsZCB7XHJcblxyXG4gICAvKipcclxuICAgICogXHJcbiAgICAqIEBwYXJhbSB4IFxyXG4gICAgKiBAcGFyYW0geSBcclxuICAgICovXHJcbiAgIHN0YXRpYyBnZW5lcmF0ZU1hcCh4OiBudW1iZXIsIHk6IG51bWJlcik6IEZpZWxkIHtcclxuICAgICAgbGV0IHRvdGFsQ2FzZXMgPSB4ICogeTtcclxuICAgICAgbGV0IGJsb2NrZWRDYXNlcyA9IE1hdGgucm91bmQodG90YWxDYXNlcyAvIDYpO1xyXG4gICAgICBsZXQgZmllbGQ6IEZpZWxkID0gbmV3IEZpZWxkKHgsIHkpO1xyXG5cclxuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgeDsgY29sKyspIHtcclxuICAgICAgICAgZmllbGQuY2FzZXNbY29sXSA9IFtdO1xyXG4gICAgICAgICBmb3IobGV0IHJvdyA9IDA7IHJvdyA8IHk7IHJvdysrKXtcclxuICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gbmV3IENvb3JkKGNvbCwgcm93KTtcclxuXHJcbiAgICAgICAgIGlmIChibG9ja2VkQ2FzZXMgPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBibG9ja2VkQ2FzZSA9IG5ldyBDYXNlKHBvc2l0aW9uLCBDYXNlTG9naWMuQkxPQ0tFRCk7XHJcbiAgICAgICAgICAgIGZpZWxkLmNhc2VzW2NvbF1bcm93XSA9IGJsb2NrZWRDYXNlO1xyXG4gICAgICAgICAgICBibG9ja2VkQ2FzZXMgPSBibG9ja2VkQ2FzZXMgLSAxO1xyXG4gICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgbm9uQmxvY2tlZENhc2UgPSBuZXcgQ2FzZShwb3NpdGlvbik7XHJcbiAgICAgICAgICAgIGZpZWxkLmNhc2VzW2NvbF1bcm93XSA9IG5vbkJsb2NrZWRDYXNlO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBmaWVsZC51bnNvcnRDYXNlcygpO1xyXG5cclxuICAgICAgcmV0dXJuIGZpZWxkO1xyXG4gICB9XHJcblxyXG4gICAvKipcclxuICAgICogXHJcbiAgICAqIEBwYXJhbSBlbGVtZW50VG9GaWxsIFxyXG4gICAgKiBAcGFyYW0gZmllbGQgXHJcbiAgICAqL1xyXG4gICBzdGF0aWMgcGFpbnRGaWVsZChlbGVtZW50VG9GaWxsOiBIVE1MRWxlbWVudCwgZmllbGQ6IEZpZWxkKTogdm9pZCB7XHJcblxyXG4gICAgICBcclxuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgZmllbGQuc2l6ZS54OyBjb2wrKykge1xyXG4gICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBmaWVsZC5zaXplLnk7IHJvdysrKXtcclxuICAgICAgICAgQ2FzZUxvZ2ljLnBhaW50Q2FzZShmaWVsZCwgZmllbGQuY2FzZXNbY29sXVtyb3ddLCBlbGVtZW50VG9GaWxsLCByb3csIGNvbCk7XHJcbiAgICAgIH1cclxuICAgfVxyXG4gICB9XHJcblxyXG5cclxuICAgIHN0YXRpYyBzZXRXZWFwb24oZmllbGQ6IEZpZWxkKTogdm9pZCB7XHJcbiAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKykge1xyXG4gICAgICAgICAgTG9naWNXZWFwb24ucGFpbnRTdGFydFdlYXBvbihmaWVsZCwgXCJNam9sbmlyXCIsIFwiL2Fzc2V0cy9pbWcvd2VhcG9uL3dlYXBvbjEucG5nXCIpO1xyXG4gICAgICAgfVxyXG4gICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpKyspIHtcclxuICAgICAgICAgIExvZ2ljV2VhcG9uLnBhaW50U3RhcnRXZWFwb24oZmllbGQsXCJTdHJvbWJyZWFrZXJcIiwgXCIvYXNzZXRzL2ltZy93ZWFwb24vd2VhcG9uMi5wbmdcIik7XHJcbiAgICAgICB9XHJcbiAgICB9IFxyXG5cclxuICAgc3RhdGljIHNldENoYXJhY3RlcnMoZmllbGQ6IEZpZWxkKTogdm9pZCB7XHJcbiAgICAgIExvZ2ljQ2hhcmFjdGVyLnBhaW50U3RhcnRDaGFyYWN0ZXJzKGZpZWxkLCBcIkV4dGVybWluYXRvclwiLCBcIi9hc3NldHMvaW1nL2NoYXJhY3RlcnMvYXZhdGFyMS5wbmdcIik7XHJcbiAgICAgIExvZ2ljQ2hhcmFjdGVyLnBhaW50U3RhcnRDaGFyYWN0ZXJzKGZpZWxkLCBcIlByZWRhdG9yXCIsIFwiL2Fzc2V0cy9pbWcvY2hhcmFjdGVycy9hdmF0YXIyLnBuZ1wiKTtcclxuICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMb2dpY0ZpZWxkOyIsImltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IENvb3JkIGZyb20gXCIuLi8uLi9jb29yZC9tb2RlbC9jb29yZFwiO1xyXG5pbXBvcnQgU2l6ZSBmcm9tIFwiLi4vLi4vc2l6ZS9tb2RlbC9zaXplXCI7XHJcbmltcG9ydCBXZWFwb24gZnJvbSBcIi4uLy4uL3dlYXBvbi9tb2RlbC93ZWFwb25cIjtcclxuaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi4vLi4vY2hhcmFjdGVyL21vZGVsL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgTG9naWNIZWxwZXIgZnJvbSBcIi4uLy4uLy4uL2hlbHBlcnMvTG9naWNIZWxwZXJcIjtcclxuXHJcblxyXG4vL1RoaXMgY2xhc3MgZm9yIHRoZSBmaWVsZHNcclxuY2xhc3MgRmllbGQge1xyXG4gICAgLy9maWVsZCBcclxuICAgIHNpemU6IFNpemU7XHJcbiAgICBjYXNlczogQ2FzZVtdW107XHJcbiAgICB3ZWFwb25zOiBXZWFwb25bXTtcclxuICAgIGNoYXJhY3RlcnM6IENoYXJhY3RlcltdO1xyXG4gICAgJGVsOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICAvL2NvbnN0cnVjdG9yIFxyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnNpemUgPSBuZXcgU2l6ZSh4LHkpO1xyXG4gICAgICAgIHRoaXMuY2FzZXMgPSBBcnJheTxBcnJheTxDYXNlPj4oKTtcclxuICAgICAgICB0aGlzLndlYXBvbnMgPSBbXTtcclxuICAgICAgICB0aGlzLmNoYXJhY3RlcnMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGNhc2VUb0FkZCBcclxuICAgICAqL1xyXG4gICAgYWRkQ2FzZShjYXNlVG9BZGQ6IENhc2VbXSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY2FzZXMucHVzaChjYXNlVG9BZGQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gaW5kaWNlQ2FzZSBcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlQ2FzZShwb3NpdGlvbjogQ29vcmQpOiB2b2lke1xyXG4gICAgICAgIHRoaXMuY2FzZXNbcG9zaXRpb24ueF0uc3BsaWNlKHBvc2l0aW9uLnksIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKi9cclxuICAgIG5ick9mQmxvY2tlZENhc2UoKTogbnVtYmVyIHtcclxuICAgICAgICBsZXQgbmJyT2ZCbG9ja2VkQ2FzZTogbnVtYmVyID0gMDtcclxuICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLnNpemUueDsgcm93KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5zaXplLnk7IGNvbCsrKXtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2FzZXNbcm93XVtjb2xdLmlzQmxvY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgbmJyT2ZCbG9ja2VkQ2FzZSA9IG5ick9mQmxvY2tlZENhc2UgKyAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgIHJldHVybiBuYnJPZkJsb2NrZWRDYXNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKi9cclxuICAgIGdldE5vbkJsb2NrZWRDYXNlcygpOiBBcnJheTxDYXNlPiB7XHJcbiAgICAgICAgbGV0IE5vbkJsb2NrZWRDYXNlczogQXJyYXk8Q2FzZT4gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLnNpemUueDsgcm93KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5zaXplLnk7IGNvbCsrKXtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNhc2VzW3Jvd11bY29sXS5pc0Jsb2NrZWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjYXNlVG9BZGQgPSB0aGlzLmNhc2VzW3Jvd11bY29sXTtcclxuICAgICAgICAgICAgICAgIE5vbkJsb2NrZWRDYXNlcy5wdXNoKGNhc2VUb0FkZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAgICAgcmV0dXJuIE5vbkJsb2NrZWRDYXNlcztcclxuICAgIH1cclxuXHJcbiAgICBnZXRCbG9ja2VkQ2FzZXMoKTogQXJyYXk8Q2FzZT4ge1xyXG4gICAgICAgIGxldCBCbG9ja2VkQ2FzZXM6IEFycmF5PENhc2U+ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5zaXplLng7IHJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuc2l6ZS55OyBjb2wrKyl7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhc2VzW3Jvd11bY29sXS5pc0Jsb2NrZWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjYXNlVG9BZGQgPSB0aGlzLmNhc2VzW3Jvd11bY29sXTtcclxuICAgICAgICAgICAgICAgIEJsb2NrZWRDYXNlcy5wdXNoKGNhc2VUb0FkZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAgICAgcmV0dXJuIEJsb2NrZWRDYXNlcztcclxuICAgIH1cclxuXHJcbiAgICBnZXRBdmFpbGFibGVDYXNlcygpOiBBcnJheTxDYXNlPiB7XHJcbiAgICAgICAgbGV0IGF2YWlsYWJsZUNhc2VzOiBBcnJheTxDYXNlPiA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMuc2l6ZS54OyByb3crKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCB0aGlzLnNpemUueTsgY29sKyspe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYXNlc1tyb3ddW2NvbF0uaXNBdmFpbGFibGUgJiYgIXRoaXMuY2FzZXNbcm93XVtjb2xdLmlzQmxvY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNhc2VUb0FkZCA9IHRoaXMuY2FzZXNbcm93XVtjb2xdO1xyXG4gICAgICAgICAgICAgICAgYXZhaWxhYmxlQ2FzZXMucHVzaChjYXNlVG9BZGQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgIHJldHVybiBhdmFpbGFibGVDYXNlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIFxyXG4gICAgICovXHJcbiAgICBnZXRDYXNlQnlQb3NpdGlvbihwb3NpdGlvbjogQ29vcmQpOiBDYXNlIHtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5jYXNlc1twb3NpdGlvbi54XVtwb3NpdGlvbi55XSk7XHJcbiAgICAgICAgaWYgKHBvc2l0aW9uID09PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYXNlc1twb3NpdGlvbi54XVtwb3NpdGlvbi55XTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqL1xyXG4gICAgZ2V0UmFuZG9tQ2FzZSgpOiBDYXNle1xyXG4gICAgICAgIGxldCByYW5kb21YID0gTG9naWNIZWxwZXIuZ2V0UmFuZG9tRGltZW5zaW9uKHRoaXMuc2l6ZS54LTEpO1xyXG4gICAgICAgIGxldCByYW5kb21ZID0gTG9naWNIZWxwZXIuZ2V0UmFuZG9tRGltZW5zaW9uKHRoaXMuc2l6ZS55LTEpO1xyXG5cclxuICAgICAgICBsZXQgcmFuZG9tQ29vcmQgPSBuZXcgQ29vcmQocmFuZG9tWCwgcmFuZG9tWSk7XHJcblxyXG4gICAgICAgIGxldCBjYXNlUmFuZG9tID0gdGhpcy5nZXRDYXNlQnlQb3NpdGlvbihyYW5kb21Db29yZCk7XHJcbiAgICAgICAgbGV0IGNhc2VUb0NoZWNrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FzZVJhbmRvbS5wb3NpdGlvblN0cmluZyk7XHJcbiAgICAgICAgd2hpbGUoY2FzZVRvQ2hlY2sgPT09IG51bGwgfHwgY2FzZVRvQ2hlY2sgPT09IHVuZGVmaW5lZCB8fCBjYXNlUmFuZG9tID09PSB1bmRlZmluZWQgfHwgY2FzZVJhbmRvbSA9PT0gbnVsbCl7XHJcblxyXG4gICAgICAgICAgICBsZXQgcmFuZG9tWCA9IExvZ2ljSGVscGVyLmdldFJhbmRvbURpbWVuc2lvbih0aGlzLnNpemUueC0xKTtcclxuICAgICAgICAgICAgbGV0IHJhbmRvbVkgPSBMb2dpY0hlbHBlci5nZXRSYW5kb21EaW1lbnNpb24odGhpcy5zaXplLnktMSk7XHJcbiAgICBcclxuICAgICAgICAgICAgbGV0IHJhbmRvbUNvb3JkID0gbmV3IENvb3JkKHJhbmRvbVgsIHJhbmRvbVkpO1xyXG5cclxuICAgICAgICAgICAgY2FzZVJhbmRvbSA9IHRoaXMuZ2V0Q2FzZUJ5UG9zaXRpb24ocmFuZG9tQ29vcmQpO1xyXG4gICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNhc2VSYW5kb207XHJcbiAgICB9XHJcblxyXG4gIFxyXG4gICAgZ2V0Tm9uQmxvY2tlZFJhbmRvbUNhc2UoKTogQ2FzZXtcclxuXHJcbiAgICAgICAgbGV0IG5vbkJsb2NrZWRDYXNlcyA9IHRoaXMuZ2V0Tm9uQmxvY2tlZENhc2VzKCk7XHJcblxyXG4gICAgICAgIGxldCBpbmRpY2UgPSBMb2dpY0hlbHBlci5nZXRSYW5kb21EaW1lbnNpb24obm9uQmxvY2tlZENhc2VzLmxlbmd0aC0xKTtcclxuXHJcbiAgICAgICAgbGV0IG5vbkJsb2NrZWRSYW5kb21DYXNlID0gbm9uQmxvY2tlZENhc2VzW2luZGljZV07XHJcblxyXG4gICAgICAgIHJldHVybiBub25CbG9ja2VkUmFuZG9tQ2FzZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZ2V0QXZhaWxhYmxlUmFuZG9tQ2FzZSgpOiBDYXNle1xyXG4gICAgICAgIGxldCBhdmFpbGFibGVDYXNlcyA9IHRoaXMuZ2V0QXZhaWxhYmxlQ2FzZXMoKTtcclxuXHJcbiAgICAgICAgbGV0IGluZGljZSA9IExvZ2ljSGVscGVyLmdldFJhbmRvbURpbWVuc2lvbihhdmFpbGFibGVDYXNlcy5sZW5ndGgtMSk7XHJcblxyXG4gICAgICAgIGxldCBhdmFpbGFibGVSYW5kb21DYXNlID0gYXZhaWxhYmxlQ2FzZXNbaW5kaWNlXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGF2YWlsYWJsZVJhbmRvbUNhc2U7XHJcbiAgICB9IFxyXG5cclxuXHJcbiAgICBkdXBsaWNhdGVMaXN0T2ZDYXNlKCk6IENhc2VbXXtcclxuICAgICAgICBsZXQgY2FzZXNUZW1wID0gQXJyYXk8Q2FzZT4oKTtcclxuICAgICAgICBmb3IgKGxldCByb3c9MDsgcm93IDwgdGhpcy5zaXplLng7IHJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvcihsZXQgY29sPTA7IGNvbCA8IHRoaXMuc2l6ZS55OyBjb2wrKyl7XHJcbiAgICAgICAgICAgbGV0IGNhc2VUb0FkZCA9IHRoaXMuY2FzZXNbcm93XVtjb2xdO1xyXG4gICAgICAgICAgIGNhc2VzVGVtcC5wdXNoKGNhc2VUb0FkZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgIHJldHVybiBjYXNlc1RlbXA7XHJcbiAgICB9XHJcblxyXG4gICAgdW5zb3J0Q2FzZXMoKTogdm9pZHtcclxuICAgICAgICBsZXQgY2FzZXNUZW1wID0gdGhpcy5kdXBsaWNhdGVMaXN0T2ZDYXNlKCk7XHJcblxyXG4gICAgICAgIGZvcihsZXQgY29sID0gMDsgY29sIDwgdGhpcy5zaXplLng7IGNvbCsrKXtcclxuICAgICAgICAgICAgZm9yKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLnNpemUueTsgcm93Kyspe1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBpbmRpY2UgPSBMb2dpY0hlbHBlci5nZXRSYW5kb21EaW1lbnNpb24oY2FzZXNUZW1wLmxlbmd0aC0xKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhc2VzW2NvbF1bcm93XSA9IGNhc2VzVGVtcFtpbmRpY2VdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXNlc1tjb2xdW3Jvd10ucG9zaXRpb24ueCA9IGNvbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FzZXNbY29sXVtyb3ddLnBvc2l0aW9uLnkgPSByb3c7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhc2VzW2NvbF1bcm93XS5wb3NpdGlvblN0cmluZyA9IFN0cmluZyhjb2wpK1N0cmluZyhyb3cpO1xyXG4gICAgICAgICAgICAgICAgY2FzZXNUZW1wLnNwbGljZShpbmRpY2UsMSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBGaWVsZDsiLCJpbXBvcnQgQ2FzZSBmcm9tIFwiLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuL2ZpZWxkL21vZGVsL2ZpZWxkXCI7XHJcbmltcG9ydCBMb2dpY0ZpZWxkIGZyb20gXCIuL2ZpZWxkL2xvZ2ljL2xvZ2ljRmllbGRcIjtcclxuaW1wb3J0IENhc2VMb2dpYyBmcm9tIFwiLi9jYXNlL2xvZ2ljL2Nhc2VMb2dpY1wiO1xyXG5pbXBvcnQgV2VhcG9uIGZyb20gXCIuL3dlYXBvbi9tb2RlbC93ZWFwb25cIjtcclxuaW1wb3J0IExvZ2ljV2VhcG9uIGZyb20gXCIuL3dlYXBvbi9sb2dpYy9sb2dpY1dlYXBvblwiO1xyXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gXCIuL2NoYXJhY3Rlci9tb2RlbC9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IExvZ2ljQ2hhcmFjdGVyIGZyb20gXCIuL2NoYXJhY3Rlci9sb2dpYy9sb2dpY0NoYXJhY3RlclwiO1xyXG5pbXBvcnQgQ29vcmQgZnJvbSBcIi4vY29vcmQvbW9kZWwvY29vcmRcIjtcclxuXHJcbmNsYXNzIEdhbWVNYW5hZ2VyIHtcclxuICAgIGZpZWxkOiBGaWVsZDtcclxuICAgIGlkOiBzdHJpbmcgPSAnZmlnaHQnO1xyXG4gICAgcGxheWVyczogQXJyYXk8Q2hhcmFjdGVyPjtcclxuICAgIHBsYXllclRvdXI6IENoYXJhY3RlcjtcclxuICAgIG1heE1vdmU6IG51bWJlciA9IDM7XHJcblxyXG4gICAgJGVsOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMucGxheWVycyA9IG5ldyBBcnJheTxDaGFyYWN0ZXI+KCk7XHJcbiAgICAgICAgdGhpcy4kZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydEdhbWUoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3N0YXJ0aW5nIGdhbWUuLi4nKTtcclxuXHJcbiAgICAgICAgbGV0IGZpZWxkID0gTG9naWNGaWVsZC5nZW5lcmF0ZU1hcCg2LCA4KTtcclxuXHJcbiAgICAgICAgTG9naWNGaWVsZC5wYWludEZpZWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlnaHRcIiksIGZpZWxkKTtcclxuXHJcbiAgICAgICAgTG9naWNGaWVsZC5zZXRXZWFwb24oZmllbGQpO1xyXG5cclxuICAgICAgICBMb2dpY0ZpZWxkLnNldENoYXJhY3RlcnMoZmllbGQpO1xyXG5cclxuICAgICAgICAvLyBGaXJzdCBQbGF5ZXIgc3RhcnRcclxuICAgICAgICB0aGlzLnBsYXllclRvdXIgPSBmaWVsZC5jaGFyYWN0ZXJzWzBdO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygnVGhlIHBsYXllciAnICsgdGhpcy5wbGF5ZXJUb3VyLm5hbWUgKyAnIGNhbiBwbGF5LicpO1xyXG4gICAgfVxyXG5cclxuICAgIG1vdmVQbGF5ZXIoKTogdm9pZHtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpZ2h0JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBldmVudCA9PiB7XHJcbiBcclxuICAgICAgICAgICAgLy93ZSBnZXQgdGhlIGVsZW1lbnQgdGFyZ2V0XHJcbiAgICAgICAgICAgIHZhciBlbD0gZXZlbnQudGFyZ2V0fHxldmVudC5zcmNFbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVsKTtcclxuICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBcclxufVxyXG5leHBvcnQgZGVmYXVsdCBHYW1lTWFuYWdlcjsiLCIvL1RoaXMgY2xhc3MgZm9yIHRoZSBmaWVsZHNcclxuY2xhc3MgU2l6ZSB7XHJcbiAgICAvL2ZpZWxkIFxyXG4gICAgeCA6IG51bWJlcjtcclxuICAgIHkgOiBudW1iZXI7XHJcblxyXG4gICAgLy9jb25zdHJ1Y3RvciBcclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFNpemU7IiwiaW1wb3J0IEZpZWxkIGZyb20gXCIuLi8uLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5pbXBvcnQgV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbW9kZWwvd2VhcG9uXCI7XHJcbmltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuXHJcblxyXG5hYnN0cmFjdCBjbGFzcyBMb2dpY1dlYXBvbiB7XHJcblxyXG5cclxuICAgIHN0YXRpYyBwYWludFN0YXJ0V2VhcG9uKGZpZWxkOiBGaWVsZCxuYW1lOiBzdHJpbmcsIGljb25XZWFwb246IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGxldCBjYXNlV2VhcG9uID0gZmllbGQuZ2V0QXZhaWxhYmxlUmFuZG9tQ2FzZSgpO1xyXG4gICAgICAgIGxldCB3ZWFwb24gPSBuZXcgV2VhcG9uKG5hbWUsIDUsIGljb25XZWFwb24pO1xyXG4gICAgICAgIGNhc2VXZWFwb24uYWRkV2VhcG9uKGZpZWxkLCB3ZWFwb24pO1xyXG4gICAgICAgIGxldCBpbWdXZWFwb246IEhUTUxJbWFnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGxldCBzcGFuRWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgc3BhbkVsdC5jbGFzc0xpc3QuYWRkKFwid2VhcG9uXCIpO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zcmMgPSB3ZWFwb24uaWNvblVybDtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUubWF4SGVpZ2h0ID0gXCIxMDAlXCI7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS50b3AgPSBcIjBcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUubGVmdCA9IFwiMFwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS56SW5kZXggPSBcIjIwXCI7XHJcbiAgICAgICAgc3BhbkVsdC5hcHBlbmRDaGlsZChpbWdXZWFwb24pO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhc2VXZWFwb24ucG9zaXRpb25TdHJpbmcpLmFwcGVuZENoaWxkKHNwYW5FbHQpO1xyXG4gICAgICAgIGZpZWxkLmNhc2VzW2Nhc2VXZWFwb24ucG9zaXRpb24ueF1bY2FzZVdlYXBvbi5wb3NpdGlvbi55XS5pc0F2YWlsYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIGZpZWxkLmNhc2VzW2Nhc2VXZWFwb24ucG9zaXRpb24ueF1bY2FzZVdlYXBvbi5wb3NpdGlvbi55XS53ZWFwb24gPSB3ZWFwb247XHJcbiAgICAgICAgd2VhcG9uLiRlbCA9IHNwYW5FbHQ7XHJcbiAgICAgICAgZmllbGQud2VhcG9ucy5wdXNoKHdlYXBvbik7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHN0YXRpYyBwYWludFdlYXBvbihjYXNlV2VhcG9uOiBDYXNlLCB3ZWFwb246IFdlYXBvbiwgZmllbGQ6IEZpZWxkKTogdm9pZCB7XHJcblxyXG4gICAgICAgIGxldCBpbWdXZWFwb246IEhUTUxJbWFnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGxldCBzcGFuRWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgc3BhbkVsdC5jbGFzc0xpc3QuYWRkKFwid2VhcG9uXCIpO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zcmMgPSB3ZWFwb24uaWNvblVybDtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUubWF4SGVpZ2h0ID0gXCIxMDAlXCI7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS50b3AgPSBcIjBcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUubGVmdCA9IFwiMFwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS56SW5kZXggPSBcIjIwXCI7XHJcbiAgICAgICAgc3BhbkVsdC5hcHBlbmRDaGlsZChpbWdXZWFwb24pO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhc2VXZWFwb24ucG9zaXRpb25TdHJpbmcpLmFwcGVuZENoaWxkKHNwYW5FbHQpO1xyXG4gICAgICAgIHdlYXBvbi4kZWwgPSBzcGFuRWx0O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMb2dpY1dlYXBvbjsiLCJpbXBvcnQgQ2FzZSBmcm9tIFwiLi4vLi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcblxyXG4vL1RoaXMgY2xhc3MgZm9yIHRoZSBmaWVsZHNcclxuY2xhc3MgV2VhcG9uIHtcclxuICAgLy9maWVsZCBcclxuICAgbmFtZTogc3RyaW5nO1xyXG4gICBkYW1hZ2U6IG51bWJlcjtcclxuICAgaWNvblVybDogc3RyaW5nO1xyXG4gICBjYXNlOiBDYXNlO1xyXG4gICAkZWw6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgLy9jb25zdHJ1Y3RvciBcclxuICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBkYW1hZ2U6IG51bWJlciwgaWNvblVybDogc3RyaW5nKSB7XHJcbiAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgIHRoaXMuZGFtYWdlID0gZGFtYWdlO1xyXG4gICAgICB0aGlzLmljb25VcmwgPSBpY29uVXJsO1xyXG4gICB9XHJcblxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgV2VhcG9uOyIsIlxyXG5hYnN0cmFjdCBjbGFzcyBMb2dpY0hlbHBlciB7XHJcbiAgICBzdGF0aWMgZ2V0UmFuZG9tRGltZW5zaW9uKGRpbWVuc2lvbjogbnVtYmVyKTogbnVtYmVyIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSpkaW1lbnNpb24pO1xyXG5cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTG9naWNIZWxwZXI7IiwiXHJcbmltcG9ydCBDYXNlIGZyb20gXCIuL2VudGl0aWVzL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4vZW50aXRpZXMvZmllbGQvbW9kZWwvZmllbGRcIjtcclxuaW1wb3J0IExvZ2ljRmllbGQgZnJvbSBcIi4vZW50aXRpZXMvZmllbGQvbG9naWMvbG9naWNGaWVsZFwiO1xyXG5pbXBvcnQgR2FtZU1hbmFnZXIgZnJvbSBcIi4vZW50aXRpZXMvZ2FtZU1hbmFnZXJcIjtcclxuXHJcbmxldCBnYW1lTWFuYWdlciA9IG5ldyBHYW1lTWFuYWdlcigpO1xyXG5nYW1lTWFuYWdlci5zdGFydEdhbWUoKTtcclxuZ2FtZU1hbmFnZXIubW92ZVBsYXllcigpO1xyXG5cclxuIl19
