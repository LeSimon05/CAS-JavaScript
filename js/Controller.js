function calcOneNumber(z, operator) {

    document.getElementById("resultCell").style.visibility = "visible"; //Da das Ergebnisfeld unsichtbar ist (siehe Kommentar in index.html), wird es wieder sichtbar gemacht
    
    try {
        z = math.complex(z); //Umwandeln von z von einem String in ein math.complex
    } catch (error) {
        console.log(error);
        document.getElementById("resultCell").innerHTML = decodeURI("ung%C3%BCltige Eingabe");
        return;
    }

    document.getElementById("resultCell").innerHTML = calculateOneNumber(z, operator);
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
        //Bei Ausfuehren der Funktion werden z1 sowie z2 als String uebergeben, weshalb sie zuerst in math.complex umgewandelt werden muessen
        z1 = math.complex(z1); 
        z2 = math.complex(z2);
    } catch (error) {
        console.log(error);
        document.getElementById("resultCell").innerHTML = decodeURI("ung%C3%BCltige Eingabe");
        return;
    }

    document.getElementById("resultCell").innerHTML = calculateTwoNumbers(z1, z2, operator);
}

for (let td of document.getElementsByClassName("operator2ButtonCell")) {
    td.firstChild.onclick = function() {calcTwoNumbers(document.getElementById("z1Input").value, document.getElementById("z2Input").value, td.firstChild.name);};
}


function reset() {
    document.getElementById("resultCell").innerHTML = "cleared";
    document.getElementById("resultCell").style.visibility = "hidden";
    document.getElementById("z1Input").value = "";
    document.getElementById("z2Input").value = "";
}

document.getElementById("resetButton").onclick = function() {reset();};