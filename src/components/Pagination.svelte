<script lang="ts"> 
    export let currentPage = 0;
    export let totalPages = 0;
    export let prevPage = () => {};
    export let nextPage = () => {};
</script>


<div class="flex flex-col">
    <div class="flex justify-end mt-10">
        <button
            class={`text-primary font-bold w-32`}
            on:click={prevPage}
            disabled={currentPage === 0}
            class:cursor-not-allowed={currentPage === 0}
            class:cursor-pointer={currentPage !== 0}
        >
            Previous
        </button>
        <button
            class={`text-primary font-bold w-32`}
            on:click={nextPage}
            disabled={currentPage === totalPages - 1}
            class:cursor-not-allowed={currentPage === totalPages - 1}
            class:cursor-pointer={currentPage !== totalPages - 1}
        >
            Next
        </button>
    </div>
    <br />
</div>