import http from 'http';
import { dbOperations } from './config/db.js';

console.log("=== Aroma Spices Backend Self-Test ===");

// 1. Test database fallback initialization
try {
  console.log("Attempting database read operation...");
  const menuItems = await dbOperations.getAll('menu');
  console.log(`✓ Database Read Successful! Total items loaded: ${menuItems.length}`);
  
  if (menuItems.length > 0) {
    console.log(`✓ Sample item check: Name: "${menuItems[0].name}" under "${menuItems[0].category}"`);
  } else {
    console.log("✗ Menu seeding failed or empty!");
    process.exit(1);
  }
} catch (err) {
  console.error("✗ Database fallback error:", err.message);
  process.exit(1);
}

// 2. Test server routing
import('./server.js').then(async (serverModule) => {
  // Give the server 1.5 seconds to spin up
  await new Promise(resolve => setTimeout(resolve, 1500));

  const port = serverModule.activePort || 5000;
  console.log(`Testing Server Port Accessibility (GET http://localhost:${port}/)...`);
  http.get(`http://localhost:${port}/`, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        console.log("✓ Server Response:", json);
        if (json.status === 'online') {
          console.log("✓ API Server is online and verified successfully!");
          process.exit(0);
        } else {
          console.log("✗ Server status is not online.");
          process.exit(1);
        }
      } catch (err) {
        console.log("✗ Failed to parse server response:", data);
        process.exit(1);
      }
    });
  }).on('error', (err) => {
    console.error("✗ Server request failed:", err.message);
    process.exit(1);
  });
}).catch(err => {
  console.error("✗ Failed to import server.js:", err.message);
  process.exit(1);
});
