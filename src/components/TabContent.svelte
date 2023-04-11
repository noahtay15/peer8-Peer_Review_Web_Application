<script lang="ts">
    export let index: number;
    export let current: number;
</script>

{#if index === current}
    <slot></slot>
{/if}
