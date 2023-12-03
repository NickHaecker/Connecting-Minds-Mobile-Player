
<template>
  <div id="app">
    <main>
      <section class="game-container">
        <div class="game-info">
          <p>Score: {{ level }}</p>
          <p>Level: {{ score }}</p>
        </div>
        <div class="game-board">
          <!-- Hier kommt dein Spielbrettinhalt hin -->
        </div>
        <section class="game-controls">
          <button @click= "Select" class="control-button">Select</button> 
        </section>
        <div class="item-list">
          <h2>Item List</h2>
          <ul>
            <li @click="PlaceItem(item)" v-for="item in itemList" :key="item.Name">{{ item.Name }}</li>
          </ul>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { SendEvent } from '@/extensions/athaeck-websocket-vue3-extension/helper/types';
import { useWebSocketStore } from '@/extensions/athaeck-websocket-vue3-extension/stores/webSocket';
import { ref, onBeforeMount } from 'vue';
import bus from '@/hooks';
import { convertCompilerOptionsFromJson } from 'typescript';
const socketStore = useWebSocketStore() 

// const onTakeMessageRef = ref<(body: any) => void>(OnTakeMessage);
const itemList = ref({Name:"KeyCard", Description:"KeyCard, um Tür aufzuschließen"});

const positions = ref([
  { id: 1, name: 'Position 1' },
  { id: 2, name: 'Position 2' },
  { id: 3, name: 'Position 3' },
]);

const selectedPosition = ref(null);


onBeforeMount(() => {
  // const GetItems = new SendEvent("GET_ITEMS") 
  bus.on("TAKE_MESSAGE",(body:any)=>{
    const data = <SendEvent>body
    if(data.eventName === "ON_GET_ITEMS"){
      console.log(data.data)
      itemList.value = data.data;
      console.log(itemList.value);

    }
    if(data.eventName === "ON_PLACE_ITEM"){
      console.log(data.data)

    }
  });
  // socketStore.SendEvent(GetItems)

}),
function PlaceItem(item){

}
function OnTakeMesage(body:any){
  
}

</script>

<style>
body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: url('@/assets/ai_neural.jpg') center/cover no-repeat;
  color: #ffffff;
}

header {
  text-align: center;
  padding: 20px;
}

.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-info {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.game-board {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 15px;
  
}

.item-list {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 15px;
  border-radius: 10px;
  margin-top: 20px;
}

.item-list h2 {
  margin-bottom: 10px;
}

.item-list ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.item-list li {
  margin-bottom: 5px;
}
</style>
