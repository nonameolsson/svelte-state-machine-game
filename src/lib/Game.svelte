<script lang="ts">
  import Button from "./Button.svelte";
  import Controls from "./Controls.svelte";
  import Modal from "./Modal.svelte";
  import Stats from "./Stats.svelte";
  import { gameMachine, type GameEvent, type GameState } from "./game-machine";
  import { useMachine } from "./machine";

  const { send, state: gameState } = useMachine<GameState, GameEvent>(
    gameMachine,
    { state: "start", highScore: 0 }
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
        <Button variant="secondary" on:click={() => send({ type: "ESCAPE" })}
          >Pause</Button
        >
        <Button on:click={() => send({ type: "END" })} variant="danger"
          >End game</Button
        >
      {/if}

      {#if $gameState.state === "start"}
        <Button on:click={() => send({ type: "START-GAME" })}>Start</Button>
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
          >Score to beat: {$gameState.highScore}</span
        >
      </div>
    </div>
  {/if}

  {#if $gameState.state === "playing"}
    <Stats
      score={$gameState.score}
      opponents={$gameState.opponents}
      highScore={$gameState.highScore}
    />

    <Controls
      on:increase={increaseScore}
      on:loose={() => send({ type: "LOOSE" })}
    />
  {/if}

  {#if $gameState.state === "paused"}
    <Modal title="Paused">
      <p>Press ESC to return</p>
    </Modal>
  {/if}

  {#if $gameState.state === "game-over"}
    <Modal title="Game over">
      <p class="text-sm text-gray-500">
        Score: {$gameState.score}
      </p>
      <p class="text-sm text-gray-500">
        Opponents left: {$gameState.opponents}
      </p>
      {#if $gameState.score > $gameState.highScore}
        <p class="text-sm text-gray-500">
          New high score: {$gameState.score}
        </p>
      {/if}

      <div slot="buttons">
        <Button
          variant="secondary"
          on:click={() => send({ type: "START-GAME" })}>Play again</Button
        >

        <Button on:click={() => send({ type: "END" })}>Go to start</Button>
      </div>
    </Modal>
  {/if}

  {#if $gameState.state === "won"}
    <Modal title="You won! Congratulations!">
      <p class="text-sm text-gray-500">
        Score: {$gameState.score}
      </p>

      <div slot="buttons">
        <Button on:click={() => send({ type: "END" })}>Go to start</Button>
      </div>
    </Modal>
  {/if}
</div>
