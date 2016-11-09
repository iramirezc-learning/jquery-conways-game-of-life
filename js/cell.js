"use strict";

// Cell
// ==================================================
function Cell(alive, color, container) {

    function getColor() {
        return typeof color === 'function' ? color() : color;
    }

    container.css('backgroundColor', alive ? getColor() : 'black');

    Object.defineProperty(this, "die", {
        value: function die() {
            alive = false;
            container.css('backgroundColor', 'black');
            return this;
        },
        enumerable: true
    });

    Object.defineProperty(this, "born", {
        value: function born() {
            alive = true;
            container.css('backgroundColor', getColor());
            return this;
        },
        enumerable: true
    });

    Object.defineProperty(this, "isAlive", {
        value: function isAlive() {
            return alive;
        },
        enumerable: true
    });

    Object.defineProperty(this, "clone", {
        value: function clone() {
            return new Cell(alive, color, container);
        },
        enumerable: true
    });

    return this;
}

// Cell Prototype
// ==================================================
Object.defineProperty(Cell.prototype, "evolve", {
    value: function evolve(neighbors) {
        if (this.isAlive()) {
            if (neighbors < 2 || neighbors > 3) {
                this.die();
            }
        } else {
            if (neighbors === 3) {
                this.born();
            }
        }
        return this;
    },
    enumerable: true
});
