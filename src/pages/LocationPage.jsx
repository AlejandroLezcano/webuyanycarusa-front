import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO/SEO';
import { helperContent } from '../services/contentService';

const LocationPage = () => {
    const { slug, state, city } = useParams();
    const [pageContent, setPageContent] = useState(null);
    const [loading, setLoading] = useState(true);

    // Derived Location Name for fallback
    const cityName = city ? city.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Your Area';
    const stateCode = state ? state.toUpperCase() : '';
    const locationName = slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : `${cityName}, ${stateCode}`;

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            try {
                // Determine target slug
                let targetSlug = slug;
                if (!targetSlug && city && state) {
                    targetSlug = `${city}-${state}`; // simple heuristic
                }

                if (targetSlug) {
                    const data = await helperContent.getLandingPageBySlug(targetSlug);
                    if (data) {
                        setPageContent(data);
                    }
                }
            } catch (error) {
                console.error("Failed to load location content", error);
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, [slug, state, city]);

    // Use API content if available, else Fallback to generic template
    const title = pageContent?.title || `Sell My Car ${locationName} | We Buy Any Car®`;
    const description = pageContent?.metaDescription || `Looking to sell your car in ${locationName}? We Buy Any Car offers a quick and easy way to sell your vehicle. Get your free online valuation now!`;
    const canonical = window.location.href;

    // Schema.org
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "AutoDealer",
                "@id": `${window.location.href}#business`,
                "name": `We Buy Any Car ${pageContent?.title || locationName}`,
                "image": "https://www.webuyanycarusa.com/logo.png",
                "description": description,
                "url": window.location.href,
                "telephone": "+1-888-888-8888",
                "priceRange": "$$"
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${window.location.href}#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": window.location.origin
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Locations",
                        "item": `${window.location.origin}/locations`
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": pageContent?.title || locationName,
                        "item": window.location.href
                    }
                ]
            }
        ]
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <>
            <SEO
                title={title}
                description={description}
                canonical={canonical}
                schema={schema}
            />

            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumbs */}
                    <nav className="flex mb-8 text-sm text-gray-500" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                                <Link to="/" className="inline-flex items-center hover:text-primary-600">Home</Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <span className="mx-2">/</span>
                                    <Link to="/locations" className="hover:text-primary-600">Locations</Link>
                                </div>
                            </li>
                            <li aria-current="page">
                                <div className="flex items-center">
                                    <span className="mx-2">/</span>
                                    <span className="text-gray-900 font-medium">{pageContent?.title || locationName}</span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-6">
                            {pageContent?.h1 ? pageContent.h1 : <>Sell Your Car in <span className="text-primary-600">{locationName}</span></>}
                        </h1>
                        <div className="mt-4 max-w-3xl mx-auto text-xl text-gray-500">
                            {/* If API content has a summary/intro, use it. Else generic. */}
                            {pageContent?.introText ? (
                                <div dangerouslySetInnerHTML={{ __html: pageContent.introText }} />
                            ) : (
                                <p>
                                    We make selling your car in {locationName} fast, safe, and fair.
                                    Avoid the hassle of private sales. Get a free valuation in under 30 seconds.
                                </p>
                            )}
                        </div>
                        <div className="mt-8 flex justify-center">
                            <Link
                                to="/"
                                className="inline-flex items-center px-8 py-3.5 border border-transparent text-lg font-medium rounded-full shadow-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all transform hover:scale-105"
                            >
                                Get My Free Valuation
                                <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Local Content / Map Section */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
                        <div className="p-8 md:p-12">
                            {/* Dynamic Body Content from API */}
                            {pageContent?.bodyHtml ? (
                                <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: pageContent.bodyHtml }} />
                            ) : (
                                // Fallback static content
                                <div className="text-center mb-10">
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                        Why Sell to We Buy Any Car in {locationName}?
                                    </h2>
                                    <p className="text-lg text-gray-600 max-w-4xl mx-auto">
                                        We are the expert car buyers in your area. Whether you are in downtown or the suburbs, we have a convenient solution for you.
                                    </p>
                                </div>
                            )}

                            {/* Standard Benefits Grid (always shown unless bodyHtml overrides significantly, but usually nice to keep) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                                <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="bg-primary-100 p-3 rounded-xl">
                                            <MapPin className="w-8 h-8 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">Convenient Branches</h3>
                                            <p className="text-gray-600">
                                                We have multiple branches serving the area. Our customers love our central locations and easy process.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="bg-primary-100 p-3 rounded-xl">
                                            <Clock className="w-8 h-8 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">Same Day Payment</h3>
                                            <p className="text-gray-600">
                                                Our streamlined process is designed to get you in and out in about an hour, with a corporate check in hand.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 flex flex-col justify-center">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">About Our Service</h3>
                                    <p className="text-gray-600 mb-4">
                                        We Buy Any Car removes the stress of selling your vehicle privately. You don't have to worry about advertising costs, meeting strangers, or handling paperwork. We handle everything from the DMV forms to the payoff of your existing loan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Teaser */}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h2>
                        <p className="text-gray-600 mb-6">
                            Learn more about our process and what documents you need.
                        </p>
                        <Link to="/faq" className="text-primary-600 font-semibold hover:text-primary-700 underline">
                            View Frequently Asked Questions
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LocationPage;
