//Aufzaehlung aller moeglichen Operatoren
const Operators = {
    add: "add",
    subtract: "subtract",
    multiply: "multiply",
    divide: "divide",
    absoluteValue: "absoluteValue",
    vectorAngle: "vectorAngle",
    conjugate: "conjugate",
    inverse: "inverse",
};

class Model {

    constructor() {
        this.listOfAnswers = [];
    }

    //Funktion, um zwei Zahlen miteinander zu verrechnen
    calculateTwoNumbers(z1, z2, operator) {    
        let ans;
        switch(operator) {
            case Operators.add:
                ans = math.add(z1, z2);
                break;
            case Operators.subtract:
                ans = math.subtract(z1, z2);
                break;
            case Operators.multiply:
                ans = math.multiply(z1, z2);
                break;
            case Operators.divide:
                ans = math.divide(z1, z2);
                break;
            default:
                return "Wrong Operator";
        }
        return math.round(ans, 2); //Das Ergebnis wird vorher auf zwei Nachkommastellen gerundet und dann zurueckgegeben
    }

    //Funktion, um einen Operator auf eine Zahl anzuwenden
    calculateOneNumber(z, operator) {    
        switch(operator) {
            case Operators.absoluteValue:
                return math.round(math.abs(z), 2);
            case Operators.vectorAngle:
                return this.getVectorAngle(z);
            case Operators.conjugate:
                return math.conj(z);
            case Operators.inverse:
                return z.inverse(z);
        }
    }

    //Funktion, die den Winkel des Zeigers auf der Gausschen Zahlenebene berechnet
    getVectorAngle(z) {

        /*
        atan2 nutzt Real- und Imaginaerteil getrennt und erhaelt so den Quadranten
        (Ergebnis im Bereich (-180°, 180°]); atan(im/re) verloere ihn.
        */
        let a = z.re;
        let b = z.im;

        let angle = math.divide(math.atan2(b, a), Math.PI) * 180;
        return math.round(angle, 2) + "°";
    }

    addNumber(z) {
        this.listOfAnswers[this.listOfAnswers.length] = [z.re, z.im];
    }

    getListofAnswers() {
        return this.listOfAnswers;
    }

    resetListofAnswers() {
        this.listOfAnswers = [];
    }
}
