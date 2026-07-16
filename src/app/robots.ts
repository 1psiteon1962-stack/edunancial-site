import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api",
          "/dashboard",
          "/member",
          "/account",
          "/profile",
          "/settings",
          "/payment/success",
          "/payment/cancel",
          "/verify-email",
          "/forgot-password",
        ],
      },
    ],
    sitemap: "https://www.edunancial.com/sitemap.xml",
    host: "https://www.edunancial.com",
  };
}
