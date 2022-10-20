<template>
    <div class="container">
    <div class="the-board-view">
        <div class="game">
            <div class="turn">
                <div class="turn-text">Turn:</div>
                <div class="turn-symbol" :class="turnColor"> {{turn}}</div>
            </div>
            <TheBoard
                :board="board"
                :turn="turn"
                @makeMove="makePlayerMove"
                :winner="winner"
                :winnerCombination="winnerCombination"
                :disabled="false"
            />
            <div class="scores">
                <div class="score player-x">
                    <div class="score-title">Player X</div>
                    <div class="score-number">{{players.X.score}}</div>
                </div>
                <div class="score ties">
                    <div class="score-title">Ties</div>
                    <div class="score-number">{{draw}}</div>
                </div>
                <div class="score player-o">
                    <div class="score-title">Player O</div>
                    <div class="score-number">{{players.O.score}}</div>
                </div>
            </div>
            <div v-if="gameOver" class="end-buttons">
                <div class="rematch">
                    <DButton :color="rematchButtonColor" @eventClick="restartGame">Rematch</DButton>
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
import useGame from '@/composables/useGame'
import { computed } from 'vue';
import { useRouter } from 'vue-router'

interface IPlayerMove {
    turn: string
    moveIndex: number
}
interface IPlayer {
    symbol: string
    moves: number[]
}
interface IPlayers {
    X: IPlayer
    O: IPlayer
}

const router = useRouter()
const { 
    board,
    players,
    turn,
    winner,
    winnerCombination,
    gameOver,
    draw,
    makeMove,
    restartGame
} = useGame()

const rematchButtonColor = computed((): string => {
    if (winner.value === 'X') return 'accent-two'
    if (winner.value === 'O') return 'accent-one'
    return ''
})
const turnColor = computed((): string => {
    return turn.value === 'X' ? 'turn-X' : 'turn-O'
})

const makePlayerMove = (playerMove: IPlayerMove) => {
    const playerTurn = playerMove.turn as keyof IPlayers
    const moveIndex = playerMove.moveIndex
    makeMove(playerTurn, moveIndex)
}

const goToMenu = () => {
    router.push({name: 'home'})
    restartGame(true)
}
</script>

<style lang="scss" scoped>
@import './LocalBoardView.scss'
</style>