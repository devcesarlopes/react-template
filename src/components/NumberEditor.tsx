import { useRef, useEffect } from "react";
import { RenderEditCellProps } from "react-data-grid";

export function NumberEditor<RowType>({
	row,
	column,
	onRowChange,
	onClose,
}: RenderEditCellProps<RowType>) {
	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		ref.current?.focus();
	}, []);

	const value = row[column.key as keyof RowType] as number;

	return (
		<input
			ref={ref}
			type="number"
			value={value}
			onChange={(e) => {
				const newValue = Number(e.target.value);
				if (!isNaN(newValue)) {
					onRowChange({ ...row, [column.key]: newValue });
				}
			}}
			onBlur={() => onClose(true)}
			className="rdg-text-editor h-full w-full"
		/>
	);
}
