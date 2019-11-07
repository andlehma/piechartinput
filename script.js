const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.height = 300;
const center = canvas.width / 2;
const radius = center - 10;
const handleRad = 6;
const pi = Math.PI;
const pi2 = pi * 2;
let globGrab = true;

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};

class pieLine {
    constructor(angle) {
        this.angle = angle;
        this.calculatePos = function () {
            this.xPos = center + radius * Math.cos(this.angle);
            this.yPos = center - radius * Math.sin(this.angle);
        }
        this.hover = false;
        this.grab = false;
    }
};

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
        lines.forEach(line => line.grab = false);
    });

function getMouseAngle() {
    let r = distance(mouse.x, mouse.y, center, center);
    let relativeMouseX = (mouse.x - center) / r;
    let relativeMouseY = (-mouse.y + center) / r;
    let mouseAngle = Math.atan2(relativeMouseY, relativeMouseX);
    return (mouseAngle);
};

function distance(x1, y1, x2, y2) {
    let xDiff = x2 - x1;
    let yDiff = y2 - y1;
    let d = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    return d;
};

const lines = [new pieLine(0), new pieLine(.2 * pi * 2), new pieLine(.5 * pi * 2)];

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, pi2);
    ctx.stroke();
    for (let i = 0; i < lines.length; i++) {
        lines[i].calculatePos();

        // draw lines and handles
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.lineTo(lines[i].xPos, lines[i].yPos);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(lines[i].xPos, lines[i].yPos, handleRad, 0, pi2);
        ctx.fill();

        // check for mouse over
        let d = distance(mouse.x, mouse.y, lines[i].xPos, lines[i].yPos)
        if (d < 6) {
            lines[i].hover = true;
        } else {
            lines[i].hover = false;
        }

        // check for grab
        if (lines[i].hover) {
            if (mouse.down) {
                if (!globGrab) {
                    lines[i].grab = true;
                    globGrab = true;
                }
            } else {
                lines[i].grab = false;
                globGrab = false;
            }
        }

        // move if grab
        if (lines[i].grab) {
            lines[i].angle = getMouseAngle();
        }
    }
};

animate();