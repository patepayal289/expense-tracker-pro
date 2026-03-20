import React, { useState } from "react";
import { Search, Plus, UserCircle, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

export default function CustomersPage() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useAppContext();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", editingId: null });

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.phone && c.phone.includes(search))
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Client name is required");

    if (form.editingId) {
      updateCustomer(form.editingId, { name: form.name.trim(), phone: form.phone.trim() });
    } else {
      addCustomer({ name: form.name.trim(), phone: form.phone.trim() });
    }
    
    setShowModal(false);
    setForm({ name: "", phone: "", editingId: null });
  };

  const confirmDelete = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this customer and all their transactions?")) {
      deleteCustomer(id);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="page-header mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h1 className="page-title mb-1">Customer Directory</h1>
          <p className="page-subtitle mb-0">Manage all your clients from one place</p>
        </div>
        <div className="d-flex gap-3">
          <div className="search-box glass-panel px-3 py-2 rounded-pill d-flex align-items-center gap-2" style={{minWidth: '300px'}}>
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              className="bg-transparent border-0 flex-grow-1 header-input outline-none" 
              placeholder="Search customers..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{outline: 'none', color: 'var(--text-color)'}}
            />
          </div>
          <button className="btn btn-primary d-flex align-items-center gap-2 shadow-sm" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            <span className="d-none d-sm-inline">New Customer</span>
          </button>
        </div>
      </div>

      <div className="glass-panel p-0 overflow-hidden shadow-sm rounded-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 custom-table">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Customer</th>
                <th>Phone</th>
                <th>Transactions</th>
                <th>Net Balance</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <div className="empty-state">
                      <UserCircle size={48} className="text-muted mb-3 opacity-50" />
                      <h5 className="mb-1 text-muted">No customers found</h5>
                      <p className="small text-muted mb-0">Try adding a new customer or changing your search criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(c => {
                  const balance = c.transactions.reduce((s, t) => s + t.amount, 0);
                  const reminderMessage = encodeURIComponent(`Hi ${c.name}, your current balance with us is ₹${Math.abs(balance).toFixed(2)} (${balance < 0 ? 'Due' : 'Advance'}). Please clear your dues. Thank you!`);
                  
                  return (
                    <tr 
                      key={c.id} 
                      className="cursor-pointer hover-bg" 
                      onClick={(e) => {
                        // Prevent navigation if clicking inside the actions dropdown
                        if (!e.target.closest('.actions-cell')) {
                          window.location.href = `/customers/${c.id}`;
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <td className="ps-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="avatar avatar-sm bg-primary-light text-primary fw-bold rounded-circle flex-center" style={{width: 36, height: 36}}>
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-body fw-semibold">{c.name}</span>
                        </div>
                      </td>
                      <td>{c.phone || "—"}</td>
                      <td>
                        <span className="badge bg-secondary-subtle text-secondary rounded-pill px-3 py-2">
                          {c.transactions.length} entries
                        </span>
                      </td>
                      <td>
                        <span className={`fw-bold ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
                          {balance >= 0 ? '+' : '-'}₹{Math.abs(balance).toFixed(2)}
                        </span>
                      </td>
                      <td className="text-end pe-4 actions-cell">
                        <div className="d-flex justify-content-end align-items-center gap-2">
                          {balance < 0 && c.phone && (
                            <a 
                              href={`https://wa.me/${c.phone.replace(/\D/g,'')}?text=${reminderMessage}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="btn btn-sm btn-success d-flex align-items-center gap-1 rounded-pill px-3"
                              title="Send WhatsApp Reminder"
                            >
                              <i className="bi bi-whatsapp"></i> Reminder
                            </a>
                          )}
                          <div className="dropdown">
                            <button className="btn btn-sm btn-icon border-0" data-bs-toggle="dropdown">
                              <MoreVertical size={16} className="text-muted" />
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3">
                              <li><Link className="dropdown-item d-flex align-items-center gap-2 py-2" to={`/customers/${c.id}`}><UserCircle size={16} /> View Ledger</Link></li>
                              <li><button className="dropdown-item d-flex align-items-center gap-2 py-2" onClick={() => {
                                setForm({name: c.name, phone: c.phone || "", editingId: c.id});
                                setShowModal(true);
                              }}><Edit size={16} /> Edit Info</button></li>
                              <li><hr className="dropdown-divider" /></li>
                              <li><button className="dropdown-item text-danger d-flex align-items-center gap-2 py-2" onClick={(e) => confirmDelete(e, c.id)}><Trash2 size={16} /> Delete Customer</button></li>
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop-custom flex-center animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="custom-modal p-4 rounded-4 shadow-lg animate-slide-up bg-surface" onClick={e => e.stopPropagation()} style={{width: '90%', maxWidth: '450px'}}>
            <h4 className="mb-4 fw-bold">{form.editingId ? 'Edit Customer' : 'Add New Customer'}</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-medium small">Customer Name *</label>
                <input type="text" className="form-control form-control-lg bg-light-subtle rounded-3" autoFocus value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. John Doe" />
              </div>
              <div className="mb-4">
                <label className="form-label fw-medium small">Phone Number (Optional)</label>
                <input type="tel" className="form-control form-control-lg bg-light-subtle rounded-3" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 9999999999" />
              </div>
              <div className="d-flex gap-2 justify-content-end">
                <button type="button" className="btn btn-light px-4 py-2" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary px-4 py-2 shadow-sm">{form.editingId ? 'Save Changes' : 'Create Customer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
