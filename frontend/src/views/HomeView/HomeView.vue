<template>
  <div class="container">
    <div class="home">
      <div class="menu">
        <div class="menu-title">
          <div class="menu-hash-one">#</div>
          Tic Tac Toe
          <div class="menu-hash-two">#</div>
        </div>
        <DButton color="accent-two" fontW="bold" @eventClick="startLocalGame">New Game (Local)</DButton>
        <DButton color="accent-two" fontW="bold">New Game (Online)</DButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" >
import DButton from '@/components/DButton/DButton.vue'

const startLocalGame = () => {
  console.log('Start Local Game')
}
</script>

<style lang="scss">
.home {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .menu {
    background-color: var(--color-semi-neutral);
    padding: var(--full-padding);
    border-radius: var(--radius);
    width: Min(30rem, 100%);
    display: flex;
    flex-direction: column;
    gap: 16px;

    .menu-title {
      position: relative;
      font-size: 2rem;
      font-weight: bold;
      text-align: center;
      letter-spacing: 2px;
      padding-bottom: 2rem;

      .menu-hash-one {
        position: absolute;
        top: 0;
        left: 0;
        animation: rotating 5s linear infinite;
      }
      .menu-hash-two {
        position: absolute;
        top: 0;
        right: 0;
        animation: rotating 5s linear infinite;
      }

      @keyframes rotating {
        to { transform: rotate(360deg);}
      }
    }

  }
}
</style>
