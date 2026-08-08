import { describe, expect, it } from "vitest";
import { buildCustomerAuthorizationUrl } from "./_core/shopifyCustomerAccount";

describe("Shopify Customer Account OAuth", () => {
  it("erzeugt eine PKCE-geschützte Kundenkonto-Anmeldung mit den erforderlichen Scopes", () => {
    const url = new URL(buildCustomerAuthorizationUrl({
      authorizationEndpoint: "https://account.herbsom.de/authentication/oauth/authorize",
      clientId: "client-id",
      redirectUri: "https://herbsomshop-az5ntglf.manus.space/api/shopify/customer-account/callback",
      state: "csrf-state",
      codeChallenge: "pkce-challenge",
    }));

    expect(url.origin).toBe("https://account.herbsom.de");
    expect(url.pathname).toBe("/authentication/oauth/authorize");
    expect(url.searchParams.get("client_id")).toBe("client-id");
    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("redirect_uri")).toBe("https://herbsomshop-az5ntglf.manus.space/api/shopify/customer-account/callback");
    expect(url.searchParams.get("scope")).toBe("openid email customer-account-api:full");
    expect(url.searchParams.get("state")).toBe("csrf-state");
    expect(url.searchParams.get("code_challenge")).toBe("pkce-challenge");
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
  });
});
