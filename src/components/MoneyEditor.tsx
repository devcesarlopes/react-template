import { useRef, useEffect, useState } from "react";
import { RenderCellProps } from "react-data-grid";

export function MoneyEditor<RowType>({
	row,
	column,
	onRowChange,
	tabIndex,
}: RenderCellProps<RowType>) {
	const ref = useRef<HTMLInputElement>(null);
	const key = column.key as keyof RowType;
	const initialValue = (row[key] as number) * 100; // work with cents internally
	const [cents, setCents] = useState<number>(Math.round(initialValue));

	useEffect(() => {
		if (tabIndex === 0) {
			ref.current?.focus();
		}
	}, [tabIndex]);

	const displayValue = (cents / 100).toFixed(2);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value.replace(/\D/g, ""); // Remove non-digits
		const numericValue = parseInt(rawValue || "0", 10); // Handle empty input as 0
		setCents(numericValue);
		onRowChange({ ...row, [key]: numericValue / 100 });
	};

	return (
		<div className="flex h-full w-full flex-row items-center">
			<span>R$</span>
			<input
				ref={ref}
				type="text"
				value={displayValue}
				onChange={handleChange}
				tabIndex={tabIndex}
				className="rdg-text-editor h-full w-full text-right"
			/>
		</div>
	);
}
