<!-- Datepicker.svelte -->
<script lang="ts">
    export let label: string;
    export let value: string;
    export let placeholder: string;
    export let valid: boolean = true;
    export let err_message: string = '';
  
    function validate() {
      valid = /^\d{4}-\d{2}-\d{2}$/.test(value);
    }
  </script>
  
  <div class="comp">
    <h1 class="label">{label}</h1>
    <div class="input-container">
      <input
        class="input"
        type="date"
        bind:value
        {placeholder}
        on:change={validate}
        class:invalid={!valid}
        class:normal={valid}
      />
    </div>
    {#if !valid}
      <p class="error">{err_message}</p>
    {/if}
  </div>
  
  <style lang="scss">
    .comp {
      @apply mt-10;
    }
  
    .input {
      @apply w-full h-10 px-4 py-2 border-none bg-[#F0F0F0] focus:ring-transparent rounded-md;
    }
  
    .label {
      @apply text-base font-medium mb-3 text-primary;
    }
  
    .error {
      @apply text-red-500 text-base font-light mt-3;
    }
  
    .normal {
      @apply border-[#D2D1D1] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent;
    }
  
    .invalid {
      @apply border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent;
    }
  </style>
  