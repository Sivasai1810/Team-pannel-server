require('dotenv').config();
const mongoose = require('mongoose');

console.log('Checking database contents...');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('✅ Connected to MongoDB');
  console.log('Database:', mongoose.connection.name);
  
  const User = require('./models/User');
  const Task = require('./models/Task');
  const DailyLog = require('./models/DailyLog');
  
  const userCount = await User.countDocuments();
  const taskCount = await Task.countDocuments();
  const logCount = await DailyLog.countDocuments();
  
  console.log('\n📊 Database Statistics:');
  console.log('Users:', userCount);
  console.log('Tasks:', taskCount);
  console.log('Daily Logs:', logCount);
  
  if (userCount > 0) {
    console.log('\n👥 Users in database:');
    const users = await User.find().select('-password');
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role}`);
    });
  }
  
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
