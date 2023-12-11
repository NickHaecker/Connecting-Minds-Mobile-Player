
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
  <div id="HomeView"> 
    
    <main class="content">
      <section class="game-container">
        <div class="header-section">
          <h1>Welcome to Connecting Minds</h1>
          <p>WATCHER</p>
        </div>
      <section class="player-section">
        <div class="player-info">
          NAME
        </div>
        <div class="player-avatar">
          <img src="@/assets/avatar.png" alt="Avatar Icon">
        </div>

      <section class="game-controls">
        <button @click= "Start" class="control-button">Start</button> 
      </section>
     
    </section>
  </section>
    </main>

  </div>
  </template>

<style scoped>

.header-section h1 {
  color: white;
}

.header-section p {
  color: white;
}

#HomeView {

padding: 110px;
margin: 0px;

}

.game-container {
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
  background-color: transparent;
  backdrop-filter: blur(10px);
  background-color: transparent;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

header {
  padding: 20px;
  border-radius: 10px;
  background-color: #1f1f1f;
}

main {
 
}

.footer {
  text-align: center;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 10px;
  background-color: #1f1f1f;
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
}
.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.control-button {
  background-color:#3d898d(51, 170, 255, 0.8); /* Hervorhebung mit Transparenz */
  background-color: #3d898d;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  animation: pulse 5s infinite; /* Pulsierende Animation für die Tasten */
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}


.control-button:hover {
  background-color: #85ebd9;
}



</style>