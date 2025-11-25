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
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
      onClick={handleBackdropClick}
    >
      <div className="rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6" style={{ borderBottomColor: 'oklch(0.25 0.05 285)', borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.2)' }}>
              <i className="fas fa-cube text-xl" style={{ color: 'oklch(0.45 0.15 290)' }}></i>
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'oklch(0.98 0.01 280)' }}>{item.title}</h2>
              <p className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>3D Object Preview</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="transition-colors"
            style={{ color: 'oklch(0.50 0.05 280)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'oklch(0.65 0.05 280)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'oklch(0.50 0.05 280)';
            }}
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 3D Viewer */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>3D Preview</h3>
              <div className="relative rounded-lg overflow-hidden" style={{ height: '400px', backgroundColor: 'oklch(0.12 0.02 280)' }}>
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: 'oklch(0.45 0.15 290 / 0.3)', borderTopColor: 'oklch(0.45 0.15 290)' }}></div>
                      <p style={{ color: 'oklch(0.65 0.05 280)' }}>Loading 3D model...</p>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center" style={{ color: 'oklch(0.55 0.22 25)' }}>
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
                    <div className="text-center" style={{ color: 'oklch(0.65 0.05 280)' }}>
                      <i className="fas fa-cube text-6xl mb-4"></i>
                      <p className="text-lg font-medium">No 3D Model Available</p>
                      <p className="text-sm">This item doesn't have a 3D preview</p>
                    </div>
                  </div>
                )}
              </div>
              {item?.sceneAssets && (
                <p className="text-xs text-center" style={{ color: 'oklch(0.65 0.05 280)' }}>
                  Drag to rotate • Scroll to zoom • Right-click to pan
                </p>
              )}
            </div>

            {/* Item Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>Details</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>Description</label>
                  <p className="text-sm mt-1" style={{ color: 'oklch(0.65 0.05 280)' }}>{item.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>Price</label>
                    <p className="text-lg font-semibold" style={{ color: 'oklch(0.98 0.01 280)' }}>
                      ${item.priceUSD}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>File Size</label>
                    <p className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>{item.fileSize || 'N/A'}</p>
                  </div>
                </div>

                {item.features && item.features.length > 0 && (
                  <div>
                    <label className="text-sm font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>Features</label>
                    <ul className="text-sm mt-1 space-y-1" style={{ color: 'oklch(0.65 0.05 280)' }}>
                      {item.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <i className="fas fa-check mr-2 text-xs" style={{ color: 'oklch(0.50 0.18 260)' }}></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.supportedPlatforms && item.supportedPlatforms.length > 0 && (
                  <div>
                    <label className="text-sm font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>Supported Platforms</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.supportedPlatforms.map((platform, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 text-xs rounded-full"
                          style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.2)', color: 'oklch(0.45 0.15 290)' }}
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4" style={{ borderTopColor: 'oklch(0.25 0.05 285)', borderTopWidth: '1px', borderTopStyle: 'solid' }}>
                <div className="flex gap-3">
                  <button
                    onClick={onDownload}
                    className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
                      color: 'oklch(0.98 0.01 280)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.50 0.18 260), oklch(0.55 0.18 260))';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))';
                    }}
                  >
                    <i className="fas fa-download mr-2"></i>
                    Download
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg transition-colors"
                    style={{
                      borderColor: 'oklch(0.25 0.05 285)',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      color: 'oklch(0.98 0.01 280)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285 / 0.8)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
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
