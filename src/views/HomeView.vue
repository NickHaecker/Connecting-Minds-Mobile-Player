
<script setup lang="ts">
import { SendEvent } from '@/extensions/athaeck-websocket-vue3-extension/helper/types';
import { useWebSocketStore } from '@/extensions/athaeck-websocket-vue3-extension/stores/webSocket';
import { onMounted, ref } from 'vue';
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


  const showdialog = ref(true)


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
        <button @click= "Info" class="info-button">Info</button> 
      </section>
     
    </section>
  </section>
  </main>
  
  <v-row justify="center">
    <v-dialog
      v-model="showdialog"
      persistent
      width="auto"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          color="primary"
          v-bind="props"
        >
          Open Dialog
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5">
          Use Google's location service?
        </v-card-title>
        <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green-darken-1"
            variant="text"
            @click="showdialog = false"
          >
            Disagree
          </v-btn>
          <v-btn
            color="green-darken-1"
            variant="text"
            @click="showdialog = false"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
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
  
  display: grid; 
  grid-template-columns: repeat(2, auto);
  grid-gap: 10px;
  margin-bottom: 50px; 
  background-color: transparent;
}
.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.control-button {
  
  color: #ffffff;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  animation: pulse 5s infinite; /* Pulsierende Animation für die Tasten */ 
  background-image: url('@/assets/button_image.png'); /* Ersetze 'pfad/zum/deinem/bild.jpg' durch den Pfad zu deinem Bild */
  background-size: cover; /* oder contain, je nachdem, wie du das Bild skalieren möchtest */
  background-position: center; /* Hintergrundposition zentrieren */
  height: 150px;
  width: 150px;
  color: #fff; /* Textfarbe des Buttons, um Lesbarkeit sicherzustellen */
  cursor: pointer; /* Ändert den Cursor, wenn er über dem Button liegt */
  /* Weitere Stilisierungen nach Bedarf */
}

.info-button {
  color: #ffffff;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  animation: pulse 5s infinite; /* Pulsierende Animation für die Tasten */ 
  background-image: url('@/assets/button_image.png'); /* Ersetze 'pfad/zum/deinem/bild.jpg' durch den Pfad zu deinem Bild */
  background-size: cover; /* oder contain, je nachdem, wie du das Bild skalieren möchtest */
  background-position: center; /* Hintergrundposition zentrieren */
  height: 150px;
  width: 150px;
  
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
 
}



</style>