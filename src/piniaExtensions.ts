import { Store } from 'pinia'
export const extendPiniaReset = (pinia: any) => {
  pinia.use(({ store }: { store: Store }) => {
    const initialState = JSON.parse(JSON.stringify(store.$state))
    store.$reset = () => {
      store.$state = JSON.parse(JSON.stringify(initialState))
    }
  })
}
