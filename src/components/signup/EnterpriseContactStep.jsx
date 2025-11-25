import React, { useState, useEffect, useRef } from 'react';
import { useErrorModal } from '../../hooks/useErrorModal';

const EnterpriseContactStep = ({ formData, onContactScheduled, isProcessingContact, signupProgress }) => {
  const { showError } = useErrorModal();
  const [calendlyLoaded, setCalendlyLoaded] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledData, setScheduledData] = useState(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const calendlyRef = useRef(null);

  // Check for existing scheduled meeting on component mount
  useEffect(() => {
    if (signupProgress && signupProgress.enterpriseContact && signupProgress.enterpriseContact.isScheduled) {
      const existingData = signupProgress.enterpriseContact.contactData;
      if (existingData) {
        setScheduledData(existingData);
        setIsScheduled(true);
      }
    }
  }, [signupProgress]);

  // Load Calendly widget script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => setCalendlyLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const handleCalendlyEvent = async (e) => {
    if (e.data.event === 'calendly.event_scheduled') {
      console.log('Calendly event scheduled:', e.data.payload);
      
      // Extract URIs from payload
      const eventUri = e.data.payload.event.uri;
      const inviteeUri = e.data.payload.invitee.uri;
      
      try {
        // Fetch actual event details from backend
        const token = localStorage.getItem('token');
        const response = await fetch('/api/calendly/event-details', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            eventUri: eventUri,
            inviteeUri: inviteeUri
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch event details');
        }

        const result = await response.json();
        const { event, invitee } = result.data;

        // Extract data from the resource objects
        const eventResource = event.resource;
        const inviteeResource = invitee.resource;

        // Create event data with actual details from Calendly API
        const eventData = {
          eventUuid: eventResource.uri.split('/').pop(),
          inviteeUuid: inviteeResource.uri.split('/').pop(),
          eventUri: eventResource.uri,
          inviteeUri: inviteeResource.uri,
          startTime: eventResource.start_time,
          endTime: eventResource.end_time,
          inviteeName: inviteeResource.name,
          inviteeEmail: inviteeResource.email,
          eventName: eventResource.name,
          eventType: eventResource.event_type,
          status: eventResource.status,
          location: eventResource.location,
          cancelUrl: inviteeResource.cancel_url,
          rescheduleUrl: inviteeResource.reschedule_url,
          timezone: inviteeResource.timezone,
        };
        
        console.log('Processed event data with Calendly API:', eventData);
        setScheduledData(eventData);
        setIsScheduled(true);
        setShowReschedule(false);
        onContactScheduled(eventData);
      } catch (error) {
        console.error('Error fetching event details:', error);
        showError(`Failed to fetch meeting details: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleCalendlyEvent);
    return () => window.removeEventListener('message', handleCalendlyEvent);
  }, []);

  // Initialize Calendly widget when loaded
  useEffect(() => {
    if (calendlyLoaded && window.Calendly && calendlyRef.current && !isScheduled) {
      window.Calendly.initInlineWidget({
        url: showReschedule 
          ? scheduledData?.rescheduleUrl 
          : `${import.meta.env.VITE_CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=42677d`,
        parentElement: calendlyRef.current,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email
        },
        utm: {
          utmCampaign: showReschedule ? 'enterprise-reschedule' : 'enterprise-schedule',
          utmSource: 'edifyengine',
          utmMedium: 'website'
        }
      });
    }
  }, [calendlyLoaded, calendlyRef.current, showReschedule]);

  const handleReschedule = () => {
    setIsScheduled(false);
    setShowReschedule(true);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  // Show scheduled confirmation if meeting is booked
  if (isScheduled && scheduledData) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(to bottom right, oklch(0.50 0.18 260), oklch(0.50 0.18 260))' }}>
            <i className="fas fa-calendar-check text-3xl" style={{ color: 'oklch(0.98 0.01 280)' }}></i>
          </div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>Consultation Scheduled!</h2>
          <p className="text-xl mb-4" style={{ color: 'oklch(0.65 0.05 280)' }}>Your enterprise consultation has been confirmed</p>
        </div>

        <div className="p-8 rounded-2xl mb-8" style={{ 
          background: 'linear-gradient(to bottom right, oklch(0.50 0.18 260 / 0.1), oklch(0.50 0.18 260 / 0.1))',
          borderColor: 'oklch(0.50 0.18 260 / 0.3)',
          borderWidth: '1px',
          borderStyle: 'solid'
        }}>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>Meeting Details</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <i className="fas fa-calendar-alt mr-3" style={{ color: 'oklch(0.50 0.18 260)' }}></i>
                <span className="text-lg font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>
                  {scheduledData.startTime ? formatDateTime(scheduledData.startTime) : 'Meeting scheduled successfully'}
                </span>
              </div>
              <div className="flex items-center justify-center">
                <i className="fas fa-user mr-3" style={{ color: 'oklch(0.50 0.18 260)' }}></i>
                <span className="text-lg" style={{ color: 'oklch(0.98 0.01 280)' }}>{scheduledData.inviteeName}</span>
              </div>
              <div className="flex items-center justify-center">
                <i className="fas fa-envelope mr-3" style={{ color: 'oklch(0.50 0.18 260)' }}></i>
                <span className="text-lg" style={{ color: 'oklch(0.98 0.01 280)' }}>{scheduledData.inviteeEmail}</span>
              </div>
              {scheduledData.eventName && (
                <div className="flex items-center justify-center">
                  <i className="fas fa-calendar-check mr-3" style={{ color: 'oklch(0.50 0.18 260)' }}></i>
                  <span className="text-lg" style={{ color: 'oklch(0.98 0.01 280)' }}>{scheduledData.eventName}</span>
                </div>
              )}
              {scheduledData.location && scheduledData.location.join_url && (
                <div className="flex items-center justify-center">
                  <i className="fas fa-video mr-3" style={{ color: 'oklch(0.50 0.18 260)' }}></i>
                  <a 
                    href={scheduledData.location.join_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-lg underline"
                    style={{ color: 'oklch(0.45 0.15 290)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'oklch(0.50 0.18 260)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'oklch(0.45 0.15 290)';
                    }}
                  >
                    Join Meeting
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg p-6 mb-6" style={{ backgroundColor: 'oklch(0.18 0.05 285)' }}>
            <h4 className="text-lg font-semibold mb-4" style={{ color: 'oklch(0.98 0.01 280)' }}>Meeting Information</h4>
            <div className="space-y-2 text-sm">
              {scheduledData.startTime && scheduledData.endTime && (
                <div>
                  <span className="font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Duration:</span>
                  <span className="ml-2" style={{ color: 'oklch(0.98 0.01 280)' }}>
                    {Math.round((new Date(scheduledData.endTime) - new Date(scheduledData.startTime)) / (1000 * 60))} minutes
                  </span>
                </div>
              )}
              {scheduledData.timezone && (
                <div>
                  <span className="font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Timezone:</span>
                  <span className="ml-2" style={{ color: 'oklch(0.98 0.01 280)' }}>{scheduledData.timezone}</span>
                </div>
              )}
              {scheduledData.status && (
                <div>
                  <span className="font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Status:</span>
                  <span className="ml-2 capitalize" style={{ color: 'oklch(0.98 0.01 280)' }}>{scheduledData.status}</span>
                </div>
              )}
              {scheduledData.location && scheduledData.location.type && (
                <div>
                  <span className="font-medium" style={{ color: 'oklch(0.65 0.05 280)' }}>Meeting Type:</span>
                  <span className="ml-2 capitalize" style={{ color: 'oklch(0.98 0.01 280)' }}>
                    {scheduledData.location.type.replace('_', ' ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="font-medium" style={{ color: 'oklch(0.50 0.18 260)' }}>
              You'll receive a calendar invite and confirmation email shortly with the exact meeting time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleReschedule}
                className="px-6 py-3 rounded-lg transition-colors font-medium"
                style={{
                  backgroundColor: 'oklch(0.18 0.05 285)',
                  color: 'oklch(0.50 0.18 260)',
                  borderColor: 'oklch(0.50 0.18 260)',
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'oklch(0.50 0.18 260 / 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)';
                }}
              >
                <i className="fas fa-calendar-alt mr-2"></i>
                Reschedule Meeting
              </button>
              
              {scheduledData.cancelUrl && (
                <a
                  href={scheduledData.cancelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg transition-colors font-medium"
                  style={{
                    backgroundColor: 'oklch(0.55 0.22 25)',
                    color: 'oklch(0.98 0.01 280)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'oklch(0.60 0.22 25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'oklch(0.55 0.22 25)';
                  }}
                >
                  <i className="fas fa-times mr-2"></i>
                  Cancel Meeting
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(to bottom right, oklch(0.45 0.15 290), oklch(0.50 0.18 260))' }}>
          <i className="fas fa-building text-3xl" style={{ color: 'oklch(0.98 0.01 280)' }}></i>
        </div>
        <h2 className="text-3xl font-bold mb-2" style={{ color: 'oklch(0.98 0.01 280)' }}>Enterprise Consultation</h2>
        <p className="text-xl mb-4" style={{ color: 'oklch(0.65 0.05 280)' }}>Let's discuss your enterprise needs</p>
        <p className="max-w-2xl mx-auto" style={{ color: 'oklch(0.65 0.05 280)' }}>
          Our enterprise team will work with you to create a custom solution that meets your specific requirements. 
          Schedule a consultation to get started.
        </p>
      </div>

      {/* Enterprise Benefits */}
      <div className="rounded-xl p-6 mb-8" style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
        <h3 className="text-lg font-semibold mb-4 text-center" style={{ color: 'oklch(0.98 0.01 280)' }}>What to expect from your consultation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1" style={{ backgroundColor: 'oklch(0.50 0.18 260 / 0.2)' }}>
              <i className="fas fa-check text-sm" style={{ color: 'oklch(0.50 0.18 260)' }}></i>
            </div>
            <div>
              <h4 className="font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>Custom Solution Design</h4>
              <p className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>Tailored architecture for your specific needs</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1" style={{ backgroundColor: 'oklch(0.50 0.18 260 / 0.2)' }}>
              <i className="fas fa-check text-sm" style={{ color: 'oklch(0.50 0.18 260)' }}></i>
            </div>
            <div>
              <h4 className="font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>Dedicated Support</h4>
              <p className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>24/7 enterprise-grade support team</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1" style={{ backgroundColor: 'oklch(0.50 0.18 260 / 0.2)' }}>
              <i className="fas fa-check text-sm" style={{ color: 'oklch(0.50 0.18 260)' }}></i>
            </div>
            <div>
              <h4 className="font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>Scalable Infrastructure</h4>
              <p className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>Unlimited worlds and custom domains</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1" style={{ backgroundColor: 'oklch(0.50 0.18 260 / 0.2)' }}>
              <i className="fas fa-check text-sm" style={{ color: 'oklch(0.50 0.18 260)' }}></i>
            </div>
            <div>
              <h4 className="font-medium" style={{ color: 'oklch(0.98 0.01 280)' }}>Priority Implementation</h4>
              <p className="text-sm" style={{ color: 'oklch(0.65 0.05 280)' }}>Fast-track deployment and onboarding</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendly Inline Widget */}
      <div className="text-center space-y-6">
        <div className="rounded-lg p-6" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.1)', borderColor: 'oklch(0.45 0.15 290 / 0.3)', borderWidth: '1px', borderStyle: 'solid' }}>
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: 'oklch(0.45 0.15 290 / 0.2)' }}>
              <i className="fas fa-calendar-alt text-xl" style={{ color: 'oklch(0.45 0.15 290)' }}></i>
            </div>
            <div className="text-left">
              <h4 className="text-lg font-semibold" style={{ color: 'oklch(0.45 0.15 290)' }}>
                {showReschedule ? 'Reschedule Your Consultation' : 'Schedule Your Consultation'}
              </h4>
              <p className="text-sm" style={{ color: 'oklch(0.45 0.15 290)' }}>
                {showReschedule ? 'Choose a new time that works for you' : 'Choose a time that works for you'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4 text-sm" style={{ color: 'oklch(0.45 0.15 290)' }}>
            <div className="flex items-center">
              <i className="fas fa-clock mr-1"></i>
              <span>15 minutes</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-video mr-1"></i>
              <span>Video call</span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-users mr-1"></i>
              <span>Expert team</span>
            </div>
          </div>
        </div>

        {/* Calendly Inline Widget */}
        <div className="rounded-xl p-4" style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)', borderWidth: '1px', borderStyle: 'solid' }}>
          {calendlyLoaded ? (
            <div 
              className="calendly-inline-widget" 
              data-url={showReschedule 
                ? scheduledData.rescheduleUrl
                : `${import.meta.env.VITE_CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=42677d`} 
              style={{minWidth: '320px', height: '700px'}}
              ref={calendlyRef}
            ></div>
          ) : (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: 'oklch(0.45 0.15 290 / 0.3)', borderTopColor: 'oklch(0.45 0.15 290)' }}></div>
                <p style={{ color: 'oklch(0.65 0.05 280)' }}>Loading scheduling widget...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnterpriseContactStep;
