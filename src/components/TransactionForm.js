import React, { useState } from "react";

export default function TransactionForm({ onAdd }) {
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");

  const submit = (e) => {
    e && e.preventDefault();
    const num = parseFloat(amount);
    if (!note.trim() || isNaN(num)) return alert("Enter description and valid amount");
    onAdd({ note: note.trim(), amount: num, date: new Date().toLocaleString() });
    setNote("");
    setAmount("");
  };

  return (
    <form onSubmit={submit} className="d-flex gap-2">
      <input value={note} onChange={(e) => setNote(e.target.value)} className="form-control" placeholder="Note (eg. Payment, Loan)" />
      <input value={amount} onChange={(e) => setAmount(e.target.value)} className="form-control" placeholder="Amount (+ received, - given)" type="number" />
      <button type="submit" className="btn btn-primary">Add</button>
    </form>
  );
}
