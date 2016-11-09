"use strict";

// Board
// ==================================================
function Board() {

    let balanced = false,
        generations = 0;

    Object.defineProperty(this, "board", {
        value: [],
        writable: true,
        enumerable: true
    });

    Object.defineProperty(this, "getGenerations", {
        value: function getGenerations() {
            return generations;
        },
        enumerable: true
    });

    Object.defineProperty(this, "isBalanced", {
        value: function isBalanced() {
            return balanced;
        },
        enumerable: true
    });

    Object.defineProperty(this, "evolve", {
        value: function evolve() {
            if (!balanced) {
                let newGeneration = this.board.map((row, y) => {
                    return row.map((cell, x) => {
                        let cellCopy = cell.clone();
                        cellCopy.evolve(Board.getNeighborsAlive(this.board, y, x));
                        return cellCopy;
                    });
                });
                balanced = Board.compareBoards(this.board, newGeneration);
                this.board = newGeneration;
                generations++;
            }
            return this;
        },
        enumerable: true
    });

    return this;
}

// Board Static
// ==================================================
Object.defineProperty(Board, "compareBoards", {
    value: function compareBoards(board1, board2) {
        for (let y = 0; y < board1.length; y++) {
            for (let x = 0; x < board1[y].length; x++) {
                if (board1[y][x].isAlive() !== board2[y][x].isAlive()) {
                    return false;
                }
            }
        }
        return true;
    },
    enumerable: true
});

Object.defineProperty(Board, "getNeighborsAlive", {
    value: function getNeighborsAlive(board, row, col) {
        let neighbors = [];

        for (let y = row - 1; y <= row + 1; y++) {
            for (let x = col - 1; x <= col + 1; x++) {
                if (y >= 0 && y < board.length && x >= 0 && x < board[y].length) {
                    if (!(y === row && x === col)) {
                        neighbors.push(board[y][x]);
                    }
                }
            }
        }

        return neighbors.filter(cell => {
            return cell.isAlive();
        }).length;
    },
    enumerable: true
});

Object.defineProperty(Board, "toBoolean", {
    value: function toBoolean(board) {
        return board.map(row => {
            return row.map(cell => {
                return cell.isAlive();
            });
        });
    },
    enumerable: true
});

// Board Prototype
// ==================================================
Object.defineProperty(Board.prototype, "initBoard", {
    value: function initBoard(rows, cols, fnCallback) {
        this.board = [];
        for (let y = 0; y < rows; y++) {
            this.board[y] = [];
            for (let x = 0; x < cols; x++) {
                this.board[y][x] = fnCallback(y, x);
            }
        }
        return this;
    },
    enumerable: true
});

Object.defineProperty(Board.prototype, "toString", {
    value: function toString() {
        return this.board.map(row => {
            return row.map(cell => {
                return cell.isAlive() ? 'X' : '_';
            }).join(' ');
        }).join('\n');
    }
});
