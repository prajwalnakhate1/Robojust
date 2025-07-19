// firestore-init/init-firestore.js

const admin = require('firebase-admin');
const serviceAccount = require('./ecommerce-site-2bfbe-firebase-adminsdk-fbsvc-63cb8b406f.json');

// Initialize the Firebase Admin SDK with service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Get Firestore instance
const db = admin.firestore();

console.log('✅ Firestore initialized successfully');

// Example: Create a collection and add a document
async function addSampleData() {
  try {
    const docRef = db.collection('products').doc('sample-product');
    await docRef.set({
      name: 'Sample Product',
      price: 299,
      category: 'electronics',
      inStock: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('✅ Sample product added!');
  } catch (error) {
    console.error('Error adding sample product:', error);
  }
}

addSampleData();
