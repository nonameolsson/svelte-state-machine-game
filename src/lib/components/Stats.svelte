<script lang="ts">
  export let score: number;
  export let opponents: number;
  export let highScore: number;
</script>

<div>
  <h3 class="text-base font-semibold leading-6 text-gray-900">
    Current status
  </h3>
  <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
    <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
      <dt class="truncate text-sm font-medium text-gray-500">Score</dt>
      <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
        {score}
      </dd>
    </div>
    <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
      <dt class="truncate text-sm font-medium text-gray-500">Opponents left</dt>
      <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
        {opponents}
      </dd>
    </div>
    <div class="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
      <dt class="truncate text-sm font-medium text-gray-500">High score</dt>
      <dd class="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
        {highScore}
      </dd>
    </div>
  </dl>
</div>
