import httpClient from './utils/httpClient';

/**
 * Service for retrieving dynamic content from the backend.
 */
export const helperContent = {
    /**
     * Get all available landing pages.
     * @returns {Promise<Array>} List of landing pages
     */
    getLandingPages: async () => {
        try {
            const response = await httpClient.get('/content/landing-page');
            return response.data;
        } catch (error) {
            console.error('Error fetching landing pages:', error);
            return [];
        }
    },

    /**
     * Get a specific landing page by slug.
     * @param {string} slug - The URL slug for the landing page
     * @returns {Promise<Object>} Landing page details
     */
    getLandingPageBySlug: async (slug) => {
        try {
            const response = await httpClient.get(`/content/landing-page/${slug}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching landing page for slug ${slug}:`, error);
            return null;
        }
    },

    /**
     * Get all FAQs.
     * @returns {Promise<Array>} List of FAQs
     */
    getFaqs: async () => {
        try {
            const response = await httpClient.get('/content/faqs');
            return response.data;
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            return [];
        }
    },

    /**
     * Get FAQs by category slug.
     * @param {string} slug - Category slug
     * @returns {Promise<Object>} FAQ category details
     */
    getFaqsBySlug: async (slug) => {
        try {
            const response = await httpClient.get(`/content/faqs/${slug}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching FAQs for slug ${slug}:`, error);
            return null;
        }
    }
};
