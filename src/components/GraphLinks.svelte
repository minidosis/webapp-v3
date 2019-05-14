<script>
  export let links;
  export let direction;
</script>

<style>
  #up,
  #down,
  #left,
  #right {
    display: flex;
    position: absolute;
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
  #up {
    top: 0;
    left: 0;
    width: 100%;
  }
  #down {
    bottom: 0;
    left: 0;
    width: 100%;
  }
  #left {
    top: 0;
    left: 0;
    height: 100%;
  }
  #right {
    top: 0;
    right: 0;
    height: 100%;
  }
  #up:hover,
  #down:hover,
  #left:hover,
  #right:hover {
    background-color: rgb(255, 237, 203, 0.75);
  }
  .links {
    display: none;
  }
  #left .links,
  #right .links {
    flex-direction: column;
  }
  .parent:hover .links {
    display: flex;
    flex-wrap: wrap;
    padding: 0.3em;
  }
  .parent:hover .arrow {
    width: 12px;
    height: 12px;
  }
  .arrow {
    display: block;
    width: 20px;
    height: 20px;
    background-color: rgb(200, 200, 200);
  }
  #up .arrow {
    clip-path: polygon(0% 75%, 100% 75%, 50% 25%);
  }
  #down .arrow {
    clip-path: polygon(0% 25%, 100% 25%, 50% 75%);
  }
  #left .arrow {
    clip-path: polygon(25% 50%, 75% 100%, 75% 0%);
  }
  #right .arrow {
    clip-path: polygon(75% 50%, 25% 100%, 25% 0%);
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

{#if links.length > 0}
  <div id={direction} class="parent">
    <span class="arrow" />
    <div class="links">
      {#each links as link}
        <a href={'id/' + link.id}>{link.title}</a>
      {/each}
    </div>
  </div>
{/if}
