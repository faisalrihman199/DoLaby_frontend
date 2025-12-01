import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdEventSeat, MdWbSunny, MdLocalLaundryService } from "react-icons/md";

function SizePill({ label, active = false, disabled = false }) {
  const base =
    "px-2.5 py-1 text-[12px] font-bold rounded-md border select-none";
  const cls = disabled && !active
    ? "bg-[#e9eef3] text-[#9fb0c0] border-[#d6e0ea]"
    : active
      ? "bg-[#d9e6f2] text-[#2b4966] border-[#b4cde4]"
      : "bg-[#e9eef3] text-[#9fb0c0] border-[#d6e0ea]";
  return <span className={`${base} ${cls}`}>{label}</span>;
}

export default function AddClothPreview({ data }) {
  const location = useLocation();
  const navigate = useNavigate();
  const state = data || location.state || {};

  const {
    title = "White Shirts casual",
    imageUrl = null,
    size = "XL",
    category = "Shirts",
    status = "Clean",
    events = ["Summer", "Beach", "casual"],
  } = state;

  const goBack = () => navigate(-1);

  return (
    <>
      <h1 className="text-2xl text-center kanit md:text-3xl text-color-primary mb-4">
        Add Clothes
      </h1>
      <div className="w-full h-0.5 bg-[color:var(--text-color-primary)] mb-4"></div>
      <div
        className="min-h-screen w-full flex flex-col"
        style={{
          background:
            "linear-gradient(180deg, #E3ECF6 0%, #DDE8F1 27.4%, #E9F0F5 68.27%, #EEF2F8 100%)",
        }}
      >
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 flex-1 flex flex-col overflow-y-auto" style={{ maxWidth: '708px' }}>

          {/* Top status line */}
          <div className="text-black font-[400] text-[28px] mb-2 ">Uploaded</div>

          {/* Saved message (shown after successful save) */}
          {state.saved && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">
              {state.savedMessage || 'Saved successfully'}
            </div>
          )}

          {/* Image preview box - compact */}
          <div className="w-full rounded-md border border-[#2b4966] p-3 bg-white/50 mb-4">
            <div className="relative h-56 sm:h-64 md:h-72 rounded-sm border border-[#2b4966] bg-white overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Uploaded cloth"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#2b4966]/60">
                  No image provided
                </div>
              )}
              {/* bottom-left overlay icons - smaller */}
              <div className="absolute left-3 bottom-3 flex items-center gap-3 text-[#2b4966]">
                <MdEventSeat className="text-lg opacity-80" />
                <MdLocalLaundryService className="text-lg opacity-80" />
                <MdWbSunny className="text-lg opacity-80" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl md:text-[28px] font-extrabold text-color-primary mb-4">
            {title} <span className="font-semibold">added</span>
          </h1>

          {/* Details - compact spacing */}
          <div className="space-y-3 text-[#1A3557] mb-6 flex-1">
            {/* Size */}
            <div>
              <div className="text-lg sm:text-xl font-semibold mb-1.5">Size</div>
              <div className="flex gap-1.5 flex-wrap">
                {["S", "M", "L", "XL", "XXL"].map((s) => (
                  <SizePill
                    key={s}
                    label={s}
                    active={s === size}
                    disabled={s !== size}
                  />
                ))}
              </div>
            </div>

            {/* Category */}
            <CompactRow label="Category" value={category} />

            {/* Status */}
            <CompactRow label="Status" value={status} />

            {/* Events */}
            <div>
              <div className="text-lg sm:text-xl font-semibold mb-1">Events</div>
              <div className="flex flex-wrap gap-2 text-sm sm:text-base">
                {events && events.length > 0 ? (
                  events.map((e) => (
                    <span key={e} className="font-semibold text-[#1A3557]">
                      @{e}
                    </span>
                  ))
                ) : (
                  <span className="text-[#58718a]">—</span>
                )}
              </div>
            </div>
          </div>

          {/* Actions - sticky or bottom */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 w-full pt-4 border-t border-[#2b4966]/20">
            <button
              className="px-4 py-2.5 rounded-md bg-[#d8d8d8] text-[#2b4966] font-semibold shadow-sm hover:opacity-90 text-sm sm:text-base transition-all"
              onClick={() => {
                // TODO: call your API here; for now just go back
                goBack();
              }}
            >
              Save
            </button>
            <button
              className="px-4 py-2.5 rounded-md bg-[#d8d8d8] text-[#2b4966] font-semibold shadow-sm hover:opacity-90 text-sm sm:text-base transition-all"
              onClick={goBack}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* Helper component for compact rows */
function CompactRow({ label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="min-w-24 sm:min-w-28 text-base sm:text-lg font-bold">
        {label}
      </div>
      <div className="text-base sm:text-lg ">{value || '—'}</div>
    </div>
  );
}