import { defineStore } from 'pinia'
import bus from '@/hooks/index'
import { SendEvent } from '@/extensions/athaeck-websocket-vue3-extension/helper/types'
import type { SessionData } from '@/types'
import { ConnectingMindsEvents, type PlaceItemProxy, type RemoveItemProxy, type UnlockItemProxy, type UnlockPathProxy, type UnlockPositionProxy } from '@/types/Connecting-Minds-Data-Types/types'
import { useWebSocketStore } from '@/extensions/athaeck-websocket-vue3-extension/stores/webSocket'
import router from '@/router'





export const useclientStore = defineStore({
  id: 'client',
  state: () => ({
    sessionData: null as SessionData | null
  }),
  actions: {
    Init(): void {
      bus.on("TAKE_MESSAGE", this._OnTakeMesage)
      bus.on("SOCKET_CLOSED",this._OnClosedSocket)
      bus.on("SOCKED_ERROR",this._OnClosedSocket)
    },
    _OnClosedSocket(body:any){
      this.sessionData = null
      router.push({ name: "home" })
    },
    _OnTakeMesage(body: any) {
      const webSocketStore = useWebSocketStore()
      const receive: SendEvent = <SendEvent>body

      console.log(receive)

      if (receive.eventName === ConnectingMindsEvents.ON_JOIN_SESSION) {
        const initWatcher: SendEvent = new SendEvent(ConnectingMindsEvents.INIT_WATCHER)
        webSocketStore.SendEvent(initWatcher);
      }

      if (receive.eventName === ConnectingMindsEvents.ON_INIT_WATCHER) {
        const sessionData: SessionData = receive.data["SessionData"] as SessionData
        this.sessionData = sessionData
        router.push({ name: "game" })
      }

      if (receive.eventName === ConnectingMindsEvents.ON_UNLOCK_PATH) {
        const proxy: UnlockPathProxy = receive.data["UnlockPathProxy"] as UnlockPathProxy
        if (this.sessionData !== null) {
          this.sessionData.UnlockedPaths = proxy.UnlockedPaths
          this.sessionData.AvailablePositions = proxy.AvailablePositions
        }
      }

      if (receive.eventName === ConnectingMindsEvents.ON_PLACE_ITEM) {
        const proxy: PlaceItemProxy = receive.data["PlacedItemProxy"] as PlaceItemProxy
        if (this.sessionData !== null) {
          this.sessionData.AvailablePositions = proxy.AvailablePositions
          this.sessionData.AvailableItems = proxy.AvailableItems
          this.sessionData.PlacedItems = proxy.PlacedItems
        }
      }

      if (receive.eventName === ConnectingMindsEvents.ON_REMOVE_ITEM) {
        const proxy: RemoveItemProxy = receive.data["RemovedItemProxy"] as RemoveItemProxy
        if (this.sessionData !== null) {
          this.sessionData.AvailablePositions = proxy.AvailablePositions
          this.sessionData.AvailableItems = proxy.AvailableItems
          this.sessionData.PlacedItems = proxy.PlacedItems
        }
      }

      if (receive.eventName === ConnectingMindsEvents.CONNECT_PLAYER) {
        if (this.sessionData !== null) {
          this.sessionData.ContainsPlayer = true;
        }
      }

      if (receive.eventName === ConnectingMindsEvents.DISCONNECT_PLAYER) {
        if (this.sessionData !== null) {
          this.sessionData.ContainsPlayer = false;
        }
      }

      if (receive.eventName === ConnectingMindsEvents.ON_UNLOCK_ITEM) {
        const proxy: UnlockItemProxy = receive.data["UnlockItemProxy"] as UnlockItemProxy
        if (this.sessionData !== null) {
          this.sessionData.AvailableItems = proxy.AvaibaleItems
        }
      }

      if (receive.eventName === ConnectingMindsEvents.ON_UNLOCK_POSITION) {
        const proxy: UnlockPositionProxy = receive.data["UnlockPositionProxy"] as UnlockPositionProxy
        if (this.sessionData !== null) {
          this.sessionData.AvailablePositions = proxy.AvailablePositions
        }
      }

      if (receive.eventName === ConnectingMindsEvents.ON_LEAVE_SESSION) {
        this.sessionData = null
      }

    },

  },
  getters: {
    SessionData: (state) => state.sessionData
  }
})
