import { useEffect } from 'react';

export default function SEO({ 
  title, 
  description, 
  keywords, 
  ogImage = 'https://bhumivera.com/assets/images/logo.webp', 
  route 
}) {
  useEffect(() => {
    // 1. Dynamic Title Injection
    const fullTitle = title ? `${title} | Bhumivera` : 'Bhumivera | Luxury 100% Natural Skincare';
    document.title = fullTitle;
    
    // Helper function to dynamically upsert meta tags
    const setMeta = (name, content) => {
      let element = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Dynamic Description & Open Graph
    if (description) {
      setMeta('description', description);
      setMeta('og:description', description);
      setMeta('twitter:description', description);
    }
    
    // 3. Dynamic Keywords for specific engines
    if (keywords) {
      setMeta('keywords', keywords);
    }

    // 4. Dynamic Image for Social Shares & iMessage
    setMeta('og:image', ogImage);
    setMeta('twitter:image', ogImage);
    setMeta('og:title', fullTitle);
    setMeta('twitter:title', fullTitle);
    
    // 5. Canonical Deep Link Resolution (Prevents Duplicate Content Penalty)
    if (route) {
      let link = document.querySelector(`link[rel="canonical"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', `https://bhumivera.com${route}`);
    }
  }, [title, description, keywords, ogImage, route]);

  return null;
}
