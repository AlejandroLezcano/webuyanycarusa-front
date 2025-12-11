/**
 * Vehicle Service - Handles all vehicle-related API calls
 * Implements SRP and relies on httpClient for JWT injection.
 */

import axios from "axios";
import httpClient from "./utils/httpClient";
import { getCookie, random10Digits } from "../utils/helpers";

const NHTSA_BASE_URL = "https://vpic.nhtsa.dot.gov/api/vehicles";

/* ----------------------------------------------------------
 * VIN DECODER (External API)
 * --------------------------------------------------------*/

export const decodeVIN = async (vin, retries = 2) => {
  try {
    const resp = await axios.get(
      `${NHTSA_BASE_URL}/DecodeVinValues/${vin}?format=json`
    );

    const r = resp.data?.Results?.[0] ?? {};

    return {
      vin,
      make: r.Make,
      model: r.Model,
      year: r.ModelYear,
      trim: r.Trim,
      bodyClass: r.BodyClass,
      engineSize: r.DisplacementL,
      fuelType: r.FuelTypePrimary,
      transmission: r.TransmissionStyle,
      driveType: r.DriveType,
      vehicleType: r.VehicleType,
      manufacturer: r.Manufacturer,
    };
  } catch (err) {
    console.error("VIN decode error:", err);
    return retries > 0 ? decodeVIN(vin, retries - 1) : null;
  }
};

/* ----------------------------------------------------------
 * LICENSE PLATE DECODER (Mock)
 * --------------------------------------------------------*/

export const decodeLicensePlate = async (plate, state, retries = 2) => {
  try {
    await new Promise((res) => setTimeout(res, 1500));

    return {
      plate,
      state,
      make: "Toyota",
      model: "Camry",
      year: "2020",
      vin: "MOCK1234567890VIN",
      color: "Silver",
      registrationStatus: "Active",
    };
  } catch (err) {
    console.error("License plate lookup error:", err);
    return retries > 0
      ? decodeLicensePlate(plate, state, retries - 1)
      : null;
  }
};

/* ----------------------------------------------------------
 * VEHICLE ATTRIBUTES
 * --------------------------------------------------------*/

export const getVehicleMakes = async (year, retries = 2) => {
  try {
    const r = await httpClient.get(`/vehicles/makes/${year}`);
    return r.data.sort();
  } catch (err) {
    console.error("Get makes error:", err);
    return retries > 0 ? getVehicleMakes(year, retries - 1) : [];
  }
};

export const getModelsByMake = async (year, make, retries = 2) => {
  try {
    const r = await httpClient.get(`/vehicles/models/${year}/${make}`);
    return r.data.sort();
  } catch (err) {
    console.error("Get models error:", err);
    return retries > 0 ? getModelsByMake(year, make, retries - 1) : [];
  }
};

export const getSeries = async (year, make, model, retries = 2) => {
  try {
    const r = await httpClient.get(`/vehicles/trims/${year}/${make}?model=${encodeURIComponent(model)}`);
    return r.data.sort();
  } catch (err) {
    console.error("Get trims error:", err);
    return retries > 0 ? getSeries(year, make, model, retries - 1) : [];
  }
};

export const getVehicleYears = async (retries = 2) => {
  try {
    const r = await httpClient.get(`/vehicles/years`);
    return r.data;
  } catch (err) {
    console.error("Get years error:", err);
    return retries > 0 ? getVehicleYears(retries - 1) : [];
  }
};

/* ----------------------------------------------------------
 * CUSTOMER JOURNEY
 * --------------------------------------------------------*/

export const createVisitorID = async (retries = 2) => {
  try {
    const r = await httpClient.post(`/attribution/visitor`, {
      oldVisitorId: random10Digits(),
    });
    return r.data;
  } catch (err) {
    console.error("Create visitor ID error:", err);
    return retries > 0 ? createVisitorID(retries - 1) : null;
  }
};

export const createCustomerJourney = async (
  year,
  make,
  model,
  visitId = 1,
  retries = 2
) => {
  try {
    const r = await httpClient.post(`/customer-journey`, {
      year,
      make,
      model,
      visitId,
    });
    return r.data;
  } catch (err) {
    console.error("Create customer journey error:", err);
    return retries > 0
      ? createCustomerJourney(year, make, model, visitId, retries - 1)
      : null;
  }
};

export const createCustomerJourneyByPlate = async (
  visitId,
  plateNumber,
  plateState
) => {
  try {
    visitId = visitId || getCookie("visitorId");

    const r = await httpClient.post(`/customer-journey/plate`, {
      visitId,
      plateNumber,
      plateState,
    });

    return r.data;
  } catch (err) {
    console.error("Customer journey by plate error:", err);
    return null;
  }
};

export const createCustomerJourneyByVin = async (vin, visitId) => {
  try {
    visitId = visitId || getCookie("visitorId");

    const r = await httpClient.post(`/customer-journey/vin`, {
      visitId,
      vin,
    });

    return r.data;
  } catch (err) {
    console.error("Customer journey by VIN error:", err);
    return null;
  }
};

export const CustomerDetailJourney = async (
  newData,
  customerJourneyId,
  retries = 2
) => {
  try {
    const r = await httpClient.post(
      `/customer-journey/${customerJourneyId}/vehicle-details`,
      newData
    );

    return r.data;
  } catch (err) {
    console.error("Update customer journey details error:", err);
    return retries > 0
      ? CustomerDetailJourney(newData, customerJourneyId, retries - 1)
      : [];
  }
};

export const UpdateCustomerJourney = async (
  newData,
  customerJourneyId,
  retries = 2
) => {
  if (!newData.email) {
    const data = JSON.parse(localStorage.getItem("dataVehicleCondition")) || {};

    // Map Frontend State (from LocalStorage) to Backend DTO
    const mappedBaseData = {
      mileage: parseInt(data.odometer?.toString().replace(/,/g, '') || data.mileage || '0'),
      zipCode: data.zipCode,
      email: data.email,
      // Logic: If Clear Title is Yes, then NOT Financed. If Clear Title is No, then Financed.
      isFinancedOrLeased: data.hasClearTitle === 'No',
      carIsDriveable: data.runsAndDrives === 'Yes',
      hasDamage: data.hasIssues === 'Yes',
      hasBeenInAccident: data.hasAccident === 'Yes',
      optionalPhoneNumber: data.phone || data.optionalPhoneNumber,
      customerHasOptedIntoSmsMessages: data.receiveSMS || false,
      captchaMode: 'true',
      ce: false
    };

    newData = {
      ...mappedBaseData,
      ...newData, // Allow newData to override base data
    };
  }

  try {
    const r = await httpClient.post(
      `/customer-journey/${customerJourneyId}/vehicle-condition`,
      newData
    );
    return r.data;
  } catch (err) {
    console.error("Update customer journey error:", err);
    return retries > 0
      ? UpdateCustomerJourney(newData, customerJourneyId, retries - 1)
      : [];
  }
};

export const GetCustomerJourney = async (customerJourneyId, retries = 2) => {
  try {
    const r = await httpClient.get(`/customer-journey/${customerJourneyId}`);
    return r.data;
  } catch (err) {
    console.error("Get customer journey error:", err);
    return retries > 0
      ? GetCustomerJourney(customerJourneyId, retries - 1)
      : [];
  }
};

export const GetCustomerJourneyByVisit = async (visitId, retries = 2) => {
  try {
    const r = await httpClient.get(`/customer-journey/${visitId}`);
    return r.data;
  } catch (err) {
    console.error("Get customer journey by visit error:", err);
    return retries > 0
      ? GetCustomerJourneyByVisit(visitId, retries - 1)
      : [];
  }
};

/* ----------------------------------------------------------
 * IMAGE PROXY
 * --------------------------------------------------------*/

export const getImageVehicle = async (externalUrl, retries = 2) => {
  try {
    const r = await httpClient.get(
      `/vehicles/image?url=${encodeURIComponent(externalUrl)}`,
      { responseType: "blob" }
    );

    return URL.createObjectURL(r.data);
  } catch (err) {
    console.error("Get vehicle image error:", err);
    return retries > 0
      ? getImageVehicle(externalUrl, retries - 1)
      : null;
  }
};

/* ----------------------------------------------------------
 * LOCAL IMAGE PLACEHOLDERS
 * --------------------------------------------------------*/

export const getVehicleImage = async (make, model, year, retries = 2) => {
  try {
    const basePath = import.meta.env.BASE_URL || "/";

    const map = {
      toyota: `${basePath}vehicles/toyota-camry.jpg`,
      honda: `${basePath}vehicles/honda-civic.jpg`,
      ford: `${basePath}vehicles/ford-f150.jpg`,
      bmw: `${basePath}vehicles/bmw-sedan.jpg`,
      chevrolet: `${basePath}vehicles/chevrolet-suv.jpg`,
      tesla: `${basePath}vehicles/tesla-model3.jpg`,
      nissan: `${basePath}vehicles/nissan-altima.jpg`,
    };

    await new Promise((res) => setTimeout(res, 400));

    return map[make?.toLowerCase()] || `${basePath}vehicles/default-car.jpg`;
  } catch (err) {
    console.error("Get vehicle placeholder error:", err);

    if (retries === 0) {
      const basePath = import.meta.env.BASE_URL || "/";
      return `${basePath}vehicles/default-car.jpg`;
    }

    return getVehicleImage(make, model, year, retries - 1);
  }
};

/* ----------------------------------------------------------
 * DAMAGE / COMPONENTS
 * --------------------------------------------------------*/

export const getComponentList = async () => {
  await new Promise((res) => setTimeout(res, 300));
  return [
    { value: "9", label: "Bumper" },
    { value: "103", label: "Bumper - Metal" },
    { value: "23", label: "Grille" },
    { value: "4", label: "Hood" },
    { value: "28", label: "Lights" },
    { value: "60", label: "Windshield" },
  ];
};

export const getFaultTypeList = async () => {
  await new Promise((res) => setTimeout(res, 300));
  return [
    { value: "17", label: "Dent" },
    { value: "68", label: "Dent - Large" },
    { value: "36", label: "Rust" },
  ];
};

/* ----------------------------------------------------------
 * APPOINTMENTS
 * --------------------------------------------------------*/

export const cancelAppointment = async (
  customerVehicleId,
  phoneNumber,
  retries = 2
) => {
  try {
    const r = await httpClient.delete(
      `/appointment/cancel/${customerVehicleId}/${phoneNumber}`
    );
    return r.data;
  } catch (err) {
    console.error("Cancel appointment error:", err);
    return retries > 0
      ? cancelAppointment(customerVehicleId, phoneNumber, retries - 1)
      : null;
  }
};

/* ----------------------------------------------------------
 * EXPORT SERVICE OBJECT
 * --------------------------------------------------------*/

export const vehicleService = {
  decodeVIN,
  decodeLicensePlate,
  getVehicleMakes,
  getModelsByMake,
  getSeries,
  getVehicleYears,
  getImageVehicle,
  getVehicleImage,
  createVisitorID,
  createCustomerJourney,
  createCustomerJourneyByPlate,
  createCustomerJourneyByVin,
  UpdateCustomerJourney,
  CustomerDetailJourney,
  GetCustomerJourney,
  GetCustomerJourneyByVisit,
  getComponentList,
  getFaultTypeList,
  cancelAppointment,
};
