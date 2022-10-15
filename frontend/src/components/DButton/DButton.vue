<template>
    <button class="d-button" :class="buttonCSS" @click="emits('eventClick')">
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
import {defineProps, defineEmits, computed } from 'vue'
const props = defineProps({
    color: {type: String, default: 'default'},
    fontW: {type: String, default: 'regular'}
})
const emits = defineEmits<{
    (e: 'eventClick'): void
}>()


const buttonCSS = computed(() => ({
    [props.color]: true,
    [props.fontW]: true
}))
</script>

<style lang="scss" scoped>
.d-button {
    width: 100%;
    height: 100%;
    padding: var(--half-padding);
    border-radius: var(--radius);
    outline: none;
    border: none;
    cursor: pointer;
    transition: all ease-out .25s;
    letter-spacing: 2px;

    &.regular {
        font-weight: normal;
    }
    &.bold {
        font-weight: bold;
    }

    &.default {
        background-color: var(--color-neutral);
        color: var(--color-semi-neutral)
    }
    &.accent-one {
        border-bottom: 3px solid var(--color-accent-one-darker);
        background-color: var(--color-accent-one);
        &:hover {
            background-color: var(--color-accent-two);
            border-bottom: 3px solid var(--color-accent-two-darker);
        }
    }
    &.accent-two {
        border-bottom: 3px solid var(--color-accent-two-darker);
        background-color: var(--color-accent-two);
        &:hover {
            background-color: var(--color-accent-one);
            border-bottom: 3px solid var(--color-accent-one-darker);
        }
    }
}  
</style>