// Script to display current login data structure
// This shows what login data looks like when stored

const sampleLoginData = {
  // Current user data structure stored in localStorage
  user: {
    id: "1709923456789", // Generated timestamp
    email: "farmer@example.com",
    name: "farmer", // Derived from email prefix
    role: "farmer", // 'farmer' | 'buyer' | 'transporter' | 'admin'
    phone: "+91 98765 43210", // Mock phone number
    createdAt: new Date().toISOString(),
    avatar: undefined // Optional
  },

  // Other stored data
  acceptedJobs: [], // Array of accepted transport jobs
  settings: {}, // User preferences
  theme: "light" // UI theme preference
};

console.log("Current Login Data Structure:");
console.log(JSON.stringify(sampleLoginData, null, 2));

// Example of what gets stored during login
console.log("\nExample Login Process:");
console.log("1. User enters: email='john@farmer.com', password='***', role='farmer'");
console.log("2. Auth context creates user object");
console.log("3. localStorage.setItem('user', JSON.stringify(user))");
console.log("4. User data persists across browser sessions");