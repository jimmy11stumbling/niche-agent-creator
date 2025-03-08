
/**
 * Network status detection utility
 * Helps detect when the application goes offline and provides methods to handle it
 */

// Variables to track network status
let isOnline = navigator.onLine;
let retryCallbacks: Record<string, () => void> = {};
let listeners: Array<(online: boolean) => void> = [];

// Set up event listeners for online/offline status
window.addEventListener('online', () => {
  isOnline = true;
  notifyListeners();
  handleReconnection();
});

window.addEventListener('offline', () => {
  isOnline = false;
  notifyListeners();
});

// Function to notify all listeners of network status change
function notifyListeners() {
  listeners.forEach(listener => listener(isOnline));
}

// Function to retry all registered callbacks when coming back online
function handleReconnection() {
  Object.values(retryCallbacks).forEach(callback => {
    if (typeof callback === 'function') {
      setTimeout(callback, 1000); // Delay to ensure stable connection
    }
  });
}

/**
 * Add a listener for network status changes
 * @param listener Function to call when network status changes
 * @returns Function to remove the listener
 */
export function addNetworkListener(listener: (online: boolean) => void): () => void {
  listeners.push(listener);
  // Call immediately with current status
  listener(isOnline);
  
  // Return function to remove listener
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

/**
 * Register a callback to be called when network connection is restored
 * @param id Unique identifier for this callback
 * @param callback Function to call when connection is restored
 */
export function registerReconnectCallback(id: string, callback: () => void): void {
  retryCallbacks[id] = callback;
}

/**
 * Unregister a reconnect callback
 * @param id ID of the callback to remove
 */
export function unregisterReconnectCallback(id: string): void {
  delete retryCallbacks[id];
}

/**
 * Check if the application is currently online
 * @returns Current online status
 */
export function checkOnlineStatus(): boolean {
  return isOnline;
}

/**
 * Utility to wrap fetch calls with offline handling
 * @param url URL to fetch
 * @param options Fetch options
 * @param retryId ID for auto-retry on reconnection
 * @returns Promise with fetch results
 */
export async function fetchWithOfflineHandling(
  url: string, 
  options?: RequestInit,
  retryId?: string
): Promise<Response> {
  try {
    if (!isOnline) {
      throw new Error('Application is offline');
    }
    
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    console.error('Network request failed:', error);
    
    // If this is a network error and we have a retryId, register for retry
    if (retryId && (!navigator.onLine || (error instanceof TypeError && error.message.includes('network')))) {
      registerReconnectCallback(retryId, () => {
        console.log(`Retrying request: ${retryId}`);
        // The actual retry logic would be handled by the caller
      });
    }
    
    throw error;
  }
}

export default {
  addNetworkListener,
  registerReconnectCallback,
  unregisterReconnectCallback,
  checkOnlineStatus,
  fetchWithOfflineHandling
};
