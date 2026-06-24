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

//Anzahl der Nachkommastellen, auf die Ergebnisse gerundet werden
const DECIMAL_PLACES = 2;

//Fehlertypen fuer ungueltige Berechnungen (statt magischer Sentinel-Strings)
class InvalidOperatorError extends Error {
    constructor(operator) {
        super(`Unbekannter Operator: ${operator}`);
        this.name = "InvalidOperatorError";
    }
}

class DivisionByZeroError extends Error {
    constructor() {
        super("Division durch 0");
        this.name = "DivisionByZeroError";
    }
}

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
                throw new InvalidOperatorError(operator);
        }

        let result = math.round(ans, DECIMAL_PLACES);
        //Division durch 0 ergibt das gerichtungslose Unendlich (re/im = Infinity) und ist kein gueltiges Ergebnis
        if (Math.abs(result.re) === Infinity) {
            throw new DivisionByZeroError();
        }
        return result;
    }

    //Funktion, um einen Operator auf eine Zahl anzuwenden
    calculateOneNumber(z, operator) {    
        switch(operator) {
            case Operators.absoluteValue:
                return math.round(math.abs(z), DECIMAL_PLACES);
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
        let re = z.re;
        let im = z.im;

        let angle = math.divide(math.atan2(im, re), Math.PI) * 180;
        return math.round(angle, DECIMAL_PLACES) + "°";
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
