<script context="module">
	export async function preload({ params, query }) {
	  // the `id` parameter is available because
	  // this file is called [id].svelte
	  const res = await this.fetch(`conceptos/${params.id}.json`);
	  const data = await res.json();

	  if (res.status === 200) {
	    return { node: data, expanded: false };
	  } else {
	    this.error(res.status, data.message);
	  }
	}
</script>

<script>
  import markright from '../../markright';
  export let node;
  let expanded = false;

  const toggleExpanded = () => { expanded = !expanded }
</script>

<svelte:head>
	<title>{node.title}</title>
</svelte:head>

<div class="header">
  <h1>{node.title} <button on:click={toggleExpanded}>{expanded ? 'hide' : 'show'}</button> </h1>
</div>

{#if expanded}
  <h2>Padres</h2>
  <ul>
    {#each node.parents as parent}
        <li><a href={'conceptos/' + parent.id}>{parent.title}</a></li>
    {/each}
  </ul>

  <h2>Bases</h2>
  <ul>
    {#each node.bases as base}
    <li><a href={'conceptos/' + base.id}>{base.title}</a></li>
    {/each}
  </ul>

  <h2>Derivados</h2>
  <ul>
    {#each node.derived as deriv}
    <li><a href={'conceptos/' + deriv.id}>{deriv.title}</a></li>
    {/each}
  </ul>

  <h2>Partes</h2>
  <ul>
    {#each node.children as child}
    <li><a href={'conceptos/' + child.id}>{child.title}</a></li>
    {/each}
  </ul>
{/if}

<div class="content">
{@html markright.genHtml(node.content, {
  minidosis: (args, children) => {
    return `<a href=${'conceptos/' + args[0]}>${markright.genHtml(children)}</a>`;
  }
})}
</div>



<style>
  .header {
    margin-bottom: 1em;
  }
  .header h1 {
    margin-bottom: 0;
  }
</style>