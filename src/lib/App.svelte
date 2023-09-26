<script lang="ts">
  import { useMachine } from "./machine";

  type GameState = "start" | "playing" | "paused" | "game-over";

  type GameEvent = {
    type: "CLICK" | "ESCAPE" | "END" | "LOOSE";
  };

  function gameMachine(state: GameState, event: GameEvent): GameState {
    switch (state) {
      case "start":
        if (event.type === "CLICK") return "playing";
        if (event.type === "ESCAPE") return "start";

      case "playing":
        if (event.type === "ESCAPE") {
          return "paused";
        }
        if (event.type === "CLICK") {
          return "playing";
        }
        if (event.type === "END") {
          score = 0;
          return "start";
        }
        if (event.type === "LOOSE") {
          alert("You loose!");
          return "game-over";
        }

      case "paused":
        if (event.type === "CLICK") return "playing";
        if (event.type === "ESCAPE") return "playing";

      case "game-over":
        if (event.type === "CLICK") {
          score = 0;
          return "playing";
        }

      default:
        return state;
    }
  }
  let score = 0;

  const { send, state } = useMachine<GameState, GameEvent>(
    gameMachine,
    "start"
  );

  function handleKeydown(e) {
    if (e.key === "Escape") {
      send({ type: "ESCAPE" });
    }
  }

  function increaseScore() {
    score++;
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<h1>My game</h1>

{#if $state === "start"}
  <button on:click={() => send({ type: "CLICK" })}>Start the game</button>
{/if}

{#if $state === "playing"}
  <div>You are playing... Do you enjoy the game?</div>
  <button on:click={increaseScore}>Win battle</button>
  <button on:click={() => send({ type: "LOOSE" })}>Get killed</button>

  <h6>Score: {score}</h6>

  <div class="controls">
    <button on:click={() => send({ type: "ESCAPE" })}>Pause</button>
    <button on:click={() => send({ type: "END" })}>End game</button>
  </div>
{/if}

{#if $state === "paused"}
  <div class="overlay">
    <h4>Paused</h4>
    <p>Press ESC to return</p>
  </div>
{/if}

{#if $state === "game-over"}
  <h1>Game over</h1>
  <button on:click={() => send({ type: "CLICK" })}>Start over</button>
{/if}

<style>
  .controls {
    margin-top: 1rem;
    padding: 1rem;
    border: 1px solid #ccc;
  }
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
