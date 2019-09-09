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
    let nextPlayer = document.querySelector('#next-player');
    let redPlayer = document.querySelector('#redInventory').dataset.red;
    let currentPlayer = document.querySelector('#game-board').dataset.currentPlayer;
    let gameCells = document.querySelectorAll('.game-cell');
    if (currentPlayer === 'red') {
        hideImage('red');
        document.querySelector('#game-board').dataset.currentPlayer = 'blue';
        enableCellToDrop();
    } else if (currentPlayer === 'blue') {
        hideImage('blue');
        removeDragAndDrop();
        for (const cell of gameCells) {
            cell.classList.remove('dropzone');
        }
        playGame();
        nextPlayer.innerHTML = `${redPlayer}'s turn!`;
        $('#new-round').modal('show');
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

function newRound() {
    let currentPlayer = document.querySelector('#game-board').dataset.currentPlayer;
    if (currentPlayer === 'red') {
        showImage('blue');
        document.querySelector('#game-board').dataset.currentPlayer = 'blue';
    } else if (currentPlayer === 'blue') {
        showImage('red');
        document.querySelector('#game-board').dataset.currentPlayer = 'red';
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
    let firstRound = document.querySelector('#round');
    document.addEventListener('drag', drag, false);
    document.addEventListener('dragstart', dragstart, false);
    document.addEventListener('dragend', dragend, false);
    document.addEventListener('dragover', dragover, false);
    document.addEventListener('dragenter', dragenter, false);
    document.addEventListener('dragleave', dragleave, false);
    document.addEventListener("drop", drop, false);
    readyButton.addEventListener('click', readyPlayer);
    firstRound.addEventListener('click', newRound);
}

function setBackground() {
    document.querySelector('body').setAttribute('id', 'game');
}

//PlayGame__________________________________________________________________________________________________________

function playGame() {

    let gameBoard = document.querySelector("#game-board");
    gameBoard.dataset.clickCounter = "0";
    gameBoard.dataset.clickedCell1 = "";
    gameBoard.dataset.clickedCell2 = "";

    let boardCells = document.querySelectorAll('.game-cell ');
    for (let cell of boardCells) {
        cell.addEventListener('click', clickHandler);
    }

    const battleOver = document.querySelector('#battle_over');
    battleOver.addEventListener('click', startNewRoundAfterBattle)
}

function startNewRoundAfterBattle () {
    if (document.querySelector('#battle_result').innerHTML.includes('WON the game')) {
        window.location.reload();
    } else {
       $('#new-round').modal('show');
    }
}
function putSoldierBackToInventory (cell, player) {
        cell.children[0].classList.remove('hide');
        cell.children[0].setAttribute('src', `/static/images/soldier_${cell.children[0].dataset.rank}.svg`);

        if (!String.prototype.trim) {//it help to compare innerhtml with empty string
            String.prototype.trim = function () {
                return this.replace(/^\s+|\s+$/, '');
            };
        }

        if (player === "red") {
            let inventory = document.querySelectorAll(".inv-blue-cell");
            for (let x of inventory) {
                if (x.innerHTML.trim() === "") {
                    x.innerHTML = cell.innerHTML;
                    return;
                }
            }
        } else {
            let inventory = document.querySelectorAll(".inv-red-cell");
            for (let x of inventory) {
                if (x.innerHTML.trim() === "") {
                    x.innerHTML = cell.innerHTML;
                    return;
                }
            }
        }
}

function moveSoldier(cellAttacker, cellEnemy) {
    let gameCell1 = document.querySelector(`#${cellAttacker}`);
    let gameCell2 = document.querySelector(`#${cellEnemy}`);
    let gameBoard = document.querySelector("#game-board");
    let player = gameBoard.dataset.currentPlayer;
    const enemy = player === 'red' ? 'blue' : 'red';
    if (gameCell2.innerHTML !== "") {

        let battleResult = battle(gameCell1.dataset.attacker, gameCell2.dataset.enemy);

        if (battleResult === "ATTACKER"){
            let cellToMoveFrom = document.querySelector(`[id="${cellAttacker}"]`);
            let cellToMoveTo = document.querySelector(`[id="${cellEnemy}"]`);
            putSoldierBackToInventory(cellToMoveTo, player);
            cellToMoveTo.innerHTML = cellToMoveFrom.innerHTML;
            cellToMoveFrom.innerHTML = "";

        } else if (battleResult === "ENEMY"){
            let cellToMoveToInventory = document.querySelector(`[id="${cellAttacker}"]`);
            putSoldierBackToInventory(cellToMoveToInventory, enemy);
            cellToMoveToInventory.innerHTML = "";

        } else if (battleResult === "DRAW") {
            let cellToMoveFrom = document.querySelector(`[id="${cellAttacker}"]`);
            let cellToMoveTo = document.querySelector(`[id="${cellEnemy}"]`);
            putSoldierBackToInventory(cellToMoveFrom, enemy);
            putSoldierBackToInventory(cellToMoveTo, player);
            cellToMoveFrom.innerHTML = "";
            cellToMoveTo.innerHTML = "";
        }

    } else {
        let cellToMoveFrom = document.querySelector(`[id="${cellAttacker}"]`);
        let cellToMoveTo = document.querySelector(`[id="${cellEnemy}"]`);
        if (!String.prototype.trim) { //it help to compare innerhtml with empty string
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

function isSpecial(attacker, target) {
    return (attacker === 3 && target === 11) || (attacker === 1 && target === 10)
}

function isValidMoveToCell (currentCell, currentPlayer) {
    return currentCell && !currentCell.classList.contains('lake-cell') &&
        ((currentCell.children.length === 0) || (currentCell.children.length !== 0 && !currentCell.children[0].classList.contains(currentPlayer)))
}

function isFirstFromEnemy (currentCell, currentPlayer) {
    return currentCell && currentCell.children.length !== 0 && !currentCell.children[0].classList.contains(currentPlayer)
}

function markFieldsForScoutDone (currentCell, currentPlayer) {
    if (isFirstFromEnemy(currentCell, currentPlayer)) {
        currentCell.classList.add('moveTo');
        return true;
    }

    if (isValidMoveToCell(currentCell, currentPlayer)) {
        currentCell.classList.add('moveTo');
        return false;
    }
    return true;
}

function markFieldsToMove () {
    const currentPlayer = document.querySelector('#game-board').dataset.currentPlayer;
    const currentCellId = document.querySelector('#game-board').dataset.clickedCell1;
    const currentPlayerId = document.querySelector(`#${currentCellId}`).dataset.attacker;
    const currentPlayerRank = document.querySelector(`#${currentPlayerId}`).dataset.rank;

    const currentCellRow = parseInt(currentCellId.slice(-2, -1));
    const currentCellCol = parseInt(currentCellId.slice(-1));

    if (currentPlayerRank !== '2') {
        const moveToCells = [`${currentCellRow - 1}${currentCellCol}`,
                     `${currentCellRow + 1}${currentCellCol}`,
                     `${currentCellRow}${currentCellCol - 1}`,
                     `${currentCellRow}${currentCellCol + 1}`
                    ];

        for (let cell of moveToCells) {
            let currentCell = document.querySelector(`#board-${cell}`);
            if (isValidMoveToCell(currentCell, currentPlayer)) {
                currentCell.classList.add('moveTo');
            }
        }
    } else {
        // check column up
        for (let row = currentCellRow + 1; row < 10; row++) {
            let currentCell = document.querySelector(`#board-${row}${currentCellCol}`);
            if (markFieldsForScoutDone(currentCell, currentPlayer)) {
                break
            }
        }
        // check column down
        for (let row = currentCellRow - 1; row >= 0; row--) {
            let currentCell = document.querySelector(`#board-${row}${currentCellCol}`);
            if (markFieldsForScoutDone(currentCell, currentPlayer)) {
                break
            }
        }
        // check row up
        for (let col = currentCellCol + 1; col < 10; col++) {
            let currentCell = document.querySelector(`#board-${currentCellRow}${col}`);
            if (markFieldsForScoutDone(currentCell, currentPlayer)) {
                break
            }
        }
        // check row down
        for (let col = currentCellCol - 1; col >= 0; col--) {
            let currentCell = document.querySelector(`#board-${currentCellRow}${col}`);
            if (markFieldsForScoutDone(currentCell, currentPlayer)) {
                break
            }
        }
    }
}

function battle(attacker_id, target_id) {
    const attacker = document.querySelector(`#${attacker_id}`);
    const target = document.querySelector(`#${target_id}`);
    const attacker_rank = parseInt(attacker.dataset.rank);
    const target_rank = parseInt(target.dataset.rank);
    const currentPlayer = document.querySelector('#game-board').dataset.currentPlayer;
    const currentEnemy = currentPlayer === 'red' ? 'blue' : 'red';
    const currentPlayerName = document.querySelector(`[data-${currentPlayer}]`).dataset[currentPlayer];
    const currentEnemyName = document.querySelector(`[data-${currentEnemy}]`).dataset[currentEnemy];

    document.querySelector('#attacker').innerHTML = `
    <img class='soldier ${currentPlayer}' src='/static/images/soldier_${attacker_rank}.svg'>
    `;

    document.querySelector('#target').innerHTML = `
    <img class='soldier ${currentEnemy}' src='/static/images/soldier_${target_rank}.svg'>
    `;

    if (target_rank === 0) {
        document.querySelector('#battle_result').innerHTML = `
        Player ${currentPlayerName} WON the game!`;
        $('#battle_message').modal('show');
        return [attacker_id]

    } else if (target_rank === attacker_rank) {
        document.querySelector('#battle_result').innerHTML = `
        It's a tie! Both player lost.`;
        $('#battle_message').modal('show');
        //return [attacker_id, target_id]
        return "DRAW"
    } else if (attacker_rank > target_rank) {
        document.querySelector('#battle_result').innerHTML = `
        Player ${currentPlayerName} WON the battle!`;
        $('#battle_message').modal('show');
        //return [attacker_id]
        return "ATTACKER"
    } else if (isSpecial(attacker_rank, target_rank)) {
        document.querySelector('#battle_result').innerHTML = `
        Player ${currentPlayerName} WON the battle!`;
        $('#battle_message').modal('show');
        //return [attacker_id]
        return "ATTACKER"
    } else {
        document.querySelector('#battle_result').innerHTML = `
        Player ${currentEnemyName} WON battle!`;
        $('#battle_message').modal('show');
        //return [target_id]
        return "ENEMY"
    }
}

function removeMarksFromFieldsMoveTo() {
    const moveToFields = document.querySelectorAll('.moveTo');
    for (let cell of moveToFields) {
        cell.classList.remove('moveTo')
    }
}

function clickHandler(event) {
    let gameBoard = document.querySelector("#game-board");
    let player = gameBoard.dataset.currentPlayer;
    if (gameBoard.dataset.clickCounter === "0") {
        if (event.target.classList.contains(`${player}`) && event.target.dataset.rank !== "0" && event.target.dataset.rank !== "11") {// need to implement restriction to bomb and flag 0 and 11
            gameBoard.dataset.clickedCell1 = event.currentTarget.id;
            let gameCell = document.querySelector(`#${event.currentTarget.id}`);
            gameCell.dataset.attacker = event.target.id;
            gameBoard.dataset.clickCounter = "1";
            markFieldsToMove();
            if (document.querySelectorAll('.moveTo').length === 0) {
                gameBoard.dataset.clickCounter = "0";
            }
        }
    } else if (gameBoard.dataset.clickCounter === "1") {
        if (event.currentTarget.classList.contains('moveTo')) {
            gameBoard.dataset.clickedCell2 = event.currentTarget.id;
            let gameCell = document.querySelector(`#${event.currentTarget.id}`);
            gameCell.dataset.enemy = event.target.id;
            moveSoldier(gameBoard.dataset.clickedCell1, gameBoard.dataset.clickedCell2);

            gameBoard.dataset.clickCounter = "0";
            gameBoard.dataset.clickedCell1 = "";
            gameBoard.dataset.clickedCell2 = "";
            delete gameCell.dataset.enemy;
            delete gameCell.dataset.attacker;
            removeMarksFromFieldsMoveTo();

            const currentEnemy = player === 'red' ? 'blue' : 'red';
            const currentEnemyName = document.querySelector(`[data-${currentEnemy}]`).dataset[currentEnemy];
            hideImage(player);
            document.querySelector("#next-player").innerHTML = `${currentEnemyName} is the next player`;
            if (!document.querySelector('#battle_message').classList.contains('show')) {
                $('#new-round').modal('show');
            }
        } else if (gameBoard.dataset.clickCounter === "1" && event.target.id === event.currentTarget.children[0].id) {
            gameBoard.dataset.clickCounter = "0";
            removeMarksFromFieldsMoveTo();
        }
    }
}

// player must be a string 'red' or 'blue'
function hideImage(player) {
    let army = document.querySelectorAll(`.game-cell .soldier.${player}`);
    for (let soldier of army) {
        soldier.classList.add('hide');
        soldier.setAttribute('src', '/static/images/stratego_logo.png')
    }
}

function showImage(player) {
    let army = document.querySelectorAll(`.game-cell .soldier.${player}`);
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
}

main();
