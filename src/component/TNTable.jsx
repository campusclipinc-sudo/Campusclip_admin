import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import PropTypes from "prop-types";
import "../scss/TNTable.scss";

const initialState = { queryPageIndex: 0 };
const PAGE_CHANGED = "PAGE_CHANGED";
const reducer = (state, { type, payload }) => {
  switch (type) {
    case PAGE_CHANGED:
      return { ...state, queryPageIndex: payload };
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};

function TNTable({
  columns,
  data,
  paginationData,
  onSelectPage,
  idName = "",
  pageIndexGet = 0,
}) {
  initialState.queryPageIndex = pageIndexGet;
  const [{ queryPageIndex }, dispatch] = React.useReducer(
    reducer,
    initialState
  );

  const tableInstance = useReactTable({
    columns,
    data,
    initialState: { pagination: { pageIndex: queryPageIndex } },
    autoResetFilters: false,
    manualPagination: true,
    pageCount: paginationData ? paginationData.last_page : 1,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const {
    getHeaderGroups,
    getRowModel,
    getCanPreviousPage,
    getCanNextPage,
    setPageIndex,
    nextPage,
    previousPage,
    getPageCount,
    getState,
  } = tableInstance;

  const pageIndex = getState().pagination?.pageIndex || 0;
  const rows = getRowModel().rows;
  const firstPageRows = rows ? rows.slice(0, 20) : [];

  React.useEffect(() => {
    if (pageIndex !== undefined) {
      onSelectPage(pageIndex);
      dispatch({ type: PAGE_CHANGED, payload: pageIndex });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  return (
    <div className="tn-table-container">
      <div className="tn-table-card">
        <div className="tn-table-wrapper">
          <table className="tn-table" id={idName}>
            <thead className="tn-table-header">
              {getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(({ column, id }) => {
                    const isSorted = column.getIsSorted();
                    return (
                      <th key={id} className="tn-table-header-cell">
                        <div className="tn-table-header-content">
                          {flexRender(column.columnDef.header, column)}
                          {isSorted && (
                            <span className="tn-table-sort-icon">
                              {isSorted === "desc" ? "↓" : "↑"}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="tn-table-body">
              {firstPageRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="tn-table-empty">
                    <div className="tn-table-empty-content">
                      <span>No data found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                firstPageRows.map((row) => (
                  <tr key={row.id} className="tn-table-row">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="tn-table-cell">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {paginationData &&
          Number(paginationData.total) > Number(paginationData.per_page) && (
            <div className="tn-table-pagination">
              <div className="tn-table-pagination-content">
                <button
                  className="tn-table-pagination-btn"
                  onClick={() => setPageIndex(0)}
                  disabled={!getCanPreviousPage()}
                  aria-label="First page"
                >
                  {"<<"}
                </button>
                <button
                  className="tn-table-pagination-btn"
                  onClick={() => previousPage()}
                  disabled={!getCanPreviousPage()}
                  aria-label="Previous page"
                >
                  {"<"}
                </button>
                <div className="tn-table-pagination-info">
                  <span>
                    Page <strong>{pageIndex + 1}</strong> of{" "}
                    <strong>{getPageCount()}</strong>
                  </span>
                </div>
                <button
                  className="tn-table-pagination-btn"
                  onClick={() => nextPage()}
                  disabled={!getCanNextPage()}
                  aria-label="Next page"
                >
                  {">"}
                </button>
                <button
                  className="tn-table-pagination-btn"
                  onClick={() => setPageIndex(getPageCount() - 1)}
                  disabled={!getCanNextPage()}
                  aria-label="Last page"
                >
                  {">>"}
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

TNTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  paginationData: PropTypes.object,
  idName: PropTypes.string,
  onSelectPage: PropTypes.func.isRequired,
  pageIndexGet: PropTypes.number,
};

export default TNTable;
