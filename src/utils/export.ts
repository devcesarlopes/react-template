import { ColumnOrColumnGroup } from "react-data-grid";

export function exportRowsToCsv<R, SR>(
	rows: readonly R[],
	columns: readonly ColumnOrColumnGroup<R, SR>[],
	fileName: string,
) {
	const flatColumns = columns.filter(isColumn); // ✅ Filter only columns

	const headers = flatColumns
    .filter((col) => col.key !== "select" && col.key !== "index")
    .map((col) => col.name || col.key);

	const csvContent = [
		headers.join(","), // header row
		...rows.map((row) => {
			return flatColumns
				.filter((col) => col.key !== "select" && col.key !== "index")
				.map((col) => serialiseCellValue(row[col.key as keyof R]))
				.join(",");
		}),
	].join("\n");

	downloadFile(
		fileName,
		new Blob([csvContent], { type: "text/csv;charset=utf-8;" }),
	);
}

function isColumn<R, SR>(
  col: ColumnOrColumnGroup<R, SR>
): col is ColumnOrColumnGroup<R, SR> & { key: keyof R } {
  return "key" in col;
}

function serialiseCellValue(value: unknown) {
	if (typeof value === "string") {
		const formattedValue = value.replace(/"/g, "\"\"");
		return formattedValue.includes(",")
			? `"${formattedValue}"`
			: formattedValue;
	}
	return value;
}

function downloadFile(fileName: string, data: Blob) {
	const downloadLink = document.createElement("a");
	downloadLink.download = fileName;
	const url = URL.createObjectURL(data);
	downloadLink.href = url;
	downloadLink.click();
	URL.revokeObjectURL(url);
}
