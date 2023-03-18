<!--Add props-->
<script lang="ts">
    export let href: string;
    export let text: string;

    export let align: string = "right";
    export let hiddenText: string = "";
</script>


<!-- We're trying to make a link component-->
<div class="comp" style="text-align: {align}">
    <a href={href} class="link"><span class="text-inactive">{hiddenText} </span>{text}</a>
</div>

<!-- Add styling -->
<style>
    .comp {
        @apply mt-10 w-full;
    }

    .link {
        @apply font-light w-full;
    }
</style>