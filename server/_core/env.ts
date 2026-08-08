export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  shopifyStoreDomain: process.env.SHOPIFY_STORE_DOMAIN ?? "",
  shopifyStorefrontAccessToken: process.env.SHOPIFY_STOREFRONT_API_ACCESS_TOKEN ?? "",
  shopifyCustomerAccountClientId: process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID ?? "",
  shopifyCustomerAccountClientSecret: process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET ?? "",
  shopifyCustomerAccountAuthorizationEndpoint:
    process.env.SHOPIFY_CUSTOMER_ACCOUNT_AUTHORIZATION_ENDPOINT ?? "",
  shopifyCustomerAccountTokenEndpoint:
    process.env.SHOPIFY_CUSTOMER_ACCOUNT_TOKEN_ENDPOINT ?? "",
  shopifyCustomerAccountLogoutEndpoint:
    process.env.SHOPIFY_CUSTOMER_ACCOUNT_LOGOUT_ENDPOINT ?? "",
  shopifyCustomerAccountCallbackUrl:
    process.env.SHOPIFY_CUSTOMER_ACCOUNT_CALLBACK_URL ?? "",
};
