<script>
  import * as sapper from '@sapper/app'
  import { createEventDispatcher } from 'svelte'

  export let results = [];
  let selected = 0;

  const dispatch = createEventDispatcher()

  const hideresults = () => {
    dispatch('hideresults')
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      selected = (selected + 1) % results.length
    } else if (e.key === 'ArrowUp') {
      selected = (selected - 1 + results.length) % results.length
    } else if (e.key === 'Enter') {
      console.log('go', selected)
      sapper.goto(`/id/${results[selected].id}`)
      e.preventDefault()
      dispatch('hideresults')
    }
  }
</script>

<style>
  .results {
    position: absolute;
    top: 0;
    background-color: white;
    border: 1px solid gray;
    width: 40em;
    max-width: 80%;
  }
  .close {
    position: absolute;
    top: 0;
    right: 0;
    margin-right: 5px;
    color: white;
    background-color: gray;
    cursor: pointer;
  }
  .result {
    padding: .3em .5em;
  }
  .result.selected {
    background-color: blue;
    color: white;
  }
</style>

<svelte:window on:keydown={onKeyDown} />

<div class="results">
  <span class="close" on:click={hideresults}>X</span>
  {#each results as result, i}
    <div class="result {i === selected ? "selected" : ""}">
      <a href="/id/{result.id}" on:click={hideresults} >{result.title}</a>
    </div>
  {/each}
</div>