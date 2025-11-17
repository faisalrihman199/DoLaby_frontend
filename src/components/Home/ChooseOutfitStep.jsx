import React, { useMemo, useState } from "react";
import { TopIcon, BottomIcon, ShoesIcon, SelectIcon } from "./icons/Icons";

/**
 * Props:
 *  onTabChange?: (tab: 'Top'|'Bottom'|'Shoes') => void
 *  onDropItem?:  ({ type: 'Top'|'Bottom'|'Shoes', data: {id, name, src}, file?: File }) => void
 *  onImageUpload?: (file: File, type: string) => Promise<string>
 *  gallery?: { Top: ImgItem[]; Bottom: ImgItem[]; Shoes: ImgItem[] }
 * 
 * ImgItem = { id: string; name: string; src: string }  // src is an image URL (png/jpg/svg/dataURI)
 */
export default function ChooseOutfitStep({ onTabChange, onDropItem, onImageUpload, gallery }) {
  const [tab, setTab] = useState("Top");
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);
  const [selected, setSelected] = useState({
    Top: null,
    Bottom: null,
    Shoes: null,
  });

  // ----- Dummy gallery (replace with your own URLs later) -----
  const fallbackGallery = useDummyGallery();
  const g = gallery || fallbackGallery;

  // tabs
  const handleTab = (t) => {
    setTab(t);
    onTabChange?.(t);
  };

  // drop-area (kept, but primary flow is click to open gallery)
  const onDragOver = (e) => {
    e.preventDefault();
    setHover(true);
  };
  const onDragLeave = () => setHover(false);
  const onDrop = (e) => {
    e.preventDefault();
    setHover(false);
    try {
      const raw = e.dataTransfer.getData("text/plain");
      if (raw) {
        const data = JSON.parse(raw);
        applySelection(tab, data);
      }
    } catch {
      /* ignore */
    }
  };

  // choose from gallery
  const applySelection = (part, item) => {
    setSelected((s) => ({ ...s, [part]: item }));
    onDropItem?.({ type: part, data: item });
    setOpen(false);
  };

  // Handle file upload from browse
  const handleFileUpload = async (files) => {
    const file = files?.[0];
    if (!file || !onImageUpload) return;

    try {
      setUploading(true);
      const reader = new FileReader();
      
      reader.onload = async () => {
        const preview = reader.result;
        const tempItem = {
          id: `${tab.toLowerCase()}-${Date.now()}`,
          name: file.name,
          src: preview
        };
        
        // Set preview immediately
        setSelected((s) => ({ ...s, [tab]: tempItem }));
        
        // Notify parent with file for upload
        onDropItem?.({ type: tab, data: tempItem, file });
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error handling file:', err);
      alert('Failed to process image');
    } finally {
      setUploading(false);
      // Reset the file input so selecting the same file again will fire change
      try {
        if (fileInputRef?.current) fileInputRef.current.value = '';
      } catch (e) {
        /* ignore */
      }
    }
  };

  return (
    <div className="rounded-[22px] bg-white p-4 md:p-5 shadow-sm ring-1 ring-[#cfe0f2]/70">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#12396F] text-[25px] font-bold text-white">
          1
        </span>
        <h3 className="text-[20px] md:text-[30px] font-semibold text-[#12396F] kantumruy leading-tight">
          Choose Outfit
        </h3>
      </div>

      {/* ONE-ROW tabs (icon/preview on top, label below) */}
      <div className="mb-5 grid grid-cols-3 gap-3 md:gap-4">
        <BigTab
          active={tab === "Top"}
          onClick={() => handleTab("Top")}
          label="Top"
          // If selected.Top exists, show its image with fixed size; else show icon
          visual={
            selected.Top ? (
              <img
                src={selected.Top.src}
                alt={selected.Top.name}
                className="h-10 w-10 object-contain"
              />
            ) : (
              <TopIcon className="h-10 w-10" />
            )
          }
        />
        <BigTab
          active={tab === "Bottom"}
          onClick={() => handleTab("Bottom")}
          label="Bottom"
          visual={
            selected.Bottom ? (
              <img
                src={selected.Bottom.src}
                alt={selected.Bottom.name}
                className="h-10 w-10 object-contain"
              />
            ) : (
              <BottomIcon className="h-10 w-10" />
            )
          }
        />
        <BigTab
          active={tab === "Shoes"}
          onClick={() => handleTab("Shoes")}
          label="Shoes"
          visual={
            selected.Shoes ? (
              <img
                src={selected.Shoes.src}
                alt={selected.Shoes.name}
                className="h-10 w-10 object-contain"
              />
            ) : (
              <ShoesIcon className="h-10 w-10" />
            )
          }
        />
      </div>

      {/* Select from wardrobe / Drop zone / Upload */}
      <div className="relative">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`flex h-[260px] md:h-[280px] w-full flex-col items-center justify-center rounded-[18px] border-2 border-dashed text-center transition
          ${hover ? "border-[#3B82F6] bg-[#EAF2FF]" : "border-[#cfe0f2] bg-white/60"}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-blue-900"></div>
              <p className="mt-4 text-xl kantumruy text-blue-900">Uploading {tab}...</p>
            </>
          ) : selected[tab] ? (
            <>
              <img 
                src={selected[tab].src} 
                alt={selected[tab].name}
                className="h-48 w-auto object-contain"
              />
              <p className="mt-2 text-lg kantumruy text-blue-900">{selected[tab].name}</p>
            </>
          ) : (
            <>
              <SelectIcon className="h-[200px] w-[150px] text-[#12396F]" />
              <p className="mt-2 w-full text-2xl px-4 kantumruy text-blue-900/50">
                Click to upload {tab.toLowerCase()} image
              </p>
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
        />
        
        {selected[tab] && !uploading && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelected((s) => ({ ...s, [tab]: null }));
              // Notify parent that this part was removed so it can clear uploads / try-on state
              onDropItem?.({ type: tab, data: null });
            }}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Gallery modal - Optional for future use */}
      {/* {open && (
        <GalleryModal
          title={`Select ${tab}`}
          items={g[tab]}
          onClose={() => setOpen(false)}
          onPick={(item) => applySelection(tab, item)}
        />
      )} */}
    </div>
  );
}

/* ======= UI bits ======= */

function BigTab({ active, onClick, visual, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[92px] w-full flex-col items-center justify-center gap-2 rounded-lg border text-[18px] font-semibold transition
        ${
          active
            ? "bg-[#12396F] text-white border-[#0e2d58]"
            : "bg-[#EEF5FF] text-[#12396F] border-[#d7e6fb] hover:bg-[#dfeaff]"
        }`}
    >
      {/* fixed box so replacement image never changes layout */}
      <div className="flex h-10 w-10 items-center justify-center">
        {visual}
      </div>
      <span className="leading-none">{label}</span>
    </button>
  );
}

function GalleryModal({ title, items, onPick, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-lg font-semibold text-[#12396F]">{title}</h4>
          <button
            className="rounded-md px-2 py-1 text-sm font-semibold text-[#12396F] hover:bg-blue-50"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {items.map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => onPick(it)}
              className="group rounded-xl border border-blue-100 bg-white p-2 hover:border-blue-300 hover:bg-blue-50"
              title={it.name}
            >
              <img
                src={it.src}
                alt={it.name}
                className="h-20 w-full rounded-lg object-contain"
              />
              <div className="mt-1 truncate text-center text-xs font-medium text-[#12396F]">
                {it.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ======= Dummy data helpers (replace with your real images later) ======= */

function useDummyGallery() {
  // returns data-URI SVG swatches with text; replace with real PNG/JPG URLs later
  const make = (label, fill, text = "#0f2d59") =>
    `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='120'>
         <rect width='100%' height='100%' rx='12' ry='12' fill='${fill}'/>
         <text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle'
               font-family='Inter, Arial' font-size='16' fill='${text}'>${label}</text>
       </svg>`
    )}`;

  return useMemo(
    () => ({
      Top: [
        { id: "top-1", name: "White Tee", src: make("White Tee", "#f7f7f7", "#12396F") },
        { id: "top-2", name: "Navy Blouse", src: make("Navy Blouse", "#dbeafe", "#12396F") },
        { id: "top-3", name: "Black Crop", src: make("Black Crop", "#e5e7eb", "#12396F") },
      ],
      Bottom: [
        { id: "bot-1", name: "Blue Jeans", src: make("Blue Jeans", "#dbeafe", "#12396F") },
        { id: "bot-2", name: "Beige Pants", src: make("Beige Pants", "#f3f4f6", "#12396F") },
        { id: "bot-3", name: "Black Skirt", src: make("Black Skirt", "#e5e7eb", "#12396F") },
      ],
      Shoes: [
        { id: "sh-1", name: "White Sneakers", src: make("White Sneakers", "#f9fafb", "#12396F") },
        { id: "sh-2", name: "Brown Heels", src: make("Brown Heels", "#fde68a", "#12396F") },
        { id: "sh-3", name: "Black Loafers", src: make("Black Loafers", "#e5e7eb", "#12396F") },
      ],
    }),
    []
  );
}
