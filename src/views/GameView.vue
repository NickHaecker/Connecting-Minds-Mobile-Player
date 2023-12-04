
<template>
  <div id="app">
    <main>
      <section class="game-container">
        <div class="game-info">
          <p>Score: {{ level }}</p>
          <p>Level: {{ score }}</p>
        </div>
       <section class="game-controls">
          <button @click="()=>showItems = !showItems" class="control-button">Items</button> 
          <button @click="()=>showPosition = !showPosition" class="control-button">Positions</button> 
        </section>
        <div class="item-list" v-if="showItems">
         
          <ul>
            <li @click="PlaceItem(item)" v-for="item in itemList" :key="item.Name">{{ item.Name }}</li>
          </ul>
          <!-- <ul>
            <li v-for="item in itemList" :key="item.Name">
              {{ item.Name }}
              <button @click="placeItem(item)">Platzieren</button>
              <button @click="removeItem(item)">Entfernen</button>
            </li>
          </ul> -->
        </div>
        <div class="position" v-if="showPosition"> 
          <h5>Position 1</h5>
          <h5>Position 2</h5>
          <h5>Position 3</h5>
          <ul>
            <li @click="selectedPosition(position)" v-for="position in position" :key="item.Name">{{ item.Name }}</li>
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

//const onTakeMessageRef = ref<(body: any) => void>(OnTakeMessage);
const itemList = ref({Name:"KeyCard", Description:"KeyCard, um Tür aufzuschließen"});
 

const positions = ref([
  { id: 1, name: 'Position 1' },
  { id: 2, name: 'Position 2' },
  { id: 3, name: 'Position 3' },
]);

const selectedPosition = ref(null);
const showItems = ref(false)
const showPosition = ref(false)

onBeforeMount(() => {
  const GetItems = new SendEvent("GET_ITEMS") 
  bus.on("TAKE_MESSAGE",(body:any)=>{
    const data = <SendEvent>body
    if(data.eventName === "ON_GET_ITEMS"){
      console.log(data.data)
      itemList.value = data.data.Items;
      console.log(itemList.value);

    }
    if(data.eventName === "ON_PLACE_ITEM"){
      console.log(data.data)
      handleItemPlacement(data.data);
    }
    if (data.eventName === "ON_REMOVE_ITEM") {
      console.log(data.data);
      // Logik zum Entfernen des Items einfügen
      handleItemRemoval(data.data);
    }
  });
  socketStore.SendEvent(GetItems)

  const itemListVisible = ref(false);

function toggleItemList() {
  // Hier wird der Zustand itemListVisible umgekehrt
  itemListVisible.value = !itemListVisible.value;
}
function Select(){
  showItems.value = !showItems.value
}

}),
function handleItemPlacement(item) {
  //Logik zum Platzieren des Items implementieren
  console.log(`Item wurde platziert: ${item.Name}`);
}
function handleItemRemoval(item) {
  //Logik zum Entfernen des Items implementieren
  console.log(`Item wurde entfernt: ${item.Name}`);
}

// function PlaceItem(item){
//   console.log(`Item wird platziert: ${item.Name}`);
//   socketStore.SendEvent({
// eventName: 'PLACE_ITEM_EVENT',
// data: item,
// JSONString: '',
// addData: function (key: string, value: any): void {
// throw new Error('Function not implemented.');
// }
// });
// }

// function RemoveItem(item) {
//   //Funktion zum Entfernen des Items implementieren
//   // Diese Funktion könnte dann bei einem Klick oder anderen Benutzerinteraktion aufgerufen werden
//   console.log(`Item wird entfernt: ${item.Name}`);
//   socketStore.SendEvent({
// eventName: 'REMOVE_ITEM_EVENT',
// data: item,
// JSONString: '',
// addData: function (key: string, value: any): void {
// throw new Error('Function not implemented.');
// }
// });
// }

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
