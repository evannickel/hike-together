// Unit conversion utilities

// Convert miles to kilometers
export const milesToKm = (miles) => {
  return miles * 1.60934;
};

// Convert kilometers to miles
export const kmToMiles = (km) => {
  return km / 1.60934;
};

// Convert feet to meters
export const feetToMeters = (feet) => {
  return feet * 0.3048;
};

// Convert meters to feet
export const metersToFeet = (meters) => {
  return meters / 0.3048;
};

// Format distance based on unit system
export const formatDistance = (miles, unitSystem = 'imperial', decimals = 1) => {
  if (unitSystem === 'metric') {
    const km = milesToKm(miles);
    return `${km.toFixed(decimals)} km`;
  }
  return `${parseFloat(miles).toFixed(decimals)} mi`;
};

// Format elevation based on unit system
export const formatElevation = (feet, unitSystem = 'imperial') => {
  if (unitSystem === 'metric') {
    const meters = feetToMeters(feet);
    return `${Math.round(meters)} m`;
  }
  return `${Math.round(feet)} ft`;
};

// Get distance unit label
export const getDistanceUnit = (unitSystem = 'imperial') => {
  return unitSystem === 'metric' ? 'km' : 'mi';
};

// Get elevation unit label
export const getElevationUnit = (unitSystem = 'imperial') => {
  return unitSystem === 'metric' ? 'm' : 'ft';
};

// Get distance placeholder text for forms
export const getDistancePlaceholder = (unitSystem = 'imperial') => {
  return unitSystem === 'metric' ? 'Distance (km)' : 'Distance (mi)';
};

// Get elevation placeholder text for forms
export const getElevationPlaceholder = (unitSystem = 'imperial') => {
  return unitSystem === 'metric' ? 'Elevation (m)' : 'Elevation (ft)';
};
