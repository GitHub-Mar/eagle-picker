<script>
	import '../app.css';
	let { children } = $props();
</script>

<!-- Thai flag tri-color bar -->
<div class="thai-gradient-bar w-full fixed top-0 left-0 z-[100]"></div>

<div class="min-h-screen bg-slate-50 text-zinc-800 pt-1">
	{@render children()}
</div>
