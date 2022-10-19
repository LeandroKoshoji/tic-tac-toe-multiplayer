import { ref, watch } from 'vue'
interface IPlayer {
    symbol: string
    moves: number[]
}
interface IPlayers {
    X: IPlayer
    O: IPlayer
}
const useGame = () => {
    const defaultBoard = [
        '', '', '',
        '', '', '',
        '', '', '',
    ]
    const board = ref<string[]>([...defaultBoard])
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
    const players = ref<IPlayers>({
        X: {
            symbol: 'X',
            moves: []
        },
        O: {
            symbol: 'O',
            moves: []
        }
    })
    const turn = ref<string>(players.value.X.symbol)
    const winner = ref<string>('')
    const draw = ref<boolean>(false)
    const gameOver = ref<boolean>(false)

    
    const changeTurn = () => {
        turn.value = turn.value === 'X' ? 'O' : 'X'
    }
    const addMoveToPlayerMoves = (player: keyof IPlayers, move: number) => {
        players.value[player].moves.push(move)
    }
    const makeMove = (playerTurn: keyof IPlayers, moveIndex: number) => {
        const playerOneMoves = players.value.X.moves
        const playerTwoMoves = players.value.O.moves
        const playersMovesAmount = playerOneMoves.length + playerTwoMoves.length
        const gameBoard = board.value
        const isGameOver = gameOver.value
        const gameWinner = winner.value

        if (gameWinner) return
        if (isGameOver) return
        if (playersMovesAmount === gameBoard.length) return
        gameBoard[moveIndex] = playerTurn
        addMoveToPlayerMoves(playerTurn, moveIndex)
        checkWinner(playerOneMoves, playerTwoMoves)
        changeTurn()
    }
    const checkWinner = (playerOneMoves: number[], playerTwoMoves: number[]) => {
        const checkP1Win = winCombinations.some(combination => {
            return combination.every(c => {
                return playerOneMoves?.includes(c)
            })
        })
        const checkP2Win = winCombinations.some(combination => {
            return combination.every(c => {
                return playerTwoMoves?.includes(c)
            })
        })
    
        if (checkP1Win) {
            gameOver.value = true
            winner.value = players.value.X.symbol
        }
        if (checkP2Win) {
            gameOver.value = true
            winner.value = players.value.O.symbol
        }
        return false
    }
    const restartGame = () => {
        const newBoard = [...defaultBoard]
        players.value.X.moves = []
        players.value.O.moves = []
        turn.value = players.value.X.symbol
        winner.value = ''
        gameOver.value = false
        draw.value = false
        
        board.value = newBoard
    }

    watch(board, (currentBoard) => {
        const boardCompleted = currentBoard.every(field => Boolean(field))
        if (boardCompleted) draw.value = true
    }, { deep: true })

    return {
        board,
        turn,
        winner,
        draw,
        makeMove,
        restartGame
    }
}


export default useGame