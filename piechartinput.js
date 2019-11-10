const pi = Math.PI;
const pi2 = pi * 2;
const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};

function distance(x1, y1, x2, y2) {
    let xDiff = x2 - x1;
    let yDiff = y2 - y1;
    let d = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    return d;
};

class pieInput extends HTMLElement {
    constructor() {
        // dom setup
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('class', 'pie-input-canvas');
        this.shadow.appendChild(this.canvas);

        // get all attributes from the declaration or set defaults
        if (this.hasAttribute('values')) {
            this.percents = this.getAttribute('values').split(',').map(Number);
            // check that percents sum to 1
            let valid = this.percents.reduce((a, b) => a + b, 0) === 1;
            if (!valid) console.error('pie chart input: percent array must sum to 1');
        } else {
            this.percents = [.5, .5];
        }

        if (this.hasAttribute('size')) {
            this.canvas.width = this.canvas.height = parseInt(this.getAttribute('size'));
        } else {
            this.canvas.width = this.canvas.height = 300;
        }

        if (this.hasAttribute('initial-angle')) {
            this.initialAngle = parseInt(this.getAttribute('initial-angle'));
        } else {
            this.initialAngle = 0;
        }

        // initialize variables
        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineWidth = 2;
        this.center = this.canvas.width / 2;
        this.radius = this.center - 10;
        this.handleRad = .04 * this.radius;
        this.mouseOver = new Array(this.percents.length).fill(false);
        this.grab = new Array(this.percents.length).fill(false);
        this.globalGrab = false;

        // initialize angles from input percents ("values" attribute)
        this.angles = [];
        let oldAngle = this.initialAngle;
        for (let i = 0; i < this.percents.length; i++) {
            let angle = (this.percents[i] * pi2) + oldAngle;
            this.angles.push(angle);
            oldAngle = angle;
        }

        // listeners
        window.addEventListener('mousemove',
            function (event) {
                mouse.x = event.clientX;
                mouse.y = event.clientY;
            });

        window.addEventListener('mousedown',
            function () {
                mouse.down = true;
            });

        window.addEventListener('mouseup',
            function () {
                mouse.down = false;
            });

        // bind
        this.animate = this.animate.bind(this);

        // init
        this.animate();
    }

    // gets the angle of the mouse's position relative to center
    // used for setting new angles when dragging
    getMouseAngle() {
        let r = distance(mouse.x, mouse.y, this.center, this.center);
        let relativeMouseX = (mouse.x - this.center) / r;
        let relativeMouseY = (-mouse.y + this.center) / r;
        let mouseAngle = Math.atan2(relativeMouseY, relativeMouseX);
        if (mouseAngle < 0) mouseAngle += pi2;
        // round to nearest percent
        mouseAngle = (pi2 / 100) * Math.round(mouseAngle / (pi2 / 100));
        return (mouseAngle);
    };

    // calculate xy position from a given angle in radians
    getPosFromAngle(angle) {
        let xPos = this.center + this.radius * Math.cos(angle);
        let yPos = this.center - this.radius * Math.sin(angle);
        return ({ x: xPos, y: yPos });
    }

    // calculate percents array from an array of angles
    getPercentsFromAngles(angles) {
        let newPercents = [];
        // push n-1 percents from angles array
        for (let i = 0; i < angles.length - 1; i++) {
            let newA = (angles[i + 1] - angles[i]);
            if (newA < 0) newA += pi2;
            newPercents.push(newA / pi2);
        }

        // calculate last percent by subtracting the total from 1
        // this ensures that the percents always sum to 1
        let sum = newPercents.reduce((a, b) => a + b, 0);
        newPercents.push(1 - sum);
        newPercents = newPercents.map(x => Math.round(x * 100) / 100);

        // do not return if any percent is negative
        // this prevents pie sections from overlapping
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
            // draw radial line for each percent
            this.ctx.beginPath();
            this.ctx.moveTo(this.center, this.center);
            let linePos = this.getPosFromAngle(this.angles[i]);
            this.ctx.lineTo(linePos.x, linePos.y);
            this.ctx.stroke();

            // draw handle
            this.ctx.beginPath();
            this.ctx.arc(linePos.x, linePos.y, this.handleRad, 0, pi2);
            this.ctx.fill();

            // check for mouse over the handle
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

            // grab and move line, recalculate angles and percents
            if (this.grab[i]) {
                let newAngles = this.angles.slice();
                newAngles[i] = this.getMouseAngle();

                let newPercents = this.getPercentsFromAngles(newAngles);
                if (newPercents) {
                    this.angles = newAngles;
                    this.percents = newPercents.slice();
                    this.setAttribute('values', String(this.percents));
                }
            }
        }
    }

    animate() {
        requestAnimationFrame(this.animate);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // draw outline circle
        this.ctx.beginPath();
        this.ctx.arc(this.center, this.center, this.radius, 0, pi2);
        this.ctx.stroke();

        this.update();
    }
};

// register custom element
customElements.define('pie-input', pieInput);