(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Case = /** @class */ (function () {
    //constructor 
    function Case(imgUrl, isBlocked, isAvailable, position) {
        this.imgUrl = imgUrl;
        this.isBlocked = isBlocked;
        this.isAvailable = isAvailable;
        this.position = position;
    }
    return Case;
}());
exports.default = Case;
},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var case_1 = require("../../case/model/case");
var field_1 = require("../model/field");
//This class will generate all the different objects needed for the game
var LogicField = /** @class */ (function () {
    function LogicField() {
    }
    //function 
    LogicField.generateMap = function (numberOfCaseWidth, numberOfCaseHeight) {
        var totalNumberOfCases = numberOfCaseWidth * numberOfCaseHeight;
        var numberOfBlockedCases = Math.round(totalNumberOfCases / 5);
        var numberOfNonBlockedCases = totalNumberOfCases - numberOfBlockedCases;
        var listOfCases = [];
        var partyField = new field_1.default(numberOfCaseWidth, numberOfCaseHeight, listOfCases);
        console.log(totalNumberOfCases);
        for (var i = 0; i < totalNumberOfCases; i++) {
            if (numberOfBlockedCases > 0) {
                var blockedCase = new case_1.default("http://localhost/royalFight/src/assets/img/blocked-field/tile-2D.png", true, false, i);
                partyField.addCase(blockedCase);
                numberOfBlockedCases = numberOfBlockedCases - 1;
            }
            else {
                var nonBlockedCase = new case_1.default("http://localhost/royalFight/src/assets/img/normal-field/tile-2D.png", false, true, i);
                partyField.addCase(nonBlockedCase);
            }
        }
        return partyField;
    };
    //This class will create and fill the html elemenets of our webpage
    //function 
    LogicField.paintField = function (elementToFill, partyField) {
        var nbrOfCaseToAdd = partyField.listOfCases.length - 1;
        var numberOfBlockedCases = partyField.nbrOfBlockedCase();
        var listOfNonBlockedCases = partyField.getNonBlockedCases();
        console.log(nbrOfCaseToAdd);
        for (var i = 0; i <= nbrOfCaseToAdd; i++) {
            var elementToAdd = document.createElement("img");
            var indiceCaseFullList = Math.round(Math.random() * nbrOfCaseToAdd);
            console.log(indiceCaseFullList);
            var indiceCaseNonBlockedList = Math.round(Math.random() * (listOfNonBlockedCases.length - 1));
            console.log(indiceCaseNonBlockedList);
            if (numberOfBlockedCases > 0) {
                elementToAdd.src = partyField.listOfCases[indiceCaseFullList].imgUrl;
                elementToAdd.classList.add("fond");
                elementToAdd.classList.add("img-responsive");
                elementToAdd.style.width = (Math.round(100 / partyField.numberOfCaseWidth)) - 1 + "%";
                console.log(elementToAdd.style.width);
                elementToAdd.style.height = (Math.round(100 / partyField.numberOfCaseHeight)) - 1 + "%";
                console.log(elementToAdd.style.height);
                elementToFill.appendChild(elementToAdd);
                if (partyField.listOfCases[indiceCaseFullList].isBlocked) {
                    numberOfBlockedCases = numberOfBlockedCases - 1;
                }
            }
            else {
                elementToAdd.src = listOfNonBlockedCases[indiceCaseNonBlockedList].imgUrl;
                elementToAdd.classList.add("fond");
                elementToAdd.classList.add("img-responsive");
                elementToAdd.style.width = (Math.round(100 / partyField.numberOfCaseWidth)) - 1 + "%";
                console.log(elementToAdd.style.width);
                elementToAdd.style.height = (Math.round(100 / partyField.numberOfCaseHeight)) - 1 + "%";
                console.log(elementToAdd.style.height);
                elementToFill.appendChild(elementToAdd);
            }
        }
    };
    return LogicField;
}());
exports.default = LogicField;
},{"../../case/model/case":1,"../model/field":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//This class for the fields
var Field = /** @class */ (function () {
    //constructor 
    function Field(numberOfCaseWidth, numberOfCaseHeight, listOfCases) {
        this.numberOfCaseWidth = numberOfCaseWidth;
        this.numberOfCaseHeight = numberOfCaseHeight;
        this.listOfCases = listOfCases;
    }
    //function 
    Field.prototype.addCase = function (caseToAdd) {
        this.listOfCases.push(caseToAdd);
    };
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
    return Field;
}());
exports.default = Field;
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logicField_1 = require("./entities/field/logic/logicField");
var fieldForGame = logicField_1.default.generateMap(8, 6);
logicField_1.default.paintField(document.getElementById("fight"), fieldForGame);
},{"./entities/field/logic/logicField":2}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZW50aXRpZXMvY2FzZS9tb2RlbC9jYXNlLnRzIiwic3JjL2VudGl0aWVzL2ZpZWxkL2xvZ2ljL2xvZ2ljRmllbGQudHMiLCJzcmMvZW50aXRpZXMvZmllbGQvbW9kZWwvZmllbGQudHMiLCJzcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7SUFPSSxjQUFjO0lBQ2QsY0FBWSxNQUFhLEVBQUUsU0FBaUIsRUFBRSxXQUFtQixFQUFFLFFBQWU7UUFDL0UsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDNUIsQ0FBQztJQUNKLFdBQUM7QUFBRCxDQWRELEFBY0UsSUFBQTtBQUVELGtCQUFlLElBQUksQ0FBQzs7OztBQ2hCckIsOENBQXlDO0FBQ3pDLHdDQUFtQztBQUdoQyx3RUFBd0U7QUFDeEU7SUFBQTtJQW1GRixDQUFDO0lBaEZFLFdBQVc7SUFDSixzQkFBVyxHQUFsQixVQUFtQixpQkFBd0IsRUFBRSxrQkFBeUI7UUFDbkUsSUFBSSxrQkFBa0IsR0FBWSxpQkFBaUIsR0FBRyxrQkFBa0IsQ0FBQztRQUN6RSxJQUFJLG9CQUFvQixHQUFXLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEdBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEUsSUFBSSx1QkFBdUIsR0FBVyxrQkFBa0IsR0FBRyxvQkFBb0IsQ0FBQztRQUNoRixJQUFJLFdBQVcsR0FBZ0IsRUFBRSxDQUFDO1FBRWxDLElBQUksVUFBVSxHQUFVLElBQUksZUFBSyxDQUFDLGlCQUFpQixFQUFFLGtCQUFrQixFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXRGLE9BQU8sQ0FBQyxHQUFHLENB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OiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNsYXNzIENhc2UgeyBcclxuICAgIC8vZmllbGQgXHJcbiAgICBpbWdVcmw6c3RyaW5nO1xyXG4gICAgaXNCbG9ja2VkOmJvb2xlYW47XHJcbiAgICBpc0F2YWlsYWJsZTpib29sZWFuO1xyXG4gICAgcG9zaXRpb246bnVtYmVyO1xyXG4gICAgXHJcbiAgICAvL2NvbnN0cnVjdG9yIFxyXG4gICAgY29uc3RydWN0b3IoaW1nVXJsOnN0cmluZywgaXNCbG9ja2VkOmJvb2xlYW4sIGlzQXZhaWxhYmxlOmJvb2xlYW4sIHBvc2l0aW9uOm51bWJlcikgeyBcclxuICAgICAgIHRoaXMuaW1nVXJsID0gaW1nVXJsO1xyXG4gICAgICAgdGhpcy5pc0Jsb2NrZWQgPSBpc0Jsb2NrZWQ7IFxyXG4gICAgICAgdGhpcy5pc0F2YWlsYWJsZSA9IGlzQXZhaWxhYmxlO1xyXG4gICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xyXG4gICAgfSAgXHJcbiB9XHJcblxyXG4gZXhwb3J0IGRlZmF1bHQgQ2FzZTsiLCJpbXBvcnQgQ2FzZSBmcm9tIFwiLi4vLi4vY2FzZS9tb2RlbC9jYXNlXCI7XHJcbmltcG9ydCBGaWVsZCBmcm9tIFwiLi4vbW9kZWwvZmllbGRcIjtcclxuICAgXHJcbiAgIFxyXG4gICAvL1RoaXMgY2xhc3Mgd2lsbCBnZW5lcmF0ZSBhbGwgdGhlIGRpZmZlcmVudCBvYmplY3RzIG5lZWRlZCBmb3IgdGhlIGdhbWVcclxuICAgYWJzdHJhY3QgY2xhc3MgTG9naWNGaWVsZCB7IFxyXG4gIFxyXG4gIFxyXG4gICAgLy9mdW5jdGlvbiBcclxuICAgIHN0YXRpYyBnZW5lcmF0ZU1hcChudW1iZXJPZkNhc2VXaWR0aDpudW1iZXIsIG51bWJlck9mQ2FzZUhlaWdodDpudW1iZXIpOkZpZWxkIHsgXHJcbiAgICAgICBsZXQgdG90YWxOdW1iZXJPZkNhc2VzOiBudW1iZXIgPSAgbnVtYmVyT2ZDYXNlV2lkdGggKiBudW1iZXJPZkNhc2VIZWlnaHQ7XHJcbiAgICAgICBsZXQgbnVtYmVyT2ZCbG9ja2VkQ2FzZXM6IG51bWJlciA9IE1hdGgucm91bmQodG90YWxOdW1iZXJPZkNhc2VzLzUpO1xyXG4gICAgICAgbGV0IG51bWJlck9mTm9uQmxvY2tlZENhc2VzOiBudW1iZXIgPSB0b3RhbE51bWJlck9mQ2FzZXMgLSBudW1iZXJPZkJsb2NrZWRDYXNlcztcclxuICAgICAgIGxldCBsaXN0T2ZDYXNlczogQXJyYXk8Q2FzZT4gPSBbXTtcclxuXHJcbiAgICAgICBsZXQgcGFydHlGaWVsZDogRmllbGQgPSBuZXcgRmllbGQobnVtYmVyT2ZDYXNlV2lkdGgsIG51bWJlck9mQ2FzZUhlaWdodCwgbGlzdE9mQ2FzZXMpO1xyXG5cclxuICAgICAgIGNvbnNvbGUubG9nKHRvdGFsTnVtYmVyT2ZDYXNlcyk7XHJcblxyXG4gICAgICAgXHJcbiAgICAgICBmb3IobGV0IGk9MDsgaSA8IHRvdGFsTnVtYmVyT2ZDYXNlczsgaSsrKXtcclxuXHJcbiAgICAgICAgIFxyXG4gICAgICAgICAgICBpZihudW1iZXJPZkJsb2NrZWRDYXNlcyA+IDApe1xyXG4gICAgICAgICAgIGxldCBibG9ja2VkQ2FzZTogQ2FzZSA9IG5ldyBDYXNlKFwiaHR0cDovL2xvY2FsaG9zdC9yb3lhbEZpZ2h0L3NyYy9hc3NldHMvaW1nL2Jsb2NrZWQtZmllbGQvdGlsZS0yRC5wbmdcIiwgdHJ1ZSwgZmFsc2UsIGkpO1xyXG4gICAgICAgICAgICBwYXJ0eUZpZWxkLmFkZENhc2UoYmxvY2tlZENhc2UpO1xyXG4gICAgICAgICAgICBudW1iZXJPZkJsb2NrZWRDYXNlcyA9IG51bWJlck9mQmxvY2tlZENhc2VzIC0gMTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxldCBub25CbG9ja2VkQ2FzZTogQ2FzZSA9IG5ldyBDYXNlKFwiaHR0cDovL2xvY2FsaG9zdC9yb3lhbEZpZ2h0L3NyYy9hc3NldHMvaW1nL25vcm1hbC1maWVsZC90aWxlLTJELnBuZ1wiLCBmYWxzZSwgdHJ1ZSwgaSk7XHJcbiAgICAgICAgICAgICAgICBwYXJ0eUZpZWxkLmFkZENhc2Uobm9uQmxvY2tlZENhc2UpOyAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICBcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgICAgIHJldHVybiBwYXJ0eUZpZWxkO1xyXG4gICAgfSBcclxuXHJcblxyXG5cclxuIC8vVGhpcyBjbGFzcyB3aWxsIGNyZWF0ZSBhbmQgZmlsbCB0aGUgaHRtbCBlbGVtZW5ldHMgb2Ygb3VyIHdlYnBhZ2VcclxuXHJcblxyXG4gXHJcbiAgICAvL2Z1bmN0aW9uIFxyXG4gICAgc3RhdGljIHBhaW50RmllbGQoZWxlbWVudFRvRmlsbDogSFRNTEVsZW1lbnQsIHBhcnR5RmllbGQ6RmllbGQpOnZvaWR7IFxyXG4gICAgICAgIGxldCBuYnJPZkNhc2VUb0FkZDogbnVtYmVyID0gcGFydHlGaWVsZC5saXN0T2ZDYXNlcy5sZW5ndGgtMTtcclxuICAgICAgICBsZXQgbnVtYmVyT2ZCbG9ja2VkQ2FzZXM6IG51bWJlciA9IHBhcnR5RmllbGQubmJyT2ZCbG9ja2VkQ2FzZSgpO1xyXG4gICAgICAgIGxldCBsaXN0T2ZOb25CbG9ja2VkQ2FzZXM6IEFycmF5PENhc2U+ID0gcGFydHlGaWVsZC5nZXROb25CbG9ja2VkQ2FzZXMoKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhuYnJPZkNhc2VUb0FkZClcclxuXHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGkgPD0gbmJyT2ZDYXNlVG9BZGQ7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZWxlbWVudFRvQWRkOiBIVE1MSW1hZ2VFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcclxuICAgICAgICAgICAgbGV0IGluZGljZUNhc2VGdWxsTGlzdDogbnVtYmVyID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKm5ick9mQ2FzZVRvQWRkKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coaW5kaWNlQ2FzZUZ1bGxMaXN0KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBpbmRpY2VDYXNlTm9uQmxvY2tlZExpc3Q6IG51bWJlciA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSoobGlzdE9mTm9uQmxvY2tlZENhc2VzLmxlbmd0aC0xKSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGluZGljZUNhc2VOb25CbG9ja2VkTGlzdCk7XHJcblxyXG4gICAgICAgICAgICBpZihudW1iZXJPZkJsb2NrZWRDYXNlcyA+IDApe1xyXG5cclxuICAgICAgICAgICAgZWxlbWVudFRvQWRkLnNyYyA9IHBhcnR5RmllbGQubGlzdE9mQ2FzZXNbaW5kaWNlQ2FzZUZ1bGxMaXN0XS5pbWdVcmw7XHJcbiAgICAgICAgICAgIGVsZW1lbnRUb0FkZC5jbGFzc0xpc3QuYWRkKFwiZm9uZFwiKTtcclxuICAgICAgICAgICAgZWxlbWVudFRvQWRkLmNsYXNzTGlzdC5hZGQoXCJpbWctcmVzcG9uc2l2ZVwiKTtcclxuICAgICAgICAgICAgZWxlbWVudFRvQWRkLnN0eWxlLndpZHRoID0gKE1hdGgucm91bmQoMTAwL3BhcnR5RmllbGQubnVtYmVyT2ZDYXNlV2lkdGgpKS0xICsgXCIlXCI7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVsZW1lbnRUb0FkZC5zdHlsZS53aWR0aCApO1xyXG4gICAgICAgICAgICBlbGVtZW50VG9BZGQuc3R5bGUuaGVpZ2h0ID0gKE1hdGgucm91bmQoMTAwL3BhcnR5RmllbGQubnVtYmVyT2ZDYXNlSGVpZ2h0KSktMSArIFwiJVwiO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlbGVtZW50VG9BZGQuc3R5bGUuaGVpZ2h0KTtcclxuICAgICAgICAgICAgZWxlbWVudFRvRmlsbC5hcHBlbmRDaGlsZChlbGVtZW50VG9BZGQpO1xyXG5cclxuICAgICAgICAgICAgICAgaWYocGFydHlGaWVsZC5saXN0T2ZDYXNlc1tpbmRpY2VDYXNlRnVsbExpc3RdLmlzQmxvY2tlZCl7XHJcbiAgICAgICAgICAgICAgICAgIG51bWJlck9mQmxvY2tlZENhc2VzID0gbnVtYmVyT2ZCbG9ja2VkQ2FzZXMgLSAxO1xyXG4gICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgZWxlbWVudFRvQWRkLnNyYyA9IGxpc3RPZk5vbkJsb2NrZWRDYXNlc1tpbmRpY2VDYXNlTm9uQmxvY2tlZExpc3RdLmltZ1VybDtcclxuICAgICAgICAgICAgICAgZWxlbWVudFRvQWRkLmNsYXNzTGlzdC5hZGQoXCJmb25kXCIpO1xyXG4gICAgICAgICAgICAgICBlbGVtZW50VG9BZGQuY2xhc3NMaXN0LmFkZChcImltZy1yZXNwb25zaXZlXCIpO1xyXG4gICAgICAgICAgICAgICBlbGVtZW50VG9BZGQuc3R5bGUud2lkdGggPSAoTWF0aC5yb3VuZCgxMDAvcGFydHlGaWVsZC5udW1iZXJPZkNhc2VXaWR0aCkpLTEgKyBcIiVcIjtcclxuICAgICAgICAgICAgICAgY29uc29sZS5sb2coZWxlbWVudFRvQWRkLnN0eWxlLndpZHRoICk7XHJcbiAgICAgICAgICAgICAgIGVsZW1lbnRUb0FkZC5zdHlsZS5oZWlnaHQgPSAoTWF0aC5yb3VuZCgxMDAvcGFydHlGaWVsZC5udW1iZXJPZkNhc2VIZWlnaHQpKS0xICsgXCIlXCI7XHJcbiAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVsZW1lbnRUb0FkZC5zdHlsZS5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICBlbGVtZW50VG9GaWxsLmFwcGVuZENoaWxkKGVsZW1lbnRUb0FkZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfSBcclxuIH1cclxuXHJcbiBleHBvcnQgZGVmYXVsdCBMb2dpY0ZpZWxkOyIsImltcG9ydCBDYXNlIGZyb20gXCIuLi8uLi9jYXNlL21vZGVsL2Nhc2VcIjtcclxuIFxyXG4gLy9UaGlzIGNsYXNzIGZvciB0aGUgZmllbGRzXHJcbiBjbGFzcyBGaWVsZCB7IFxyXG4gICAgLy9maWVsZCBcclxuICAgIG51bWJlck9mQ2FzZVdpZHRoOm51bWJlcjtcclxuICAgIG51bWJlck9mQ2FzZUhlaWdodDpudW1iZXI7XHJcbiAgICBsaXN0T2ZDYXNlczpBcnJheTxDYXNlPjtcclxuICBcclxuICAgIC8vY29uc3RydWN0b3IgXHJcbiAgICBjb25zdHJ1Y3RvcihudW1iZXJPZkNhc2VXaWR0aDpudW1iZXIsIG51bWJlck9mQ2FzZUhlaWdodDpudW1iZXIsIGxpc3RPZkNhc2VzOkFycmF5PENhc2U+KSB7IFxyXG4gICAgICAgdGhpcy5udW1iZXJPZkNhc2VXaWR0aCA9IG51bWJlck9mQ2FzZVdpZHRoO1xyXG4gICAgICAgdGhpcy5udW1iZXJPZkNhc2VIZWlnaHQgPSBudW1iZXJPZkNhc2VIZWlnaHQ7IFxyXG4gICAgICAgdGhpcy5saXN0T2ZDYXNlcyA9IGxpc3RPZkNhc2VzOyBcclxuICAgIH0gIFxyXG4gXHJcbiAgICAvL2Z1bmN0aW9uIFxyXG4gICAgYWRkQ2FzZShjYXNlVG9BZGQ6Q2FzZSk6dm9pZCB7IFxyXG4gICAgICAgdGhpcy5saXN0T2ZDYXNlcy5wdXNoKGNhc2VUb0FkZCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG5ick9mQmxvY2tlZENhc2UoKTpudW1iZXJ7XHJcbiAgICAgICBsZXQgbmJyT2ZCbG9ja2VkQ2FzZTpudW1iZXIgPSAwO1xyXG4gICAgICAgZm9yKGxldCBicmljayBvZiB0aGlzLmxpc3RPZkNhc2VzKXtcclxuICAgICAgICAgIGlmKGJyaWNrLmlzQmxvY2tlZCl7XHJcbiAgICAgICAgICAgIG5ick9mQmxvY2tlZENhc2UgPSBuYnJPZkJsb2NrZWRDYXNlICsgMTtcclxuICAgICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIHJldHVybiBuYnJPZkJsb2NrZWRDYXNlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5vbkJsb2NrZWRDYXNlcygpOkFycmF5PENhc2U+e1xyXG4gICAgICBsZXQgbGlzdE9mTm9uQmxvY2tlZENhc2VzOkFycmF5PENhc2U+ID0gW107XHJcbiAgICAgIGZvcihsZXQgYnJpY2sgb2YgdGhpcy5saXN0T2ZDYXNlcyl7XHJcbiAgICAgICAgIGlmKCFicmljay5pc0Jsb2NrZWQpe1xyXG4gICAgICAgICAgICBsaXN0T2ZOb25CbG9ja2VkQ2FzZXMucHVzaChicmljayk7XHJcbiAgICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbGlzdE9mTm9uQmxvY2tlZENhc2VzO1xyXG4gICAgfVxyXG4gfVxyXG5cclxuIGV4cG9ydCBkZWZhdWx0IEZpZWxkOyIsIlxyXG4gaW1wb3J0IENhc2UgZnJvbSBcIi4vZW50aXRpZXMvY2FzZS9tb2RlbC9jYXNlXCI7XHJcbiBpbXBvcnQgRmllbGQgZnJvbSBcIi4vZW50aXRpZXMvZmllbGQvbW9kZWwvZmllbGRcIjtcclxuIGltcG9ydCBMb2dpY0ZpZWxkIGZyb20gXCIuL2VudGl0aWVzL2ZpZWxkL2xvZ2ljL2xvZ2ljRmllbGRcIjtcclxuXHJcblxyXG4gIGxldCBmaWVsZEZvckdhbWUgPSBMb2dpY0ZpZWxkLmdlbmVyYXRlTWFwKDgsIDYpO1xyXG4gXHJcbiAgTG9naWNGaWVsZC5wYWludEZpZWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlnaHRcIiksIGZpZWxkRm9yR2FtZSk7XHJcbiBcclxuICAiXX0=
