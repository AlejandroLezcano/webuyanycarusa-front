import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEO = ({
    title,
    description,
    canonical,
    openGraph,
    schema
}) => {
    const siteTitle = 'We Buy Any Car® | Sell My Car | Free Online Valuation';
    const defaultDescription = 'Sell your car hassle-free at We Buy Any Car. Free online valuation. Instant payment. The fast, safe and fair alternative to trade in or private sale.';
    const siteUrl = 'https://www.webuyanycarusa.com';

    return (
        <Helmet>
            {/* Basic Metadata */}
            <title>{title ? `${title} | We Buy Any Car®` : siteTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="title" content={title ? `${title} | We Buy Any Car®` : siteTitle} />

            {/* Canonical URL */}
            {canonical && <link rel="canonical" href={canonical} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonical || siteUrl} />
            <meta property="og:title" content={title || siteTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            {openGraph?.image && <meta property="og:image" content={openGraph.image} />}

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title || siteTitle} />
            <meta name="twitter:description" content={description || defaultDescription} />
            {openGraph?.image && <meta name="twitter:image" content={openGraph.image} />}

            {/* Structured Data (JSON-LD) */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};

SEO.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    canonical: PropTypes.string,
    openGraph: PropTypes.shape({
        image: PropTypes.string,
    }),
    schema: PropTypes.object,
};

export default SEO;
