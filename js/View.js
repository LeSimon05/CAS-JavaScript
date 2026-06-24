class View {
    constructor() {
        this.canvas = document.getElementById("Canvas");
        
        //Canvas breitet sich so gross wie moeglich aus
        let td = this.canvas.parentNode;
        let ppi = window.devicePixelRatio;
        this.canvas.width = td.clientWidth * ppi;
        this.canvas.height = td.clientHeight * ppi;

        this.context = this.canvas.getContext("2d");
        this.canvasScaling = 50;
        this.userScaling = 1;
        

        /*
        Koordinatensystem wird gezeichnet
        */
        this.drawCoordinateSystem();
    }

    drawCoordinateSystem() {
        let centre_x = this.canvas.width/2;
        let centre_y = this.canvas.height/2;
        
        //Linienfarbe wird auf schwarz gesetzt und die Dicke der Linie wird auf 1 gesetzt
        this.context.strokeStyle = "#000000";
        this.context.lineWidth = 1;

        //x-Achse und y-Achse werden gezeichnet
        this.context.beginPath();
        this.context.moveTo(0, centre_y);
        this.context.lineTo(this.canvas.width, centre_y);
        this.context.moveTo(centre_x + 0.5, 0); //Damit vertikale Linien nicht unscharf erscheinen, muessen sie um 0.5 verschoben werden
        this.context.lineTo(centre_x + 0.5, this.canvas.height);
        this.context.stroke();

        //Koordinatenbeschriftung wird formatiert
        this.context.textAlign = "center";
        this.context.font = "12px Arial"

        let decimals = this.getDecimalPlaces(this.userScaling);

        //x-Achse wird beschriftet (positive und negative Richtung)
        this.context.beginPath();
        for (let i = 0; i < centre_x/this.canvasScaling; i++) {
            this.drawXAxisTick(i + 1, centre_x, centre_y, decimals);
            this.drawXAxisTick(-(i + 1), centre_x, centre_y, decimals);
        }
        this.context.stroke();

        //y-Achse wird beschriftet (positive und negative Richtung)
        this.context.beginPath();
        for (let i = 0; i < centre_y/this.canvasScaling; i++) {
            this.drawYAxisTick(i + 1, centre_x, centre_y, decimals);
            this.drawYAxisTick(-(i + 1), centre_x, centre_y, decimals);
        }
        this.context.stroke();
    }

    //Zeichnet einen Skalenstrich samt Beschriftung auf der x-Achse beim n-ten Schritt (n auch negativ)
    drawXAxisTick(n, centreX, centreY, decimals) {
        let x = centreX + n * this.canvasScaling;
        this.context.moveTo(x + 0.5, centreY - 10); //+0.5, damit vertikale Linien nicht unscharf erscheinen
        this.context.lineTo(x + 0.5, centreY + 10);
        this.context.fillText(math.round(n * this.userScaling, decimals), x, centreY + 25);
    }

    //Zeichnet einen Skalenstrich samt Beschriftung auf der y-Achse beim n-ten Schritt (n auch negativ)
    drawYAxisTick(n, centreX, centreY, decimals) {
        let y = centreY - n * this.canvasScaling;
        this.context.moveTo(centreX - 10, y);
        this.context.lineTo(centreX + 10, y);
        this.context.fillText(math.round(n * this.userScaling, decimals), centreX + 25, y + 3);
    }

    drawArrow(xDes, yDes) {
        this.context.strokeStyle = "#ff0000";
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.moveTo(this.canvas.width/2, this.canvas.height/2);
        this.context.lineTo(this.canvas.width/2 + xDes*this.canvasScaling/this.userScaling, this.canvas.height/2 - yDes*this.canvasScaling/this.userScaling);
        this.context.stroke();
    }

    reset() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

    getDecimalPlaces(i) {
        if (Number.isInteger(i)) return 0;
        else {
            return i.toString().split(".")[1].length;
        }
    }
}
