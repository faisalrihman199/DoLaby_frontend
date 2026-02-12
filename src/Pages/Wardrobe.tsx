import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useToast } from '../components/Toast/ToastContainer';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import OutfitSidebar from "../components/Wardrobe/OutfitSidebar";
import UploadSection from "../components/Wardrobe/UploadSection";
import PreviewSection from "../components/Wardrobe/PreviewSection";
import WardrobeFilters from "../components/Wardrobe/WardrobeFilters";
import WardrobeGrid from "../components/Wardrobe/WardrobeGrid";
import DeleteConfirmDialog from "../components/Wardrobe/DeleteConfirmDialog";
import { useAPI } from "../contexts/ApiContext";
import { WardrobeItem, Filters } from "../types/wardrobe";
import { useAPP } from "../contexts/AppContext";

const Wardrobe = () => {
  const api = useAPI();
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showError } = useToast();
  
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [personImageUrl, setPersonImageUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"top" | "bottom" | "shoes" | "outfit" | "all">("top");
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deviceFingerprint, setDeviceFingerprint] = useState<string | null>(null);
  const [tryOnLoading, setTryOnLoading] = useState(false);
  const [tryOnError, setTryOnError] = useState<string | null>(null);
  const [tryOnResult, setTryOnResult] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; itemId: number | null; itemName: string }>({
    isOpen: false,
    itemId: null,
    itemName: '',
  });
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
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
        showError('Could not generate device fingerprint');
        console.error('Error generating fingerprint:', err);
      }
    };
    initFingerprint();
  }, []);

  // Fetch wardrobe items from API
  useEffect(() => {
    // Show message passed from navigation state (e.g., after edit)
    if (location?.state?.message) {
      try {
        const msg = location.state.message;
        if (msg) showSuccess(msg);
        // clear state by replacing history entry without message
        navigate(location.pathname, { replace: true, state: {} });
      } catch (e) {
        // ignore
      }
    }

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
        const errorMsg = err?.response?.data?.message || err?.message || 'Failed to load wardrobe items';
        showError(errorMsg);
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchWardrobeItems();
  }, [api]);

  const handleItemSelect = (id: number) => {
  const clickedItem = wardrobeItems.find(item => item.id === id);
  if (!clickedItem) return;

  setSelectedItems(prev => {
    // If clicking already-selected item → deselect it
    if (prev.includes(id)) {
      return prev.filter(itemId => itemId !== id);
    }

    // Remove any previously selected item of the SAME TYPE
    const filtered = prev.filter(itemId => {
      const item = wardrobeItems.find(w => w.id === itemId);
      return item?.type !== clickedItem.type;
    });

    // Add the new selection
    return [...filtered, id];
  });
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

  // Poll job status with smooth progress simulation
  const pollJobStatus = (taskId: string, pollInterval = 2000): Promise<any> => {
    return new Promise((resolve, reject) => {
      const maxAttempts = 150; // 5 minutes max (150 * 2s)
      let attempts = 0;
      let simulatedProgress = 10;
      let simulationInterval: NodeJS.Timeout | null = null;
      let lastBackendProgress = 0;

      // Simulate smooth progress during AI processing (when stuck at 20%)
      const startProgressSimulation = () => {
        if (simulationInterval) return;
        
        simulationInterval = setInterval(() => {
          // Only simulate if backend is stuck at 20% (AI processing)
          if (lastBackendProgress >= 20 && lastBackendProgress < 70) {
            // Slowly increment from current progress towards 65% (leave room for real updates)
            if (simulatedProgress < 65) {
              // Random increment between 1-3% every 800ms for natural feel
              const increment = Math.random() * 2 + 1;
              simulatedProgress = Math.min(65, simulatedProgress + increment);
              setProgress(Math.round(simulatedProgress));
              
              // Update message based on simulated progress
              if (simulatedProgress < 30) {
                setProgressMessage('Analyzing your photo...');
              } else if (simulatedProgress < 40) {
                setProgressMessage('Matching outfit style...');
              } else if (simulatedProgress < 50) {
                setProgressMessage('Adjusting fit and proportions...');
              } else if (simulatedProgress < 60) {
                setProgressMessage('Applying finishing touches...');
              } else {
                setProgressMessage('Almost ready...');
              }
            }
          }
        }, 800);
      };

      const stopProgressSimulation = () => {
        if (simulationInterval) {
          clearInterval(simulationInterval);
          simulationInterval = null;
        }
      };

      const poll = async () => {
        attempts++;
        
        try {
          // api.get returns response.data directly (not full axios response)
          const status = await api.get(`/image/job-status/${taskId}`);

          console.log(`Job ${taskId} status:`, status.status, `${status.progress || 0}%`, status.message);

          const backendProgress = status.progress || 0;
          lastBackendProgress = backendProgress;

          // If backend progress jumps ahead of simulation, use backend value
          if (backendProgress > simulatedProgress) {
            simulatedProgress = backendProgress;
            setProgress(backendProgress);
          }

          // Start simulation when AI processing begins (stuck at 20%)
          if (backendProgress >= 20 && backendProgress < 70) {
            startProgressSimulation();
          }

          // Update message from backend if it changes
          if (status.message && backendProgress >= 70) {
            setProgressMessage(status.message);
            setTryOnError(null);
          }

          if (status.status === 'completed') {
            // Job completed successfully
            stopProgressSimulation();
            setProgress(100);
            setProgressMessage('Done! ✨');
            
            // Small delay to show 100% before displaying result
            setTimeout(() => {
              setTryOnResult({
                url: status.result.url,
                tryOnCount: null,
                cached: false,
                isRegistered: true,
                processingTime: status.result.processingTime
              });
              setUploadedImage(status.result.url);
              setTryOnLoading(false);
              console.log('Try-on completed successfully');
              resolve(status.result);
            }, 500);
            return;
          }

          if (status.status === 'failed') {
            // Job failed
            stopProgressSimulation();
            const errorMsg = status.error || status.message || 'Processing failed';
            setTryOnError(errorMsg);
            setTryOnLoading(false);
            console.error('Try-on failed:', errorMsg);
            reject(new Error(errorMsg));
            return;
          }

          // Job still processing, continue polling
          if (attempts < maxAttempts) {
            setTimeout(poll, pollInterval);
          } else {
            stopProgressSimulation();
            const timeoutMsg = 'Processing timeout. Please try again.';
            setTryOnError(timeoutMsg);
            setTryOnLoading(false);
            reject(new Error(timeoutMsg));
          }

        } catch (err) {
          stopProgressSimulation();
          console.error('Error polling job status:', err);
          const errorMsg = 'Failed to check processing status';
          setTryOnError(errorMsg);
          setTryOnLoading(false);
          reject(err);
        }
      };

      // Start polling
      poll();
    });
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
      setProgress(0);
      setProgressMessage('Initializing...');

      const requestBody: any = {
        personUrl: personUrlToUse,
        deviceFingerprint: deviceFingerprint
      };

      // Add wardrobe item URLs
      if (selectedTop) requestBody.topUrl = selectedTop.image_url;
      if (selectedBottom) requestBody.bottomUrl = selectedBottom.image_url;
      if (selectedShoes) requestBody.shoesUrl = selectedShoes.image_url;

      console.log('Try-on request:', requestBody);

      const response = await api.post('/image/try-on', requestBody);
      console.log('Try-on response:', response);

      // The API context returns response.data directly, not the full axios response
      // Check if this is an async job (has taskId and status 'queued')
      if (response.taskId && response.status === 'queued') {
        const { taskId, pollInterval = 2000 } = response;
        console.log('Async job created:', taskId);
        
        // Poll for job status
        await pollJobStatus(taskId, pollInterval);
        return;
      }

      // Immediate response (cached result)
      if (response.cached && response.data?.url) {
        const { data } = response;
        console.log('Cached result:', data);
        
        setTryOnResult({
          url: data.url,
          tryOnCount: data.tryOnCount,
          cached: true,
          isRegistered: data.isRegistered,
          cacheUseCount: data.cacheUseCount
        });
        setUploadedImage(data.url);
        setTryOnLoading(false);
        setProgress(100);
        setProgressMessage('Completed (from cache)!');
        return;
      }

      // Legacy direct response format
      const result = response?.data?.data || response?.data || response;
      if (result?.url) {
        setTryOnResult({
          url: result.url,
          tryOnCount: result.tryOnCount,
          cached: result.cached || response?.cached,
          isRegistered: result.isRegistered
        });
        setUploadedImage(result.url);
        setTryOnLoading(false);
        setProgress(100);
        return;
      }

      // Unexpected response
      console.warn('Unexpected response format:', response);
      setTryOnError('Unexpected response from server');
      setTryOnLoading(false);

    } catch (err: any) {
      console.error('Error performing try-on:', err);
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to perform try-on. Please try again.';
      showError(errorMsg);
      setTryOnError(errorMsg);
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
      showError('Failed to update favourite status');
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

  // Handle delete item
  const handleDeleteItem = (itemId: number) => {
    const item = wardrobeItems.find(item => item.id === itemId);
    if (!item) return;

    setDeleteDialog({
      isOpen: true,
      itemId: itemId,
      itemName: item.name || item.category || 'this item',
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.itemId) return;

    try {
      setDeleting(true);
      
      // Call API to delete the item
      await api.delete(`/wardrobe/${deleteDialog.itemId}`);
      
      // Remove from local state
      setWardrobeItems(prev => prev.filter(item => item.id !== deleteDialog.itemId));
      
      // Remove from selected items if it was selected
      setSelectedItems(prev => prev.filter(id => id !== deleteDialog.itemId));
      
      // Close dialog
      setDeleteDialog({ isOpen: false, itemId: null, itemName: '' });
      showSuccess('Item deleted successfully');
      
    } catch (err: any) {
      console.error('Error deleting item:', err);
      showError(err?.response?.data?.message || err?.message || 'Failed to delete item');
    } finally {
      setDeleting(false);
    }
  };

  const closeDeleteDialog = () => {
    if (!deleting) {
      setDeleteDialog({ isOpen: false, itemId: null, itemName: '' });
    }
  };

  // Handle save try-on result to wardrobe
  const handleSaveTryOnResult = async (favourite: boolean) => {
    if (!uploadedImage) {
      showError('No try-on result to save');
      return;
    }

    try {
      setSaving(true);

      // Save try-on result image to wardrobe
      const formData = new FormData();
      
      // Fetch the image and convert to blob
      const response = await fetch(uploadedImage);
      const blob = await response.blob();
      const file = new File([blob], 'try-on-result.jpg', { type: 'image/jpeg' });
      
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

      // Add to local wardrobe items
      const newItem = result?.data || result;
      setWardrobeItems(prev => [...prev, newItem]);

      showSuccess('Try-on result saved to wardrobe!');
      
    } catch (err: any) {
      console.error('Error saving try-on result:', err);
      showError(err?.response?.data?.message || err?.message || 'Failed to save to wardrobe');
    } finally {
      setSaving(false);
    }
  };

  // Handle edit item
  const handleEditItem = (itemId: number) => {
    const item = wardrobeItems.find(item => item.id === itemId);
    if (!item) return;

    // Navigate to add-cloth page with item data for editing
    navigate('/add-cloth', {
      state: {
        editItem: item
      }
    });
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
      if (activeTab !== "all" && item.type !== activeTab) return false;
      
      // Apply filters
      if (filters.category && item.category !== filters.category) return false;
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
            uploading={uploading}
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
            onSave={user ? handleSaveTryOnResult : undefined}
            saving={saving}
            progress={progress}
            progressMessage={progressMessage}
            onTryAgain={() => {
              setTryOnResult(null);
              setTryOnError(null);
              setUploadedImage(null);
              setPersonImageUrl(null);
              setSelectedItems([]);
              setProgress(0);
              setProgressMessage('');
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
            <button 
              onClick={() => setActiveTab("outfit")}
              className={`px-6 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === "outfit" 
                  ? activeTabStyles 
                  : inactiveTabStyles
              }`}
            >
              Outfits
            </button>
            <button 
              onClick={() => setActiveTab("all")}
              className={`px-6 py-2 rounded-t-lg font-medium transition-colors ${
                activeTab === "all" 
                  ? activeTabStyles 
                  : inactiveTabStyles
              }`}
            >
              All
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
              onDelete={handleDeleteItem}
              onEdit={handleEditItem}
            />
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        itemName={deleteDialog.itemName}
        loading={deleting}
      />
    </div>
  );
};

export default Wardrobe;
