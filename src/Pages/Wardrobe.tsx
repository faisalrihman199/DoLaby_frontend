import { useState, useEffect } from "react";
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import OutfitSidebar from "../components/Wardrobe/OutfitSidebar";
import UploadSection from "../components/Wardrobe/UploadSection";
import PreviewSection from "../components/Wardrobe/PreviewSection";
import WardrobeFilters from "../components/Wardrobe/WardrobeFilters";
import WardrobeGrid from "../components/Wardrobe/WardrobeGrid";
import { useAPI } from "../contexts/ApiContext";
import { WardrobeItem, Filters } from "../types/wardrobe";
import { useAPP } from "../contexts/AppContext";

const Wardrobe = () => {
  const api = useAPI();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [personImageUrl, setPersonImageUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"top" | "bottom" | "shoes">("top");
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deviceFingerprint, setDeviceFingerprint] = useState<string | null>(null);
  const [tryOnLoading, setTryOnLoading] = useState(false);
  const [tryOnError, setTryOnError] = useState<string | null>(null);
  const [tryOnResult, setTryOnResult] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    size: "",
    color: "",
    season: "",
    status: "",
  });
  const { user } = useAPP();

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

  // Fetch wardrobe items from API
  useEffect(() => {
    const fetchWardrobeItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/wardrobe');
        const items = res?.data || res || [];
        setWardrobeItems(items);

        // Auto-select first item from each category
        const firstTop = items.find((item: WardrobeItem) => item.type === 'top');
        const firstBottom = items.find((item: WardrobeItem) => item.type === 'bottom');
        const firstShoes = items.find((item: WardrobeItem) => item.type === 'shoes');
        
        const autoSelected = [
          firstTop?.id,
          firstBottom?.id,
          firstShoes?.id
        ].filter(Boolean) as number[];
        
        if (autoSelected.length > 0) {
          setSelectedItems(autoSelected);
        }
      } catch (err: any) {
        console.error('Error fetching wardrobe items:', err);
        setError(err?.response?.data?.message || err?.message || 'Failed to load wardrobe items');
      } finally {
        setLoading(false);
      }
    };

    fetchWardrobeItems();
  }, [api]);

  const handleItemSelect = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      // ensure fingerprint before uploading (server may reject missing fingerprint)
      if (!deviceFingerprint) {
        try {
          const fpLib = await import('@fingerprintjs/fingerprintjs');
          const fp = await fpLib.default.load();
          const res = await fp.get();
          setDeviceFingerprint(res.visitorId);
          formData.append('deviceFingerprint', res.visitorId);
        } catch (e) {
          console.warn('Could not obtain fingerprint before upload', e);
        }
      } else {
        formData.append('deviceFingerprint', deviceFingerprint);
      }

      const response = await api.post('/image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle try-on limit response embedded in upload
      if (response?.data?.code === 'TRY_ON_LIMIT_EXCEEDED') {
        const msg = response?.data?.message || 'Try-on limit exceeded.';
        setTryOnError(msg);
        const info = response?.data?.data || {};
        setTryOnResult({
          tryOnCount: info.tryOnCount,
          limit: info.limit,
          requiresRegistration: info.requiresRegistration,
        });
        const imageUrl = response?.data?.data?.url || response?.data?.url || null;
        if (imageUrl) {
          console.log('Person photo uploaded (but limited):', imageUrl);
          setPersonImageUrl(imageUrl);
          const reader = new FileReader();
          reader.onload = (e) => {
            setUploadedImage(e.target?.result as string);
          };
          reader.readAsDataURL(file);
          return imageUrl;
        }
        return null;
      }

      const imageUrl = response?.data?.data?.url || response?.data?.url;
      console.log('Person photo uploaded:', imageUrl);
      setPersonImageUrl(imageUrl);
      
      // Create preview from file
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      return imageUrl;
    } catch (err: any) {
      console.error('Error uploading person image:', err);
      const resp = err?.response?.data;
      if (resp?.code === 'TRY_ON_LIMIT_EXCEEDED') {
        const msg = resp?.message || 'Try-on limit exceeded.';
        setTryOnError(msg);
        const info = resp?.data || {};
        setTryOnResult({
          tryOnCount: info.tryOnCount,
          limit: info.limit,
          requiresRegistration: info.requiresRegistration,
        });

        const imageUrl = info?.url || resp?.url || null;
        if (imageUrl) {
          setPersonImageUrl(imageUrl);
          const reader = new FileReader();
          reader.onload = (e) => {
            setUploadedImage(e.target?.result as string);
          };
          reader.readAsDataURL(file);
          return imageUrl;
        }

        return null;
      }

      setTryOnError('Failed to upload image. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Perform try-on with selected wardrobe items
  const performTryOn = async (overridePersonUrl?: string) => {
    const personUrlToUse = overridePersonUrl || personImageUrl;
    if (!personUrlToUse) {
      setTryOnError('Please upload your photo first');
      return;
    }

    const selectedTop = getSelectedItemsByType('top');
    const selectedBottom = getSelectedItemsByType('bottom');
    const selectedShoes = getSelectedItemsByType('shoes');

    if (!selectedTop && !selectedBottom) {
      setTryOnError('Please select at least one outfit item (top or bottom)');
      return;
    }

    try {
      setTryOnLoading(true);
      setTryOnError(null);

      const requestBody: any = {
        personUrl: personUrlToUse,
        deviceFingerprint: deviceFingerprint
      };

      // Add wardrobe item URLs
      if (selectedTop) requestBody.topUrl = selectedTop.image_url;
      if (selectedBottom) requestBody.bottomUrl = selectedBottom.image_url;
      // intentionally do not include shoesUrl for now

      console.log('Try-on request:', requestBody);

      const response = await api.post('/image/try-on', requestBody);
      console.log('Try-on response:', response);

      const result = response?.data?.data || response?.data;
      setTryOnResult({
        url: result.url,
        tryOnCount: result.tryOnCount,
        cached: result.cached || response?.data?.cached,
        isRegistered: result.isRegistered
      });
      setUploadedImage(result.url);

    } catch (err: any) {
      console.error('Error performing try-on:', err);
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to perform try-on. Please try again.';
      setTryOnError(errorMsg);
    } finally {
      setTryOnLoading(false);
    }
  };

  // AI Suggest handler: use user's measurement image as person image and run try-on
  const handleAISuggest = async () => {
    const measurementImage = user?.measurement_image || null;
    if (!measurementImage) {
      setTryOnError('No measurement image available for AI Suggest');
      return;
    }

    // ensure fingerprint
    if (!deviceFingerprint) {
      try {
        const fpLib = await import('@fingerprintjs/fingerprintjs');
        const fp = await fpLib.default.load();
        const res = await fp.get();
        setDeviceFingerprint(res.visitorId);
      } catch (e) {
        console.warn('Could not obtain fingerprint before AI suggest', e);
      }
    }

    // set person image so UI reflects the chosen image
    setPersonImageUrl(measurementImage);

    // perform try-on using measurement image directly
    await performTryOn(measurementImage);
  };

  // Auto-trigger try-on when person image and outfit items are selected
  useEffect(() => {
    if (personImageUrl && selectedItems.length > 0 && deviceFingerprint && !tryOnLoading && !tryOnResult) {
      const hasTopOrBottom = getSelectedItemsByType('top') || getSelectedItemsByType('bottom');
      if (hasTopOrBottom) {
        performTryOn();
      }
    }
  }, [personImageUrl, selectedItems, deviceFingerprint]);

  // Handle toggling favourite status
  const handleToggleFavourite = async (itemId: number) => {
    try {
      const item = wardrobeItems.find(item => item.id === itemId);
      if (!item) return;

      const newFavouriteStatus = !item.favourite;
      
      // Optimistically update the UI
      setWardrobeItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, favourite: newFavouriteStatus }
            : item
        )
      );

      // Call API to update favourite status
      await api.put(`/wardrobe/${itemId}`, {
        favourite: newFavouriteStatus
      });
      
    } catch (err: any) {
      console.error('Error toggling favourite:', err);
      // Revert the optimistic update on error
      setWardrobeItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, favourite: !item.favourite }
            : item
        )
      );
    }
  };

  // Get selected items for outfit sidebar
  const getSelectedItemsByType = (type: "top" | "bottom" | "shoes") => {
    return wardrobeItems.find(item => 
      selectedItems.includes(item.id) && item.type === type
    );
  };

  // Filter items based on active tab and filters
  const getFilteredItems = () => {
    return wardrobeItems.filter(item => {
      // Filter by active tab
      if (item.type !== activeTab) return false;
      
      // Apply filters
      if (filters.category && item.category !== filters.category) return false;
      if (filters.brand && item.brand.name !== filters.brand) return false;
      if (filters.size && item.size !== filters.size) return false;
      if (filters.color && !item.color.toLowerCase().includes(filters.color.toLowerCase())) return false;
      if (filters.season && item.season !== filters.season) return false;
      if (filters.status && item.status !== filters.status) return false;
      
      return true;
    });
  };
  const activeTabStyles = "bg-[#035477] text-white hover:bg-[#02405e]";
  const inactiveTabStyles = "bg-gray-200 text-[#828282] hover:bg-gray-300 border border-[#035477]";

  return (
    <div className="min-h-screen bg-background ">
      <div className="max-w-[1400px] mx-auto">
        {/* Top Section: Outfit Builder */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_1fr] gap-6 mb-8">
          <OutfitSidebar 
            selectedTop={getSelectedItemsByType("top")}
            selectedBottom={getSelectedItemsByType("bottom")}
            selectedShoes={getSelectedItemsByType("shoes")}
            onTryOn={performTryOn}
            onAISuggest={handleAISuggest}
            canTryOn={!!(personImageUrl || (user && user.measurement_image)) && !tryOnLoading && !uploading}
            tryOnLoading={tryOnLoading}
          />
          <UploadSection 
            onImageUpload={handleImageUpload} 
            uploading={uploading}
          />
          <PreviewSection 
            uploadedImage={uploadedImage}
            tryOnLoading={tryOnLoading}
            tryOnError={tryOnError}
            tryOnResult={tryOnResult}
            onTryAgain={() => {
              setTryOnResult(null);
              setTryOnError(null);
              setUploadedImage(null);
              setPersonImageUrl(null);
              setSelectedItems([]);
            }}
          />
        </div>

        {/* Wardrobe Section */}
        <div className=" rounded-lg">
          <h2 className="text-[25px] kantumruy font-bold text-color-primary mb-4">Wardrobe</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <WardrobeFilters 
            filters={filters}
            onFiltersChange={setFilters}
            wardrobeItems={wardrobeItems}
          />
          
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button 
              onClick={() => setActiveTab("top")}
              className={`px-6 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === "top" 
                  ? activeTabStyles 
                  : inactiveTabStyles
              }`}
            >
              Tops
            </button>
            <button 
              onClick={() => setActiveTab("bottom")}
              className={`px-6 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === "bottom" 
                  ? activeTabStyles 
                  : inactiveTabStyles
              }`}
            >
              Bottoms
            </button>
            <button 
              onClick={() => setActiveTab("shoes")}
              className={`px-6 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === "shoes" 
                  ? activeTabStyles 
                  : inactiveTabStyles
              }`}
            >
              Shoes
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-lg text-gray-600">Loading wardrobe items...</div>
            </div>
          ) : (
            <WardrobeGrid 
              selectedItems={selectedItems} 
              onItemSelect={handleItemSelect}
              activeTab={activeTab}
              wardrobeItems={getFilteredItems()}
              onToggleFavorite={handleToggleFavourite}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Wardrobe;
