<template>
    <div class="the-board">
        <div 
            class="field"
            v-for="(field, index) in props.board"
            :class="winnerCombination?.includes(index) ? field === winner ? `winner-${winner}` : '' : ''"
            :key="index"
            @click="emits('makeMove', { moveIndex: index, turn: props.turn })"
        >
            <button class="mark" :class="field === 'X' ? 'turn-x' : 'turn-o'" :disabled="disabled">
                {{ field }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
interface IProps {
    board: string[]
    turn: string
    winner: string
    winnerCombination: number[]
    disabled: boolean
}
interface IPlayerMove {
    turn: string
    moveIndex: number
}

const props = defineProps<IProps>()
const emits = defineEmits<{
    (e: 'makeMove', playerMove: IPlayerMove): void
}>()


</script>

<style lang="scss" scoped>
.the-board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--half-padding);
    

    .field {
        background-color: var(--color-semi-neutral);
        border-radius: var(--radius);
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100px;
        aspect-ratio: 1;

        &.winner-X {
            outline: 2px solid var(--color-accent-one);
            animation: pulse linear 1s;
        }
        &.winner-O {
            outline: 2px solid var(--color-accent-two);
            animation: pulse linear 1s;
        }

        @keyframes pulse {
            0% {
                transform: scale(1.0);
            }
            50% {
                transform: scale(1.1);
            }
            100% {
                transform: scale(1.0);
            }
        }

        .mark {
            height: 100%;
            width: 100%;
            background-color: transparent;
            border: none;
            outline: none;
            font-weight: 900;
            font-size: 2rem;

            &.turn-x {
                color: var(--color-accent-one);
            }
            &.turn-o {
                color: var(--color-accent-two);
            }
        }
    }
}

</style>