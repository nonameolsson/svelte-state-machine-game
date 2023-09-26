<script lang="ts">
  export let variant: "primary" | "secondary" | "danger" = "primary";
</script>

<button
  on:click
  type="button"
  class={`"inline-flex w-full justify-center rounded-md  px-3 py-2 text-sm font-semibold  shadow-sm  sm:ml-3 sm:w-auto
      ${
        variant === "primary"
          ? "bg-green-600 text-white hover:bg-green-500"
          : ""
      }
      ${
        variant === "secondary"
          ? "text-gray-900  hover:bg-gray-50  ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          : ""
      }

      ${
        variant === "danger"
          ? "bg-red-600 text-white hover:bg-red-700focus-visible:outline-red-600"
          : ""
      }

      `}
>
  <slot />
</button>
