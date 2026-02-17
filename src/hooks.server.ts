import { initDb } from '$lib/orders';

// Create the orders table if it doesn't exist on server start
await initDb();
