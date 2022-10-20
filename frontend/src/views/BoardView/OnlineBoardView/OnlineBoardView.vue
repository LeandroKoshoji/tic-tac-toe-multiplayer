<template>
    <div class="container">
        <h1>onlineGame</h1>
    </div>
</template>

<script setup>
import { io } from "socket.io-client";

const socket = io('http://localhost:3000')

</script>

<style lang="scss" scoped>

</style>