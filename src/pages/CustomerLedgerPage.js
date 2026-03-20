import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, PlusCircle, MinusCircle, FileText, Download, Calendar, ArrowRight, Upload } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

export default function CustomerLedgerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, addTransaction, deleteTransaction } = useAppContext();
  
  const customer = customers.find(c => c.id === id);
  const [entryMode, setEntryMode] = useState(null); // 'given' or 'received' or null
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // YYYY-MM-DD

  if (!customer) {
    return (
      <div className="page-wrapper text-center py-5 mt-5">
        <h2>Customer Not Found</h2>
        <button className="btn btn-outline-primary mt-3" onClick={() => navigate("/customers")}>Go Back</button>
      </div>
    );
  }

  const balance = customer.transactions.reduce((s, t) => s + t.amount, 0);
  const reminderMessage = encodeURIComponent(`Hi ${customer.name}, your current balance with us is ₹${Math.abs(balance).toFixed(2)} (${balance < 0 ? 'Due' : 'Advance'}). Please clear your dues. Thank you!`);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) return toast.error("Enter a valid amount greater than 0");

    const finalAmount = entryMode === 'given' ? -Math.abs(Number(amount)) : Math.abs(Number(amount));
    
    addTransaction(customer.id, {
      amount: finalAmount,
      note: note.trim() || (entryMode === 'given' ? 'Cash Given' : 'Cash Received'),
      date: new Date(date).toLocaleDateString() // Using user-selected date
    });
    
    setAmount("");
    setNote("");
    setEntryMode(null);
  };

  const exportCSV = () => {
    const rows = [["Tx ID", "Description", "Amount", "Date"]];
    customer.transactions.forEach(t => rows.push([t.id, t.note, t.amount, t.date]));
    const csv = rows.map(r => r.map(col => `"${String(col).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${customer.name}_LEDGER.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV Exported successfully!");
  };

  return (
    <div className="page-wrapper animate-slide-up pb-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <Link to="/customers" className="btn btn-light btn-icon rounded-circle d-flex align-items-center justify-content-center" style={{width: 40, height: 40}}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="page-title mb-0">{customer.name}'s Ledger</h1>
            <p className="page-subtitle mb-0">{customer.phone || 'No phone number added'}</p>
          </div>
        </div>
        
        {balance < 0 && customer.phone && (
          <a 
            href={`https://wa.me/${customer.phone.replace(/\D/g,'')}?text=${reminderMessage}`} 
            target="_blank" 
            rel="noreferrer"
            className="btn btn-success d-flex align-items-center gap-2 shadow-sm py-2 px-3 rounded-pill"
          >
            <i className="bi bi-whatsapp"></i> Send Reminder
          </a>
        )}
      </div>

      <div className="row g-4 flex-lg-row-reverse">
        {/* Right side - Entry Action or Form */}
        <div className="col-lg-5">
          <div className="glass-panel p-4 rounded-4 shadow-sm text-center mb-4">
            <h5 className="text-muted fw-semibold mb-3">Net Balance</h5>
            <h1 className={`display-4 fw-bold mb-2 ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
              ₹{Math.abs(balance).toLocaleString(undefined, {minimumFractionDigits: 2})}
            </h1>
            <div className={`d-inline-block fw-medium px-4 py-1 rounded-pill ${balance >= 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
              {balance >= 0 ? 'You will Give' : 'You will Get'}
            </div>
          </div>

          {!entryMode ? (
            <div className="glass-panel p-4 rounded-4 shadow-sm">
              <h5 className="fw-bold mb-4 text-center">Record New Entry</h5>
              <div className="d-grid gap-3">
                <button 
                  className="btn btn-danger btn-lg d-flex justify-content-between align-items-center py-3 shadow-sm rounded-4" 
                  onClick={() => setEntryMode('given')}
                >
                  <div className="d-flex align-items-center gap-3 fw-bold fs-5">
                    <MinusCircle size={24} /> YOU GAVE ₹
                  </div>
                  <ArrowRight size={20} />
                </button>
                <button 
                  className="btn btn-success btn-lg d-flex justify-content-between align-items-center py-3 shadow-sm rounded-4" 
                  onClick={() => setEntryMode('received')}
                >
                  <div className="d-flex align-items-center gap-3 fw-bold fs-5">
                    <PlusCircle size={24} /> YOU GOT ₹
                  </div>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className={`glass-panel p-4 rounded-4 shadow-sm animate-fade-in border-4 ${entryMode === 'given' ? 'border-danger border-top' : 'border-success border-top'}`}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className={`fw-bold mb-0 ${entryMode === 'given' ? 'text-danger' : 'text-success'}`}>
                  {entryMode === 'given' ? 'Recording Payment Given' : 'Recording Payment Got'}
                </h5>
                <button className="btn btn-sm btn-light rounded-pill" onClick={() => setEntryMode(null)}>Cancel</button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3 position-relative">
                  <span className={`position-absolute top-50 start-0 translate-middle-y ms-3 fs-5 fw-bold ${entryMode === 'given' ? 'text-danger' : 'text-success'}`}>₹</span>
                  <input type="number" step="0.01" className={`form-control form-control-lg bg-light-subtle rounded-3 ps-5 fs-4 fw-bold ${entryMode === 'given' ? 'text-danger border-danger-subtle' : 'text-success border-success-subtle'}`} placeholder="Amount" autoFocus value={amount} onChange={e => setAmount(e.target.value)} />
                </div>
                
                <div className="mb-3">
                  <input type="text" className="form-control bg-light-subtle rounded-3" placeholder={entryMode === 'given' ? "ItemDetails or Bill No" : "Payment details or description"} value={note} onChange={e => setNote(e.target.value)} />
                </div>
                
                <div className="row g-2 mb-4">
                  <div className="col-6">
                    <div className="input-group">
                      <span className="input-group-text bg-light-subtle border-end-0"><Calendar size={18} className="text-muted"/></span>
                      <input type="date" className="form-control bg-light-subtle border-start-0 ps-0" value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-6">
                     <button type="button" className="btn btn-light w-100 d-flex align-items-center justify-content-center gap-2 border text-muted"> <Upload size={16} /> Attach Bill</button>
                  </div>
                </div>
                
                <button type="submit" className={`w-100 btn btn-lg py-3 shadow-sm rounded-pill fw-bold fs-5 ${entryMode === 'given' ? 'btn-danger' : 'btn-success'}`}>
                  SAVE
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Left side - Transactions List */}
        <div className="col-lg-7">
          <div className="glass-panel p-0 rounded-4 shadow-sm h-100 overflow-hidden d-flex flex-column">
            <div className="p-4 border-bottom bg-light-subtle d-flex justify-content-between align-items-center">
              <h5 className="fw-bold mb-0"><FileText size={20} className="me-2 text-primary d-inline" /> Transaction History</h5>
              <div className="d-flex align-items-center gap-3">
                <span className="text-muted small">{customer.transactions.length} entries</span>
                <button className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2" onClick={exportCSV}>
                  <Download size={14} /> PDF/CSV
                </button>
              </div>
            </div>
            
            <div className="ledger-timeline flex-grow-1 p-4" style={{minHeight: '400px', maxHeight: '600px', overflowY: 'auto'}}>
              {customer.transactions.length === 0 ? (
                <div className="flex-center flex-column text-muted py-5 text-center mt-4">
                  <FileText size={48} className="opacity-25 mb-3" />
                  <h5>No transactions yet</h5>
                  <p className="small mb-0">Tap the red or green button to record your first entry.</p>
                </div>
              ) : (
                <div className="timeline-wrapper position-relative ps-4 ms-2 border-start border-2 border-primary-subtle">
                  {customer.transactions.map((t) => (
                    <div key={t.id} className="position-relative mb-4 ps-4 pb-2">
                       <div className="position-absolute top-50 start-0 translate-middle" style={{ marginTop: '-4px' }}>
                          <div className={`rounded-circle shadow-sm border border-2 border-white d-flex align-items-center justify-content-center`} 
                               style={{width: 28, height: 28, background: t.amount >= 0 ? '#10b981' : '#ef4444'}}>
                             <FileText size={12} className="text-white" />
                          </div>
                      </div>
                      
                      <div className="card border-0 bg-transparent mb-0">
                        <div className="card-body p-0 d-flex justify-content-between">
                          <div>
                            <span className="badge bg-light text-muted border mb-2 fw-medium px-2 py-1"><Calendar size={12} className="me-1 d-inline mb-1" />{t.date}</span>
                            <strong className="d-block f-15 mb-1">{t.note}</strong>
                            <div className="f-12 text-muted">Balance Entry</div>
                          </div>
                          <div className="text-end bg-surface p-3 rounded-3 shadow-sm" style={{minWidth: '130px', border: '1px solid var(--border-color)'}}>
                            <span className={`fw-bold d-block fs-5 ${t.amount >= 0 ? 'text-success' : 'text-danger'}`}>
                              {t.amount >= 0 ? '+' : '-'}₹{Math.abs(t.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                            </span>
                            <button className="btn btn-link text-muted p-0 f-12 text-decoration-none mt-2 hover-danger" onClick={() => {
                              if(window.confirm('Delete this entry?')) deleteTransaction(customer.id, t.id);
                            }}>Delete</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
