<script>
  export let links;
  export let direction;
</script>

<style>
  #left, #right { flex: 1 }
  #up,
  #down,
  #left,
  #right {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #up {
    flex-direction: column;
  }
  #down {
    flex-direction: column-reverse;
  }
  #left {
    flex-direction: row;
  }
  #right {
    flex-direction: row-reverse;
  }

  .links {
    display: flex;
    flex-wrap: wrap;
    padding: 0.3em;
  }
  #left .links,
  #right .links {
    flex-direction: column;
  }
  a {
    margin: 0.1em 0.25em;
    text-decoration: none;
    background-color: rgb(219, 99, 0);
    padding: 0em 0.6em;
    border-radius: 1em;
    color: white;
  }
  a:hover {
    background-color: rgb(241, 125, 30);
  }
</style>
  
<div id={direction} class="parent">
  {#if links.length > 0}
    <div class="links">
      {#each links as link}
        <a href={'id/' + link.id}>{link.title}</a>
      {/each}
    </div>
  {/if}
</div>

