<script>
  import Nav from "../components/Nav.svelte";
  import { beforeUpdate } from "svelte";
  import SearchResults from "../components/SearchResults.svelte";

  export let segment;

  let results;
  let showResults = false;

  const doSearch = async event => {
    const query = event.detail.query;
    try {
      const res = await fetch(`query.json`, {
        method: "POST",
        body: query,
        headers: { "Content-Type": "application/json" }
      });
      results = await res.json();
      showResults = true;
    } catch (e) {
      results = `error: ${e}`;
    }
  }

  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      showResults = false
    } else if (event.key === '/' && event.shiftKey) {
      console.log('Search!!')
    } else {
      console.log(event)
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 1em;
    margin: 0 0;
    box-sizing: border-box;
  }
</style>

<Nav {segment} on:search={doSearch} />

<main>
  <slot />
  {#if showResults}
    <SearchResults {results} on:hideresults={() => (showResults = false)} />
  {/if}
</main>
