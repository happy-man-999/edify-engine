import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import GlobalStyles from '../components/GlobalStyles';
import ItemUploadForm from '../components/contribute/ItemUploadForm';

const Contribute = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [stats, setStats] = useState({ itemCount: 0, totalEarnedSOL: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch contributor stats - MUST be called before any early returns
  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthenticated || !user?.isContributor) return;
      
      try {
        setStatsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('/api/items/contributor/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          console.error('Failed to fetch contributor stats');
        }
      } catch (error) {
        console.error('Error fetching contributor stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();

    // Listen for balance update events (e.g., after purchase)
    const handleBalanceUpdate = () => {
      fetchStats();
    };

    window.addEventListener('balanceUpdated', handleBalanceUpdate);
    return () => {
      window.removeEventListener('balanceUpdated', handleBalanceUpdate);
    };
  }, [isAuthenticated, user]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading</h2>
            <p className="text-gray-600">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is authenticated and is a contributor
  if (!isAuthenticated || !user?.isContributor) {
    navigate('/home');
    return null;
  }

  return (
    <main className="flex-1 p-6 pt-24">
      <GlobalStyles />
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <section className="hero-section mb-8 p-8 relative rounded-3xl overflow-hidden">
          <div className="sky-background absolute inset-0"></div>
          <div className="clouds absolute inset-0"></div>
          <div className="hero-content max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl font-bold mb-4">
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  background: 'linear-gradient(to right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >Contribute</span>
            </h1>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              Welcome to the contributor dashboard! Here you can contribute to the platform and access exclusive features.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-md font-medium">
                <i className="fas fa-user-plus mr-2"></i>
                Contributor Access
              </span>
              <span 
                className="text-white px-4 py-2 rounded-md font-medium"
                style={{ backgroundColor: 'oklch(0.45 0.15 290)' }}
              >
                <i className="fas fa-shield-alt mr-2"></i>
                Welcome, {user?.firstName || user?.email}
              </span>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contribution Tools */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-purple-100 rounded-xl">
                <i className="fas fa-tools text-purple-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">Contribution Tools</h2>
                <p className="text-gray-600">Access tools to contribute to the platform</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Upload Store Items</h3>
                    <p className="text-sm text-gray-600">Create and upload new items for the store</p>
                  </div>
                  <i className="fas fa-upload text-blue-600"></i>
                </div>
              </button>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Content Creation</h3>
                    <p className="text-sm text-gray-600">Create and submit content for the platform</p>
                  </div>
                  <i className="fas fa-arrow-right text-gray-400"></i>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Community Management</h3>
                    <p className="text-sm text-gray-600">Help manage and moderate the community</p>
                  </div>
                  <i className="fas fa-arrow-right text-gray-400"></i>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Feedback & Suggestions</h3>
                    <p className="text-sm text-gray-600">Submit feedback and improvement suggestions</p>
                  </div>
                  <i className="fas fa-arrow-right text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Contributor Stats */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-100 rounded-xl">
                <i className="fas fa-chart-line text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">Your Contributions</h2>
                <p className="text-gray-600">Track your contribution activity</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Uploaded Items</p>
                  {statsLoading ? (
                    <div className="animate-pulse h-8 w-16 bg-gray-200 rounded mt-1"></div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{stats.itemCount}</p>
                  )}
                </div>
                <i className="fas fa-box text-gray-400 text-xl"></i>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Total Earned SOL</p>
                  {statsLoading ? (
                    <div className="animate-pulse h-8 w-24 bg-gray-200 rounded mt-1"></div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{stats.totalEarnedSOL.toFixed(6)} SOL</p>
                  )}
                </div>
                <i className="fas fa-coins text-yellow-500 text-xl"></i>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Contributor Since</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
                <i className="fas fa-calendar text-gray-400 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/store')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center mb-2">
                <i className="fas fa-store text-blue-600 mr-2"></i>
                <h3 className="font-medium text-gray-900">Visit Store</h3>
              </div>
              <p className="text-sm text-gray-600">Browse and purchase items from the store</p>
            </button>
            
            <button 
              onClick={() => navigate('/home')}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center mb-2">
                <i className="fas fa-home text-green-600 mr-2"></i>
                <h3 className="font-medium text-gray-900">Go Home</h3>
              </div>
              <p className="text-sm text-gray-600">Return to the main homepage</p>
            </button>
            
            <button 
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center mb-2">
                <i className="fas fa-envelope text-purple-600 mr-2"></i>
                <h3 className="font-medium text-gray-900">Contact Support</h3>
              </div>
              <p className="text-sm text-gray-600">Get help with your contributor account</p>
            </button>
          </div>
        </div>
      </div>

        {/* Item Upload Modal */}
      {isUploadModalOpen && (
        <ItemUploadForm
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={(newItem) => {
            console.log('Item uploaded successfully:', newItem);
            // Refresh stats after successful upload
            const fetchStats = async () => {
              try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/items/contributor/stats', {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });

                if (response.ok) {
                  const data = await response.json();
                  setStats(data);
                }
              } catch (error) {
                console.error('Error fetching contributor stats:', error);
              }
            };
            fetchStats();
          }}
        />
      )}
    </main>
  );
};

export default Contribute;
