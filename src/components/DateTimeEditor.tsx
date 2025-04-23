import { RenderCellProps } from "react-data-grid";

export function DateTimeEditor<RowType>({
	row,
	column,
	onRowChange,
	tabIndex,
}: RenderCellProps<RowType>) {
	const attribute = column.key as keyof RowType;
	const value = row[attribute] as string;

	return (
		<div className="ml-[-8px] flex h-full w-full">
			<input
				className="h-full w-full bg-transparent"
				type="datetime-local"
				value={value.slice(0, 16)} // Slice to fit input format "YYYY-MM-DDTHH:MM"
				onChange={(e) => {
					onRowChange({ ...row, [attribute]: e.target.value });
				}}
				tabIndex={tabIndex}
			/>
		</div>
	);
}
