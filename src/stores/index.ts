import type { Pinia } from 'pinia'

import { useCounterStore } from './counter'

export function ImportStores(pinia: Pinia): Pinia {
    useCounterStore(pinia)
    return pinia
}