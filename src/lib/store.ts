import { writable } from 'svelte/store'

export function useReducer(state, reducer) {
  const { update, subscribe } = writable(state)

  function dispatch(action) {
      update(state => reducer(state, action))
  }

  return [{ subscribe }, dispatch]
}