import express from 'express';
import dotenv from 'dotenv';
import httpProxy from 'http-proxy';

dotenv.config();

const PORT = process.env.PORT || 4200;

const parseTargets = (value, fallback) => {
  const list = (value || '').split(',').map((entry) => entry.trim()).filter(Boolean);
  if (list.length === 0) {
    return fallback;
  }
  return list;
};

const customerTargets = parseTargets(process.env.CUSTOMER_BACKENDS, [
  'http://127.0.0.1:4000',
  'http://127.0.0.1:4001'
]);
const partnerTargets = parseTargets(process.env.PARTNER_BACKENDS, [
  'http://127.0.0.1:4100',
  'http://127.0.0.1:4101'
]);

const createBalancer = (targets) => {
  if (targets.length === 0) {
    throw new Error('No upstream targets defined');
  }

  const proxy = httpProxy.createProxyServer({
    changeOrigin: true,
    proxyTimeout: 15_000,
    timeout: 15_000
  });

  proxy.on('error', (err, req, res) => {
    console.error('Proxy error', err.message);
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
    }
    res.end(JSON.stringify({ message: 'Upstream service unavailable.' }));
  });

  let index = 0;
  return (req, res) => {
    const target = targets[index % targets.length];
    index = (index + 1) % targets.length;
    const originalPath = req.originalUrl || req.url;
    req.url = originalPath;
    req.headers['x-forwarded-host'] = req.headers.host;
    req.headers['x-forwarded-proto'] = req.protocol || 'http';
    proxy.web(req, res, { target });
  };
};

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'gateway', customerTargets, partnerTargets });
});

const customerProxy = createBalancer(customerTargets);
const partnerProxy = createBalancer(partnerTargets);

app.use('/api/v1/auth', customerProxy);
app.use('/api/v1/users', customerProxy);
app.use('/api/v1/orders', customerProxy);
app.use('/api/v1/restaurants', partnerProxy);
app.use('/api/v1/payments', partnerProxy);

app.listen(PORT, () => {
  console.log(`Gateway listening on port ${PORT}`);
  console.log(`Customer targets: ${customerTargets.join(', ')}`);
  console.log(`Partner targets: ${partnerTargets.join(', ')}`);
});


``
