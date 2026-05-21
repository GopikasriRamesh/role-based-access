const bcrypt = require('bcryptjs');
const sequelize = require('./config/db');
const User = require('./models/User');

const seedDatabase = async () => {
  try {
    console.log('🔄 Connecting to MySQL and verifying table schemas...');
    await sequelize.sync(); 

    const userCount = await User.count();
    if (userCount > 0) {
      console.log('⚠️ Database already seeded with accounts. Skipping process.');
      process.exit(0);
    }

    console.log('🔐 Hashing default master password passwords...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    console.log('📥 Injecting multi-role corporate accounts into MySQL...');
    await User.bulkCreate([
      { 
        name: 'User', 
        email: 'user@company.com', 
        password: hashedPassword, 
        role: 'User' 
      },
      { 
        name: 'Manager', 
        email: 'manager@company.com', 
        password: hashedPassword, 
        role: 'Manager' 
      },
      { 
        name: 'Admin', 
        email: 'admin@company.com', 
        password: hashedPassword, 
        role: 'Admin' 
      }
    ]);

    console.log('✅ Success: Database seeded seamlessly with User, Manager, and Admin profiles!');
    process.exit(0); 
  } catch (error) {
    console.error('❌ Error: Seeding operation failed configuration parameters:', error.message);
    process.exit(1); 
  }
};

seedDatabase();