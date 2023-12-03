import type { Pinia } from 'pinia'

import { useCounterStore } from './counter'
import { useclientStore } from './client'

export function ImportStores(pinia: Pinia): Pinia {
    useCounterStore(pinia)
    useclientStore(pinia)
    useclientStore().Init()
    return pinia
}