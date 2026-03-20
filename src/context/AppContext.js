import React, { createContext, useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem("kb_customers");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [cashbook, setCashbook] = useState(() => {
    const saved = localStorage.getItem("kb_cashbook");
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("kb_theme") || "light";
  });

  useEffect(() => {
    localStorage.setItem("kb_customers", JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem("kb_cashbook", JSON.stringify(cashbook));
  }, [cashbook]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem("kb_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const addCustomer = (cust) => {
    const newCust = { id: Date.now().toString(), name: cust.name, phone: cust.phone, transactions: [], note: "", createdAt: new Date().toISOString() };
    setCustomers((s) => [newCust, ...s]);
    toast.success("Customer added successfully!");
    return newCust.id;
  };

  const updateCustomer = (id, patch) => {
    setCustomers((s) => s.map(c => c.id === id ? { ...c, ...patch } : c));
    toast.success("Customer updated!");
  };

  const deleteCustomer = (id) => {
    setCustomers((s) => s.filter(c => c.id !== id));
    toast.success("Customer deleted.");
  };

  const addCashbookEntry = (entry, showToast = true) => {
    setCashbook((s) => [{ id: Date.now().toString() + Math.random(), ...entry }, ...s]);
    if (showToast) {
       toast.success(entry.amount >= 0 ? "Cash IN recorded" : "Cash OUT recorded");
    }
  };

  const addTransaction = (customerId, tx) => {
    let custName = 'Customer';
    
    setCustomers((s) => {
      const cust = s.find(c => c.id === customerId);
      if (cust) custName = cust.name;
      return s.map(c => c.id === customerId ? { ...c, transactions: [{ id: Date.now().toString(), ...tx }, ...c.transactions] } : c);
    });
    
    // Auto-sync with Cashbook when a ledger entry is made outside of the updater
    addCashbookEntry({
      amount: tx.amount,
      note: `${tx.amount >= 0 ? 'Received from' : 'Given to'} ${custName}: ${tx.note}`,
      date: tx.date || new Date().toISOString()
    }, false);

    toast.success(tx.amount >= 0 ? "Entry added (Got)" : "Entry added (Gave)");
  };

  const deleteTransaction = (customerId, txId) => {
    setCustomers((s) =>
      s.map(c => c.id === customerId ? { ...c, transactions: c.transactions.filter(t => t.id !== txId) } : c)
    );
    toast.success("Transaction removed.");
  };

  const deleteCashbookEntry = (id) => {
    setCashbook((s) => s.filter(entry => entry.id !== id));
    toast.success("Cashbook entry deleted");
  };

  return (
    <AppContext.Provider value={{
      customers,
      cashbook,
      theme,
      toggleTheme,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addTransaction,
      deleteTransaction,
      addCashbookEntry,
      deleteCashbookEntry
    }}>
      {children}
    </AppContext.Provider>
  );
};
