
<template>
  <div id="GameView">
    <div class="inset">
      <div class="top-part">
        <div class="action-part">
          <div class="item-select">
            <v-select v-model="selectedItem" label="Gegenstand auswählen" :items="getAvailableItems"></v-select>
          </div>
          <div class="position-select">
            <v-select v-model="selectedPosition" :disabled="selectedItem === null" label="Position auswählen" :items="getAvailablePositions"></v-select>
          </div>
          <div class="action-bar">
            <div class="place">
              <button :disabled="selectedItem === null && selectedPosition == null" @click="placeItem" class="control-button">Gegenstand platzieren</button>
            </div>
            <div class="discard">
              <button :disabled="!selectedItem || !selectedPosition" @click="discardSelection" class="control-button">Auswahl löschen</button>
            </div>
          </div>
        </div>
        <div class="listing-part">
          <span style="">Platzierte Gegenstände:</span>
          <div v-for="item in getPlacedItems" :key="item.Item.Name" class="list-item">
            <div class="inner-item">
              <div class="item-name"><span> {{item.Item.Name}}</span></div>
              <div class="remove-item">
                <!-- <v-icon color="white" size="36">mdi-delete</v-icon>
                 -->
                 <span @click="removeItem(item)"><strong style="cursor: pointer;font-size: 18px;">X</strong></span>
                 
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="map-part">
        <v-carousel>
          <v-carousel-item v-for="(item, i) in getMapImages" :key="i" :src="item.src" cover></v-carousel-item>
        </v-carousel>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SendEvent } from '@/extensions/athaeck-websocket-vue3-extension/helper/types';
import { useWebSocketStore } from '@/extensions/athaeck-websocket-vue3-extension/stores/webSocket';
import { useNotificationStore } from '@/extensions/notifications/stores';
import { ref, onBeforeMount, computed } from 'vue';
import bus from '@/hooks';
import { useclientStore } from '@/stores/client';
import router from '@/router';
import { onUnmounted } from 'vue';
import { ConnectingMindsEvents, type Item, type Path, type PlacedItem, type Position } from '@/types/Connecting-Minds-Data-Types/types';

const clientStore = useclientStore()
const socketStore = useWebSocketStore()
const notificationStore = useNotificationStore()


const selectedItem = ref(null)
const selectedPosition = ref(null);


const getMapImages = computed(() => {
  // return sessionID.value.length > 0
  // const paths:Path[] = se
  return [{ src: "https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg" }]
})
const getAvailableItems = computed(()=>{
  return clientStore.SessionData?.AvailableItems.map((item:Item) => item.Name) || [];
})
const getAvailablePositions = computed(()=>{

  return clientStore.SessionData?.AvailablePositions.map((item:Position) => item.Name,
  ) || [];
})
const getPlacedItems = computed(()=>{
  return clientStore.SessionData?.PlacedItems
})

function discardSelection():void{
  selectedItem.value = null
  selectedPosition.value = null
}
function placeItem(): void{

  if(!clientStore.SessionData?.ContainsPlayer){
    notificationStore.SpawnNotification({
      type: "info",
        message: "Es ist kein Spieler in der Szene, du kannst derzeit keine Gegenstände platzieren.",
        action1: { label: "" }
    })
    return;
  }

  const position: Position | null = clientStore.SessionData.AvailablePositions.find((item)=> item.Name === selectedPosition.value) || null

  const item:Item| null = clientStore.SessionData.AvailableItems.find((position)=>position.Name === selectedItem.value) || null

  if(position !== null && item !== null){
    const placeItem:PlacedItem={
      Item:item,
      Position:position
    }
    const placeItemEvent:SendEvent = new SendEvent(ConnectingMindsEvents.PLACE_ITEM)
    placeItemEvent.addData("PlacedItem",placeItem)

    socketStore.SendEvent(placeItemEvent)
    discardSelection()
  }
}
function removeItem(item:PlacedItem): void{
  if(!clientStore.SessionData?.ContainsPlayer){
    notificationStore.SpawnNotification({
      type: "info",
        message: "Es ist kein Spieler in der Szene, du kannst derzeit keine Gegenstände entfernen.",
        action1: { label: "" }
    })
    return;
  }
  const removeItemEvent:SendEvent = new SendEvent(ConnectingMindsEvents.REMOVE_ITEM)
  removeItemEvent.addData("PlacedItem",item)

    socketStore.SendEvent(removeItemEvent)
}

onBeforeMount(() => {
  if (clientStore.SessionData === null) {
    // router.push({name:"home"})
  }

  bus.on("TAKE_MESSAGE", (body: any) => {
    const data = body as SendEvent

  });


})
onUnmounted(() => {
  if (clientStore.SessionData === null) {
    return;
  }
  const leave: SendEvent = new SendEvent(ConnectingMindsEvents.LEAVE_SESSION)
  leave.addData("Type", "WATCHER")
  socketStore.SendEvent(leave)
})
</script>

<style scoped>
#GameView {
  padding:  2% 10%;
}

.control-button {
  color: #ffffff;
  padding: 14px 28px;
  border-radius: 5px;
  cursor: pointer;
  width: 200px;
  transition: background-color 0.3s ease;
  animation: pulse 5s infinite;
  background-image: url('@/assets/button_image.png');
  background-size: cover;
  background-position: center;
}
.control-button:hover{
  background-image: url('@/assets/button_image.png');
  background-size: cover;
  background-position: center;
}
.list-item{
  width: 100%;
  /* height: 40px; */
}
.item-name{
  width: 90%;
}
.remove-item{
  /* float: right; */
  width: 10%;
}
.inner-item{
  display: flex;
  padding: 7px;
  border: 1px lightgray solid;
  vertical-align:middle
}
.action-bar{
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
.control-button:disabled {
  filter: grayscale(100%) !important;
  animation: none;
  cursor: not-allowed;
}
.map-part{
  margin-top: 100px;
}
.place{
  display: flex;
  justify-content: center;
  width: 50%;
}
.discard{
  display: flex;
  justify-content: center;
  width: 50%;
}


.top-part {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
}

.action-part {
  padding: 0 14px;
  width: 50%;
}

.listing-part {
  width: 50%;
  padding: 0 14px;
}
.position-select{
  margin-top: 28px;
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
