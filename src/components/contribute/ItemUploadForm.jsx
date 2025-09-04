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

const ItemUploadForm = ({ onClose, onSuccess }) => {
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

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      if (scenePreview) {
        URL.revokeObjectURL(scenePreview);
      }
    };
  }, [imagePreview, scenePreview]);

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

  const reservedTags = ['premium', 'staffPick', 'onSale'];

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

    if (!formData.coverImage) {
      newErrors.coverImage = 'Cover image is required';
    }

    if (formData.platforms.length === 0) {
      newErrors.platforms = 'At least one platform must be selected';
    }

    if (formData.features.length > 5) {
      newErrors.features = 'Maximum 5 features allowed';
    }

    // For 3D objects, both scene assets (GLB) and download assets (HYP) are required
    if (formData.type === '3d-object') {
      if (!formData.sceneAssets) {
        newErrors.sceneAssets = '3D scene assets (GLB file) are required for 3D objects';
      }
      if (!formData.downloadAssets) {
        newErrors.downloadAssets = 'Download assets (HYP file) are required for 3D objects';
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

    // Show "coming soon" for non-3D object types
    if (formData.type !== '3d-object') {
      dispatch(showNotification('This item type is coming soon!', 'info'));
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('priceUSD', formData.priceUSD);
      formDataToSend.append('coverImage', formData.coverImage);
      formDataToSend.append('features', JSON.stringify(formData.features));
      formDataToSend.append('tags', JSON.stringify(formData.tags));
      formDataToSend.append('platforms', JSON.stringify(formData.platforms));
      formDataToSend.append('visibility', formData.visibility);
      formDataToSend.append('installationInstructions', formData.installationInstructions);
      
      // Add scene assets for 3D objects (GLB file for preview)
      if (formData.type === '3d-object' && formData.sceneAssets) {
        formDataToSend.append('sceneAssets', formData.sceneAssets);
      }
      
      // Add download assets for 3D objects (HYP file for download)
      if (formData.type === '3d-object' && formData.downloadAssets) {
        formDataToSend.append('downloadAssets', formData.downloadAssets);
      }

      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        const newItem = await response.json();
        dispatch(showNotification('Item uploaded successfully!'));
        onSuccess?.(newItem);
        onClose();
      } else {
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.details || 'Failed to upload item');
        } else {
          // If not JSON, it might be an HTML error page
          const errorText = await response.text();
          console.error('Non-JSON error response:', errorText);
          throw new Error(`Server error (${response.status}): ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      dispatch(showNotification(`Upload failed: ${error.message}`, 'error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-modalFadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#42677D] to-[#5E8EA9] p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Upload New Item</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter item title"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {itemTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your item..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            {/* Pricing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (USD) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.priceUSD}
                onChange={(e) => handleInputChange('priceUSD', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.priceUSD ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.priceUSD && <p className="text-red-500 text-sm mt-1">{errors.priceUSD}</p>}
            </div>

            {/* Platforms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platforms *
              </label>
              <div className="space-y-2">
                {platforms.map(platform => (
                  <label key={platform.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.platforms.includes(platform.value)}
                      onChange={() => handlePlatformToggle(platform.value)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{platform.label}</span>
                  </label>
                ))}
              </div>
              {errors.platforms && <p className="text-red-500 text-sm mt-1">{errors.platforms}</p>}
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.coverImage ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.coverImage && <p className="text-red-500 text-sm mt-1">{errors.coverImage}</p>}
              {formData.coverImage && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {formData.coverImage.name}
                </p>
              )}
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Cover image preview"
                      className="max-w-full h-48 object-cover rounded-lg border border-gray-200 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData(prev => ({ ...prev, coverImage: null }));
                        // Reset file input
                        const fileInput = document.querySelector('input[type="file"]');
                        if (fileInput) fileInput.value = '';
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features (up to 5)
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a feature..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleFeatureRemove(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  {formData.features.length}/5 features added
                </p>
              </div>
              {errors.features && <p className="text-red-500 text-sm mt-1">{errors.features}</p>}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a tag..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        reservedTags.includes(tag.toLowerCase())
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(index)}
                        className="ml-2 hover:opacity-75"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Reserved tags: premium, staffPick, onSale (admin only)
                </p>
              </div>
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibility *
              </label>
              <select
                value={formData.visibility}
                onChange={(e) => handleInputChange('visibility', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {visibilityOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Private/Unlisted allows testing before going live
              </p>
            </div>

            {/* 3D Scene Assets Upload - Only for 3D Objects */}
            {formData.type === '3d-object' && (
              <div className="space-y-6">
                {/* GLB File Upload for Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    3D Scene Assets (.glb format) *
                  </label>
                  <input
                    type="file"
                    accept=".glb"
                    onChange={handleSceneFileChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.sceneAssets ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Upload 3D scene assets for preview display (GLB format)
                  </p>
                  {errors.sceneAssets && <p className="text-red-500 text-sm mt-1">{errors.sceneAssets}</p>}
                  {formData.sceneAssets && (
                    <p className="text-sm text-gray-600 mt-1">
                      Selected: {formData.sceneAssets.name}
                    </p>
                  )}
                </div>

                {/* HYP File Upload for Download */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Download Assets (.hyp format) *
                  </label>
                  <input
                    type="file"
                    accept=".hyp"
                    onChange={handleDownloadFileChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.downloadAssets ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Upload downloadable assets for users (HYP format)
                  </p>
                  {errors.downloadAssets && <p className="text-red-500 text-sm mt-1">{errors.downloadAssets}</p>}
                  {formData.downloadAssets && (
                    <p className="text-sm text-gray-600 mt-1">
                      Selected: {formData.downloadAssets.name}
                    </p>
                  )}
                </div>
                
                {/* 3D Scene Preview */}
                {scenePreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">3D Scene Preview:</p>
                    <div className="relative inline-block w-full">
                      <div className="w-full h-64 bg-gray-100 rounded-lg border border-gray-200 shadow-sm overflow-hidden relative">
                        {/* Loading Overlay */}
                        {isModelLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                              <p className="text-sm text-gray-600">Loading...</p>
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
                      <button
                        type="button"
                        onClick={() => {
                          setScenePreview(null);
                          setFormData(prev => ({ ...prev, sceneAssets: null }));
                          setIsModelLoading(false);
                          // Reset scene file input
                          const sceneInput = document.querySelector('input[accept=".glb"]');
                          if (sceneInput) sceneInput.value = '';
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                        title="Remove 3D scene"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.sceneAssets?.name} - Drag to rotate, scroll to zoom
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* File & Technical Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File & Technical Info
              </label>
              <div className="space-y-4">
                {/* File Size Display */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    File Size (Auto-detected)
                  </label>
                  <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
                    {formData.type === '3d-object' && formData.downloadAssets 
                      ? `${(formData.downloadAssets.size / (1024 * 1024)).toFixed(2)} MB`
                      : formData.coverImage 
                        ? `${(formData.coverImage.size / (1024 * 1024)).toFixed(2)} MB`
                        : 'No file selected'
                    }
                  </div>
                </div>
                
                {/* Installation Instructions */}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Installation Instructions (Optional)
                  </label>
                  <textarea
                    value={formData.installationInstructions}
                    onChange={(e) => handleInputChange('installationInstructions', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter installation instructions..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Provide step-by-step instructions for users to install and use your item
                  </p>
                </div>
              </div>
            </div>

            {/* Coming Soon Message for Non-3D Objects */}
            {formData.type !== '3d-object' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <i className="fas fa-clock text-yellow-600 mr-2"></i>
                  <p className="text-yellow-800 font-medium">Coming Soon!</p>
                </div>
                <p className="text-yellow-700 text-sm mt-1">
                  This item type is not yet available for upload. Only 3D Objects are currently supported.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Uploading...
                  </>
                ) : (
                  'Upload Item'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ItemUploadForm;