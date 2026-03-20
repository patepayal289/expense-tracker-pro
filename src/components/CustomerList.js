import React, { useState } from "react";

export default function CustomerList({ customers, onAdd, onSelect, selectedId, onUpdate, onDelete }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Enter name");
    onAdd({ name: name.trim(), phone: phone.trim() });
    setName("");
    setPhone("");
  };

  return (
    <div className="card p-3 shadow-sm">
      <h5 className="mb-3">Customers</h5>

      <form onSubmit={submit} className="mb-3">
        <div className="mb-2">
          <input value={name} onChange={(e) => setName(e.target.value)} className="form-control" placeholder="Name" />
        </div>
        <div className="mb-2">
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" placeholder="Phone (optional)" />
        </div>
        <button className="btn btn-primary w-100">Add Customer</button>
      </form>

      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {customers.length === 0 && <p className="small-muted">No customers yet</p>}
        <ul className="list-group">
          {customers.map(c => {
            const balance = c.transactions.reduce((s, t) => s + t.amount, 0);
            return (
              <li key={c.id}
                className={`list-group-item d-flex justify-content-between align-items-center customer-item ${selectedId === c.id ? "active" : ""}`}
                onClick={() => onSelect(c.id)}
              >
                <div>
                  <strong>{c.name}</strong>
                  <div className="small-muted">{c.phone}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: balance >= 0 ? "#198754" : "#dc3545", fontWeight: "600" }}>
                    ₹{balance.toFixed(2)}
                  </div>
                  <div className="small-muted">{c.transactions.length} tx</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {customers.length > 0 && (
        <div className="mt-3 d-grid">
          <button className="btn btn-outline-secondary" onClick={() => {
            // quick export all CSV
            const rows = [
              ["Customer", "Tx ID", "Note", "Amount", "Date"]
            ];
            customers.forEach(c => {
              c.transactions.forEach(t => {
                rows.push([c.name, t.id, t.note || "", t.amount, t.date]);
              });
            });
            const csv = rows.map(r => r.map(col => `"${String(col).replace(/"/g,'""')}"`).join(",")).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = "khatabook_all_transactions.csv"; a.click();
            URL.revokeObjectURL(url);
          }}>Export All (CSV)</button>
        </div>
      )}
    </div>
  );
}
