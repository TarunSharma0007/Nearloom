import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { brand } from "@/lib/brand";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: "website" | "article";
  structuredData?: object;
}

const BASE_URL = brand.url;
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

export const SEO = ({
  title = "Nearloom - Where local life comes together",
  description = brand.description,
  image = DEFAULT_IMAGE,
  type = "website",
  structuredData,
}: SEOProps) => {
  const location = useLocation();
  const canonicalUrl = `${BASE_URL}${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Basic meta tags
    updateMetaTag("description", description);
    
    // Open Graph tags
    updateMetaTag("og:title", title, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:url", canonicalUrl, true);
    updateMetaTag("og:type", type, true);
    updateMetaTag("og:image", image, true);
    updateMetaTag("og:site_name", brand.name, true);

    // Twitter tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", image);

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // Structured Data (JSON-LD)
    const existingScript = document.querySelector('script[data-seo="structured-data"]');
    if (existingScript) {
      existingScript.remove();
    }

    if (structuredData) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo", "structured-data");
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Cleanup on unmount
    return () => {
      const script = document.querySelector('script[data-seo="structured-data"]');
      if (script) {
        script.remove();
      }
    };
  }, [title, description, image, type, canonicalUrl, structuredData]);

  return null;
};

