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
    if (event.target.classList.contains('soldier')) {
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

        }
    }
    if (dragged) {
        dragged.dataset.dragged = 'false';
        dragged = null;
        event.target.dataset.dropzone = 'false';
    }
}

function setArmy() {
    document.addEventListener('drag', drag, false);
    document.addEventListener('dragstart', dragstart, false);
    document.addEventListener('dragend', dragend, false);
    document.addEventListener('dragover', dragover, false);
    document.addEventListener('dragenter', dragenter, false);
    document.addEventListener('dragleave', dragleave, false);
    document.addEventListener("drop", drop, false);
}

function setBackground() {
    document.querySelector('body').setAttribute('id', 'game');
}

//PlayGame__________________________________________________________________________________________________________

function playGame() {

    let gameBoard = document.querySelector( "#game-board");
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

function isSpecial(attacker, target) {
    return (attacker === 3 && target === 11) || (attacker === 1 && target === 10)
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
        document.querySelector('#battle-result').innerHTML = `
        Player ${currentPlayerName} WON the game!`;
        $('#battle_message').modal('show');
        return [attacker_id]
    } else if (target_rank === attacker_rank) {
        document.querySelector('#battle-result').innerHTML = `
        It's a tie! Both player lost.`;
        $('#battle_message').modal('show');
        return [attacker_id, target_id]
    } else if (attacker_rank > target_rank) {
        document.querySelector('#battle-result').innerHTML = `
        Player ${currentPlayerName} WON the battle!`;
        $('#battle_message').modal('show');
        return [attacker_id]
    } else if (isSpecial(attacker_rank, target_rank)) {
        document.querySelector('#battle-result').innerHTML = `
        Player ${currentPlayerName} WON the battle!`;
        $('#battle_message').modal('show');
        return [attacker_id]
    } else {
        document.querySelector('#battle-result').innerHTML = `
        Player ${currentEnemyName} WON battle!`;
        $('#battle_message').modal('show');
        return [target_id]
    }
}


function clickHandler(event) {
    let gameBoard = document.querySelector( "#game-board");
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
        soldier.setAttribute('src','/static/images/stratego_logo.png' )
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
