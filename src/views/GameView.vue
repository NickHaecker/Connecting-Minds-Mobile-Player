
<template>
  <div id="GameView">
    <div class="inset">
      <div class="top-part">
        <div class="action-part">
          <div class="item-select">
            <v-select v-model="selectedItem" label="Gegenstand auswählen" :items="getAvailableItems"></v-select>
          </div>
          <div class="position-select">
            <v-select v-model="selectedPosition" :disabled="selectedItem === null" label="Position auswählen"
              :items="getAvailablePositions"></v-select>
          </div>
          <div class="action-bar">
            <div class="place">
              <button :disabled="selectedItem === null && selectedPosition == null" @click="placeItem"
                class="control-button">Gegenstand platzieren</button>
            </div>
            <div class="discard">
              <button :disabled="!selectedItem || !selectedPosition" @click="discardSelection"
                class="control-button">Auswahl löschen</button>
            </div>
          </div>
        </div>
        <div class="listing-part">
          <span style="">Platzierte Gegenstände:</span>
          <div class="list-part">
            <div v-for="item in getPlacedItems" :key="item.Item.Name" class="list-item">
              <div class="inner-item">
                <div class="item-name" @click="scrollToMap(item)"
                  title="Siehe im Slider an, in welchem Levelabschnitt der Gegenstand platziert wurde."><span> {{
                    item.Item.Name }}</span></div>
                <div class="remove-item">
                  <span @click="removeItem(item)"><strong style="cursor: pointer;font-size: 18px;">X</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="map-part">
        <v-carousel ref="carousel" hide-delimiters v-model="currentIndex" height="600px">
          <v-carousel-item cover v-for="(item, i) in getMapImages" :key="i" :src="item.src"></v-carousel-item>
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
const currentIndex = ref(0)

const getMapImages = computed(() => {

  const result = [];
  const images = [{
    id: "Overview",
    src: "src/assets/map/Alllevels.PNG", 
    positions: []
  }, {
    id: "Start",
    src: "src/assets/map/Level1.PNG",
     positions: [
      "Keycardreader"
    ]
  },
  {
    id:"Raum 2",
    src:"src/assets/map/Level2.PNG",
    positions:[
      "EnergyCell Socket Left","EnergyCell Socket Right","EnergyCellSocket Middle 1"
    ]
  },{
    id:"Dritter Raum bzw Flur",
    src:"src/assets/map/Level3.PNG",
    positions:[
      "Capsule","EnergyCellSocket Middle 2"
    ]
  },
  {
    id:"Raum 4",
    src:"src/assets/map/Level4.PNG",
    positions:[
      "EnergyCellSocket Right","Capsule","Capsule 2","KeycardReader","EnergyCellSocket Middle","EnergyCellSocket Left"
    ]
  },
  {
    id:"Raum Fuenf",
    src:"src/assets/map/Level5.PNG",
    positions:[
      "PlanetOne","PlanetTwo"
    ]
  },
  {
    id:"Raum 6",
    src:"src/assets/map/Level6.PNG",
    positions:[
    ]
  }]

  for (const image of images) {
    if (image.id === "Overview" || image.id === "Start") {
      result.push(image)
    }
  }
  if (clientStore.SessionData !== null) {
    for (const path of clientStore.SessionData.UnlockedPaths) {
      for (const image of images) {
        if (image.id === path.Name) {
          result.push(image)
        }
      }
    }
  }

  return result
})
const getAvailableItems = computed(() => {
  return clientStore.SessionData?.AvailableItems.map((item: Item) => item.Name) || [];
})
const getAvailablePositions = computed(() => {

  return clientStore.SessionData?.AvailablePositions.map((item: Position) => item.Name,
  ) || [];
})
const getPlacedItems = computed(() => {
  return clientStore.SessionData?.PlacedItems
})

function discardSelection(): void {
  selectedItem.value = null
  selectedPosition.value = null
}
function placeItem(): void {

  if (!clientStore.SessionData?.ContainsPlayer) {
    notificationStore.SpawnNotification({
      type: "info",
      message: "Es ist kein Spieler in der Szene, du kannst derzeit keine Gegenstände platzieren.",
      action1: { label: "" }
    })
    return;
  }

  const position: Position | null = clientStore.SessionData.AvailablePositions.find((item) => item.Name === selectedPosition.value) || null

  const item: Item | null = clientStore.SessionData.AvailableItems.find((position) => position.Name === selectedItem.value) || null

  if (position !== null && item !== null) {
    const placeItem: PlacedItem = {
      Item: item,
      Position: position
    }
    const placeItemEvent: SendEvent = new SendEvent(ConnectingMindsEvents.PLACE_ITEM)
    placeItemEvent.addData("PlacedItem", placeItem)

    socketStore.SendEvent(placeItemEvent)
    discardSelection()
  }
}
function removeItem(item: PlacedItem): void {
  if (!clientStore.SessionData?.ContainsPlayer) {
    notificationStore.SpawnNotification({
      type: "info",
      message: "Es ist kein Spieler in der Szene, du kannst derzeit keine Gegenstände entfernen.",
      action1: { label: "" }
    })
    return;
  }
  const removeItemEvent: SendEvent = new SendEvent(ConnectingMindsEvents.REMOVE_ITEM)
  removeItemEvent.addData("PlacedItem", item)

  socketStore.SendEvent(removeItemEvent)
}

function scrollToMap(item: PlacedItem): void {
  // const carousel = 
  const images = getMapImages.value
  let index:number = 0;
  let i = 0
  for(const image of images){
    if(image.positions.includes(item.Position.Name)){
      index = i
    }
    i++
  }
  // this.$refs.
  currentIndex.value = index
}

onBeforeMount(() => {
  if (clientStore.SessionData === null) {
    router.push({name:"home"})
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
  padding: 2% 10%;
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

.control-button:hover {
  background-image: url('@/assets/button_image.png');
  background-size: cover;
  background-position: center;
}

.list-part {
  overflow-y: auto;
  height: 290px;
}

.list-item {
  width: 100%;
  /* height: 40px; */
}
.inset{
  padding: 14px;
    background-color: transparent;
  backdrop-filter: blur(10px);
  border-radius: 10px;
}
.item-name {
  cursor: pointer;
  width: 90%;
}

.remove-item {
  /* float: right; */
  width: 10%;
}

.inner-item {
  display: flex;
  padding: 7px;
  border: 1px lightgray solid;
  vertical-align: middle
}

.action-bar {
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

.map-part {
  margin-top: 70px;
  padding: 28px;
}

.place {
  display: flex;
  justify-content: center;
  width: 50%;
}

.discard {
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

.position-select {
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
