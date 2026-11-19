import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Minus,
  Star,
  Check,
  Copy,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import {
  CAMPUS_ZONES,
  CartItem,
  COMPETITOR_BATTLEFIELD,
  GtmWeekPlan,
  INITIAL_GTM_WEEKS,
  MENU_ITEMS,
  MenuCategory,
  MenuItem,
  PilotOrder,
  SEEDED_FEEDBACK,
  SEEDED_ORDERS,
  StudentFeedback,
} from './data/campusBiteData';
import { DishIllustration } from './components/DishIllustration';
import { MenuModal } from './components/MenuModal';
import { OrderDrawer } from './components/OrderDrawer';
import { ValidationHub } from './components/ValidationHub';

const STORAGE_KEYS = {
  ORDERS: 'campusbite_orders_v1',
  FEEDBACK: 'campusbite_feedback_v1',
  GTM: 'campusbite_gtm_v1',
};

export default function App() {
  const [activeView, setActiveView] = useState<'storefront' | 'validation'>('storefront');
  const [categoryFilter, setCategoryFilter] = useState<'all' | MenuCategory>('all');
  const [selectedZoneId, setSelectedZoneId] = useState<string>(CAMPUS_ZONES[0].id);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOrderDrawerOpen, setIsOrderDrawerOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Persistent MVP Pilot State
  const [orders, setOrders] = useState<PilotOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : SEEDED_ORDERS;
    } catch {
      return SEEDED_ORDERS;
    }
  });

  const [feedbackList, setFeedbackList] = useState<StudentFeedback[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
      return saved ? JSON.parse(saved) : SEEDED_FEEDBACK;
    } catch {
      return SEEDED_FEEDBACK;
    }
  });

  const [gtmWeeks, setGtmWeeks] = useState<GtmWeekPlan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GTM);
      return saved ? JSON.parse(saved) : INITIAL_GTM_WEEKS;
    } catch {
      return INITIAL_GTM_WEEKS;
    }
  });

  // Feedback Form State
  const [fbName, setFbName] = useState('');
  const [fbHostel, setFbHostel] = useState('');
  const [fbMeal, setFbMeal] = useState(MENU_ITEMS[0].name);
  const [fbRating, setFbRating] = useState(5);
  const [fbAffordable, setFbAffordable] = useState(true);
  const [fbRepeat, setFbRepeat] = useState(true);
  const [fbComment, setFbComment] = useState('');
  const [fbError, setFbError] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch {
      // Ignore storage quota errors
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedbackList));
    } catch {
      // Ignore storage quota errors
    }
  }, [feedbackList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GTM, JSON.stringify(gtmWeeks));
    } catch {
      // Ignore storage quota errors
    }
  }, [gtmWeeks]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2600);
  };

  const addToCart = (
    item: MenuItem,
    quantity = 1,
    spiceLevel: CartItem['spiceLevel'] = 'Homestyle'
  ) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (c) => c.item.id === item.id && c.spiceLevel === spiceLevel
      );
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [...prev, { item, quantity, spiceLevel }];
    });
    showToast(`Added ${item.name} to bag`);
  };

  const updateCartQty = (
    itemId: string,
    spiceLevel: CartItem['spiceLevel'],
    delta: number
  ) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.item.id === itemId && c.spiceLevel === spiceLevel) {
            return { ...c, quantity: c.quantity + delta };
          }
          return c;
        })
        .filter((c) => c.quantity > 0)
    );
  };

  const removeFromCart = (itemId: string, spiceLevel: CartItem['spiceLevel']) => {
    setCart((prev) =>
      prev.filter((c) => !(c.item.id === itemId && c.spiceLevel === spiceLevel))
    );
  };

  const handlePlaceOrder = (
    draft: Omit<PilotOrder, 'id' | 'createdAt' | 'whatsappText'>
  ): PilotOrder => {
    const orderNum = 1023 + orders.length;
    const id = `CB-${orderNum}`;
    const itemLines = draft.items
      .map((i) => `• ${i.quantity}x ${i.name} (${i.spiceLevel}) — ₹${i.price * i.quantity}`)
      .join('\n');

    const whatsappText = [
      `CAMPUSBITE ORDER ${id}`,
      `Student: ${draft.studentName}`,
      `Zone: ${draft.hostelZone}`,
      `Address: ${draft.roomDetails}`,
      `Slot: ${draft.slot}`,
      `Payment: ${draft.paymentMode}`,
      ``,
      `Items:`,
      itemLines,
      draft.referralCodeUsed ? `Referral Applied: ${draft.referralCodeUsed} (-₹15)` : null,
      `Total Payable: ₹${draft.total}`,
    ]
      .filter(Boolean)
      .join('\n');

    const newOrder: PilotOrder = {
      ...draft,
      id,
      createdAt: new Date().toISOString(),
      whatsappText,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    return newOrder;
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbName.trim() || !fbHostel.trim() || !fbComment.trim()) {
      setFbError('Please fill in your name, hostel/PG, and brief meal feedback.');
      return;
    }

    setFbError('');
    const newFb: StudentFeedback = {
      id: `fb-${Date.now()}`,
      studentName: fbName.trim(),
      hostelArea: fbHostel.trim(),
      mealOrdered: fbMeal,
      rating: fbRating,
      findsPriceAffordable: fbAffordable,
      willRepeatOrder: fbRepeat,
      comment: fbComment.trim(),
      submittedAt: new Date().toISOString().slice(0, 10),
    };

    setFeedbackList((prev) => [newFb, ...prev]);
    setFbName('');
    setFbHostel('');
    setFbComment('');
    showToast('Thank you! Feedback recorded in our 30-day pilot tracker.');
  };

  const handleCopyReferral = async () => {
    try {
      await navigator.clipboard.writeText('DGU15');
      setCopiedReferral(true);
      setTimeout(() => setCopiedReferral(false), 2000);
    } catch {
      setCopiedReferral(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (activeView !== 'storefront') {
      setActiveView('storefront');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalBagCount = cart.reduce((acc, c) => acc + c.quantity, 0);
  const filteredMenu =
    categoryFilter === 'all'
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === categoryFilter);

  const selectedZone = CAMPUS_ZONES.find((z) => z.id === selectedZoneId) ?? CAMPUS_ZONES[0];
  const avgSatisfaction =
    feedbackList.length > 0
      ? (feedbackList.reduce((sum, f) => sum + f.rating, 0) / feedbackList.length).toFixed(1)
      : '4.7';

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1F1814]">
      {/* Strict 3-Zone Top Bar */}
      <header className="sticky top-0 z-40 border-b border-[#EAE1D3] bg-[#FBF9F5]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Zone 1: Single-line Wordmark */}
          <button
            type="button"
            onClick={() => setActiveView('storefront')}
            className="font-display text-xl font-bold tracking-tight text-[#C2410C] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#C2410C]"
          >
            CampusBite
          </button>

          {/* Zone 2: 4 single-line nav links */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-7 text-sm font-medium text-[#54473C] md:flex"
          >
            <button
              type="button"
              onClick={() => scrollToSection('menu')}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-[#C2410C] hover:underline hover:underline-offset-4"
            >
              Menu
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('compare')}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-[#C2410C] hover:underline hover:underline-offset-4"
            >
              Why CampusBite
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('feedback')}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-[#C2410C] hover:underline hover:underline-offset-4"
            >
              Student Reviews
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('validation');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#C2410C] hover:underline hover:underline-offset-4 ${
                activeView === 'validation'
                  ? 'font-semibold text-[#C2410C] underline underline-offset-4'
                  : ''
              }`}
            >
              Validation Hub
            </button>
          </nav>

          {/* Zone 3: 1 Primary CTA */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsOrderDrawerOpen(true)}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#15803D] px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 text-white transition-colors hover:bg-[#166534] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15803D]"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Order Bag</span>
              <span className="font-mono tabular-nums">({totalBagCount})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Subtle Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed right-4 bottom-5 z-50 rounded-lg border border-[#C2410C] bg-[#1F1814] px-4 py-2.5 text-xs font-medium text-white shadow-lg"
        >
          {toastMessage}
        </div>
      )}

      {activeView === 'validation' ? (
        <ValidationHub
          orders={orders}
          feedbackList={feedbackList}
          gtmWeeks={gtmWeeks}
          onToggleWeekComplete={(weekNum) =>
            setGtmWeeks((prev) =>
              prev.map((w) => (w.week === weekNum ? { ...w, completed: !w.completed } : w))
            )
          }
          onBackToStorefront={() => {
            setActiveView('storefront');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : (
        <main>
          {/* Section 1: Storefront Hero Split */}
          <section className="mx-auto max-w-[1200px] px-4 pt-10 pb-8 sm:px-6 lg:px-8 lg:pt-14">
            <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
              {/* Left Narrative */}
              <div className="flex flex-col justify-between py-2 lg:col-span-7">
                <div>
                  <p className="text-xs font-semibold text-[#C2410C]">
                    Dehradun Hostel & PG Meal Service · Zero App Download Required
                  </p>

                  <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold tracking-tight text-balance text-[#1F1814] sm:text-5xl">
                    Homemade meals at{' '}
                    <span className="text-[#C2410C]">₹100</span>, delivered to your Dehradun hostel.
                  </h1>

                  <p className="mt-5 max-w-xl text-base leading-relaxed text-[#54473C]">
                    Built for 18–25 year-old college students tired of repetitive canteens and
                    expensive delivery fees. Order fresh, hygienic daily thalis and snacks in 30
                    seconds and confirm straight on WhatsApp.
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <button
                      type="button"
                      onClick={() => scrollToSection('menu')}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#C2410C] px-6 py-2.5 text-sm font-semibold whitespace-nowrap text-white shadow-sm transition-colors hover:bg-[#9A3412] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2410C]"
                    >
                      <span>Browse Today’s Menu</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveView('validation');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex min-h-[44px] items-center rounded-lg border border-[#DECBB3] bg-[#FFF6EB] px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-[#7C2D12] transition-colors hover:bg-[#FFEDD5]"
                    >
                      Open 30-Day Validation Hub
                    </button>
                  </div>
                </div>

                {/* Delivery Zone Quick Selector */}
                <div className="mt-8 rounded-xl border border-[#EAE1D3] bg-[#FFF8EF] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1F1814]">
                      <MapPin className="h-4 w-4 shrink-0 text-[#15803D]" />
                      <span>Active Drop Corridor:</span>
                    </div>
                    <select
                      aria-label="Select Dehradun hostel delivery corridor"
                      value={selectedZoneId}
                      onChange={(e) => setSelectedZoneId(e.target.value)}
                      className="h-10 rounded-lg border border-[#DECBB3] bg-white px-3 text-xs font-medium text-[#1F1814] focus:border-[#C2410C] focus:outline-none"
                    >
                      {CAMPUS_ZONES.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name} — {z.area}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-2 text-xs text-[#6B5B4D]">
                    Lunch drop {selectedZone.lunchWindow} · Dinner drop {selectedZone.dinnerWindow}{' '}
                    · <span className="font-semibold text-[#15803D]">Free hostel gate delivery</span>
                  </p>
                </div>
              </div>

              {/* Right Focal Showcase */}
              <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E6D9C7] bg-white shadow-sm lg:col-span-5">
                <DishIllustration
                  type="thali"
                  src={MENU_ITEMS[0].imageUrl}
                  alt={MENU_ITEMS[0].name}
                  className="h-64 w-full lg:h-72"
                />
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#6B5B4D]">
                      <span className="font-semibold text-[#C2410C]">
                        Flagship Student Meal · 620 kcal
                      </span>
                      <span className="font-mono font-semibold tabular-nums text-[#15803D]">
                        ₹100 / meal
                      </span>
                    </div>
                    <h2 className="mt-1.5 font-display text-xl font-semibold text-[#1F1814]">
                      Classic Ghar-Style Thali
                    </h2>
                    <p className="mt-2 text-xs leading-relaxed text-[#5E5247]">
                      Yellow dal tadka, seasonal sabzi, steamed jeera rice, 3 whole-wheat phulkas,
                      curd, and fresh kachumber.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => addToCart(MENU_ITEMS[0], 1, 'Homestyle')}
                    className="mt-5 flex min-h-[42px] w-full items-center justify-center rounded-lg bg-[#15803D] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#166534]"
                  >
                    Quick Add Thali to Bag · ₹100
                  </button>
                </div>
              </div>
            </div>

            {/* 4-Column Proof Strip */}
            <div className="mt-8 grid grid-cols-2 gap-4 rounded-xl border border-[#EAE1D3] bg-white px-6 py-5 lg:grid-cols-4">
              <div>
                <p className="font-mono text-xl font-semibold tabular-nums text-[#C2410C]">
                  ₹70 – ₹120
                </p>
                <p className="mt-0.5 text-xs text-[#6B5B4D]">Student-friendly meal range</p>
              </div>
              <div>
                <p className="font-mono text-xl font-semibold tabular-nums text-[#15803D]">₹0</p>
                <p className="mt-0.5 text-xs text-[#6B5B4D]">Delivery surcharge to hostels</p>
              </div>
              <div>
                <p className="font-mono text-xl font-semibold tabular-nums text-[#1F1814]">
                  {orders.length} / 20
                </p>
                <p className="mt-0.5 text-xs text-[#6B5B4D]">30-day pilot paying orders</p>
              </div>
              <div>
                <p className="font-mono text-xl font-semibold tabular-nums text-[#D97706]">
                  {avgSatisfaction} / 5.0
                </p>
                <p className="mt-0.5 text-xs text-[#6B5B4D]">
                  Avg rating ({feedbackList.length} reviews)
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Curated Limited Menu */}
          <section id="menu" className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight text-[#1F1814] sm:text-3xl">
                  Today’s Homemade Menu
                </h2>
                <p className="mt-1.5 text-sm text-[#5E5247]">
                  Curated small-batch menu for consistent taste, hygiene, and timely campus
                  dispatch.
                </p>
              </div>

              {/* Interactive Category Filter */}
              <div
                role="tablist"
                aria-label="Filter menu by category"
                className="inline-flex items-center gap-1 self-start rounded-lg bg-[#EFE7DB] p-1"
              >
                {(
                  [
                    { id: 'all', label: 'All Items' },
                    { id: 'meal', label: 'Daily Meals' },
                    { id: 'snack', label: 'Quick Snacks' },
                    { id: 'beverage', label: 'Beverages' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={categoryFilter === tab.id}
                    onClick={() => setCategoryFilter(tab.id)}
                    className={`min-h-[36px] rounded-md px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                      categoryFilter === tab.id
                        ? 'bg-[#C2410C] text-white shadow-xs'
                        : 'text-[#5E5247] hover:text-[#1F1814]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3-Column Product Grid */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMenu.map((item) => {
                const defaultCartEntry = cart.find(
                  (c) => c.item.id === item.id && c.spiceLevel === 'Homestyle'
                );

                return (
                  <article
                    key={item.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-[#E6D9C7] bg-white transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedMenuItem(item)}
                      className="block w-full text-left focus-visible:outline-2 focus-visible:outline-[#C2410C]"
                      aria-label={`View details for ${item.name}`}
                    >
                      <DishIllustration
                        type={item.illustrationKey}
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-52 w-full"
                      />
                    </button>

                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-[#6B5B4D]">
                          <span
                            className={`font-semibold ${
                              item.category === 'meal'
                                ? 'text-[#C2410C]'
                                : item.category === 'snack'
                                  ? 'text-[#B45309]'
                                  : 'text-[#15803D]'
                            }`}
                          >
                            {item.categoryLabel}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{item.slotLabel}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{item.calories}</span>
                        </div>

                        <div className="mt-2 flex items-baseline justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => setSelectedMenuItem(item)}
                            className="text-left font-display text-lg font-semibold text-[#1F1814] hover:text-[#C2410C]"
                          >
                            {item.name}
                          </button>
                          <span className="font-mono text-base font-semibold tabular-nums text-[#C2410C] shrink-0">
                            ₹{item.price}
                          </span>
                        </div>

                        <p className="mt-2 text-xs leading-relaxed text-[#5E5247]">
                          {item.shortDesc}
                        </p>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#F2EAE0] pt-4">
                        <button
                          type="button"
                          onClick={() => setSelectedMenuItem(item)}
                          className="text-xs font-medium text-[#6B5B4D] hover:text-[#C2410C] hover:underline"
                        >
                          Ingredients & Spice
                        </button>

                        {defaultCartEntry ? (
                          <div className="flex items-center rounded-lg border border-[#15803D] bg-[#EDF7F0]">
                            <button
                              type="button"
                              onClick={() => updateCartQty(item.id, 'Homestyle', -1)}
                              aria-label={`Decrease quantity of ${item.name}`}
                              className="flex h-9 w-9 items-center justify-center text-[#15803D] hover:bg-[#D8EFE0]"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-7 text-center font-mono text-xs font-semibold tabular-nums text-[#15803D]">
                              {defaultCartEntry.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQty(item.id, 'Homestyle', 1)}
                              aria-label={`Increase quantity of ${item.name}`}
                              className="flex h-9 w-9 items-center justify-center text-[#15803D] hover:bg-[#D8EFE0]"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addToCart(item, 1, 'Homestyle')}
                            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-[#15803D] px-4 py-2 text-xs font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#166534]"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add to Bag</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Section 3: Why Students Switch & Referral Perks */}
          <section id="compare" className="border-y border-[#EAE1D3] bg-[#FFF9F0] py-14">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-[#1F1814]">
                    Why hostel & PG students switch to CampusBite
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#5E5247]">
                    Students in Dehradun usually choose between repetitive college canteens,
                    expensive food-delivery apps, or rigid monthly tiffins. CampusBite bridges all
                    three.
                  </p>

                  <div className="mt-6 rounded-xl border border-[#C6E0CE] bg-[#EDF7F0] p-5">
                    <p className="text-xs font-semibold text-[#15803D]">
                      Hostel Referral Offer · Save ₹15
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#2D4A37]">
                      Share code <span className="font-mono font-semibold text-[#15803D]">DGU15</span>{' '}
                      in your hostel WhatsApp group to save ₹15 on your first ₹100 meal order.
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyReferral}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-[#A3D1B2] bg-white px-3 py-1.5 text-xs font-semibold text-[#15803D] hover:bg-[#F5FBF7]"
                    >
                      {copiedReferral ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-[#15803D]" />
                          <span>Copied DGU15</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Referral Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  <div className="overflow-x-auto rounded-xl border border-[#E6D9C7] bg-white">
                    <table className="w-full min-w-[580px] text-left text-xs">
                      <thead className="border-b border-[#E6D9C7] bg-[#FAF4EA] text-[#6B5B4D]">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Option</th>
                          <th className="px-4 py-3 font-semibold">Typical Cost</th>
                          <th className="px-4 py-3 font-semibold">What Works</th>
                          <th className="px-4 py-3 font-semibold">Student Pain Point</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2EAE0] bg-white">
                        {COMPETITOR_BATTLEFIELD.map((row) => {
                          const isOurs = row.type === 'Our Venture';
                          return (
                            <tr
                              key={row.id}
                              className={isOurs ? 'bg-[#EDF7F0]/70 font-medium' : ''}
                            >
                              <td className="px-4 py-3.5 text-[#1F1814]">
                                <span className={isOurs ? 'font-semibold text-[#15803D]' : ''}>
                                  {row.name}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 font-mono tabular-nums text-[#C2410C]">
                                {row.priceRange}
                              </td>
                              <td className="px-4 py-3.5 text-[#4F453C]">{row.strength}</td>
                              <td className="px-4 py-3.5 text-[#6B5B4D]">{row.weakness}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Student Feedback & Repeat-Order Validation */}
          <section id="feedback" className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
              {/* Verified Student Reviews */}
              <div className="lg:col-span-7">
                <h2 className="font-display text-2xl font-semibold tracking-tight text-[#1F1814]">
                  Student Feedback from Dehradun Hostels
                </h2>
                <p className="mt-1.5 text-sm text-[#5E5247]">
                  Every post-delivery rating checks taste, hygiene, and whether ₹100 fits a daily
                  student budget.
                </p>

                <div className="mt-6 space-y-4">
                  {feedbackList.slice(0, 5).map((fb) => (
                    <div
                      key={fb.id}
                      className="rounded-xl border border-[#E6D9C7] bg-white p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-[#1F1814]">{fb.studentName}</p>
                          <p className="text-xs text-[#6B5B4D]">
                            {fb.hostelArea} · Ordered {fb.mealOrdered}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 font-mono text-xs font-semibold tabular-nums text-[#D97706]">
                          <Star className="h-3.5 w-3.5 fill-[#D97706] text-[#D97706]" />
                          <span>{fb.rating}.0 / 5</span>
                        </div>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-[#423830]">{fb.comment}</p>

                      <p className="mt-3 text-xs text-[#6B5B4D]">
                        <span className="font-medium text-[#15803D]">
                          {fb.findsPriceAffordable ? 'Confirmed ₹100 affordable' : 'Price sensitive'}
                        </span>{' '}
                        · {fb.willRepeatOrder ? 'Will repeat order' : 'One-time trial'} ·{' '}
                        <span className="font-mono tabular-nums">{fb.submittedAt}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Post-Meal Feedback Form */}
              <div className="lg:col-span-5">
                <form
                  onSubmit={handleSubmitFeedback}
                  className="rounded-2xl border border-[#E6D9C7] bg-white p-6 shadow-xs"
                >
                  <h3 className="font-display text-xl font-semibold text-[#1F1814]">
                    Rate Your CampusBite Meal
                  </h3>
                  <p className="mt-1 text-xs text-[#5E5247]">
                    Help us refine portions, taste, and pricing during our 30-day Dehradun pilot.
                  </p>

                  <div className="mt-5 space-y-4">
                    <div>
                      <label htmlFor="fb-name" className="block text-xs font-medium text-[#4F453C]">
                        Student Name
                      </label>
                      <input
                        id="fb-name"
                        type="text"
                        value={fbName}
                        onChange={(e) => setFbName(e.target.value)}
                        placeholder="e.g. Rohan Bisht"
                        className="mt-1.5 h-10 w-full rounded-lg border border-[#DECBB3] bg-[#FBF9F5] px-3 text-sm text-[#1F1814] focus:border-[#C2410C] focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="fb-hostel" className="block text-xs font-medium text-[#4F453C]">
                        Hostel / PG Area
                      </label>
                      <input
                        id="fb-hostel"
                        type="text"
                        value={fbHostel}
                        onChange={(e) => setFbHostel(e.target.value)}
                        placeholder="e.g. DGU Hostel or Prem Nagar PG"
                        className="mt-1.5 h-10 w-full rounded-lg border border-[#DECBB3] bg-[#FBF9F5] px-3 text-sm text-[#1F1814] focus:border-[#C2410C] focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="fb-meal" className="block text-xs font-medium text-[#4F453C]">
                        Meal Ordered
                      </label>
                      <select
                        id="fb-meal"
                        value={fbMeal}
                        onChange={(e) => setFbMeal(e.target.value)}
                        className="mt-1.5 h-10 w-full rounded-lg border border-[#DECBB3] bg-[#FBF9F5] px-3 text-sm text-[#1F1814] focus:border-[#C2410C] focus:bg-white focus:outline-none"
                      >
                        {MENU_ITEMS.map((m) => (
                          <option key={m.id} value={m.name}>
                            {m.name} (₹{m.price})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="block text-xs font-medium text-[#4F453C]">
                        Overall Satisfaction (1–5)
                      </span>
                      <div className="mt-1.5 flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setFbRating(num)}
                            className={`flex h-10 flex-1 items-center justify-center rounded-lg border font-mono text-xs font-semibold transition-colors ${
                              fbRating === num
                                ? 'border-[#D97706] bg-[#D97706] text-white'
                                : 'border-[#DECBB3] bg-white text-[#4F453C] hover:border-[#D97706]'
                            }`}
                          >
                            {num}★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 pt-1 text-xs text-[#4F453C]">
                      <label className="flex cursor-pointer items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={fbAffordable}
                          onChange={(e) => setFbAffordable(e.target.checked)}
                          className="h-4 w-4 rounded border-[#DECBB3] accent-[#15803D]"
                        />
                        <span>The ₹70–₹120 meal price feels affordable for regular orders</span>
                      </label>

                      <label className="flex cursor-pointer items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={fbRepeat}
                          onChange={(e) => setFbRepeat(e.target.checked)}
                          className="h-4 w-4 rounded border-[#DECBB3] accent-[#15803D]"
                        />
                        <span>I would order again or recommend to hostel friends</span>
                      </label>
                    </div>

                    <div>
                      <label htmlFor="fb-comment" className="block text-xs font-medium text-[#4F453C]">
                        Meal Review
                      </label>
                      <textarea
                        id="fb-comment"
                        rows={3}
                        value={fbComment}
                        onChange={(e) => setFbComment(e.target.value)}
                        placeholder="How was taste, hygiene, packaging, and delivery timing?"
                        className="mt-1.5 w-full rounded-lg border border-[#DECBB3] bg-[#FBF9F5] p-3 text-sm text-[#1F1814] focus:border-[#C2410C] focus:bg-white focus:outline-none"
                      />
                    </div>

                    {fbError && (
                      <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-xs text-[#991B1B]">
                        {fbError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="min-h-[44px] w-full rounded-lg bg-[#C2410C] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#9A3412]"
                    >
                      Submit Student Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Clean Footer */}
      <footer className="border-t border-[#EAE1D3] bg-[#FFF9F0] py-8">
        <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-4 px-4 text-xs text-[#6B5B4D] sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div>
            <p className="font-semibold text-[#1F1814]">
              CampusBite · Dehradun Student Meal Venture
            </p>
            <p className="mt-0.5">
              DGU Venture Quest · DBS Global University · riya.0251mba003@dgu.ac.in
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => {
                setActiveView('validation');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-medium text-[#C2410C] hover:underline"
            >
              Validation & Economics Hub
            </button>
            <a
              href="/assets/aistudio/riya.0251mba003_dgu.ac.in_bf0e05eb.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#1F1814] hover:underline"
            >
              Original Venture Plan (PDF)
            </a>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <MenuModal
        item={selectedMenuItem}
        onClose={() => setSelectedMenuItem(null)}
        onAddToCart={addToCart}
      />

      <OrderDrawer
        isOpen={isOrderDrawerOpen}
        onClose={() => setIsOrderDrawerOpen(false)}
        cart={cart}
        onUpdateQty={updateCartQty}
        onRemoveItem={removeFromCart}
        onPlaceOrder={handlePlaceOrder}
        onJumpToFeedback={(name, meal) => {
          setFbName(name);
          setFbMeal(meal);
          scrollToSection('feedback');
        }}
      />
    </div>
  );
}
