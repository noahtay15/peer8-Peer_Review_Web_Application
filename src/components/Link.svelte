<!--Add props-->
<script lang="ts">
    import { goto } from '$app/navigation';
    export let href: string;
    export let text: string;

    export let align: string = "right";
    export let hiddenText: string = "";

    const goTo = (e: any) => {
        e.preventDefault();
        goto(href);
    }
</script>


<!-- We're trying to make a link component-->
<div class="comp" style="text-align: {align}">
    <p on:click={goTo} on:keyup={goTo} class="link"><span class="text-inactive">{hiddenText} </span>{text}</p>
</div>

<!-- Add styling -->
<style>
    .comp {
        @apply mt-10 w-full;
    }

    .link {
        @apply font-light w-full cursor-pointer;
    }
</style>