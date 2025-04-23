export type Row = {
	id: number;
	title: string;
	count: number;
	status: string;
	approved: boolean;
	progress: number; // 0 - 100
	scheduledAt: string; // ISO string
	price: number;
};
