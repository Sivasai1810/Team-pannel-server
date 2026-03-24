require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Found' : 'NOT FOUND');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected successfully!');
  console.log('Database:', mongoose.connection.name);
  console.log('Host:', mongoose.connection.host);
  
  // Test creating a user
  const User = require('./models/User');
  
  const testUser = new User({
    name: 'Test User',
    email: 'test@ai4invest.in',
    password: 'test123',
    role: 'staff'
  });
  
  return testUser.save();
})
.then((user) => {
  console.log('✅ Test user created successfully!');
  console.log('User ID:', user._id);
  console.log('User Email:', user.email);
  
  // Clean up test user
  return user.deleteOne();
})
.then(() => {
  console.log('✅ Test user deleted successfully!');
  console.log('\n🎉 Database connection is working perfectly!');
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Error:', error.message);
  console.error('Full error:', error);
  process.exit(1);
});
