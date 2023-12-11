<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { onBeforeUnmount } from 'vue';
import { useWebSocketStore } from '@/extensions/athaeck-websocket-vue3-extension/stores/webSocket';
import { SendEvent } from './extensions/athaeck-websocket-vue3-extension/helper/types';
const socketStore = useWebSocketStore() 

onBeforeUnmount(() => {
  console.log("leave") 
  const disconnectPlayerTwo: SendEvent = new SendEvent('DISCONNECT_PLAYER_TWO')
  
  socketStore.SendEvent(disconnectPlayerTwo)

  socketStore.Disconnect()

})

</script>

<template>
<div class="background"> 
  <RouterView />
</div>
  <footer>
    <p>&copy; 2023 Mobile Player Website</p>
  </footer>
  
</template>

<style >
.background {
  font-family: 'Orbitron';
  background: url('@/assets/ai_neural.jpg') no-repeat;
  background-position: -950px -150px;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

#app {
  padding: unset!important;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}.footer {
  text-align: center;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 10px;
  background-color: #1f1f1f;
}
</style>
