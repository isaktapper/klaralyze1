// Klaralyze Analytics Tracking Script
(function(window, document) {
  const ENDPOINT = 'https://api.klaralyze.com/track'; // Replace with your actual endpoint
  
  // Generate a unique session ID
  const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
  
  // Get browser and device information
  const deviceInfo = {
    browser: navigator.userAgent,
    os: navigator.platform,
    device_type: /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(navigator.userAgent) ? 'mobile' : 'desktop',
    screen_resolution: `${window.screen.width}x${window.screen.height}`
  };

  // Track page views
  function trackPageView() {
    const event = {
      event_type: 'pageview',
      event_name: document.title,
      session_id: sessionId,
      page_url: window.location.href,
      referrer: document.referrer,
      device_info: deviceInfo,
      properties: {
        path: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash
      }
    };

    sendEvent(event);
  }

  // Track custom events
  function trackEvent(name, properties = {}) {
    const event = {
      event_type: 'custom',
      event_name: name,
      session_id: sessionId,
      page_url: window.location.href,
      referrer: document.referrer,
      device_info: deviceInfo,
      properties
    };

    sendEvent(event);
  }

  // Send event to the backend
  function sendEvent(event) {
    const projectId = window.klaralyze?.projectId;
    if (!projectId) {
      console.error('Klaralyze: Project ID not configured');
      return;
    }

    const payload = {
      ...event,
      project_id: projectId,
      timestamp: new Date().toISOString()
    };

    // Use sendBeacon for better reliability, fallback to fetch
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(ENDPOINT, blob);
    } else {
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(console.error);
    }
  }

  // Initialize tracking
  function init(projectId) {
    window.klaralyze = {
      projectId,
      trackEvent
    };

    // Track initial page view
    trackPageView();

    // Track page views on navigation (for SPAs)
    let lastUrl = window.location.href;
    window.addEventListener('popstate', () => {
      if (lastUrl !== window.location.href) {
        lastUrl = window.location.href;
        trackPageView();
      }
    });

    // Track clicks on links and buttons
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a, button');
      if (!target) return;

      const properties = {
        element_type: target.tagName.toLowerCase(),
        element_text: target.innerText?.trim(),
        element_id: target.id,
        element_class: target.className
      };

      if (target.tagName === 'A') {
        properties.href = target.href;
      }

      trackEvent('click', properties);
    });
  }

  // Expose the init function globally
  window.klaralyzeInit = init;
})(window, document); 