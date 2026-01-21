import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function fixDuplicateKeyError() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test');
    
    const db = mongoose.connection.db;
    
    // Drop the problematic index
    try {
      await db.collection('users').dropIndex('username_1');
      console.log('✅ Successfully dropped username_1 index');
    } catch (err) {
      console.log('⚠️ Index might not exist:', err.message);
    }
    
    // Drop all indexes except _id
    try {
      const indexes = await db.collection('users').getIndexes();
      console.log('Current indexes:', Object.keys(indexes));
      
      for (const indexName of Object.keys(indexes)) {
        if (indexName !== '_id_') {
          await db.collection('users').dropIndex(indexName);
          console.log(`✅ Dropped index: ${indexName}`);
        }
      }
    } catch (err) {
      console.log('Error checking indexes:', err.message);
    }
    
    console.log('✅ Index cleanup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixDuplicateKeyError();
