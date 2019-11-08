// variable declarations
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.height = 300;
const center = canvas.width / 2;
const radius = center - 10;
const handleRad = 6;
const pi = Math.PI;
const pi2 = pi * 2;
ctx.lineWidth = 2;

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};

// helper functions
addEventListener('mousemove',
    function (event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

addEventListener('mousedown',
    function () {
        mouse.down = true;
    });

addEventListener('mouseup',
    function () {
        mouse.down = false;
    });

function getMouseAngle() {
    let r = distance(mouse.x, mouse.y, center, center);
    let relativeMouseX = (mouse.x - center) / r;
    let relativeMouseY = (-mouse.y + center) / r;
    let mouseAngle = Math.atan2(relativeMouseY, relativeMouseX);
    if (mouseAngle < 0) mouseAngle += pi2;
    return (mouseAngle);
};

function distance(x1, y1, x2, y2) {
    let xDiff = x2 - x1;
    let yDiff = y2 - y1;
    let d = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    return d;
};

function getPosFromAngle(angle) {
    let xPos = center + radius * Math.cos(angle);
    let yPos = center - radius * Math.sin(angle);
    return ({ x: xPos, y: yPos });
}

class pieInput {
    constructor(percents, radius, initialAngle = 0) {
        this.percents = percents;
        this.initialAngle = initialAngle;
        this.radius = radius;
        this.angles = [];
        this.mouseOver = new Array(this.percents.length).fill(false);
        this.grab = new Array(this.percents.length).fill(false);
        this.globalGrab = false;

        // check that percents sum to 1
        let valid = this.percents.reduce((a, b) => a + b, 0) === 1;
        if (!valid) console.error('pie chart input: percent array must sum to 1');

        // bind
        this.animate = this.animate.bind(this);
    }

    getAngles() {
        this.angles = [];
        let oldAngle = this.initialAngle;
        for (let i = 0; i < this.percents.length; i++) {
            let angle = (this.percents[i] * pi2) + oldAngle;
            this.angles.push(angle);
            oldAngle = angle;
        }
    }

    getPercentsFromAngles(newAngles) {
        let newPercents = [];
        for (let j = 0; j < newAngles.length - 1; j++) {
            let newA = (newAngles[j + 1] - newAngles[j]);
            if (newA < 0) newA += pi2;
            newPercents.push(newA / pi2);
        }
        let sum = newPercents.reduce((a, b) => a + b, 0);
        newPercents.push(1 - sum);
        newPercents = newPercents.map(x => Math.round(x * 100) / 100);
        let valid = true;
        newPercents.forEach(x => x < 0 ? valid = false : null);
        if (valid) {
            return newPercents;
        }
    }

    update() {
        // release all on mouseup
        if (!mouse.down) this.grab = new Array(this.grab.length).fill(false);

        for (let i = 0; i < this.angles.length; i++) {
            // draw line for each percent
            ctx.beginPath();
            ctx.moveTo(center, center);
            let linePos = getPosFromAngle(this.angles[i]);
            ctx.lineTo(linePos.x, linePos.y);
            ctx.stroke();

            // draw handle
            ctx.beginPath();
            ctx.arc(linePos.x, linePos.y, handleRad, 0, pi2);
            ctx.fill();

            // check for mouse over each handle
            let d = distance(mouse.x, mouse.y, linePos.x, linePos.y);
            if (d < 6) {
                this.mouseOver[i] = true;
            } else {
                this.mouseOver[i] = false;
            }

            // check for mouse down if hover
            if (this.mouseOver[i]) {
                if (mouse.down) {
                    if (!this.globalGrab) {
                        this.grab[i] = true;
                        this.globalGrab = true;
                    }
                } else {
                    this.grab[i] = false;
                    this.globalGrab = false;
                }
            }

            if (this.grab[i]) {
                let newAngles = this.angles.slice();
                newAngles[i] = getMouseAngle();

                let newPercents = this.getPercentsFromAngles(newAngles);
                if (newPercents){
                    this.angles = newAngles;
                    this.percents = newPercents.slice();
                }
            }
        }
    }

    animate() {
        requestAnimationFrame(this.animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw outline circle
        ctx.beginPath();
        ctx.arc(center, center, this.radius, 0, pi2);
        ctx.stroke();

        this.update();
    }
}

let myChart = new pieInput([.3, .3, .4], radius);
myChart.getAngles();
myChart.animate();