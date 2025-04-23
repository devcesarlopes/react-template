import { RenderEditCellProps } from "react-data-grid";

export function SelectEditor<RowType>({
	row,
	column,
	onRowChange,
	onClose,
}: RenderEditCellProps<RowType>) {
	const options = ["Open", "Closed", "Pending"];
	const value = row[column.key as keyof RowType] as string;

	return (
		<select
			autoFocus
			value={value}
			onChange={(e) => onRowChange({ ...row, [column.key]: e.target.value })}
			onBlur={() => onClose(true)}
			className="rdg-select-editor h-full w-full"
		>
			{options.map((option) => (
				<option key={option} value={option}>
					{option}
				</option>
			))}
		</select>
	);
}
