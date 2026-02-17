import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from '$env/static/private';

export interface OrderItem {
	itemId: string;
	quantity: number;
}

export interface Order {
	name: string;
	items: OrderItem[];
	updatedAt: string;
}

function sql() {
	return neon(DATABASE_URL);
}

export async function initDb(): Promise<void> {
	const db = sql();
	await db`
		CREATE TABLE IF NOT EXISTS orders (
			name TEXT PRIMARY KEY,
			items JSONB NOT NULL,
			updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		)
	`;
}

export async function saveOrder(order: Order): Promise<void> {
	const db = sql();
	await db`
		INSERT INTO orders (name, items, updated_at)
		VALUES (${order.name}, ${JSON.stringify(order.items)}, ${order.updatedAt})
		ON CONFLICT (name) DO UPDATE
		SET items = ${JSON.stringify(order.items)}, updated_at = ${order.updatedAt}
	`;
}

export async function getOrder(name: string): Promise<Order | null> {
	const db = sql();
	const rows = await db`
		SELECT name, items, updated_at FROM orders WHERE name = ${name}
	`;
	if (rows.length === 0) return null;
	const row = rows[0];
	return {
		name: row.name,
		items: row.items as OrderItem[],
		updatedAt: row.updated_at
	};
}

export async function getAllOrders(): Promise<Order[]> {
	const db = sql();
	const rows = await db`
		SELECT name, items, updated_at FROM orders ORDER BY name
	`;
	return rows.map((row) => ({
		name: row.name,
		items: row.items as OrderItem[],
		updatedAt: row.updated_at
	}));
}

export async function deleteOrder(name: string): Promise<void> {
	const db = sql();
	await db`DELETE FROM orders WHERE name = ${name}`;
}
