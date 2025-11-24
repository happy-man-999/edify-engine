import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import UserManagement from '../components/admin/UserManagement';
import DropletManagement from '../components/admin/DropletManagement';
import PaymentActivity from '../components/admin/PaymentActivity';
import LogsStatus from '../components/admin/LogsStatus';
import SettingsConfigs from '../components/admin/SettingsConfigs';
import ItemsManagement from '../components/admin/ItemsManagement';
import WithdrawManagement from '../components/admin/WithdrawManagement';
import DemoEmailsManagement from '../components/admin/DemoEmailsManagement';
import GlobalStyles from '../components/GlobalStyles';

const Admin = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'oklch(0.12 0.02 280)' }}>
        <div className="rounded-xl shadow-sm p-8 max-w-md w-full mx-4" style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}>
          <div className="text-center">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
              style={{ borderColor: 'oklch(0.45 0.15 290)' }}
            ></div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>Loading Admin Panel</h2>
            <p style={{ color: 'oklch(0.65 0.05 280)' }}>Please wait while we verify your access...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is admin (you can modify this logic based on your admin criteria)
  if (!isAuthenticated || user?.role !== 'admin') {
    navigate('/home');
    return null;
  }

  const tabs = [
    { id: 'users', label: 'Users', icon: 'fas fa-users' },
    { id: 'demo-emails', label: 'Demo Emails', icon: 'fas fa-envelope' },
    { id: 'droplets', label: 'Droplets', icon: 'fas fa-server' },
    { id: 'payments', label: 'Payments', icon: 'fas fa-credit-card' },
    { id: 'items', label: 'Items', icon: 'fas fa-box' },
    { id: 'withdrawals', label: 'Withdrawals', icon: 'fas fa-money-bill-wave' },
    { id: 'logs', label: 'Logs & Status', icon: 'fas fa-chart-line' },
    { id: 'settings', label: 'Settings & Configs', icon: 'fas fa-cog' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'demo-emails':
        return <DemoEmailsManagement />;
      case 'items':
        return <ItemsManagement />;
      case 'droplets':
        return <DropletManagement />;
      case 'payments':
        return <PaymentActivity />;
      case 'withdrawals':
        return <WithdrawManagement />;
      case 'logs':
        return <LogsStatus />;
      case 'settings':
        return <SettingsConfigs />;
      default:
        return <UserManagement />;
    }
  };

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
              >Admin Dashboard</span>
            </h1>
            <p className="text-lg mb-6 max-w-2xl mx-auto" style={{ color: 'oklch(0.65 0.05 280)' }}>
              Manage users, droplets, payments, and system configurations
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <span 
                className="text-white px-4 py-2 rounded-md font-medium"
                style={{ backgroundColor: 'oklch(0.45 0.15 290)' }}
              >
                <i className="fas fa-shield-alt mr-2"></i>
                Welcome, {user?.name || user?.email}
              </span>
              <button
                onClick={() => navigate('/home')}
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
                    ? 'text-white shadow-md'
                    : ''
                }`}
                style={activeTab === tab.id ? {
                  backgroundColor: 'oklch(0.45 0.15 290)'
                } : {
                  color: 'oklch(0.65 0.05 280)'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.color = 'oklch(0.98 0.01 280)';
                    e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.color = 'oklch(0.65 0.05 280)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div 
          className="rounded-2xl shadow-sm border p-6"
          style={{
            backgroundColor: 'oklch(0.18 0.05 285)',
            borderColor: 'oklch(0.25 0.05 285)'
          }}
        >
          {renderTabContent()}
        </div>
      </div>
    </main>
  );
};

export default Admin; 