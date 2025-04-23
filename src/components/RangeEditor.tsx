import { RenderCellProps } from "react-data-grid";

export function RangeEditor<RowType>({
	row,
	column,
	onRowChange,
	tabIndex,
}: RenderCellProps<RowType>) {
	const attribute = column.key as keyof RowType;
	const value = row[attribute] as number;

	return (
		<div className="flex w-full items-center gap-2 px-2">
			<input
				className="w-[90%] accent-blue-400"
				type="range"
				min={0}
				max={100}
				value={value}
				onChange={(e) => {
					onRowChange({ ...row, [attribute]: Number(e.target.value) });
				}}
				tabIndex={tabIndex}
			/>
			<span className="w-[30px] text-right text-xs text-black">
				{row[attribute] as number}%
			</span>
		</div>
	);
}
