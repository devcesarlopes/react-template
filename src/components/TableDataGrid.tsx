import { useRef, useState } from "react";
import { ColumnOrColumnGroup, DataGrid, DataGridHandle, DataGridProps, RowsChangeData, SortColumn } from "react-data-grid";
import { exportRowsToCsv } from "@/utils/export";

function isColumn<R, SR>(
  col: ColumnOrColumnGroup<R, SR>
): col is ColumnOrColumnGroup<R, SR> & { key: keyof R } {
  return "key" in col && !("children" in col); // Exclude ColumnGroup
}

const selectCell = <R, _K>({
  row,
  selectedRows,
  setSelectedRows,
  rowKeyGetter
}:{
  row: R;
  selectedRows: Set<React.Key>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<React.Key>>>;
  rowKeyGetter: (row: R) => React.Key;
}) => {
  const key = rowKeyGetter(row);
  const isSelected = selectedRows.has(key);
  return (
    <div className="flex h-full w-full items-center justify-center">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => {
          const newSelection = new Set(selectedRows);
          if (e.target.checked) {
            newSelection.add(key);
          } else {
            newSelection.delete(key);
          }
          setSelectedRows(newSelection);
        }}
        className="mx-auto"
      />
    </div>
  );
};

const indexCell = ({rowIdx}: { rowIdx: number }) => {
  return <span>{rowIdx}</span>;
};

export declare interface TableDataGridProps<R, SR = unknown, K extends React.Key = React.Key> extends DataGridProps<R, SR, K> {
  rowKeyGetter: (row: NoInfer<R>) => K;
  newRowDefaultValues: (rows: readonly R[]) => NoInfer<R>;
}

export const TableDataGrid = <R, SR = unknown, K extends React.Key = React.Key>(
  props: TableDataGridProps<R, SR, K>
) => {  
  const gridRef = useRef<DataGridHandle>(null);
	const [rows, setRows] = useState(props.rows);
	const [selectionMode, setSelectionMode] = useState(false);
	const [selectedRows, setSelectedRows] = useState<Set<React.Key>>(new Set());
	const [sortColumns, setSortColumns] = useState<SortColumn[]>([]);
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [matchedCells, setMatchedCells] = useState<{ rowIdx: number; colIdx: number }[]>([]);
	const [currentMatchIdx, setCurrentMatchIdx] = useState(0);

	const indexColumn: ColumnOrColumnGroup<NoInfer<R>, NoInfer<SR>> = selectionMode
		? {
				key: "select",
				name: "",
				width: 50,
				resizable: false,
				sortable: false,
				frozen: true,
				renderCell: ({ row }) => selectCell({
          row: row, 
          selectedRows: selectedRows, 
          setSelectedRows: setSelectedRows, 
          rowKeyGetter: props.rowKeyGetter
        }),
			}
		: {
				key: "index",
				name: "#",
				width: 50,
				cellClass: "text-center",
				headerCellClass: "text-center",
				resizable: false,
				sortable: false,
				frozen: true,
				renderCell: indexCell,
			};

  const columnWithIndex = [indexColumn, ...props.columns];

	const sortedRows =
		sortColumns.length === 0
			? rows
			: [...rows].sort((a, b) => {
					for (const sort of sortColumns) {
						const { columnKey, direction } = sort;
						const aVal = a[columnKey as keyof R];
						const bVal = b[columnKey as keyof R];
						const cmp = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
						if (cmp !== 0) return direction === "ASC" ? cmp : -cmp;
					}
					return 0;
				});

	const handleRowsChange = (
		updatedRows: NoInfer<R>[],
		{ indexes }: RowsChangeData<NoInfer<R>, NoInfer<SR>>,
	) => {
		const nextRows = [...rows];
		for (const index of indexes) {
			nextRows[index] = updatedRows[index];
		}
		console.log(nextRows);
		setRows(nextRows);
	};

	// Add new row with default values
	const handleAddRow = () => {
    const newRow = props.newRowDefaultValues(rows);
		setRows([...rows, newRow]);
		setTimeout(() => {
			if (gridRef.current) {
				gridRef.current.scrollToCell({ idx: 0, rowIdx: rows.length });
			}
		}, 200);
	};

	const toggleSelectionMode = () => {
		if (selectionMode) {
			setSelectedRows(new Set()); // Clear selections
		}
		setSelectionMode(!selectionMode);
	};

	// Delete selected rows
	const handleDeleteRows = () => {  
		const filteredRows = rows.filter((row) => !selectedRows.has(props.rowKeyGetter(row)));
		setRows(filteredRows);
		setSelectedRows(new Set());
	};

	// Search
	const toggleOpenSearch = () => {
		setSearchOpen(!searchOpen);
		setSearchTerm("");
		setMatchedCells([]);
		setCurrentMatchIdx(-1);
	};
	
	const handleSearch = (term: string) => {
		setSearchTerm(term);
		const matches: { rowIdx: number; colIdx: number }[] = [];

		if (term === "") {
			// Reset everything if search is cleared
			setMatchedCells([]);
			setCurrentMatchIdx(-1);
			return;
		}
	
		rows.forEach((row, rowIdx) => {
			props.columns.filter(col => isColumn(col)).forEach((col, colIdx) => {
				const cellValue = row[col.key as keyof R];
				if (typeof cellValue === "string" &&
						cellValue.toLowerCase().includes(term.toLowerCase())) {
					matches.push({ rowIdx, colIdx: colIdx + 1 }); // +1 for indexColumn
				}
			});
		});
	
		setMatchedCells(matches);
		setCurrentMatchIdx(-1); // Reset to the first match, but don't scroll
	};

	const scrollToMatch = (direction: "up" | "down") => {
		if (matchedCells.length === 0) return;
	
		let nextIdx = currentMatchIdx;
	
		if (direction === "down") {
			nextIdx = (currentMatchIdx + 1) % matchedCells.length;
		} else {
			nextIdx = (currentMatchIdx - 1 + matchedCells.length) % matchedCells.length;
		}
	
		setCurrentMatchIdx(nextIdx);
	
		if (gridRef.current) {
			gridRef.current.scrollToCell(matchedCells[nextIdx]);
		}
	};

	const highlightClass = (rowIdx: number, colIdx: number) => {
		if (matchedCells.length === 0) return "";
		return matchedCells.some(match => match.rowIdx === rowIdx && match.colIdx === colIdx)
			? "bg-red-200"
			: "";
	};
	
	const enhancedColumns = columnWithIndex.map((col, colIdx) =>
		isColumn(col)
			? {
					...col,
					cellClass: (row: R) => {
						const rowIdx = rows.findIndex(r => props.rowKeyGetter(r) === props.rowKeyGetter(row));
						const highlight = highlightClass(rowIdx, colIdx);
						return highlight;
					}
				}
			: col
	);

	return (
		<div className="flex w-full flex-col overflow-x-auto relative">
			<div className="flex gap-2 p-2">
				<button
					onClick={handleAddRow}
					className="rounded bg-blue-500 px-3 py-1 text-white"
				>
					Add Row
				</button>
				<button
					onClick={toggleSelectionMode}
					className="rounded bg-blue-500 px-3 py-1 text-white"
				>
					{selectionMode ? "Deselect Rows" : "Select Rows"}
				</button>
				{selectionMode && selectedRows.size > 0 && (
					<button
						onClick={handleDeleteRows}
						className="rounded bg-red-500 px-3 py-1 text-white"
					>
						Delete Selected
					</button>
				)}
				<button
					onClick={() => exportRowsToCsv(rows, props.columns, "export.csv")}
					className="rounded bg-blue-500 px-3 py-1 text-white"
				>
					Export to CSV
				</button>
				<button
					onClick={toggleOpenSearch}
					className="rounded bg-blue-500 px-3 py-1 text-white"
				>
					Search
				</button>
			</div>
			{searchOpen && (
				<div className="absolute top-[-48] left-10 bg-white p-2 shadow-md border z-50">
					<div className="flex justify-between items-center">
						<span className="text-xs">
							{matchedCells.length > 0 
								? currentMatchIdx >= 0 
									? `${currentMatchIdx + 1} of ${matchedCells.length} results`
									: `${matchedCells.length} results`
								: "Type to Search"}
						</span>
						<div className="flex gap-1">
							<button onClick={() => scrollToMatch("up")}>&uarr;</button>
							<button onClick={() => scrollToMatch("down")}>&darr;</button>
							<button onClick={toggleOpenSearch} className="text-black text-xl pb-1">&times;</button>
						</div>
					</div>
					<input
						type="text"
						placeholder="Search..."
						value={searchTerm}
						onChange={(e) => handleSearch(e.target.value)}
						className="border p-1 text-sm"
					/>
				</div>
			)}
			<div className="min-w-[1000px]">
				<DataGrid
					ref={gridRef}
					className="rdg-light"
					sortColumns={sortColumns}
          {...props}
          rows={sortedRows}
          columns={enhancedColumns}
					onRowsChange={handleRowsChange}
					onSortColumnsChange={setSortColumns}
				/>
			</div>
		</div>
	);
};