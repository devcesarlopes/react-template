import { SelectCellFormatter, RenderCellProps } from "react-data-grid";

export function CheckboxEditor<RowType>({
	row,
	column,
	onRowChange,
	tabIndex,
}: RenderCellProps<RowType>) {
	const attribute = column.key as keyof RowType;
	const value = row[attribute] as boolean;

	return (
		<div className="flex h-full w-full items-center justify-center">
			<SelectCellFormatter
				value={value}
				onChange={() => {
					onRowChange({ ...row, [attribute]: !value });
				}}
				tabIndex={tabIndex}
			/>
		</div>
	);
}
