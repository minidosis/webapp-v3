<script context="module">
	export async function preload({ params, query }) {
		// the `id` parameter is available because
		// this file is called [id].svelte
		const res = await this.fetch(`conceptos/${params.id}.json`);
		const data = await res.json();

		if (res.status === 200) {
			return { node: data };
		} else {
			this.error(res.status, data.message);
		}
	}
</script>

<script>
	export let node;
</script>

<svelte:head>
	<title>{node.title}</title>
</svelte:head>

<h1>{node.title}</h1>

<h2>Bases:</h2>
<ul>
{#each node.bases as base}
<li><a href={'conceptos/' + base.id}>{base.title}</a></li>
{/each}
</ul>

<h2>Derivados:</h2>
<ul>
{#each node.derived as deriv}
<li><a href={'conceptos/' + deriv.id}>{deriv.title}</a></li>
{/each}
</ul>

<h2>Partes:</h2>
<ul>
{#each node.children as child}
<li><a href={'conceptos/' + child.id}>{child.title}</a></li>
{/each}
</ul>

<h2>Contexto:</h2>
<ul>
{#each node.parents as parent}
<li><a href={'conceptos/' + parent.id}>{parent.title}</a></li>
{/each}
</ul>

