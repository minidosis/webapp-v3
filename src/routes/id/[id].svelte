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
  import markright from "../../markright";
  export let node;
  let expanded = false;

  const toggleExpanded = () => {
    expanded = !expanded;
  };

  function escape(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
      switch (str[i]) {
        case "<":
          result += "&lt;";
          break;
        case ">":
          result += "&gt;";
          break;
        default:
          result += str[i];
      }
    }
    return result;
  }

  const openCloseCommand = (open, close) => ({ args, children }) =>
    `${open}${genHtml(children)}${close}`;

  const simpleCommand = tag => openCloseCommand(`<${tag}>`, `</${tag}>`);

  const list = (cssclass, csssubclass, itemFn) => ({ args, children }) => {
    let html = `<div class="${cssclass}">`;
    let num = 1;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child && typeof child === "object") {
        html += openCloseCommand(
          `<div class="item">${itemFn(num)}<div class="content">`,
          `</div></div>`
        )(child);
        num++;
      }
    }
    html += `</div>`;
    return html;
  };

  const generatorFunctions = {
    minidosis: ({ args, children }) =>
      `<a href="${"id/" + args[0]}">${genHtml(children)}</a>`,
    pre: ({ args, children }) => {
      const [lang, _class] = args ? args : [];
      return `<div class="pre ${_class ? _class : ""}"><pre>${genHtml(
        children
      )}</pre></div>`;
    },
    code: ({ args, children }) =>
      `<span class="code">${children.join(" ")}</span>`,
    b: simpleCommand("b"),
    h2: simpleCommand("h2"),
    em: simpleCommand("em"),
    img: ({ children }) => `<img src="asset/${children[0]}" />`,
    box: ({ children }) => `<span class="box">${genHtml(children)}</span>`,
    header: ({ children }) =>
      `<thead><tr>${children
        .map(ch => `<th>${ch.children[0]}</th>`)
        .join("")}</tr></thead>`,
    row: ({ children }) =>
      `<tr>${children
        .map(ch => `<td>${genHtml(ch.children)}</td>`)
        .join("")}</tr>`,
    footnote: ({ args, children }) => {
      const footnum = `<span class="footnote">${args[0]}</span>`;
      return children
        ? `<div class="footnote">${footnum}${genHtml(children)}</div>`
        : footnum;
    },
    olist: list("enumerate", "item", i => `<span class="num">${i}.</span>`),
    ulist: list("itemize", "item", i => `<span class="bullet">&bull;</span>`),
    table: ({ args, children }) => {
      let align;
      if (args && args[0] === "left") {
        align = "left";
      }
      return openCloseCommand(
        `<div class="table"><table ${
          align ? `style="text-align: ${align}"` : ``
        }>`,
        "</table></div>"
      )({ children });
    },
    comment: () => ""
  };

  const genHtml = (mr, context) => markright.genHtml(mr, context, generatorFunctions)

  const genText = (mr, context) => {
    // Search for the @text node for now...
    const text = mr.filter(node => node && typeof node === 'object' && node.id === 'text');
    if (text.length > 1) {
      return `<span class="error">Node has too many text nodes!</span>`;
    } else if (text.length == 0) {
      return `<span class="error">Node has 0 text nodes!</span>`;
    } else {
      return markright.genHtml(text[0].children, context, generatorFunctions);
    }
  }
</script>

<style>
  .content {
    background-color: white;
    border-radius: 0.4em;
  }
  .header {
    cursor: pointer;
    margin-bottom: 1em;
    padding: 1.5em;
    padding-bottom: 1em;
    overflow: hidden;
    border-top-left-radius: 0.4em;
    border-top-right-radius: 0.4em;
    border-bottom: 1px solid rgb(248, 247, 246);
  }
  .header:hover {
    background-color: rgb(255, 251, 242);
  }
  .header h1 {
    margin-bottom: 0;
  }
  :global(div.table) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  :global(table) {
    text-align: center;
    border-collapse: collapse;
    font-family: sans-serif;
    font-size: 0.8em;
    border: 1px solid gray;
  }
  :global(table td),
  :global(table th) {
    border: 1px solid gray;
    padding: 0.2em 0.6em;
  }
  :global(table th) {
    background-color: #e0e0e0;
  }
  nav {
    font-size: 0.85em;
    margin-top: 1em;
  }
  nav section {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: baseline;
  }
  nav section h3 {
    font-weight: 700;
    font-size: 0.95em;
    margin-right: 1em;
    color: rgb(121, 67, 32);
  }
  nav section a {
    margin-left: 0.5em;
    text-decoration: none;
    background-color: rgb(219, 99, 0);
    padding: 0em 0.6em;
    border-radius: 1em;
    color: white;
  }
  nav section a:hover {
    background-color: rgb(241, 125, 30);
  }
  .text {
    padding: 0 1.3em 1.1em 1.3em;
    font-family: "EB Garamond", serif;
    font-size: 1.3em;
  }
  .text :global(h2) {
    margin-top: 1em;
    font-size: 1.5em;
    margin-bottom: 0;
  }
  .text :global(a) {
    text-decoration: none;
    color: rgb(36, 73, 119);
    border-bottom: 1px solid rgb(235, 235, 235);
  }
  .text :global(a:hover) {
    color: rgb(81, 132, 194);
    border-bottom: 1px solid rgb(195, 216, 241);
  }
  .text :global(p) {
    margin-bottom: 0.4em;
  }
  :global(.enumerate .item),
  :global(.itemize .item) {
    padding-left: 0.5em;
    padding-bottom: 0.5em;
    display: flex;
    justify-content: flex-start;
    align-items: baseline;
  }
  :global(.enumerate .num) {
    font-size: 0.9em;
    margin-right: 0.6em;
    border: 1px solid #c0c0c0;
    padding: 0.05em 0.25em;
    border-radius: 1em;
  }
  :global(.itemize .bullet) {
    margin-right: 0.5em;
    font-size: 1em;
  }
  :global(.footnote) {
    font-size: 0.75em;
  }
  :global(span.footnote) {
    font-size: 0.6em;
    vertical-align: super;
    margin-left: 0.1em;
  }
  :global(div.footnote) {
    font-size: 0.75em;
    color: #808080;
  }
  :global(div.footnote span.footnote) {
    margin-right: 0.3em;
  }
  :global(pre) {
    font-size: 0.8em;
    margin: 0.15em;
    padding: 0.3em 0.6em;
    border: 1px solid rgb(200, 214, 228);
    border-radius: 4px;
    background: rgb(230, 240, 250);
  }
  :global(div.pre.display),
  :global(div.pre.center) {
    display: flex;
    justify-content: center;
    align-items: stretch;
  }
  :global(pre p) {
    /* TODO: This is UGLY!! */
    margin: 0;
    padding: 0;
  }
  :global(.display pre) {
    display: inline-block;
    color: #707070;
    font-size: 1em;
    background: rgb(240, 247, 199);
    border: 1px solid rgb(226, 224, 189);
  }
  :global(.center pre) {
    display: inline-block;
  }
  :global(.display pre b) {
    color: black;
  }
  :global(.display span.box) {
    font-size: 1em;
  }
  :global(span.code) {
    font-family: monospace;
    font-size: 0.9em;
  }
  :global(span.box) {
    font-size: 0.9em;
    font-family: monospace;
    background-color: #a0a0a0;
    color: white;
    padding: 0 0.38em;
    border-radius: 1em;
  }
  :global(span.error) {
    padding: 0.3em 0.5em;
    background-color: red;
    color: white;
  }
  :global(img) {
    width: 100%;
  }
</style>

<svelte:head>
  <title>{node.title}</title>
</svelte:head>

<div class="content">
  <div class="header {expanded ? 'open' : ''}" on:click={toggleExpanded}>
    <h1>{node.title}</h1>
    {#if expanded}
      <nav>
        {#if node.parents.length > 0}
          <section>
            <h3>Parte de</h3>
            {#each node.parents as parent}
              <a href={'id/' + parent.id}>{parent.title}</a>
            {/each}
          </section>
        {/if}

        {#if node.bases.length > 0}
          <section>
            <h3>Más general</h3>
            {#each node.bases as base}
              <a href={'id/' + base.id}>{base.title}</a>
            {/each}
          </section>
        {/if}

        {#if node.derived.length > 0}
          <section>
            <h3>Derivados</h3>
            {#each node.derived as deriv}
              <a href={'id/' + deriv.id}>{deriv.title}</a>
            {/each}
          </section>
        {/if}

        {#if node.children.length > 0}
          <section>
            <h3>Incluye</h3>
            {#each node.children as child}
              <a href={'id/' + child.id}>{child.title}</a>
            {/each}
          </section>
        {/if}
      </nav>
    {/if}
  </div>
  <div class="text">
    {@html genText(node.content)}
  </div>
</div>
