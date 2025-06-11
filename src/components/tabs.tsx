import { useState } from "react";

interface TabProps {
  title: string;
  children: React.ReactNode;
}

interface TabsProps {
  children: React.ReactElement<TabProps>[];
}

export const Tabs = ({ children }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      <div className="flex border-b border-gray-700">
        {children.map((child, index) => (
          <button
            key={index}
            className={`px-4 py-2 font-medium ${
              activeTab === index
                ? "text-white border-b-2 border-lime-500"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {child.props.title}
          </button>
        ))}
      </div>
      <div className="py-4">{children[activeTab]}</div>
    </div>
  );
};

export const Tab = ({ children }: TabProps) => {
  return <div>{children}</div>;
};