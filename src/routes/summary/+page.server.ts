import type { PageServerLoad } from './$types';
import { getAllOrders } from '$lib/orders';
import { getItemById } from '$lib/menu';

export const load: PageServerLoad = async () => {
	const orders = await getAllOrders();

	// Aggregate totals per item
	const itemTotals: Record<string, { name: string; price: number; quantity: number }> = {};
	for (const order of orders) {
		for (const orderItem of order.items) {
			const menuItem = getItemById(orderItem.itemId);
			if (!menuItem) continue;
			if (!itemTotals[orderItem.itemId]) {
				itemTotals[orderItem.itemId] = {
					name: menuItem.name,
					price: menuItem.price,
					quantity: 0
				};
			}
			itemTotals[orderItem.itemId].quantity += orderItem.quantity;
		}
	}

	// Per-person orders with item names resolved
	const personOrders = orders.map((order) => ({
		name: order.name,
		updatedAt: order.updatedAt,
		items: order.items
			.map((oi) => {
				const menuItem = getItemById(oi.itemId);
				return menuItem
					? { name: menuItem.name, price: menuItem.price, quantity: oi.quantity }
					: null;
			})
			.filter(Boolean) as { name: string; price: number; quantity: number }[],
		total: order.items.reduce((sum, oi) => {
			const menuItem = getItemById(oi.itemId);
			return sum + (menuItem ? menuItem.price * oi.quantity : 0);
		}, 0)
	}));

	const grandTotal = personOrders.reduce((sum, p) => sum + p.total, 0);

	return {
		itemTotals: Object.values(itemTotals).sort((a, b) => b.quantity - a.quantity),
		personOrders: personOrders.sort((a, b) => a.name.localeCompare(b.name)),
		grandTotal,
		orderCount: orders.length
	};
};
