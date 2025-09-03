import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../store/uiSlice';

const ItemUploadForm = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'app',
    category: 'other',
    priceUSD: 0,
    priceSOL: 0,
    image: '',
    images: [],
    video: '',
    features: [],
    requirements: '',
    fileSize: '',
    version: '1.0.0',
    downloadUrl: '',
    license: 'personal',
    supportedPlatforms: [],
    tags: [],
    keywords: [],
    installationInstructions: '',
    demoUrl: '',
    documentationUrl: '',
    isFeatured: false,
    isLimited: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  const itemTypes = [
    { value: 'app', label: 'Application' },
    { value: 'bundle', label: 'Bundle' },
    { value: 'template', label: 'Template' },
    { value: 'world', label: 'World' },
    { value: 'asset', label: 'Asset' },
    { value: 'service', label: 'Service' }
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

  const licenses = [
    { value: 'free', label: 'Free' },
    { value: 'personal', label: 'Personal' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'enterprise', label: 'Enterprise' },
    { value: 'custom', label: 'Custom' }
  ];

  const platforms = [
    { value: 'web', label: 'Web' },
    { value: 'windows', label: 'Windows' },
    { value: 'mac', label: 'Mac' },
    { value: 'linux', label: 'Linux' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'vr', label: 'VR' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayAdd = (field, value, setter) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setter('');
    }
  };

  const handleArrayRemove = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.priceUSD < 0) {
      newErrors.priceUSD = 'Price must be non-negative';
    }

    if (formData.priceSOL < 0) {
      newErrors.priceSOL = 'Price must be non-negative';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Main image URL is required';
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
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const newItem = await response.json();
        dispatch(showNotification('Item uploaded successfully!'));
        onSuccess?.(newItem);
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload item');
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-modalFadeIn">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License
                </label>
                <select
                  value={formData.license}
                  onChange={(e) => handleInputChange('license', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {licenses.map(license => (
                    <option key={license.value} value={license.value}>{license.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (SOL)
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  value={formData.priceSOL}
                  onChange={(e) => handleInputChange('priceSOL', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.000"
                />
              </div>
            </div>

            {/* Media */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Image URL *
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.image ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL
                </label>
                <input
                  type="url"
                  value={formData.video}
                  onChange={(e) => handleInputChange('video', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/video.mp4"
                />
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a feature..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd('features', newFeature, setNewFeature))}
                />
                <button
                  type="button"
                  onClick={() => handleArrayAdd('features', newFeature, setNewFeature)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('features', index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a tag..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd('tags', newTag, setNewTag))}
                />
                <button
                  type="button"
                  onClick={() => handleArrayAdd('tags', newTag, setNewTag)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('tags', index)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Version
                </label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => handleInputChange('version', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1.0.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Size
                </label>
                <input
                  type="text"
                  value={formData.fileSize}
                  onChange={(e) => handleInputChange('fileSize', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 50MB, 1.2GB"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Download URL
              </label>
              <input
                type="url"
                value={formData.downloadUrl}
                onChange={(e) => handleInputChange('downloadUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/download"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Installation Instructions
              </label>
              <textarea
                value={formData.installationInstructions}
                onChange={(e) => handleInputChange('installationInstructions', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Provide installation instructions..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Demo URL
                </label>
                <input
                  type="url"
                  value={formData.demoUrl}
                  onChange={(e) => handleInputChange('demoUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/demo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Documentation URL
                </label>
                <input
                  type="url"
                  value={formData.documentationUrl}
                  onChange={(e) => handleInputChange('documentationUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/docs"
                />
              </div>
            </div>

            {/* Supported Platforms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supported Platforms
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {platforms.map(platform => (
                  <label key={platform.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.supportedPlatforms.includes(platform.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleInputChange('supportedPlatforms', [...formData.supportedPlatforms, platform.value]);
                        } else {
                          handleInputChange('supportedPlatforms', formData.supportedPlatforms.filter(p => p !== platform.value));
                        }
                      }}
                      className="mr-2"
                    />
                    {platform.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                  className="mr-2"
                />
                Featured Item
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isLimited}
                  onChange={(e) => handleInputChange('isLimited', e.target.checked)}
                  className="mr-2"
                />
                Limited Edition
              </label>
            </div>

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
