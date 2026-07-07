//Darstellungskonstanten fuer das Koordinatensystem
const AXIS_COLOR = "#000000";
const ARROW_COLOR = "#ff0000";
const AXIS_LINE_WIDTH = 1;
const ARROW_LINE_WIDTH = 2;
const LABEL_FONT = "12px Arial";
const TICK_HALF_LENGTH = 10; //halbe Laenge eines Skalenstrichs (in Pixeln)
const LABEL_GAP = 25; //Abstand der Achsenbeschriftung von der jeweiligen Achse
const LABEL_BASELINE_NUDGE = 3; //vertikale Feinkorrektur der y-Achsen-Beschriftung
const SHARPEN_OFFSET = 0.5; //Verschiebung um halbes Pixel gegen unscharfe vertikale Linien

class View {
    constructor() {
        this.canvas = document.getElementById("Canvas");

        /*
        Canvas breitet sich so gross wie moeglich aus. Fuer scharfe Darstellung auf
        High-DPI-Displays wird das Bitmap um devicePixelRatio vergroessert; die
        CSS-Groesse wird auf die Containergroesse fixiert und der Kontext skaliert,
        damit der Zeichencode weiter in CSS-Pixeln rechnet. Ohne die CSS-Groesse
        wuerde das vergroesserte Bitmap ueber den Container hinauslaufen und die
        Darstellung "hineingezoomt" wirken.
        */
        let parent = this.canvas.parentNode;
        let pixelRatio = window.devicePixelRatio;
        this.width = parent.clientWidth; //logische Groesse in CSS-Pixeln
        this.height = parent.clientHeight;
        this.canvas.width = this.width * pixelRatio;
        this.canvas.height = this.height * pixelRatio;
        this.canvas.style.width = this.width + "px";
        this.canvas.style.height = this.height + "px";

        this.context = this.canvas.getContext("2d");
        this.context.scale(pixelRatio, pixelRatio);
        this.canvasScaling = 50;
        this.userScaling = 1;

        this.drawCoordinateSystem();
    }

    drawCoordinateSystem() {
        let centreX = this.width/2;
        let centreY = this.height/2;

        this.context.strokeStyle = AXIS_COLOR;
        this.context.lineWidth = AXIS_LINE_WIDTH;

        //x-Achse und y-Achse werden gezeichnet
        this.context.beginPath();
        this.context.moveTo(0, centreY);
        this.context.lineTo(this.width, centreY);
        this.context.moveTo(centreX + SHARPEN_OFFSET, 0);
        this.context.lineTo(centreX + SHARPEN_OFFSET, this.height);
        this.context.stroke();

        //Koordinatenbeschriftung wird formatiert
        this.context.textAlign = "center";
        this.context.font = LABEL_FONT

        let decimals = this.getDecimalPlaces(this.userScaling);

        //x-Achse wird beschriftet (positive und negative Richtung)
        this.context.beginPath();
        for (let i = 0; i < centreX/this.canvasScaling; i++) {
            this.drawXAxisTick(i + 1, centreX, centreY, decimals);
            this.drawXAxisTick(-(i + 1), centreX, centreY, decimals);
        }
        this.context.stroke();

        //y-Achse wird beschriftet (positive und negative Richtung)
        this.context.beginPath();
        for (let i = 0; i < centreY/this.canvasScaling; i++) {
            this.drawYAxisTick(i + 1, centreX, centreY, decimals);
            this.drawYAxisTick(-(i + 1), centreX, centreY, decimals);
        }
        this.context.stroke();
    }

    //Zeichnet einen Skalenstrich samt Beschriftung auf der x-Achse beim n-ten Schritt (n auch negativ)
    drawXAxisTick(n, centreX, centreY, decimals) {
        let x = centreX + n * this.canvasScaling;
        this.context.moveTo(x + SHARPEN_OFFSET, centreY - TICK_HALF_LENGTH);
        this.context.lineTo(x + SHARPEN_OFFSET, centreY + TICK_HALF_LENGTH);
        this.context.fillText(math.round(n * this.userScaling, decimals), x, centreY + LABEL_GAP);
    }

    //Zeichnet einen Skalenstrich samt Beschriftung auf der y-Achse beim n-ten Schritt (n auch negativ)
    drawYAxisTick(n, centreX, centreY, decimals) {
        let y = centreY - n * this.canvasScaling;
        this.context.moveTo(centreX - TICK_HALF_LENGTH, y);
        this.context.lineTo(centreX + TICK_HALF_LENGTH, y);
        this.context.fillText(math.round(n * this.userScaling, decimals), centreX + LABEL_GAP, y + LABEL_BASELINE_NUDGE);
    }

    drawArrow(x, y) {
        this.context.strokeStyle = ARROW_COLOR;
        this.context.lineWidth = ARROW_LINE_WIDTH;
        this.context.beginPath();
        this.context.moveTo(this.width/2, this.height/2);
        this.context.lineTo(this.width/2 + x*this.canvasScaling/this.userScaling, this.height/2 - y*this.canvasScaling/this.userScaling);
        this.context.stroke();
    }

    reset() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.drawCoordinateSystem();
    }

    toggleScale(direction) {
        if (direction === "increase") {
            this.userScaling = this.nextScaleUp(this.userScaling);
        } else if (direction === "decrease") {
            this.userScaling = this.nextScaleDown(this.userScaling);
        }
        this.reset();
        return this.userScaling;
    }

    //Naechstgroessere Stufe der Maßstabsleiter: feiner Schritt unter 1, sonst um eine Groessenordnung
    nextScaleUp(scale) {
        if (scale < 0.1) return scale * 10;
        if (scale === 0.1) return 0.125;
        if (scale === 0.125 || scale === 0.25 || scale === 0.5) return scale * 2;
        if (scale >= 10 && scale < 100) return scale + 10;
        if (scale >= 100) return scale + 100;
        return scale + 1;
    }

    //Naechstkleinere Stufe der Maßstabsleiter; 0.00001 ist das Minimum (bleibt geklemmt)
    nextScaleDown(scale) {
        if (scale > 100) return scale - 100;
        if (scale > 10 && scale <= 100) return scale - 10;
        if (scale === 1 || scale === 0.5 || scale === 0.25) return scale / 2;
        if (scale === 0.125) return 0.1;
        if (scale <= 0.1 && scale > 0.00001) return scale / 10;
        if (scale === 0.00001) return scale;
        return scale - 1;
    }

    getDecimalPlaces(value) {
        if (Number.isInteger(value)) return 0;
        return value.toString().split(".")[1].length;
    }
}
