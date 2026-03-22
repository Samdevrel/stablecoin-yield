'use client';

import { useState, useEffect } from 'react';

interface YieldOpportunity {
  protocol: string;
  chain: string;
  asset: string;
  apy: number;
  tvl: string;
  risk: 'low' | 'medium' | 'high';
  type: 'lending' | 'lp' | 'vault';
  rewards?: string;
}

const opportunities: YieldOpportunity[] = [
  { protocol: 'Aave V3', chain: 'Ethereum', asset: 'USDC', apy: 4.2, tvl: '$2.1B', risk: 'low', type: 'lending' },
  { protocol: 'Aave V3', chain: 'Arbitrum', asset: 'USDC', apy: 5.1, tvl: '$890M', risk: 'low', type: 'lending' },
  { protocol: 'Compound V3', chain: 'Ethereum', asset: 'USDC', apy: 3.8, tvl: '$1.8B', risk: 'low', type: 'lending' },
  { protocol: 'Morpho', chain: 'Ethereum', asset: 'USDC', apy: 6.2, tvl: '$450M', risk: 'low', type: 'lending', rewards: 'MORPHO' },
  { protocol: 'Curve', chain: 'Ethereum', asset: '3pool', apy: 2.8, tvl: '$680M', risk: 'low', type: 'lp', rewards: 'CRV' },
  { protocol: 'Curve', chain: 'Base', asset: 'USDC-crvUSD', apy: 8.5, tvl: '$120M', risk: 'medium', type: 'lp', rewards: 'CRV' },
  { protocol: 'Yearn V3', chain: 'Ethereum', asset: 'USDC', apy: 5.8, tvl: '$340M', risk: 'medium', type: 'vault' },
  { protocol: 'Steakhouse', chain: 'Ethereum', asset: 'USDC', apy: 5.5, tvl: '$85M', risk: 'low', type: 'vault' },
  { protocol: 'Spark', chain: 'Ethereum', asset: 'DAI', apy: 5.0, tvl: '$1.2B', risk: 'low', type: 'lending' },
  { protocol: 'Fluid', chain: 'Ethereum', asset: 'USDC', apy: 7.2, tvl: '$280M', risk: 'medium', type: 'lending' },
  { protocol: 'Pendle', chain: 'Arbitrum', asset: 'PT-USDC', apy: 9.5, tvl: '$210M', risk: 'medium', type: 'vault' },
  { protocol: 'Gearbox', chain: 'Ethereum', asset: 'USDC', apy: 4.5, tvl: '$95M', risk: 'medium', type: 'lending' },
];

export default function Home() {
  const [sortBy, setSortBy] = useState<'apy' | 'tvl' | 'risk'>('apy');
  const [filterChain, setFilterChain] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [amount, setAmount] = useState(10000);

  const chains = ['all', ...Array.from(new Set(opportunities.map(o => o.chain)))];
  const types = ['all', 'lending', 'lp', 'vault'];
  const risks = ['all', 'low', 'medium', 'high'];

  const filtered = opportunities
    .filter(o => filterChain === 'all' || o.chain === filterChain)
    .filter(o => filterType === 'all' || o.type === filterType)
    .filter(o => filterRisk === 'all' || o.risk === filterRisk)
    .sort((a, b) => {
      if (sortBy === 'apy') return b.apy - a.apy;
      if (sortBy === 'tvl') return parseFloat(b.tvl.replace(/[$BM]/g, '')) - parseFloat(a.tvl.replace(/[$BM]/g, ''));
      return a.risk.localeCompare(b.risk);
    });

  const bestApy = Math.max(...filtered.map(o => o.apy));
  const avgApy = filtered.length > 0 ? filtered.reduce((a, b) => a + b.apy, 0) / filtered.length : 0;

  const calculateYearlyYield = (apy: number) => (amount * apy / 100).toFixed(2);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="border-b-4 border-green-400 bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black">Stablecoin Yield Aggregator</h1>
          <p className="text-gray-400 mt-2">Compare yields across {opportunities.length} DeFi protocols</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-900 border-4 border-green-400 p-4 text-center">
            <div className="text-3xl font-black text-green-400">{bestApy.toFixed(1)}%</div>
            <div className="text-sm text-gray-400">Best APY</div>
          </div>
          <div className="bg-gray-900 border-4 border-gray-700 p-4 text-center">
            <div className="text-3xl font-black">{avgApy.toFixed(1)}%</div>
            <div className="text-sm text-gray-400">Avg APY</div>
          </div>
          <div className="bg-gray-900 border-4 border-gray-700 p-4 text-center">
            <div className="text-3xl font-black">{filtered.length}</div>
            <div className="text-sm text-gray-400">Opportunities</div>
          </div>
          <div className="bg-gray-900 border-4 border-gray-700 p-4 text-center">
            <div className="text-xl font-black text-green-400">${calculateYearlyYield(bestApy)}</div>
            <div className="text-sm text-gray-400">Best Yield on ${amount.toLocaleString()}</div>
          </div>
        </section>

        {/* Calculator */}
        <section className="bg-gray-900 border-4 border-green-400 p-6">
          <h2 className="text-sm font-bold text-gray-400 mb-4">YIELD CALCULATOR</h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Amount:</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              className="flex-1 px-4 py-2 bg-gray-800 border-2 border-gray-600 font-bold text-xl outline-none"
            />
            <span className="text-gray-400">USDC</span>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-gray-900 border-4 border-gray-700 p-6">
          <h2 className="text-sm font-bold text-gray-400 mb-4">FILTERS</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Chain:</span>
              {chains.map(c => (
                <button
                  key={c}
                  onClick={() => setFilterChain(c)}
                  className={`px-3 py-1 text-sm border-2 ${
                    filterChain === c ? 'bg-green-500 border-green-400' : 'bg-gray-700 border-gray-600'
                  }`}
                >
                  {c === 'all' ? 'All' : c}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Type:</span>
              {types.map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1 text-sm border-2 ${
                    filterType === t ? 'bg-green-500 border-green-400' : 'bg-gray-700 border-gray-600'
                  }`}
                >
                  {t === 'all' ? 'All' : t.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Risk:</span>
              {risks.map(r => (
                <button
                  key={r}
                  onClick={() => setFilterRisk(r)}
                  className={`px-3 py-1 text-sm border-2 ${
                    filterRisk === r ? 'bg-green-500 border-green-400' : 'bg-gray-700 border-gray-600'
                  }`}
                >
                  {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Sort:</span>
              {(['apy', 'tvl', 'risk'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`px-3 py-1 text-sm border-2 ${
                    sortBy === s ? 'bg-green-500 border-green-400' : 'bg-gray-700 border-gray-600'
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Opportunities */}
        <section className="space-y-3">
          {filtered.map((opp, i) => (
            <div
              key={`${opp.protocol}-${opp.chain}-${opp.asset}`}
              className={`bg-gray-900 border-4 p-4 ${
                i === 0 ? 'border-green-400' : 'border-gray-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {i === 0 && (
                    <span className="px-2 py-1 bg-green-900 text-green-400 text-xs font-bold">BEST</span>
                  )}
                  <div>
                    <h3 className="font-bold text-lg">{opp.protocol}</h3>
                    <div className="text-sm text-gray-400">
                      {opp.chain} • {opp.asset}
                      {opp.rewards && <span className="text-purple-400 ml-2">+ {opp.rewards}</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-green-400">{opp.apy.toFixed(1)}%</div>
                  <div className="text-sm text-gray-400">
                    = ${calculateYearlyYield(opp.apy)}/yr on ${amount.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-3 text-xs">
                <span className="px-2 py-1 bg-gray-800">{opp.type.toUpperCase()}</span>
                <span className={`px-2 py-1 ${
                  opp.risk === 'low' ? 'bg-green-900 text-green-400' :
                  opp.risk === 'medium' ? 'bg-yellow-900 text-yellow-400' :
                  'bg-red-900 text-red-400'
                }`}>
                  {opp.risk.toUpperCase()} RISK
                </span>
                <span className="px-2 py-1 bg-gray-800">TVL: {opp.tvl}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Risk Disclaimer */}
        <section className="bg-gray-900 border-4 border-yellow-400 p-6">
          <h2 className="text-sm font-bold text-yellow-400 mb-2">⚠️ RISK LEVELS</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-gray-800 border-l-4 border-green-400">
              <h3 className="font-bold text-green-400">Low Risk</h3>
              <p className="text-gray-400">Battle-tested protocols, high TVL, audited contracts</p>
            </div>
            <div className="p-3 bg-gray-800 border-l-4 border-yellow-400">
              <h3 className="font-bold text-yellow-400">Medium Risk</h3>
              <p className="text-gray-400">Newer protocols, yield optimization, smart contract risk</p>
            </div>
            <div className="p-3 bg-gray-800 border-l-4 border-red-400">
              <h3 className="font-bold text-red-400">High Risk</h3>
              <p className="text-gray-400">Experimental protocols, leveraged strategies, high IL</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm py-8 border-t border-gray-800">
          <p>
            Built by <a href="https://x.com/samdevrel" className="text-green-400 hover:underline">@samdevrel</a>
            {' • '}
            Rates are simulated for demo purposes
          </p>
        </footer>
      </div>
    </main>
  );
}
