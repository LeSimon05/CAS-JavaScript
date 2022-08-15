class View {
    constructor() {
        this.canvas = document.getElementById("Canvas");
        
        //Canvas breitet sich so gross wie moeglich aus
        let td = this.canvas.parentNode;
        let ppi = window.devicePixelRatio
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

        //x-Achse wird beschriftet
        this.context.beginPath();
        for (let i = 0; i < centre_x/this.canvasScaling; i++) {

            //in die positive Richtung
            this.context.moveTo(centre_x + ((i + 1) * this.canvasScaling) + 0.5, centre_y - 10);
            this.context.lineTo(centre_x + ((i + 1) * this.canvasScaling) + 0.5, centre_y + 10);
            this.context.fillText(math.round((i + 1)*this.userScaling, this.getDecimalPlaces(this.userScaling)), centre_x + ((i + 1) * this.canvasScaling), centre_y + 25);

            //in die negative Richtung
            this.context.moveTo(centre_x - ((i + 1) * this.canvasScaling) + 0.5, centre_y - 10);
            this.context.lineTo(centre_x - ((i + 1) * this.canvasScaling) + 0.5, centre_y + 10);
            this.context.fillText(math.round((-i - 1)*this.userScaling, this.getDecimalPlaces(this.userScaling)), centre_x - ((i + 1) * this.canvasScaling), centre_y + 25);

        }
        this.context.stroke();

        //y-Achse wird beschriftet
        this.context.beginPath();
        for (let i = 0; i < centre_y/this.canvasScaling; i++) {

            //in die postive Richtung
            this.context.moveTo(centre_x - 10, centre_y - ((i + 1) * this.canvasScaling));
            this.context.lineTo(centre_x + 10, centre_y - ((i + 1) * this.canvasScaling));
            this.context.fillText(math.round((i + 1)*this.userScaling, this.getDecimalPlaces(this.userScaling)), centre_x + 25, centre_y - ((i + 1) * this.canvasScaling) + 3);

            //in die negative Richtung
            this.context.moveTo(centre_x - 10, centre_y + ((i + 1) * this.canvasScaling));
            this.context.lineTo(centre_x + 10, centre_y + ((i + 1) * this.canvasScaling));
            this.context.fillText(math.round((-i - 1)*this.userScaling, this.getDecimalPlaces(this.userScaling)), centre_x + 25, centre_y + ((i + 1) * this.canvasScaling) + 3);
        }
        this.context.stroke();
    }

    drawArrow(xDes, yDes) {
        this.context.beginPath();
        this.context.moveTo(this.canvas.width/2, this.canvas.height/2);
        this.context.lineTo(this.canvas.width/2 + xDes*this.canvasScaling/this.userScaling, this.canvas.height/2 - yDes*this.canvasScaling/this.userScaling);
        this.context.strokeStyle = "#ff0000";
        this.context.lineWidth = 2;
        this.context.stroke();
    }

    reset() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawCoordinateSystem();
    }

    toggleScale(button) {
        switch(button) {
            case "increase":
                switch(true) {
                    case this.userScaling < 0.1:
                        this.userScaling *= 10;
                        break;
                    case this.userScaling == 0.1:
                        this.userScaling = 0.125;
                        break;
                    case this.userScaling == 0.125 || this.userScaling == 0.25 || this.userScaling == 0.5:
                        this.userScaling *= 2;
                        break;
                    case this.userScaling >= 10 && this.userScaling < 100:
                        this.userScaling += 10;
                        break;
                    case this.userScaling >= 100:
                        this.userScaling += 100;
                        break;
                    default:
                        this.userScaling++;
                        break;
                }
                break;
            case "decrease":
                switch(true) {
                    case this.userScaling > 100:
                        this.userScaling -= 100;
                        break;
                    case this.userScaling > 10 && this.userScaling <= 100:
                        this.userScaling -= 10;
                        break;
                    case this.userScaling == 1 || this.userScaling == 0.5 || this.userScaling == 0.25:
                        this.userScaling /= 2;
                        break;
                    case this.userScaling == 0.125:
                        this.userScaling = 0.1;
                        break;
                    case this.userScaling <= 0.1 && this.userScaling > 0.00001:
                        this.userScaling /= 10;
                        break;
                    case this.userScaling == 0.00001:
                        break;
                    default:
                        this.userScaling--;
                        break;
                }
                break;
            default:
                break;
        }
        this.reset();
        return this.userScaling;
    }

    getDecimalPlaces(i) {
        if (Number.isInteger(i)) return 0;
        else {
            return i.toString().split(".")[1].length;
        }
    }
}
