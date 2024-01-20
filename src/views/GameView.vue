
<template>
  <div id="GameView">
    <div class="inset">
      <div>
        <VOnboardingWrapper ref="wrapper" :steps="steps" />
        <div style="display: flex;justify-content: flex-end;">
          <div style="width: 50px; height: 50px;">
            <span style="font-size: 20px; cursor: pointer;" @click="ShowTutorial">
              ?
            </span>
          </div>
        </div>
      </div>  
      <div class="top-part">
        <div class="action-part">
          <div class="item-select">
            <v-select v-model="selectedItem" id="select-item" label="Gegenstand auswählen" :items="getAvailableItems"
              :item-props="itemProps">
              <template v-slot:item="{ item, props }">
                <div v-bind="props">
                  <div class="item-container" :title="item.value.description">
                    <div class="image-container">
                      <img :src="MapImage(item.value.id)" class="item-image" />
                    </div>
                    <div class="select-item-name">
                      <span class="name">
                        {{ item.value.name }}
                      </span>
                    </div>
                  </div>
                </div>
              </template>
            </v-select>
          </div>
          <div class="position-select">
            <v-select id="select-position" v-model="selectedPosition" label="Position auswählen"
              :items="getAvailablePositions"></v-select>
          </div>
          <div class="action-bar">
            <div class="place">
              <button id="place-item"
                :disabled="(selectedItem === null && selectedPosition === null) || (selectedItem === null && selectedPosition !== null) || selectedItem !== null && selectedPosition === null"
                @click="placeItem" class="control-button">Gegenstand platzieren</button>
            </div>
            <div class="discard">
              <button id="discard-selection" :disabled="selectedItem === null && selectedPosition === null"
                @click="discardSelection" class="control-button">Auswahl löschen</button>
            </div>
          </div>
        </div>
        <div class="listing-part">
          <span id="placed-items">Platzierte Gegenstände:</span>
          <div class="list-part">
            <div v-for="item in getPlacedItems" :key="item.Item.Name" class="list-item">
              <div class="inner-item">
                <div class="item-name" @click="scrollToMap(item)"
                  title="Siehe im Slider an, in welchem Levelabschnitt der Gegenstand platziert wurde."><span> {{
                    item.Item.Name }}</span>
                </div>
                <div id="remove-item" class="remove-item">
                  <span @click="removeItem(item)"><strong style="cursor: pointer;font-size: 18px;">X</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="map-part">
        <v-carousel id="see-map" ref="carousel" hide-delimiters v-model="currentIndex" height="600px">
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
import { ref, onBeforeMount, computed, onMounted } from 'vue';
import bus from '@/hooks';
import { VOnboardingWrapper, useVOnboarding } from 'v-onboarding'
import 'v-onboarding/dist/style.css'
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
const wrapper = ref(null)
const { start, goToStep, finish } = useVOnboarding(wrapper)
const steps = ref([
  {
    attachTo: { element: "#select-item" },
    content: { title: "Gegenstand auswählen", description: "Wähle hier Gegenstände aus, um mit deinem Partner die anstehenden Rätsel zu lösen." }
  },
  {
    attachTo: { element: "#select-position" },
    content: { title: "Position auswählen", description: "Wähle hier für deinen ausgewählten Gegenstand die Position aus, wo der Gegenstand platziert werden soll." }
  },
  {
    attachTo: { element: "#place-item" },
    content: { title: "Gegenstand platzieren", description: "Platziere den Gegenstand über diesen Button" }
  },
  {
    attachTo: { element: "#discard-selection" },
    content: { title: "Auswahl entfernen", description: "Lösche deine Auswahl über diesen Button." }
  },
  {
    attachTo: { element: "#placed-items" },
    content: { title: "Übersicht über alle platzierten Gegenstände", description: "Hier erhälst du eine Übersicht über alle platzierten Gegenstände. Klicke auf einen Listeneintrag um um Slider unten anzeigen zu können, wo du den Gegenstand platziert hast." }
  },
  {
    attachTo: { element: "#remove-item" },
    content: { title: "Platzierten Gegenstand entfernen", description: "Sobald ein Gegenstand platziert wurde, kannst du ihne über das X wieder entfernen." }
  },
  {
    attachTo: { element: "#see-map" },
    content: { title: "Levelkarten", description: "Über den Slider siehst du die einzelnen Level des Spiels. Nutze sie, um zu erkennen, wo dein Spielpartner ist und lotse ihn durch das Spiel." }
  }
])

const itemSrcs = ref([
  {
    id: "globe-mars",
    src: "src/assets/items/mars.png"
  },
  {
    id: "terminal-room-4",
    src: "src/assets/items/terminal.png"
  }
  , {
    id: "schluesselkarte-room-1",
    src: "src/assets/items/keycard.png"
  }, {
    id: "energiezelle-gelb",
    src: "src/assets/items/gelb.png"
  }, {
    id: "energiezelle-rot",
    src: "src/assets/items/rot.png"
  }, {
    id: "energiezelle-magenta",
    src: "src/assets/items/magenta.png"
  }, {
    id: "energiezelle-gruen",
    src: "src/assets/items/grün.png"
  }, {
    id: "energiezelle-cyan",
    src: "src/assets/items/cyan.png"
  }, {
    id: "energiezelle-blau",
    src: "src/assets/items/blau.png"
  }, {
    id: "globe-earth",
    src: "src/assets/items/erde.png"
  }, {
    id: "box-2",
    src: "src/assets/items/box.png"
  }, {
    id: "box-1",
    src: "src/assets/items/box.png"
  }
])

function MapImage(id: string): string | undefined {
  return itemSrcs.value.find(item => item.id === id)?.src
}
function itemProps(item) {
  return {
    title: item.name,
    description: item.description,
    id: item.id
  }
}
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
      "Kartenlesegerät"
    ]
  },
  {
    id: "Raum 2",
    src: "src/assets/map/Level2.PNG",
    positions: [
      "Raum 2 Energiezelle Links", "Raum 2 Energiezelle Rechts", "Raum 2 Energiezelle Mitte"
    ]
  }, {
    id: "Dritter Raum bzw Flur",
    src: "src/assets/map/Level3.PNG",
    positions: [
      "Bodenplatte vor der Tür", "Sockel"
    ]
  },
  {
    id: "Raum 4",
    src: "src/assets/map/Level4.PNG",
    positions: [
      "Raum 4 Energiezelle Rechts", "Raum 4 Bodenplatte Links", "Raum 4 Bodenplatte rechts", "Bodenplatte neben der Tür", "Raum 4 Energiezelle Mitte", "Raum 4 Energiezelle Links"
    ]
  },
  {
    id: "Raum Fuenf",
    src: "src/assets/map/Level5.PNG",
    positions: [
      "Planet Links", "Planet Rechts"
    ]
  },
  {
    id: "Raum 6",
    src: "src/assets/map/Level6.PNG",
    positions: [
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
  return clientStore.SessionData?.AvailableItems
    .map((item: Item) => ({
      name: item.Name,
      description: item.Description,
      id: item.ID
    })) || [];
});
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


  let i: string;
  if (selectedItem.value !== null) {
    i = selectedItem.value.id
  }

  const position: Position | null = clientStore.SessionData.AvailablePositions.find((item) => item.Name === selectedPosition.value) || null

  const item: Item | null = clientStore.SessionData.AvailableItems.find((item) => item.ID === i) || null

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
function ShowTutorial(){
  start()
}
function scrollToMap(item: PlacedItem): void {
  const images = getMapImages.value
  let index: number = 0;
  let i = 0
  for (const image of images) {
    if (image.positions.includes(item.Position.Name)) {
      index = i
    }
    i++
  }
  currentIndex.value = index
}
onMounted(() => {
  start()
})
onBeforeMount(() => {
  if (clientStore.SessionData === null) {
    router.push({ name: "home" })
  }

  bus.on("TAKE_MESSAGE", (body: any) => {
    const data = body as SendEvent
    console.log(data)
    if (data.eventName === ConnectingMindsEvents.SEND_MESSAGE) {
      notificationStore.SpawnNotification({
        type: "info",
        message: data.data.Message,
        action1: { label: "" }
      })
    }
    if (data.eventName === ConnectingMindsEvents.ON_UNLOCK_PATH) {
      const lastIndex: number = getMapImages.value.length - 1
      currentIndex.value = lastIndex
    }
  });


})
onUnmounted(() => {
  if (clientStore.SessionData === null) {
    return;
  }
  const leave: SendEvent = new SendEvent(ConnectingMindsEvents.LEAVE_SESSION)
  leave.addData("Type", "WATCHER")
  socketStore.SendEvent(leave)

  bus.off("TAKE_MESSAGE", (body: any) => {


  });
})
</script>

<style scoped>
.item-container {

  padding: 7px;
  display: flex;
  cursor: pointer;
}

.image-container::hover {
  background-color: lightgray;
}

.image-container {
  height: 100px;
  width: 100px;
}

.item-image {
  object-fit: cover;
  width: 100%;
}

.select-item-name {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

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

.inset {
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
<style>
#GameView{
  .v-onboarding-item__header-title{
    color: black;
  }
  .v-onboarding-item__description{
    color: black;
  }
}
</style>