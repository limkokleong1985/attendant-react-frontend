import React, { useCallback, useRef, createContext, useContext, useSyncExternalStore } from 'react'

export default function useFastContext<Store>(initial: Store) {

  type UseStoreDataReturnType = ReturnType<typeof useStoreData>
  const StoreContext = createContext<UseStoreDataReturnType | null>(null)

  function useStoreData(): {
    get: () => Store;
    set: (value: Partial<Store>) => void;
    subscribe: (callback: () => void) => () => void
  } {
    const store = useRef(initial)
    const get = useCallback(() => store.current, [])
    const set = useCallback((value: Partial<Store>) => {
      store.current = { ...store.current, ...value }
      subscriberList.current.forEach((callback) => callback())
    }, [])

    const subscriberList = useRef(new Set<() => void>())
    const subscribe = useCallback((callback: () => void) => {
      subscriberList.current.add(callback);
      return () => subscriberList.current.delete(callback);
    }, [])
    return {
      get,
      set,
      subscribe
    }
  }

  function useStore<SelectorOutput>(selector: (store: Store) => SelectorOutput): [
    SelectorOutput,
    (value: Partial<Store>) => void
  ] {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error('Store not found')
    }
    const state = useSyncExternalStore(store.subscribe, () => selector(store.get()))
    return [state, store.set]
  }

  function ProviderStore({ children }: { children: React.ReactNode }): React.ReactElement {
    return (
      <StoreContext.Provider value={useStoreData()} >
        {children}
      </StoreContext.Provider>
    )
  }

  return {
    ProviderStore,
    useStore
  }
}
