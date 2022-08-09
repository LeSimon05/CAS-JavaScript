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
                return getVectorAngle(z);
            case Operators.conjugate:
                return math.conj(z);
            case Operators.inverse:
                return z.inverse(z);
        }
    }

    //Funktion, die den Winkel des Zeigers auf der Gausschen Zahlenebene berechnet
    getVectorAngle(z) {
        
        /*
        Fuer den Realteil und den imaginaeren Teil von z werden a und b deklariert
        c ist der Tangens von a und b
        */
        let a = z.re;
        let b = z.im;
        let c = math.divide(b, a);

        let angle = math.divide(math.atan(c), Math.PI) * 180;
        return math.round(angle, 2) + decodeURI('%C2%B0');
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
