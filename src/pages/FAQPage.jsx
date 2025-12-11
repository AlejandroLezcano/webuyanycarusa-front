import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Phone } from 'lucide-react';
import SEO from '../components/SEO/SEO';
import { helperContent } from '../services/contentService'; // Ensure this path is correct

const FAQPage = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openIndex, setOpenIndex] = useState(null);

    useEffect(() => {
        const loadFaqs = async () => {
            setLoading(true);
            try {
                const data = await helperContent.getFaqs();
                // Map the API response if necessary, or use directly if it matches desired structure
                // Assuming API returns an array of objects like { question, answer } or similar
                setFaqs(data || []);
            } catch (error) {
                console.error("Failed to load FAQs", error);
            } finally {
                setLoading(false);
            }
        };

        loadFaqs();
    }, []);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Schema.org FAQPage Data
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    return (
        <>
            <SEO
                title="Frequently Asked Questions | We Buy Any Car®"
                description="Find answers to common questions about selling your car, required documents, and our valuation process."
                canonical={`${window.location.origin}/faq`}
                schema={schema}
            />

            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-xl text-gray-500">
                            Everything you need to know about selling your car to us.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {faqs.length > 0 ? (
                                faqs.map((faq, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                                    >
                                        <button
                                            onClick={() => toggleAccordion(index)}
                                            className="w-full px-6 py-4 text-left flex justify-between items-center bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-150"
                                            aria-expanded={openIndex === index}
                                        >
                                            <span className="font-semibold text-gray-900 text-lg pr-4">
                                                {faq.question}
                                            </span>
                                            {openIndex === index ? (
                                                <ChevronUp className="w-5 h-5 text-primary-600 flex-shrink-0" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                            )}
                                        </button>

                                        {openIndex === index && (
                                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                                                <div
                                                    className="prose prose-primary max-w-none text-gray-600"
                                                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500">
                                    No FAQs currently available.
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-12 text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Still have questions?</h3>
                        <p className="text-gray-500 mb-6">
                            Can't find the answer you're looking for? Please reach out to our friendly support team.
                        </p>
                        <a
                            href="tel:+18888888888"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            <Phone className="w-5 h-5 mr-2" />
                            Call Us Now
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FAQPage;
