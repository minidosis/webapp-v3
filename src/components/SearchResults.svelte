<script>
  import { createEventDispatcher } from 'svelte'

  export let results = [];

  const dispatch = createEventDispatcher()

  const clicksearch = () => {
    dispatch('clicksearch')
  }
</script>

<style>
  .results {
    position: absolute;
    top: 0;
    padding: .3em .6em;
    background-color: white;
    border: 1px solid gray;
    width: 40em;
    max-width: 80%;
  }
</style>

<div class="results">
  {#each results as result}
    <div><a href="/id/{result.id}" on:click={clicksearch} >{result.title}</a></div>
  {/each}
</div>