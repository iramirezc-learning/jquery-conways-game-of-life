(function() {
    "use strict";

    // jQuery
    // ==================================================
    $(function() {

        const COLORS = ["#fd00ff", "#fdff00", "#00ff38", "#00f9ff", "#3c00ff"];
        const MAX_SIZE = 400;

        let GAME_SIZE = 50;
        let GAME_SPEED = 50;
        let CELL_SIZE = MAX_SIZE / GAME_SIZE;

        let boardContainer = $('.board');
        let cellContainer = $('<div class="cell">').css({
            width: CELL_SIZE + 'px',
            height: CELL_SIZE + 'px'
        });
        let generationsContainer = $('.generations span');
        let balancedContainer = $('.balanced span');

        let sizeControl = $("input[name='size']");
        let speedControl = $("input[name='speed']");
        let multiControl = $("input[name='multicolor']");

        let buttonNew = $("button[name='new'");
        let buttonEvolve = $("button[name='evolve'");
        let buttonPlay = $("button[name='play'");
        let buttonStop = $("button[name='stop'");

        let game;
        let running = null;
        let color;
        let multicolor = false;

        // Helper Functions
        // ==================================================

        function getRandomColor() {
            return COLORS[Math.floor(Math.random() * COLORS.length)];
        }

        function updateGenerations() {
            generationsContainer.html(game.getGenerations());
        }

        function enableButtons() {
            for (let i = 0; i < arguments.length; i++) {
                arguments[i].attr('disabled', false);
            }
        }

        function disableButtons() {
            for (let i = 0; i < arguments.length; i++) {
                arguments[i].attr('disabled', true);
            }
        }

        // Game Functions {
        // ==================================================
        function createCells() {
            let cellDiv = cellContainer.clone(),
                isAlive = Math.random() >= 0.7,
                newCell = new Cell(isAlive, multicolor ? getRandomColor : color, cellDiv);

            boardContainer.append(cellDiv);

            cellDiv.click(function() {
                if (newCell.isAlive()) {
                    newCell.die();
                } else {
                    newCell.born();
                }
            });

            return newCell;
        }

        function newGame() {
            if (running === null) {
                enableButtons(buttonEvolve, buttonPlay);
                balancedContainer.html("");
                generationsContainer.html("0");
                boardContainer.empty();
                color = getRandomColor();
                game = new Board();
                game.initBoard(GAME_SIZE, GAME_SIZE, createCells);
            }
        }

        function evolve() {
            if (running === null) {
                game.evolve();
                if (game.isBalanced()) {
                    gameBalanced();
                }
                updateGenerations();
            }
        }

        function play() {
            if (running === null) {
                enableButtons(buttonStop);
                disableButtons(buttonNew, buttonEvolve, buttonPlay);

                running = setInterval(function() {
                    game.evolve();
                    if (game.isBalanced()) {
                        gameIsBalanced();
                    }
                    updateGenerations();
                }, GAME_SPEED);
            }
        }

        function stop() {
            if (running !== null) {
                enableButtons(buttonNew, buttonEvolve, buttonPlay);
                disableButtons(buttonStop);
                stopAutoplay();
                updateGenerations();
            }
        }

        function stopAutoplay() {
            clearInterval(running);
            running = null;
        }

        function gameIsBalanced() {
            enableButtons(buttonNew);
            disableButtons(buttonEvolve, buttonPlay, buttonStop);

            stopAutoplay();
            balancedContainer.html("The game is balanced!");
            updateGenerations();
        }


        // Inputs Events {
        // ==================================================
        sizeControl.change(function() {
            GAME_SIZE = this.value;
            CELL_SIZE = MAX_SIZE / GAME_SIZE;
            cellContainer.css({
                width: CELL_SIZE + 'px',
                height: CELL_SIZE + 'px'
            });
            stop();
        });

        speedControl.change(function() {
            GAME_SPEED = this.value;
            stop();
            play();
        });

        multiControl.change(function() {
            multicolor = this.checked;
            stop();
        });

        // Buttons Events
        // ==================================================
        buttonNew.click(newGame);

        buttonEvolve.click(evolve);

        buttonPlay.click(play);

        buttonStop.click(stop);
    });
}());
