// Footer centralizes marketing links and trust signals while mirroring existing layout for parity with legacy templates.
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "";
  const isConfirmationPage = location.pathname.includes("/confirmation") || location.pathname.includes("/valuation/confirmation");

  // Background color: gray for confirmation page, green for other pages
  const footerBgColor = isConfirmationPage ? "#f5f5f5" : "#20B24D";
  const footerBgColorSecondary = isConfirmationPage ? "#f5f5f5" : "#20B24D"; // For second and third containers
  const footerTextColor = isConfirmationPage ? "#4e4e4e" : "#ffffff";
  const footerLinkColor = isConfirmationPage ? "#4e4e4e" : "#ffffff";
  const footerSeparatorColor = isConfirmationPage ? "#4e4e4e" : "#ffffff";

  return (
    <footer className="mt-2" style={{ color: footerTextColor }}>
      <div className="py-4 hidden md:block" style={{ backgroundColor: footerBgColor }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="hidden md:flex items-center justify-center flex-wrap gap-2">
            <a
              href="https://www.webuyanycarusa.com/our-values"
              className="hover:opacity-80 transition-colors font-semibold text-sm"
              style={{ color: footerLinkColor }}
            >
              Our Values
            </a>
            <span style={{ color: footerSeparatorColor }}>/</span>
            <a
              href="https://webuyanycar.jobs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-colors font-semibold text-sm"
              style={{ color: footerLinkColor }}
            >
              Careers
            </a>
            <span style={{ color: footerSeparatorColor }}>/</span>
            <a
              href="https://www.webuyanycarusa.com/sell-your-car"
              className="hover:opacity-80 transition-colors font-semibold text-sm"
              style={{ color: footerLinkColor }}
            >
              Sell Your Car
            </a>
            <span style={{ color: footerSeparatorColor }}>/</span>
            <a
              href="https://www.webuyanycarusa.com/about"
              className="hover:opacity-80 transition-colors font-semibold text-sm"
              style={{ color: footerLinkColor }}
            >
              About Us
            </a>
            <span style={{ color: footerSeparatorColor }}>/</span>
            <a
              href="https://www.webuyanycarusa.com/reviews"
              className="hover:opacity-80 transition-colors font-semibold text-sm"
              style={{ color: footerLinkColor }}
            >
              Reviews
            </a>
            <span style={{ color: footerSeparatorColor }}>/</span>
            <a
              href="https://www.webuyanycarusa.com/video"
              className="hover:opacity-80 transition-colors font-semibold text-sm"
              style={{ color: footerLinkColor }}
            >
              As Seen on TV
            </a>
            <span style={{ color: footerSeparatorColor }}>/</span>
            <a
              href="https://www.webuyanycarusa.com/privacypolicy"
              className="hover:opacity-80 transition-colors font-semibold text-sm"
              style={{ color: footerLinkColor }}
            >
              Privacy Policy
            </a>
            <span style={{ color: footerSeparatorColor }}>/</span>
            <a
              href="https://www.webuyanycarusa.com/termsofuse"
              className="hover:opacity-80 transition-colors font-semibold text-sm"
              style={{ color: footerLinkColor }}
            >
              Terms of Use
            </a>
            <span style={{ color: footerSeparatorColor }}>/</span>
            <a
              href="https://webuyanycarusa.com/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-colors font-semibold text-sm"
              style={{ color: footerLinkColor }}
            >
              Blog
            </a>
            <span style={{ color: footerSeparatorColor }}>/</span>
            <a
              href="https://www.webuyanycarusa.com/site_map"
              className="hover:opacity-80 transition-colors font-semibold text-sm"
              style={{ color: footerLinkColor }}
            >
              Site Map
            </a>
          </nav>

          <nav className="md:hidden flex flex-col gap-3">
            <a
              href="/our-values"
              className="hover:opacity-80 transition-colors font-semibold text-base py-1"
              style={{ color: footerLinkColor }}
            >
              Our Values
            </a>
            <a
              href="https://webuyanycar.jobs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-colors font-semibold text-base py-1"
              style={{ color: footerLinkColor }}
            >
              Careers
            </a>
            <a
              href="/sell-your-car"
              className="hover:opacity-80 transition-colors font-semibold text-base py-1"
              style={{ color: footerLinkColor }}
            >
              Sell Your Car
            </a>
            <a
              href="/about"
              className="hover:opacity-80 transition-colors font-semibold text-base py-1"
              style={{ color: footerLinkColor }}
            >
              About Us
            </a>
            <a
              href="/reviews"
              className="hover:opacity-80 transition-colors font-semibold text-base py-1"
              style={{ color: footerLinkColor }}
            >
              Reviews
            </a>
            <a
              href="/video"
              className="hover:opacity-80 transition-colors font-semibold text-base py-1"
              style={{ color: footerLinkColor }}
            >
              As Seen on TV
            </a>
            <a
              href="/privacypolicy"
              className="hover:opacity-80 transition-colors font-semibold text-base py-1"
              style={{ color: footerLinkColor }}
            >
              Privacy Policy
            </a>
            <a
              href="/termsofuse"
              className="hover:opacity-80 transition-colors font-semibold text-base py-1"
              style={{ color: footerLinkColor }}
            >
              Terms of Use
            </a>
            <a
              href="https://webuyanycarusa.com/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-colors font-semibold text-base py-1"
              style={{ color: footerLinkColor }}
            >
              Blog
            </a>
            <a
              href="/site_map"
              className="hover:opacity-80 transition-colors font-semibold text-base py-1"
              style={{ color: footerLinkColor }}
            >
              Site Map
            </a>
          </nav>
        </div>
      </div>

      <div className="py-12 hidden md:block" style={{ backgroundColor: footerBgColorSecondary, borderTop: isConfirmationPage ? "1px solid #d0d0d0" : "1px solid #116a2a" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div>
              <h2 className="font-bold mb-4 text-lg" style={{ color: footerTextColor }}>Quick Links</h2>
              <ul className="space-y-2" style={{ color: footerTextColor }}>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/car-valuation"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Used Car Value Calculator
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/cash-for-cars"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Cash for Cars
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/article/view/sell-your-car-for-the-max-price-in-philadelphia-pa"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Get Your Car&apos;s Max Value
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/how-much-is-my-car-worth"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    How Much is My Car Worth?
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/landing/content/5/blue-book-trade-in-prices"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Is Kelly Blue Book Accurate?
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/sell-your-car"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Sell Used Car Online
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/used-car-values"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Online Used Car Values
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/locations"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    We Buy Any Car Near Me
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/video"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    We Buy Any Car TV Commercials
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.trustpilot.com/review/webuyanycarusa.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    We Buy Any Car<sup>®</sup> Reviews
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-bold mb-4 text-lg" style={{ color: footerTextColor }}>
                Popular States
              </h2>
              <ul className="space-y-2" style={{ color: footerTextColor }}>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/sell-car/florida-fl"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Sell My Car in Florida
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/sell-car/georgia-ga"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Sell My Car in Georgia
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/sell-car/illinois-il"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Sell My Car in Illinois
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/sell-car/indiana-in"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Sell My Car in Indiana
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/sell-car/maryland-md"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Sell My Car in Maryland
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/sell-car/new-jersey-nj"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Sell My Car in New Jersey
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/sell-car/north-carolina-nc"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Sell My Car in North Carolina
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/sell-car/ohio-oh"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Sell My Car in Ohio
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/sell-car/pennsylvania-pa"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Sell My Car in Pennsylvania
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/sell-car/virginia-va"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Sell My Car in Virginia
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-bold mb-4 text-lg" style={{ color: footerTextColor }}>
                Popular Cities
              </h2>
              <ul className="space-y-2" style={{ color: footerTextColor }}>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/sell-car/atlanta"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Sell My Car Atlanta, GA
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/sell-car/charlotte"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Sell My Car Charlotte, NC
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/sell-car/columbus"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Sell My Car Columbus, OH
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/sell-car/denver"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Sell My Car Denver, CO
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/sell-car/indianapolis"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Sell My Car Indianapolis, IN
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/sell-car/milwaukee"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Sell My Car Milwaukee, WI
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/sell-car/nashville"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Sell My Car Nashville, TN
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/sell-car/philadelphia"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Sell My Car Philadelphia, PA
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/sell-car/pittsburgh"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Sell My Car Pittsburgh, PA
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.webuyanycarusa.com/sell-car/washington-dc"
                    className="hover:opacity-80 transition-colors"
                    style={{ color: footerLinkColor }}
                  >
                    Sell My Car Washington, DC
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div
        className="py-8"
        style={{ backgroundColor: footerBgColorSecondary, borderTop: isConfirmationPage ? "1px solid #d0d0d0" : "1px solid #116a2a" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Footer Buttons */}
          <div className="box-container md:hidden" id="mobile-footer-buttons-div" style={{ paddingBottom: "40px" }}>
            <a className="black box" href="https://www.webuyanycarusa.com/locations">
              Find Your Nearest Branch
            </a>
            <a className="black box" href="https://www.webuyanycarusa.com/faq">
              FAQ
            </a>
            {isHomePage && (
              <div className="home-only">
                <a className="black box" href="https://www.webuyanycarusa.com/reviews">
                  Reviews
                </a>
                <a className="black box" href="https://www.webuyanycarusa.com/termsofuse">
                  Terms of Use
                </a>
              </div>
            )}
          </div>

          <div
            id="widget-wrapper"
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-6"
          >
            <div className="flex flex-col items-center md:items-end gap-6">
              <div id="social-list">
                <ul className="flex items-center gap-3">
                  <li>
                    <a
                      title="Follow webuyanycarUSA on Facebook"
                      href="http://www.facebook.com/webuyanycarusa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity inline-flex items-center justify-center w-12 h-12 rounded overflow-hidden"
                    >
                      <img
                        src={`${import.meta.env.BASE_URL || "/"}facebook-icon.png`}
                        alt="Facebook"
                        className="w-full h-full object-cover"
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      title="Follow webuyanycarUSA on X"
                      href="http://x.com/webuyanycarusa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity inline-flex items-center justify-center w-12 h-12 rounded overflow-hidden"
                    >
                      <img
                        src={`${import.meta.env.BASE_URL || "/"}x-icon.png`}
                        alt="X"
                        className="w-full h-full object-cover"
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      className="youtube hover:opacity-80 transition-opacity inline-flex items-center justify-center w-12 h-12 rounded overflow-hidden"
                      title="Watch webuyanycarUSA content on YouTube"
                      href="http://www.youtube.com/user/webuyanycarUSA"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`${import.meta.env.BASE_URL || "/"}youtube-icon.png`}
                        alt="YouTube"
                        className="w-full h-full object-cover"
                      />
                    </a>
                  </li>
                  <li>
                    <a
                      className="instagram hover:opacity-80 transition-opacity inline-flex items-center justify-center w-12 h-12 rounded overflow-hidden"
                      title="Follow Us on Instagram"
                      href="https://instagram.com/webuyanycarUSA/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`${import.meta.env.BASE_URL || "/"}instagram-icon.png`}
                        alt="Instagram"
                        className="w-full h-full object-cover"
                      />
                    </a>
                  </li>
                </ul>
              </div>

              <div id="bbb-badge">
                <a
                  title="webuyanycar.com BBB Business Review"
                  href="http://www.bbb.org/washington-dc-eastern-pa/business-reviews/auto-dealers-used-cars/webuyanycar-com-in-media-pa-235989197/#bbbonlineclick"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity inline-block"
                >
                  <img
                    src={`${import.meta.env.BASE_URL || "/"}Content/Images/bbb.png`}
                    alt="Accredited Business"
                    className="w-full h-full object-contain"
                  />
                </a>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-start gap-4">
              <div
                id="flag-wrapper"
                style={{
                  background: "#ffffff",
                  borderRadius: "8px",
                  padding: "5px",
                }}
              >
                <div id="flags" className="flex items-center gap-2">
                  <div className="first">
                    <a href="/" title="Sell My Car USA">
                      <img
                        src={`https://www.webuyanycarusa.com/Content/Images/Icons/usflag.svg`}
                        className="flag-icon w-8 h-6 object-contain"
                        alt="Flag of the United States"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjE2IiBmaWxsPSIjQkYwRDM3Ii8+CjxwYXRoIGQ9Ik0wIDBoMjR2MmgtMjR6IiBmaWxsPSIjMDAwMDAwIi8+CjxwYXRoIGQ9Ik0wIDRoMjR2MmgtMjR6IiBmaWxsPSIjMDAwMDAwIi8+Cjwvc3ZnPgo=";
                        }}
                      />
                    </a>
                  </div>
                  <div className="last">
                    <a
                      href="https://www.webuyanycar.com?utm_source=us_site&utm_medium=homepage_flag&utm_campaign=us"
                      title="Sell My Car"
                      className="uk-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`https://www.webuyanycarusa.com/Content/Images/Icons/ukflag.svg`}
                        className="flag-icon w-8 h-6 object-contain"
                        alt="Flag of the United Kingdom"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjE2IiBmaWxsPSIjMDAyNDdEIi8+CjxwYXRoIGQ9Ik0wIDBoMjR2MTZIMHoiIHN0cm9rZT0iI0NDMDAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPgo=";
                        }}
                      />
                    </a>
                  </div>
                </div>
              </div>

              <div
                id="wbac-slogan"
                className="text-lg md:text-xl font-bold"
                style={{ color: footerTextColor }}
              >
                WE BUY ANY CAR<sup className="text-xs">®</sup>
              </div>

              <div id="logo-footer">
                <a
                  id="top-logo-footer"
                  href="/"
                  title="We Buy Any Car"
                  className="block bg-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <img
                    src={`${import.meta.env.BASE_URL || "/"}logo-footer.jpg`}
                    alt="We Buy Any Car Logo"
                    className="h-10 md:h-14 w-auto object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </a>
              </div>
            </div>
          </div>

          <p className="text-center text-sm mt-8" style={{ color: footerTextColor }}>
            © CarGroup Holdings, LLC
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
