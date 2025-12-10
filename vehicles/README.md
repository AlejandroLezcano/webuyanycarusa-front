# Test Vehicle Images

This directory contains test images to validate vehicle display in the application.

## Available Images

- **toyota-camry.jpg** - Toyota Camry
- **honda-civic.jpg** - Honda Civic
- **ford-f150.jpg** - Ford F-150
- **bmw-sedan.jpg** - BMW Sedan
- **chevrolet-suv.jpg** - Chevrolet SUV
- **tesla-model3.jpg** - Tesla Model 3
- **nissan-altima.jpg** - Nissan Altima
- **default-car.jpg** - Default image

## Usage

Images are automatically assigned based on the vehicle make in the `api.js` service:

```javascript
const vehicleImageMap = {
  'toyota': '/vehicles/toyota-camry.jpg',
  'honda': '/vehicles/honda-civic.jpg',
  'ford': '/vehicles/ford-f150.jpg',
  'bmw': '/vehicles/bmw-sedan.jpg',
  'chevrolet': '/vehicles/chevrolet-suv.jpg',
  'tesla': '/vehicles/tesla-model3.jpg',
  'nissan': '/vehicles/nissan-altima.jpg',
}
```

If the make doesn't match any in the map, the default image is used.

## Note

In production, these images would be replaced by a real API service that provides vehicle images based on VIN, make, model, and year.
