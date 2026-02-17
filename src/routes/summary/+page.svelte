<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Order Summary - Namo Eat</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-8">
	<div class="flex items-center justify-between mb-8">
		<h1 class="text-3xl font-bold text-zinc-800">Order Summary</h1>
		<a href="/" class="text-primary hover:text-primary-hover underline text-sm transition-colors">&larr; Back to menu</a>
	</div>

	<p class="text-zinc-500 mb-8">{data.orderCount} {data.orderCount === 1 ? 'person has' : 'people have'} ordered</p>

	<!-- Aggregate totals for restaurant -->
	<section class="mb-12">
		<h2 class="text-xl font-bold text-thai-blue mb-4 border-b border-zinc-200 pb-2">
			Restaurant Order (totals per item)
		</h2>
		{#if data.itemTotals.length === 0}
			<p class="text-zinc-400">No orders yet.</p>
		{:else}
			<div class="card rounded-xl overflow-hidden">
				<table class="w-full">
					<thead>
						<tr class="border-b border-zinc-200 text-zinc-500 text-sm bg-zinc-50">
							<th class="text-left px-4 py-3">Item</th>
							<th class="text-right px-4 py-3">Qty</th>
							<th class="text-right px-4 py-3">Subtotal</th>
						</tr>
					</thead>
					<tbody>
						{#each data.itemTotals as item}
							<tr class="border-b border-zinc-100">
								<td class="px-4 py-3 text-zinc-700">{item.name}</td>
								<td class="px-4 py-3 text-right font-mono text-zinc-600">{item.quantity}</td>
								<td class="px-4 py-3 text-right font-mono text-zinc-600">&pound;{(item.price * item.quantity).toFixed(2)}</td>
							</tr>
						{/each}
					</tbody>
					<tfoot>
						<tr class="text-primary font-bold bg-blue-50/50">
							<td class="px-4 py-3">Total</td>
							<td class="px-4 py-3 text-right font-mono">
								{data.itemTotals.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0)}
							</td>
							<td class="px-4 py-3 text-right font-mono">&pound;{data.grandTotal.toFixed(2)}</td>
						</tr>
					</tfoot>
				</table>
			</div>
		{/if}
	</section>

	<!-- Per-person breakdown -->
	<section>
		<h2 class="text-xl font-bold text-thai-blue mb-4 border-b border-zinc-200 pb-2">
			Individual Orders
		</h2>
		{#if data.personOrders.length === 0}
			<p class="text-zinc-400">No orders yet.</p>
		{:else}
			<div class="space-y-3">
				{#each data.personOrders as person}
					<details class="card rounded-xl group">
						<summary class="px-4 py-3 cursor-pointer flex justify-between items-center hover:bg-zinc-50 rounded-xl transition-colors duration-200">
							<span class="font-semibold text-zinc-800">{person.name}</span>
							<span class="text-primary font-mono font-semibold">&pound;{person.total.toFixed(2)}</span>
						</summary>
						<div class="px-4 pb-3 border-t border-zinc-100">
							<ul class="mt-2 space-y-1">
								{#each person.items as item}
									<li class="flex justify-between text-sm">
										<span class="text-zinc-600">{item.quantity}x {item.name}</span>
										<span class="text-zinc-500 font-mono">&pound;{(item.price * item.quantity).toFixed(2)}</span>
									</li>
								{/each}
							</ul>
						</div>
					</details>
				{/each}
			</div>
		{/if}
	</section>
</div>
