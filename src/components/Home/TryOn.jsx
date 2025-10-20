import React, { useRef, useState } from "react";
import ChooseOutfitStep from "./ChooseOutfitStep";
import { CameraIcon, SparklesIcon } from "./icons/Icons";

/* Step 2: upload */
function UploadPhotoStep({ photo, onChange }) {
  const [hover, setHover] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    const file = files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-blue-100">
      <div className="mb-3 flex items-center gap-3 justify-center">

        <h3 className="text-[25px] md:text-[40px]  w-[80%] text-center font-semibold text-[#12396F] kantumruy leading-tight">

          Upload Photo</h3>
      </div>

      <div
        className={`flex h-100  mt-8 w-full cursor-pointer flex-col items-center justify-center rounded-2xl  text-center transition
          ${hover ? "border-blue-500 bg-blue-50" : "border-blue-200 "}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setHover(true); }}
        onDragLeave={() => setHover(false)}
        onDrop={(e) => { e.preventDefault(); setHover(false); handleFiles(e.dataTransfer.files); }}
      >
        <CameraIcon className="h-36 w-36 text-blue-900" />
        <p className="mt-2 w-full text-3xl px-4 kantumruy text-blue-900/50">Click to upload 
        <br />
        or drag photo here</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {photo && (
        <button className="mt-3 text-sm font-semibold text-blue-700 hover:underline" onClick={() => onChange(null)}>
          Remove photo
        </button>
      )}
    </div>
  );
}

/* Step 3: preview */
function PreviewResultStep({ photo, selected }) {
  return (
    <div className="rounded-3xl bg-white p-4 ">
     <div className="mb-3 flex items-center gap-3 justify-center">

        <h3 className="text-[25px] md:text-[40px]  w-[80%] text-center font-semibold text-[#12396F] kantumruy leading-tight">

          Preview Result</h3>
      </div>

      <div className="relative h-100 mt-8 w-full overflow-hidden rounded-2xl border-2 border-dashed border-blue-200 bg-white/60">
        {!photo ? (
          <div className="flex h-full flex-col items-center justify-center">
            <SparklesIcon className="h-24 w-24 text-blue-900" />
            <p className="mt-2 w-full text-3xl text-center px-4 kantumruy text-blue-900/50">
            Your outfit
            <br />
             will appear here</p>
          </div>
        ) : (
          <>
            <img src={photo} alt="Uploaded" className="h-full w-full object-cover" />
            {selected.Top && (
              <div className="absolute left-1/2 top-[20%] h-16 w-28 -translate-x-1/2 rounded-md opacity-80"
                style={{ background: selected.Top.color }} />
            )}
            {selected.Bottom && (
              <div className="absolute left-1/2 top-[50%] h-20 w-28 -translate-x-1/2 rounded-md opacity-80"
                style={{ background: selected.Bottom.color }} />
            )}
            {selected.Shoes && (
              <div className="absolute left-1/2 bottom-[6%] h-10 w-36 -translate-x-1/2 rounded-md opacity-80"
                style={{ background: selected.Shoes.color }} />
            )}
          </>
        )}
      </div>

      {/* <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="rounded-xl bg-blue-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          onClick={() => alert("Proceed to Try-On")}
        >
          Try-On Now
        </button>
        <button
          type="button"
          className="rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-50"
          onClick={() => alert("Saved! (stub)")}
        >
          Save Image
        </button>
      </div> */}
    </div>
  );
}

export default function TryOn() {
  const [selected, setSelected] = useState({ Top: null, Bottom: null, Shoes: null });
  const [photo, setPhoto] = useState(null);

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-12 flex flex-col justify-center min-h-[80vh]">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ChooseOutfitStep
          onTabChange={() => { }}
          onDropItem={({ type, data }) => {
            const dummy = data || {
              id: `${type.toLowerCase()}-demo`,
              name: `Selected ${type}`,
              color: type === "Top" ? "#1e3a8a" : type === "Bottom" ? "#e5e7eb" : "#1f2937",
            };
            setSelected((s) => ({ ...s, [type]: dummy }));
          }}
        />
        <UploadPhotoStep photo={photo} onChange={setPhoto} />
        <PreviewResultStep photo={photo} selected={selected} />
      </div>
    </div>
  );
}
