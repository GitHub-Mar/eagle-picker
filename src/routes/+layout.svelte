<script>
	import '../app.css';
	let { children } = $props();
</script>

<!-- Accent gradient bar -->
<div class="accent-gradient-bar w-full fixed top-0 left-0 z-[100]"></div>

<div class="min-h-screen bg-surface-alt text-text pt-1">
	{@render children()}
</div>
