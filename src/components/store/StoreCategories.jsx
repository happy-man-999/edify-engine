import React from "react";

const categories = [
  { icon: null, label: "All Categories" },
  { icon: "fa-home", label: "Architecture" },
  { icon: "fa-tree", label: "Nature" },
  { icon: "fa-car", label: "Vehicles" },
  { icon: "fa-user", label: "Characters" },
  { icon: "fa-utensils", label: "Furniture" },
  { icon: "fa-gem", label: "Premium" }
];

const StoreCategories = ({ onCategoryClick }) => (
  <div className="flex flex-wrap gap-3 mb-8">
    {categories.map((cat, i) => (
      <div
        key={cat.label}
        className="bg-white px-4 py-1 rounded-full border border-gray-300 cursor-pointer hover:bg-[#42677D] hover:text-white transition flex items-center"
        onClick={() => onCategoryClick(cat.label)}
      >
        {cat.icon && <i className={`fas ${cat.icon} mr-2`}></i>}
        {cat.label}
      </div>
    ))}
  </div>
);

export default StoreCategories;
