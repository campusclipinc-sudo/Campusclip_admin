import React, { useMemo, useState, useEffect } from "react";
import TNTable from "../../component/TNTable";
import { useEventTransactionHistory } from "../../hooks/useRQevents";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const STATUS_BADGE = {
  completed: "badge-pill badge-active",
  pending:   "badge-pill badge-warning",
  failed:    "badge-pill badge-inactive",
  refunded:  "badge-pill badge-info",
};

const TYPE_BADGE = {
  event_payment: "badge-pill badge-primary",
  refund:        "badge-pill badge-inactive",
};

const formatDateTime = (dt) => {
  if (!dt) return "-";
  try {
    return new Date(dt).toLocaleString("en-US", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hour12: true,
    });
  } catch {
    return dt;
  }
};

const formatAmount = (amount, currency) => {
  if (!amount) return "-";
  return `${currency || ""} ${parseFloat(amount).toFixed(2)}`.trim();
};

const EventTransactionList = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPageIndex(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const params = useMemo(
    () => ({ page: pageIndex + 1, limit: 10, search: debouncedSearch || undefined }),
    [pageIndex, debouncedSearch]
  );

  const { data, isLoading } = useEventTransactionHistory(params);

  const transactions = data?.data?.transactions || [];
  const pagination = data?.data?.pagination || null;
  const paginationData = pagination
    ? { total: pagination.total, per_page: pagination.limit, last_page: pagination.totalPages }
    : null;

  const columns = useMemo(
    () => [
      {
        accessorKey: "transaction_id",
        header: "Transaction ID",
        cell: ({ getValue }) => (
          <span className="txn-id">{getValue() || "-"}</span>
        ),
      },
      {
        accessorKey: "event_title",
        header: "Event",
        cell: ({ getValue }) => getValue() || "-",
      },
      {
        accessorKey: "attendee_name",
        header: "Attendee",
        cell: ({ getValue }) => getValue() || "-",
      },
      {
        accessorKey: "attendee_email",
        header: "Email",
        cell: ({ getValue }) => getValue() || "-",
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ getValue, row }) => (
          <span style={{ fontWeight: 600 }}>
            {formatAmount(getValue(), row.original.currency)}
          </span>
        ),
      },
      {
        accessorKey: "transaction_type",
        header: "Type",
        cell: ({ getValue }) => {
          const type = getValue();
          return (
            <span className={TYPE_BADGE[type] || "badge-pill badge-info"}>
              {type?.replace("_", " ") || "-"}
            </span>
          );
        },
      },
      {
        accessorKey: "payment_status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue();
          return (
            <span className={STATUS_BADGE[status] || "badge-pill badge-info"}>
              {status || "-"}
            </span>
          );
        },
      },
      {
        accessorKey: "payment_method",
        header: "Method",
        cell: ({ getValue }) => getValue() || "-",
      },
      {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ getValue }) => formatDateTime(getValue()),
      },
    ],
    []
  );

  return (
    <div className="event-transaction-list-page">
      {/* Page Header */}
      <div className="page-header-block">
        <div>
          <h1 className="page-heading">Transactions</h1>
          <p className="page-heading-sub">Event payment & transaction history</p>
        </div>
        <div className="search-wrap" style={{ minWidth: 260 }}>
          <div style={{ position: "relative" }}>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              style={{
                position: "absolute", left: 12, top: "50%",
                transform: "translateY(-50%)", color: "var(--muted)",
                fontSize: "0.8rem", pointerEvents: "none",
              }}
            />
            <input
              type="text"
              className="filter-select"
              placeholder="Search event, attendee, email…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 34 }}
            />
          </div>
        </div>
      </div>

      {isLoading && transactions.length === 0 ? (
        <div className="d-flex justify-content-center py-5">
          <div
            className="spinner-border"
            style={{ color: "#6366f1", width: "2rem", height: "2rem" }}
            role="status"
          />
        </div>
      ) : (
        <TNTable
          columns={columns}
          data={Array.isArray(transactions) ? transactions : []}
          paginationData={paginationData}
          onSelectPage={(p) => setPageIndex(p)}
          idName="admin-events-transaction-history-table"
          pageIndexGet={pageIndex}
        />
      )}
    </div>
  );
};

export default EventTransactionList;
