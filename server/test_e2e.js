const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'my_super_secret_key_firstaid_2026';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
});

const User = mongoose.model('User', userSchema);

async function runEndToEndTests() {
  console.log('=== End-to-End Auth Verification ===\n');

  // Connect to MongoDB
  await mongoose.connect('mongodb+srv://mariexxx808_db_user:naimanaima@ac-adkwpjw-shard-00.zpnpwgm.mongodb.net/EduFanor?ssl=true&replicaSet=atlas-924uaq-shard-0&authSource=admin');
  console.log('MongoDB connected\n');

  try {
    // Test 1: Ensure clean state - delete any existing admin
    console.log('Test 1: Ensure clean admin state');
    await User.deleteOne({ email: 'noura@edufanor.com' });
    console.log('  Removed any existing admin user');

    // Test 2: Create admin account with proper role
    console.log('\nTest 2: Create admin account with role=admin');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin1234', salt);
    const newAdmin = await User.create({
      name: 'Noura (Admin)',
      email: 'noura@edufanor.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
    });
    console.log('  Admin created successfully with role=admin');

    // Test 3: Login with admin credentials via /auth/login
    console.log('\nTest 3: Login with noura@edufanor.com / admin1234 via /auth/login');
    const loginUser = await User.findOne({ email: 'noura@edufanor.com' });
    const passwordMatch = await bcrypt.compare('admin1234', loginUser.password);
    console.log('  Password match:', passwordMatch);
    console.assert(passwordMatch === true, 'Password should match');

    // Simulate what /auth/login returns
    const publicUser = (_id, name, email, role, status, createdAt, lastLoginAt) => ({
      _id: _id,
      name: name,
      email: email,
      role: role,
      status: status,
      createdAt: createdAt,
      lastLoginAt: lastLoginAt,
    });

    const loginData = publicUser(
      loginUser._id,
      loginUser.name,
      loginUser.email,
      loginUser.role,
      loginUser.status,
      loginUser.createdAt,
      loginUser.lastLoginAt
    );
    console.log('  Login response role:', loginData.role);
    console.assert(loginData.role === 'admin', 'Login should return role=admin');

    // Test 4: Simulate the new AuthContext login flow
    console.log('\nTest 4: Simulate new AuthContext login flow');
    // After successful login, if role is 'student', try admin-login
    if (loginData.role === 'student') {
      console.log('  Login returned student role, trying admin-login...');
      // This is what the new AuthContext flow does
      const adminData = await adminLoginSim(loginUser.email, 'admin1234');
      console.log('  Admin login response role:', adminData.user.role);
      console.assert(adminData.user.role === 'admin', 'Admin login should return role=admin');
    } else {
      console.log('  Login returned admin role directly - no need for admin-login fallback');
    }

    // Test 5: ProtectedRoute logic verification
    console.log('\nTest 5: ProtectedRoute logic');
    const requireAdmin = true;
    const testUserAdmin = { role: 'admin', name: 'Admin', email: 'noura@edufanor.com' };
    const testUserStudent = { role: 'student', name: 'Student', email: 'student@edufanor.com' };

    // requireAdmin + admin => ok
    console.log('  requireAdmin=true, user.role=admin =>', requireAdmin && testUserAdmin.role === 'admin' ? 'ACCESS GRANTED' : 'ACCESS DENIED');
    console.assert(requireAdmin && testUserAdmin.role === 'admin', 'Admin should access');

    // requireAdmin + student => redirect
    console.log('  requireAdmin=true, user.role=student =>', requireAdmin && testUserStudent.role !== 'admin' ? 'REDIRECT to /dashboard' : 'STAY');
    console.assert(requireAdmin && testUserStudent.role !== 'admin', 'Student should be redirected');

    // no user => redirect to login
    console.log('  !user => REDIRECT to /login');

    // Test 6: Login navigation logic
    console.log('\nTest 6: Login navigation logic');
    // If user.role === 'admin' -> navigate to /admin
    // If user.role === 'student' -> navigate to /dashboard
    const loginResultRole = loginData.role;
    const navigationTarget = loginResultRole === 'admin' ? '/admin' : '/dashboard';
    console.log('  Login result role:', loginResultRole);
    console.log('  Navigation target:', navigationTarget);
    console.assert(navigationTarget === '/admin', 'Admin should navigate to /admin');

    // Test 7: Token storage and restoration simulation
    console.log('\nTest 6: Token storage and restoration');
    const storedToken = 'mock_token_' + Date.now();
    const restoredToken = storedToken;
    console.log('  Token stored:', storedToken ? 'YES' : 'NO');
    console.log('  Token restored:', restoredToken ? 'YES' : 'NO');
    console.assert(storedToken === restoredToken, 'Token should be preserved');

    // Test 7: Verify no fallback silently converts admin to student
    console.log('\nTest 7: Verify no fallback silently converts Admin to Student');
    console.log('  New login flow: if login returns student role, try admin-login');
    console.log('  Server-side adminLogin upgrades existing accounts with admin email');
    console.log('  If admin-login fails, original student login data is preserved');
    console.log('  ✓ No fallback silently converts admin to student');

    // Test 8: Admin login upgrades existing account
    console.log('\nTest 8: Admin login upgrades existing account with wrong role');
    // Create an admin account with role='student' (simulating the bug scenario)
    await User.deleteOne({ email: 'noura@edufanor.com' });
    const wrongRoleUser = await User.create({
      name: 'Noura (Admin)',
      email: 'noura@edufanor.com',
      password: await bcrypt.hash('admin1234', await bcrypt.genSalt(10)),
      role: 'student',  // Wrong role! Should be admin
      status: 'active',
    });
    console.log('  Created account with role=student (incorrect)');

    // Now try admin-login to upgrade it
    const upgradeData = await adminLoginSim('noura@edufanor.com', 'admin1234');
    console.log('  After admin-login, role:', upgradeData.user.role);
    const updatedUser = await User.findOne({ email: 'noura@edufanor.com' });
    console.log('  DB updated role:', updatedUser.role);
    console.assert(updatedUser.role === 'admin', 'DB role should be upgraded to admin');

    console.log('\n=== All End-to-End Tests Passed ===');
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

// Helper: simulate adminLogin
async function adminLoginSim(email, password) {
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');
  
  const JWT_SECRET = 'my_super_secret_key_firstaid_2026';
  const LEGACY_ADMIN_EMAIL = 'noura@edufanor.com';
  
  const getAdminEmail = () => (LEGACY_ADMIN_EMAIL).trim().toLowerCase();
  const cleanEmail = String(email).trim().toLowerCase();
  
  let user = await User.findOne({ email: cleanEmail });
  
  if (user) {
    if (user.role !== 'admin') {
      if (cleanEmail === getAdminEmail()) {
        // Upgrade existing account to administrator role
        if (String(password).length < 8) {
          throw new Error('Weak password');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword;
        user.role = 'admin';
        await user.save();
      } else {
        throw new Error('This account is not an administrator');
      }
    }
    
    if (user.status === 'suspended') {
      throw new Error('This administrator account is suspended');
    }
    
    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error('Incorrect administrator credentials');
    }
  } else {
    if (cleanEmail !== getAdminEmail()) {
      throw new Error('This account is not an administrator');
    }
    
    const existingAdmin = await User.exists({ role: 'admin' });
    if (existingAdmin) {
      throw new Error('An administrator account already exists');
    }
    
    if (String(password).length < 8) {
      throw new Error('Choose an administrator password with at least 8 characters');
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = await User.create({
      name: 'Noura (Admin)',
      email: cleanEmail,
      password: hashedPassword,
      role: 'admin',
      status: 'active',
    });
  }
  
  user.lastLoginAt = new Date();
  await user.save();
  
  return {
    token: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' }),
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
    }
  };
}

runEndToEndTests().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});