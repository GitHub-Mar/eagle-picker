<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { menu } from '$lib/menu';
	import { slide, fly, scale } from 'svelte/transition';
	import { quintOut, elasticOut } from 'svelte/easing';

	let { data, form } = $props();

	const DEADLINE = new Date('2026-02-23T20:00:00');
	const INSTAGRAM_MENU = 'https://www.instagram.com/p/DItX5KfIw3Z/?img_index=1';

	let name = $state('');
	let quantities: Record<string, number> = $state({});
	let countdown = $state('');
	let openSections: Record<string, boolean> = $state(
		Object.fromEntries(menu.map((cat) => [cat.name, false]))
	);

	function toggleSection(sectionName: string) {
		openSections[sectionName] = !openSections[sectionName];
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

	// Auto-load existing order from localStorage on return visit
	$effect(() => {
		const saved = localStorage.getItem('eagle-picker-name');
		if (saved && !page.url.searchParams.has('name')) {
			goto(`?name=${encodeURIComponent(saved)}`, { replaceState: true });
		}
	});

	// Pre-fill name and items when editing an existing order
	$effect(() => {
		if (data.existingOrder && data.existingName) {
			name = data.existingName;
			for (const item of data.existingOrder.items) {
				quantities[item.itemId] = item.quantity;
			}
		}
	});

	function clearSavedOrder() {
		localStorage.removeItem('eagle-picker-name');
		name = '';
		quantities = {};
		goto('/', { replaceState: true });
	}

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

	function sectionItemCount(categoryName: string) {
		const cat = menu.find((c) => c.name === categoryName);
		if (!cat) return 0;
		return cat.items.reduce((sum, item) => sum + (quantities[item.id] ?? 0), 0);
	}

	const confettiColors = ['#A51931', '#2563EB', '#F59E0B', '#1E3A8A'];
</script>

<svelte:head>
	<title>Namo Eat - Group Order</title>
</svelte:head>

<!-- Countdown Banner -->
<div class="bg-gradient-to-r from-thai-red via-thai-blue to-thai-red text-white text-center py-3 px-4 font-semibold sticky top-1 z-50 shadow-md">
	{#if countdown === 'Orders are closed!'}
		Orders are closed!
	{:else}
		Order by Monday 23rd February &mdash; <span class="font-mono">{countdown}</span> remaining
	{/if}
</div>

<div class="max-w-2xl mx-auto px-4 py-8">
	<h1 class="text-4xl font-extrabold text-center mb-2 bg-gradient-to-r from-thai-red via-thai-blue to-primary bg-clip-text text-transparent">
		Namo Eat
	</h1>
	<p class="text-zinc-500 text-center mb-2">Let's go eat some Thai food!</p>
	<p class="text-center mb-8">
		<a
			href={INSTAGRAM_MENU}
			target="_blank"
			rel="noopener noreferrer"
			class="text-primary hover:text-primary-hover underline text-sm transition-colors"
		>
			View the full menu on Instagram
		</a>
	</p>

	{#if form?.success}
		<div
			class="card rounded-xl p-8 text-center mb-8 relative overflow-hidden"
			in:scale={{ duration: 500, start: 0.85, easing: elasticOut }}
		>
			<!-- Animated checkmark circle -->
			<div class="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
				<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none">
					<circle cx="12" cy="12" r="10" stroke="#2563EB" stroke-width="2" opacity="0.3" />
					<path
						class="animate-checkmark"
						d="M7 13l3 3 7-7"
						stroke="#2563EB"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>

			<p class="text-primary text-xl font-bold">Order submitted!</p>
			<p class="text-zinc-600 mt-2">Thanks {form.name}, your order has been saved.</p>
			<p class="text-zinc-400 mt-2 text-sm">You can update your order anytime before the deadline.</p>
			<a href="/summary" class="inline-block mt-4 text-primary hover:text-primary-hover underline transition-colors">
				View group summary
			</a>

			<!-- Confetti dots -->
			{#each Array(8) as _, i}
				<div
					class="absolute w-2 h-2 rounded-full"
					style="
						left: {10 + i * 11}%;
						top: 0;
						background: {confettiColors[i % 4]};
						animation: float-particle {1.2 + i * 0.15}s ease-out {i * 0.1}s forwards;
					"
				></div>
			{/each}
		</div>
	{/if}

	<form method="POST" action="?/submit" use:enhance={() => {
		return async ({ result, update }) => {
			await update({ reset: false });
			if (result.type === 'success') {
				localStorage.setItem('eagle-picker-name', name);
			}
		};
	}}>
		{#if data.existingOrder}
			<div
				class="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6 text-blue-700 text-sm flex items-center justify-between gap-3"
				in:fly={{ y: -10, duration: 300 }}
			>
				<span>Editing your existing order. Changes will replace your previous order.</span>
				<button
					type="button"
					onclick={clearSavedOrder}
					class="text-blue-500 hover:text-blue-700 underline whitespace-nowrap transition-colors"
				>
					Order as someone else
				</button>
			</div>
		{/if}

		<!-- Name Input -->
		<div class="mb-8">
			<label for="name-input" class="block text-sm font-medium text-zinc-700 mb-2">Your Name</label>
			<input
				id="name-input"
				type="text"
				name="name"
				bind:value={name}
				placeholder="Enter your name"
				class="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 shadow-sm"
			/>
		</div>

		{#if form?.error}
			<div
				class="bg-red-50 border border-red-200 rounded-xl p-3 mb-6 text-red-700 text-sm"
				in:fly={{ y: -10, duration: 300 }}
			>
				{form.error}
			</div>
		{/if}

		<!-- Menu -->
		{#each menu as category}
			<!-- Hidden inputs always in DOM so collapsed sections still submit -->
			{#each category.items as item}
				<input type="hidden" name="qty_{item.id}" value={quantities[item.id] ?? 0} />
			{/each}
			<div class="mb-4">
				<button
					type="button"
					onclick={() => toggleSection(category.name)}
					class="w-full flex items-center justify-between text-xl font-bold text-thai-blue border-b border-zinc-200 pb-2 mb-2 cursor-pointer hover:text-primary transition-colors group"
				>
					<span>
						{category.name}
						{#if sectionItemCount(category.name) > 0}
							<span class="ml-2 text-sm bg-primary text-white px-2 py-0.5 rounded-full font-medium">
								{sectionItemCount(category.name)}
							</span>
						{/if}
					</span>
					<span
						class="text-zinc-400 text-lg transition-transform duration-300 ease-out group-hover:text-primary"
						class:rotate-180={openSections[category.name]}
					>
						&#9660;
					</span>
				</button>
				{#if openSections[category.name]}
					<div class="space-y-2" transition:slide={{ duration: 300, easing: quintOut }}>
						{#each category.items as item}
							<div class="flex items-center justify-between card card-hover rounded-xl px-4 py-3 transition-shadow duration-200">
								<div class="flex-1 mr-4">
									<span class="text-zinc-800 font-medium">{item.name}</span>
									{#if item.tags}
										{#each item.tags as tag}
											<span class="ml-2 text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium">
												{tag}
											</span>
										{/each}
									{/if}
									<span class="text-zinc-500 ml-2">&pound;{item.price.toFixed(2)}</span>
								</div>
								<div class="flex items-center gap-3">
									<button
										type="button"
										onclick={() => decrement(item.id)}
										class="w-8 h-8 rounded-full bg-zinc-200 hover:bg-zinc-300 text-zinc-600 flex items-center justify-center text-lg font-bold transition-all duration-200 hover:scale-110 active:scale-95"
									>
										-
									</button>
									<span class="w-6 text-center font-mono text-lg text-zinc-700">
										{quantities[item.id] ?? 0}
									</span>
									<button
										type="button"
										onclick={() => increment(item.id)}
										class="w-8 h-8 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center text-lg font-bold transition-all duration-200 hover:scale-110 active:scale-95"
									>
										+
									</button>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/each}

		<!-- Sticky Total & Submit -->
		{#if totalItems() > 0}
			<div
				class="sticky bottom-4 bg-white rounded-xl p-4 shadow-lg border border-zinc-200"
				transition:fly={{ y: 30, duration: 400, easing: quintOut }}
			>
				<div class="flex justify-between items-center mb-3">
					<span class="text-zinc-600">{totalItems()} item{totalItems() > 1 ? 's' : ''}</span>
					<span class="text-xl font-bold text-primary">&pound;{totalPrice()}</span>
				</div>
				<button
					type="submit"
					class="w-full bg-gradient-to-r from-thai-red to-primary hover:from-thai-red-light hover:to-primary-hover text-white font-bold py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
				>
					{data.existingOrder ? 'Update Order' : 'Submit Order'}
				</button>
			</div>
		{/if}
	</form>

	<div class="mt-8 text-center">
		<a href="/summary" class="text-zinc-400 hover:text-primary underline text-sm transition-colors">
			View group order summary
		</a>
	</div>
</div>
