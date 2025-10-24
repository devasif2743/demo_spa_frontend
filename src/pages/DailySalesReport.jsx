import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Wallet, Activity, TrendingUp, Calendar, MapPin, Printer } from "lucide-react";

// Printable Daily Sales Report with Date & Branch Filter
export default function DailySalesReport() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [branch, setBranch] = useState("All Branches");

  const branches = ["All Branches", "Branch A", "Branch B", "Branch C"];

  const totals = {
    totalSale: 38431,
    cumulativeSale: 266963,
    pettyCash: 0,
    inHand: 4400,
    totalClients: 12,
    servicesCount: 12,
  };

  const payments = [
    { name: "Cash", value: 4400 },
    { name: "Card", value: 14531 },
    { name: "Custom", value: 19500 },
    { name: "Nearbuy", value: 0 },
  ];

  const clientSources = [
    { source: "Google", count: 3 },
    { source: "Walking", count: 3 },
    { source: "Nearbuy", count: 0 },
    { source: "Just Dial", count: 0 },
    { source: "Regular", count: 3 },
    { source: "Members", count: 3 },
    { source: "Refer", count: 0 },
  ];

  const therapists = [
    { name: "Gita", services: 2 },
    { name: "Glory", services: 2 },
    { name: "Eliana", services: 1 },
    { name: "Mouni", services: 1 },
    { name: "Nidhi", services: 2 },
    { name: "Sana", services: 2 },
    { name: "Ranjana", services: 0 },
  ];

  const memberships = [
    { tier: "Bronze", qty: 2, price: 5000 },
    { tier: "Silver", qty: 1, price: 10000 },
  ];

  const membershipValue = memberships.reduce((sum, m) => sum + m.qty * m.price, 0);
  const paymentTotal = payments.reduce((s, p) => s + p.value, 0);

  const formatINR = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

  const card = "bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow";
  const tableBase = "min-w-full text-sm table-fixed w-full border-collapse";
  const th = "text-left text-gray-600 font-semibold px-4 py-2 border-b bg-gray-100";
  const td = "px-4 py-2 text-gray-700 border-b";
  const tdRight = "px-4 py-2 text-right text-gray-700 border-b";
  const zebra = "odd:bg-white even:bg-gray-50";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 print:p-0">
      <div className="max-w-6xl mx-auto space-y-6 bg-white rounded-xl shadow-md p-6 print:shadow-none print:p-0">
        {/* Header with Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 print:mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Daily Sales Report</h1>
            <p className="text-gray-600">Detailed summary of daily performance</p>
          </div>
          <div className="flex flex-wrap gap-3 items-center mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <Calendar className="text-gray-500" size={18} />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring focus:ring-indigo-200" />
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="text-gray-500" size={18} />
              <select value={branch} onChange={(e) => setBranch(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring focus:ring-indigo-200">
                {branches.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
            <button onClick={handlePrint} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm">
              <Printer size={16} /> Print
            </button>
          </div>
        </div>

        {/* Summary Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`${card} p-4`}>
            <h2 className="text-lg font-semibold mb-2">Summary</h2>
            <table className={tableBase}>
              <tbody>
                <tr className={zebra}><td className={td}>Total Sale</td><td className={tdRight}>{formatINR(totals.totalSale)}</td></tr>
                <tr className={zebra}><td className={td}>Cumulative Sale</td><td className={tdRight}>{formatINR(totals.cumulativeSale)}</td></tr>
                <tr className={zebra}><td className={td}>Petty Cash</td><td className={tdRight}>{formatINR(totals.pettyCash)}</td></tr>
                <tr className={zebra}><td className={td}>In Hand</td><td className={tdRight}>{formatINR(totals.inHand)}</td></tr>
              </tbody>
            </table>
          </div>

          <div className={`${card} p-4`}>
            <h2 className="text-lg font-semibold mb-2">Payment Breakdown</h2>
            <table className={tableBase}>
              <thead>
                <tr><th className={th}>Method</th><th className={th + " text-right"}>Amount</th></tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.name} className={zebra}><td className={td}>{p.name}</td><td className={tdRight}>{formatINR(p.value)}</td></tr>
                ))}
                <tr className="bg-gray-100 font-semibold"><td className={td}>Total</td><td className={tdRight}>{formatINR(paymentTotal)}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Clients & Therapists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`${card} p-4`}>
            <h2 className="text-lg font-semibold mb-2">Client Sources</h2>
            <table className={tableBase}>
              <thead>
                <tr><th className={th}>Source</th><th className={th + " text-right"}>Clients</th></tr>
              </thead>
              <tbody>
                {clientSources.map((s) => (
                  <tr key={s.source} className={zebra}><td className={td}>{s.source}</td><td className={tdRight}>{s.count}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`${card} p-4`}>
            <h2 className="text-lg font-semibold mb-2">Therapist Performance</h2>
            <table className={tableBase}>
              <thead>
                <tr><th className={th}>Therapist</th><th className={th + " text-right"}>Services</th></tr>
              </thead>
              <tbody>
                {therapists.map((t) => (
                  <tr key={t.name} className={zebra}><td className={td}>{t.name}</td><td className={tdRight}>{t.services}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Memberships */}
        <div className={`${card} p-4`}>
          <h2 className="text-lg font-semibold mb-2">Memberships</h2>
          <table className={tableBase}>
            <thead>
              <tr><th className={th}>Tier</th><th className={th + " text-right"}>Qty</th><th className={th + " text-right"}>Value</th></tr>
            </thead>
            <tbody>
              {memberships.map((m) => (
                <tr key={m.tier} className={zebra}><td className={td}>{m.tier}</td><td className={tdRight}>{m.qty}</td><td className={tdRight}>{formatINR(m.qty * m.price)}</td></tr>
              ))}
              <tr className="bg-gray-100 font-semibold"><td className={td}>Total</td><td className={tdRight}>{memberships.reduce((s, m) => s + m.qty, 0)}</td><td className={tdRight}>{formatINR(membershipValue)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
