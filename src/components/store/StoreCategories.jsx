import React from "react";

const categories = [
  /*{ icon: null, label: "All Categories" },
  { icon: "fa-home", label: "Architecture" },
  { icon: "fa-tree", label: "Nature" },
  { icon: "fa-car", label: "Vehicles" },
  { icon: "fa-user", label: "Characters" },
  { icon: "fa-utensils", label: "Furniture" },
  { icon: "fa-gem", label: "Premium" }*/
];

const StoreCategories = ({ onCategoryClick }) => (
  <div className="flex flex-wrap gap-3 mb-8">
    {categories.map((cat, i) => (
      <div
        key={cat.label}
        className="px-4 py-1 rounded-full border cursor-pointer transition flex items-center"
        style={{ backgroundColor: 'oklch(0.18 0.05 285)', borderColor: 'oklch(0.25 0.05 285)', color: 'oklch(0.98 0.01 280)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'oklch(0.45 0.15 290)';
          e.currentTarget.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'oklch(0.18 0.05 285)';
          e.currentTarget.style.color = 'oklch(0.98 0.01 280)';
        }}
        onClick={() => onCategoryClick(cat.label)}
      >
        {cat.icon && <i className={`fas ${cat.icon} mr-2`}></i>}
        {cat.label}
      </div>
    ))}
  </div>
);

export default StoreCategories;
