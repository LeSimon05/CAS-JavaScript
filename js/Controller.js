let model = new Model();
let view = new View();

function calcOneNumber(z, operator) {

    document.getElementById("resultCell").style.visibility = "visible"; //Da das Ergebnisfeld unsichtbar ist (siehe Kommentar in index.html), wird es wieder sichtbar gemacht
    
    try {
        z = z.replace(",", "."); //math.js arbeitet nicht mit Komma, sondern mit Punkt
        z = math.complex(z); //Umwandeln von z von einem String in ein math.complex
    } catch (error) {
        console.log(error);
        document.getElementById("resultCell").innerHTML = decodeURI("ung%C3%BCltige Eingabe");
        return;
    }

    let ans = model.calculateOneNumber(z, operator);
    document.getElementById("resultCell").innerHTML = ans;
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
    td.firstChild.onclick = function() {calcOneNumber(document.getElementById("z1Input").value, td.firstChild.name);};
}

for (let td of document.getElementsByClassName("operatorButtonCellZ2")) {
    td.firstChild.onclick = function() {calcOneNumber(document.getElementById("z2Input").value, td.firstChild.name);};
}


function calcTwoNumbers(z1, z2, operator) {
    document.getElementById("resultCell").style.visibility = "visible";
    
    try {
        //Punkt statt Komma
        z1 = z1.replace(",", ".");
        z2 = z2.replace(",", ".");
        //Bei Ausfuehren der Funktion werden z1 sowie z2 als String uebergeben, weshalb sie zuerst in math.complex umgewandelt werden muessen
        z1 = math.complex(z1); 
        z2 = math.complex(z2);
    } catch (error) {
        console.log(error);
        document.getElementById("resultCell").innerHTML = decodeURI("ung%C3%BCltige Eingabe");
        return;
    }

    let ans = model.calculateTwoNumbers(z1, z2, operator);

    /*
    Teilt man durch 0, kommt als Ergebnis Infinity raus (was eigentlich nicht stimmt)
    */
    if (ans == "Infinity") {
        ans = "Nicht definiert!";
    } else {
        model.addNumber(ans);
        view.drawArrow(ans.re, ans.im);
    }
    document.getElementById("resultCell").innerHTML = ans;
}

for (let td of document.getElementsByClassName("operator2ButtonCell")) {
    td.firstChild.onclick = function() {calcTwoNumbers(document.getElementById("z1Input").value, document.getElementById("z2Input").value, td.firstChild.name);};
}


function reset() {
    document.getElementById("resultCell").innerHTML = "cleared";
    document.getElementById("resultCell").style.visibility = "hidden";
    document.getElementById("z1Input").value = "";
    document.getElementById("z2Input").value = "";

    view.reset();
}

document.getElementById("resetButton").onclick = function() {
    reset();
    model.resetListofAnswers();
};

document.getElementById("decreaseScaleButton").onclick = function() {
    document.getElementById("scaleLabel").innerHTML = view.toggleScale("decrease");
    for (let num of model.getListofAnswers()) {
        view.drawArrow(num[0], num[1]);
    }
};

document.getElementById("increaseScaleButton").onclick = function() {
    document.getElementById("scaleLabel").innerHTML = view.toggleScale("increase");
    for (let num of model.getListofAnswers()) {
        view.drawArrow(num[0], num[1]);
    }
};
