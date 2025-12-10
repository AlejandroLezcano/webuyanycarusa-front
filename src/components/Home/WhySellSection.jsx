// WhySellSection communicates key selling propositions while retaining existing copy and styling.
import { memo } from "react";

const WHY_SELL_POINTS = [
  { title: "Easy", description: "Sell Your Car Fast, Safe, and Fair" },
  { title: "Fast", description: "Get In. Get Out. Get Paid.", hasSM: true },
  { title: "Fair", description: "Get a Fair Market Price for Your Car" },
  { title: "Finance", description: "We Settle Finance and Pay You the Balance" },
  { title: "Trade-In", description: "In Many Cases We Beat Dealer Trade-In Offers" },
];

const WhySellSection = () => (
  <section className="bg-white py-16 md:py-24 border-t border-gray-200 md:border-t-0 hidden md:block">
    <div className="section-container">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-12 text-center">
        Why Sell My Car to <span style={{ color: "#20B24D" }}>we</span>buy
        <span style={{ color: "#20B24D" }}>any</span>car
        <span style={{ color: "#20B24D" }}>.com</span>
        <sup className="text-sm">®</sup>?
      </h2>
      <div className="flex justify-center">
        <ul className="space-y-1" style={{ listStyleType: "disc", paddingLeft: "1.5rem" }}>
          {WHY_SELL_POINTS.map(({ title, description, hasSM }, index) => (
            <li key={title + "-" + index} className="text-gray-900 text-base md:text-lg">
              <span className="font-bold" style={{ display: "inline-block", minWidth: "100px" }}>{title}</span>
              <span className="mx-2">-</span>
              <span className="text-gray-700">
                {description}
                {hasSM && <sup className="font-bold">℠</sup>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default memo(WhySellSection);
