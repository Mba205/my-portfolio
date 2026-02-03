import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  ogImage?: string;
  ogUrl?: string;
}

export function SEO({
  title = 'Mba Nonna - Cybersecurity Professional | Security Analyst | Cloud Security | GRC',
  description = 'Cybersecurity professional specializing in security analysis, cloud security, and GRC/audit. Experienced in threat detection, SIEM platforms, vulnerability assessments, AWS/Azure security, and compliance frameworks (NIST, ISO 27001, SOC 2).',
  keywords = 'cybersecurity, security analyst, cloud security, GRC, IT audit, penetration testing, SIEM, threat detection, vulnerability assessment, AWS security, Azure security, ISO 27001, compliance, Mba Nonna',
  author = 'Mba Nonna',
  ogImage = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop',
  ogUrl = 'https://yourportfolio.com', // Update this when you deploy
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to set or update meta tags
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic SEO tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    setMetaTag('author', author);
    setMetaTag('robots', 'index, follow');
    setMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    setMetaTag('language', 'English');
    setMetaTag('revisit-after', '7 days');

    // Open Graph (Facebook, LinkedIn) tags
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:type', 'website', true);
    setMetaTag('og:url', ogUrl, true);
    setMetaTag('og:image', ogImage, true);
    setMetaTag('og:site_name', 'Mba Nonna Portfolio', true);
    setMetaTag('og:locale', 'en_US', true);

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', ogImage);
    setMetaTag('twitter:creator', '@mbanonna'); // Update with your Twitter handle if you have one

    // Additional SEO tags
    setMetaTag('theme-color', '#06b6d4'); // Cyan color from your theme
    setMetaTag('apple-mobile-web-app-capable', 'yes');
    setMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');
    
    // Canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = ogUrl;

  }, [title, description, keywords, author, ogImage, ogUrl]);

  return null; // This component doesn't render anything
}
