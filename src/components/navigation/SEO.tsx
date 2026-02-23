import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title: string;
    description?: string;
    keywords?: string;
    image?: string;
    type?: string;
    canonical?: string;
    schema?: any;
}

const SEO: React.FC<SEOProps> = ({ 
    title, 
    description, 
    keywords, 
    image, 
    type = 'website', 
    canonical,
    schema 
}) => {
    const location = useLocation();
    const siteName = "Talentron";
    const fullTitle = `${title} | ${siteName}`;
    const defaultDescription = "Talentron '26 Entry Form. Submit your entries for the ultimate college cultural fest.";
    const metaDescription = description || defaultDescription;
    const currentUrl = `${window.location.origin}${location.pathname}`;
    const ogImage = image || "/assets/og-image.webp";

    useEffect(() => {
        // Update Title
        document.title = fullTitle;

        // Update Meta Description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', metaDescription);

        // Update Keywords
        if (keywords) {
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
                metaKeywords = document.createElement('meta');
                metaKeywords.setAttribute('name', 'keywords');
                document.head.appendChild(metaKeywords);
            }
            metaKeywords.setAttribute('content', keywords);
        }

        // Update Open Graph Tags
        const ogTags = {
            'og:title': fullTitle,
            'og:description': metaDescription,
            'og:url': currentUrl,
            'og:type': type,
            'og:image': ogImage,
            'og:site_name': siteName
        };

        Object.entries(ogTags).forEach(([property, content]) => {
            let tag = document.querySelector(`meta[property="${property}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute('property', property);
                document.head.appendChild(tag);
            }
            tag.setAttribute('content', content);
        });

        // Canonical Link
        const canonicalUrl = canonical || currentUrl;
        let linkCanonical = document.querySelector('link[rel="canonical"]');
        if (!linkCanonical) {
            linkCanonical = document.createElement('link');
            linkCanonical.setAttribute('rel', 'canonical');
            document.head.appendChild(linkCanonical);
        }
        linkCanonical.setAttribute('href', canonicalUrl);

        // Schema
        if (schema) {
            const scriptId = 'aeo-schema-jsonld';
            let script = document.getElementById(scriptId) as HTMLScriptElement;
            if (!script) {
                script = document.createElement('script');
                script.id = scriptId;
                script.type = 'application/ld+json';
                document.head.appendChild(script);
            }
            script.text = JSON.stringify(schema);
        }

    }, [fullTitle, metaDescription, currentUrl, type, ogImage, keywords, canonical, schema]);

    return null;
};

export default SEO;
