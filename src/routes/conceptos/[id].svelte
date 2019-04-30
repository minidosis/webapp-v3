<script context="module">
	export async function preload({ params, query }) {
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
  import markright from '../../markright';
  export let node;
  let expanded = false;

  const toggleExpanded = () => { expanded = !expanded }

  function escape(str) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
      switch (str[i]) {
        case '<': result += '&lt;'; break;
        case '>': result += '&gt;'; break;
        default: result += str[i];
      }
    }
    return result;
  }

  function generateHtml(mr) {
    return markright.genHtml(mr, {
      minidosis: (args, children) => {
        return `<a href="${'conceptos/' + args[0]}">${generateHtml(children)}</a>`;
      },
      code: (args, children) => {
        return `<span class="code">${children.join(' ')}</span>`;
      },
      pre: (args, children) => {
        const text = children.join('\n');
        return `<pre>${escape(text)}</pre>`;
      }
    })
  }
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
{@html generateHtml(node.content)}
</div>

<!--

<pre>
{JSON.stringify(node.content, null, 3)}
</pre>

<pre>
{generateHtml(node.content)}
</pre>

-->
<style>
  .header {
    margin-bottom: 1em;
  }
  .header h1 {
    margin-bottom: 0;
  }

  .content :global(a) {
    text-decoration: none;
    color: rgb(28, 88, 167);
    border-bottom: 1px solid rgb(199, 216, 231);
  }
  .content :global(a:hover) {
    color: black;
  }
  .content :global(p) {
    margin-bottom: .4em;
  }
  :global(pre) {
    margin-top: 0;
    padding: .3em .6em;
    border: 1px solid rgb(200, 214, 228);
    border-radius: 4px;
    background: rgb(230, 240, 250);
  }
  :global(span.code) {
    font-family: monospace;
  }
</style>