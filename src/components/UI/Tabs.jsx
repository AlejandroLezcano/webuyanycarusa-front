import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const Tabs = ({
  tabs,
  defaultTab = 0,
  className,
  activeTab: controlledActiveTab,
  onTabChange,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab);

  // Use controlled value if provided, otherwise use internal state
  const activeTab =
    controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  const setActiveTab = (index) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(index);
    }
    if (onTabChange) {
      onTabChange(index);
    }
  };

  // Sync when controlledActiveTab changes
  useEffect(() => {
    if (controlledActiveTab !== undefined) {
      setInternalActiveTab(controlledActiveTab);
    }
  }, [controlledActiveTab]);

  return (
    <div className={clsx("w-full", className)}>
      {/* Tab Navigation: Smaller white container, centered */}
      <div className="flex justify-center mb-6 md:mb-8">
        <div className="flex gap-1 sm:gap-2 md:gap-3 p-1 rounded-full bg-white border border-gray-300 w-full max-w-2xl">
          {tabs.map((tab, index) =>
            activeTab === index ? (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(index)}
                className="relative px-1 sm:px-4 md:px-8 py-3 md:py-4 rounded-full font-bold text-[15px] md:text-lg transition-all duration-500 flex-1 md:flex-auto sm:flex-shrink-0 flex items-center justify-center gap-1 sm:gap-2 text-white min-w-0 md:min-w-min bg-[#20B24D]"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                id={`${tab.id}-tab-active-button`}
              >
                {tab.icon && <tab.icon className="hidden md:block w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 flex-shrink-0" />}
                <span className="truncate sm:whitespace-nowrap">{tab.label}</span>
              </motion.button>
            ) : (
              <button
                key={tab.id}
                onClick={() => setActiveTab(index)}
                className="flex items-center justify-center gap-1 sm:gap-2 px-1 sm:px-4 md:px-8 py-3 md:py-4 rounded-full font-bold text-[15px] md:text-lg transition-colors duration-300 flex-1 md:flex-auto sm:flex-shrink-0 text-[#20B24D] hover:text-[#1a9a3e] min-w-0 md:min-w-min"
                id={`${tab.id}-tab-inactive-button`}
              >
                {tab.icon && <tab.icon className="hidden md:block w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 flex-shrink-0" />}
                <span className="truncate sm:whitespace-nowrap">{tab.label}</span>
              </button>
            ),
          )}
        </div>
      </div>

      {/* Tab Content: Enhanced animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {tabs[activeTab]?.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Tabs;
