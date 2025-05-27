// app.config.js
import 'dotenv/config';

export default {
  expo: {
    name: "tourism-new",
    slug: "tourism",
    version: "1.0.0",
    extra: {
      MAPBOX_TOKEN: process.env.EXPO_PUBLIC_MAPBOX_TOKEN,
    },
  },
};
