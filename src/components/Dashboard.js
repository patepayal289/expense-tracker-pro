import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard({ customers }) {
  const totals = useMemo(() => {
    let totalReceived = 0,
      totalGiven = 0;
    customers.forEach((c) => {
      c.transactions.forEach((t) => {
        if (t.amount >= 0) totalReceived += t.amount;
        else totalGiven += Math.abs(t.amount);
      });
    });
    const perCustomer = customers.map((c) => ({
      name: c.name,
      balance: c.transactions.reduce((s, t) => s + t.amount, 0),
    }));
    const allTransactions = customers
      .flatMap((c) =>
        c.transactions.map((t) => ({
          name: c.name,
          ...t,
        }))
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // recent first
    return { totalReceived, totalGiven, perCustomer, allTransactions };
  }, [customers]);

  const data = {
    labels: totals.perCustomer.map((p) => p.name),
    datasets: [
      {
        label: "Balance",
        data: totals.perCustomer.map((p) => p.balance),
        backgroundColor: totals.perCustomer.map((p) =>
          p.balance >= 0 ? "#1cc88a" : "#e74a3b"
        ),
      },
    ],
  };

  const exportReport = () => {
    const rows = [["Customer", "Balance"]];
    totals.perCustomer.forEach((p) => rows.push([p.name, p.balance]));
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "khatabook_summary.csv";
    a.click();
  };

  return (
    <div className="card p-3 shadow-sm mb-3 modern-card">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h5 className="mb-0 fw-semibold">
            <i className="bi bi-bar-chart-line text-primary me-2"></i>
            Dashboard
          </h5>
          <div className="text-muted small">Overview across customers</div>
        </div>
        <button
          className="btn btn-outline-primary btn-sm rounded-pill"
          onClick={exportReport}
        >
          <i className="bi bi-download me-1"></i> Export CSV
        </button>
      </div>

      <div className="d-flex justify-content-between mb-3 text-center">
        <div>
          <small>Total Received</small>
          <div className="text-success fw-bold fs-6">
            ₹{totals.totalReceived.toFixed(2)}
          </div>
        </div>
        <div>
          <small>Total Given</small>
          <div className="text-danger fw-bold fs-6">
            ₹{totals.totalGiven.toFixed(2)}
          </div>
        </div>
        <div>
          <small>Net</small>
          <div className="fw-bold fs-6">
            ₹{(totals.totalReceived - totals.totalGiven).toFixed(2)}
          </div>
        </div>
      </div>

      <div style={{ height: "220px" }} className="mb-3">
        <Bar data={data} />
      </div>

      <h6 className="fw-semibold mt-3 mb-2">
        <i className="bi bi-clock-history me-1"></i> Recent Transactions
      </h6>
      <div
        style={{ maxHeight: "180px", overflowY: "auto" }}
        className="transaction-list"
      >
        {totals.allTransactions.slice(0, 5).map((t, i) => (
          <div
            key={i}
            className="d-flex justify-content-between align-items-center py-2 border-bottom small"
          >
            <div>
              <strong>{t.name}</strong> — {t.note || "No note"}
              <div className="text-muted small">
                {new Date(t.date).toLocaleString()}
              </div>
            </div>
            <div
              className={
                t.amount >= 0 ? "text-success fw-bold" : "text-danger fw-bold"
              }
            >
              {t.amount >= 0 ? "+" : "-"}₹{Math.abs(t.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
