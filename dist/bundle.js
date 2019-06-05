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
    CaseLogic.paintCase = function (partyField, listOfCasesTemp, elementToFill, nbrOfRemainingCases) {
        var divElt = document.createElement("div");
        divElt.style.display = "inline";
        divElt.style.width = (Math.round(100 / partyField.numberOfCaseWidth)) - 1 + "%";
        divElt.style.height = (Math.round(100 / partyField.numberOfCaseHeight)) - 1 + "%";
        divElt.style.position = "relative";
        var elementToAdd = document.createElement("img");
        var indiceCaseFullList = Math.round(Math.random() * nbrOfRemainingCases);
        elementToAdd.src = listOfCasesTemp[indiceCaseFullList].imgUrl;
        elementToAdd.classList.add("fond");
        elementToAdd.classList.add("img-responsive");
        elementToAdd.style.width = (Math.round(100 / partyField.numberOfCaseWidth)) - 1 + "%";
        elementToAdd.style.height = (Math.round(100 / partyField.numberOfCaseHeight)) - 1 + "%";
        divElt.appendChild(elementToAdd);
        divElt.id = String(listOfCasesTemp[indiceCaseFullList].position);
        elementToFill.appendChild(divElt);
        listOfCasesTemp.splice(indiceCaseFullList, 1);
        console.log(listOfCasesTemp.length);
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
    }
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
    /**
     *
     * @param partyField
     * @param nameCharacter
     * @param iconUrl
     */
    LogicCharacter.paintCharacters = function (partyField, nameCharacter, iconUrl) {
        var player = new character_1.default(nameCharacter, iconUrl, partyField.getAvailableRandomCase());
        partyField.listOfCases[player.case.position].isAvailable = false;
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
        document.getElementById(String(player.case.position)).appendChild(spanElt);
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
var case_1 = require("../../case/model/case");
var field_1 = require("../model/field");
var caseLogic_1 = require("../../case/logic/caseLogic");
var logicWeapon_1 = require("../../weapon/logic/logicWeapon");
var logicCharacter_1 = require("../../character/logic/logicCharacter");
//This class will generate all the different objects needed for the game
var LogicField = /** @class */ (function () {
    function LogicField() {
    }
    /**
     *
     * @param numberOfCaseWidth
     * @param numberOfCaseHeight
     */
    LogicField.generateMap = function (numberOfCaseWidth, numberOfCaseHeight) {
        var totalNumberOfCases = numberOfCaseWidth * numberOfCaseHeight;
        var numberOfBlockedCases = Math.round(totalNumberOfCases / 6);
        var partyField = new field_1.default(numberOfCaseWidth, numberOfCaseHeight);
        console.log(totalNumberOfCases);
        for (var i = 0; i < totalNumberOfCases; i++) {
            if (numberOfBlockedCases > 0) {
                var blockedCase = new case_1.default(i, caseLogic_1.default.BLOCKED);
                partyField.addCase(blockedCase);
                numberOfBlockedCases = numberOfBlockedCases - 1;
            }
            else {
                var nonBlockedCase = new case_1.default(i);
                partyField.addCase(nonBlockedCase);
            }
        }
        return partyField;
    };
    /**
     *
     * @param elementToFill
     * @param partyField
     */
    LogicField.paintField = function (elementToFill, partyField) {
        var listOfCasesTemp = partyField.duplicateListOfCase();
        var nbrOfRemainingCases = listOfCasesTemp.length - 1;
        var nbrOfCaseToAdd = listOfCasesTemp.length - 1;
        for (var i = 0; i <= nbrOfCaseToAdd; i++) {
            nbrOfRemainingCases = listOfCasesTemp.length - 1;
            caseLogic_1.default.paintCase(partyField, listOfCasesTemp, elementToFill, nbrOfRemainingCases);
        }
    };
    /**
     *
     * @param partyField
     */
    LogicField.setWeapon = function (partyField) {
        for (var i = 0; i < 2; i++) {
            logicWeapon_1.default.paintWeapon(partyField, "/assets/img/weapon/weapon1.png");
        }
        for (var i = 0; i < 2; i++) {
            logicWeapon_1.default.paintWeapon(partyField, "/assets/img/weapon/weapon2.png");
        }
    };
    /**
     *
     * @param partyField
     */
    LogicField.setCharacters = function (partyField) {
        logicCharacter_1.default.paintCharacters(partyField, "Exterminator", "/assets/img/characters/avatar1.png");
        logicCharacter_1.default.paintCharacters(partyField, "Predator", "/assets/img/characters/avatar2.png");
    };
    return LogicField;
}());
exports.default = LogicField;
},{"../../case/logic/caseLogic":1,"../../case/model/case":2,"../../character/logic/logicCharacter":3,"../../weapon/logic/logicWeapon":7,"../model/field":6}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//This class for the fields
var Field = /** @class */ (function () {
    //constructor 
    function Field(numberOfCaseWidth, numberOfCaseHeight) {
        this.numberOfCaseWidth = numberOfCaseWidth;
        this.numberOfCaseHeight = numberOfCaseHeight;
        this.listOfCases = new Array();
    }
    /**
     *
     * @param caseToAdd
     */
    Field.prototype.addCase = function (caseToAdd) {
        this.listOfCases.push(caseToAdd);
    };
    /**
     *
     * @param indiceCase
     */
    Field.prototype.removeCase = function (indiceCase) {
        this.listOfCases.splice(indiceCase, 1);
    };
    /**
     *
     */
    Field.prototype.nbrOfBlockedCase = function () {
        var nbrOfBlockedCase = 0;
        for (var _i = 0, _a = this.listOfCases; _i < _a.length; _i++) {
            var brick = _a[_i];
            if (brick.isBlocked) {
                nbrOfBlockedCase = nbrOfBlockedCase + 1;
            }
        }
        return nbrOfBlockedCase;
    };
    /**
     *
     */
    Field.prototype.getNonBlockedCases = function () {
        var listOfNonBlockedCases = [];
        for (var _i = 0, _a = this.listOfCases; _i < _a.length; _i++) {
            var brick = _a[_i];
            if (!brick.isBlocked) {
                listOfNonBlockedCases.push(brick);
            }
        }
        return listOfNonBlockedCases;
    };
    /**
     *
     * @param position
     */
    Field.prototype.getCaseByPosition = function (position) {
        if (this.listOfCases[position] === null || this.listOfCases[position] === undefined) {
            console.log(undefined);
            console.log(position);
            return undefined;
        }
        else {
            return this.listOfCases[position];
        }
    };
    /**
     *
     */
    Field.prototype.getRandomCase = function () {
        var caseRandom = this.getCaseByPosition(Math.round(Math.random() * this.listOfCases.length));
        var caseToCheck = document.getElementById(String(caseRandom.position));
        while (caseToCheck === null || caseToCheck === undefined || caseRandom === undefined || caseRandom === null) {
            caseRandom = this.getCaseByPosition(Math.round(Math.random() * this.listOfCases.length));
        }
        return caseRandom;
    };
    /**
     *
     */
    Field.prototype.getNonBlockedRandomCase = function () {
        console.log((this.listOfCases.length - 1));
        var caseRandom = this.listOfCases[Math.round(Math.random() * (this.listOfCases.length - 1))];
        while (document.getElementById(String(caseRandom.position)) === null || document.getElementById(String(caseRandom.position)) === undefined || caseRandom === undefined || caseRandom === null || caseRandom.isBlocked === true) {
            caseRandom = this.listOfCases[Math.round(Math.random() * (this.listOfCases.length - 1))];
        }
        return caseRandom;
    };
    /**
     *
     */
    Field.prototype.getAvailableRandomCase = function () {
        console.log((this.listOfCases.length - 1));
        var caseRandom = this.listOfCases[Math.round(Math.random() * (this.listOfCases.length - 1))];
        while (document.getElementById(String(caseRandom.position)) === null || document.getElementById(String(caseRandom.position)) === undefined || caseRandom === undefined || caseRandom === null || caseRandom.isBlocked === true || caseRandom.isAvailable === false) {
            caseRandom = this.listOfCases[Math.round(Math.random() * (this.listOfCases.length - 1))];
        }
        return caseRandom;
    };
    Field.prototype.duplicateListOfCase = function () {
        var listOfCasesTemp = [];
        for (var _i = 0, _a = this.listOfCases; _i < _a.length; _i++) {
            var CaseTemp = _a[_i];
            var caseToAdd = CaseTemp;
            listOfCasesTemp.push(caseToAdd);
        }
        return listOfCasesTemp;
    };
    return Field;
}());
exports.default = Field;
},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var weapon_1 = require("../../weapon/model/weapon");
var LogicWeapon = /** @class */ (function () {
    function LogicWeapon() {
    }
    /**
     *
     * @param partyField
     * @param iconWeapon
     */
    LogicWeapon.paintWeapon = function (partyField, iconWeapon) {
        var caseWeapon = partyField.getAvailableRandomCase();
        var weapon = new weapon_1.default(5, iconWeapon, caseWeapon);
        var imgWeapon = document.createElement("img");
        var spanElt = document.createElement("span");
        spanElt.classList.add("weapon");
        imgWeapon.src = weapon.iconUrl;
        imgWeapon.style.maxHeight = "100%";
        imgWeapon.style.position = "absolute";
        imgWeapon.style.top = "0";
        imgWeapon.style.left = "-75px";
        imgWeapon.style.zIndex = "20";
        spanElt.appendChild(imgWeapon);
        document.getElementById(String(caseWeapon.position)).appendChild(spanElt);
        partyField.listOfCases[caseWeapon.position].isAvailable = false;
    };
    return LogicWeapon;
}());
exports.default = LogicWeapon;
},{"../../weapon/model/weapon":8}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//This class for the fields
var Weapon = /** @class */ (function () {
    //constructor 
    function Weapon(damage, iconUrl, weaponCase) {
        this.damage = damage;
        this.iconUrl = iconUrl;
        this.case = weaponCase;
    }
    return Weapon;
}());
exports.default = Weapon;
},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logicField_1 = require("./entities/field/logic/logicField");
var fieldForGame = logicField_1.default.generateMap(8, 6);
logicField_1.default.paintField(document.getElementById("fight"), fieldForGame);
logicField_1.default.setWeapon(fieldForGame);
logicField_1.default.setCharacters(fieldForGame);
},{"./entities/field/logic/logicField":5}]},{},[9])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZW50aXRpZXMvY2FzZS9sb2dpYy9jYXNlTG9naWMudHMiLCJzcmMvZW50aXRpZXMvY2FzZS9tb2RlbC9jYXNlLnRzIiwic3JjL2VudGl0aWVzL2NoYXJhY3Rlci9sb2dpYy9sb2dpY0NoYXJhY3Rlci50cyIsInNyYy9lbnRpdGllcy9jaGFyYWN0ZXIvbW9kZWwvY2hhcmFjdGVyLnRzIiwic3JjL2VudGl0aWVzL2ZpZWxkL2xvZ2ljL2xvZ2ljRmllbGQudHMiLCJzcmMvZW50aXRpZXMvZmllbGQvbW9kZWwvZmllbGQudHMiLCJzcmMvZW50aXRpZXMvd2VhcG9uL2xvZ2ljL2xvZ2ljV2VhcG9uLnRzIiwic3JjL2VudGl0aWVzL3dlYXBvbi9tb2RlbC93ZWFwb24udHMiLCJzcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDR0E7SUFBQTtJQWtDQSxDQUFDO0lBN0JHOzs7Ozs7T0FNRztJQUNJLG1CQUFTLEdBQWhCLFVBQWlCLFVBQWlCLEVBQUUsZUFBNEIsRUFBRSxhQUEwQixFQUFFLG1CQUEyQjtRQUNySCxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztRQUNoQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUNoRixNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUNsRixNQUFNLENBQUMsS0FB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LElBQUksR0FBRyxVQUFVLENBQUM7SUFDMUIsQ0FBQztJQUdKLGFBQUM7QUFBRCxDQWRBLEFBY0MsSUFBQTtBQUVELGtCQUFlLE1BQU0sQ0FBQzs7OztBQ2hCdEIsZ0VBQTJEO0FBRTNELElBQUksWUFBWSxHQUFHLG9CQUFVLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUVoRCxvQkFBVSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBRXRFLG9CQUFVLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBRW5DLG9CQUFVLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IENhc2UgZnJvbSBcIi4uLy4uL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4uLy4uL2ZpZWxkL21vZGVsL2ZpZWxkXCI7XHJcblxyXG5hYnN0cmFjdCBjbGFzcyBDYXNlTG9naWMge1xyXG5cclxuICAgIHN0YXRpYyBCTE9DS0VEOiBzdHJpbmcgPSBcIkJMT0NLRURcIjtcclxuICAgIHN0YXRpYyBOT1JNQUw6IHN0cmluZyA9IFwiTk9STUFMXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBwYXJ0eUZpZWxkIFxyXG4gICAgICogQHBhcmFtIGxpc3RPZkNhc2VzVGVtcCBcclxuICAgICAqIEBwYXJhbSBlbGVtZW50VG9GaWxsIFxyXG4gICAgICogQHBhcmFtIG5ick9mUmVtYWluaW5nQ2FzZXMgXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBwYWludENhc2UocGFydHlGaWVsZDogRmllbGQsIGxpc3RPZkNhc2VzVGVtcDogQXJyYXk8Q2FzZT4sIGVsZW1lbnRUb0ZpbGw6IEhUTUxFbGVtZW50LCBuYnJPZlJlbWFpbmluZ0Nhc2VzOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBsZXQgZGl2RWx0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBkaXZFbHQuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lXCI7XHJcbiAgICAgICAgZGl2RWx0LnN0eWxlLndpZHRoID0gKE1hdGgucm91bmQoMTAwIC8gcGFydHlGaWVsZC5udW1iZXJPZkNhc2VXaWR0aCkpIC0gMSArIFwiJVwiO1xyXG4gICAgICAgIGRpdkVsdC5zdHlsZS5oZWlnaHQgPSAoTWF0aC5yb3VuZCgxMDAgLyBwYXJ0eUZpZWxkLm51bWJlck9mQ2FzZUhlaWdodCkpIC0gMSArIFwiJVwiO1xyXG4gICAgICAgIGRpdkVsdC5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcclxuICAgICAgICBsZXQgZWxlbWVudFRvQWRkOiBIVE1MSW1hZ2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgICAgICBsZXQgaW5kaWNlQ2FzZUZ1bGxMaXN0OiBudW1iZXIgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiBuYnJPZlJlbWFpbmluZ0Nhc2VzKTtcclxuICAgICAgICBlbGVtZW50VG9BZGQuc3JjID0gbGlzdE9mQ2FzZXNUZW1wW2luZGljZUNhc2VGdWxsTGlzdF0uaW1nVXJsO1xyXG4gICAgICAgIGVsZW1lbnRUb0FkZC5jbGFzc0xpc3QuYWRkKFwiZm9uZFwiKTtcclxuICAgICAgICBlbGVtZW50VG9BZGQuY2xhc3NMaXN0LmFkZChcImltZy1yZXNwb25zaXZlXCIpO1xyXG4gICAgICAgIGVsZW1lbnRUb0FkZC5zdHlsZS53aWR0aCA9IChNYXRoLnJvdW5kKDEwMCAvIHBhcnR5RmllbGQubnVtYmVyT2ZDYXNlV2lkdGgpKSAtIDEgKyBcIiVcIjtcclxuICAgICAgICBlbGVtZW50VG9BZGQuc3R5bGUuaGVpZ2h0ID0gKE1hdGgucm91bmQoMTAwIC8gcGFydHlGaWVsZC5udW1iZXJPZkNhc2VIZWlnaHQpKSAtIDEgKyBcIiVcIjtcclxuICAgICAgICBkaXZFbHQuYXBwZW5kQ2hpbGQoZWxlbWVudFRvQWRkKTtcclxuICAgICAgICBkaXZFbHQuaWQgPSBTdHJpbmcobGlzdE9mQ2FzZXNUZW1wW2luZGljZUNhc2VGdWxsTGlzdF0ucG9zaXRpb24pO1xyXG4gICAgICAgIGVsZW1lbnRUb0ZpbGwuYXBwZW5kQ2hpbGQoZGl2RWx0KTtcclxuICAgICAgICBsaXN0T2ZDYXNlc1RlbXAuc3BsaWNlKGluZGljZUNhc2VGdWxsTGlzdCwgMSk7XHJcbiAgICAgICAgY29uc29sZS5sb2cobGlzdE9mQ2FzZXNUZW1wLmxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENhc2VMb2dpYzsiLCJpbXBvcnQgQ2FzZUxvZ2ljIGZyb20gXCIuLi8uLi9jYXNlL2xvZ2ljL2Nhc2VMb2dpY1wiO1xyXG5cclxuY2xhc3MgQ2FzZSB7XHJcbiAgICAvL2ZpZWxkIFxyXG4gICAgaW1nVXJsOiBzdHJpbmc7XHJcbiAgICBpc0Jsb2NrZWQ6IGJvb2xlYW47XHJcbiAgICBpc0F2YWlsYWJsZTogYm9vbGVhbjtcclxuICAgIHBvc2l0aW9uOiBudW1iZXI7XHJcbiAgICB0eXBlOiBzdHJpbmc7XHJcblxyXG4gICAgLy9jb25zdHJ1Y3RvciBcclxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uOiBudW1iZXIsIHR5cGU6IHN0cmluZyA9IENhc2VMb2dpYy5OT1JNQUwsIGlzQXZhaWxhYmxlOiBib29sZWFuID0gdHJ1ZSkge1xyXG5cclxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBDYXNlTG9naWMuTk9STUFMOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5pbWdVcmwgPSBcIi9hc3NldHMvaW1nL25vcm1hbC1maWVsZC90aWxlLTJELnBuZ1wiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc0Jsb2NrZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBDYXNlTG9naWMuQkxPQ0tFRDpcclxuICAgICAgICAgICAgICAgIHRoaXMuaW1nVXJsID0gXCIvYXNzZXRzL2ltZy9ibG9ja2VkLWZpZWxkL3RpbGUtMkQucG5nXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzQmxvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaXNBdmFpbGFibGUgPSBpc0F2YWlsYWJsZTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDYXNlOyIsIlxyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4uLy4uL2ZpZWxkL21vZGVsL2ZpZWxkXCI7XHJcbmltcG9ydCBDaGFyYWN0ZXIgZnJvbSBcIi4uLy4uL2NoYXJhY3Rlci9tb2RlbC9jaGFyYWN0ZXJcIjtcclxuXHJcbmFic3RyYWN0IGNsYXNzIExvZ2ljQ2hhcmFjdGVyIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHBhcnR5RmllbGQgXHJcbiAgICAgKiBAcGFyYW0gbmFtZUNoYXJhY3RlciBcclxuICAgICAqIEBwYXJhbSBpY29uVXJsIFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcGFpbnRDaGFyYWN0ZXJzKHBhcnR5RmllbGQ6IEZpZWxkLCBuYW1lQ2hhcmFjdGVyOiBzdHJpbmcsIGljb25Vcmw6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGxldCBwbGF5ZXIgPSBuZXcgQ2hhcmFjdGVyKG5hbWVDaGFyYWN0ZXIsIGljb25VcmwsIHBhcnR5RmllbGQuZ2V0QXZhaWxhYmxlUmFuZG9tQ2FzZSgpKTtcclxuICAgICAgICBwYXJ0eUZpZWxkLmxpc3RPZkNhc2VzW3BsYXllci5jYXNlLnBvc2l0aW9uXS5pc0F2YWlsYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIGxldCBpbWdDaGFyOiBIVE1MSW1hZ2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgICAgICBsZXQgc3BhbkVsdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xyXG5cclxuICAgICAgICBzcGFuRWx0LmNsYXNzTGlzdC5hZGQoXCJjaGFyXCIpO1xyXG4gICAgICAgIGltZ0NoYXIuc3JjID0gcGxheWVyLmljb25Vcmw7XHJcbiAgICAgICAgaW1nQ2hhci5zdHlsZS5tYXhXaWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgICAgIGltZ0NoYXIuc3R5bGUubWF4SGVpZ2h0ID0gXCI4MHB4XCI7XHJcbiAgICAgICAgaW1nQ2hhci5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLnRvcCA9IFwiLTI1cHhcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLmxlZnQgPSBcIjE1cHhcIjtcclxuICAgICAgICBpbWdDaGFyLnN0eWxlLnpJbmRleCA9IFwiMTBcIjtcclxuICAgICAgICBzcGFuRWx0LmFwcGVuZENoaWxkKGltZ0NoYXIpO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFN0cmluZyhwbGF5ZXIuY2FzZS5wb3NpdGlvbikpLmFwcGVuZENoaWxkKHNwYW5FbHQpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgTG9naWNDaGFyYWN0ZXI7IiwiaW1wb3J0IENhc2UgZnJvbSBcIi4uLy4uL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbW9kZWwvd2VhcG9uXCI7XHJcblxyXG4vL1RoaXMgY2xhc3MgZm9yIHRoZSBmaWVsZHNcclxuY2xhc3MgQ2hhcmFjdGVyIHtcclxuICAgLy9maWVsZCBcclxuICAgbmFtZTogc3RyaW5nO1xyXG4gICBpY29uVXJsOiBzdHJpbmc7XHJcbiAgIGxpZmU6IG51bWJlcjtcclxuICAgbGV2ZWw6IG51bWJlcjtcclxuICAgY2FzZTogQ2FzZTtcclxuICAgd2VhcG9uOiBXZWFwb247XHJcblxyXG4gICAvL2NvbnN0cnVjdG9yIFxyXG4gICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIGljb25Vcmw6IHN0cmluZywgc3RhcnRDYXNlOiBDYXNlKSB7XHJcbiAgICAgIHRoaXMubGlmZSA9IDEwMDtcclxuICAgICAgdGhpcy5sZXZlbCA9IDU7XHJcbiAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgIHRoaXMuaWNvblVybCA9IGljb25Vcmw7XHJcbiAgICAgIHRoaXMuY2FzZSA9IHN0YXJ0Q2FzZTtcclxuICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDaGFyYWN0ZXI7IiwiaW1wb3J0IENhc2UgZnJvbSBcIi4uLy4uL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4uL21vZGVsL2ZpZWxkXCI7XHJcbmltcG9ydCBDYXNlTG9naWMgZnJvbSBcIi4uLy4uL2Nhc2UvbG9naWMvY2FzZUxvZ2ljXCI7XHJcbmltcG9ydCBXZWFwb24gZnJvbSBcIi4uLy4uL3dlYXBvbi9tb2RlbC93ZWFwb25cIjtcclxuaW1wb3J0IExvZ2ljV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbG9naWMvbG9naWNXZWFwb25cIjtcclxuaW1wb3J0IENoYXJhY3RlciBmcm9tIFwiLi4vLi4vY2hhcmFjdGVyL21vZGVsL2NoYXJhY3RlclwiO1xyXG5pbXBvcnQgTG9naWNDaGFyYWN0ZXIgZnJvbSBcIi4uLy4uL2NoYXJhY3Rlci9sb2dpYy9sb2dpY0NoYXJhY3RlclwiO1xyXG5cclxuLy9UaGlzIGNsYXNzIHdpbGwgZ2VuZXJhdGUgYWxsIHRoZSBkaWZmZXJlbnQgb2JqZWN0cyBuZWVkZWQgZm9yIHRoZSBnYW1lXHJcbmFic3RyYWN0IGNsYXNzIExvZ2ljRmllbGQge1xyXG5cclxuICAgLyoqXHJcbiAgICAqIFxyXG4gICAgKiBAcGFyYW0gbnVtYmVyT2ZDYXNlV2lkdGggXHJcbiAgICAqIEBwYXJhbSBudW1iZXJPZkNhc2VIZWlnaHQgXHJcbiAgICAqL1xyXG4gICBzdGF0aWMgZ2VuZXJhdGVNYXAobnVtYmVyT2ZDYXNlV2lkdGg6IG51bWJlciwgbnVtYmVyT2ZDYXNlSGVpZ2h0OiBudW1iZXIpOiBGaWVsZCB7XHJcbiAgICAgIGxldCB0b3RhbE51bWJlck9mQ2FzZXMgPSBudW1iZXJPZkNhc2VXaWR0aCAqIG51bWJlck9mQ2FzZUhlaWdodDtcclxuICAgICAgbGV0IG51bWJlck9mQmxvY2tlZENhc2VzID0gTWF0aC5yb3VuZCh0b3RhbE51bWJlck9mQ2FzZXMgLyA2KTtcclxuICAgICAgbGV0IHBhcnR5RmllbGQ6IEZpZWxkID0gbmV3IEZpZWxkKG51bWJlck9mQ2FzZVdpZHRoLCBudW1iZXJPZkNhc2VIZWlnaHQpO1xyXG4gICAgICBjb25zb2xlLmxvZyh0b3RhbE51bWJlck9mQ2FzZXMpO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdGFsTnVtYmVyT2ZDYXNlczsgaSsrKSB7XHJcbiAgICAgICAgIGlmIChudW1iZXJPZkJsb2NrZWRDYXNlcyA+IDApIHtcclxuICAgICAgICAgICAgbGV0IGJsb2NrZWRDYXNlID0gbmV3IENhc2UoaSwgQ2FzZUxvZ2ljLkJMT0NLRUQpO1xyXG4gICAgICAgICAgICBwYXJ0eUZpZWxkLmFkZENhc2UoYmxvY2tlZENhc2UpO1xyXG4gICAgICAgICAgICBudW1iZXJPZkJsb2NrZWRDYXNlcyA9IG51bWJlck9mQmxvY2tlZENhc2VzIC0gMTtcclxuICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IG5vbkJsb2NrZWRDYXNlID0gbmV3IENhc2UoaSk7XHJcbiAgICAgICAgICAgIHBhcnR5RmllbGQuYWRkQ2FzZShub25CbG9ja2VkQ2FzZSk7XHJcbiAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcGFydHlGaWVsZDtcclxuICAgfVxyXG5cclxuICAgLyoqXHJcbiAgICAqIFxyXG4gICAgKiBAcGFyYW0gZWxlbWVudFRvRmlsbCBcclxuICAgICogQHBhcmFtIHBhcnR5RmllbGQgXHJcbiAgICAqL1xyXG4gICBzdGF0aWMgcGFpbnRGaWVsZChlbGVtZW50VG9GaWxsOiBIVE1MRWxlbWVudCwgcGFydHlGaWVsZDogRmllbGQpOiB2b2lkIHtcclxuICAgICAgbGV0IGxpc3RPZkNhc2VzVGVtcCA9IHBhcnR5RmllbGQuZHVwbGljYXRlTGlzdE9mQ2FzZSgpO1xyXG4gICAgICBsZXQgbmJyT2ZSZW1haW5pbmdDYXNlczogbnVtYmVyID0gbGlzdE9mQ2FzZXNUZW1wLmxlbmd0aCAtIDE7XHJcbiAgICAgIGxldCBuYnJPZkNhc2VUb0FkZDogbnVtYmVyID0gbGlzdE9mQ2FzZXNUZW1wLmxlbmd0aCAtIDE7XHJcbiAgICAgIFxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBuYnJPZkNhc2VUb0FkZDsgaSsrKSB7XHJcbiAgICAgICAgIG5ick9mUmVtYWluaW5nQ2FzZXMgPSBsaXN0T2ZDYXNlc1RlbXAubGVuZ3RoIC0gMTtcclxuICAgICAgICAgQ2FzZUxvZ2ljLnBhaW50Q2FzZShwYXJ0eUZpZWxkLCBsaXN0T2ZDYXNlc1RlbXAsIGVsZW1lbnRUb0ZpbGwsIG5ick9mUmVtYWluaW5nQ2FzZXMpXHJcbiAgICAgIH1cclxuICAgfVxyXG5cclxuICAgLyoqXHJcbiAgICAqIFxyXG4gICAgKiBAcGFyYW0gcGFydHlGaWVsZCBcclxuICAgICovXHJcbiAgIHN0YXRpYyBzZXRXZWFwb24ocGFydHlGaWVsZDogRmllbGQpOiB2b2lkIHtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpKyspIHtcclxuICAgICAgICAgTG9naWNXZWFwb24ucGFpbnRXZWFwb24ocGFydHlGaWVsZCwgXCIvYXNzZXRzL2ltZy93ZWFwb24vd2VhcG9uMS5wbmdcIik7XHJcbiAgICAgIH1cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyOyBpKyspIHtcclxuICAgICAgICAgTG9naWNXZWFwb24ucGFpbnRXZWFwb24ocGFydHlGaWVsZCwgXCIvYXNzZXRzL2ltZy93ZWFwb24vd2VhcG9uMi5wbmdcIik7XHJcbiAgICAgIH1cclxuICAgfVxyXG5cclxuLyoqXHJcbiAqIFxyXG4gKiBAcGFyYW0gcGFydHlGaWVsZCBcclxuICovXHJcbiAgIHN0YXRpYyBzZXRDaGFyYWN0ZXJzKHBhcnR5RmllbGQ6IEZpZWxkKTogdm9pZCB7XHJcbiAgICAgIExvZ2ljQ2hhcmFjdGVyLnBhaW50Q2hhcmFjdGVycyhwYXJ0eUZpZWxkLCBcIkV4dGVybWluYXRvclwiLCBcIi9hc3NldHMvaW1nL2NoYXJhY3RlcnMvYXZhdGFyMS5wbmdcIik7XHJcbiAgICAgIExvZ2ljQ2hhcmFjdGVyLnBhaW50Q2hhcmFjdGVycyhwYXJ0eUZpZWxkLCBcIlByZWRhdG9yXCIsIFwiL2Fzc2V0cy9pbWcvY2hhcmFjdGVycy9hdmF0YXIyLnBuZ1wiKTtcclxuICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMb2dpY0ZpZWxkOyIsImltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuXHJcbi8vVGhpcyBjbGFzcyBmb3IgdGhlIGZpZWxkc1xyXG5jbGFzcyBGaWVsZCB7XHJcbiAgICAvL2ZpZWxkIFxyXG4gICAgbnVtYmVyT2ZDYXNlV2lkdGg6IG51bWJlcjtcclxuICAgIG51bWJlck9mQ2FzZUhlaWdodDogbnVtYmVyO1xyXG4gICAgbGlzdE9mQ2FzZXM6IEFycmF5PENhc2U+O1xyXG5cclxuICAgIC8vY29uc3RydWN0b3IgXHJcbiAgICBjb25zdHJ1Y3RvcihudW1iZXJPZkNhc2VXaWR0aDogbnVtYmVyLCBudW1iZXJPZkNhc2VIZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMubnVtYmVyT2ZDYXNlV2lkdGggPSBudW1iZXJPZkNhc2VXaWR0aDtcclxuICAgICAgICB0aGlzLm51bWJlck9mQ2FzZUhlaWdodCA9IG51bWJlck9mQ2FzZUhlaWdodDtcclxuICAgICAgICB0aGlzLmxpc3RPZkNhc2VzID0gbmV3IEFycmF5PENhc2U+KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBjYXNlVG9BZGQgXHJcbiAgICAgKi9cclxuICAgIGFkZENhc2UoY2FzZVRvQWRkOiBDYXNlKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5saXN0T2ZDYXNlcy5wdXNoKGNhc2VUb0FkZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBpbmRpY2VDYXNlIFxyXG4gICAgICovXHJcbiAgICByZW1vdmVDYXNlKGluZGljZUNhc2U6IG51bWJlcik6IHZvaWR7XHJcbiAgICAgICAgdGhpcy5saXN0T2ZDYXNlcy5zcGxpY2UoaW5kaWNlQ2FzZSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqL1xyXG4gICAgbmJyT2ZCbG9ja2VkQ2FzZSgpOiBudW1iZXIge1xyXG4gICAgICAgIGxldCBuYnJPZkJsb2NrZWRDYXNlOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGJyaWNrIG9mIHRoaXMubGlzdE9mQ2FzZXMpIHtcclxuICAgICAgICAgICAgaWYgKGJyaWNrLmlzQmxvY2tlZCkge1xyXG4gICAgICAgICAgICAgICAgbmJyT2ZCbG9ja2VkQ2FzZSA9IG5ick9mQmxvY2tlZENhc2UgKyAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuYnJPZkJsb2NrZWRDYXNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKi9cclxuICAgIGdldE5vbkJsb2NrZWRDYXNlcygpOiBBcnJheTxDYXNlPiB7XHJcbiAgICAgICAgbGV0IGxpc3RPZk5vbkJsb2NrZWRDYXNlczogQXJyYXk8Q2FzZT4gPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBicmljayBvZiB0aGlzLmxpc3RPZkNhc2VzKSB7XHJcbiAgICAgICAgICAgIGlmICghYnJpY2suaXNCbG9ja2VkKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0T2ZOb25CbG9ja2VkQ2FzZXMucHVzaChicmljayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3RPZk5vbkJsb2NrZWRDYXNlcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogQHBhcmFtIHBvc2l0aW9uIFxyXG4gICAgICovXHJcbiAgICBnZXRDYXNlQnlQb3NpdGlvbihwb3NpdGlvbjogbnVtYmVyKTogQ2FzZSB7XHJcbiAgICAgICAgaWYodGhpcy5saXN0T2ZDYXNlc1twb3NpdGlvbl0gPT09IG51bGwgfHwgdGhpcy5saXN0T2ZDYXNlc1twb3NpdGlvbl0gPT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHBvc2l0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGlzdE9mQ2FzZXNbcG9zaXRpb25dO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICovXHJcbiAgICBnZXRSYW5kb21DYXNlKCk6IENhc2V7XHJcbiAgICAgICAgbGV0IGNhc2VSYW5kb20gPSB0aGlzLmdldENhc2VCeVBvc2l0aW9uKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSp0aGlzLmxpc3RPZkNhc2VzLmxlbmd0aCkpO1xyXG4gICAgICAgIGxldCBjYXNlVG9DaGVjayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFN0cmluZyhjYXNlUmFuZG9tLnBvc2l0aW9uKSk7XHJcbiAgICAgICAgd2hpbGUoY2FzZVRvQ2hlY2sgPT09IG51bGwgfHwgY2FzZVRvQ2hlY2sgPT09IHVuZGVmaW5lZCB8fCBjYXNlUmFuZG9tID09PSB1bmRlZmluZWQgfHwgY2FzZVJhbmRvbSA9PT0gbnVsbCl7XHJcbiAgICAgICAgICAgIGNhc2VSYW5kb20gPSB0aGlzLmdldENhc2VCeVBvc2l0aW9uKE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSp0aGlzLmxpc3RPZkNhc2VzLmxlbmd0aCkpO1xyXG4gICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNhc2VSYW5kb207XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcclxuICAgICAqL1xyXG4gICAgZ2V0Tm9uQmxvY2tlZFJhbmRvbUNhc2UoKTogQ2FzZXtcclxuICAgICAgICBjb25zb2xlLmxvZygodGhpcy5saXN0T2ZDYXNlcy5sZW5ndGgtMSkpO1xyXG4gICAgICAgIGxldCBjYXNlUmFuZG9tID0gdGhpcy5saXN0T2ZDYXNlc1tNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkqKHRoaXMubGlzdE9mQ2FzZXMubGVuZ3RoLTEpKV07XHJcbiAgICAgICAgd2hpbGUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU3RyaW5nKGNhc2VSYW5kb20ucG9zaXRpb24pKSA9PT0gbnVsbCB8fCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChTdHJpbmcoY2FzZVJhbmRvbS5wb3NpdGlvbikpID09PSB1bmRlZmluZWQgfHwgY2FzZVJhbmRvbSA9PT0gdW5kZWZpbmVkIHx8IGNhc2VSYW5kb20gPT09IG51bGwgfHwgY2FzZVJhbmRvbS5pc0Jsb2NrZWQgPT09IHRydWUpe1xyXG4gICAgICAgICAgICBjYXNlUmFuZG9tID0gdGhpcy5saXN0T2ZDYXNlc1tNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkqKHRoaXMubGlzdE9mQ2FzZXMubGVuZ3RoLTEpKV07XHJcbiAgICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2FzZVJhbmRvbTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICovXHJcbiAgICBnZXRBdmFpbGFibGVSYW5kb21DYXNlKCk6IENhc2V7XHJcbiAgICAgICAgY29uc29sZS5sb2coKHRoaXMubGlzdE9mQ2FzZXMubGVuZ3RoLTEpKTtcclxuICAgICAgICBsZXQgY2FzZVJhbmRvbSA9IHRoaXMubGlzdE9mQ2FzZXNbTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKih0aGlzLmxpc3RPZkNhc2VzLmxlbmd0aC0xKSldO1xyXG4gICAgICAgIHdoaWxlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFN0cmluZyhjYXNlUmFuZG9tLnBvc2l0aW9uKSkgPT09IG51bGwgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoU3RyaW5nKGNhc2VSYW5kb20ucG9zaXRpb24pKSA9PT0gdW5kZWZpbmVkIHx8IGNhc2VSYW5kb20gPT09IHVuZGVmaW5lZCB8fCBjYXNlUmFuZG9tID09PSBudWxsIHx8IGNhc2VSYW5kb20uaXNCbG9ja2VkID09PSB0cnVlIHx8IGNhc2VSYW5kb20uaXNBdmFpbGFibGUgPT09IGZhbHNlKXtcclxuICAgICAgICAgICAgY2FzZVJhbmRvbSA9IHRoaXMubGlzdE9mQ2FzZXNbTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKih0aGlzLmxpc3RPZkNhc2VzLmxlbmd0aC0xKSldO1xyXG4gICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGNhc2VSYW5kb207XHJcbiAgICB9XHJcblxyXG4gICAgZHVwbGljYXRlTGlzdE9mQ2FzZSgpOiBBcnJheTxDYXNlPntcclxuICAgICAgICBsZXQgbGlzdE9mQ2FzZXNUZW1wOiBBcnJheTxDYXNlPiA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IENhc2VUZW1wIG9mIHRoaXMubGlzdE9mQ2FzZXMpIHtcclxuICAgICAgICAgICBsZXQgY2FzZVRvQWRkID0gQ2FzZVRlbXA7XHJcbiAgICAgICAgICAgbGlzdE9mQ2FzZXNUZW1wLnB1c2goY2FzZVRvQWRkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpc3RPZkNhc2VzVGVtcDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRmllbGQ7IiwiaW1wb3J0IEZpZWxkIGZyb20gXCIuLi8uLi9maWVsZC9tb2RlbC9maWVsZFwiO1xyXG5pbXBvcnQgV2VhcG9uIGZyb20gXCIuLi8uLi93ZWFwb24vbW9kZWwvd2VhcG9uXCI7XHJcblxyXG5cclxuYWJzdHJhY3QgY2xhc3MgTG9naWNXZWFwb24ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0gcGFydHlGaWVsZCBcclxuICAgICAqIEBwYXJhbSBpY29uV2VhcG9uIFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcGFpbnRXZWFwb24ocGFydHlGaWVsZDogRmllbGQsIGljb25XZWFwb246IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGxldCBjYXNlV2VhcG9uID0gcGFydHlGaWVsZC5nZXRBdmFpbGFibGVSYW5kb21DYXNlKCk7XHJcbiAgICAgICAgbGV0IHdlYXBvbiA9IG5ldyBXZWFwb24oNSwgaWNvbldlYXBvbiwgY2FzZVdlYXBvbik7XHJcbiAgICAgICAgbGV0IGltZ1dlYXBvbjogSFRNTEltYWdlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIik7XHJcbiAgICAgICAgbGV0IHNwYW5FbHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgICBzcGFuRWx0LmNsYXNzTGlzdC5hZGQoXCJ3ZWFwb25cIik7XHJcbiAgICAgICAgaW1nV2VhcG9uLnNyYyA9IHdlYXBvbi5pY29uVXJsO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS5tYXhIZWlnaHQgPSBcIjEwMCVcIjtcclxuICAgICAgICBpbWdXZWFwb24uc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XHJcbiAgICAgICAgaW1nV2VhcG9uLnN0eWxlLnRvcCA9IFwiMFwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS5sZWZ0ID0gXCItNzVweFwiO1xyXG4gICAgICAgIGltZ1dlYXBvbi5zdHlsZS56SW5kZXggPSBcIjIwXCI7XHJcbiAgICAgICAgc3BhbkVsdC5hcHBlbmRDaGlsZChpbWdXZWFwb24pO1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFN0cmluZyhjYXNlV2VhcG9uLnBvc2l0aW9uKSkuYXBwZW5kQ2hpbGQoc3BhbkVsdCk7XHJcbiAgICAgICAgcGFydHlGaWVsZC5saXN0T2ZDYXNlc1tjYXNlV2VhcG9uLnBvc2l0aW9uXS5pc0F2YWlsYWJsZSA9IGZhbHNlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMb2dpY1dlYXBvbjsiLCJpbXBvcnQgQ2FzZSBmcm9tIFwiLi4vLi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcblxyXG4vL1RoaXMgY2xhc3MgZm9yIHRoZSBmaWVsZHNcclxuY2xhc3MgV2VhcG9uIHtcclxuICAgLy9maWVsZCBcclxuICAgZGFtYWdlOiBudW1iZXI7XHJcbiAgIGljb25Vcmw6IHN0cmluZztcclxuICAgY2FzZTogQ2FzZTtcclxuXHJcbiAgIC8vY29uc3RydWN0b3IgXHJcbiAgIGNvbnN0cnVjdG9yKGRhbWFnZTogbnVtYmVyLCBpY29uVXJsOiBzdHJpbmcsIHdlYXBvbkNhc2U6IENhc2UpIHtcclxuICAgICAgdGhpcy5kYW1hZ2UgPSBkYW1hZ2U7XHJcbiAgICAgIHRoaXMuaWNvblVybCA9IGljb25Vcmw7XHJcbiAgICAgIHRoaXMuY2FzZSA9IHdlYXBvbkNhc2U7XHJcbiAgIH1cclxuXHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBXZWFwb247IiwiXHJcbmltcG9ydCBDYXNlIGZyb20gXCIuL2VudGl0aWVzL2Nhc2UvbW9kZWwvY2FzZVwiO1xyXG5pbXBvcnQgRmllbGQgZnJvbSBcIi4vZW50aXRpZXMvZmllbGQvbW9kZWwvZmllbGRcIjtcclxuaW1wb3J0IExvZ2ljRmllbGQgZnJvbSBcIi4vZW50aXRpZXMvZmllbGQvbG9naWMvbG9naWNGaWVsZFwiO1xyXG5cclxubGV0IGZpZWxkRm9yR2FtZSA9IExvZ2ljRmllbGQuZ2VuZXJhdGVNYXAoOCwgNik7XHJcblxyXG5Mb2dpY0ZpZWxkLnBhaW50RmllbGQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWdodFwiKSwgZmllbGRGb3JHYW1lKTtcclxuXHJcbkxvZ2ljRmllbGQuc2V0V2VhcG9uKGZpZWxkRm9yR2FtZSk7XHJcblxyXG5Mb2dpY0ZpZWxkLnNldENoYXJhY3RlcnMoZmllbGRGb3JHYW1lKTtcclxuXHJcbiJdfQ==
