import fetch from 'node-fetch';

const services = [
  { name: 'Gateway', url: 'http://localhost:4200/health' },
  { name: 'Customer Backend', url: 'http://localhost:4000/health' },
  // Partner backend doesn't have a specific health endpoint in its routes check, but we can try root or a known route?
  // Looking at file list, strict health route wasn't obvious, but gateway assumes it handles /api/v1/payments etc.
  // Actually gateway targets http://localhost:4100.
  // Let's assume there might be a health check or we just check connectivity.
];

async function checkService(service) {
  try {
    const response = await fetch(service.url);
    if (response.ok) {
        console.log(`✅ ${service.name} is UP (${response.status})`);
        // Try to parse JSON if possible
        try {
            const data = await response.json();
            console.log(`   - Data:`, data);
        } catch (e) {}
    } else {
        console.log(`⚠️ ${service.name} returned status ${service.status}`);
    }
  } catch (error) {
    console.log(`❌ ${service.name} is DOWN: ${error.message}`);
  }
}

async function verify() {
  console.log('Verifying services...');
  
  // Check Gateway
  await checkService({ name: 'Gateway', url: 'http://localhost:4200/health' });
  
  // Check Customer Backend directly
  await checkService({ name: 'Customer Backend', url: 'http://localhost:4000/health' });

  // Check Partner Backend directly (assuming /health or just 404 is response means it's listening)
  // Let's try to hit a 404 on it just to see if it responds
  try {
      const resp = await fetch('http://localhost:4100/');
      console.log(`✅ Partner Backend is responding (Status: ${resp.status})`);
  } catch (e) {
      console.log(`❌ Partner Backend is likely DOWN: ${e.message}`);
  }
}

verify();
