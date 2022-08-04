//Aufzaehlung aller moeglichen Operatoren
const Operators = {
    add: 0,
    subtract: 1,
    multiply: 2,
    divide: 3,
    absoluteValue: 4,
    vectorAngle: 5,
    conjugate: 6,
    inverse: 7,
};

//Funktion, um zwei Zahlen miteinander zu verrechnen
function calculateTwoNumbers(z1, z2, operator) {
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
    return math.round(ans, 2);
}

//Funktion, um einen Operator auf eine Zahl anzuwenden
function calculateOneNumber(z, operator) {
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
function getVectorAngle(z) {
    let a = z.re;
    let b = z.im;
    let c = math.divide(b, a);

    let angle = math.divide(math.atan(c), Math.PI) * 180;
    return math.round(angle, 2) + decodeURI('%C2%B0');
}
