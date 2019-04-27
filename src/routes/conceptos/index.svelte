<script context="module">
	export function preload({ params, query }) {
		return this.fetch(`conceptos.json`).then(r => r.json()).then((nodes) => {
			return { nodes };
		});
	}
</script>

<script>
	export let nodes;
</script>

<ul>
{#each nodes as node}
  <li><a href={'conceptos/' + node.id}>{node.title ? node.title : node.id}</a></li>
{/each}
</ul>

<style>
  ul {
    list-style: none;
  }
</style>