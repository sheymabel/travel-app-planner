// prepareData.js
const tunisiaData = require('../cities.json'); // Votre fichier original

function transformData() {
  const output = [];
  const tunisia = tunisiaData.FR.Tunisie; // Adaptez selon votre structure

  tunisia.governorates.forEach(gov => {
    gov.delegations.forEach(del => {
      del.cites.forEach(city => {
        output.push({
          name: city,
          name_lower: city.toLowerCase(),
          governorate: gov.nom,
          governorate_code: gov.code,
          delegation: del.nom,
          country: "Tunisia",
          country_code: "TN",
          coordinates: {
            latitude: parseFloat(gov.latitude),
            longitude: parseFloat(gov.longitude)
          }
        });
      });
    });
  });

  return output;
}

const firestoreData = transformData();
console.log(`Total cities: ${firestoreData.length}`);
require('fs').writeFileSync('firestoreData.json', JSON.stringify(firestoreData));