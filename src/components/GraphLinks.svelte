<script>
  export let links;
  export let direction;
  export let click;
</script>

{#if links.length > 0}
  <div id="{direction}" class="links">
    {#each links as link}
      <a
        href="{'id/' + link.id}"
        on:click|preventDefault="{() => click(link.id, direction)}">
        {link.title}
      </a>
    {/each}
  </div>
{/if}

<style>
  .links {
    position: absolute;
    z-index: 10;
    display: flex;
    background: rgba(0, 0, 0, 0.1);
    justify-content: center;
  }
  #left,
  #right {
    top: 10%;
    height: 80%;
    flex-direction: column;
    max-width: 10em;
    padding-left: 0.5em;
    padding-right: 0.5em;
  }
  #left {
    left: 0;
    align-items: flex-start;
    border-radius: 0 5px 5px 0;
  }
  #right {
    right: 0;
    align-items: flex-end;
    text-align: right;
    border-radius: 5px 0 0 5px;
  }
  #up,
  #down {
    width: 80%;
    min-height: 2em;
    left: 10%;
    flex-direction: row;
    align-items: center;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
  }
  #up {
    top: 0;
    border-radius: 0 0 5px 5px;
  }
  #down {
    bottom: 0;
    border-radius: 5px 5px 0 0;
  }
  a {
    font-size: 0.8rem;
    margin: 0.1em 0.25em;
    text-decoration: none;
    background-color: rgb(219, 99, 0);
    padding: 0em 0.6em;
    border-radius: 0.5em;
    color: white;
  }
  a:hover {
    background-color: rgb(241, 125, 30);
  }
</style>
