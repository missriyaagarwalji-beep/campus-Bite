import React, { useState } from 'react';
import { Check, ArrowLeft, SlidersHorizontal, TrendingUp } from 'lucide-react';
import {
  COMPETITOR_BATTLEFIELD,
  CompetitorEntry,
  GtmWeekPlan,
  MARKET_SIZE_DATA,
  PilotOrder,
  StudentFeedback,
  UNIT_ECONOMICS_PRESETS,
} from '../data/campusBiteData';

interface ValidationHubProps {
  orders: PilotOrder[];
  feedbackList: StudentFeedback[];
  gtmWeeks: GtmWeekPlan[];
  onToggleWeekComplete: (weekNum: number) => void;
  onBackToStorefront: () => void;
}

export const ValidationHub: React.FC<ValidationHubProps> = ({
  orders,
  feedbackList,
  gtmWeeks,
  onToggleWeekComplete,
  onBackToStorefront,
}) => {
  const [presetId, setPresetId] = useState<'base' | 'conservative' | 'ambitious'>('base');
  const [sellingPrice, setSellingPrice] = useState(100);
  const [customers, setCustomers] = useState(200);
  const [purchasesPerCustomer, setPurchasesPerCustomer] = useState(12);
  const [variableCost, setVariableCost] = useState(60);
  const [monthlyFixedCost, setMonthlyFixedCost] = useState(20000);

  const [selectedCompetitor, setSelectedCompetitor] = useState<CompetitorEntry>(
    COMPETITOR_BATTLEFIELD[0]
  );

  // Live 30-Day Experiment Metrics derived from actual orders & feedback
  const totalPayingOrders = orders.length;
  const repeatCount = orders.filter((o) => o.isRepeatCustomer).length;
  const repeatRate = totalPayingOrders > 0 ? Math.round((repeatCount / totalPayingOrders) * 100) : 0;
  const avgRating =
    feedbackList.length > 0
      ? (feedbackList.reduce((acc, f) => acc + f.rating, 0) / feedbackList.length).toFixed(1)
      : '0.0';
  const affordableShare =
    feedbackList.length > 0
      ? Math.round(
          (feedbackList.filter((f) => f.findsPriceAffordable).length / feedbackList.length) * 100
        )
      : 0;
  const referralOrders = orders.filter((o) => Boolean(o.referralCodeUsed)).length;

  // Calculated Unit Economics (Mission 7 formulas)
  const contributionPerSale = sellingPrice - variableCost;
  const monthlyOrders = customers * purchasesPerCustomer;
  const monthlyRevenue = monthlyOrders * sellingPrice;
  const totalMonthlyContribution = monthlyOrders * contributionPerSale;
  const operatingSurplus = totalMonthlyContribution - monthlyFixedCost;
  const breakEvenMeals =
    contributionPerSale > 0 ? Math.ceil(monthlyFixedCost / contributionPerSale) : 0;

  const applyPreset = (id: 'base' | 'conservative' | 'ambitious') => {
    const found = UNIT_ECONOMICS_PRESETS.find((p) => p.id === id);
    if (!found) return;
    setPresetId(id);
    setSellingPrice(found.sellingPrice);
    setCustomers(found.expectedCustomers);
    setPurchasesPerCustomer(found.purchasesPerCustomer);
    setVariableCost(found.variableCost);
    setMonthlyFixedCost(found.monthlyFixedCost);
  };

  const formatInr = (num: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
      {/* Header strip */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#E6D9C7] pb-6 md:flex-row md:items-end">
        <div>
          <button
            type="button"
            onClick={onBackToStorefront}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C2410C] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Student Ordering Menu</span>
          </button>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#1F1814]">
            Venture Validation & 30-Day Experiment Hub
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-[#5E5247]">
            Live MVP evidence tracker for CampusBite (DGU Venture Quest · Dehradun Hostel & PG
            Pilot). Every order and meal rating submitted in the Storefront updates these metrics in
            real time.
          </p>
        </div>

        <div className="text-left md:text-right">
          <p className="text-xs text-[#6B5B4D]">Venture Plan Owner</p>
          <p className="font-mono text-xs font-medium text-[#1F1814]">
            riya.0251mba003@dgu.ac.in · DBS Global University
          </p>
        </div>
      </div>

      {/* Live 30-Day MVP Validation Targets (Mission 10 & 11) */}
      <section className="mt-8">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl font-semibold text-[#1F1814]">
            01. Live 30-Day MVP Evidence Goals
          </h2>
          <span className="text-xs text-[#6B5B4D]">Synced with Storefront orders & reviews</span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[#E6D9C7] bg-white p-5">
            <p className="text-xs font-medium text-[#6B5B4D]">Paying Orders (Target: 20+)</p>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-mono text-3xl font-semibold tabular-nums text-[#1F1814]">
                {totalPayingOrders}
              </span>
              <span className="font-mono text-xs font-semibold tabular-nums text-[#C2410C]">
                {Math.min(100, Math.round((totalPayingOrders / 20) * 100))}% of goal
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#F2EAE0]">
              <div
                className="h-full bg-[#C2410C] transition-all"
                style={{ width: `${Math.min(100, (totalPayingOrders / 20) * 100)}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-[#E6D9C7] bg-white p-5">
            <p className="text-xs font-medium text-[#6B5B4D]">Repeat-Order Rate (Target: 30%+)</p>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-mono text-3xl font-semibold tabular-nums text-[#1F1814]">
                {repeatRate}%
              </span>
              <span className="text-xs font-semibold text-[#15803D]">
                {repeatRate >= 30 ? 'Target Met' : 'Building Repeat Base'}
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#E3EFE7]">
              <div
                className="h-full bg-[#15803D] transition-all"
                style={{ width: `${Math.min(100, repeatRate)}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-[#E6D9C7] bg-white p-5">
            <p className="text-xs font-medium text-[#6B5B4D]">
              Avg Satisfaction (Target: 4.0/5+)
            </p>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-mono text-3xl font-semibold tabular-nums text-[#1F1814]">
                {avgRating}
              </span>
              <span className="font-mono text-xs tabular-nums text-[#6B5B4D]">
                {feedbackList.length} verified reviews
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#FEF3C7]">
              <div
                className="h-full bg-[#D97706] transition-all"
                style={{ width: `${Math.min(100, (Number(avgRating) / 5) * 100)}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-[#E6D9C7] bg-white p-5">
            <p className="text-xs font-medium text-[#6B5B4D]">₹100 Affordability & Referrals</p>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-mono text-3xl font-semibold tabular-nums text-[#15803D]">
                {affordableShare}%
              </span>
              <span className="font-mono text-xs font-semibold tabular-nums text-[#C2410C]">
                {referralOrders} referral orders
              </span>
            </div>
            <p className="mt-3 text-xs text-[#6B5B4D]">
              Students confirming ₹100 price fits daily budget
            </p>
          </div>
        </div>
      </section>

      {/* Unit Economics & Scenario Simulator (Mission 7) */}
      <section className="mt-12 rounded-2xl border border-[#E4E4E0] bg-white p-6 md:p-8">
        <div className="flex flex-col justify-between gap-4 border-b border-[#ECECE8] pb-5 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#141715]">
              02. Unit Economics & Scenario Simulator
            </h2>
            <p className="mt-1 text-xs text-[#5C635E]">
              Test Base, Conservative, and Ambitious Dehradun monthly scenarios or adjust parameters.
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-[#F2F1EC] p-1">
            {UNIT_ECONOMICS_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => applyPreset(p.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                  presetId === p.id
                    ? 'bg-white text-[#141715] shadow-xs'
                    : 'text-[#5C635E] hover:text-[#141715]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Controls */}
          <div className="space-y-4 lg:col-span-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#141715]">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#1B4332]" />
              <span>Model Assumptions</span>
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <label htmlFor="ue-price" className="text-[#454B47]">
                  Average Selling Price / Meal
                </label>
                <span className="font-mono font-semibold tabular-nums text-[#141715]">
                  ₹{sellingPrice}
                </span>
              </div>
              <input
                id="ue-price"
                type="range"
                min={70}
                max={140}
                step={5}
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="mt-1.5 w-full accent-[#1B4332]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <label htmlFor="ue-var" className="text-[#454B47]">
                  Variable Cost / Meal (Ingredients + Packaging + Delivery)
                </label>
                <span className="font-mono font-semibold tabular-nums text-[#141715]">
                  ₹{variableCost}
                </span>
              </div>
              <input
                id="ue-var"
                type="range"
                min={40}
                max={95}
                step={5}
                value={variableCost}
                onChange={(e) => setVariableCost(Number(e.target.value))}
                className="mt-1.5 w-full accent-[#1B4332]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <label htmlFor="ue-cust" className="text-[#454B47]">
                  Active Monthly Students
                </label>
                <span className="font-mono font-semibold tabular-nums text-[#141715]">
                  {customers} students
                </span>
              </div>
              <input
                id="ue-cust"
                type="range"
                min={50}
                max={500}
                step={10}
                value={customers}
                onChange={(e) => setCustomers(Number(e.target.value))}
                className="mt-1.5 w-full accent-[#1B4332]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <label htmlFor="ue-freq" className="text-[#454B47]">
                  Purchases per Student / Month
                </label>
                <span className="font-mono font-semibold tabular-nums text-[#141715]">
                  {purchasesPerCustomer} meals
                </span>
              </div>
              <input
                id="ue-freq"
                type="range"
                min={4}
                max={30}
                step={1}
                value={purchasesPerCustomer}
                onChange={(e) => setPurchasesPerCustomer(Number(e.target.value))}
                className="mt-1.5 w-full accent-[#1B4332]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs">
                <label htmlFor="ue-fixed" className="text-[#454B47]">
                  Monthly Fixed Kitchen & Ops Cost
                </label>
                <span className="font-mono font-semibold tabular-nums text-[#141715]">
                  {formatInr(monthlyFixedCost)}
                </span>
              </div>
              <input
                id="ue-fixed"
                type="range"
                min={10000}
                max={50000}
                step={2500}
                value={monthlyFixedCost}
                onChange={(e) => setMonthlyFixedCost(Number(e.target.value))}
                className="mt-1.5 w-full accent-[#1B4332]"
              />
            </div>
          </div>

          {/* Calculated Readout */}
          <div className="flex flex-col justify-between rounded-xl border border-[#ECECE8] bg-[#FAF9F6] p-5 lg:col-span-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1B4332]">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Projected Monthly Economics</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#5C635E]">Contribution / Meal</p>
                  <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-[#141715]">
                    {formatInr(contributionPerSale)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#5C635E]">Monthly Volume</p>
                  <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-[#141715]">
                    {monthlyOrders.toLocaleString('en-IN')} meals
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#5C635E]">Monthly Revenue</p>
                  <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-[#141715]">
                    {formatInr(monthlyRevenue)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#5C635E]">Operating Surplus</p>
                  <p
                    className={`mt-1 font-mono text-2xl font-semibold tabular-nums ${
                      operatingSurplus >= 0 ? 'text-[#1B4332]' : 'text-[#B91C1C]'
                    }`}
                  >
                    {formatInr(operatingSurplus)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-[#E4E4E0] pt-4 text-xs text-[#5C635E]">
              <p>
                Break-even point:{' '}
                <span className="font-mono font-semibold tabular-nums text-[#141715]">
                  {breakEvenMeals} meals / month
                </span>{' '}
                ({Math.ceil(breakEvenMeals / Math.max(1, purchasesPerCustomer))} regular students at{' '}
                {purchasesPerCustomer} meals/mo).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Competitor Battlefield & Market Size */}
      <section className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="rounded-2xl border border-[#E4E4E0] bg-white p-6 lg:col-span-7">
          <h2 className="font-display text-xl font-semibold text-[#141715]">
            03. Competitor Battlefield (Affordability vs Convenience)
          </h2>
          <p className="mt-1 text-xs text-[#5C635E]">
            Click any competitor node to inspect strengths, price point, and student pain points.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-12">
            {/* 2D Quadrant Chart */}
            <div className="md:col-span-6">
              <svg
                viewBox="0 0 280 240"
                className="w-full rounded-xl border border-[#ECECE8] bg-[#FAF9F6]"
                role="img"
                aria-label="Affordability versus Convenience positioning matrix"
              >
                {/* Grid lines */}
                <line x1="40" y1="20" x2="40" y2="200" stroke="#D2D5CE" strokeWidth="1.5" />
                <line x1="40" y1="200" x2="260" y2="200" stroke="#D2D5CE" strokeWidth="1.5" />
                <line
                  x1="150"
                  y1="20"
                  x2="150"
                  y2="200"
                  stroke="#E4E4E0"
                  strokeDasharray="3 3"
                />
                <line
                  x1="40"
                  y1="110"
                  x2="260"
                  y2="110"
                  stroke="#E4E4E0"
                  strokeDasharray="3 3"
                />

                <text x="150" y="226" textAnchor="middle" fontSize="10" fill="#5C635E">
                  Affordability (1 → 10)
                </text>
                <text
                  x="16"
                  y="110"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#5C635E"
                  transform="rotate(-90 16 110)"
                >
                  Convenience (1 → 10)
                </text>

                {COMPETITOR_BATTLEFIELD.map((comp) => {
                  const cx = 40 + (comp.affordabilityScore / 10) * 210;
                  const cy = 200 - (comp.convenienceScore / 10) * 170;
                  const isActive = selectedCompetitor.id === comp.id;
                  const isVenture = comp.type === 'Our Venture';

                  return (
                    <g
                      key={comp.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedCompetitor(comp)}
                    >
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isActive ? 11 : 8}
                        fill={isVenture ? '#1B4332' : isActive ? '#B45309' : '#64748B'}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                      <text
                        x={cx}
                        y={cy - 13}
                        textAnchor="middle"
                        fontSize="9.5"
                        fontWeight={isVenture ? '700' : '500'}
                        fill="#141715"
                      >
                        {comp.name.replace(' (Our Model)', '')}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Selected Detail */}
            <div className="flex flex-col justify-between md:col-span-6">
              <div>
                <p className="text-xs font-medium text-[#5C635E]">
                  {selectedCompetitor.type} ·{' '}
                  <span className="font-mono tabular-nums">{selectedCompetitor.priceRange}</span>
                </p>
                <h3 className="mt-1 font-display text-lg font-semibold text-[#141715]">
                  {selectedCompetitor.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#454B47]">
                  {selectedCompetitor.mainOffer}
                </p>

                <div className="mt-4 space-y-2.5 text-xs">
                  <div>
                    <span className="font-semibold text-[#1B4332]">Strength: </span>
                    <span className="text-[#454B47]">{selectedCompetitor.strength}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#B45309]">Gap / Weakness: </span>
                    <span className="text-[#454B47]">{selectedCompetitor.weakness}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[#ECECE8] pt-3">
                {COMPETITOR_BATTLEFIELD.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCompetitor(c)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      selectedCompetitor.id === c.id
                        ? 'bg-[#141715] text-white'
                        : 'bg-[#F2F1EC] text-[#454B47] hover:bg-[#E4E4E0]'
                    }`}
                  >
                    {c.name.replace(' (Our Model)', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Market Size TAM / SAM / SOM */}
        <div className="rounded-2xl border border-[#E4E4E0] bg-white p-6 lg:col-span-5">
          <h2 className="font-display text-xl font-semibold text-[#141715]">
            04. Dehradun Market Size
          </h2>
          <p className="mt-1 text-xs text-[#5C635E]">
            Based on ₹100/meal × 120 meals/year (₹12,000 annual student spend).
          </p>

          <div className="mt-5 divide-y divide-[#ECECE8]">
            {[MARKET_SIZE_DATA.tam, MARKET_SIZE_DATA.sam, MARKET_SIZE_DATA.som].map((tier) => (
              <div key={tier.label} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-[#141715]">{tier.label}</span>
                  <span className="font-mono text-lg font-semibold tabular-nums text-[#1B4332]">
                    {tier.shortValue}
                  </span>
                </div>
                <p className="mt-0.5 font-mono text-xs tabular-nums text-[#5C635E]">
                  {tier.customers} · {tier.value}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-[#454B47]">{tier.evidence}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 30-Day GTM Experiment Roadmap (Mission 9) */}
      <section className="mt-10 rounded-2xl border border-[#E4E4E0] bg-white p-6 md:p-8">
        <div className="flex flex-col justify-between gap-2 border-b border-[#ECECE8] pb-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#141715]">
              05. 30-Day Go-To-Market Experiment (₹2,000 Total Budget)
            </h2>
            <p className="mt-1 text-xs text-[#5C635E]">
              Instagram + WhatsApp + Student Referrals · Click a week to toggle milestone completion.
            </p>
          </div>
          <span className="font-mono text-xs font-semibold tabular-nums text-[#1B4332]">
            {gtmWeeks.filter((w) => w.completed).length} / {gtmWeeks.length} Weeks Completed
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {gtmWeeks.map((week) => (
            <button
              key={week.week}
              type="button"
              onClick={() => onToggleWeekComplete(week.week)}
              className={`flex flex-col justify-between rounded-xl border p-5 text-left transition-colors ${
                week.completed
                  ? 'border-[#B8D4C2] bg-[#F4F9F6]'
                  : 'border-[#E4E4E0] bg-white hover:border-[#BFC4BE]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-[#5C635E]">
                      {week.channels} · <span className="font-mono tabular-nums">₹{week.budgetInr}</span>
                    </p>
                    <h3 className="mt-1 font-display text-base font-semibold text-[#141715]">
                      {week.title}
                    </h3>
                  </div>

                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                      week.completed
                        ? 'border-[#1B4332] bg-[#1B4332] text-white'
                        : 'border-[#D2D5CE] bg-white text-transparent'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </span>
                </div>

                <p className="mt-2.5 text-xs leading-relaxed text-[#454B47]">{week.action}</p>
              </div>

              <div className="mt-4 border-t border-[#E4E4E0]/80 pt-3 text-xs">
                <p className="text-[#5C635E]">
                  <span className="font-semibold text-[#141715]">Learning Question: </span>
                  {week.learningQuestion}
                </p>
                <p className="mt-1.5 font-mono text-xs tabular-nums text-[#1B4332]">
                  Target: {week.targetLeads} leads · {week.targetCustomers} paying students
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Live Orders Table */}
      <section className="mt-10 rounded-2xl border border-[#E4E4E0] bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-[#141715]">
          Recent Pilot Orders ({orders.length})
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead>
              <tr className="border-b border-[#ECECE8] text-[#5C635E]">
                <th className="pb-2.5 font-medium">Order ID</th>
                <th className="pb-2.5 font-medium">Student</th>
                <th className="pb-2.5 font-medium">Hostel / PG Zone</th>
                <th className="pb-2.5 font-medium">Slot</th>
                <th className="pb-2.5 font-medium">Items</th>
                <th className="pb-2.5 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F1EC]">
              {orders.slice(0, 8).map((o) => (
                <tr key={o.id} className="text-[#141715]">
                  <td className="py-3 font-mono font-medium tabular-nums">{o.id}</td>
                  <td className="py-3">
                    {o.studentName}
                    {o.isRepeatCustomer && (
                      <span className="ml-1.5 text-[11px] text-[#1B4332]">(Repeat)</span>
                    )}
                  </td>
                  <td className="py-3 text-[#454B47]">{o.hostelZone}</td>
                  <td className="py-3 text-[#454B47]">{o.slot}</td>
                  <td className="py-3 text-[#454B47]">
                    {o.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                  </td>
                  <td className="py-3 text-right font-mono font-semibold tabular-nums">
                    ₹{o.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
