<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { menu, getItemById } from '$lib/menu';
	import { slide, fly, scale } from 'svelte/transition';
	import { quintOut, elasticOut } from 'svelte/easing';

	let { data, form } = $props();

	const DEADLINE = new Date('2026-02-23T20:00:00');
	const INSTAGRAM_MENU = 'https://www.instagram.com/p/DItX5KfIw3Z/?img_index=1';

	let name = $state('');
	let quantities: Record<string, number> = $state({});
	let originalQuantities: Record<string, number> | null = $state(null);
	let submitting = $state(false);
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

	// Pre-fill name and items when editing an existing order, or reset when switching users
	$effect(() => {
		if (data.existingOrder && data.existingName) {
			name = data.existingName;
			const snapshot: Record<string, number> = {};
			for (const item of data.existingOrder.items) {
				quantities[item.itemId] = item.quantity;
				snapshot[item.itemId] = item.quantity;
			}
			originalQuantities = snapshot;
		} else if (!data.existingName) {
			name = '';
			quantities = {};
			originalQuantities = null;
		}
	});

	function clearSavedOrder() {
		localStorage.removeItem('eagle-picker-name');
		name = '';
		quantities = {};
		originalQuantities = null;
		goto('/', { replaceState: true });
	}

	function hasChanges(): boolean {
		if (!originalQuantities) return true;
		const allIds = new Set([...Object.keys(quantities), ...Object.keys(originalQuantities)]);
		for (const id of allIds) {
			if ((quantities[id] ?? 0) !== (originalQuantities[id] ?? 0)) return true;
		}
		return false;
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

	const confettiColors = ['#BD93F9', '#FF79C6', '#8BE9FD', '#50FA7B'];
</script>

<svelte:head>
	<title>Namo Eat - Group Order</title>
</svelte:head>

<!-- Countdown Banner -->
<div class="bg-primary text-white text-center py-3 px-4 font-semibold sticky top-1 z-50 shadow-md">
	{#if countdown === 'Orders are closed!'}
		Orders are closed!
	{:else}
		Order by Monday 23rd February &mdash; <span class="font-mono">{countdown}</span> remaining
	{/if}
</div>

<div class="max-w-2xl mx-auto px-4 py-8">
	<h1 class="text-4xl font-extrabold text-center mb-2 text-text">
		Namo Eat
	</h1>
	<p class="text-text-muted text-center mb-2">Let's go eat some Thai food!</p>
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
			<div class="mx-auto w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center mb-4">
				<svg class="w-8 h-8" viewBox="0 0 24 24" fill="none">
					<circle cx="12" cy="12" r="10" stroke="#BD93F9" stroke-width="2" opacity="0.3" />
					<path
						class="animate-checkmark"
						d="M7 13l3 3 7-7"
						stroke="#BD93F9"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>

			<p class="text-primary text-xl font-bold">Order submitted!</p>
			<p class="text-text-secondary mt-2">Thanks {form.name}, your order has been saved.</p>
			<p class="text-text-muted mt-2 text-sm">You can update your order anytime before the deadline.</p>
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
		submitting = true;
		return async ({ result, update }) => {
			submitting = false;
			await update({ reset: false });
			if (result.type === 'success') {
				localStorage.setItem('eagle-picker-name', name);
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		};
	}}>
		{#if data.existingOrder}
			<div
				class="bg-primary-soft border border-primary/30 rounded-xl p-3 mb-6 text-primary text-sm"
				in:fly={{ y: -10, duration: 300 }}
			>
				<div class="flex items-center justify-between gap-3 mb-2">
					<span class="font-medium">Your current order</span>
					<button
						type="button"
						onclick={clearSavedOrder}
						class="text-primary hover:text-primary-hover underline whitespace-nowrap transition-colors"
					>
						Order as someone else
					</button>
				</div>
				<ul class="text-primary/80 space-y-0.5">
					{#each data.existingOrder.items as orderItem}
						{@const menuItem = getItemById(orderItem.itemId)}
						{#if menuItem}
							<li class="flex justify-between">
								<span>{orderItem.quantity} &times; {menuItem.name}</span>
								<span>&pound;{(menuItem.price * orderItem.quantity).toFixed(2)}</span>
							</li>
						{/if}
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Name Input -->
		<div class="mb-8">
			<label for="name-input" class="block text-sm font-medium text-text-secondary mb-2">Your Name</label>
			<input
				id="name-input"
				type="text"
				name="name"
				bind:value={name}
				placeholder="Enter your name"
				class="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200 shadow-sm"
			/>
		</div>

		{#if form?.error}
			<div
				class="bg-[#FF5555]/10 border border-[#FF5555]/30 rounded-xl p-3 mb-6 text-[#FF5555] text-sm"
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
					class="w-full flex items-center justify-between text-xl font-bold text-text border-b border-border pb-2 mb-2 cursor-pointer hover:text-primary transition-colors group"
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
						class="text-text-muted text-lg transition-transform duration-300 ease-out group-hover:text-primary"
						class:rotate-180={openSections[category.name]}
					>
						&#9660;
					</span>
				</button>
				{#if openSections[category.name]}
					<div class="space-y-2" transition:slide={{ duration: 300, easing: quintOut }}>
						{#each category.items as item}
							<div class="flex items-center justify-between card card-hover rounded-xl px-4 py-3 transition-all duration-200">
								<div class="flex-1 mr-4">
									<div>
										<span class="text-text font-medium">{item.name}</span>
										{#if item.tags}
											{#each item.tags as tag}
												<span class="ml-2 text-xs bg-[#50FA7B]/15 text-[#50FA7B] px-1.5 py-0.5 rounded font-medium">
													{tag}
												</span>
											{/each}
										{/if}
										<span class="text-text-muted ml-2">&pound;{item.price.toFixed(2)}</span>
									</div>
									{#if item.description}
										<p class="text-text-muted text-xs mt-0.5">{item.description}</p>
									{/if}
								</div>
								<div class="flex items-center gap-3">
									<button
										type="button"
										onclick={() => decrement(item.id)}
										class="w-8 h-8 rounded-full bg-surface-alt hover:bg-border text-text-secondary flex items-center justify-center text-lg font-bold transition-all duration-200 hover:scale-110 active:scale-95"
									>
										-
									</button>
									<span class="w-6 text-center font-mono text-lg text-text">
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
				class="sticky bottom-4 bg-surface rounded-xl p-4 shadow-lg border border-border"
				transition:fly={{ y: 30, duration: 400, easing: quintOut }}
			>
				<div class="flex justify-between items-center" class:mb-3={hasChanges()}>
					<span class="text-text-secondary">{totalItems()} item{totalItems() > 1 ? 's' : ''}</span>
					<span class="text-xl font-bold text-primary">&pound;{totalPrice()}</span>
				</div>
				{#if hasChanges()}
					<button
						type="submit"
						disabled={submitting}
						class="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{#if submitting}
							Submitting…
						{:else}
							{data.existingOrder ? 'Update Order' : 'Submit Order'}
						{/if}
					</button>
				{:else if data.existingOrder}
					<p class="text-text-muted text-xs text-center mt-2 mb-1">Your current order</p>
					<ul class="text-text-secondary text-sm space-y-0.5">
						{#each data.existingOrder.items as orderItem}
							{@const menuItem = getItemById(orderItem.itemId)}
							{#if menuItem}
								<li class="flex justify-between">
									<span>{orderItem.quantity} &times; {menuItem.name}</span>
									<span class="text-text-muted">&pound;{(menuItem.price * orderItem.quantity).toFixed(2)}</span>
								</li>
							{/if}
						{/each}
					</ul>
				{/if}
			</div>
		{/if}
	</form>

	<div class="mt-8 text-center">
		<a href="/summary" class="text-text-muted hover:text-primary underline text-sm transition-colors">
			View group order summary
		</a>
	</div>
</div>
