<script lang="ts">
export let onSubmit: () => Promise<void> = () => Promise.resolve();
</script>

<form on:submit={onSubmit}>
    <slot/>
</form>

<style>
</style>