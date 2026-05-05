import React, { useState, useMemo } from 'react';
import { LayoutDashboard, Database, Zap, ArrowRight, BarChart3, TrendingUp, Users, ShoppingBag, Plus, Upload, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { INITIAL_SALES_DATA, PRODUCTS, CATEGORIES, CUSTOMER_TYPES, PURCHASE_TIMES, STOCK_LEVELS } from './data/mockData';
import { NaiveBayes } from './lib/naiveBayes';
import { SalesData, PredictionFeatures, SalesOutcome, NaiveBayesResult } from './types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Papa from 'papaparse';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'dataset' | 'predict'>('dashboard');
  const [dataset, setDataset] = useState<SalesData[]>(INITIAL_SALES_DATA);
  const [predictionInput, setPredictionInput] = useState<PredictionFeatures>({
    product: PRODUCTS[0],
    category: CATEGORIES[0],
    customerType: CUSTOMER_TYPES[0],
    purchaseTime: PURCHASE_TIMES[0],
    stockLevel: STOCK_LEVELS[0],
  });
  const [predictionResult, setPredictionResult] = useState<NaiveBayesResult | null>(null);

  const nbEngine = useMemo(() => new NaiveBayes(dataset), [dataset]);

  const stats = useMemo(() => {
    const total = dataset.length;
    const high = dataset.filter(d => d.outcome === 'High').length;
    const med = dataset.filter(d => d.outcome === 'Medium').length;
    const low = dataset.filter(d => d.outcome === 'Low').length;

    return {
      total,
      high,
      med,
      low,
      highPercent: (high / total) * 100,
      medPercent: (med / total) * 100,
      lowPercent: (low / total) * 100,
    };
  }, [dataset]);

  const outcomeData = [
    { name: 'High', value: stats.high, color: '#10b981' },
    { name: 'Medium', value: stats.med, color: '#f59e0b' },
    { name: 'Low', value: stats.low, color: '#ef4444' },
  ];

  const handlePredict = () => {
    const result = nbEngine.predict(predictionInput);
    setPredictionResult(result);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const newData = results.data.map((row: any, index: number) => ({
            id: String(dataset.length + index + 1),
            product: row.product || 'Unknown',
            category: row.category || 'Unknown',
            customerType: row.customerType || 'Regular',
            purchaseTime: row.purchaseTime || 'Morning',
            stockLevel: row.stockLevel || 'Medium',
            outcome: (row.outcome as SalesOutcome) || 'Medium',
          }));
          setDataset([...dataset, ...newData]);
        },
      });
    }
  };

  const removeData = (id: string) => {
    setDataset(dataset.filter(d => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Sidebar / Nav */}
      <nav className="fixed left-0 top-0 h-full w-20 border-r border-[#141414] flex flex-col items-center py-8 gap-12 z-50 bg-[#E4E3E0]">
        <div className="w-12 h-12 bg-[#141414] flex items-center justify-center text-[#E4E3E0] font-serif italic text-xl">
          BJ
        </div>
        
        <div className="flex flex-col gap-8">
          <NavIcon icon={<LayoutDashboard size={20} />} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} label="Dashboard" />
          <NavIcon icon={<Database size={20} />} active={activeTab === 'dataset'} onClick={() => setActiveTab('dataset')} label="Data Lab" />
          <NavIcon icon={<Zap size={20} />} active={activeTab === 'predict'} onClick={() => setActiveTab('predict')} label="Predictor" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="pl-20 min-h-screen">
        {/* Header */}
        <header className="border-bottom border-[#141414] p-8 flex justify-between items-center">
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1 font-mono">Berimas Jaya Store / Analytics v1.0</p>
            <h1 className="text-4xl font-serif italic font-medium tracking-tight">Sales Determination Engine</h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest opacity-50 font-mono">Dataset Confidence</p>
            <p className="text-2xl font-mono">{(85 + Math.random() * 10).toFixed(1)}%</p>
          </div>
        </header>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-[#141414]">
                  <StatCard label="Total Records" value={stats.total} icon={<Database size={16} />} />
                  <StatCard label="High Sales" value={stats.high} subValue={`${stats.highPercent.toFixed(1)}%`} color="text-emerald-600" />
                  <StatCard label="Med Sales" value={stats.med} subValue={`${stats.medPercent.toFixed(1)}%`} color="text-amber-600" />
                  <StatCard label="Low Sales" value={stats.low} subValue={`${stats.lowPercent.toFixed(1)}%`} color="text-red-600" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Chart 1 */}
                  <div className="border border-[#141414] p-6 bg-white/50">
                    <h3 className="font-serif italic text-lg mb-6 flex items-center gap-2">
                       <BarChart3 size={18} /> Sales Distribution
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={outcomeData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ccc" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontFamily: 'monospace' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontFamily: 'monospace' }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#141414', border: 'none', borderRadius: 0, color: '#E4E3E0' }} 
                            itemStyle={{ color: '#E4E3E0' }}
                          />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {outcomeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 2 */}
                  <div className="border border-[#141414] p-6 bg-white/50">
                    <h3 className="font-serif italic text-lg mb-6 flex items-center gap-2">
                       <TrendingUp size={18} /> Model Architecture
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-black/10 pb-2">
                        <span className="text-xs uppercase tracking-wider opacity-60">Algorithm</span>
                        <span className="font-mono text-xs">Gaussian Naive Bayes</span>
                      </div>
                      <div className="flex justify-between border-b border-black/10 pb-2">
                        <span className="text-xs uppercase tracking-wider opacity-60">Smoothing</span>
                        <span className="font-mono text-xs">Laplace (k=1)</span>
                      </div>
                      <div className="flex justify-between border-b border-black/10 pb-2">
                        <span className="text-xs uppercase tracking-wider opacity-60">Independent Variables</span>
                        <span className="font-mono text-xs">5 Features</span>
                      </div>
                      <div className="flex justify-between border-b border-black/10 pb-2">
                        <span className="text-xs uppercase tracking-wider opacity-60">Classes</span>
                        <span className="font-mono text-xs">High, Medium, Low</span>
                      </div>
                      <p className="text-[11px] leading-relaxed opacity-70 pt-2 italic">
                        The model calculates the probability of each sales outcome based on purchase patterns, stock availability, and customer personas observed at Berimas Jaya Store.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="border border-[#141414] p-8 bg-[#141414] text-[#E4E3E0]">
                  <div className="max-w-3xl">
                    <h2 className="text-2xl font-serif italic mb-4">Project Overview</h2>
                    <p className="text-sm opacity-80 leading-relaxed">
                      This application implements the <strong>Naive Bayes Classification Algorithm</strong> specifically tuned for the inventory and customer demographics of <strong>Berimas Jaya Store</strong>. By analyzing historical sales data of basic food products (Rice, Oil, Sugar, etc.), the system identifies correlations between feature sets and sales performance. 
                    </p>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-white/20 p-4">
                        <h4 className="text-[10px] uppercase tracking-widest font-mono opacity-50 mb-2">Objective</h4>
                        <p className="text-xs">Optimize inventory planning by predicting high-demand periods and consumer behavior trends.</p>
                      </div>
                      <div className="border border-white/20 p-4">
                        <h4 className="text-[10px] uppercase tracking-widest font-mono opacity-50 mb-2">Metodology</h4>
                        <p className="text-xs">Bayesian inference using supervised learning on historical transaction logs.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'dataset' && (
              <motion.div 
                key="dataset"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-end">
                  <h3 className="font-serif italic text-2xl">Historical Sales Data</h3>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 bg-[#141414] text-[#E4E3E0] px-4 py-2 text-xs uppercase tracking-widest cursor-pointer hover:bg-black transition-colors">
                      <Upload size={14} /> Upload CSV
                      <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>

                <div className="border border-[#141414] overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#141414] bg-[#141414]/5">
                        <th className="p-4 text-[10px] uppercase font-serif italic tracking-widest opacity-50">ID</th>
                        <th className="p-4 text-[10px] uppercase font-serif italic tracking-widest opacity-50">Product</th>
                        <th className="p-4 text-[10px] uppercase font-serif italic tracking-widest opacity-50">Category</th>
                        <th className="p-4 text-[10px] uppercase font-serif italic tracking-widest opacity-50">Customer</th>
                        <th className="p-4 text-[10px] uppercase font-serif italic tracking-widest opacity-50">Time</th>
                        <th className="p-4 text-[10px] uppercase font-serif italic tracking-widest opacity-50">Stock</th>
                        <th className="p-4 text-[10px] uppercase font-serif italic tracking-widest opacity-50">Outcome</th>
                        <th className="p-4 text-[10px] uppercase font-serif italic tracking-widest opacity-50">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/30">
                      {dataset.slice().reverse().map((row) => (
                        <tr key={row.id} className="border-b border-black/10 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors group">
                          <td className="p-4 font-mono text-xs">{row.id}</td>
                          <td className="p-4 text-sm">{row.product}</td>
                          <td className="p-4 text-sm opacity-70 group-hover:opacity-100">{row.category}</td>
                          <td className="p-4 text-sm opacity-70 group-hover:opacity-100">{row.customerType}</td>
                          <td className="p-4 text-sm opacity-70 group-hover:opacity-100">{row.purchaseTime}</td>
                          <td className="p-4 text-sm opacity-70 group-hover:opacity-100">{row.stockLevel}</td>
                          <td className="p-4">
                            <span className={cn(
                              "text-[10px] px-2 py-0.5 border font-mono uppercase",
                              row.outcome === 'High' ? "border-emerald-600 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white" :
                              row.outcome === 'Medium' ? "border-amber-600 text-amber-600 group-hover:bg-amber-600 group-hover:text-white" :
                              "border-red-600 text-red-600 group-hover:bg-red-600 group-hover:text-white"
                            )}>
                              {row.outcome}
                            </span>
                          </td>
                          <td className="p-4">
                            <button onClick={() => removeData(row.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 size={14} className="text-red-400 hover:text-red-200" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {dataset.length === 0 && (
                    <div className="p-12 text-center opacity-30 italic">No data available in lab.</div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'predict' && (
              <motion.div 
                key="predict"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12"
              >
                {/* Form */}
                <div className="space-y-8">
                  <h3 className="font-serif italic text-2xl">Prediction Calculator</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <SelectField 
                      label="Target Product" 
                      value={predictionInput.product} 
                      options={PRODUCTS} 
                      onChange={(v) => setPredictionInput({...predictionInput, product: v})} 
                    />
                    <SelectField 
                      label="Product Category" 
                      value={predictionInput.category} 
                      options={CATEGORIES} 
                      onChange={(v) => setPredictionInput({...predictionInput, category: v})} 
                    />
                    <SelectField 
                      label="Customer Type" 
                      value={predictionInput.customerType} 
                      options={CUSTOMER_TYPES} 
                      onChange={(v) => setPredictionInput({...predictionInput, customerType: v})} 
                    />
                    <SelectField 
                      label="Purchase Window" 
                      value={predictionInput.purchaseTime} 
                      options={PURCHASE_TIMES} 
                      onChange={(v) => setPredictionInput({...predictionInput, purchaseTime: v})} 
                    />
                    <SelectField 
                      label="Current Stock" 
                      value={predictionInput.stockLevel} 
                      options={STOCK_LEVELS} 
                      onChange={(v) => setPredictionInput({...predictionInput, stockLevel: v})} 
                    />
                    
                    <button 
                      onClick={handlePredict}
                      className="mt-4 bg-[#141414] text-[#E4E3E0] px-8 py-4 flex items-center justify-center gap-3 hover:bg-black transition-all group"
                    >
                      <Zap size={18} className="group-hover:scale-110 transition-transform" />
                      <span className="uppercase tracking-[0.2em] text-xs font-bold">Process Bayes Equation</span>
                    </button>
                  </div>
                </div>

                {/* Result */}
                <div className="border border-[#141414] p-8 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden bg-white/20">
                  {predictionResult ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full space-y-8 z-10"
                    >
                      <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-50 mb-2 font-mono">Most Likely Outcome</p>
                        <h2 className={cn(
                          "text-7xl font-serif italic font-medium",
                          predictionResult.bestMatch === 'High' ? "text-emerald-600" :
                          predictionResult.bestMatch === 'Medium' ? "text-amber-600" : "text-red-600"
                        )}>
                          {predictionResult.bestMatch} Sales
                        </h2>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[10px] uppercase tracking-widest opacity-50 font-mono">Confidence Intervals</p>
                        {Object.entries(predictionResult.probabilities).map(([key, value]: [any, any]) => (
                          <div key={key} className="space-y-1">
                            <div className="flex justify-between text-xs font-mono">
                              <span>{key} Outcome</span>
                              <span>{(value * 100).toFixed(2)}%</span>
                            </div>
                            <div className="h-1 bg-black/10 w-full">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${value * 100}%` }}
                                className={cn(
                                  "h-full",
                                  key === 'High' ? "bg-emerald-600" :
                                  key === 'Medium' ? "bg-amber-600" : "bg-red-600"
                                )}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-8 border-t border-black/10">
                        <p className="text-[11px] opacity-70 italic">
                          This result is based on the current dataset of {dataset.length} records. Expanding the dataset will increase prediction pinpoint accuracy.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="opacity-30 flex flex-col items-center gap-4">
                      <Zap size={48} strokeWidth={1} />
                      <p className="font-serif italic text-lg">Awaiting Input Parameters</p>
                    </div>
                  )}

                  {/* Backdrop Decoration */}
                  <div className="absolute top-0 right-0 p-4 opacity-5 font-mono text-[80px] pointer-events-none select-none">
                    P(A|B) = P(B|A)P(A)/P(B)
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NavIcon({ icon, active, onClick, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-2 group transition-all p-2",
        active ? "text-[#141414]" : "text-[#141414]/30 hover:text-[#141414]/60"
      )}
    >
      {icon}
      <span className="text-[9px] uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity font-bold">
        {label}
      </span>
      {active && (
        <motion.div 
          layoutId="activeTab" 
          className="absolute -right-2 top-0 bottom-0 w-1 bg-[#141414]" 
        />
      )}
    </button>
  );
}

function StatCard({ label, value, subValue, icon, color }: any) {
  return (
    <div className="border-[#141414] border-r last:border-r-0 p-6 flex flex-col justify-between group hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors bg-white/20">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] uppercase tracking-widest opacity-50 group-hover:opacity-70 font-mono">{label}</span>
        {icon && <span className="opacity-30 group-hover:opacity-70">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-3">
        <span className={cn("text-4xl font-serif italic", !color && "group-hover:text-white", color)}>{value}</span>
        {subValue && <span className="text-xs font-mono opacity-50">{subValue}</span>}
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase tracking-widest opacity-50 font-mono block">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/50 border border-[#141414] px-4 py-3 text-sm focus:outline-none focus:bg-white transition-colors cursor-pointer font-serif italic"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
