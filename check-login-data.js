// Browser console script to check current login data
// Copy and paste this into browser console when app is running

console.log('=== CURRENT LOGIN DATA ===');

// Check user data
const userData = localStorage.getItem('user');
if (userData) {
  console.log('✅ User is logged in:');
  console.log(JSON.parse(userData));
} else {
  console.log('❌ No user logged in');
}

// Check other stored data
const acceptedJobs = localStorage.getItem('acceptedJobs');
if (acceptedJobs) {
  console.log('📦 Accepted Jobs:', JSON.parse(acceptedJobs));
}

const settings = localStorage.getItem('settings');
if (settings) {
  console.log('⚙️ Settings:', JSON.parse(settings));
}

const theme = localStorage.getItem('theme');
if (theme) {
  console.log('🎨 Theme:', theme);
}

// Show all localStorage keys
console.log('📋 All localStorage keys:', Object.keys(localStorage));

// Helper function to clear all data
window.clearAllData = () => {
  localStorage.clear();
  console.log('🗑️ All localStorage data cleared');
  location.reload();
};

console.log('💡 To clear all data, run: clearAllData()');