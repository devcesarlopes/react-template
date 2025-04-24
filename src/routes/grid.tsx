import { createFileRoute } from "@tanstack/react-router";
import {
	Column,
	textEditor,
} from "react-data-grid";
import { CheckboxEditor } from "@/components/CheckboxEditor";
import { DateTimeEditor } from "@/components/DateTimeEditor";
import { MoneyEditor } from "@/components/MoneyEditor";
import { NumberEditor } from "@/components/NumberEditor";
import { RangeEditor } from "@/components/RangeEditor";
import { SelectEditor } from "@/components/SelectEditor";
import { TableDataGrid } from "@/components/TableDataGrid";
import { Row } from "@/types/types";

export const Route = createFileRoute("/grid")({
	component: Grid,
});

function Grid() {
	const initialRows: Row[] = Array.from({ length: 100 }, (_, i) => ({
		id: i,
		title: `Title ${i}`,
		count: i * 100,
		status: ["Open", "Closed", "Pending"][i % 3],
		approved: i % 2 === 0,
		progress: Math.floor(Math.random() * 100),
		scheduledAt: new Date().toISOString(),
		price: parseFloat((Math.random() * 1000).toFixed(2)),
	}));

	const columns: Column<Row>[] = [
		{
			cellClass: "text-center",
			headerCellClass: "text-center",
			key: "title",
			name: "Title",
			renderEditCell: textEditor,
			sortable: true,
			resizable: true,
			draggable: true,
		},
		{
			cellClass: "text-center",
			headerCellClass: "text-center",
			key: "count",
			name: "Count",
			renderEditCell: NumberEditor,
			sortable: true,
			resizable: true,
			draggable: true,
		},
		{
			cellClass: "text-center",
			headerCellClass: "text-center",
			key: "status",
			name: "Status",
			renderEditCell: SelectEditor,
			sortable: true,
			resizable: true,
			draggable: true,
		},
		{
			cellClass: "text-center",
			headerCellClass: "text-center",
			key: "approved",
			name: "Approved",
			renderCell: CheckboxEditor,
			sortable: true,
			resizable: true,
			draggable: true,
		},
		{
			cellClass: "text-center",
			headerCellClass: "text-center",
			key: "progress",
			name: "Progress",
			renderCell: RangeEditor,
			sortable: true,
			resizable: true,
			draggable: true,
		},
		{
			cellClass: "text-center",
			headerCellClass: "text-center",
			key: "scheduledAt",
			name: "Scheduled At",
			renderCell: DateTimeEditor,
			sortable: true,
			resizable: true,
			draggable: true,
		},
		{
			cellClass: "text-center",
			headerCellClass: "text-center",
			key: "price",
			name: "Price",
			renderCell: MoneyEditor,
			sortable: true,
			resizable: true,
			draggable: true,
		},
	];

	return (
		<div className="flex w-full flex-col">
			<div>Hello from Grid!</div>
			<TableDataGrid 
				columns={columns} 
				rows={initialRows} 
				rowKeyGetter={(row) => row.id} 
				newRowDefaultValues={(rows) => ({
					id: rows.length > 0 ? rows[rows.length - 1].id + 1 : 1,
					title: "",
					count: 0,
					status: "Open",
					approved: false,
					progress: 0,
					scheduledAt: new Date().toISOString(),
					price: 0,
				})}
			/>
			<div>Bye from Grid!</div>
		</div>
	);
}
