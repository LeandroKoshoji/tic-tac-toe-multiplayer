const defaultBoard = [
    '', '', '',
    '', '', '',
    '', '', '',
]
const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

const checkBoardPosition = (board, moveIndex) => {
    return Boolean(!board[moveIndex])
}
const addPlayerMove = (playerMoves, playerMove) => {
    playerMoves.push(playerMove)
}
const addPlayerMoveInBoard = (board, player, moveIndex) => {
    board[moveIndex] = player
}
const changeTurn = (room, playerTurn) => {
    room.turn = playerTurn === 'X' ? 'O' : 'X'
}

const checkWinner = (room, playerOneMoves, playerTwoMoves) => {
    const playerOne = room.players.X
    const playerTwo = room.players.O

    const checkP1Win = winCombinations.some(combination => {
        const playerWin = combination.every(c => {
            return playerOneMoves?.includes(c)
        })
        
        if (playerWin) {
            room.winnerCombination = combination
        }
        return playerWin
    })
    const checkP2Win = winCombinations.some(combination => {
        const playerWin = combination.every(c => {
            return playerTwoMoves?.includes(c)
        })
        
        if (playerWin) {
            room.winnerCombination = combination
        }
        return playerWin
    })

    if (checkP1Win) {
        room.gameOver = true
        room.winner = playerOne.symbol
        playerOne.score ++
        return playerOne.symbol
    }
    if (checkP2Win) {
        room.gameOver = true
        room.winner = playerTwo.symbol
        playerTwo.score ++
        return playerTwo.symbol
    }
    return false
}

const checkDraw = (room, playerOneMoves, playerTwoMoves, winner) => {
    const playerMovesAmount = playerOneMoves.length +  playerTwoMoves.length
    const roomBoard = room.board
    if (playerMovesAmount === roomBoard.length && !winner) {
        room.gameOver = true
        room.ties ++
    }
}

module.exports = {
    defaultBoard,
    winCombinations,
    addPlayerMove,
    addPlayerMoveInBoard,
    checkBoardPosition,
    changeTurn,
    checkWinner,
    checkDraw
}
