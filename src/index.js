import Game from "./game.js"
import * as Const from "./const.js";
import Point from "./point.js";
import Circle from "./circle.js";
import Timer from "./timer.js";

class Memdots extends Game {
    constructor() {
        super();
        this.ctx.lineWidth = 2;

        this.canvas.addEventListener("click", (e) => {
            this.click(e);
        }, false);
        this.canvas.addEventListener("touchstart", (e) => {
            this.click(e)
        }, false);

        this.circles;
        this.waitTime;
        this.resCount;
        this.score;
        this.level;
        this.targetsCount;
        this.oldColor;
        this.state;
        this.counts;
        this.hiscore = 0;
        this.timer = new Timer(5);
        this.timer.pos = new Point(90, 540);

        this.reset();
        this.loop(0);
    }

    reset() {
        this.counts = 0;
        this.score = 0;
        this.level = 2;
        this.oldColor = "black";
        this.state = Const.ENTERING;
        this.generate();
    }

    generate() {
        const c = [];
        this.circles = [];
        this.resCount = 0;

        function overlaps(p) {
            for (let t of c) {
                let x = t.x - p.x;
                let y = t.y - p.y;
                x *= x;
                y *= y;
                if (x + y < 4000) return true;
            }
            return false;
        }

        for (let t = 0; t < this.level; t++) {
            let p = new Point();
            do {
                p.set(
                    Math.random() * (Const.WIDTH - 80) + 40,
                    Math.random() * (Const.HEIGHT - 120) + 40,
                );
            } while (overlaps(p));
            c.push(p);

            const a = Math.random() * Const.TWO_PI,
                vel = new Point(Math.cos(a) * (Math.random() * 500 + 900), Math.sin(a) * (Math.random() * 500 + 900)),
                tg = p.copy();
            while (true) {
                tg.x -= vel.x * .2;
                tg.y -= vel.y * .2;
                if ((tg.x < -13 || tg.x > Const.WIDTH + 13) || (tg.y < -13 || tg.y > Const.HEIGHT + 13)) break;
            }
            let clr;
            do {
                clr = Const.COLORS[Math.floor(Math.random() * Const.COLORS.length)];
            } while (clr === this.oldColor);
            this.oldColor = clr;
            this.circles.push(new Circle(tg, p, vel, clr));
        }

        this.oldColor = this.circles[Math.floor(Math.random() * this.circles.length)].color;
        this.targetsCount = 0;

        for (let r of this.circles) {
            if (r.color === this.oldColor) {
                this.targetsCount++;
            }
        }
        this.state = Const.ENTERING;
    }

    update(dt) {
        switch (this.state) {
            case Const.ENTERING:
                let f = false;
                for (let z of this.circles) {
                    if (z.update(dt)) f = true;
                }
                if (!f) {
                    this.state = Const.SHOWING;
                    this.waitTime = 1.5;
                }
                break;
            case Const.SHOWING:
                if ((this.waitTime -= dt) < 0) {
                    this.state = Const.WAITING;
                    this.timer.reset();
                }
                break;
            case Const.WAITING:
                if (!this.timer.update(dt)) {
                    this.state = Const.GAMEOVER;
                }
                break;
            case Const.DISPLAY:
                if ((this.waitTime -= dt) < 0) {
                    for (let z of this.circles) {
                        z.moving = true;
                    }
                    this.state = Const.GAMEOVER;
                }
                break;
            case Const.HIDING:
                let g = false;
                for (let z of this.circles) {
                    if (z.update(dt)) g = true;
                }
                if (!g) {
                    this.generate();
                }
                break;
            case Const.GAMEOVER:
                //
                break;
        }

    }

    testCircle(c) {
        if (c.color === this.oldColor) {
            c.show = true;
            if (++this.resCount === this.targetsCount) {
                for (let z of this.circles) {
                    z.moving = true;
                }
                this.state = Const.HIDING;
                this.score++;
                if (++this.counts === this.level + 1) {
                    this.counts = 0;
                    this.level++;
                }


                if (this.score > this.hiscore) {
                    this.hiscore = this.score;
                }
            }
        } else {
            this.state = Const.DISPLAY;
            this.waitTime = 2;
        }
    }

    draw() {
        switch (this.state) {
            case Const.ENTERING:
            case Const.SHOWING:
                this.ctx.fillStyle = "black";
                this.ctx.fillRect(0, 0, Const.WIDTH, Const.HEIGHT);
                for (let z of this.circles) {
                    z.draw(this.ctx, true);
                }
                break;
            case Const.WAITING:
                this.ctx.fillStyle = this.oldColor;
                this.ctx.fillRect(0, 0, Const.WIDTH, Const.HEIGHT);
                for (let z of this.circles) {
                    z.draw(this.ctx, false);
                }
                this.timer.draw(this.ctx);
                break;
            case Const.DISPLAY:
                this.ctx.fillStyle = "black";
                this.ctx.fillRect(0, 0, Const.WIDTH, Const.HEIGHT);
                for (let z of this.circles) {
                    z.draw(this.ctx, true);
                }
                break;

            case Const.HIDING:
                this.ctx.fillStyle = "black";
                this.ctx.fillRect(0, 0, Const.WIDTH, Const.HEIGHT);
                for (let z of this.circles) {
                    z.draw(this.ctx, true);
                }
                break;
            case Const.GAMEOVER:
                this.ctx.fillStyle = "black";
                this.ctx.fillRect(0, 0, Const.WIDTH, Const.HEIGHT);
                for (let z of this.circles) {
                    z.draw(this.ctx, true);
                }
                this.ctx.fillStyle = "#ddd";
                this.ctx.font = "56px 'Gruppo'";
                this.ctx.textAlign = "center";
                this.ctx.fillText("SCORE", Const.WIDTH >> 1, Const.HEIGHT * .3);
                this.ctx.fillText(`${this.score}`, Const.WIDTH >> 1, Const.HEIGHT * .4);
                this.ctx.fillText("BEST", Const.WIDTH >> 1, Const.HEIGHT * .6);
                this.ctx.fillText(`${this.hiscore}`, Const.WIDTH >> 1, Const.HEIGHT * .7);
                this.ctx.font = "20px 'Gruppo'";
                this.ctx.textAlign = "center";
                this.ctx.fillText(`CLICK TO PLAY AGAIN`, Const.WIDTH >> 1, Const.HEIGHT * .9);
                break;
        }
    }

    click(e) {
        if (this.state === Const.GAMEOVER) {
            this.reset();
            return;
        }

        if (this.state != Const.WAITING) return;

        let x, y;
        if (e.type === "touchstart") {
            x = e.touches[0].clientX - e.srcElement.offsetLeft;
            y = e.touches[0].clientY - e.srcElement.offsetTop;
            e.preventDefault();
        } else {
            x = e.clientX - e.srcElement.offsetLeft;
            y = e.clientY - e.srcElement.offsetTop;
        }
        if (x === null || y === null || x >= Const.WIDTH || y >= Const.HEIGHT || x < 0 || y < 0) return;

        for (let c of this.circles) {
            let dx = x - c.pos.x,
                dy = y - c.pos.y;
            dx *= dx;
            dy *= dy;
            if (dx + dy < 800) {
                this.testCircle(c);
                return;
            }
        }
    }
}

new Memdots();