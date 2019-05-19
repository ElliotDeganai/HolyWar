function getData() {
    var key = "img_field_url";
    var imgUrlJson = [];
    ajaxGet("http://localhost/royalFight/data/fight.json", function (reponse) {
        // Transforme la réponse en tableau d'objets JavaScript
        imgUrlJson = JSON.parse(reponse);
        console.log(imgUrlJson);
    });
    console.log(imgUrlJson);
    return imgUrlJson;
}
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
//This class will generate all the different objects needed for the game
var Generator = /** @class */ (function () {
    function Generator() {
    }
    //function 
    Generator.prototype.generateMap = function (numberOfCaseWidth, numberOfCaseHeight) {
        var totalNumberOfCases = numberOfCaseWidth * numberOfCaseHeight;
        var numberOfBlockedCases = Math.round(totalNumberOfCases / 5);
        var numberOfNonBlockedCases = totalNumberOfCases - numberOfBlockedCases;
        var listOfCases = [];
        var imgUrlJson = getData();
        console.log(imgUrlJson);
        console.log(imgUrlJson);
        var partyField = new Field(numberOfCaseWidth, numberOfCaseHeight, listOfCases);
        console.log(totalNumberOfCases);
        for (var i = 0; i < totalNumberOfCases; i++) {
            if (numberOfBlockedCases > 0) {
                var blockedCase = new Case("../assets/img/blocked-field/tile-2D.png", true, false, i);
                partyField.addCase(blockedCase);
                numberOfBlockedCases = numberOfBlockedCases - 1;
            }
            else {
                var nonBlockedCase = new Case("../assets/img/normal-field/tile-2D.png", false, true, i);
                partyField.addCase(nonBlockedCase);
            }
        }
        return partyField;
    };
    return Generator;
}());
//This class will create and fill the html elemenets of our webpage
var Painter = /** @class */ (function () {
    function Painter() {
    }
    //function 
    Painter.prototype.paintField = function (elementToFill, partyField) {
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
    return Painter;
}());
var gen = new Generator();
var paint = new Painter();
var fieldForGame = gen.generateMap(8, 6);
paint.paintField(document.getElementById("fight"), fieldForGame);
