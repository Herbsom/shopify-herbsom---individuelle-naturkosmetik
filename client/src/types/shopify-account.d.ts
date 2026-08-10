import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "shopify-store": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        "store-domain"?: string;
        "public-access-token"?: string;
        "customer-access-token"?: string;
      };
      "shopify-account": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        menu?: string;
        "sign-in-url"?: string;
      };
    }
  }
}
