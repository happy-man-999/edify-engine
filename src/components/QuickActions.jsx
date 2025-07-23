import React from "react";

const actions = [
  {
    icon: "fa-magic",
    title: "Start from Template",
    desc: "Choose from our collection of professionally designed templates to get started quickly.",
    color: "#42677D"
  },
  {
    icon: "fa-file-import",
    title: "Import Assets",
    desc: "Bring your own 3D models, textures, and media to create a truly unique experience.",
    color: "#5E8EA9"
  },
  {
    icon: "fa-graduation-cap",
    title: "Learn Basics",
    desc: "New to world building? Check out our tutorials and documentation to get started.",
    color: "#42677D"
  }
];

const QuickActions = () => (
  <section className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
    {actions.map((a, i) => (
      <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#42677D] transition cursor-pointer shadow-sm hover:shadow-md">
        <div className="flex items-center mb-4">
          <div className={`w-12 h-12`} style={{background:`${a.color}1A`, borderRadius:'0.5rem', display:'flex', alignItems:'center', justifyContent:'center', marginRight:'1rem'}}>
            <i className={`fas ${a.icon}`} style={{color:a.color}}></i>
          </div>
          <h3 className="text-xl font-semibold">{a.title}</h3>
        </div>
        <p className="text-gray-600">{a.desc}</p>
      </div>
    ))}
  </section>
);

export default QuickActions;
