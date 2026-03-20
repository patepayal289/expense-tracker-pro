import React, { useState } from "react";
import { ArrowLeft, HelpCircle, ArrowRight, MinusCircle, PlusCircle, ArrowDown, FileText } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export default function CashbookPage() {
  const { cashbook, addCashbookEntry, deleteCashbookEntry } = useAppContext();
  const [entryMode, setEntryMode] = useState(null); // 'in' or 'out'
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const cashInHand = cashbook.reduce((s, t) => s + t.amount, 0);
  
  // Todays Balance calculation
  const todayStr = new Date().toLocaleDateString();
  const todaysEntries = cashbook.filter(t => new Date(t.date).toLocaleDateString() === todayStr);
  const todaysBalance = todaysEntries.reduce((s, t) => s + t.amount, 0);
  const todayIn = todaysEntries.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const todayOut = todaysEntries.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const todayEntryCount = todaysEntries.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) return alert("Enter valid amount");

    const finalAmount = entryMode === 'out' ? -Math.abs(Number(amount)) : Math.abs(Number(amount));
    addCashbookEntry({
      amount: finalAmount,
      note: note.trim() || (entryMode === 'out' ? "Cash Out" : "Cash In"),
      date: new Date(date).toISOString()
    });
    
    setAmount("");
    setNote("");
    setEntryMode(null);
  };

  if (entryMode) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100 p-3">
        <div className={`glass-panel p-4 rounded-4 shadow-sm animate-fade-in w-100 border-top border-4 ${entryMode === 'out' ? 'border-danger' : 'border-success'}`} style={{maxWidth: '500px'}}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className={`fw-bold mb-0 ${entryMode === 'out' ? 'text-danger' : 'text-success'}`}>
              {entryMode === 'out' ? 'Add Cash Out Entry' : 'Add Cash In Entry'}
            </h5>
            <button className="btn btn-sm btn-light rounded-pill px-3" onClick={() => setEntryMode(null)}>Back</button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3 position-relative">
              <span className={`position-absolute top-50 start-0 translate-middle-y ms-3 fs-3 fw-bold ${entryMode === 'out' ? 'text-danger' : 'text-success'}`}>₹</span>
              <input type="number" step="0.01" className={`form-control form-control-lg bg-light-subtle rounded-3 ps-5 fs-2 fw-bold ${entryMode === 'out' ? 'text-danger border-danger-subtle' : 'text-success border-success-subtle'}`} style={{height: 70}} placeholder="0" autoFocus value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            
            <div className="mb-3">
              <input type="text" className="form-control form-control-lg bg-light-subtle rounded-3" placeholder="Remark / Details" value={note} onChange={e => setNote(e.target.value)} />
            </div>
            
            <div className="mb-4">
              <label className="form-label small fw-semibold">Date</label>
              <input type="date" className="form-control form-control-lg bg-light-subtle rounded-3" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            
            <button type="submit" className={`w-100 btn btn-lg py-3 shadow-sm rounded-pill fw-bold fs-5 ${entryMode === 'out' ? 'btn-danger' : 'btn-success'}`}>
              SAVE
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center animate-fade-in">
      <div className="bg-surface position-relative shadow-lg" style={{width: '100%', maxWidth: '480px', height: 'calc(100vh - 72px)', overflowY: 'auto', display: 'flex', flexDirection: 'column'}}>
        
        {/* App-like Blue Header */}
        <div style={{ backgroundColor: '#0752a7', color: 'white', padding: '16px', paddingTop: '20px', paddingBottom: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
           <div className="d-flex align-items-center gap-3">
              <ArrowLeft size={24} style={{cursor: 'pointer'}} onClick={() => window.history.back()} />
              <h5 className="mb-0 fw-semibold text-white">Cashbook</h5>
           </div>
           <HelpCircle size={22} />
        </div>

        {/* Stats Card Overlapping */}
        <div style={{ padding: '0 16px', marginTop: '-50px', position: 'relative', zIndex: 2 }}>
           <div className="bg-white rounded-3 shadow-sm overflow-hidden border">
              <div className="d-flex text-center py-3">
                 <div className="flex-fill border-end px-2">
                    <h3 className="mb-0 fw-bold" style={{color: '#10b981'}}>₹{(cashInHand).toLocaleString()}</h3>
                    <div className="small text-muted mt-1">Cash in Hand</div>
                 </div>
                 <div className="flex-fill px-2">
                    <h3 className="mb-0 fw-bold" style={{color: '#0752a7'}}>₹{(todaysBalance).toLocaleString()}</h3>
                    <div className="small text-muted mt-1">Today's Balance</div>
                 </div>
              </div>
              <div className="bg-primary-subtle border-top text-center py-2" style={{cursor: 'pointer'}}>
                 <span className="small fw-semibold text-primary d-flex align-items-center justify-content-center gap-1">
                    VIEW SALE & EXPENSE REPORT <ArrowRight size={14} />
                 </span>
              </div>
           </div>
        </div>

        {/* Date / Entry Stats bar */}
        <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom mt-2 bg-light-subtle">
           <div>
              <div className="fw-bold">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
              <div className="small text-muted f-12">{todayEntryCount} {todayEntryCount === 1 ? 'Entry' : 'Entries'}</div>
           </div>
           <div className="d-flex text-end gap-3 text-uppercase f-12 fw-bold">
              <div>
                 <div className="text-muted mb-1">Out</div>
                 <div className="text-danger">₹{todayOut.toLocaleString()}</div>
              </div>
              <div>
                 <div className="text-muted mb-1">In</div>
                 <div className="text-success">₹{todayIn.toLocaleString()}</div>
              </div>
           </div>
        </div>

        {/* Entries List or Empty State */}
        <div className="flex-grow-1 p-3 overflow-auto pb-5">
           {cashbook.length === 0 ? (
              <div className="h-100 d-flex flex-column align-items-center justify-content-center text-center">
                 <div className="bg-light rounded-circle flex-center mb-3 border border-3 border-danger-subtle" style={{width: 120, height: 120, position:'relative'}}>
                     <FileText size={48} className="text-danger opacity-75" />
                     <div className="position-absolute bg-success text-white rounded-1 shadow-sm px-2 f-12 fw-bold" style={{top: -5, right: -15, transform: 'rotate(15deg)'}}>₹ IN</div>
                     <div className="position-absolute bg-white text-danger border border-danger rounded-1 shadow-sm px-2 f-12 fw-bold" style={{bottom: 10, left: -20, transform: 'rotate(-10deg)'}}>₹ OUT</div>
                 </div>
                 <p className="text-muted mb-5">Hello! Lets make today's entries</p>

                 <div className="d-flex flex-column align-items-center opacity-75 mt-4">
                    <span className="text-primary small fw-semibold mb-2">Add Your First Entry</span>
                    <ArrowDown size={20} className="text-primary bounce-anim" />
                 </div>
              </div>
           ) : (
             <div className="list-group list-group-flush">
                {cashbook.map(entry => (
                  <div key={entry.id} className="list-group-item d-flex justify-content-between py-3 px-0 bg-transparent border-bottom">
                     <div>
                        <div className="fw-medium text-body f-15 mb-1">{entry.note}</div>
                        <div className="f-12 text-muted">{new Date(entry.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                     </div>
                     <div className="text-end d-flex flex-column align-items-end justify-content-center">
                        <div className={`fw-bold f-15 ${entry.amount >= 0 ? 'text-success' : 'text-danger'}`}>
                           {entry.amount >= 0 ? '+' : '-'}₹{Math.abs(entry.amount)}
                        </div>
                        <button className="btn btn-link link-danger p-0 mt-1 f-12 text-decoration-none border-0" onClick={() => {
                          if (window.confirm('Delete entry?')) deleteCashbookEntry(entry.id)
                        }}>Delete</button>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>

        {/* Sticky Bottom Buttons exactly like Khatabook! */}
        <div className="mt-auto d-flex w-100 position-absolute bottom-0 shadow-lg bg-surface" style={{height: '65px'}}>
           <button 
             className="flex-fill btn btn-danger fw-bold rounded-0 d-flex align-items-center justify-content-center gap-2 m-0 border-0 fs-5 w-50"
             onClick={() => setEntryMode('out')}
           >
             <MinusCircle className="text-white" fill="white" color="#dc3545" size={24} /> OUT
           </button>
           <button 
             className="flex-fill btn btn-success fw-bold rounded-0 d-flex align-items-center justify-content-center gap-2 m-0 border-0 fs-5 w-50"
             onClick={() => setEntryMode('in')}
           >
             <PlusCircle className="text-white" fill="white" color="#198754" size={24} /> IN
           </button>
        </div>

      </div>
      <style>{`
         .bounce-anim { animation: bounce 2s infinite; }
         @keyframes bounce {
           0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
           40% {transform: translateY(10px);}
           60% {transform: translateY(5px);}
         }
      `}</style>
    </div>
  );
}
