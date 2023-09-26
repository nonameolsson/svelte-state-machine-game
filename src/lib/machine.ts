import { writable, type Writable } from "svelte/store";

export function useMachine<State, Event>(
  machine: any,
  initial: State
): { state: Writable<State>; send: (event: Event) => void } {
  const state = writable<State>(initial);

  function send(event: Event): void {
    state.update((state) => machine(state, event));
  }

  return { state, send };
}
