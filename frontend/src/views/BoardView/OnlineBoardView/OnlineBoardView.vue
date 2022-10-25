<template>
    <div class="container">
        <div class="the-board-view">
            <div v-if="playerDisconnected" class="player-disconnected">
                <p class="player-disconnected-text">Your opponent quit the game.</p>
                <p class="player-disconnected-sub-text">Redirecting you to home in {{secondsToHome}} seconds...</p>
            </div>
            <div v-else-if="!gameStart" class="waiting">
                <span class="copy-text">Copy and send this URL to your opponent: </span>
                <p class="copy-url">{{url}}</p>
                <p class="waiting-text">Waiting the second player connect to start the game</p>
                <DotLoading />

            </div>
            <div v-else class="game">
                <div class="turn">
                    <div class="turn-text">Turn:</div>
                    <div class="turn-symbol" :class="turnColor"> {{turn}}</div>
                </div>
                <TheBoard
                    :board="board"
                    :turn="turn"
                    @makeMove="makeMove"
                    :winner="winner"
                    :winnerCombination="winnerCombination"
                    :disabled="!isMyTurn"
                />
                <div class="scores">
                    <div class="score player-x">
                        <div class="score-title">{{player.symbol === 'X' ? 'You' : 'Player'}} X</div>
                        <div class="score-number">{{gameScore.X}}</div>
                    </div>
                    <div class="score ties">
                        <div class="score-title">Ties</div>
                        <div class="score-number">{{gameScore.ties}}</div>
                    </div>
                    <div class="score player-o">
                        <div class="score-title">{{player.symbol === 'O' ? 'You' : 'Player'}} O</div>
                        <div class="score-number">{{gameScore.O}}</div>
                    </div>
                </div>
                <div v-if="gameOver" class="end-buttons">
                    <div class="rematch">
                        <DButton :color="rematchButtonColor" @eventClick="rematch">Rematch</DButton>
                    </div>
                     <div class="menu">
                        <DButton class="menu" @eventClick="goToMenu">menu</DButton>
                     </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import TheBoard from '@/components/TheBoard/TheBoard.vue'
import DButton from '@/components/DButton/DButton.vue'
import DotLoading from '@/components/DotLoading/DotLoading.vue'
import { useRoute, useRouter } from 'vue-router'
import { io } from "socket.io-client";
import { ref, computed } from 'vue'

interface IPlayer {
    symbol: string
    moves: number[]
    score: number
}
interface IResponse {
    status: number
    message: string
    player: IPlayer

}
interface IGameScore {
    X: number
    O: number
    ties: number
}
interface IStartGameResponse {
    start: boolean
    board: string[]
    turn: string
    gameScore: IGameScore
}
interface IPlayerMove {
    moveIndex: number
    turn: string
}


const route = useRoute()
const router = useRouter()
const roomId = route.params.id
const socket = io('http://localhost:3000')

const sessioFull = ref<boolean>(false)
const gameStart = ref<boolean>(false)
const player = ref<IPlayer>({
    symbol: '',
    moves: [],
    score: 0
})
const gameScore = ref<IGameScore>({
    X: 0,
    O: 0,
    ties: 0
})
const board = ref<string[]>([])
const turn = ref<string>('')
const winner = ref<string>('')
const winnerCombination = ref<number[]>([])
const gameOver = ref<boolean>(false)
const playerDisconnected = ref<boolean>(false)
const secondsToHome = ref<number>(3)

const rematchButtonColor = computed((): string => {
    if (winner.value === 'X') return 'accent-two'
    if (winner.value === 'O') return 'accent-one'
    return ''
})
const turnColor = computed((): string => {
    return turn.value === 'X' ? 'turn-X' : 'turn-O'
})
const isMyTurn = computed(() => {
    return turn.value === player.value.symbol
})
const url = computed(() => {
    return window.origin + route.fullPath
})

const makeMove = (playerMove: IPlayerMove) => {
    socket.emit('player_move', {...playerMove, roomId})
}

const goToMenu = () => {
    socket.disconnect()
    router.push({name: 'home'})
}
const rematch = () => {
    socket.emit('rematch', roomId)
}

socket.emit('check_room', roomId, (response: IResponse) => {
    if (response.status === 400) {
        sessioFull.value = true
        return
    }
    if (response.status === 200) {
        player.value = response.player
    }
})

socket.on('ready_to_start', () => {
    socket.emit('start_game', roomId, (startGameResponse: IStartGameResponse) => {
        gameStart.value = startGameResponse.start
        board.value = startGameResponse.board
        turn.value = startGameResponse.turn
        gameScore.value = startGameResponse.gameScore
    })
})
socket.on('game_update', (gameUpdate) => {
    board.value = gameUpdate.board
    turn.value = gameUpdate.turn
    winner.value = gameUpdate.winner
    winnerCombination.value = gameUpdate.winnerCombination
    gameScore.value = gameUpdate.scores
    gameOver.value = gameUpdate.gameOver
})
socket.on('start_rematch_game', (rematchGame) => {
    board.value = rematchGame.board
    turn.value = rematchGame.turn
})
socket.on('player_disconnected', () => {
    playerDisconnected.value = true
    const timer = setInterval(() => {
        if (secondsToHome.value === 0) {
            clearInterval(timer)
            goToMenu()
        }
        secondsToHome.value --
    }, 1000)
})

</script>

<style lang="scss" scoped>
.the-board-view {
    min-height: 100vh;
    display: flex;

    .player-disconnected {
        margin: auto;

        .player-disconnected-text {
            font-size: 1.5rem;
            font-weight: 700;
            text-align: center;
        }
        .player-disconnected-sub-text {
            text-align: center;
        }
    }
    .waiting {
        margin: auto;
        display: flex;
        flex-direction: column;
        align-items: center;

        
        .copy-url {
            background-color: var(--color-semi-neutral);
            padding: var(--half-padding);
            border-radius: var(--radius);
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .copy-button {
            background-color: var(--color-semi-neutral);
            color: var(--color-neutral);
            border: none;
            border-radius: var(--radius);
            padding: var(--half-padding);
            font-weight: 700;
        }
        
        .waiting-text {
            font-size: 1.25rem;
            font-weight: 700;
            text-align: center;
        }
    }
    .game {
        margin: auto;

        .turn {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: var(--half-padding);

            .turn-text {
                font-size: 1.25rem;
                font-weight: 900;
                letter-spacing: 2px;
            }
            .turn-symbol {
                font-size: 1.25rem;
                font-weight: 900;

                &.turn-X {
                    color: var(--color-accent-one);
                }
                &.turn-O {
                    color: var(--color-accent-two);
                }
            }
        }
        .scores {
            display:  flex;
            justify-content: space-between;
            align-items: center;
            gap: var(--half-padding);
            padding-top: var(--full-padding);;
            
            .score {
                border-radius: var(--radius);
                width: 100%;
                aspect-ratio: 2;
                background-color: var(--color-semi-neutral);
                padding: var(--half-padding);

                &.player-x {
                    background-color: var(--color-accent-one);
                    color: var(--color-backgrond);
                }
                &.ties {
                    background-color: var(--color-neutral);
                    color: var(--color-backgrond);
                }
                &.player-o {
                    background-color: var(--color-accent-two);
                    color: var(--color-backgrond);
                }

                .score-title,
                .score-number {
                    text-align: center;
                }
                .score-title {
                    font-size: 0.9rem;
                }
                .score-number {
                    font-weight: 900;
                    font-size: 1.25rem;
                }
            }
        }
        .end-buttons {
            display: flex;
            align-items: center;
            gap: 16px;
            padding-top: var(--full-padding);;

            .rematch {
                flex: 90%
            }
        }
    }
}
</style>