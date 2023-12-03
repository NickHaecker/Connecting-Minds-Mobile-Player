import { defineStore } from 'pinia'
import bus from '@/hooks/index'
import type { SendEvent } from '@/extensions/athaeck-websocket-vue3-extension/helper/types'

export const useclientStore = defineStore({
  id: 'client',
  state: () => ({
  interactable: false as boolean  
  }),
  actions: {
    Init(): void {
      bus.on("TAKE_MESSAGE",this._OnTakeMesage)
    },
    _OnTakeMesage(body:any){
      console.log(body)
      const receive:SendEvent = <SendEvent>body
      console.log(receive) 
      if (receive.eventName === "WAIT_FOR_PLAYER_ONE"){
        this.interactable = false 
      }
      if (receive.eventName === "ON_CONNECT_PLAYER_ONE"){
        this.interactable = true
      }
    },

  },
  getters: {
   
  }
})
