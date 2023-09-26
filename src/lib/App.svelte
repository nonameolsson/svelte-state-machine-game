<script lang="ts">
  import { useMachine } from "./machine";

  type GameState =
    | { state: "start" }
    | { state: "playing"; score: number; opponents: number }
    | { state: "paused"; score: number; opponents: number }
    | { state: "won"; score: number; opponents: number }
    | { state: "game-over"; score: number; opponents: number };

  type GameEvent = {
    type: "START-GAME" | "ESCAPE" | "END" | "LOOSE" | "WIN-BATTLE" | "WIN-ALL";
  };
  let highScore = 0;

  function gameMachine(state: GameState, event: GameEvent): GameState {
    switch (state.state) {
      case "start":
        if (event.type === "START-GAME") {
          return {
            state: "playing",
            score: 0,
            opponents: 10,
          };
        }
        break;

      case "playing":
        if (event.type === "WIN-ALL") {
          return {
            state: "won",
            score: state.score + 10,
            opponents: 0,
          };
        }
        if (event.type === "WIN-BATTLE") {
          return {
            ...state,
            score: state.score + Math.floor(Math.random() * 4) + 1,
            opponents: state.opponents - 1,
          };
        }
        if (event.type === "ESCAPE") {
          return {
            ...state,
            state: "paused",
          };
        }
        if (event.type === "END") {
          return {
            state: "start",
          };
        }
        if (event.type === "LOOSE") {
          if (state.score > highScore) {
            highScore = state.score;
          }

          return {
            ...state,
            state: "game-over",
          };
        }
        break;

      case "paused":
        if (event.type === "START-GAME")
          return {
            ...state,
            state: "playing",
          };
        if (event.type === "ESCAPE")
          return {
            ...state,
            state: "playing",
          };
        break;

      case "game-over":
        if (event.type === "START-GAME") {
          return {
            state: "playing",
            score: 0,
            opponents: 10,
          };
        }
        if (event.type === "END") {
          return {
            state: "start",
          };
        }
        break;

      case "won":
        if (state.score > highScore) {
          highScore = state.score;
        }

        if (event.type === "END") {
          return {
            state: "start",
          };
        }
        break;

      default:
        return state;
    }
  }

  const { send, state: gameState } = useMachine<GameState, GameEvent>(
    gameMachine,
    {
      state: "start",
    }
  );

  function handleKeydown(e) {
    if (e.key === "Escape") {
      send({ type: "ESCAPE" });
    }
  }

  function increaseScore() {
    if ($gameState?.opponents > 0) {
      send({ type: "WIN-BATTLE" });
    }
  }
  $: $gameState?.opponents === 0 && send({ type: "WIN-ALL" });
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
  <div class="md:flex md:items-center md:justify-between">
    <div class="min-w-0 flex-1 mt-4">
      <h2
        class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
      >
        Awesome game
      </h2>
    </div>
    <div class="mt-4 flex md:ml-4 md:mt-0">
      {#if $gameState.state === "playing"}
        <button
          on:click={() => send({ type: "ESCAPE" })}
          type="button"
          class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >Pause</button
        >
        <button
          on:click={() => send({ type: "END" })}
          type="button"
          class="ml-3 inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >End game</button
        >
      {/if}

      {#if $gameState.state === "start"}
        <button
          on:click={() => send({ type: "START-GAME" })}
          type="button"
          class="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >Start</button
        >
      {/if}
    </div>
  </div>

  {#if $gameState.state === "start"}
    <div class="overflow-hidden rounded-lg bg-white shadow mt-4">
      <div class="px-4 py-5 sm:p-6">
        <p>Welcome to this awesome state machine game! Start playing...</p>
      </div>
      <div class="px-4 sm:p-6">
        <span
          class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
          >Score to beat: {highScore}</span
        >
      </div>
    </div>
  {/if}

  {#if $gameState.state === "playing"}
    <div>
      <h3 class="text-base font-semibold leading-6 text-gray-900">
        Current status
      </h3>
      <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div
          class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
        >
          <dt class="truncate text-sm font-medium text-gray-500">Score</dt>
          <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {$gameState.score}
          </dd>
        </div>
        <div
          class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
        >
          <dt class="truncate text-sm font-medium text-gray-500">
            Opponents left
          </dt>
          <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {$gameState.opponents}
          </dd>
        </div>
        <div
          class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
        >
          <dt class="truncate text-sm font-medium text-gray-500">High score</dt>
          <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {highScore}
          </dd>
        </div>
      </dl>
    </div>

    <div
      class="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-8"
    >
      <div class="px-4 py-5 sm:px-6">Actions</div>
      <div class="px-4 py-5 sm:p-6">
        <button
          on:click={increaseScore}
          type="button"
          class="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>

          Win battle
        </button>
        <button
          on:click={() => send({ type: "LOOSE" })}
          type="button"
          class="inline-flex items-center gap-x-1.5 rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          Loose battle
        </button>
      </div>
    </div>
  {/if}

  {#if $gameState.state === "paused"}
    <div class="overlay">
      <h4>Paused</h4>
      <p>Press ESC to return</p>
    </div>
  {/if}

  {#if $gameState.state === "game-over"}
    <div
      class="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <div
            class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
          >
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
              >
                <svg
                  class="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3
                  class="text-base font-semibold leading-6 text-gray-900"
                  id="modal-title"
                >
                  Game over
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Score: {$gameState.score}
                  </p>
                  <p class="text-sm text-gray-500">
                    Opponents left: {$gameState.opponents}
                  </p>
                  {#if $gameState.score > highScore}
                    <p class="text-sm text-gray-500">
                      New high score: {$gameState.score}
                    </p>
                  {/if}
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                on:click={() => send({ type: "START-GAME" })}
                type="button"
                class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                >Play again</button
              >
              <button
                on:click={() => send({ type: "END" })}
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >Go to start</button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}

  {#if $gameState.state === "won"}
    <div
      class="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <div
            class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
          >
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
              >
                <svg
                  class="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3
                  class="text-base font-semibold leading-6 text-gray-900"
                  id="modal-title"
                >
                  You won! Congratulations!
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Score: {$gameState.score}
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                on:click={() => send({ type: "END" })}
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >Go to start</button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 2rem;
    font-family: sans-serif;
    backdrop-filter: blur(10px);
  }
</style>
