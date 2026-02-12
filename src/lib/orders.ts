import { getStore } from '@netlify/blobs';
import { dev } from '$app/environment';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface OrderItem {
	itemId: string;
	quantity: number;
}

export interface Order {
	name: string;
	items: OrderItem[];
	updatedAt: string;
}

const LOCAL_FILE = join(process.cwd(), '.orders.json');

function readLocal(): Record<string, Order> {
	if (!existsSync(LOCAL_FILE)) return {};
	try {
		return JSON.parse(readFileSync(LOCAL_FILE, 'utf-8'));
	} catch {
		return {};
	}
}

function writeLocal(data: Record<string, Order>): void {
	writeFileSync(LOCAL_FILE, JSON.stringify(data, null, 2));
}

export async function saveOrder(order: Order): Promise<void> {
	if (dev) {
		const data = readLocal();
		data[order.name] = order;
		writeLocal(data);
		return;
	}

	const store = getStore('orders');
	await store.setJSON(order.name, order);
}

export async function getOrder(name: string): Promise<Order | null> {
	if (dev) {
		const data = readLocal();
		return data[name] ?? null;
	}

	const store = getStore('orders');
	try {
		return await store.get(name, { type: 'json' }) as Order | null;
	} catch {
		return null;
	}
}

export async function getAllOrders(): Promise<Order[]> {
	if (dev) {
		const data = readLocal();
		return Object.values(data);
	}

	const store = getStore('orders');
	const { blobs } = await store.list();
	const orders: Order[] = [];
	for (const blob of blobs) {
		const order = await store.get(blob.key, { type: 'json' }) as Order;
		if (order) orders.push(order);
	}
	return orders;
}

export async function deleteOrder(name: string): Promise<void> {
	if (dev) {
		const data = readLocal();
		delete data[name];
		writeLocal(data);
		return;
	}

	const store = getStore('orders');
	await store.delete(name);
}
