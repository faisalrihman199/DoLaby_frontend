import React, { useEffect, useRef, useState } from "react";
import {
    MdEventSeat,
    MdWbSunny,
    MdUpload,
    MdDelete,
    MdCloudUpload,
} from "react-icons/md";
import { IoHeartOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { useAPI } from "../../contexts/ApiContext";
import { useToast } from "../Toast/ToastContainer";

const sizes = ["S", "M", "L", "XL", "XXL"];
const types = [
    "top",
    "bottom",
    "shoes",
    
];
const categories = [
    "casual",
    "formal",
    "sport",
    "party",
    "business",
    "lounge",
    "beach",
    "vintage",
    "trendy",
    "other",
];
const statuses = [
    "clean",
    "dirty",
    "ironed",
    "washed",
    "unwashed",
    "dry_clean",
    "needs_repair",
    "other",
];
const seasons = ["spring", "summer", "autumn", "winter", "all_season"];
const events = [
    "casual",
    "work",
    "party",
    "sport",
    "formal",
    "beach",
    "wedding",
    "holiday",
    "other",
];

export default function AddClothForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const api = useAPI();
    const { showSuccess, showError } = useToast();
    
    // Check if we're in edit mode
    const editItem = location.state?.editItem || null;
    const isEditMode = !!editItem;
    
    // form state - prefill from editItem if in edit mode
    const [name, setName] = useState(editItem?.name || "");
    const [selectedType, setSelectedType] = useState(editItem?.type || "");
    const [selectedSize, setSelectedSize] = useState(editItem?.size || "L");
    const [selectedCategory, setSelectedCategory] = useState(editItem?.category || "");
    const [selectedStatus, setSelectedStatus] = useState(editItem?.status || "");
    const [color, setColor] = useState(editItem?.color || "");
    const [selectedSeason, setSelectedSeason] = useState(editItem?.season || "");
    const [selectedEvents, setSelectedEvents] = useState(editItem?.events || []);
    const [notes, setNotes] = useState(editItem?.notes || "");
    const [favourite, setFavourite] = useState(editItem?.favourite || false);


    // upload state
    const [preview, setPreview] = useState(editItem?.image_url || null);
    const [fileName, setFileName] = useState(editItem?.image_url ? "Existing image" : "");
    const [selectedFile, setSelectedFile] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState(editItem?.image_url || null);
    const objectUrlRef = useRef(null);
    const fileInputRef = useRef(null);

    // submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // (brand removed - field archived)

    const openPicker = () => fileInputRef.current?.click();

    const handleFiles = (file) => {
        if (!file || !file.type.startsWith("image/")) return;
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        const url = URL.createObjectURL(file);
        objectUrlRef.current = url;
        setPreview(url);
        setFileName(file.name);
        setSelectedFile(file);
        // Clear existing image URL when new file is selected
        setExistingImageUrl(null);
    };

    const onFileChange = (e) => handleFiles(e.target.files?.[0]);

    const onDrop = (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files?.[0]);
    };

    const clearImage = () => {
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
        setPreview(null);
        setFileName("");
        setSelectedFile(null);
        setExistingImageUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleEventChange = (event) => {
        setSelectedEvents(prev => 
            prev.includes(event) 
                ? prev.filter(e => e !== event)
                : [...prev, event]
        );
    };

    const handleAddToWardrobe = async () => {
        if (!name || !selectedType || !selectedCategory) {
            showError('Please fill in required fields: name, type, and category');
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('type', selectedType);
            formData.append('category', selectedCategory);
            formData.append('color', color);
            formData.append('size', selectedSize);
            formData.append('season', selectedSeason);
            formData.append('status', selectedStatus);
            formData.append('events', JSON.stringify(selectedEvents));
            formData.append('favourite', favourite);
            formData.append('notes', notes);
            
            // Only append image if a new file is selected
            if (selectedFile) {
                formData.append('image', selectedFile);
            }
            // If in edit mode and no new file, keep existing image
            // Backend should handle this by not updating image if not provided

            let res;
            if (isEditMode) {
                // Update existing item
                res = await api.put(`/wardrobe/${editItem.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Wardrobe item updated:', res);
                showSuccess('Item updated successfully!');
            } else {
                // Create new item
                res = await api.post('/wardrobe', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Wardrobe item added:', res);
                showSuccess('Item added to wardrobe successfully!');
            }
            
            // Navigate to preview or back to wardrobe
            if (isEditMode) {
                // Go back to wardrobe after edit and show success message
                navigate('/wardrobe', { state: { message: 'Item updated successfully' } });
            } else {
                // Navigate to preview with the added item data
                navigate("/add-cloth/preview", {
                    state: {
                        title: name,
                        imageUrl: preview,
                        size: selectedSize,
                        saved: true,
                        savedMessage: 'Item saved successfully',
                        category: selectedCategory,
                        status: selectedStatus,
                        events: selectedEvents,
                        type: selectedType,
                        color: color,
                        season: selectedSeason,
                        notes: notes,
                        favourite: favourite,
                        wardrobeItem: res?.data || res,
                    },
                });
            }
            
        } catch (err) {
            console.error(`Error ${isEditMode ? 'updating' : 'adding'} to wardrobe:`, err);
            const errorMsg = err?.response?.data?.message || err.message || `Failed to ${isEditMode ? 'update' : 'add'} item to wardrobe`;
            showError(errorMsg);
            setSubmitError(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        return () => objectUrlRef.current && URL.revokeObjectURL(objectUrlRef.current);
    }, []);

    return (
        <div
            className="min-h-screen w-full"
            style={{
                background:
                    "linear-gradient(180deg, #E3ECF6 0%, #DDE8F1 27.4%, #E9F0F5 68.27%, #EEF2F8 100%)",
            }}
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT */}
                    <section className="lg:col-span-5">
                        <h3 className="text-[28px] font-kanit  font-[400] text-black mb-3">
                            Upload Photo
                        </h3>

                        <div className="rounded-xl border border-[#2b4966]/20 bg-white/60 p-3 sm:p-4">
                            {/* Dropzone / Preview */}
                            {!preview ? (
                                <button
                                    type="button"
                                    onClick={openPicker}
                                    onDrop={onDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                    className="w-full h-72 sm:h-80 md:h-96 border-2 border-dashed border-[#2b4966]/40 rounded-lg bg-white flex flex-col items-center justify-center text-[#2b4966] hover:border-[#2b4966]/60 transition"
                                    title="Browse image or drag & drop"
                                >
                                    <MdCloudUpload className="text-5xl opacity-80 mb-2" />
                                    <div className="font-semibold">Browse image</div>
                                    <div className="text-sm opacity-70">or drag & drop</div>
                                </button>
                            ) : (
                                <div className="relative w-full h-72 sm:h-80 md:h-96 rounded-lg border border-[#2b4966]/40 overflow-hidden bg-white">
                                    <img src={preview} alt="cloth" className="w-full h-full object-contain" />
                                    <div className="absolute left-3 bottom-3 flex items-center gap-4 text-[#2b4966]">
                                        <MdEventSeat className="text-xl opacity-80" />
                                        <MdWbSunny className="text-xl opacity-80" />
                                    </div>
                                </div>
                            )}

                            {/* Controls */}
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                <button
                                    type="button"
                                    onClick={openPicker}
                                    className="inline-flex items-center gap-2 rounded-md bg-[#d8d8d8] px-3 py-2 text-[#2b4966] font-semibold hover:opacity-90"
                                >
                                    <MdUpload className="text-lg" />
                                    Choose image
                                </button>

                                {preview && (
                                    <button
                                        type="button"
                                        onClick={clearImage}
                                        className="inline-flex items-center gap-2 rounded-md bg-[#f1d5d5] px-3 py-2 text-[#7a2c2c] font-semibold hover:opacity-90"
                                    >
                                        <MdDelete className="text-lg" />
                                        Remove
                                    </button>
                                )}

                                {fileName && (
                                    <span className="text-xs text-[#2b4966]/70 truncate max-w-full">
                                        {fileName}
                                    </span>
                                )}
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={onFileChange}
                            />
                        </div>
                    </section>

                    {/* RIGHT */}
                    <section className="lg:col-span-7 md:mt-12">
                        <h2 className="font-kanit text-[26px] sm:text-[28px] font-extrabold text-color-primary mb-3">
                            {isEditMode ? 'Edit Item' : 'Add New Item'}
                        </h2>

                        {/* Error display */}
                        {submitError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                                {submitError}
                            </div>
                        )}

                        {/* Name field */}
                        <div className="mb-4">
                            <Field label="Name *">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full max-w-md h-10 border border-[#2b4966] rounded-md px-3"
                                    placeholder="e.g. White Casual Shirt"
                                />
                            </Field>
                        </div>

                        {/* Type field */}
                        <div className="mb-4">
                            <Field label="Type *">
                                <Select
                                    value={selectedType}
                                    onChange={setSelectedType}
                                    options={types}
                                />
                            </Field>
                        </div>

                        {/* Size row */}
                        <div className="mb-4">
                            <div className="text-lg sm:text-[20px] font-semibold text-[#2b4966] mb-2">
                                Size
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {sizes.map((s) => {
                                    const active = s === selectedSize;
                                    return (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setSelectedSize(s)}
                                            className={[
                                                "px-3 py-1 text-xs sm:text-[12px] font-bold rounded-md border",
                                                active
                                                    ? "bg-[#d9e6f2] text-[#2b4966] border-[#b4cde4]"
                                                    : "bg-[#e9eef3] text-[#9fb0c0] border-[#d6e0ea]",
                                            ].join(" ")}
                                        >
                                            {s}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="space-y-3">
                            <Field label="Category *">
                                <Select
                                    value={selectedCategory}
                                    onChange={setSelectedCategory}
                                    options={categories}
                                />
                            </Field>

                            <Field label="Color">
                                <input
                                    type="text"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-full max-w-md h-10 border border-[#2b4966] rounded-md px-3"
                                    placeholder="e.g. white, blue"
                                />
                            </Field>

                            <Field label="Season">
                                <Select
                                    value={selectedSeason}
                                    onChange={setSelectedSeason}
                                    options={seasons}
                                />
                            </Field>

                            <Field label="Status">
                                <Select
                                    value={selectedStatus}
                                    onChange={setSelectedStatus}
                                    options={statuses}
                                />
                            </Field>

                            <Field label="Events">
                                <div className="flex flex-wrap gap-2">
                                    {events.map((event) => (
                                        <label key={event} className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedEvents.includes(event)}
                                                onChange={() => handleEventChange(event)}
                                                className="mr-1"
                                            />
                                            <span className="text-sm">{event}</span>
                                        </label>
                                    ))}
                                </div>
                            </Field>

                            <Field label="Notes">
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full max-w-md h-20 border border-[#2b4966] rounded-md px-3 py-2 resize-none"
                                    placeholder="Additional notes about this item"
                                />
                            </Field>

                            <Field label="Favourite">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={favourite}
                                        onChange={(e) => setFavourite(e.target.checked)}
                                        className="mr-2"
                                    />
                                    <span>Mark as favourite</span>
                                </label>
                            </Field>
                        </div>

                        {/* Buttons */}
                        <div className="mt-6 flex flex-wrap lg:flex-nowrap items-center gap-4">
                            <MutedBtn 
                                className="flex-1 sm:flex-none" 
                                onClick={handleAddToWardrobe}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Item' : 'Add to Wardrobe')}
                            </MutedBtn>

                            <MutedBtn 
                                className="flex-1 sm:flex-none"
                                onClick={() => setFavourite(!favourite)}
                            >
                                <IoHeartOutline className={`text-[18px] ${favourite ? 'text-red-500' : ''}`} />
                                <span className="ml-2">{favourite ? 'Remove from' : 'Add to'} favorite</span>
                            </MutedBtn>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

/* Helper components */
function Field({ label, children }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-28 sm:w-32 text-[#2b4966] font-semibold text-[18px] sm:text-[20px]">
                {label}
            </div>
            <div className="flex-1">{children}</div>
        </div>
    );
}

function Select({ value, onChange, options }) {
    return (
        <select
            className="w-full max-w-md h-10 border border-[#2b4966] rounded-md px-3 bg-white"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">Select</option>
            {options.map((o) => (
                <option key={o} value={o}>
                    {o}
                </option>
            ))}
        </select>
    );
}

// Brand selection removed — kept archived earlier

function MutedBtn({ children, className = "", onClick, disabled = false }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={
                "px-4 py-2 rounded-md bg-[#d8d8d8] text-[#2b4966] font-semibold shadow-sm hover:opacity-90 inline-flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed " +
                className
            }
        >
            {children}
        </button>
    );
}