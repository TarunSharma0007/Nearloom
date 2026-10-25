import { brand } from "@/lib/brand";

const BASE_URL = typeof window !== "undefined" ? window.location.origin : "https://nearloom.app";

export const getWebsiteStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: brand.name,
  description: brand.description,
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/browse?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

export const getOrganizationStructuredData = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: brand.name,
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    email: brand.email,
    contactType: "customer service",
  },
});

export const getCommunityStructuredData = (community: {
  name: string;
  description: string;
  memberCount?: number;
  slug: string;
  location?: { city?: string; state?: string };
}) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/community/${community.slug}`,
  name: community.name,
  description: community.description,
  url: `${BASE_URL}/community/${community.slug}`,
  ...(community.memberCount && {
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: community.memberCount,
    },
  }),
  ...(community.location && {
    address: {
      "@type": "PostalAddress",
      addressLocality: community.location.city,
      addressRegion: community.location.state,
    },
  }),
});

export const getBreadcrumbStructuredData = (
  items: Array<{ name: string; url: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${BASE_URL}${item.url}`,
  })),
});
