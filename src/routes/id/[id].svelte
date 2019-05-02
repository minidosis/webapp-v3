<script context="module">
	export async function preload({ params, query }) {
    const res = await this.fetch(`id/${params.id}.json`);
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

  const simpleCommand = (tag) => 
    ({ args, children }) => `<${tag}>${genHtml(children)}</${tag}>`

  function genHtml(mr, context) {
    return markright.genHtml(mr, context, {
      minidosis: ({ args, children }) => `<a href="${'id/' + args[0]}">${genHtml(children)}</a>`,
      pre:       ({ args, children }) => {
        const [lang, _class] = args;
        return `<div class="pre ${_class}"><pre>${genHtml(children)}</pre></div>`
      },
      code: ({ args, children }) => `<span class="code">${children.join(' ')}</span>`,
      b:  simpleCommand('b'),
      h2: simpleCommand('h2'),
      em: simpleCommand('em'),
      img: ({ args, children }) => `<img src="asset/${children[0]}" />`,
      box: ({ args, children }) => `<span class="box">${genHtml(children)}</span>`,
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
      <li><a href={'id/' + parent.id}>{parent.title}</a></li>
    {/each}
  </ul>

  <h2>Bases</h2>
  <ul>
    {#each node.bases as base}
      <li><a href={'id/' + base.id}>{base.title}</a></li>
    {/each}
  </ul>

  <h2>Derivados</h2>
  <ul>
    {#each node.derived as deriv}
      <li><a href={'id/' + deriv.id}>{deriv.title}</a></li>
    {/each}
  </ul>

  <h2>Partes</h2>
  <ul>
    {#each node.children as child}
      <li><a href={'id/' + child.id}>{child.title}</a></li>
    {/each}
  </ul>
{/if}

<div class="content">
{@html genHtml(node.content)}
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
  .content {
    font-family: 'EB Garamond', serif;
    font-size: 1.3em;
  }
  .content :global(h2) {
    margin-top: 1.0em;
    font-size: 1.5em;
    margin-bottom: 0;
  }
  .content :global(a) {
    text-decoration: none;
    color: rgb(36, 73, 119);
    border-bottom: 1px solid rgb(235, 235, 235);
  }
  .content :global(a:hover) {
    color: rgb(81, 132, 194);
    border-bottom: 1px solid rgb(195, 216, 241);
  }
  .content :global(p) {
    margin-bottom: .4em;
  }
  :global(pre) {
    font-size: 0.9em;
    margin: .15em;
    padding: .3em .6em;
    border: 1px solid rgb(200, 214, 228);
    border-radius: 4px;
    background: rgb(230, 240, 250);
  }
  :global(div.pre) {
    display: flex;
    justify-content: center;
  }
  :global(.display pre) {
    display: inline-block;
    color: #707070;
    font-size: 1.1em;
    background: rgb(240, 247, 199);
    border: 1px solid rgb(226, 224, 189);
  }
  :global(.center pre) {
    display: inline-block;
  }
  :global(.display pre b) {
    color: black;
  }
  :global(span.code) {
    font-family: monospace;
    font-size: 0.9em;
  }
  :global(span.box) {
    font-family: monospace;
    background-color: #a0a0a0;
    color: white;
    padding: 0 .38em;
    border-radius: 1em;
  }
  :global(span.error) {
    padding: .3em .5em;
    background-color: red;
    color: white;
  }
  :global(img) {
    width: 100%;
  }
</style>