
<template>
  <div id="GameView">
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
          <ul>
            <li @click="SelectedPosition(position)" v-for="position in positions" :key="position.ID">{{ position.Name }}</li>
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
  { ID: 1, Name: 'Position 1' },
  { ID: 2, Name: 'Position 2' },
  { ID: 3, Name: 'Position 3' },
]);

const selectedPosition = ref(null);
const showItems = ref(false)
const showPosition = ref(false)

onBeforeMount(() => {
  const GetItems = new SendEvent("GET_ITEMS") 
  const GetPositions = new SendEvent("GET_POSITIONS")
  bus.on("TAKE_MESSAGE",(body:any)=>{
    const data = <SendEvent>body
    if(data.eventName === "ON_GET_ITEMS"){
      itemList.value = data.data.Items;
    }

    if(data.eventName === "ON_GET_POSITIONS"){
      positions.value = data.data.Positions;
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
  socketStore.SendEvent(GetPositions)


}),
function toggleItemList() {
  // Hier wird der Zustand itemListVisible umgekehrt
  itemListVisible.value = !itemListVisible.value;
}
function Select(){
  showItems.value = !showItems.value
}
function PlaceItem (item){
  console.log(`Item wurde platziert: ${item.Name}`);
}

function SelectedPosition (position){
  console.log(`Position wurde ausgewählt: ${position.Name}`);
}

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

<style scoped>

#GameView {
display: grid; 
grid-template-columns: repeat(2, auto);
grid-gap: 10px;
margin-bottom: 50px; 
background-color: transparent;
padding: 110px;
margin: 0px;
}

header, nav, section, footer {
  margin-bottom: 20px;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 10px; /* Optional: Abgerundete Ecken */
}

header {
  text-align: center;
  padding: 20px;
}

/* Transparenz für Tasten und Abschnitte */
header,
.game-info,
.game-controls,
.item-list,
.position {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 30px;
}



.game-container {
  max-width: 800px; /* Erweitere die Breite für mehr Raum im galaktischen Design */
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
  background-color: rgba(12, 12, 12, 0.8); /* Transparenter Hintergrund für den Container */
  backdrop-filter: blur(10px); /* Hinzufügen von Unschärfe für ein futuristisches Gefühl */
  background-color: transparent;
  position: relative; /* Positionierung für absolute Elemente innerhalb des Containers */
}

.game-info {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-around;
  backdrop-filter: blur(5px); /* Weitere Unschärfe für den Infobereich */
}

.info-item {
  margin: 0;
  font-size: 18px; /* Größere Schrift für Spielinformationen */
  color: #33aaff; /* Hervorhebung der Textfarbe */
}

.game-board {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 15px;
  
}

.game-controls {
display: grid; 
grid-template-columns: repeat(2, auto);
grid-gap: 10px;
margin-bottom: 50px; 
background-color: transparent;
}

.control-button {
  background-color:#3d898d(51, 170, 255, 0.8); /* Hervorhebung mit Transparenz */
  background-color: #3d898d;
  color: #ffffff;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  animation: pulse 5s infinite; /* Pulsierende Animation für die Tasten */
}

.control-button:hover {
  background-color: #85ebd9;
}

.item-list {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 15px;
  border-radius: 10px;
  margin-top: 20px;
}

.position {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 15px;
  border-radius: 10px;
  margin-top: 20px;
}

.item-list,
.position {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 15px;
  border-radius: 10px;
  margin-top: 20px;
}

.item-list ul,
.position ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.item-list li,
.position li {
  margin-bottom: 15px; /* Mehr Abstand zwischen Listenpunkten */
  margin-bottom: 5px;
  padding: 10px;
  border-radius: 5px;
  background-color: #3d898d;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
}

.item-list li:hover{
  color: #3d898d;
}
.position li:hover {
  background-color: #85ebd9;
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
</style>
