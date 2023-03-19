<script>
export let onSubmit = () => {};
</script>

<form on:submit={onSubmit}>
    <slot/>
</form>

<style>
</style>