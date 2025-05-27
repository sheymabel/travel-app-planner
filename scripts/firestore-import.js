// scripts/firestore-import.js
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // Chemin vers votre fichier de clé de service
const tunisiaData = require('../cities.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function importTunisianCities() {
  try {
    const countries = Object.values(tunisiaData);
    const tunisia = countries.find(c => c.Tunisie);
    const governorates = tunisia.Tunisie.governorates;

    const batch = db.batch();
    let count = 0;

    for (const gov of governorates) {
      for (const del of gov.delegations) {
        for (const cityName of del.cites) {
          const cityRef = db.collection('tunisian_cities').doc();
          
          batch.set(cityRef, {
            name: cityName,
            name_lower: cityName.toLowerCase(),
            governorate: gov.nom,
            governorateCode: gov.code,
            delegation: del.nom,
            country: "Tunisia",
            countryCode: "TN",
            location: new admin.firestore.GeoPoint(
              parseFloat(gov.latitude),
              parseFloat(gov.longitude)
            ),
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });

          count++;
          
          // Firestore limite les batches à 500 opérations
          if (count % 500 === 0) {
            await batch.commit();
            batch = db.batch();
            console.log(`Imported ${count} cities...`);
          }
        }
      }
    }

    // Commit le reste des documents
    await batch.commit();
    console.log(`Import terminé! ${count} villes importées.`);
    
  } catch (error) {
    console.error("Erreur d'importation:", error);
  }
}

importTunisianCities();