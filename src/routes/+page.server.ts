import type { Actions, PageServerLoad } from './$types';
import { saveOrder, getOrder } from '$lib/orders';
import { allItems } from '$lib/menu';
import { fail } from '@sveltejs/kit';

function sanitizeName(raw: string): string {
	return raw
		.replace(/[<>&"'/\\]/g, '') // strip HTML/script chars
		.replace(/\s+/g, ' ')       // collapse whitespace
		.trim()
		.slice(0, 50);              // max length
}

export const load: PageServerLoad = async ({ url }) => {
	const rawName = url.searchParams.get('name');
	if (rawName) {
		const name = sanitizeName(rawName);
		const existing = name ? await getOrder(name) : null;
		return { existingOrder: existing };
	}
	return { existingOrder: null };
};

export const actions: Actions = {
	submit: async ({ request }) => {
		const formData = await request.formData();
		const name = sanitizeName(formData.get('name')?.toString() ?? '');

		if (!name) {
			return fail(400, { error: 'Please enter your name' });
		}

		if (name.length < 2) {
			return fail(400, { error: 'Name must be at least 2 characters' });
		}

		const items: { itemId: string; quantity: number }[] = [];
		for (const item of allItems) {
			const raw = parseInt(formData.get(`qty_${item.id}`)?.toString() ?? '0', 10);
			const qty = Number.isNaN(raw) ? 0 : Math.max(0, Math.min(raw, 99));
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
