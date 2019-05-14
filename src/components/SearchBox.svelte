<script>
  import { createEventDispatcher } from 'svelte'
  import * as sapper from '@sapper/app'

  let query = '';

  const dispatch = createEventDispatcher()

  const search = () => {
    dispatch('search', { query })
    query = ''
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

<form class="search" on:submit|preventDefault={search}>
  <img src="search.svg" alt="search" />
  <input bind:value={query} />
</form>