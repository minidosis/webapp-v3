<script>
  import SearchBox from './SearchBox.svelte'

	export let segment;
</script>

<style>
	nav {
		border-bottom: 1px solid rgba(170,30,30,0.1);
		font-weight: 300;
    padding: 0 1em;
    background-color: white;
    display: flex;
    align-items: center;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	.selected {
		position: relative;
		display: inline-block;
	}

	.selected::after {
		position: absolute;
		content: '';
		width: calc(80%);
		height: 2px;
		background-color: rgb(226, 133, 11);
		display: block;
    bottom: -1px;
    left: 10%;
	}

	a {
		text-decoration: none;
		padding: 1em .5em .5em;
		display: block;
	}

  ul {
    margin-right: 2em;
    display: flex;
    flex-direction: row;
    align-items: stretch;
  }
  
</style>

<nav>
	<ul>
		<li class='{segment === undefined ? "selected" : ""}' ><a href='.'><img src="logo.svg" alt="logo" /></a></li>
    <li class='{segment === "id" ? "selected" : ""}'>      <a rel=prefetch href='id'>conceptos</a></li>
		<li class='{segment === "courses" ? "selected" : ""}' ><a href='courses'>cursos</a></li>
    <li class='{segment === "map" ? "selected" : ""}'>     <a href='map'>mapa</a></li>
	</ul>

  <SearchBox on:search />
</nav>