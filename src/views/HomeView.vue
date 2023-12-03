
<script setup lang="ts">
import { SendEvent } from '@/extensions/athaeck-websocket-vue3-extension/helper/types';
import { useWebSocketStore } from '@/extensions/athaeck-websocket-vue3-extension/stores/webSocket';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const socketStore = useWebSocketStore() 
const router = useRouter()
function Start (){ 
  const connectPlayerTwo: SendEvent = new SendEvent('CONNECT_PLAYER_TWO')
  
  socketStore.SendEvent(connectPlayerTwo)
  router.push({name:"game"})
}
onMounted(() => {
  socketStore.Connect()
})

</script>

<template>
  <div id="app"> 
    <header>
        <h1>Mobile Player</h1>
    </header>
    <main>
      <section class="player-section">
        <div class="player-info">
          <h2>Player Name</h2>

        </div>
        <div class="player-avatar">
          <img src="@/assets/avatar.png" alt="Avatar Icon">
        </div>
      </section>

      <section class="game-controls">
        <button @click= "Start" class="control-button">Start</button> 
      </section>
      <p>Welcome to Connecting Minds</p>
    </main>
    <footer>
      <p>&copy; 2023 Mobile Player Website</p>
    </footer>
  </div>
  </template>

<style>
body {
  font-family: 'Orbitron';
  margin: 0;
  padding: 0;
  box-sizing: border;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('@/assets/ai_neural.jpg') no-repeat;
  background-position: -950px -150px;
  text-align: center; 
}

header {
  padding: 20px;
  border-radius: 10px;
  background-color: #1f1f1f;
}

header h1 {
  margin: 0;
}

main {
  padding: 40px;
}

.custom-card {
  background-color: #3d898d;
  color: #ffffff;
}


.player-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.player-info {
  text-align: left;
  margin: 0;
}

.player-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 30%;
  margin-right: 20px;

}

.game-controls {
  display: flex;
  flex-direction: column;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.control-button {
  font-family: 'Orbitron';
  margin: 10px;
  padding: 15px;
  font-size: 16px;
  background-color: #3d898d;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.control-button:hover {
  background-color: #85ebd9;
}
</style>