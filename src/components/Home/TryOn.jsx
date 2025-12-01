import React, { useRef, useState, useEffect } from "react";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useAPI } from '../../contexts/ApiContext';
import ChooseOutfitStep from "./ChooseOutfitStep";
import { CameraIcon, SparklesIcon } from "./icons/Icons";

/* Step 2: upload */
function UploadPhotoStep({ photo, onChange, onFileSelected, uploading }) {
  const [hover, setHover] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    const file = files?.[0];
    if (!file) return;
    onFileSelected(file);
    // Reset the input so selecting the same file again triggers onChange
    try {
      if (inputRef?.current) inputRef.current.value = '';
    } catch (e) {
      /* ignore */
    }
  };

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-blue-100">
      <div className="mb-3 flex items-center gap-3 justify-center">

        <h3 className="text-[25px] md:text-[40px]  w-[80%] text-center font-semibold text-[#12396F] kantumruy leading-tight">

          Upload Photo</h3>
      </div>

      <div
        className="relative mt-6 w-full overflow-hidden rounded-2xl bg-white/60 cursor-pointer transition"
        style={{ aspectRatio: '9 / 16', height: '450px', maxWidth: '280px', margin: '0 auto' }}
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setHover(true); }}
        onDragLeave={() => setHover(false)}
        onDrop={(e) => { e.preventDefault(); setHover(false); handleFiles(e.dataTransfer.files); }}
      >
        {uploading ? (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-blue-900"></div>
            <p className="mt-4 w-full text-2xl text-center px-4 kantumruy text-blue-900">Uploading...</p>
          </div>
        ) : photo ? (
          <div className="w-full h-full flex items-center justify-center bg-white p-2">
            <img src={photo} alt="Uploaded" className="w-full h-full object-contain rounded-lg" />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <CameraIcon className="h-24 w-24 text-blue-900" />
            <p className="mt-2 w-full text-3xl text-center px-4 kantumruy text-blue-900/50">Click to upload
            <br />
            or drag photo here</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading}
        />
      </div>

      {photo && !uploading && (
        <button className="mt-3 text-sm font-semibold text-blue-700 hover:underline" onClick={() => onChange(null)}>
          Remove photo
        </button>
      )}
    </div>
  );
}

/* Step 3: preview */
function PreviewResultStep({ resultUrl, tryOnLoading, tryOnError, tryOnData, onSave, saving }) {
  return (
    <div className="rounded-3xl bg-white p-4 ">
     <div className="mb-3 flex items-center gap-3 justify-center">

        <h3 className="text-[25px] md:text-[40px]  w-[80%] text-center font-semibold text-[#12396F] kantumruy leading-tight">

          Preview Result</h3>
      </div>

      <div
        className="relative mt-6 w-full overflow-hidden rounded-2xl border-2 border-dashed border-blue-200 bg-white/60"
        style={{ aspectRatio: '9 / 16', height: '450px', maxWidth: '280px', margin: '0 auto' }}
      >
        {tryOnLoading ? (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-blue-900"></div>
            <p className="mt-4 w-full text-2xl text-center px-4 kantumruy text-blue-900">
              Creating your try-on...
            </p>
          </div>
        ) : tryOnError ? (
          <div className="flex h-full flex-col items-center justify-center p-4">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-lg text-center kantumruy text-red-600">
              {tryOnError}
            </p>
          </div>
        ) : resultUrl ? (
          <>
            <div className="w-full h-full flex items-center justify-center bg-white p-2 relative">
              <img
                src={resultUrl}
                alt="Try-on result"
                className="w-full h-full object-cover rounded-lg"
                style={{ filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.12))' }}
              />
              {/* Icon buttons overlay */}
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={async () => {
                    try {
                      // Fetch the image as blob
                      const response = await fetch(resultUrl);
                      const blob = await response.blob();
                      
                      // Create object URL from blob
                      const blobUrl = window.URL.createObjectURL(blob);
                      
                      // Download the image
                      const link = document.createElement('a');
                      link.href = blobUrl;
                      link.download = 'try-on-result.jpg';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      
                      // Clean up blob URL
                      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
                      
                      // Also open in new tab
                      window.open(resultUrl, '_blank');
                    } catch (error) {
                      console.error('Download failed:', error);
                      alert('Failed to download image. Please try again.');
                    }
                  }}
                  className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                  title="Download"
                >
                  <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                  title="Try Another"
                >
                  <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <SparklesIcon className="h-24 w-24 text-blue-900" />
            <p className="mt-2 w-full text-3xl text-center px-4 kantumruy text-blue-900/50">
            Your outfit
            <br />
             will appear here</p>
          </div>
        )}
      </div>

      {resultUrl && onSave && !tryOnLoading && (
        <div className="mt-4 flex justify-center">
          <button 
            onClick={() => onSave(true)}
            disabled={saving}
            className="px-8 py-2.5 bg-[#035477] text-white rounded-lg hover:bg-[#02405e] transition-colors font-medium kantumruy flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Save
              </>
            )}
          </button>
        </div>
      )}

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
  const api = useAPI();
  const [selected, setSelected] = useState({ Top: null, Bottom: null, Shoes: null });
  const [photo, setPhoto] = useState(null);
  const [deviceFingerprint, setDeviceFingerprint] = useState(null);
  const [uploadedUrls, setUploadedUrls] = useState({
    personUrl: null,
    topUrl: null,
    bottomUrl: null,
    shoesUrl: null
  });
  const [uploading, setUploading] = useState(false);
  const [tryOnLoading, setTryOnLoading] = useState(false);
  const [tryOnError, setTryOnError] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [tryOnData, setTryOnData] = useState(null);
  const [saving, setSaving] = useState(false);

  // Initialize device fingerprint
  useEffect(() => {
    const initFingerprint = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setDeviceFingerprint(result.visitorId);
        console.log('Device fingerprint:', result.visitorId);
      } catch (err) {
        console.error('Error generating fingerprint:', err);
      }
    };
    initFingerprint();
  }, []);

  // Ensure we have a device fingerprint (can be called before upload)
  const ensureFingerprint = async () => {
    if (deviceFingerprint) return deviceFingerprint;
    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceFingerprint(result.visitorId);
      console.log('Device fingerprint (ensured):', result.visitorId);
      return result.visitorId;
    } catch (err) {
      console.error('Failed to generate fingerprint on demand:', err);
      return null;
    }
  };

  // Upload image to server
  const uploadImage = async (file, type) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      const fp = await ensureFingerprint();
      if (fp) formData.append('deviceFingerprint', fp);

      const response = await api.post('/image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // If backend returns a rate/limit error embedded in the upload response,
      // surface it to the UI so user sees registration prompt / limit info.
      if (response?.data?.code === 'TRY_ON_LIMIT_EXCEEDED') {
        const msg = response?.data?.message || 'Try-on limit exceeded.';
        setTryOnError(msg);
        const info = response?.data?.data || {};
        setTryOnData({
          tryOnCount: info.tryOnCount,
          limit: info.limit,
          requiresRegistration: info.requiresRegistration,
        });
        // If upload still returned an image url, keep it; otherwise return null.
        const imageUrl = response?.data?.data?.url || response?.data?.url || null;
        if (imageUrl) {
          console.log(`${type} uploaded (but limited):`, imageUrl);
          if (type === 'person') {
            setUploadedUrls(prev => ({ ...prev, personUrl: imageUrl }));
            setPhoto(imageUrl);
          } else if (type === 'top') {
            setUploadedUrls(prev => ({ ...prev, topUrl: imageUrl }));
          } else if (type === 'bottom') {
            setUploadedUrls(prev => ({ ...prev, bottomUrl: imageUrl }));
          } else if (type === 'shoes') {
            setUploadedUrls(prev => ({ ...prev, shoesUrl: imageUrl }));
          }
          return imageUrl;
        }
        return null;
      }

      const imageUrl = response?.data?.data?.url || response?.data?.url;
      console.log(`${type} uploaded:`, imageUrl);

      // Update the appropriate URL
      if (type === 'person') {
        setUploadedUrls(prev => ({ ...prev, personUrl: imageUrl }));
        setPhoto(imageUrl);
      } else if (type === 'top') {
        setUploadedUrls(prev => ({ ...prev, topUrl: imageUrl }));
      } else if (type === 'bottom') {
        setUploadedUrls(prev => ({ ...prev, bottomUrl: imageUrl }));
      } else if (type === 'shoes') {
        setUploadedUrls(prev => ({ ...prev, shoesUrl: imageUrl }));
      }

      return imageUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      const resp = err?.response?.data;
      // Handle backend rate/limit error returned as 4xx with structured body
      if (resp?.code === 'TRY_ON_LIMIT_EXCEEDED') {
        const msg = resp?.message || 'Try-on limit exceeded.';
        setTryOnError(msg);
        const info = resp?.data || {};
        setTryOnData({
          tryOnCount: info.tryOnCount,
          limit: info.limit,
          requiresRegistration: info.requiresRegistration,
        });

        // If server still returned an image url in the error payload, accept it
        const imageUrl = info?.url || resp?.url || null;
        if (imageUrl) {
          if (type === 'person') {
            setUploadedUrls(prev => ({ ...prev, personUrl: imageUrl }));
            setPhoto(imageUrl);
          } else if (type === 'top') {
            setUploadedUrls(prev => ({ ...prev, topUrl: imageUrl }));
          } else if (type === 'bottom') {
            setUploadedUrls(prev => ({ ...prev, bottomUrl: imageUrl }));
          } else if (type === 'shoes') {
            setUploadedUrls(prev => ({ ...prev, shoesUrl: imageUrl }));
          }
          return imageUrl;
        }

        alert(msg);
        return null;
      }

      alert('Failed to upload image. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Handle outfit item selection (with image upload)
  const handleOutfitSelection = async ({ type, data, file }) => {
    // If parent says data === null, clear that selection and uploaded URL
    if (data === null) {
      setSelected((s) => ({ ...s, [type]: null }));
      const key = `${type.toLowerCase()}Url`;
      setUploadedUrls((prev) => ({ ...prev, [key]: null }));
      // Clear previous try-on result so user can re-run
      setResultUrl(null);
      setTryOnData(null);
      setTryOnError(null);
      return;
    }

    setSelected((s) => ({ ...s, [type]: data }));

    // If a file is provided, upload it
    if (file) {
      const urlType = type.toLowerCase();
      await uploadImage(file, urlType);
    }
  };

  // Handle person photo selection
  const handlePersonPhotoSelected = async (file) => {
    await uploadImage(file, 'person');
  };

  // Handle removing the person photo from the UI
  const handleRemovePhoto = () => {
    setPhoto(null);
    setUploadedUrls((prev) => ({ ...prev, personUrl: null }));
    setResultUrl(null);
    setTryOnData(null);
    setTryOnError(null);
  };

  // Perform try-on
  const performTryOn = async () => {
    if (!uploadedUrls.personUrl) {
      showError('Please upload your photo first');
      return;
    }

    if (!uploadedUrls.topUrl && !uploadedUrls.bottomUrl) {
      showError('Please select at least one outfit item (top or bottom)');
      return;
    }

    try {
      setTryOnLoading(true);
      setTryOnError(null);

      const requestBody = {
        personUrl: uploadedUrls.personUrl,
        deviceFingerprint: deviceFingerprint
      };

      // Add outfit URLs if they exist
      if (uploadedUrls.topUrl) requestBody.topUrl = uploadedUrls.topUrl;
      if (uploadedUrls.bottomUrl) requestBody.bottomUrl = uploadedUrls.bottomUrl;
      if (uploadedUrls.shoesUrl) requestBody.shoesUrl = uploadedUrls.shoesUrl;

      console.log('Try-on request:', requestBody);

      const response = await api.post('/image/try-on', requestBody);

      console.log('Try-on response:', response);

      const result = response?.data?.data || response?.data;
      setResultUrl(result.url);
      setTryOnData({
        tryOnCount: result.tryOnCount,
        cached: result.cached || response?.data?.cached,
        isRegistered: result.isRegistered
      });

    } catch (err) {
      console.error('Error performing try-on:', err);
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to perform try-on. Please try again.';
      setTryOnError(errorMsg);
    } finally {
      setTryOnLoading(false);
    }
  };

  // Auto-trigger try-on when all required data is available
  useEffect(() => {
    if (uploadedUrls.personUrl && (uploadedUrls.topUrl || uploadedUrls.bottomUrl) && deviceFingerprint && !tryOnLoading && !resultUrl) {
      performTryOn();
    }
  }, [uploadedUrls, deviceFingerprint]);

  // Handle save try-on result to wardrobe
  const handleSaveTryOnResult = async (favourite) => {
    if (!resultUrl) {
      showError('No try-on result to save');
      return;
    }

    try {
      setSaving(true);

      // Fetch the image and convert to blob
      const response = await fetch(resultUrl);
      const blob = await response.blob();
      const file = new File([blob], 'try-on-result.jpg', { type: 'image/jpeg' });
      
      const formData = new FormData();
      formData.append('image', file);
      formData.append('name', 'Try-On Result');
      formData.append('type', 'outfit'); // Save as outfit type
      formData.append('category', 'other');
      formData.append('size', 'M');
      formData.append('favourite', favourite.toString());
      formData.append('color', '');
      formData.append('season', 'all_season');
      formData.append('status', 'clean');
      formData.append('events', JSON.stringify([]));
      formData.append('notes', 'Saved from try-on');

      const result = await api.post('/wardrobe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Try-on result saved to wardrobe:', result);
      showSuccess('Try-on result saved to wardrobe!');
      
    } catch (err) {
      console.error('Error saving try-on result:', err);
      showError(err?.response?.data?.message || err?.message || 'Failed to save to wardrobe');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="try-on" className="mx-auto max-w-7xl px-4 md:px-6 py-4 flex flex-col justify-center min-h-[80vh]">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ChooseOutfitStep
          onTabChange={() => { }}
          onDropItem={handleOutfitSelection}
          onImageUpload={uploadImage}
          onTryOn={performTryOn}
        />
        <UploadPhotoStep 
          photo={photo} 
          onChange={handleRemovePhoto} 
          onFileSelected={handlePersonPhotoSelected}
          uploading={uploading}
        />
        <PreviewResultStep 
          resultUrl={resultUrl} 
          tryOnLoading={tryOnLoading}
          tryOnError={tryOnError}
          tryOnData={tryOnData}
          onSave={handleSaveTryOnResult}
          saving={saving}
        />
      </div>
    </div>
  );
}
