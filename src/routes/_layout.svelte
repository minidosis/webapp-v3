<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
</script>

<style>
	main {
    display: flex;
    justify-content: center;
		position: relative;
		padding: 1em;
		margin: 0 0;
		box-sizing: border-box;
	}
</style>

<Nav {segment}/>

<main>
	<slot></slot>
</main>