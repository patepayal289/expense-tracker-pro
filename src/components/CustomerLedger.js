import React, { useMemo, useState } from "react";
import TransactionForm from "./TransactionForm";

export default function CustomerLedger({ customer, onAddTx, onDeleteTx, onUpdateCustomer }) {
  const [showAll, setShowAll] = useState(true);

  const balance = useMemo(
    () => customer.transactions.reduce((s, t) => s + t.amount, 0),
    [customer]
  );

  const exportCustomerCSV = () => {
    const rows = [["Tx ID", "Note", "Amount", "Date"]];
    customer.transactions.forEach(t =>
      rows.push([t.id, t.note || "", t.amount, t.date])
    );
    const csv = rows
      .map(r => r.map(col => `"${String(col).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${customer.name.replace(/\s+/g, "_")}_transactions.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (txId) => {
    if (window.confirm("Delete this transaction?")) {
      onDeleteTx(txId);
    }
  };

  return (
    <div
      className="p-4 shadow-sm rounded-4"
      style={{
        background: "#fff",
        border: "1px solid #eee",
        maxWidth: "550px",
        margin: "auto",
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h4 className="fw-bold mb-0">{customer.name}</h4>
          <div className="text-muted small">{customer.phone || "No phone"}</div>
        </div>
        <div className="text-end">
          <div className="small text-muted">Balance</div>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: balance >= 0 ? "#0aad3d" : "#e63946",
            }}
          >
            ₹{balance.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="d-flex gap-2 mb-4">
        <button
          className="btn btn-sm"
          style={{
            background: "#e3f2fd",
            color: "#1976d2",
            borderRadius: "10px",
          }}
          onClick={() => setShowAll((s) => !s)}
        >
          {showAll ? "Show Recent" : "Show All"}
        </button>

        <button
          className="btn btn-sm"
          style={{
            background: "#e8f5e9",
            color: "#2e7d32",
            borderRadius: "10px",
          }}
          onClick={exportCustomerCSV}
        >
          <i className="bi bi-download"></i> Export
        </button>

        <button
          className="btn btn-sm"
          style={{
            background: "#fff3cd",
            color: "#856404",
            borderRadius: "10px",
          }}
          onClick={() => onUpdateCustomer({ note: customer.note || "" })}
        >
          <i className="bi bi-pencil"></i> Edit
        </button>
      </div>

      {/* Add Transaction */}
      <div className="mb-4">
        <TransactionForm onAdd={(tx) => onAddTx(tx)} />
      </div>

      {/* Transactions */}
      <div style={{ maxHeight: "350px", overflowY: "auto" }}>
        {customer.transactions.length === 0 && (
          <p className="text-muted small text-center mb-0">No transactions yet</p>
        )}
        <ul className="list-group border-0">
          {(showAll
            ? customer.transactions
            : customer.transactions.slice(0, 10)
          ).map((t) => (
            <li
              className="list-group-item border-0 mb-2 rounded-3 shadow-sm"
              key={t.id}
              style={{
                background: "#fafafa",
                padding: "12px 16px",
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{t.note || (t.amount >= 0 ? "Received" : "Given")}</strong>
                  <div className="small text-muted">{t.date}</div>
                </div>
                <div className="text-end">
                  <div
                    style={{
                      color: t.amount >= 0 ? "#0aad3d" : "#e63946",
                      fontWeight: 700,
                      fontSize: "1rem",
                    }}
                  >
                    ₹{t.amount.toFixed(2)}
                  </div>
                  <button
                    className="btn btn-outline-danger btn-sm mt-2 rounded-pill"
                    onClick={() => handleDelete(t.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
