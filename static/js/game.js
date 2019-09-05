//Set army______________________________________________________
function drag(event) {
}

function dragend(event) {
    event.target.dataset.dropzone = 'false';
}

function dragover(event) {
    event.preventDefault()
}

function dragleave(event) {
    if (event.target.classList.contains('dropzone')) {
        event.target.dataset.dropzone = 'false'
    }
}

function dragstart(event) {
    let currentPlayer = document.querySelector('#game-board').dataset.currentPlayer;
    if (event.target.classList.contains(currentPlayer)) {
        event.target.dataset.dragged = 'true';
    }
}

function dragenter(event) {
    let dragged = document.querySelector("[data-dragged='true']");
    if (event.target.classList.contains('dropzone') && dragged !== null) {
        event.target.dataset.dropzone = 'true';
    }
}

function drop(event) {
    let dragged = document.querySelector("[data-dragged='true']");
    if (dragged !== null) {
        if (event.target.classList.contains('dropzone') && event.target.innerHTML == 0) {
            event.preventDefault();
            dragged.parentNode.removeChild(dragged);
            event.target.appendChild(dragged);
            if (isFull()) {
                $('#full-board').modal('show');
            }
        }
    }
    if (dragged) {
        dragged.dataset.dragged = 'false';
        dragged = null;
        event.target.dataset.dropzone = 'false';
    }
}

function isFull() {
    let currentPlayer = document.querySelector('#game-board').dataset.currentPlayer;
    if (currentPlayer === 'red') {
        for (let i = 60; i < 100; i++) {
            if (document.querySelector(`#board-${i}`).innerHTML == "") {
                return false;
            }
        }
        return true;
    } else if (currentPlayer === 'blue') {
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 10; y++) {
                if (document.querySelector(`#board-${x}${y}`).innerHTML == "") {
                    return false;
                }
            }
        }
        return true;
    }
}

function readyPlayer(event) {
    let currentPlayer = document.querySelector('#game-board').dataset.currentPlayer;
    if (currentPlayer === 'red') {
        hideImage('red');
        document.querySelector('#game-board').dataset.currentPlayer = 'blue';
        enableCellToDrop();
    } else if (currentPlayer === 'blue') {
        hideImage('blue');
        removeDragAndDrop();
        document.querySelector('#game-board').dataset.currentPlayer = 'red';
    }
}

function enableCellToDrop() {
    let currentPlayer = document.querySelector('#game-board').dataset.currentPlayer;
    if (currentPlayer === 'red') {
        let redInventory = document.querySelectorAll('.inv-red-cell');
        for (const cell of redInventory) {
            cell.classList.add('dropzone');
        }
        let redSoldiers = document.querySelectorAll('.soldier.red');
        for (const soldier of redSoldiers) {
            soldier.setAttribute('draggable', 'true');
        }
        for (let i = 60; i < 100; i++) {
            document.querySelector(`#board-${i}`).classList.add('dropzone');
        }
    } else if (currentPlayer === 'blue') {
        let gameCells = document.querySelectorAll('.game-cell');
        for (const cell of gameCells) {
            cell.classList.remove('dropzone');
        }
        let redSoldiers = document.querySelectorAll('.soldier.red');
        for (const soldier of redSoldiers) {
            soldier.setAttribute('draggable', 'false');
        }
        let blueSoldiers = document.querySelectorAll('.soldier.blue');
        for (const soldier of blueSoldiers) {
            soldier.setAttribute('draggable', 'true');
        }
        let redInventory = document.querySelectorAll('.inv-red-cell');
        for (const cell of redInventory) {
            cell.classList.remove('dropzone');
        }
        let blueInventory = document.querySelectorAll('.inv-blue-cell');
        for (const cell of blueInventory) {
            cell.classList.add('dropzone');
        }
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 10; y++) {
               document.querySelector(`#board-${x}${y}`).classList.add('dropzone');
            }
        }
    }
}

function removeDragAndDrop() {
    document.removeEventListener('drag', drag);
    document.removeEventListener('dragstart', drag);
    document.removeEventListener('dragend', drag);
    document.removeEventListener('dragover', dragover);
    document.removeEventListener('dragenter', dragenter);
    document.removeEventListener('dragleave', dragleave);
    document.removeEventListener('drop', drop);
}

function setArmy() {
    enableCellToDrop();
    let readyButton = document.querySelector('#ready');
    document.addEventListener('drag', drag, false);
    document.addEventListener('dragstart', dragstart, false);
    document.addEventListener('dragend', dragend, false);
    document.addEventListener('dragover', dragover, false);
    document.addEventListener('dragenter', dragenter, false);
    document.addEventListener('dragleave', dragleave, false);
    document.addEventListener("drop", drop, false);
    readyButton.addEventListener('click', readyPlayer);
}

function setBackground() {
    document.querySelector('body').setAttribute('id', 'game');
}

//PlayGame__________________________________________________________________________________________________________

function playGame() {

    let gameBoard = document.querySelector("#game-board");
    console.log(gameBoard);
    gameBoard.dataset.clickCounter = "0";
    gameBoard.dataset.clickedCell1 = "";
    gameBoard.dataset.clickedCell2 = "";

    let boardCells = document.querySelectorAll('.game-cell ');
    for (let cell of boardCells) {
        cell.addEventListener('click', clickHandler);
    }
}

function moveSoldier(cell1, cell2) {
    let gameCell1 = document.querySelector(`#${cell1}`);
    let gameCell2 = document.querySelector(`#${cell2}`);
    if (gameCell2.innerHTML != "") {
        console.log("LET THE BATTLE BEGIN")
    } else {
        let cellToMoveFrom = document.querySelector(`[id="${cell1}"]`);
        let cellToMoveTo = document.querySelector(`[id="${cell2}"]`);
        if (!String.prototype.trim) {//it help to compare innerhtml with empty string
            String.prototype.trim = function () {
                return this.replace(/^\s+|\s+$/, '');
            };
        }
        if (cellToMoveTo.innerHTML.trim() === "") {
            cellToMoveTo.innerHTML = cellToMoveFrom.innerHTML;
            cellToMoveFrom.innerHTML = "";
        }
    }
}

function clickHandler(event) {
    let gameBoard = document.querySelector("#game-board");
    let player = gameBoard.dataset.currentPlayer;
    if (gameBoard.dataset.clickCounter === "0") {
        if(event.target.classList.contains(`${player}`) && event.target.dataset.rank !== "0" && event.target.dataset.rank !== "11"){// need to implement restriction to bomb and flag 0 and 11
            gameBoard.dataset.clickedCell1 = event.currentTarget.id;
            let gameCell = document.querySelector(`#${event.currentTarget.id}`);
            gameCell.dataset.attacker = event.target.id;
            gameBoard.dataset.clickCounter = "1";
        }
    } else if (gameBoard.dataset.clickCounter === "1") {
        if (!event.target.classList.contains(`${player}`)){//cant step on your own player
            gameBoard.dataset.clickedCell2 = event.currentTarget.id;
            let gameCell = document.querySelector(`#${event.currentTarget.id}`);
            gameCell.dataset.enemy = event.target.id;
            moveSoldier(gameBoard.dataset.clickedCell1, gameBoard.dataset.clickedCell2);
            gameBoard.dataset.clickCounter = "0";
            gameBoard.dataset.clickedCell1 = "";
            gameBoard.dataset.clickedCell2 = "";
            delete gameCell.dataset.enemy;
            delete gameCell.dataset.attacker;
            //round switch
        }
    }
}

// player must be a string 'red' or 'blue'
function hideImage(player) {
    let army = document.querySelectorAll(`.soldier.${player}`);
    for (let soldier of army) {
        soldier.classList.add('hide');
        soldier.setAttribute('src', '/static/images/stratego_logo.png')
    }
}

function showImage(player) {
    let army = document.querySelectorAll(`.soldier.${player}`);
    for (let soldier of army) {
        soldier.classList.remove('hide');
        soldier.setAttribute('src', `/static/images/soldier_${soldier.dataset.rank}.svg`);
    }
}

function setLakes() {
    const lakes = [42, 43, 46, 47, 52, 53, 56, 57];
    for (let lake of lakes) {
        let cell = document.querySelector(`#board-${lake}`);
        cell.classList.add('lake-cell');
        cell.classList.remove('game-cell');
    }
}

//Main_____________________________________________
function main() {
    setBackground();
    setLakes();
    setArmy();
    playGame()
}

main();
