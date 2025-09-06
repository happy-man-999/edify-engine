import React, { useEffect, useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { useCurrency } from '../hooks/useCurrency';

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

const ThreeDPreviewModal = ({ item, onClose, onDownload }) => {
  const canvasRef = useRef(null);
  const { showPrice } = useCurrency();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewer, setViewer] = useState(null);
  const [signedUrl, setSignedUrl] = useState(null);

  useEffect(() => {
    if (!item?.sceneAssets) {
      setLoading(false);
      setError('No 3D model available');
      return;
    }

    // Reset states when item changes
    setLoading(true);
    setError(null);
    setSignedUrl(null);
    
    // Fetch signed URL for the 3D model
    const fetchSignedUrl = async () => {
      try {
        const response = await fetch(`/api/items/signed-url-3d/${item._id || item.id}`);
        if (!response.ok) {
          throw new Error('Failed to get signed URL');
        }
        const data = await response.json();
        setSignedUrl(data.signedUrl);
        console.log('Got signed URL for 3D model:', data.signedUrl);
      } catch (err) {
        console.error('Error fetching signed URL:', err);
        setError('Failed to load 3D model');
        setLoading(false);
      }
    };
    
    fetchSignedUrl();
  }, [item?.sceneAssets, item?._id, item?.id]);

  const handleModelLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleModelError = (error) => {
    console.error('3D Model loading error:', error);
    setLoading(false);
    setError('Failed to load 3D model. Please check if the file is accessible.');
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-cube text-purple-600 text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{item.title}</h2>
              <p className="text-sm text-gray-500">3D Object Preview</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 3D Viewer */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">3D Preview</h3>
              <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading 3D model...</p>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center text-red-600">
                      <i className="fas fa-exclamation-triangle text-4xl mb-4"></i>
                      <p>{error}</p>
                    </div>
                  </div>
                )}

                {item?.sceneAssets && !error && signedUrl && (
                  <Canvas 
                    camera={{ position: [0, 0, 5], fov: 50 }}
                    onError={handleModelError}
                  >
                    <Suspense fallback={null}>
                      <ambientLight intensity={0.5} />
                      <directionalLight position={[10, 10, 5]} intensity={1} />
                      <Model 
                        url={signedUrl} 
                        onLoad={handleModelLoad}
                      />
                      <OrbitControls 
                        enablePan={true} 
                        enableZoom={true} 
                        enableRotate={true}
                        minDistance={1}
                        maxDistance={10}
                      />
                      <Environment preset="sunset" />
                    </Suspense>
                  </Canvas>
                )}

                {!item?.sceneAssets && !loading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      <i className="fas fa-cube text-6xl mb-4"></i>
                      <p className="text-lg font-medium">No 3D Model Available</p>
                      <p className="text-sm">This item doesn't have a 3D preview</p>
                    </div>
                  </div>
                )}
              </div>
              {item?.sceneAssets && (
                <p className="text-xs text-gray-500 text-center">
                  Drag to rotate • Scroll to zoom • Right-click to pan
                </p>
              )}
            </div>

            {/* Item Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Details</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Price</label>
                    <p className="text-lg font-semibold text-gray-900">
                      ${item.priceUSD}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">File Size</label>
                    <p className="text-sm text-gray-600">{item.fileSize || 'N/A'}</p>
                  </div>
                </div>

                {item.features && item.features.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Features</label>
                    <ul className="text-sm text-gray-600 mt-1 space-y-1">
                      {item.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <i className="fas fa-check text-green-500 mr-2 text-xs"></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.supportedPlatforms && item.supportedPlatforms.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Supported Platforms</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.supportedPlatforms.map((platform, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex gap-3">
                  <button
                    onClick={onDownload}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <i className="fas fa-download mr-2"></i>
                    Download
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDPreviewModal;
