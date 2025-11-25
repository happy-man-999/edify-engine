import React, { useState, useEffect, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../store/uiSlice';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';

// 3D Model Component for GLB preview
const Model = ({ url, onLoad }) => {
  const { scene } = useGLTF(url);
  
  useEffect(() => {
    if (scene && onLoad) {
      onLoad();
    }
  }, [scene, onLoad]);
  
  return <primitive object={scene} scale={1} />;
};

const ItemEditModal = ({ item, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'app',
    category: 'other',
    priceUSD: 0,
    coverImage: null,
    sceneAssets: null,
    downloadAssets: null,
    features: [],
    tags: [],
    platforms: [],
    visibility: 'private',
    installationInstructions: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [scenePreview, setScenePreview] = useState(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);
  const [sceneChanged, setSceneChanged] = useState(false);
  const [downloadChanged, setDownloadChanged] = useState(false);

  // Initialize form data with item data
  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        type: item.type || 'app',
        category: item.category || 'other',
        priceUSD: item.priceUSD || 0,
        coverImage: null, // Will be handled separately for existing images
        sceneAssets: null, // Will be handled separately for existing assets
        downloadAssets: null, // Will be handled separately for existing assets
        features: item.features || [],
        tags: item.tags || [],
        platforms: item.supportedPlatforms || [],
        visibility: item.visibility || 'private',
        installationInstructions: item.installationInstructions || ''
      });

      // Set existing image preview
      if (item.image) {
        setImagePreview(item.image);
      }

      // Set existing scene preview
      if (item.sceneAssets) {
        setScenePreview(item.sceneAssets);
      }
    }
  }, [item]);

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview && imageChanged) {
        URL.revokeObjectURL(imagePreview);
      }
      if (scenePreview && sceneChanged) {
        URL.revokeObjectURL(scenePreview);
      }
    };
  }, [imagePreview, scenePreview, imageChanged, sceneChanged]);

  const itemTypes = [
    { value: 'app', label: 'Application' },
    { value: 'bundle', label: 'Bundle' },
    { value: 'template', label: 'Template' },
    { value: 'world', label: 'World' },
    { value: 'asset', label: 'Asset' },
    { value: 'service', label: 'Service' },
    { value: '3d-object', label: '3D Object' }
  ];

  const categories = [
    { value: 'gaming', label: 'Gaming' },
    { value: 'education', label: 'Education' },
    { value: 'business', label: 'Business' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'social', label: 'Social' },
    { value: 'creative', label: 'Creative' },
    { value: 'other', label: 'Other' }
  ];

  const platforms = [
    { value: 'desktop', label: 'Desktop' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'vr', label: 'VR' }
  ];

  const visibilityOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'limitedEdition', label: 'Limited Edition' },
    { value: 'private', label: 'Private/Unlisted' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFeatureAdd = (feature) => {
    if (feature.trim() && formData.features.length < 5) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature.trim()]
      }));
    }
  };

  const handleFeatureRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleTagAdd = (tag) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const handleTagRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handlePlatformToggle = (platform) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, coverImage: file }));
      setImageChanged(true);
      if (errors.coverImage) {
        setErrors(prev => ({ ...prev, coverImage: '' }));
      }
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSceneFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, sceneAssets: file }));
      setSceneChanged(true);
      if (errors.sceneAssets) {
        setErrors(prev => ({ ...prev, sceneAssets: '' }));
      }
      
      // Set loading state
      setIsModelLoading(true);
      
      // Create preview URL for 3D scene
      const reader = new FileReader();
      reader.onload = (e) => {
        setScenePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, downloadAssets: file }));
      setDownloadChanged(true);
      if (errors.downloadAssets) {
        setErrors(prev => ({ ...prev, downloadAssets: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.priceUSD < 0) {
      newErrors.priceUSD = 'Price must be non-negative';
    }

    // For edit, cover image is not required if it already exists
    if (!formData.coverImage && !item?.image) {
      newErrors.coverImage = 'Cover image is required';
    }

    if (formData.platforms.length === 0) {
      newErrors.platforms = 'At least one platform must be selected';
    }

    if (formData.features.length > 5) {
      newErrors.features = 'Maximum 5 features allowed';
    }

    // For 3D objects, apps, and world templates, check if files are required
    if (formData.type === '3d-object' || formData.type === 'app' || formData.type === 'world') {
      if (!formData.sceneAssets && !item?.sceneAssets) {
        newErrors.sceneAssets = formData.type === '3d-object' 
          ? '3D scene assets (GLB file) are required for 3D objects'
          : formData.type === 'app'
          ? 'Application preview assets (GLB file) are required for applications'
          : 'World template preview assets (GLB file) are required for world templates';
      }
      if (!formData.downloadAssets && !item?.downloadAssets) {
        newErrors.downloadAssets = formData.type === '3d-object'
          ? 'Download assets (HYP file) are required for 3D objects'
          : formData.type === 'app'
          ? 'Download assets (HYP file) are required for applications'
          : 'Download assets (HYP file) are required for world templates';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      // Add basic fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('priceUSD', formData.priceUSD);
      formDataToSend.append('features', JSON.stringify(formData.features));
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      formDataToSend.append('platforms', JSON.stringify(formData.platforms));
      formDataToSend.append('visibility', formData.visibility);
      formDataToSend.append('installationInstructions', formData.installationInstructions);
      
      // Add files only if they've been changed
      if (formData.coverImage && imageChanged) {
        formDataToSend.append('coverImage', formData.coverImage);
      }
      
      if ((formData.type === '3d-object' || formData.type === 'app' || formData.type === 'world') && formData.sceneAssets && sceneChanged) {
        formDataToSend.append('sceneAssets', formData.sceneAssets);
      }
      
      if ((formData.type === '3d-object' || formData.type === 'app' || formData.type === 'world') && formData.downloadAssets && downloadChanged) {
        formDataToSend.append('downloadAssets', formData.downloadAssets);
      }

      const response = await fetch(`/api/items/${item._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        const updatedItem = await response.json();
        dispatch(showNotification('Item updated successfully!'));
        onSuccess?.(updatedItem);
        onClose();
      } else {
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.details || 'Failed to update item');
        } else {
          // If not JSON, it might be an HTML error page
          const errorText = await response.text();
          console.error('Non-JSON error response:', errorText);
          throw new Error(`Server error (${response.status}): ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Update error:', error);
      dispatch(showNotification(`Update failed: ${error.message}`, 'error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
      <div 
        className="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-modalFadeIn"
        style={{
          backgroundColor: 'oklch(0.18 0.05 285)',
          borderColor: 'oklch(0.25 0.05 285)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}
      >
        {/* Header */}
        <div 
          className="p-6"
          style={{
            background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
            color: 'oklch(0.98 0.01 280)'
          }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Edit Item</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'oklch(0.12 0.02 280)',
                    borderColor: errors.title ? 'oklch(0.55 0.22 25)' : 'oklch(0.25 0.05 285)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    color: 'oklch(0.98 0.01 280)',
                    '--tw-ring-color': 'oklch(0.45 0.15 290)'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                    e.currentTarget.style.boxShadow = '0 0 0 2px oklch(0.45 0.15 290 / 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors.title ? 'oklch(0.55 0.22 25)' : 'oklch(0.25 0.05 285)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="Enter item title"
                />
                {errors.title && <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.22 25)' }}>{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: 'oklch(0.12 0.02 280)',
                    borderColor: 'oklch(0.25 0.05 285)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    color: 'oklch(0.98 0.01 280)',
                    '--tw-ring-color': 'oklch(0.45 0.15 290)'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                    e.currentTarget.style.boxShadow = '0 0 0 2px oklch(0.45 0.15 290 / 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {itemTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'oklch(0.12 0.02 280)',
                  borderColor: errors.description ? 'oklch(0.55 0.22 25)' : 'oklch(0.25 0.05 285)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  color: 'oklch(0.98 0.01 280)',
                  '--tw-ring-color': 'oklch(0.45 0.15 290)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px oklch(0.45 0.15 290 / 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.description ? 'oklch(0.55 0.22 25)' : 'oklch(0.25 0.05 285)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="Describe your item..."
              />
              {errors.description && <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.22 25)' }}>{errors.description}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'oklch(0.12 0.02 280)',
                  borderColor: errors.category ? 'oklch(0.55 0.22 25)' : 'oklch(0.25 0.05 285)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  color: 'oklch(0.98 0.01 280)',
                  '--tw-ring-color': 'oklch(0.45 0.15 290)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px oklch(0.45 0.15 290 / 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.category ? 'oklch(0.55 0.22 25)' : 'oklch(0.25 0.05 285)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
              {errors.category && <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.22 25)' }}>{errors.category}</p>}
            </div>

            {/* Pricing */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                Price (USD) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.priceUSD}
                onChange={(e) => handleInputChange('priceUSD', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'oklch(0.12 0.02 280)',
                  borderColor: errors.priceUSD ? 'oklch(0.55 0.22 25)' : 'oklch(0.25 0.05 285)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  color: 'oklch(0.98 0.01 280)',
                  '--tw-ring-color': 'oklch(0.45 0.15 290)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px oklch(0.45 0.15 290 / 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.priceUSD ? 'oklch(0.55 0.22 25)' : 'oklch(0.25 0.05 285)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="0.00"
              />
              {errors.priceUSD && <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.22 25)' }}>{errors.priceUSD}</p>}
            </div>

            {/* Platforms */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                Platforms *
              </label>
              <div className="space-y-2">
                {platforms.map(platform => (
                  <label key={platform.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.platforms.includes(platform.value)}
                      onChange={() => handlePlatformToggle(platform.value)}
                      className="mr-2 h-4 w-4 rounded"
                      style={{ accentColor: 'oklch(0.45 0.15 290)' }}
                    />
                    <span className="text-sm" style={{ color: 'oklch(0.98 0.01 280)' }}>{platform.label}</span>
                  </label>
                ))}
              </div>
              {errors.platforms && <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.22 25)' }}>{errors.platforms}</p>}
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                Cover Image {!item?.image && '*'}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'oklch(0.12 0.02 280)',
                  borderColor: errors.coverImage ? 'oklch(0.55 0.22 25)' : 'oklch(0.25 0.05 285)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  color: 'oklch(0.98 0.01 280)',
                  '--tw-ring-color': 'oklch(0.45 0.15 290)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px oklch(0.45 0.15 290 / 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.coverImage ? 'oklch(0.55 0.22 25)' : 'oklch(0.25 0.05 285)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <p className="text-sm mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>
                {item?.image ? 'Leave empty to keep current image, or select a new one' : 'Cover image is required'}
              </p>
              {errors.coverImage && <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.22 25)' }}>{errors.coverImage}</p>}
              {formData.coverImage && (
                <p className="text-sm mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>
                  New file selected: {formData.coverImage.name}
                </p>
              )}
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>Preview:</p>
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Cover image preview"
                      className="max-w-full h-48 object-cover rounded-lg shadow-sm"
                      style={{ borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(item?.image || null);
                        setFormData(prev => ({ ...prev, coverImage: null }));
                        setImageChanged(false);
                        // Reset file input
                        const fileInput = document.querySelector('input[type="file"]');
                        if (fileInput) fileInput.value = '';
                      }}
                      className="absolute top-2 right-2 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-colors"
                      style={{ backgroundColor: 'oklch(0.55 0.22 25)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'oklch(0.60 0.22 25)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'oklch(0.55 0.22 25)';
                      }}
                      title="Remove new image"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                Features (up to 5)
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a feature..."
                    className="flex-1 px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: 'oklch(0.12 0.02 280)',
                      borderColor: 'oklch(0.25 0.05 285)',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      color: 'oklch(0.98 0.01 280)',
                      '--tw-ring-color': 'oklch(0.45 0.15 290)'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                      e.currentTarget.style.boxShadow = '0 0 0 2px oklch(0.45 0.15 290 / 0.2)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleFeatureAdd(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      handleFeatureAdd(input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 rounded-md transition-colors"
                    style={{
                      backgroundColor: 'oklch(0.45 0.15 290)',
                      color: 'oklch(0.98 0.01 280)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'oklch(0.50 0.18 260)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290)';
                    }}
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                      style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.2)', color: 'oklch(0.45 0.15 290)' }}
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleFeatureRemove(index)}
                        className="ml-2 transition-colors"
                        style={{ color: 'oklch(0.45 0.15 290)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'oklch(0.50 0.18 260)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.45 0.15 290)'}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <p className="text-xs" style={{ color: 'oklch(0.65 0.05 280)' }}>
                  {formData.features.length}/5 features added
                </p>
              </div>
              {errors.features && <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.22 25)' }}>{errors.features}</p>}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                Tags
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a tag..."
                    className="flex-1 px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: 'oklch(0.12 0.02 280)',
                      borderColor: 'oklch(0.25 0.05 285)',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      color: 'oklch(0.98 0.01 280)',
                      '--tw-ring-color': 'oklch(0.45 0.15 290)'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                      e.currentTarget.style.boxShadow = '0 0 0 2px oklch(0.45 0.15 290 / 0.2)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleTagAdd(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      handleTagAdd(input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 rounded-md transition-colors"
                    style={{
                      backgroundColor: 'oklch(0.45 0.15 290)',
                      color: 'oklch(0.98 0.01 280)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'oklch(0.50 0.18 260)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290)';
                    }}
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm"
                      style={{ backgroundColor: 'oklch(0.50 0.05 280 / 0.2)', color: 'oklch(0.98 0.01 280)' }}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(index)}
                        className="ml-2 transition-opacity"
                        style={{ color: 'oklch(0.98 0.01 280)' }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.75'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                Visibility *
              </label>
              <select
                value={formData.visibility}
                onChange={(e) => handleInputChange('visibility', e.target.value)}
                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'oklch(0.12 0.02 280)',
                  borderColor: 'oklch(0.25 0.05 285)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  color: 'oklch(0.98 0.01 280)',
                  '--tw-ring-color': 'oklch(0.45 0.15 290)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px oklch(0.45 0.15 290 / 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {visibilityOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <p className="text-xs mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>
                Private/Unlisted allows testing before going live
              </p>
            </div>

            {/* Scene Assets Upload - For 3D Objects, Applications, and World Templates */}
            {(formData.type === '3d-object' || formData.type === 'app' || formData.type === 'world') && (
              <div className="space-y-6">
                {/* GLB File Upload for Preview */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                    {formData.type === '3d-object' 
                      ? '3D Scene Assets (.glb format)' 
                      : formData.type === 'app'
                      ? 'Application Preview Assets (.glb format)'
                      : 'World Template Preview Assets (.glb format)'} {!item?.sceneAssets && '*'}
                  </label>
                  <input
                    type="file"
                    accept=".glb"
                    onChange={handleSceneFileChange}
                    className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: 'oklch(0.12 0.02 280)',
                      borderColor: errors.sceneAssets ? 'oklch(0.55 0.22 25)' : 'oklch(0.25 0.05 285)',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      color: 'oklch(0.98 0.01 280)',
                      '--tw-ring-color': 'oklch(0.45 0.15 290)'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                      e.currentTarget.style.boxShadow = '0 0 0 2px oklch(0.45 0.15 290 / 0.2)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.sceneAssets ? 'oklch(0.55 0.22 25)' : 'oklch(0.25 0.05 285)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <p className="text-sm mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    {item?.sceneAssets 
                      ? 'Leave empty to keep current assets, or select a new GLB file'
                      : formData.type === '3d-object' 
                        ? 'Upload 3D scene assets for preview display (GLB format)'
                        : formData.type === 'app'
                        ? 'Upload application preview assets for display (GLB format)'
                        : 'Upload world template preview assets for display (GLB format)'
                    }
                  </p>
                  {errors.sceneAssets && <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.22 25)' }}>{errors.sceneAssets}</p>}
                  {formData.sceneAssets && (
                    <p className="text-sm mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>
                      New file selected: {formData.sceneAssets.name}
                    </p>
                  )}
                </div>

                {/* HYP File Upload for Download */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                    Download Assets (.hyp format) {!item?.downloadAssets && '*'}
                  </label>
                  <input
                    type="file"
                    accept=".hyp"
                    onChange={handleDownloadFileChange}
                    className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: 'oklch(0.12 0.02 280)',
                      borderColor: errors.downloadAssets ? 'oklch(0.55 0.22 25)' : 'oklch(0.25 0.05 285)',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      color: 'oklch(0.98 0.01 280)',
                      '--tw-ring-color': 'oklch(0.45 0.15 290)'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                      e.currentTarget.style.boxShadow = '0 0 0 2px oklch(0.45 0.15 290 / 0.2)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = errors.downloadAssets ? 'oklch(0.55 0.22 25)' : 'oklch(0.25 0.05 285)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  <p className="text-sm mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>
                    {item?.downloadAssets 
                      ? 'Leave empty to keep current assets, or select a new HYP file'
                      : 'Upload downloadable assets for users (HYP format)'
                    }
                  </p>
                  {errors.downloadAssets && <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.22 25)' }}>{errors.downloadAssets}</p>}
                  {formData.downloadAssets && (
                    <div className="text-sm mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>
                      <p>New file selected: {formData.downloadAssets.name}</p>
                      <p className="font-medium" style={{ color: 'oklch(0.45 0.15 290)' }}>
                        Size: {(formData.downloadAssets.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Scene Preview */}
                {scenePreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                      {formData.type === '3d-object' 
                        ? '3D Scene Preview:' 
                        : formData.type === 'app'
                        ? 'Application Preview:'
                        : 'World Template Preview:'}
                    </p>
                    <div className="relative inline-block w-full">
                      <div className="w-full h-64 rounded-lg shadow-sm overflow-hidden relative" style={{ backgroundColor: 'oklch(0.12 0.02 280)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
                        {/* Loading Overlay */}
                        {isModelLoading && (
                          <div className="absolute inset-0 flex items-center justify-center z-10" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-2" style={{ borderColor: 'oklch(0.45 0.15 290)' }}></div>
                              <p className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>Loading...</p>
                            </div>
                          </div>
                        )}
                        
                        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                          <Suspense fallback={null}>
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[10, 10, 5]} intensity={1} />
                            <Model 
                              url={scenePreview} 
                              onLoad={() => setIsModelLoading(false)}
                            />
                            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                            <Environment preset="sunset" />
                          </Suspense>
                        </Canvas>
                      </div>
                      {sceneChanged && (
                        <button
                          type="button"
                          onClick={() => {
                            setScenePreview(item?.sceneAssets || null);
                            setFormData(prev => ({ ...prev, sceneAssets: null }));
                            setIsModelLoading(false);
                            setSceneChanged(false);
                            // Reset scene file input
                            const sceneInput = document.querySelector('input[accept=".glb"]');
                            if (sceneInput) sceneInput.value = '';
                          }}
                          className="absolute top-2 right-2 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-colors"
                          style={{ backgroundColor: 'oklch(0.55 0.22 25)' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'oklch(0.60 0.22 25)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'oklch(0.55 0.22 25)';
                          }}
                          title="Remove new 3D scene"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>
                      {sceneChanged ? formData.sceneAssets?.name : 'Current scene'} - Drag to rotate, scroll to zoom
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Installation Instructions */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                Installation Instructions (Optional)
              </label>
              <textarea
                value={formData.installationInstructions}
                onChange={(e) => handleInputChange('installationInstructions', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'oklch(0.12 0.02 280)',
                  borderColor: 'oklch(0.25 0.05 285)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  color: 'oklch(0.98 0.01 280)',
                  '--tw-ring-color': 'oklch(0.45 0.15 290)'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'oklch(0.45 0.15 290)';
                  e.currentTarget.style.boxShadow = '0 0 0 2px oklch(0.45 0.15 290 / 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'oklch(0.25 0.05 285)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="Enter installation instructions..."
              />
              <p className="text-xs mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>
                Provide step-by-step instructions for users to install and use your item
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6" style={{ borderTopColor: 'oklch(0.25 0.05 285)', borderTopWidth: '1px', borderTopStyle: 'solid' }}>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: 'oklch(0.25 0.05 285)',
                  color: 'oklch(0.98 0.01 280)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'oklch(0.25 0.05 285 / 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'oklch(0.25 0.05 285)';
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'oklch(0.45 0.15 290)',
                  color: 'oklch(0.98 0.01 280)'
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = 'oklch(0.50 0.18 260)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290)';
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Updating...
                  </>
                ) : (
                  'Update Item'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ItemEditModal;

