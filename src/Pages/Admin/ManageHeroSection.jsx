import React, { useEffect, useState } from 'react';
import { MdEdit, MdDelete, MdAdd, MdClose, MdImage, MdDragHandle, MdVisibility, MdVisibilityOff, MdCloudUpload, MdZoomIn } from 'react-icons/md';
import { useAPI } from '../../contexts/ApiContext';
import { useToast } from '../../components/Toast/ToastContainer';

const ManageHeroSection = () => {
  const api = useAPI();
  const { showSuccess, showError } = useToast();
  const [heroItems, setHeroItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [migrationLoading, setMigrationLoading] = useState(false);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    folder_name: '',
    look_image: '',
    top_image: '',
    bottom_image: '',
    shoes_image: '',
    display_order: 0,
    is_active: true
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  
  // File upload states
  const [uploadingFiles, setUploadingFiles] = useState({
    look: false,
    top: false,
    bottom: false,
    shoes: false
  });
  const [previewImages, setPreviewImages] = useState({
    look: null,
    top: null,
    bottom: null,
    shoes: null
  });

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    
    // If it's already a full URL (Cloudinary or external), return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // For relative paths (legacy/fallback), use backend URL
    // This handles any images that haven't been migrated to Cloudinary yet
    const apiUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:3000';
    const backendUrl = apiUrl.replace(/\/api$/, '');
    return `${backendUrl}${imagePath}`;
  };

  // Fetch hero items
  const fetchHeroItems = async () => {
    setLoading(true);
    try {
      const response = await api.get('/hero-items?includeInactive=true');
      const data = response?.data || response;
      
      let items = [];
      if (data.success && Array.isArray(data.data)) {
        items = data.data;
      } else if (Array.isArray(data)) {
        items = data;
      }

      setHeroItems(items);
    } catch (error) {
      console.error('Error fetching hero items:', error);
      showError('Failed to fetch hero items');
      setHeroItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroItems();
  }, []);

  // Handle add new item
  const handleAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  // Handle edit item
  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      title: item.title || '',
      folder_name: item.folder_name || '',
      look_image: item.look_image || '',
      top_image: item.top_image || '',
      bottom_image: item.bottom_image || '',
      shoes_image: item.shoes_image || '',
      display_order: item.display_order || 0,
      is_active: item.is_active !== undefined ? item.is_active : true
    });
    setPreviewImages({
      look: item.look_image || null,
      top: item.top_image || null,
      bottom: item.bottom_image || null,
      shoes: item.shoes_image || null
    });
    setFormError('');
    setShowEditModal(true);
  };

  // Handle delete item
  const handleDelete = (item) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  // Submit add/edit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      // Validation
      if (!formData.title || !formData.folder_name || !formData.look_image || 
          !formData.top_image || !formData.bottom_image || !formData.shoes_image) {
        setFormError('All fields are required');
        setFormLoading(false);
        return;
      }

      if (showEditModal && selectedItem) {
        // Update existing item
        const response = await api.put(`/admin/hero-items/${selectedItem.id}`, formData);
        showSuccess('Hero item updated successfully');
      } else {
        // Create new item
        const response = await api.post('/admin/hero-items', formData);
        showSuccess('Hero item added successfully');
      }

      setShowEditModal(false);
      setShowAddModal(false);
      fetchHeroItems();
    } catch (error) {
      console.error('Error saving hero item:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save hero item';
      setFormError(errorMessage);
      showError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!selectedItem) return;

    setFormLoading(true);
    try {
      await api.delete(`/admin/hero-items/${selectedItem.id}`);
      showSuccess('Hero item deleted successfully');
      setShowDeleteModal(false);
      fetchHeroItems();
    } catch (error) {
      console.error('Error deleting hero item:', error);
      showError('Failed to delete hero item');
    } finally {
      setFormLoading(false);
    }
  };

  // Toggle active status
  const toggleActive = async (item) => {
    try {
      await api.put(`/admin/hero-items/${item.id}`, {
        is_active: !item.is_active
      });
      showSuccess(`Hero item ${!item.is_active ? 'activated' : 'deactivated'}`);
      fetchHeroItems();
    } catch (error) {
      console.error('Error toggling hero item status:', error);
      showError('Failed to update status');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle file upload
  const handleFileUpload = async (file, imageType) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('File size must be less than 5MB');
      return;
    }

    setUploadingFiles(prev => ({ ...prev, [imageType]: true }));

    try {
      const formData = new FormData();
      formData.append('image', file);

      // Upload to backend
      const response = await api.post('/image/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const imageUrl = response.data?.url || response.url;
      
      if (!imageUrl) {
        throw new Error('No URL returned from upload');
      }

      // Update form data with the uploaded image URL
      const fieldName = `${imageType}_image`;
      setFormData(prev => ({
        ...prev,
        [fieldName]: imageUrl
      }));

      // Set preview
      setPreviewImages(prev => ({
        ...prev,
        [imageType]: imageUrl
      }));

      showSuccess(`${imageType.charAt(0).toUpperCase() + imageType.slice(1)} image uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      showError(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingFiles(prev => ({ ...prev, [imageType]: false }));
    }
  };

  // Handle file input change
  const handleFileInputChange = (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file, imageType);
    }
  };

  // Open image in modal
  const openImageModal = (imageUrl, imageName) => {
    setSelectedImage({ url: imageUrl, name: imageName });
    setShowImageModal(true);
  };

  // Reset form and file states
  const resetForm = () => {
    setFormData({
      title: '',
      folder_name: '',
      look_image: '',
      top_image: '',
      bottom_image: '',
      shoes_image: '',
      display_order: heroItems.length + 1,
      is_active: true
    });
    setPreviewImages({
      look: null,
      top: null,
      bottom: null,
      shoes: null
    });
    setFormError('');
  };

  // Handle Cloudinary migration
  const handleMigrateToCloudinary = async () => {
    if (!confirm('This will upload all local images to Cloudinary. Continue?')) {
      return;
    }

    setMigrationLoading(true);
    try {
      const response = await api.post('/admin/hero-items/migrate-to-cloudinary');
      
      if (response.data.success) {
        showSuccess(response.data.message);
        fetchHeroItems(); // Refresh data
        console.log('Migration details:', response.data.data);
      } else {
        showError('Migration completed with errors. Check console for details.');
        console.error('Migration errors:', response.data);
      }
    } catch (error) {
      console.error('Migration error:', error);
      showError(error.response?.data?.message || 'Failed to migrate to Cloudinary');
    } finally {
      setMigrationLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <MdImage className="text-blue-600" />
            Manage Hero Section
          </h1>
          <p className="text-gray-600 mt-1">Manage clothing items displayed in the hero section</p>
        </div>
        <div className="flex gap-3">
          {/* <button
            onClick={handleMigrateToCloudinary}
            disabled={migrationLoading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <MdCloudUpload size={20} />
            {migrationLoading ? 'Migrating...' : 'Migrate to Cloudinary'}
          </button> */}
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <MdAdd size={20} />
            Add New Item
          </button>
        </div>
      </div>

      {/* Hero Items Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-gray-600">Loading hero items...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heroItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${
                item.is_active ? 'border-green-500' : 'border-gray-300'
              }`}
            >
              {/* Item Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm opacity-90">Order: {item.display_order}</p>
                </div>
                <button
                  onClick={() => toggleActive(item)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title={item.is_active ? 'Deactivate' : 'Activate'}
                >
                  {item.is_active ? <MdVisibility size={20} /> : <MdVisibilityOff size={20} />}
                </button>
              </div>

              {/* Item Images Preview */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Look</p>
                    <div 
                      className="relative group cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 rounded border"
                      onClick={(e) => {
                        e.stopPropagation();
                        openImageModal(getImageUrl(item.look_image), `${item.title} - Look`);
                      }}
                    >
                      <img
                        src={getImageUrl(item.look_image)}
                        alt="Look"
                        className="w-full h-24 object-contain rounded hover:opacity-80 transition-opacity p-2"
                        style={{ backgroundColor: '#fff', display: 'block' }}
                        onLoad={(e) => {
                          try {
                            if (!e.target.naturalWidth || !e.target.naturalHeight) {
                              e.target.style.display = 'none';
                              const placeholder = e.target.nextElementSibling;
                              if (placeholder) placeholder.style.display = 'flex';
                            } else {
                              e.target.style.backgroundColor = 'transparent';
                            }
                          } catch (err) { console.error(err); }
                        }}
                        onError={(e) => { 
                          console.error('Image load error:', e.target.src);
                          e.target.style.display = 'none';
                          const placeholder = e.target.nextElementSibling;
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-24 bg-gray-200 rounded border items-center justify-center text-gray-400 text-xs hidden">
                        No Image
                      </div>
                     
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Top</p>
                    <div 
                      className="relative group cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 rounded border"
                      onClick={(e) => {
                        e.stopPropagation();
                        openImageModal(getImageUrl(item.top_image), `${item.title} - Top`);
                      }}
                    >
                      <img
                        src={getImageUrl(item.top_image)}
                        alt="Top"
                        className="w-full h-24 object-contain rounded hover:opacity-80 transition-opacity p-2"
                        style={{ backgroundColor: '#fff', display: 'block' }}
                        onLoad={(e) => {
                          try {
                            if (!e.target.naturalWidth || !e.target.naturalHeight) {
                              e.target.style.display = 'none';
                              const placeholder = e.target.nextElementSibling;
                              if (placeholder) placeholder.style.display = 'flex';
                            } else {
                              e.target.style.backgroundColor = 'transparent';
                            }
                          } catch (err) { console.error(err); }
                        }}
                        onError={(e) => { 
                          console.error('Image load error:', e.target.src);
                          e.target.style.display = 'none';
                          const placeholder = e.target.nextElementSibling;
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-24 bg-gray-200 rounded border items-center justify-center text-gray-400 text-xs hidden">
                        No Image
                      </div>
                      
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Bottom</p>
                    <div 
                      className="relative group cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 rounded border"
                      onClick={(e) => {
                        e.stopPropagation();
                        openImageModal(getImageUrl(item.bottom_image), `${item.title} - Bottom`);
                      }}
                    >
                      <img
                        src={getImageUrl(item.bottom_image)}
                        alt="Bottom"
                        className="w-full h-24 object-contain rounded hover:opacity-80 transition-opacity p-2"
                        style={{ backgroundColor: '#fff', display: 'block' }}
                        onLoad={(e) => {
                          try {
                            if (!e.target.naturalWidth || !e.target.naturalHeight) {
                              e.target.style.display = 'none';
                              const placeholder = e.target.nextElementSibling;
                              if (placeholder) placeholder.style.display = 'flex';
                            } else {
                              e.target.style.backgroundColor = 'transparent';
                            }
                          } catch (err) { console.error(err); }
                        }}
                        onError={(e) => { 
                          console.error('Image load error:', e.target.src);
                          e.target.style.display = 'none';
                          const placeholder = e.target.nextElementSibling;
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-24 bg-gray-200 rounded border items-center justify-center text-gray-400 text-xs hidden">
                        No Image
                      </div>
                      
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Shoes</p>
                    <div 
                      className="relative group cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 rounded border"
                      onClick={(e) => {
                        e.stopPropagation();
                        openImageModal(getImageUrl(item.shoes_image), `${item.title} - Shoes`);
                      }}
                    >
                      <img
                        src={getImageUrl(item.shoes_image)}
                        alt="Shoes"
                        className="w-full h-24 object-contain rounded hover:opacity-80 transition-opacity p-2"
                        onLoad={(e) => {
                          try {
                            if (!e.target.naturalWidth || !e.target.naturalHeight) {
                              e.target.style.display = 'none';
                              const placeholder = e.target.nextElementSibling;
                              if (placeholder) placeholder.style.display = 'flex';
                            } else {
                              e.target.style.backgroundColor = 'white';
                            }
                          } catch (err) { console.error(err); }
                        }}
                        onError={(e) => { 
                          console.error('Image load error:', e.target.src);
                          e.target.style.display = 'none';
                          const placeholder = e.target.nextElementSibling;
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-24 bg-gray-200 rounded border items-center justify-center text-gray-400 text-xs hidden">
                        No Image
                      </div>
                     
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded flex items-center justify-center gap-1 transition-colors"
                  >
                    <MdEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded flex items-center justify-center gap-1 transition-colors"
                  >
                    <MdDelete /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {heroItems.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          <MdImage size={64} className="mx-auto mb-4 opacity-50" />
          <p>No hero items found. Add your first item to get started!</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div
          className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => { setShowEditModal(false); setShowAddModal(false); }}
        >
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {showEditModal ? 'Edit Hero Item' : 'Add New Hero Item'}
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setShowAddModal(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <MdClose size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                  {formError}
                </div>
              )}

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Look 18"
                    required
                  />
                </div>

                {/* Folder Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Folder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="folder_name"
                    value={formData.folder_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., look_1"
                    required
                  />
                </div>

                {/* Look Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complete Look Image <span className="text-red-500">*</span>
                  </label>
                  
                  {previewImages.look && (
                    <div className="mb-2 relative group bg-gradient-to-br from-gray-50 to-gray-100 rounded border p-2">
                      <img
                        src={getImageUrl(previewImages.look)}
                        alt="Look preview"
                        className="w-full h-40 object-contain rounded cursor-pointer hover:opacity-80 transition-opacity bg-white"
                        onClick={() => openImageModal(getImageUrl(previewImages.look), 'Look Preview')}
                        onError={(e) => { e.target.style.display = 'none'; const p = e.target.nextElementSibling; if (p) p.style.display = 'flex'; }}
                      />
                      <div className="w-full h-40 bg-gray-100 rounded items-center justify-center text-gray-400 text-xs hidden" style={{display: 'none'}}>
                        <div className="flex flex-col items-center justify-center h-full">No Image</div>
                      </div>
                      
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <label className="flex-1 cursor-pointer">
                      <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                        uploadingFiles.look ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
                      }`}>
                        <MdCloudUpload className="mx-auto text-gray-400 mb-2" size={32} />
                        <p className="text-sm text-gray-600">
                          {uploadingFiles.look ? 'Uploading...' : 'Click to upload or drag image'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileInputChange(e, 'look')}
                        className="hidden"
                        disabled={uploadingFiles.look}
                      />
                    </label>
                  </div>
                  
                  <input
                    type="text"
                    name="look_image"
                    value={formData.look_image}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 text-sm"
                    placeholder="Or paste image URL"
                  />
                </div>

                {/* Top Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Top Image <span className="text-red-500">*</span>
                  </label>
                  
                  {previewImages.top && (
                    <div className="mb-2 relative group bg-gradient-to-br from-gray-50 to-gray-100 rounded border p-2">
                      <img
                        src={getImageUrl(previewImages.top)}
                        alt="Top preview"
                        className="w-full h-40 object-contain rounded cursor-pointer hover:opacity-80 transition-opacity bg-white"
                        onClick={() => openImageModal(getImageUrl(previewImages.top), 'Top Preview')}
                        onError={(e) => { e.target.style.display = 'none'; const p = e.target.nextElementSibling; if (p) p.style.display = 'flex'; }}
                      />
                      <div className="w-full h-40 bg-gray-100 rounded items-center justify-center text-gray-400 text-xs hidden" style={{display: 'none'}}>
                        <div className="flex flex-col items-center justify-center h-full">No Image</div>
                      </div>
                      
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <label className="flex-1 cursor-pointer">
                      <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                        uploadingFiles.top ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
                      }`}>
                        <MdCloudUpload className="mx-auto text-gray-400 mb-2" size={32} />
                        <p className="text-sm text-gray-600">
                          {uploadingFiles.top ? 'Uploading...' : 'Click to upload or drag image'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileInputChange(e, 'top')}
                        className="hidden"
                        disabled={uploadingFiles.top}
                      />
                    </label>
                  </div>
                  
                  <input
                    type="text"
                    name="top_image"
                    value={formData.top_image}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 text-sm"
                    placeholder="Or paste image URL"
                  />
                </div>

                {/* Bottom Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bottom Image <span className="text-red-500">*</span>
                  </label>
                  
                  {previewImages.bottom && (
                    <div className="mb-2 relative group bg-gradient-to-br from-gray-50 to-gray-100 rounded border p-2">
                      <img
                        src={getImageUrl(previewImages.bottom)}
                        alt="Bottom preview"
                        className="w-full h-40 object-contain rounded cursor-pointer hover:opacity-80 transition-opacity bg-white"
                        onClick={() => openImageModal(getImageUrl(previewImages.bottom), 'Bottom Preview')}
                        onError={(e) => { e.target.style.display = 'none'; const p = e.target.nextElementSibling; if (p) p.style.display = 'flex'; }}
                      />
                      <div className="w-full h-40 bg-gray-100 rounded items-center justify-center text-gray-400 text-xs hidden" style={{display: 'none'}}>
                        <div className="flex flex-col items-center justify-center h-full">No Image</div>
                      </div>
                      
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <label className="flex-1 cursor-pointer">
                      <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                        uploadingFiles.bottom ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
                      }`}>
                        <MdCloudUpload className="mx-auto text-gray-400 mb-2" size={32} />
                        <p className="text-sm text-gray-600">
                          {uploadingFiles.bottom ? 'Uploading...' : 'Click to upload or drag image'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileInputChange(e, 'bottom')}
                        className="hidden"
                        disabled={uploadingFiles.bottom}
                      />
                    </label>
                  </div>
                  
                  <input
                    type="text"
                    name="bottom_image"
                    value={formData.bottom_image}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 text-sm"
                    placeholder="Or paste image URL"
                  />
                </div>

                {/* Shoes Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shoes Image <span className="text-red-500">*</span>
                  </label>
                  
                  {previewImages.shoes && (
                    <div className="mb-2 relative group bg-gradient-to-br from-gray-50 to-gray-100 rounded border p-2">
                      <img
                        src={getImageUrl(previewImages.shoes)}
                        alt="Shoes preview"
                        className="w-full h-40 object-contain rounded cursor-pointer hover:opacity-80 transition-opacity bg-white"
                        onClick={() => openImageModal(getImageUrl(previewImages.shoes), 'Shoes Preview')}
                        onError={(e) => { e.target.style.display = 'none'; const p = e.target.nextElementSibling; if (p) p.style.display = 'flex'; }}
                      />
                      <div className="w-full h-40 bg-gray-100 rounded items-center justify-center text-gray-400 text-xs hidden" style={{display: 'none'}}>
                        <div className="flex flex-col items-center justify-center h-full">No Image</div>
                      </div>
                      
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <label className="flex-1 cursor-pointer">
                      <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                        uploadingFiles.shoes ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
                      }`}>
                        <MdCloudUpload className="mx-auto text-gray-400 mb-2" size={32} />
                        <p className="text-sm text-gray-600">
                          {uploadingFiles.shoes ? 'Uploading...' : 'Click to upload or drag image'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileInputChange(e, 'shoes')}
                        className="hidden"
                        disabled={uploadingFiles.shoes}
                      />
                    </label>
                  </div>
                  
                  <input
                    type="text"
                    name="shoes_image"
                    value={formData.shoes_image}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 text-sm"
                    placeholder="Or paste image URL"
                  />
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="display_order"
                    value={formData.display_order}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Active (visible in hero section)
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setShowAddModal(false);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-gray-400"
                >
                  {formLoading ? 'Saving...' : showEditModal ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedItem?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={formLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:bg-gray-400"
              >
                {formLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImageModal && selectedImage && (
        <div 
          className="fixed inset-0  bg-opacity-40 backdrop-blur-lg flex items-center justify-center z-[9999] p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="relative max-w-[95vw] max-h-[95vh] w-full h-full flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 px-4">
              <h3 className="text-2xl font-semibold text-blue-600 drop-shadow-lg">
                {selectedImage.name}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowImageModal(false);
                }}
                className="text-white hover:text-gray-300 bg-red-600 bg-opacity-70 hover:bg-opacity-90 rounded-full p-3 transition-all"
                title="Close (or click outside)"
              >
                <MdClose size={32} />
              </button>
            </div>
            
            {/* Image Container */}
            <div 
              className="flex-1 flex items-center justify-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl bg-white"
                style={{ maxHeight: 'calc(95vh - 150px)', backgroundColor: '#fff', display: 'block' }}
                onLoad={(e) => {
                  try {
                    if (!e.target.naturalWidth || !e.target.naturalHeight) {
                      e.target.style.display = 'none';
                      const container = e.target.parentElement;
                      if (container) {
                        let err = container.querySelector('[data-img-error]');
                        if (!err) {
                          err = document.createElement('div');
                          err.setAttribute('data-img-error', '1');
                          err.className = 'text-white text-center p-8 bg-red-900 bg-opacity-50 rounded-lg';
                          err.innerHTML = `<p class="text-xl mb-2">Failed to load image</p><p class="text-sm opacity-75">URL: ${selectedImage.url}</p>`;
                          container.appendChild(err);
                        }
                      }
                    } else {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  } catch (err) { console.error(err); }
                }}
                onError={(e) => {
                  console.error('Modal image failed to load:', e.target.src);
                  e.target.style.display = 'none';
                  const container = e.target.parentElement;
                  if (container) {
                    let err = container.querySelector('[data-img-error]');
                    if (!err) {
                      err = document.createElement('div');
                      err.setAttribute('data-img-error', '1');
                      err.className = 'text-white text-center p-8 bg-red-900 bg-opacity-50 rounded-lg';
                      err.innerHTML = `<p class="text-xl mb-2">Failed to load image</p><p class="text-sm opacity-75">URL: ${selectedImage.url}</p>`;
                      container.appendChild(err);
                    }
                  }
                }}
              />
            </div>
            
            
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageHeroSection;
