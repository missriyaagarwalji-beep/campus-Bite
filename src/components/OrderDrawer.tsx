import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, Check, Copy, ExternalLink, MessageSquare } from 'lucide-react';
import { CAMPUS_ZONES, CartItem, PilotOrder } from '../data/campusBiteData';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (itemId: string, spiceLevel: CartItem['spiceLevel'], delta: number) => void;
  onRemoveItem: (itemId: string, spiceLevel: CartItem['spiceLevel']) => void;
  onPlaceOrder: (order: Omit<PilotOrder, 'id' | 'createdAt' | 'whatsappText'>) => PilotOrder;
  onJumpToFeedback: (studentName: string, mealOrdered: string) => void;
}

export const OrderDrawer: React.FC<OrderDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onPlaceOrder,
  onJumpToFeedback,
}) => {
  const [studentName, setStudentName] = useState('');
  const [hostelZone, setHostelZone] = useState(CAMPUS_ZONES[0].name);
  const [roomDetails, setRoomDetails] = useState('');
  const [slot, setSlot] = useState<'Lunch (12:30–1:30 PM)' | 'Dinner (7:30–8:30 PM)'>(
    'Lunch (12:30–1:30 PM)'
  );
  const [paymentMode, setPaymentMode] = useState<'UPI on Delivery' | 'Cash on Delivery'>(
    'UPI on Delivery'
  );
  const [isRepeatCustomer, setIsRepeatCustomer] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [formError, setFormError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<PilotOrder | null>(null);
  const [copiedSlip, setCopiedSlip] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, c) => acc + c.item.price * c.quantity, 0);
  const referralDiscount = referralCode.trim().length >= 4 ? 15 : 0;
  const finalTotal = Math.max(0, subtotal - referralDiscount);

  const selectedZoneObj = CAMPUS_ZONES.find((z) => z.name === hostelZone) ?? CAMPUS_ZONES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!studentName.trim() || !roomDetails.trim()) {
      setFormError('Please enter your name and hostel/PG room details for delivery.');
      return;
    }

    setFormError('');
    const created = onPlaceOrder({
      studentName: studentName.trim(),
      hostelZone,
      roomDetails: roomDetails.trim(),
      slot,
      paymentMode,
      items: cart.map((c) => ({
        name: c.item.name,
        quantity: c.quantity,
        price: c.item.price,
        spiceLevel: c.spiceLevel,
      })),
      total: finalTotal,
      isRepeatCustomer,
      referralCodeUsed: referralCode.trim() || undefined,
    });

    setConfirmedOrder(created);
  };

  const handleCopyWhatsApp = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSlip(true);
      setTimeout(() => setCopiedSlip(false), 2000);
    } catch {
      setCopiedSlip(false);
    }
  };

  const resetAndClose = () => {
    setConfirmedOrder(null);
    setCopiedSlip(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-label="CampusBite Order Bag"
      onClick={resetAndClose}
    >
      <div
        className="flex h-full w-full max-w-lg flex-col border-l border-[#E4E4E0] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#ECECE8] px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-[#141715]">
              {confirmedOrder ? 'Order Confirmed' : 'Your Meal Bag'}
            </h2>
            <p className="text-xs text-[#5C635E]">
              {confirmedOrder
                ? 'Ready for WhatsApp kitchen dispatch'
                : 'Zero delivery fee · Dehradun Hostel & PG Pilot'}
            </p>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            aria-label="Close order drawer"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E4E4E0] text-[#141715] hover:bg-[#F2F1EC]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {confirmedOrder ? (
            <div className="space-y-6">
              <div className="rounded-xl border border-[#B8DFC5] bg-[#EDF7F0] p-5">
                <div className="flex items-center gap-2.5 text-sm font-semibold text-[#15803D]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#15803D] text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    Order {confirmedOrder.id} Logged — {confirmedOrder.slot}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#2D4A37]">
                  Your order has been added to today’s Dehradun hostel dispatch list and recorded in
                  the 30-day validation tracker. Send the pre-filled WhatsApp slip below to confirm
                  kitchen prep.
                </p>
              </div>

              <div className="rounded-xl border border-[#E6D9C7] bg-[#FFF8EF] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1F1814]">
                    WhatsApp Order Slip
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyWhatsApp(confirmedOrder.whatsappText)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[#DECBB3] bg-white px-2.5 py-1 text-xs font-medium text-[#1F1814] hover:bg-[#FFF6EB]"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copiedSlip ? 'Copied' : 'Copy Text'}</span>
                  </button>
                </div>
                <pre className="mt-3 whitespace-pre-wrap font-mono text-xs leading-relaxed text-[#423830]">
                  {confirmedOrder.whatsappText}
                </pre>
              </div>

              <div className="space-y-2 border-t border-[#EFE7DB] pt-4 text-sm">
                <div className="flex justify-between text-[#6B5B4D]">
                  <span>Student</span>
                  <span className="font-medium text-[#1F1814]">{confirmedOrder.studentName}</span>
                </div>
                <div className="flex justify-between text-[#6B5B4D]">
                  <span>Drop Location</span>
                  <span className="text-right font-medium text-[#1F1814]">
                    {confirmedOrder.roomDetails}, {confirmedOrder.hostelZone}
                  </span>
                </div>
                <div className="flex justify-between text-[#6B5B4D]">
                  <span>Payment Mode</span>
                  <span className="font-medium text-[#1F1814]">{confirmedOrder.paymentMode}</span>
                </div>
                <div className="flex justify-between border-t border-[#EFE7DB] pt-2 text-base font-semibold text-[#1F1814]">
                  <span>Total Payable</span>
                  <span className="font-mono tabular-nums text-[#C2410C]">
                    ₹{confirmedOrder.total}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(confirmedOrder.whatsappText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#15803D] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#166534]"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Send Order on WhatsApp</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    const firstMeal = confirmedOrder.items[0]?.name || 'Classic Ghar-Style Thali';
                    const name = confirmedOrder.studentName;
                    resetAndClose();
                    onJumpToFeedback(name, firstMeal);
                  }}
                  className="flex min-h-[44px] w-full items-center justify-center rounded-lg border border-[#DECBB3] bg-white px-4 py-2.5 text-sm font-medium text-[#1F1814] hover:bg-[#FFF8EF]"
                >
                  Rate Meal & Affordability After Delivery
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <p className="font-display text-lg font-semibold text-[#141715]">
                Your meal bag is empty
              </p>
              <p className="mt-2 max-w-xs text-sm text-[#5C635E]">
                Add our signature ₹100 Ghar-Style Thali, Rajma Chawal, or evening snacks to place a
                WhatsApp hostel order.
              </p>
              <button
                type="button"
                onClick={resetAndClose}
                className="mt-6 rounded-lg bg-[#1B4332] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#143326]"
              >
                Browse Today’s Menu
              </button>
            </div>
          ) : (
            <form id="campusbite-order-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="divide-y divide-[#ECECE8] border-b border-[#ECECE8] pb-4">
                {cart.map((entry) => (
                  <div
                    key={`${entry.item.id}-${entry.spiceLevel}`}
                    className="flex items-center justify-between gap-4 py-3.5 first:pt-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#141715]">
                        {entry.item.name}
                      </p>
                      <p className="mt-0.5 text-xs text-[#5C635E]">
                        {entry.spiceLevel} · <span className="font-mono tabular-nums">₹{entry.item.price}</span> each
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center rounded-lg border border-[#E4E4E0] bg-[#FAF9F6]">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(entry.item.id, entry.spiceLevel, -1)}
                          aria-label={`Decrease quantity of ${entry.item.name}`}
                          className="flex h-9 w-8 items-center justify-center text-[#141715] hover:bg-[#ECECE8]"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center font-mono text-xs font-semibold tabular-nums">
                          {entry.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(entry.item.id, entry.spiceLevel, 1)}
                          aria-label={`Increase quantity of ${entry.item.name}`}
                          className="flex h-9 w-8 items-center justify-center text-[#141715] hover:bg-[#ECECE8]"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(entry.item.id, entry.spiceLevel)}
                        aria-label={`Remove ${entry.item.name}`}
                        className="flex h-9 w-8 items-center justify-center rounded-lg text-[#757C77] hover:bg-[#F2F1EC] hover:text-[#B91C1C]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#141715]">Hostel & PG Delivery Details</h3>

                <div className="grid grid-cols-1 gap-3.5">
                  <div>
                    <label htmlFor="student-name" className="block text-xs font-medium text-[#454B47]">
                      Your Name
                    </label>
                    <input
                      id="student-name"
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Riya Agarwal"
                      className="mt-1.5 h-10 w-full rounded-lg border border-[#D8DAD5] bg-white px-3 text-sm text-[#141715] placeholder:text-[#8E9590] focus:border-[#1B4332] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="hostel-zone" className="block text-xs font-medium text-[#454B47]">
                      Dehradun Campus / PG Zone
                    </label>
                    <select
                      id="hostel-zone"
                      value={hostelZone}
                      onChange={(e) => setHostelZone(e.target.value)}
                      className="mt-1.5 h-10 w-full rounded-lg border border-[#D8DAD5] bg-white px-3 text-sm text-[#141715] focus:border-[#1B4332] focus:outline-none"
                    >
                      {CAMPUS_ZONES.map((z) => (
                        <option key={z.id} value={z.name}>
                          {z.name} ({z.area})
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-[#5C635E]">
                      Lunch drop: {selectedZoneObj.lunchWindow} · Dinner drop: {selectedZoneObj.dinnerWindow}
                    </p>
                  </div>

                  <div>
                    <label htmlFor="room-details" className="block text-xs font-medium text-[#454B47]">
                      Hostel / PG Name & Room or Gate
                    </label>
                    <input
                      id="room-details"
                      type="text"
                      value={roomDetails}
                      onChange={(e) => setRoomDetails(e.target.value)}
                      placeholder="e.g. DGU Girls Hostel Block A, Room 108"
                      className="mt-1.5 h-10 w-full rounded-lg border border-[#D8DAD5] bg-white px-3 text-sm text-[#141715] placeholder:text-[#8E9590] focus:border-[#1B4332] focus:outline-none"
                    />
                  </div>

                  <div>
                    <span className="block text-xs font-medium text-[#454B47]">Delivery Slot</span>
                    <div className="mt-1.5 grid grid-cols-2 gap-2">
                      {(
                        ['Lunch (12:30–1:30 PM)', 'Dinner (7:30–8:30 PM)'] as const
                      ).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSlot(opt)}
                          className={`min-h-[40px] rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                            slot === opt
                              ? 'border-[#1B4332] bg-[#1B4332] text-white'
                              : 'border-[#D8DAD5] bg-white text-[#454B47] hover:border-[#9CA39E]'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="block text-xs font-medium text-[#454B47]">Payment</span>
                      <select
                        aria-label="Payment Mode"
                        value={paymentMode}
                        onChange={(e) =>
                          setPaymentMode(
                            e.target.value as 'UPI on Delivery' | 'Cash on Delivery'
                          )
                        }
                        className="mt-1.5 h-10 w-full rounded-lg border border-[#D8DAD5] bg-white px-2.5 text-xs text-[#141715] focus:border-[#1B4332] focus:outline-none"
                      >
                        <option value="UPI on Delivery">UPI on Delivery</option>
                        <option value="Cash on Delivery">Cash on Delivery</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="ref-code" className="block text-xs font-medium text-[#454B47]">
                        Referral Code (Optional)
                      </label>
                      <input
                        id="ref-code"
                        type="text"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                        placeholder="DGU15"
                        className="mt-1.5 h-10 w-full rounded-lg border border-[#D8DAD5] bg-white px-3 font-mono text-xs uppercase text-[#141715] placeholder:text-[#8E9590] focus:border-[#1B4332] focus:outline-none"
                      />
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-center gap-2.5 pt-1 text-xs text-[#454B47]">
                    <input
                      type="checkbox"
                      checked={isRepeatCustomer}
                      onChange={(e) => setIsRepeatCustomer(e.target.checked)}
                      className="h-4 w-4 rounded border-[#D8DAD5] accent-[#1B4332]"
                    />
                    <span>I have ordered from CampusBite before (repeat customer)</span>
                  </label>
                </div>

                {formError && (
                  <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-xs text-[#991B1B]">
                    {formError}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>

        {!confirmedOrder && cart.length > 0 && (
          <div className="border-t border-[#ECECE8] bg-[#FAF9F6] px-6 py-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#5C635E]">
                <span>Meal Subtotal</span>
                <span className="font-mono tabular-nums text-[#141715]">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-[#5C635E]">
                <span>Hostel / PG Delivery</span>
                <span className="font-medium text-[#1B4332]">Free</span>
              </div>
              {referralDiscount > 0 && (
                <div className="flex justify-between text-[#1B4332]">
                  <span>Student Referral Discount</span>
                  <span className="font-mono tabular-nums">-₹{referralDiscount}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-[#E4E4E0] pt-2 text-sm font-semibold text-[#141715]">
                <span>Total Payable on Delivery</span>
                <span className="font-mono tabular-nums text-[#1B4332]">₹{finalTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              form="campusbite-order-form"
              className="mt-4 flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#1B4332] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#143326] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B4332]"
            >
              Confirm Order & Generate WhatsApp Slip
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
