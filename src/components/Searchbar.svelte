<script lang="ts">
    import { SearchIcon } from 'svelte-feather-icons';
    export let placeholder: string = 'Search';
    export let value: string = '';
    export let onSearch: (value: string) => void = () => {};
  
    function handleSearch(e: any) {
      value = e.target.value;
      onSearch(value);
    }
  </script>
  
  <div class="searchbar">
    <div class="search-container">
      <SearchIcon class="search-icon self-center" />
      <input
        class="search-input"
        type="text"
        {placeholder}
        bind:value
        on:input={handleSearch}
      />
    </div>
  </div>
  
  <style>
    .searchbar {
      @apply mt-10;
    }
  
    .search-container {
      @apply flex flex-row relative pl-4 bg-[#F0F0F0] rounded-md;
    }
  
    .search-icon {
      @apply absolute w-5 h-5 top-[.6rem] left-3;
    }
  
    .search-input {
      @apply w-full h-12 px-4 py-2 border-none bg-transparent focus:ring-transparent;
    }
  
    .search-input::placeholder {
      @apply text-textinactive;
    }
  </style>
  