
const allowedOrigins = [
  'http://localhost:3033',
  'http://localhost:3034',
  'http://localhost:5500',
  'https://api-beach-resort.srmukul.com',
  'https://admin-beach-resort.vercel.app',
  'https://mukul-beach-resort.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow if origin is in allowedOrigins, or if it's an ngrok URL, or if there's no origin (like local requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.includes('ngrok-free.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS origin'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = corsOptions;
