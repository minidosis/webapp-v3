<script>
  import { createEventDispatcher } from 'svelte'
  import * as sapper from '@sapper/app'

  let inputRef;
  let query = '';

  const dispatch = createEventDispatcher()

  const search = () => {
    if (query) {
      dispatch('search', { query })
      query = ''
    }
  }

  const onKeyDown = (e) => {
    if (e.key === '/') {
      e.preventDefault();
      inputRef.focus()
    }
  }
</script>

<style>
  input {
    padding: .5em;
    font-size: 1.1em;
    border: none;
  }
  input:focus {
    outline: none;
  }
  .search {
    border: 1px solid #ccc;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 .5em;
  }
  .search input {
    flex: 1;
  }
  .search img {
    width: 1.2em;
    height: 1.2em;
  }
</style>

<svelte:window on:keydown={onKeyDown} />

<form class="search" on:submit|preventDefault={search}>
  <img src="search.svg" alt="search" />
  <input bind:this={inputRef} bind:value={query} />
</form>