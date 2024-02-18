<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { onBeforeUnmount, onMounted } from 'vue';
import { useWebSocketStore } from '@/extensions/athaeck-websocket-vue3-extension/stores/webSocket';
import { SendEvent } from './extensions/athaeck-websocket-vue3-extension/helper/types';
import NotificationComponentVue from './extensions/notifications/components/NotificationComponent.vue';
import bus from './hooks';
import { ConnectingMindsEvents } from './types/Connecting-Minds-Data-Types/types';
import router from './router';
const socketStore = useWebSocketStore()

onBeforeUnmount(() => {
  console.log("leave")
  // const disconnectPlayerTwo: SendEvent = new SendEvent('DISCONNECT_PLAYER_TWO')

  // socketStore.SendEvent(disconnectPlayerTwo)

  socketStore.Disconnect()


})
onMounted(() => {
  socketStore.Connect()

  bus.on("TAKE_MESSAGE", (body: any) => {
    const data = <SendEvent>body
    const eventData: SendEvent = <SendEvent>body
    if (eventData.eventName === ConnectingMindsEvents.MISSING) {
      router.push({ name: "home" })
    }
  });
})

</script>

<template>
  <v-app class="main">
    <NotificationComponentVue />
    <div class="background">
      <RouterView />
    </div>
    <footer>
      <p>&copy; 2024 Connecting-Minds Watcher</p>
    </footer>
  </v-app>
</template>

<style scoped>
.background {
  background: url('@/assets/ai_neural.jpg') no-repeat;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100%;
  color: white;
}

.main {
  height: 100%;
}


footer {
  text-align: center;

  padding: 10px;

  background-color: #1f1f1f;
}
</style>
<style></style>