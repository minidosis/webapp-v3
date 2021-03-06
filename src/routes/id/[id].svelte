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
  import { goto } from "@sapper/app";
  import { onMount, beforeUpdate, afterUpdate, tick } from "svelte";
  import { fly } from "svelte/transition";
  import { genHtml } from "../../genhtml";
  import GraphLinks from "../../components/GraphLinks.svelte";

  export let node;
  export let visibleNode;

  let transition = {
    x: 300,
    duration: 250
  };

  onMount(() => {
    visibleNode = node;
  });

  const forwardTransitions = {
    up: { y: 300, x: 0 },
    down: { y: -300, x: 0 },
    left: { x: 300, y: 0 },
    right: { x: -300, y: 0 }
  };
  const inverseTransitions = {
    up: { y: -300, x: 0 },
    down: { y: 300, x: 0 },
    left: { x: -300, y: 0 },
    right: { x: 300, y: 0 }
  };

  const changePage = async (id, dir) => {
    console.log("change-page", id, dir);
    await goto("id/" + id);
    transition = { ...transition, ...forwardTransitions[dir] };
    await tick();
    console.log(transition);
    visibleNode = null;
    setTimeout(async () => {
      transition = { ...transition, ...inverseTransitions[dir] };
      await tick();
      visibleNode = node;
    }, 400);
  };
</script>

<svelte:head>
  <title>{node.title}</title>
</svelte:head>

<div class="page">
  {#if visibleNode}
    <GraphLinks direction="up" links="{node.parents}" click="{changePage}" />
    <GraphLinks direction="left" links="{node.bases}" click="{changePage}" />
    <GraphLinks direction="right" links="{node.derived}" click="{changePage}" />
    <GraphLinks direction="down" links="{node.children}" click="{changePage}" />
  {/if}

  {#if visibleNode}
    <div class="content" transition:fly="{transition}">
      <div class="header">
        <h1>{visibleNode.title}</h1>
      </div>
      <div class="text">
        {@html genHtml(visibleNode.content)}
      </div>
    </div>
  {/if}

</div>

<style>
  .content {
    position: relative;
    width: 45em;
    background-color: white;
    border-radius: 0.4em;
    padding: 1.4em;
    min-height: 40em;
  }

  @media (max-width: 800px) {
    .content {
      width: 90%;
    }
  }

  .header {
    margin-bottom: 1em;
    padding: 1.5em;
    padding-bottom: 1em;
    overflow: hidden;
    border-top-left-radius: 0.4em;
    border-top-right-radius: 0.4em;
    border-bottom: 1px solid rgb(248, 247, 246);
  }
  .header h1 {
    margin-bottom: 0;
  }
  :global(div.table) {
    padding: 1em 0;
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
    margin: 0.4em 0 0.4em;
  }
  :global(.enumerate),
  :global(.itemize) {
    padding-left: 0.8em;
    padding-top: 0.2em;
  }
  :global(.enumerate .item),
  :global(.itemize .item) {
    padding-left: 0.5em 0.5em;
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
    margin-top: 2em;
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
    font-size: 0.85em;
    margin: 0.85em 0.15em;
    padding: 0.5em 0.75em;
    border-radius: 4px;
    background: rgb(230, 240, 250);
  }
  :global(div.pre.display),
  :global(div.pre.center) {
    display: flex;
    justify-content: center;
    align-items: stretch;
  }
  :global(.display pre) {
    display: inline-block;
    color: black;
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
  :global(.display span.box) {
    font-size: 1em;
  }
  :global(span.code) {
    font-family: "Iosevka", monospace;
    font-size: 0.75em;
  }
  :global(span.box) {
    font-size: 0.85em;
    font-family: "Iosevka", monospace;
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

  .page {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
  }
</style>
