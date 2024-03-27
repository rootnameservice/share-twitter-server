// See https://github.com/chimurai/http-proxy-middleware for more details.
import { createProxyMiddleware } from 'http-proxy-middleware';
import express from 'express';
import cors from 'cors';

import {
  DFLOW_API_KEY,
  FUSION_API_KEY,
  HASHFLOW_TAKER_API_KEY,
  COINGECKO_API_KEY,
  COINMARKETCAP_API_KEY,
} from './utils';

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: 'https://quote-aggregator-app.vercel.app',
    methods: ['GET'],
    maxAge: 600,
  })
);

// Middleware to add Authentication for 1inch fusion requests
// app.use(
//   '/api/fusion',
//   createProxyMiddleware({
//     target: 'https://api.1inch.dev/fusion',
//     changeOrigin: true,
//     pathRewrite: {
//       '^/api/fusion': '', // strip "/api/fusion" from the URL
//     },
//     headers: {
//       Authorization: `Bearer ${FUSION_API_KEY}`, // Add api key.
//     },
//     onProxyRes: (e) => {
//       console.log('Fusion', e.statusCode, e.statusMessage);
//     },
//     onError: (e) => {
//       console.error(e);
//     },
//   })
// );


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
