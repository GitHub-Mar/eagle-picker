<script lang="ts">
	import { enhance } from '$app/forms';
	import { menu } from '$lib/menu';

	let { data, form } = $props();

	const DEADLINE = new Date('2026-11-23T20:00:00');
	const INSTAGRAM_MENU = 'https://www.instagram.com/p/DItX5KfIw3Z/?img_index=1';

	const people = [
		'Person 1', 'Person 2', 'Person 3', 'Person 4', 'Person 5',
		'Person 6', 'Person 7', 'Person 8', 'Person 9', 'Person 10',
		'Person 11', 'Person 12', 'Person 13', 'Person 14', 'Person 15',
		'Person 16', 'Person 17', 'Person 18'
	];

	let selectedName = $state('');
	let customName = $state('');
	let quantities: Record<string, number> = $state({});
	let countdown = $state('');

	function getName() {
		return selectedName === '__custom__' ? customName.trim() : selectedName;
	}

	function updateCountdown() {
		const now = new Date();
		const diff = DEADLINE.getTime() - now.getTime();
		if (diff <= 0) {
			countdown = 'Orders are closed!';
			return;
		}
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((diff % (1000 * 60)) / 1000);
		countdown = `${days}d ${hours}h ${minutes}m ${seconds}s`;
	}

	$effect(() => {
		updateCountdown();
		const interval = setInterval(updateCountdown, 1000);
		return () => clearInterval(interval);
	});

	$effect(() => {
		if (data.existingOrder) {
			for (const item of data.existingOrder.items) {
				quantities[item.itemId] = item.quantity;
			}
		}
	});

	function increment(id: string) {
		quantities[id] = (quantities[id] ?? 0) + 1;
	}

	function decrement(id: string) {
		if ((quantities[id] ?? 0) > 0) {
			quantities[id]--;
		}
	}

	function totalItems() {
		return Object.values(quantities).reduce((sum, q) => sum + q, 0);
	}

	function totalPrice() {
		let total = 0;
		for (const cat of menu) {
			for (const item of cat.items) {
				total += (quantities[item.id] ?? 0) * item.price;
			}
		}
		return total.toFixed(2);
	}
</script>

<svelte:head>
	<title>Namo Eat - Group Order</title>
</svelte:head>

<!-- Countdown Banner -->
<div class="bg-amber-600 text-white text-center py-3 px-4 font-semibold sticky top-0 z-50">
	{#if countdown === 'Orders are closed!'}
		Orders are closed!
	{:else}
		Order by Monday 23rd November &mdash; <span class="font-mono">{countdown}</span> remaining
	{/if}
</div>

<div class="max-w-2xl mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold text-center mb-2">Namo Eat</h1>
	<p class="text-zinc-400 text-center mb-2">Vietnamese & Thai Street Food &mdash; Group Pre-Order</p>
	<p class="text-center mb-8">
		<a
			href={INSTAGRAM_MENU}
			target="_blank"
			rel="noopener noreferrer"
			class="text-amber-400 hover:text-amber-300 underline text-sm"
		>
			View the full menu on Instagram
		</a>
	</p>

	{#if form?.success}
		<div class="bg-green-900/50 border border-green-700 rounded-lg p-6 text-center mb-8">
			<p class="text-green-300 text-lg font-semibold">Order submitted!</p>
			<p class="text-green-400 mt-2">Thanks {form.name}, your order has been saved.</p>
			<p class="text-zinc-400 mt-2 text-sm">You can update your order anytime before the deadline.</p>
			<a href="/summary" class="inline-block mt-4 text-amber-400 hover:text-amber-300 underline">
				View group summary
			</a>
		</div>
	{/if}

	<form method="POST" action="?/submit" use:enhance={() => {
		return async ({ update }) => {
			await update();
		};
	}}>
		<!-- Name Selection -->
		<div class="mb-8">
			<label for="name-select" class="block text-sm font-medium text-zinc-300 mb-2">Your Name</label>
			<select
				id="name-select"
				bind:value={selectedName}
				class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
			>
				<option value="">Select your name...</option>
				{#each people as person}
					<option value={person}>{person}</option>
				{/each}
				<option value="__custom__">Other (type your name)</option>
			</select>

			{#if selectedName === '__custom__'}
				<input
					type="text"
					bind:value={customName}
					placeholder="Enter your name"
					class="mt-2 w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
				/>
			{/if}

			<input type="hidden" name="name" value={getName()} />
		</div>

		{#if form?.error}
			<div class="bg-red-900/50 border border-red-700 rounded-lg p-3 mb-6 text-red-300 text-sm">
				{form.error}
			</div>
		{/if}

		<!-- Menu -->
		{#each menu as category}
			<div class="mb-8">
				<h2 class="text-xl font-bold text-amber-400 mb-4 border-b border-zinc-800 pb-2">
					{category.name}
				</h2>
				<div class="space-y-3">
					{#each category.items as item}
						<div class="flex items-center justify-between bg-zinc-900 rounded-lg px-4 py-3">
							<div class="flex-1 mr-4">
								<span class="text-zinc-100">{item.name}</span>
								{#if item.tags}
									{#each item.tags as tag}
										<span class="ml-2 text-xs bg-green-900 text-green-300 px-1.5 py-0.5 rounded">
											{tag}
										</span>
									{/each}
								{/if}
								<span class="text-zinc-400 ml-2">&pound;{item.price.toFixed(2)}</span>
							</div>
							<div class="flex items-center gap-3">
								<button
									type="button"
									onclick={() => decrement(item.id)}
									class="w-8 h-8 rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-200 flex items-center justify-center text-lg font-bold transition-colors"
								>
									-
								</button>
								<span class="w-6 text-center font-mono text-lg">
									{quantities[item.id] ?? 0}
								</span>
								<input type="hidden" name="qty_{item.id}" value={quantities[item.id] ?? 0} />
								<button
									type="button"
									onclick={() => increment(item.id)}
									class="w-8 h-8 rounded-full bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center text-lg font-bold transition-colors"
								>
									+
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}

		<!-- Sticky Total & Submit -->
		{#if totalItems() > 0}
			<div class="sticky bottom-4 bg-zinc-800 border border-zinc-700 rounded-lg p-4 shadow-xl">
				<div class="flex justify-between items-center mb-3">
					<span class="text-zinc-300">{totalItems()} item{totalItems() > 1 ? 's' : ''}</span>
					<span class="text-xl font-bold text-amber-400">&pound;{totalPrice()}</span>
				</div>
				<button
					type="submit"
					class="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-lg transition-colors"
				>
					Submit Order
				</button>
			</div>
		{/if}
	</form>

	<div class="mt-8 text-center">
		<a href="/summary" class="text-zinc-400 hover:text-amber-400 underline text-sm">
			View group order summary
		</a>
	</div>
</div>
