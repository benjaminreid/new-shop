require("dotenv").config();

module.exports = {
  serverRuntimeConfig: {
    STRIPE_SECRET: process.env.STRIPE_SECRET
  },
  publicRuntimeConfig: {
    STRIPE_PUBLIC: process.env.STRIPE_PUBLIC
  }
};
