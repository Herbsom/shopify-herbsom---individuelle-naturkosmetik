import { describe, expect, it } from "vitest";

describe("Shopify Customer Account Callback", () => {
  it("akzeptiert die konfigurierte Callback-URL beim Start der Shopify-Autorisierung", async () => {
    const callbackUrl = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CALLBACK_URL;
    const clientId = process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID;
    expect(callbackUrl).toBe("https://herbsomshop-az5ntglf.manus.space/api/shopify/customer-account/callback");
    expect(clientId).toBeTruthy();
    const response = await fetch("http://127.0.0.1:3000/api/shopify/customer-account/login", {
      redirect: "manual",
      headers: {
        "x-forwarded-proto": "https",
        "x-forwarded-host": "herbsomshop-az5ntglf.manus.space",
      },
    });

    expect(response.status).toBe(302);
    const authorizationUrl = new URL(response.headers.get("location")!);
    expect(authorizationUrl.searchParams.get("client_id")).toBe(clientId);
    expect(authorizationUrl.searchParams.get("redirect_uri")).toBe(callbackUrl);
  });
});
