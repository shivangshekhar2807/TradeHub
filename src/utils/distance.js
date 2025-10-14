const NodeGeocoder = require("node-geocoder");
const geolib = require("geolib");
const userModel = require("../models/users");

// setup geocoder (using OpenStreetMap so no API key needed)
const geocoder = NodeGeocoder({
  provider: "openstreetmap",
});

async function calculateDistance(cityA, cityB) {
  try {
    // fetch coordinates
    const [locA] = await geocoder.geocode(cityA + ", India");
    const [locB] = await geocoder.geocode(cityB + ", India");

    // calculate distance
    const distance = geolib.getDistance(
      { latitude: locA.latitude, longitude: locA.longitude },
      { latitude: locB.latitude, longitude: locB.longitude }
    );

    return (distance / 1000).toFixed(2);

    console.log(
      `Distance between ${cityA} and ${cityB}: ${(distance / 1000).toFixed(
        2
      )} km`
    );
  } catch (err) {
    console.error("Error:", err);
  }
}

// test it
// calculateDistance("Delhi", "Mumbai");

async function productDistance(products, i, city) {
  if (i == products.length) {
    return products;
  }

  const dist = await calculateDistance(products[i].city, city);

  products[i].distance = dist.toString();

  const finalProduct = await productDistance(products, i + 1, city);

  return finalProduct;
}

module.exports = { calculateDistance, productDistance };
