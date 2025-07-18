const mongoose = require('mongoose');
require('dotenv').config();

console.log('Starting script to drop all collections');
console.log('DATABASE_URI:', process.env.DATABASE_URI ? 'Connection string is set' : 'Connection string is NOT set');

async function dropAllCollections() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    console.log('Using connection string:', process.env.DATABASE_URI);
    
    await mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB Atlas');

    // Get all collections
    console.log('Fetching collections...');
    const collections = await mongoose.connection.db.collections();
    
    if (collections.length === 0) {
      console.log('No collections found in the database.');
      return;
    }

    console.log(`Found ${collections.length} collections:`);
    collections.forEach(collection => {
      console.log(`- ${collection.collectionName}`);
    });
    
    console.log('Dropping all collections...');
    
    // Drop each collection
    for (const collection of collections) {
      const collectionName = collection.collectionName;
      try {
        console.log(`Attempting to drop collection: ${collectionName}`);
        await collection.drop();
        console.log(`Successfully dropped collection: ${collectionName}`);
      } catch (error) {
        console.error(`Error dropping collection ${collectionName}:`, error.message);
      }
    }

    console.log('All collections have been processed.');
  } catch (error) {
    console.error('Error:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    try {
      // Close the connection
      console.log('Closing MongoDB connection...');
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    }
  }
}

// Run the function
console.log('Executing dropAllCollections function...');
dropAllCollections().then(() => {
  console.log('Script execution completed');
  process.exit(0);
}).catch(error => {
  console.error('Unhandled error in script execution:', error);
  process.exit(1);
});
