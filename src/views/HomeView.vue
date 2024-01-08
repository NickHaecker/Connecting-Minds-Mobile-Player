
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

const showdialog = ref(true)

onMounted(() => {
  socketStore.Connect()

})

function joinSession() {
  const joinSessionEvent: SendEvent = new SendEvent('JOIN_SESSION') 
  socketStore.SendEvent(joinSessionEvent);
}

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
  
  
  <v-row justify="center">
    <v-dialog
      v-model="showdialog"
      persistent
      width="auto"
    >
      <template v-slot:activator="{ props }">
        <button
          
          v-bind="props"
          class="control-button"
        >
          Open Dialog
      </button>
      </template>
      <v-card class="custom-card">
        <v-card-title class="text-h5">
          Use Google's location service?
        </v-card-title>
        <v-card-text>Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.</v-card-text>
        <div class="dialog-actions">
          <button class="disagree-button"></button>
          <button class="agree-button"></button> 
        </div>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="white"
            variant="text"
            @click="showdialog = false"
          >
            Disagree
          </v-btn>
          <v-btn
            color="white"
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

.footer {
  text-align: center;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 10px;
  background-color: #1f1f1f;
}

.custom-card {
  background-color: #3d898d;

}

.custom-card {
  background-color: transparent; /* Hintergrundfarbe anpassen */
  color: white; /* Schriftfarbe anpassen */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.custom-dialog-btn {
  /* Benutzerdefinierte Styles für den Button */
  /* z.B., Hintergrundfarbe ändern: */
  color: #fff;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  animation: pulse 5s infinite;
  background-image: url('@/assets/button_image.png');
  background-size: cover;
  background-position: center;
  height: 200px;
  width: 200px;
  
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


.text-h5{
color: orange; 
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
}

.disagree-button,
.agree-button {
  
  color: white!important;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-left: 10px;
}

.disagree-button:hover,
.agree-button:hover {
  color: white;
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