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
        divElt.style.display = "inline";
        divElt.style.width = (Math.round(100 / partyField.size.y)) - 1 + "%";
        divElt.style.height = (Math.round(100 / partyField.size.x)) - 1 + "%";
        divElt.style.position = "relative";
        var elementToAdd = document.createElement("img");
        elementToAdd.src = caseToPaint.imgUrl;
        elementToAdd.classList.add("fond");
        elementToAdd.classList.add("img-responsive");
        elementToAdd.style.width = (Math.round(100 / partyField.size.y)) - 1 + "%";
        elementToAdd.style.height = (Math.round(100 / partyField.size.x)) - 1 + "%";
        divElt.appendChild(elementToAdd);
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
    }
    Case.prototype.casesAdjacent = function (caseToCheck) {
        if (this.position.x === caseToCheck.position.x + 1 || this.position.x === caseToCheck.position.x - 1 || this.position.y === caseToCheck.position.y + 1 || this.position.y === caseToCheck.position.y - 1) {
            return true;
        }
        else {
            return false;
        }
    };
    return Case;
}());
exports.default = Case;
},{"../../case/logic/caseLogic":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var character_1 = require("../../character/model/character");
var LogicCharacter = /** @class */ (function () {
    function LogicCharacter() {
    }
    LogicCharacter.paintCharacters = function (field, nameCharacter, iconUrl) {
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
    return LogicCharacter;
}());
exports.default = LogicCharacter;
},{"../../character/model/character":4}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//This class for the fields
var Character = /** @class */ (function () {
    //constructor 
    function Character(name, iconUrl, startCase) {
        this.life = 100;
        this.level = 5;
        this.name = name;
        this.iconUrl = iconUrl;
        this.case = startCase;
    }
    return Character;
}());
exports.default = Character;
},{}],5:[function(require,module,exports){
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
            logicWeapon_1.default.paintWeapon(field, "Mjolnir", "/assets/img/weapon/weapon1.png");
        }
        for (var i = 0; i < 2; i++) {
            logicWeapon_1.default.paintWeapon(field, "Strombreaker", "/assets/img/weapon/weapon2.png");
        }
    };
    LogicField.setCharacters = function (field) {
        logicCharacter_1.default.paintCharacters(field, "Exterminator", "/assets/img/characters/avatar1.png");
        logicCharacter_1.default.paintCharacters(field, "Predator", "/assets/img/characters/avatar2.png");
    };
    return LogicField;
}());
exports.default = LogicField;
},{"../../case/logic/caseLogic":1,"../../case/model/case":2,"../../character/logic/logicCharacter":3,"../../coord/model/coord":5,"../../weapon/logic/logicWeapon":9,"../model/field":7}],7:[function(require,module,exports){
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
},{"../../../helpers/LogicHelper":11,"../../coord/model/coord":5,"../../size/model/size":8}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var weapon_1 = require("../../weapon/model/weapon");
var LogicWeapon = /** @class */ (function () {
    function LogicWeapon() {
    }
    LogicWeapon.paintWeapon = function (field, name, iconWeapon) {
        var caseWeapon = field.getAvailableRandomCase();
        var weapon = new weapon_1.default(name, 5, iconWeapon, caseWeapon);
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
        weapon.$el = spanElt;
        field.weapons.push(weapon);
    };
    return LogicWeapon;
}());
exports.default = LogicWeapon;
},{"../../weapon/model/weapon":10}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//This class for the fields
var Weapon = /** @class */ (function () {
    //constructor 
    function Weapon(name, damage, iconUrl, weaponCase) {
        this.name = name;
        this.damage = damage;
        this.iconUrl = iconUrl;
        this.case = weaponCase;
    }
    return Weapon;
}());
exports.default = Weapon;
},{}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logicField_1 = require("./entities/field/logic/logicField");
var fieldForGame = logicField_1.default.generateMap(6, 8);
logicField_1.default.paintField(document.getElementById("fight"), fieldForGame);
logicField_1.default.setWeapon(fieldForGame);
logicField_1.default.setCharacters(fieldForGame);
},{"./entities/field/logic/logicField":6}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZW50aXRpZXMvY2FzZS9sb2dpYy9jYXNlTG9naWMudHMiLCJzcmMvZW50aXRpZXMvY2FzZS9tb2RlbC9jYXNlLnRzIiwic3JjL2VudGl0aWVzL2NoYXJhY3Rlci9sb2dpYy9sb2dpY0NoYXJhY3Rlci50cyIsInNyYy9lbnRpdGllcy9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyLnRzIiwic3JjL2VudGl0aWVzL2Nvb3JkL21vZGVsL2Nvb3JkLnRzIiwic3JjL2VudGl0aWVzL2ZpZWxkL2xvZ2ljL2xvZ2ljRmllbGQudHMiLCJzcmMvZW50aXRpZXMvZmllbGQvbW9kZWwvZmllbGQudHMiLCJzcmMvZW50aXRpZXMvc2l6ZS9tb2RlbC9zaXplLnRzIiwic3JjL2VudGl0aWVzL3dlYXBvbi9sb2dpYy9sb2dpY1dlYXBvbi50cyIsInNyYy9lbnRpdGllcy93ZWFwb24vbW9kZWwvd2VhcG9uLnRzIiwic3JjL2hlbHBlcnMvTG9naWNIZWxwZXIudHMiLCJzcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDR0E7SUFBQTtJQWtDQSxDQUFDO0lBN0JHOzs7Ozs7T0FNRztJQUNJLG1CQUFTLEdBQWhCLFVBQWlCLFVBQWlCLEVBQUUsV0FBaUIsRUFBRSxhQUEwQixFQUFFLEdBQVcsRUFBRSxHQUFXO1FBQ3ZHLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDckUsTUFBTSxDQUFDLEtBQUssQ0FBQyxN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LENBQUM7SUFDTCxrQkFBQztBQUFELENBTkEsQUFNQyxJQUFBO0FBRUQsa0JBQWUsV0FBVyxDQUFDOzs7O0FDTjNCLGdFQUEyRDtBQUUzRCxJQUFJLFlBQVksR0FBRyxvQkFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFFaEQsb0JBQVUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUV0RSxvQkFBVSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUVuQyxvQkFBVSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuLi8uLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5cclxuYWJzdHJhY3QgY2xhc3MgQ2FzZUxvZ2ljIHtcclxuXHJcbiAgICBzdGF0aWMgQkxPQ0tFRDogc3RyaW5nID0gXCJCTE9DS0VEXCI7XHJcbiAgICBzdGF0aWMgTk9STUFMOiBzdHJpbmcgPSBcIk5PUk1BTFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gcGFydHlGaWVsZCBcclxuICAgICAqIEBwYXJhbSBsaXN0T2ZDYXNlc1RlbXAgXHJcbiAgICAgKiBAcGFyYW0gZWxlbWVudFRvRmlsbCBcclxuICAgICAqIEBwYXJhbSBuYnJPZlJlbWFpbmluZ0Nhc2VzIFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcGFpbnRDYXNlKHBhcnR5RmllbGQ6IEZpZWxkLCBjYXNlVG9QYWludDogQ2FzZSwgZWxlbWVudFRvRmlsbDogSFRNTEVsZW1lbnQsIHJvdzogbnVtYmVyLCBjb2w6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGxldCBkaXZFbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIGRpdkVsdC5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcclxuICAgICAgICBkaXZFbHQuc3R5bGUud2lkdGggPSAoTWF0aC5yb3VuZCgxMDAgLyBwYXJ0eUZpZWxkLnNpemUueSkpIC0gMSArIFwiJVwiO1xyXG4gICAgICAgIGRpdkVsdC5zdHlsZS5oZWlnaHQgPSAoTWF0aC5yb3VuZCgxMDAgLyBwYXJ0eUZpZWxkLnNpemUueCkpIC0gMSArIFwiJVwiO1xyXG4gICAgICAgIGRpdkVsdC5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcclxuICAgICAgICBsZXQgZWxlbWVudFRvQWRkOiBIVE1MSW1hZ2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuXHJcblxyXG4gICAgICAgIGVsZW1lbnRUb0FkZC5zcmMgPSBjYXNlVG9QYWludC5pbWdVcmw7XHJcbiAgICAgICAgZWxlbWVudFRvQWRkLmNsYXNzTGlzdC5hZGQoXCJmb25kXCIpO1xyXG4gICAgICAgIGVsZW1lbnRUb0FkZC5jbGFzc0xpc3QuYWRkKFwiaW1nLXJlc3BvbnNpdmVcIik7XHJcbiAgICAgICAgZWxlbWVudFRvQWRkLnN0eWxlLndpZHRoID0gKE1hdGgucm91bmQoMTAwIC8gcGFydHlGaWVsZC5zaXplLnkpKSAtIDEgKyBcIiVcIjtcclxuICAgICAgICBlbGVtZW50VG9BZGQuc3R5bGUuaGVpZ2h0ID0gKE1hdGgucm91bmQoMTAwIC8gcGFydHlGaWVsZC5zaXplLngpKSAtIDEgKyBcIiVcIjtcclxuICAgICAgICBkaXZFbHQuYXBwZW5kQ2hpbGQoZWxlbWVudFRvQWRkKTtcclxuICAgICAgICBkaXZFbHQuaWQgPSBTdHJpbmcoY2FzZVRvUGFpbnQucG9zaXRpb25TdHJpbmcpO1xyXG4gICAgICAgIGVsZW1lbnRUb0ZpbGwuYXBwZW5kQ2hpbGQoZGl2RWx0KTtcclxuICAgICAgICBwYXJ0eUZpZWxkLmNhc2VzW2Nhc2VUb1BhaW50LnBvc2l0aW9uLnhdW2Nhc2VUb1BhaW50LnBvc2l0aW9uLnldLiRlbCA9IGRpdkVsdDtcclxuICAgIH1cclxuXHJcblxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2FzZUxvZ2ljOyIsImltcG9ydCBDYXNlTG9naWMgZnJvbSBcIi4uLy4uL2Nhc2UvbG9naWMvY2FzZUxvZ2ljXCI7XHJcbmltcG9ydCBDb29yZCBmcm9tIFwiLi4vLi4vY29vcmQvbW9kZWwvY29vcmRcIjtcclxuXHJcbmNsYXNzIENhc2Uge1xyXG4gICAgLy9maWVsZCBcclxuICAgIGltZ1VybDogc3RyaW5nO1xyXG4gICAgaXNCbG9ja2VkOiBib29sZWFuO1xyXG4gICAgaXNBdmFpbGFibGU6IGJvb2xlYW47XHJcbiAgICBwb3NpdGlvbjogQ29vcmQ7XHJcbiAgICBwb3NpdGlvblN0cmluZzogc3RyaW5nO1xyXG4gICAgdHlwZTogc3RyaW5nO1xyXG4gICAgJGVsOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICAvL2NvbnN0cnVjdG9yIFxyXG4gICAgY29uc3RydWN0b3IocG9zaXRpb246IENvb3JkLCB0eXBlOiBzdHJpbmcgPSBDYXNlTG9naWMuTk9STUFMLCBpc0F2YWlsYWJsZTogYm9vbGVhbiA9IHRydWUpIHtcclxuXHJcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgQ2FzZUxvZ2ljLk5PUk1BTDpcclxuICAgICAgICAgICAgICAgIHRoaXMuaW1nVXJsID0gXCIvYXNzZXRzL2ltZy9ub3JtYWwtZmllbGQvdGlsZS0yRC5wbmdcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNCbG9ja2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgQ2FzZUxvZ2ljLkJMT0NLRUQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmltZ1VybCA9IFwiL2Fzc2V0cy9pbWcvYmxvY2tlZC1maWVsZC90aWxlLTJELnBuZ1wiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc0Jsb2NrZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaXNBdmFpbGFibGUgPSBpc0F2YWlsYWJsZTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvblN0cmluZyA9IFN0cmluZyhwb3NpdGlvbi54KSArIFN0cmluZyhwb3NpdGlvbi55KTtcclxuICAgIH1cclxuXHJcbiAgICBjYXNlc0FkamFjZW50KGNhc2VUb0NoZWNrOiBDYXNlKTogQm9vbGVhbntcclxuICAgICAgICBpZih0aGlzLnBvc2l0aW9uLnggPT09IGNhc2VUb0NoZWNrLnBvc2l0aW9uLngrMSB8fCB0aGlzLnBvc2l0aW9uLnggPT09IGNhc2VUb0NoZWNrLnBvc2l0aW9uLngtMSB8fCB0aGlzLnBvc2l0aW9uLnkgPT09IGNhc2VUb0NoZWNrLnBvc2l0aW9uLnkrMSB8fCB0aGlzLnBvc2l0aW9uLnkgPT09IGNhc2VUb0NoZWNrLnBvc2l0aW9uLnktMSl7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2FzZTsiLCJcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuLi8uLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5pbXBvcnQgQ2hhcmFjdGVyIGZyb20gXCIuLi8uLi9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyXCI7XHJcbmltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IENvb3JkIGZyb20gXCIuLi8uLi9jb29yZC9tb2RlbC9jb29yZFwiO1xyXG5cclxuYWJzdHJhY3QgY2xhc3MgTG9naWNDaGFyYWN0ZXIge1xyXG5cclxuICAgIHN0YXRpYyBwYWludENoYXJhY3RlcnMoZmllbGQ6IEZpZWxkLCBuYW1lQ2hhcmFjdGVyOiBzdHJpbmcsIGljb25Vcmw6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGxldCBwbGF5ZXIgPSBuZXcgQ2hhcmFjdGVyKG5hbWVDaGFyYWN0ZXIsIGljb25VcmwsIGZpZWxkLmdldEF2YWlsYWJsZVJhbmRvbUNhc2UoKSk7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgZmllbGQuY2hhcmFjdGVyc1swXSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlKGZpZWxkLmNoYXJhY3RlcnNbMF0uY2FzZS5jYXNlc0FkamFjZW50KHBsYXllci5jYXNlKSl7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIgPSBuZXcgQ2hhcmFjdGVyKG5hbWVDaGFyYWN0ZXIsIGljb25VcmwsIGZpZWxkLmdldEF2YWlsYWJsZVJhbmRvbUNhc2UoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIGZpZWxkLmNhc2VzW3BsYXllci5jYXNlLnBvc2l0aW9uLnhdW3BsYXllci5jYXNlLnBvc2l0aW9uLnldLmlzQXZhaWxhYmxlID0gZmFsc2U7XHJcbiAgICAgICAgbGV0IGltZ0NoYXI6IEhUTUxJbWFnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGxldCBzcGFuRWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcblxyXG4gICAgICAgIHNwYW5FbHQuY2xhc3NMaXN0LmFkZChcImNoYXJcIik7XHJcbiAgICAgICAgaW1nQ2hhci5zcmMgPSBwbGF5ZXIuaWNvblVybDtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLm1heFdpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgICAgaW1nQ2hhci5zdHlsZS5tYXhIZWlnaHQgPSBcIjgwcHhcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUudG9wID0gXCItMjVweFwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUubGVmdCA9IFwiMTVweFwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUuekluZGV4ID0gXCIxMFwiO1xyXG4gICAgICAgIHNwYW5FbHQuYXBwZW5kQ2hpbGQoaW1nQ2hhcik7XHJcbiAgICAgICAgbGV0IHBsYXllckRpdkVsdCA9IHBsYXllci5jYXNlLiRlbDtcclxuICAgICAgICBwbGF5ZXJEaXZFbHQuYXBwZW5kQ2hpbGQoc3BhbkVsdCk7XHJcbiAgICAgICAgcGxheWVyLiRlbCA9IHNwYW5FbHQ7XHJcbiAgICAgICAgZmllbGQuY2hhcmFjdGVycy5wdXNoKHBsYXllcik7XHJcbiAgICB9IFxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTG9naWNDaGFyYWN0ZXI7IiwiaW1wb3J0IENhc2UgZnJvbSBcIi4uLy4uL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbW9kZWwvd2VhcG9uXCI7XHJcblxyXG4vL1RoaXMgY2xhc3MgZm9yIHRoZSBmaWVsZHNcclxuY2xhc3MgQ2hhcmFjdGVyIHtcclxuICAgLy9maWVsZCBcclxuICAgbmFtZTogc3RyaW5nO1xyXG4gICBpY29uVXJsOiBzdHJpbmc7XHJcbiAgIGxpZmU6IG51bWJlcjtcclxuICAgbGV2ZWw6IG51bWJlcjtcclxuICAgY2FzZTogQ2FzZTtcclxuICAgd2VhcG9uOiBXZWFwb247XHJcbiAgICRlbDogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAvL2NvbnN0cnVjdG9yIFxyXG4gICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGljb25Vcmw6IHN0cmluZywgc3RhcnRDYXNlOiBDYXNlKSB7XHJcbiAgICAgIHRoaXMubGlmZSA9IDEwMDtcclxuICAgICAgdGhpcy5sZXZlbCA9IDU7XHJcbiAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgIHRoaXMuaWNvblVybCA9IGljb25Vcmw7XHJcbiAgICAgIHRoaXMuY2FzZSA9IHN0YXJ0Q2FzZTtcclxuICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXI7IiwiLy9UaGlzIGNsYXNzIGZvciB0aGUgZmllbGRzXHJcbmNsYXNzIENvb3JkIHtcclxuICAgIC8vZmllbGQgXHJcbiAgICB4IDogbnVtYmVyO1xyXG4gICAgeSA6IG51bWJlcjtcclxuXHJcbiAgICAvL2NvbnN0cnVjdG9yIFxyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGRlZmF1bHQgQ29vcmQ7IiwiaW1wb3J0IENhc2UgZnJvbSBcIi4uLy4uL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4uL21vZGVsL2ZpZWxkXCI7XHJcbmltcG9ydCBDYXNlTG9naWMgZnJvbSBcIi4uLy4uL2Nhc2UvbG9naWMvY2FzZUxvZ2ljXCI7XHJcbmltcG9ydCBXZWFwb24gZnJvbSBcIi4uLy4uL3dlYXBvbi9tb2RlbC93ZWFwb25cIjtcclxuaW1wb3J0IExvZ2ljV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbG9naWMvbG9naWNXZWFwb25cIjtcclxuaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi4vLi4vY2hhcmFjdGVyL21vZGVsL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgTG9naWNDaGFyYWN0ZXIgZnJvbSBcIi4uLy4uL2NoYXJhY3Rlci9sb2dpYy9sb2dpY0NoYXJhY3RlclwiO1xyXG5pbXBvcnQgQ29vcmQgZnJvbSBcIi4uLy4uL2Nvb3JkL21vZGVsL2Nvb3JkXCI7XHJcblxyXG4vL1RoaXMgY2xhc3Mgd2lsbCBnZW5lcmF0ZSBhbGwgdGhlIGRpZmZlcmVudCBvYmplY3RzIG5lZWRlZCBmb3IgdGhlIGdhbWVcclxuYWJzdHJhY3QgY2xhc3MgTG9naWNGaWVsZCB7XHJcblxyXG4gICAvKipcclxuICAgICogXHJcbiAgICAqIEBwYXJhbSB4IFxyXG4gICAgKiBAcGFyYW0geSBcclxuICAgICovXHJcbiAgIHN0YXRpYyBnZW5lcmF0ZU1hcCh4OiBudW1iZXIsIHk6IG51bWJlcik6IEZpZWxkIHtcclxuICAgICAgbGV0IHRvdGFsQ2FzZXMgPSB4ICogeTtcclxuICAgICAgbGV0IGJsb2NrZWRDYXNlcyA9IE1hdGgucm91bmQodG90YWxDYXNlcyAvIDYpO1xyXG4gICAgICBsZXQgZmllbGQ6IEZpZWxkID0gbmV3IEZpZWxkKHgsIHkpO1xyXG5cclxuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgeDsgY29sKyspIHtcclxuICAgICAgICAgZmllbGQuY2FzZXNbY29sXSA9IFtdO1xyXG4gICAgICAgICBmb3IobGV0IHJvdyA9IDA7IHJvdyA8IHk7IHJvdysrKXtcclxuICAgICAgICAgICAgbGV0IHBvc2l0aW9uID0gbmV3IENvb3JkKGNvbCwgcm93KTtcclxuXHJcbiAgICAgICAgIGlmIChibG9ja2VkQ2FzZXMgPiAwKSB7XHJcbiAgICAgICAgICAgIGxldCBibG9ja2VkQ2FzZSA9IG5ldyBDYXNlKHBvc2l0aW9uLCBDYXNlTG9naWMuQkxPQ0tFRCk7XHJcbiAgICAgICAgICAgIGZpZWxkLmNhc2VzW2NvbF1bcm93XSA9IGJsb2NrZWRDYXNlO1xyXG4gICAgICAgICAgICBibG9ja2VkQ2FzZXMgPSBibG9ja2VkQ2FzZXMgLSAxO1xyXG4gICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgbm9uQmxvY2tlZENhc2UgPSBuZXcgQ2FzZShwb3NpdGlvbik7XHJcbiAgICAgICAgICAgIGZpZWxkLmNhc2VzW2NvbF1bcm93XSA9IG5vbkJsb2NrZWRDYXNlO1xyXG4gICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBmaWVsZC51bnNvcnRDYXNlcygpO1xyXG5cclxuICAgICAgcmV0dXJuIGZpZWxkO1xyXG4gICB9XHJcblxyXG4gICAvKipcclxuICAgICogXHJcbiAgICAqIEBwYXJhbSBlbGVtZW50VG9GaWxsIFxyXG4gICAgKiBAcGFyYW0gZmllbGQgXHJcbiAgICAqL1xyXG4gICBzdGF0aWMgcGFpbnRGaWVsZChlbGVtZW50VG9GaWxsOiBIVE1MRWxlbWVudCwgZmllbGQ6IEZpZWxkKTogdm9pZCB7XHJcblxyXG4gICAgICBcclxuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgZmllbGQuc2l6ZS54OyBjb2wrKykge1xyXG4gICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCBmaWVsZC5zaXplLnk7IHJvdysrKXtcclxuICAgICAgICAgQ2FzZUxvZ2ljLnBhaW50Q2FzZShmaWVsZCwgZmllbGQuY2FzZXNbY29sXVtyb3ddLCBlbGVtZW50VG9GaWxsLCByb3csIGNvbCk7XHJcbiAgICAgIH1cclxuICAgfVxyXG4gICB9XHJcblxyXG5cclxuICAgIHN0YXRpYyBzZXRXZWFwb24oZmllbGQ6IEZpZWxkKTogdm9pZCB7XHJcbiAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKykge1xyXG4gICAgICAgICAgTG9naWNXZWFwb24ucGFpbnRXZWFwb24oZmllbGQsIFwiTWpvbG5pclwiLCBcIi9hc3NldHMvaW1nL3dlYXBvbi93ZWFwb24xLnBuZ1wiKTtcclxuICAgICAgIH1cclxuICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjsgaSsrKSB7XHJcbiAgICAgICAgICBMb2dpY1dlYXBvbi5wYWludFdlYXBvbihmaWVsZCxcIlN0cm9tYnJlYWtlclwiLCBcIi9hc3NldHMvaW1nL3dlYXBvbi93ZWFwb24yLnBuZ1wiKTtcclxuICAgICAgIH1cclxuICAgIH0gXHJcblxyXG4gICBzdGF0aWMgc2V0Q2hhcmFjdGVycyhmaWVsZDogRmllbGQpOiB2b2lkIHtcclxuICAgICAgTG9naWNDaGFyYWN0ZXIucGFpbnRDaGFyYWN0ZXJzKGZpZWxkLCBcIkV4dGVybWluYXRvclwiLCBcIi9hc3NldHMvaW1nL2NoYXJhY3RlcnMvYXZhdGFyMS5wbmdcIik7XHJcbiAgICAgIExvZ2ljQ2hhcmFjdGVyLnBhaW50Q2hhcmFjdGVycyhmaWVsZCwgXCJQcmVkYXRvclwiLCBcIi9hc3NldHMvaW1nL2NoYXJhY3RlcnMvYXZhdGFyMi5wbmdcIik7XHJcbiAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTG9naWNGaWVsZDsiLCJpbXBvcnQgQ2FzZSBmcm9tIFwiLi4vLi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcbmltcG9ydCBDb29yZCBmcm9tIFwiLi4vLi4vY29vcmQvbW9kZWwvY29vcmRcIjtcclxuaW1wb3J0IFNpemUgZnJvbSBcIi4uLy4uL3NpemUvbW9kZWwvc2l6ZVwiO1xyXG5pbXBvcnQgV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbW9kZWwvd2VhcG9uXCI7XHJcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4uLy4uL2NoYXJhY3Rlci9tb2RlbC9jaGFyYWN0ZXJcIjtcclxuaW1wb3J0IExvZ2ljSGVscGVyIGZyb20gXCIuLi8uLi8uLi9oZWxwZXJzL0xvZ2ljSGVscGVyXCI7XHJcblxyXG5cclxuLy9UaGlzIGNsYXNzIGZvciB0aGUgZmllbGRzXHJcbmNsYXNzIEZpZWxkIHtcclxuICAgIC8vZmllbGQgXHJcbiAgICBzaXplOiBTaXplO1xyXG4gICAgY2FzZXM6IENhc2VbXVtdO1xyXG4gICAgd2VhcG9uczogV2VhcG9uW107XHJcbiAgICBjaGFyYWN0ZXJzOiBDaGFyYWN0ZXJbXTtcclxuICAgICRlbDogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgLy9jb25zdHJ1Y3RvciBcclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5zaXplID0gbmV3IFNpemUoeCx5KTtcclxuICAgICAgICB0aGlzLmNhc2VzID0gQXJyYXk8QXJyYXk8Q2FzZT4+KCk7XHJcbiAgICAgICAgdGhpcy53ZWFwb25zID0gW107XHJcbiAgICAgICAgdGhpcy5jaGFyYWN0ZXJzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBjYXNlVG9BZGQgXHJcbiAgICAgKi9cclxuICAgIGFkZENhc2UoY2FzZVRvQWRkOiBDYXNlW10pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmNhc2VzLnB1c2goY2FzZVRvQWRkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIGluZGljZUNhc2UgXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZUNhc2UocG9zaXRpb246IENvb3JkKTogdm9pZHtcclxuICAgICAgICB0aGlzLmNhc2VzW3Bvc2l0aW9uLnhdLnNwbGljZShwb3NpdGlvbi55LCAxKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICovXHJcbiAgICBuYnJPZkJsb2NrZWRDYXNlKCk6IG51bWJlciB7XHJcbiAgICAgICAgbGV0IG5ick9mQmxvY2tlZENhc2U6IG51bWJlciA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5zaXplLng7IHJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuc2l6ZS55OyBjb2wrKyl7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhc2VzW3Jvd11bY29sXS5pc0Jsb2NrZWQpIHtcclxuICAgICAgICAgICAgICAgIG5ick9mQmxvY2tlZENhc2UgPSBuYnJPZkJsb2NrZWRDYXNlICsgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICAgICByZXR1cm4gbmJyT2ZCbG9ja2VkQ2FzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICovXHJcbiAgICBnZXROb25CbG9ja2VkQ2FzZXMoKTogQXJyYXk8Q2FzZT4ge1xyXG4gICAgICAgIGxldCBOb25CbG9ja2VkQ2FzZXM6IEFycmF5PENhc2U+ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5zaXplLng7IHJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuc2l6ZS55OyBjb2wrKyl7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jYXNlc1tyb3ddW2NvbF0uaXNCbG9ja2VkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FzZVRvQWRkID0gdGhpcy5jYXNlc1tyb3ddW2NvbF07XHJcbiAgICAgICAgICAgICAgICBOb25CbG9ja2VkQ2FzZXMucHVzaChjYXNlVG9BZGQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgIHJldHVybiBOb25CbG9ja2VkQ2FzZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QmxvY2tlZENhc2VzKCk6IEFycmF5PENhc2U+IHtcclxuICAgICAgICBsZXQgQmxvY2tlZENhc2VzOiBBcnJheTxDYXNlPiA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMuc2l6ZS54OyByb3crKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCB0aGlzLnNpemUueTsgY29sKyspe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYXNlc1tyb3ddW2NvbF0uaXNCbG9ja2VkKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2FzZVRvQWRkID0gdGhpcy5jYXNlc1tyb3ddW2NvbF07XHJcbiAgICAgICAgICAgICAgICBCbG9ja2VkQ2FzZXMucHVzaChjYXNlVG9BZGQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgIHJldHVybiBCbG9ja2VkQ2FzZXM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QXZhaWxhYmxlQ2FzZXMoKTogQXJyYXk8Q2FzZT4ge1xyXG4gICAgICAgIGxldCBhdmFpbGFibGVDYXNlczogQXJyYXk8Q2FzZT4gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLnNpemUueDsgcm93KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5zaXplLnk7IGNvbCsrKXtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2FzZXNbcm93XVtjb2xdLmlzQXZhaWxhYmxlICYmICF0aGlzLmNhc2VzW3Jvd11bY29sXS5pc0Jsb2NrZWQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBjYXNlVG9BZGQgPSB0aGlzLmNhc2VzW3Jvd11bY29sXTtcclxuICAgICAgICAgICAgICAgIGF2YWlsYWJsZUNhc2VzLnB1c2goY2FzZVRvQWRkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICAgICByZXR1cm4gYXZhaWxhYmxlQ2FzZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiBcclxuICAgICAqL1xyXG4gICAgZ2V0Q2FzZUJ5UG9zaXRpb24ocG9zaXRpb246IENvb3JkKTogQ2FzZSB7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuY2FzZXNbcG9zaXRpb24ueF1bcG9zaXRpb24ueV0pO1xyXG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FzZXNbcG9zaXRpb24ueF1bcG9zaXRpb24ueV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKi9cclxuICAgIGdldFJhbmRvbUNhc2UoKTogQ2FzZXtcclxuICAgICAgICBsZXQgcmFuZG9tWCA9IExvZ2ljSGVscGVyLmdldFJhbmRvbURpbWVuc2lvbih0aGlzLnNpemUueC0xKTtcclxuICAgICAgICBsZXQgcmFuZG9tWSA9IExvZ2ljSGVscGVyLmdldFJhbmRvbURpbWVuc2lvbih0aGlzLnNpemUueS0xKTtcclxuXHJcbiAgICAgICAgbGV0IHJhbmRvbUNvb3JkID0gbmV3IENvb3JkKHJhbmRvbVgsIHJhbmRvbVkpO1xyXG5cclxuICAgICAgICBsZXQgY2FzZVJhbmRvbSA9IHRoaXMuZ2V0Q2FzZUJ5UG9zaXRpb24ocmFuZG9tQ29vcmQpO1xyXG4gICAgICAgIGxldCBjYXNlVG9DaGVjayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhc2VSYW5kb20ucG9zaXRpb25TdHJpbmcpO1xyXG4gICAgICAgIHdoaWxlKGNhc2VUb0NoZWNrID09PSBudWxsIHx8IGNhc2VUb0NoZWNrID09PSB1bmRlZmluZWQgfHwgY2FzZVJhbmRvbSA9PT0gdW5kZWZpbmVkIHx8IGNhc2VSYW5kb20gPT09IG51bGwpe1xyXG5cclxuICAgICAgICAgICAgbGV0IHJhbmRvbVggPSBMb2dpY0hlbHBlci5nZXRSYW5kb21EaW1lbnNpb24odGhpcy5zaXplLngtMSk7XHJcbiAgICAgICAgICAgIGxldCByYW5kb21ZID0gTG9naWNIZWxwZXIuZ2V0UmFuZG9tRGltZW5zaW9uKHRoaXMuc2l6ZS55LTEpO1xyXG4gICAgXHJcbiAgICAgICAgICAgIGxldCByYW5kb21Db29yZCA9IG5ldyBDb29yZChyYW5kb21YLCByYW5kb21ZKTtcclxuXHJcbiAgICAgICAgICAgIGNhc2VSYW5kb20gPSB0aGlzLmdldENhc2VCeVBvc2l0aW9uKHJhbmRvbUNvb3JkKTtcclxuICAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjYXNlUmFuZG9tO1xyXG4gICAgfVxyXG5cclxuICBcclxuICAgIGdldE5vbkJsb2NrZWRSYW5kb21DYXNlKCk6IENhc2V7XHJcblxyXG4gICAgICAgIGxldCBub25CbG9ja2VkQ2FzZXMgPSB0aGlzLmdldE5vbkJsb2NrZWRDYXNlcygpO1xyXG5cclxuICAgICAgICBsZXQgaW5kaWNlID0gTG9naWNIZWxwZXIuZ2V0UmFuZG9tRGltZW5zaW9uKG5vbkJsb2NrZWRDYXNlcy5sZW5ndGgtMSk7XHJcblxyXG4gICAgICAgIGxldCBub25CbG9ja2VkUmFuZG9tQ2FzZSA9IG5vbkJsb2NrZWRDYXNlc1tpbmRpY2VdO1xyXG5cclxuICAgICAgICByZXR1cm4gbm9uQmxvY2tlZFJhbmRvbUNhc2U7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGdldEF2YWlsYWJsZVJhbmRvbUNhc2UoKTogQ2FzZXtcclxuICAgICAgICBsZXQgYXZhaWxhYmxlQ2FzZXMgPSB0aGlzLmdldEF2YWlsYWJsZUNhc2VzKCk7XHJcblxyXG4gICAgICAgIGxldCBpbmRpY2UgPSBMb2dpY0hlbHBlci5nZXRSYW5kb21EaW1lbnNpb24oYXZhaWxhYmxlQ2FzZXMubGVuZ3RoLTEpO1xyXG5cclxuICAgICAgICBsZXQgYXZhaWxhYmxlUmFuZG9tQ2FzZSA9IGF2YWlsYWJsZUNhc2VzW2luZGljZV07XHJcblxyXG4gICAgICAgIHJldHVybiBhdmFpbGFibGVSYW5kb21DYXNlO1xyXG4gICAgfSBcclxuXHJcblxyXG4gICAgZHVwbGljYXRlTGlzdE9mQ2FzZSgpOiBDYXNlW117XHJcbiAgICAgICAgbGV0IGNhc2VzVGVtcCA9IEFycmF5PENhc2U+KCk7XHJcbiAgICAgICAgZm9yIChsZXQgcm93PTA7IHJvdyA8IHRoaXMuc2l6ZS54OyByb3crKykge1xyXG4gICAgICAgICAgICBmb3IobGV0IGNvbD0wOyBjb2wgPCB0aGlzLnNpemUueTsgY29sKyspe1xyXG4gICAgICAgICAgIGxldCBjYXNlVG9BZGQgPSB0aGlzLmNhc2VzW3Jvd11bY29sXTtcclxuICAgICAgICAgICBjYXNlc1RlbXAucHVzaChjYXNlVG9BZGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgICAgICByZXR1cm4gY2FzZXNUZW1wO1xyXG4gICAgfVxyXG5cclxuICAgIHVuc29ydENhc2VzKCk6IHZvaWR7XHJcbiAgICAgICAgbGV0IGNhc2VzVGVtcCA9IHRoaXMuZHVwbGljYXRlTGlzdE9mQ2FzZSgpO1xyXG5cclxuICAgICAgICBmb3IobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuc2l6ZS54OyBjb2wrKyl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5zaXplLnk7IHJvdysrKXtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgaW5kaWNlID0gTG9naWNIZWxwZXIuZ2V0UmFuZG9tRGltZW5zaW9uKGNhc2VzVGVtcC5sZW5ndGgtMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXNlc1tjb2xdW3Jvd10gPSBjYXNlc1RlbXBbaW5kaWNlXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FzZXNbY29sXVtyb3ddLnBvc2l0aW9uLnggPSBjb2w7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhc2VzW2NvbF1bcm93XS5wb3NpdGlvbi55ID0gcm93O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXNlc1tjb2xdW3Jvd10ucG9zaXRpb25TdHJpbmcgPSBTdHJpbmcoY29sKStTdHJpbmcocm93KTtcclxuICAgICAgICAgICAgICAgIGNhc2VzVGVtcC5zcGxpY2UoaW5kaWNlLDEpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRmllbGQ7IiwiLy9UaGlzIGNsYXNzIGZvciB0aGUgZmllbGRzXHJcbmNsYXNzIFNpemUge1xyXG4gICAgLy9maWVsZCBcclxuICAgIHggOiBudW1iZXI7XHJcbiAgICB5IDogbnVtYmVyO1xyXG5cclxuICAgIC8vY29uc3RydWN0b3IgXHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZGVmYXVsdCBTaXplOyIsImltcG9ydCBGaWVsZCBmcm9tIFwiLi4vLi4vZmllbGQvbW9kZWwvZmllbGRcIjtcclxuaW1wb3J0IFdlYXBvbiBmcm9tIFwiLi4vLi4vd2VhcG9uL21vZGVsL3dlYXBvblwiO1xyXG5cclxuXHJcbmFic3RyYWN0IGNsYXNzIExvZ2ljV2VhcG9uIHtcclxuXHJcblxyXG4gICAgc3RhdGljIHBhaW50V2VhcG9uKGZpZWxkOiBGaWVsZCxuYW1lOiBzdHJpbmcsIGljb25XZWFwb246IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGxldCBjYXNlV2VhcG9uID0gZmllbGQuZ2V0QXZhaWxhYmxlUmFuZG9tQ2FzZSgpO1xyXG4gICAgICAgIGxldCB3ZWFwb24gPSBuZXcgV2VhcG9uKG5hbWUsIDUsIGljb25XZWFwb24sIGNhc2VXZWFwb24pO1xyXG4gICAgICAgIGxldCBpbWdXZWFwb246IEhUTUxJbWFnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xyXG4gICAgICAgIGxldCBzcGFuRWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XHJcbiAgICAgICAgc3BhbkVsdC5jbGFzc0xpc3QuYWRkKFwid2VhcG9uXCIpO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zcmMgPSB3ZWFwb24uaWNvblVybDtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUubWF4SGVpZ2h0ID0gXCIxMDAlXCI7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS50b3AgPSBcIjBcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUubGVmdCA9IFwiMFwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS56SW5kZXggPSBcIjIwXCI7XHJcbiAgICAgICAgc3BhbkVsdC5hcHBlbmRDaGlsZChpbWdXZWFwb24pO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhc2VXZWFwb24ucG9zaXRpb25TdHJpbmcpLmFwcGVuZENoaWxkKHNwYW5FbHQpO1xyXG4gICAgICAgIGZpZWxkLmNhc2VzW2Nhc2VXZWFwb24ucG9zaXRpb24ueF1bY2FzZVdlYXBvbi5wb3NpdGlvbi55XS5pc0F2YWlsYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIHdlYXBvbi4kZWwgPSBzcGFuRWx0O1xyXG4gICAgICAgIGZpZWxkLndlYXBvbnMucHVzaCh3ZWFwb24pO1xyXG4gICAgfSBcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTG9naWNXZWFwb247IiwiaW1wb3J0IENhc2UgZnJvbSBcIi4uLy4uL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5cclxuLy9UaGlzIGNsYXNzIGZvciB0aGUgZmllbGRzXHJcbmNsYXNzIFdlYXBvbiB7XHJcbiAgIC8vZmllbGQgXHJcbiAgIG5hbWU6IHN0cmluZztcclxuICAgZGFtYWdlOiBudW1iZXI7XHJcbiAgIGljb25Vcmw6IHN0cmluZztcclxuICAgY2FzZTogQ2FzZTtcclxuICAgJGVsOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgIC8vY29uc3RydWN0b3IgXHJcbiAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgZGFtYWdlOiBudW1iZXIsIGljb25Vcmw6IHN0cmluZywgd2VhcG9uQ2FzZTogQ2FzZSkge1xyXG4gICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICB0aGlzLmRhbWFnZSA9IGRhbWFnZTtcclxuICAgICAgdGhpcy5pY29uVXJsID0gaWNvblVybDtcclxuICAgICAgdGhpcy5jYXNlID0gd2VhcG9uQ2FzZTtcclxuICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFdlYXBvbjsiLCJcclxuYWJzdHJhY3QgY2xhc3MgTG9naWNIZWxwZXIge1xyXG4gICAgc3RhdGljIGdldFJhbmRvbURpbWVuc2lvbihkaW1lbnNpb246IG51bWJlcik6IG51bWJlciB7XHJcblxyXG4gICAgICAgIHJldHVybiBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkqZGltZW5zaW9uKTtcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IExvZ2ljSGVscGVyOyIsIlxyXG5pbXBvcnQgQ2FzZSBmcm9tIFwiLi9lbnRpdGllcy9jYXNlL21vZGVsL2Nhc2VcIjtcclxuaW1wb3J0IEZpZWxkIGZyb20gXCIuL2VudGl0aWVzL2ZpZWxkL21vZGVsL2ZpZWxkXCI7XHJcbmltcG9ydCBMb2dpY0ZpZWxkIGZyb20gXCIuL2VudGl0aWVzL2ZpZWxkL2xvZ2ljL2xvZ2ljRmllbGRcIjtcclxuXHJcbmxldCBmaWVsZEZvckdhbWUgPSBMb2dpY0ZpZWxkLmdlbmVyYXRlTWFwKDYsIDgpO1xyXG5cclxuTG9naWNGaWVsZC5wYWludEZpZWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlnaHRcIiksIGZpZWxkRm9yR2FtZSk7XHJcblxyXG5Mb2dpY0ZpZWxkLnNldFdlYXBvbihmaWVsZEZvckdhbWUpO1xyXG5cclxuTG9naWNGaWVsZC5zZXRDaGFyYWN0ZXJzKGZpZWxkRm9yR2FtZSk7XHJcblxyXG4iXX0=
