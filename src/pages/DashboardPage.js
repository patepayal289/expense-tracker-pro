import React, { useMemo } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useAppContext } from "../context/AppContext";
import { TrendingUp, TrendingDown, DollarSign, Activity, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

Chart.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function DashboardPage() {
  const { customers, theme } = useAppContext();

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
    })).sort((a,b) => Math.abs(b.balance) - Math.abs(a.balance)).slice(0, 10); // top 10

    const allTransactions = customers
      .flatMap((c) =>
        c.transactions.map((t) => ({
          customerName: c.name,
          customerId: c.id,
          ...t,
        }))
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return { totalReceived, totalGiven, perCustomer, allTransactions };
  }, [customers]);

  const textColor = theme === 'dark' ? '#eee' : '#333';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

  const barData = {
    labels: totals.perCustomer.map((p) => p.name.length > 10 ? p.name.substring(0, 10)+'...' : p.name),
    datasets: [
      {
        label: "Balance",
        data: totals.perCustomer.map((p) => p.balance),
        backgroundColor: totals.perCustomer.map((p) =>
          p.balance >= 0 ? "rgba(34, 197, 94, 0.8)" : "rgba(239, 68, 68, 0.8)"
        ),
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: textColor } },
      tooltip: { 
        backgroundColor: theme === 'dark' ? '#333' : '#fff', 
        titleColor: theme === 'dark' ? '#fff' : '#000', 
        bodyColor: theme === 'dark' ? '#fff' : '#000',
        borderColor: gridColor,
        borderWidth: 1
      }
    },
    scales: {
      x: { ticks: { color: textColor }, grid: { color: gridColor } },
      y: { ticks: { color: textColor }, grid: { color: gridColor } }
    }
  };

  const doughnutData = {
    labels: ["Received", "Pending (Given)"],
    datasets: [
      {
        data: [totals.totalReceived, totals.totalGiven],
        backgroundColor: ["#10b981", "#ef4444"],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("KhataPro Business Report", 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Total Customers: ${customers.length}`, 14, 32);
    doc.text(`Total Received: Rs. ${totals.totalReceived.toFixed(2)}`, 14, 38);
    doc.text(`Total Given: Rs. ${totals.totalGiven.toFixed(2)}`, 14, 44);

    const tableBody = totals.perCustomer.map(c => [
      c.name, 
      c.balance >= 0 ? `+${c.balance.toFixed(2)}` : c.balance.toFixed(2)
    ]);

    autoTable(doc, {
      startY: 50,
      head: [['Customer', 'Net Balance']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }
    });

    doc.save("KhataPro_Report.pdf");
    toast.success("PDF Exported Successfully");
  };

  const netBalance = totals.totalReceived - totals.totalGiven;

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Business Overview</h1>
          <p className="page-subtitle">Track your cashflow and balances in real-time</p>
        </div>
        <button className="btn btn-primary shadow-sm" onClick={exportPDF}>
          <FileText size={18} />
          Export Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon bg-success-light">
            <TrendingUp size={24} className="text-success" />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Total Received</p>
            <h3 className="kpi-value">₹{totals.totalReceived.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon bg-danger-light">
            <TrendingDown size={24} className="text-danger" />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Total Given</p>
            <h3 className="kpi-value">₹{totals.totalGiven.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon bg-primary-light">
            <DollarSign size={24} className="text-primary" />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Net Balance</p>
            <h3 className={`kpi-value ${netBalance >= 0 ? 'text-success' : 'text-danger'}`}>
              ₹{Math.abs(netBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              <span className="net-indicator">{netBalance >= 0 ? 'Surplus' : 'Deficit'}</span>
            </h3>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon bg-warning-light">
            <Activity size={24} className="text-warning" />
          </div>
          <div className="kpi-content">
            <p className="kpi-label">Total Customers</p>
            <h3 className="kpi-value">{customers.length}</h3>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card glass-panel col-span-2">
          <h3 className="card-title">Top Balances</h3>
          <div className="chart-container" style={{ height: '300px' }}>
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>
        <div className="chart-card glass-panel">
          <h3 className="card-title">Cashflow Ratio</h3>
          <div className="chart-container flex-center" style={{ height: '300px' }}>
             {totals.totalGiven === 0 && totals.totalReceived === 0 ? (
               <div className="empty-state-text">No data to display</div>
             ) : (
                <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
             )}
          </div>
        </div>
      </div>

      <div className="recent-activity-card glass-panel mt-4">
        <div className="card-header border-bottom">
          <h3 className="card-title">Recent Activity</h3>
        </div>
        <div className="list-group list-group-flush transaction-list no-bg">
          {totals.allTransactions.length === 0 ? (
            <div className="empty-state p-4 text-center">No recent activity</div>
          ) : (
            totals.allTransactions.slice(0, 6).map((t, i) => (
              <div key={i} className="list-group-item d-flex justify-content-between align-items-center py-3 bg-transparent border-bottom-subtle">
                <div className="d-flex align-items-center gap-3">
                  <div className={`icon-circle ${t.amount >= 0 ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`}>
                    {t.amount >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </div>
                  <div>
                    <h6 className="mb-1 fw-bold">{t.customerName}</h6>
                    <span className="text-muted small">{t.note || "Payment update"} • {t.date}</span>
                  </div>
                </div>
                <div className={`fw-bold fs-5 ${t.amount >= 0 ? 'text-success' : 'text-danger'}`}>
                  {t.amount >= 0 ? '+' : '-'}₹{Math.abs(t.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
