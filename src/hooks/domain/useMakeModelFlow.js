/**
 * useMakeModelFlow Hook - Main orchestrator for MakeModel flow
 * Implements Single Responsibility Principle (SRP) and manages flow state
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { trackValuationStep, trackFormSubmit } from '../../utils/tracking';

const STEP_PATHS = {
  1: '/valuation',
  2: '/valuation/vehicledetails',
  3: '/valuation/vehiclecondition',
  4: '/secure/bookappointment',
};

const STEP_NAMES = {
  1: 'Vehicle Information',
  2: 'Series & Body',
  3: 'Vehicle Condition',
  4: 'Appointment Scheduling',
};

/**
 * Get step number from URL path
 * @param {string} path - Current URL path
 * @param {Object} vehicleData - Current vehicle data
 * @returns {number} Step number
 */
const getStepFromPath = (path, vehicleData) => {
  // Use window.location.pathname as fallback for more reliable path detection
  const effectivePath = path || window.location.pathname;
  
  if (effectivePath.includes('/secure/bookappointment')) return 4;
  if (effectivePath.includes('/valuation/vehiclecondition')) return 3;
  if (effectivePath.includes('/valuation/vehicledetails')) return 2;
  if (effectivePath === '/valuation' || effectivePath === '/sell-by-make-model') return 1;

  // Fallback based on data
  const hasInitialData = vehicleData?.year && vehicleData?.make && vehicleData?.model;
  if (hasInitialData && vehicleData?.series && vehicleData?.bodyType) return 3;
  if (hasInitialData) return 2;
  return 1;
};

/**
 * Custom hook for MakeModel flow management
 * @returns {Object} Flow state and navigation methods
 */
export function useMakeModelFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const { uid } = useParams();
  const { vehicleData, updateVehicleData, resetData } = useApp();

  // Extract uid from URL path as fallback (for cases where useParams doesn't work immediately)
  const getUidFromPath = () => {
    const pathParts = location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    // Check if it looks like a UUID
    if (lastPart && lastPart.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      return lastPart;
    }
    return null;
  };

  // Initialize customerJourneyId with uid from URL first, then path extraction, then localStorage
  const [customerJourneyId, setCustomerJourneyId] = useState(() => {
    return uid || getUidFromPath() || localStorage.getItem('customerJourneyId') || '';
  });
  // Use window.location.pathname for initial step to ensure correct value on mobile reload
  const [step, setStep] = useState(() => getStepFromPath(window.location.pathname, vehicleData));

  // Keep customerJourneyId in sync with URL param - always prioritize URL
  useEffect(() => {
    const effectiveUid = uid || getUidFromPath();
    if (effectiveUid && effectiveUid !== customerJourneyId) {
      setCustomerJourneyId(effectiveUid);
      localStorage.setItem('customerJourneyId', effectiveUid);
    }
  }, [uid, location.pathname, customerJourneyId]);

  // Sync step with URL
  useEffect(() => {
    const newStep = getStepFromPath(location.pathname, vehicleData);
    
    setStep((prevStep) => {
      if (prevStep !== newStep) {
        trackValuationStep(newStep, STEP_NAMES[newStep] || `Step ${newStep}`, vehicleData);
        return newStep;
      }
      return prevStep;
    });
  }, [location.pathname, vehicleData]);

  /**
   * Navigate to a specific step
   * @param {number} newStep - Target step number
   */
  const navigateToStep = useCallback((newStep) => {
    // Prioritize: uid from URL > path extraction > customerJourneyId state > localStorage
    const id = uid || getUidFromPath() || customerJourneyId || localStorage.getItem('customerJourneyId');
    const basePath = STEP_PATHS[newStep] || '/valuation';
    const targetPath = `${basePath}/${id}`;

    console.log('🧭 navigateToStep called:', {
      newStep,
      currentPath: location.pathname,
      targetPath,
      id,
      isMobile: window.innerWidth < 768
    });

    // Check if we're already on the correct step URL - if so, don't navigate
    const currentStep = getStepFromPath(location.pathname, vehicleData);
    if (currentStep === newStep && location.pathname.includes(id)) {
      console.log('✅ Already on correct step, skipping navigation');
      setStep(newStep);
      return;
    }

    if (location.pathname !== targetPath) {
      console.log('🚀 Navigating from', location.pathname, 'to', targetPath);
      setStep(newStep);
      
      // For mobile, use window.location directly as React Router seems to have issues
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        console.log('� vMobile detected, using window.location for navigation');
        window.location.href = targetPath;
      } else {
        // Desktop: use React Router
        try {
          navigate(targetPath, { replace: true });
          console.log('🖥️ Desktop: React Router navigate called');
        } catch (error) {
          console.error('❌ React Router navigate failed:', error);
          window.location.href = targetPath;
        }
      }
      
      trackValuationStep(newStep, STEP_NAMES[newStep] || `Step ${newStep}`, vehicleData);
    } else {
      console.log('✅ Already at target path, just updating step state');
      setStep(newStep);
    }
  }, [uid, getUidFromPath, customerJourneyId, location.pathname, vehicleData, navigate]);

  /**
   * Go to next step
   */
  const nextStep = useCallback(() => {
    if (step < 4) {
      navigateToStep(step + 1);
    }
  }, [step, navigateToStep]);

  /**
   * Go to previous step
   */
  const prevStep = useCallback(() => {
    if (step > 1) {
      navigateToStep(step - 1);
    }
  }, [step, navigateToStep]);

  /**
   * Reset flow and navigate to home
   */
  const resetFlow = useCallback(() => {
    resetData();
    navigate('/');
  }, [resetData, navigate]);

  /**
   * Track form submission
   * @param {string} formName - Name of the form
   * @param {Object} data - Form data
   */
  const trackSubmission = useCallback((formName, data) => {
    trackFormSubmit(formName, data);
  }, []);

  return {
    step,
    setStep,
    customerJourneyId,
    navigateToStep,
    nextStep,
    prevStep,
    resetFlow,
    trackSubmission,
    STEP_NAMES,
  };
}
