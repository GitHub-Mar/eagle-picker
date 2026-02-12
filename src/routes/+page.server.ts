import type { Actions, PageServerLoad } from './$types';
import { saveOrder, getOrder } from '$lib/orders';
import { allItems } from '$lib/menu';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url }) => {
	const name = url.searchParams.get('name');
	if (name) {
		const existing = await getOrder(name);
		return { existingOrder: existing };
	}
	return { existingOrder: null };
};

export const actions: Actions = {
	submit: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();

		if (!name) {
			return fail(400, { error: 'Please enter your name' });
		}

		const items: { itemId: string; quantity: number }[] = [];
		for (const item of allItems) {
			const qty = parseInt(formData.get(`qty_${item.id}`)?.toString() ?? '0', 10);
			if (qty > 0) {
				items.push({ itemId: item.id, quantity: qty });
			}
		}

		if (items.length === 0) {
			return fail(400, { error: 'Please select at least one item' });
		}

		await saveOrder({
			name,
			items,
			updatedAt: new Date().toISOString()
		});

		return { success: true, name };
	}
};
