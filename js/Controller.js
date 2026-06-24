let model = new Model();
let view = new View();

//Haeufig genutzte DOM-Elemente einmal referenzieren statt wiederholt abzufragen
const resultCell = document.getElementById("resultCell");
const z1Input = document.getElementById("z1Input");
const z2Input = document.getElementById("z2Input");
const scaleLabel = document.getElementById("scaleLabel");

//Wandelt eine Eingabe in eine komplexe Zahl um; Komma wird als Dezimaltrenner akzeptiert (math.js erwartet Punkt)
function parseComplexInput(raw) {
    return math.complex(raw.replace(/,/g, "."));
}

//Zeigt den Hinweis auf eine ungueltige Eingabe an und protokolliert den Fehler
function showInvalidInput(error) {
    console.log(error);
    resultCell.innerHTML = "ungültige Eingabe";
}

function calcOneNumber(z, operator) {

    resultCell.style.visibility = "visible"; //Da das Ergebnisfeld unsichtbar ist (siehe Kommentar in index.html), wird es wieder sichtbar gemacht
    
    try {
        z = parseComplexInput(z);
    } catch (error) {
        showInvalidInput(error);
        return;
    }

    let ans = model.calculateOneNumber(z, operator);
    resultCell.innerHTML = ans;
    switch (operator) {
        case Operators.absoluteValue:
        case Operators.vectorAngle:
            model.addNumber(z);
            view.drawArrow(z.re, z.im);
            break;
        case Operators.conjugate:
        case Operators.inverse:
            ans = math.complex(ans);
            model.addNumber(ans);
            view.drawArrow(ans.re, ans.im);
            break;
    }
}

for (let td of document.getElementsByClassName("operatorButtonCellZ1")) {
    td.firstChild.onclick = function() {calcOneNumber(z1Input.value, td.firstChild.name);};
}

for (let td of document.getElementsByClassName("operatorButtonCellZ2")) {
    td.firstChild.onclick = function() {calcOneNumber(z2Input.value, td.firstChild.name);};
}


function calcTwoNumbers(z1, z2, operator) {
    resultCell.style.visibility = "visible";
    
    try {
        z1 = parseComplexInput(z1);
        z2 = parseComplexInput(z2);
    } catch (error) {
        showInvalidInput(error);
        return;
    }

    let ans;
    try {
        ans = model.calculateTwoNumbers(z1, z2, operator);
    } catch (error) {
        if (error instanceof DivisionByZeroError) {
            resultCell.innerHTML = "Nicht definiert!"; //Division durch 0 hat kein darstellbares Ergebnis
            return;
        }
        throw error;
    }

    model.addNumber(ans);
    view.drawArrow(ans.re, ans.im);
    resultCell.innerHTML = ans;
}

for (let td of document.getElementsByClassName("operator2ButtonCell")) {
    td.firstChild.onclick = function() {calcTwoNumbers(z1Input.value, z2Input.value, td.firstChild.name);};
}


function reset() {
    resultCell.innerHTML = "cleared";
    resultCell.style.visibility = "hidden";
    z1Input.value = "";
    z2Input.value = "";

    view.reset();
}

document.getElementById("resetButton").onclick = function() {
    reset();
    model.resetListofAnswers();
};

document.getElementById("decreaseScaleButton").onclick = function() {
    scaleLabel.innerHTML = view.toggleScale("decrease");
    for (let num of model.getListofAnswers()) {
        view.drawArrow(num[0], num[1]);
    }
};

document.getElementById("increaseScaleButton").onclick = function() {
    scaleLabel.innerHTML = view.toggleScale("increase");
    for (let num of model.getListofAnswers()) {
        view.drawArrow(num[0], num[1]);
    }
};
