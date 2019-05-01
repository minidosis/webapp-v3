<script context="module">
	export function preload({ params, query }) {
		return this.fetch(`id.json`).then(r => r.json()).then(({ nodes, error }) => {
			return { nodes, error };
		});
	}
</script>

<script>
  export let nodes;
	export let error;
</script>

<ul>
{#if error}
  <p>Error {JSON.stringify(error)}</p>
{:else}
  {#each nodes as node}
    <li><a href={'id/' + node.id}>{node.title ? node.title : node.id}</a></li>
  {/each}
{/if}
</ul>

<style>
  ul {
    list-style: none;
  }
</style>