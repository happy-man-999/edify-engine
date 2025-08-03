import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import UserManagement from '../components/admin/UserManagement';
import DropletManagement from '../components/admin/DropletManagement';
import PaymentActivity from '../components/admin/PaymentActivity';
import LogsStatus from '../components/admin/LogsStatus';
import SettingsConfigs from '../components/admin/SettingsConfigs';
import GlobalStyles from '../components/GlobalStyles';

const Admin = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Admin Panel</h2>
            <p className="text-gray-600">Please wait while we verify your access...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is admin (you can modify this logic based on your admin criteria)
  if (!isAuthenticated || user?.role !== 'admin') {
    navigate('/');
    return null;
  }

  const tabs = [
    { id: 'users', label: 'User Management', icon: 'fas fa-users' },
    { id: 'droplets', label: 'Droplet Management', icon: 'fas fa-server' },
    { id: 'payments', label: 'Payment Activity', icon: 'fas fa-credit-card' },
    { id: 'logs', label: 'Logs & Status', icon: 'fas fa-chart-line' },
    { id: 'settings', label: 'Settings & Configs', icon: 'fas fa-cog' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'droplets':
        return <DropletManagement />;
      case 'payments':
        return <PaymentActivity />;
      case 'logs':
        return <LogsStatus />;
      case 'settings':
        return <SettingsConfigs />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <main className="flex-1 p-6">
      <GlobalStyles />
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <section className="hero-section mb-8 p-8 relative rounded-3xl overflow-hidden">
          <div className="sky-background absolute inset-0"></div>
          <div className="clouds absolute inset-0"></div>
          <div className="hero-content max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Admin Dashboard</span>
            </h1>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              Manage users, droplets, payments, and system configurations
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <span className="bg-[#42677D] text-white px-4 py-2 rounded-md font-medium">
                <i className="fas fa-shield-alt mr-2"></i>
                Welcome, {user?.name || user?.email}
              </span>
              <button
                onClick={() => navigate('/')}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md transition shadow-sm font-medium"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Site
              </button>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
          <nav className="flex flex-wrap justify-center p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 mx-2 mb-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#42677D] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {renderTabContent()}
        </div>
      </div>
    </main>
  );
};

export default Admin; 