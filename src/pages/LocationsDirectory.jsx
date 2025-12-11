import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO/SEO';
import { helperContent } from '../services/contentService';

const LocationsDirectory = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const data = await helperContent.getLandingPages();
                setLocations(data || []);
            } catch (error) {
                console.error("Failed to load locations", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    // Schema.org CollectionPage Data
    const schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "We Buy Any Car Locations Directory",
        "description": "Find a We Buy Any Car branch near you. We have hundreds of locations across the United States.",
        "url": window.location.href,
        "hasPart": locations.map(page => ({
            "@type": "ListItem",
            "name": page.title || page.slug,
            "url": `${window.location.origin}/sell-my-car/${page.slug}`
        }))
    };

    return (
        <>
            <SEO
                title="We Buy Any Car Locations | Find a Branch Near You"
                description="Browse all We Buy Any Car locations in the USA. Find your nearest branch in New Jersey, Pennsylvania, Florida, Maryland, and more."
                canonical={`${window.location.origin}/locations`}
                schema={schema}
            />

            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
                            Find a Branch Near You
                        </h1>
                        <p className="text-xl text-gray-500 max-w-3xl mx-auto">
                            We have conveniently located branches across the country.
                            Select your location to book an appointment today.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Grouping logic would be nice here, but API returns flat list.
                                For now we list them directly or assume they handle grouping.
                                If flat list of cities/states, we display as cards. */}
                            {locations.length > 0 ? (
                                locations.map((page) => (
                                    <div key={page.slug} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                                        <Link to={`/sell-my-car/location/${page.slug}`} className="block group">
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 mb-2 flex items-center justify-between">
                                                {page.title || page.slug}
                                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
                                            </h3>
                                            <p className="text-gray-500 text-sm">
                                                {page.description || "Sell your car in " + (page.title || page.slug)}
                                            </p>
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center text-gray-500">
                                    No locations found at this time.
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Don't see your city?</h2>
                        <p className="text-gray-600 mb-6">
                            We are constantly expanding! Enter your ZIP code on our homepage to see if we can come to you.
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                        >
                            Check My ZIP Code
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LocationsDirectory;
