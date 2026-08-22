import React, { useState, useRef, useEffect } from "react";

export default function LayoutScanner() {
  const [barcode, setBarcode] = useState("");
  const [lang, setLang] = useState("Eng");
  const inputRef = useRef(null);

  // Keep focus on the hidden input for the physical scanner
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScanSubmit = (e) => {
    e.preventDefault();
    if (!barcode) return;
    
    // API logic goes here
    console.log("Scanned Barcode:", barcode);
    
    // Clear and refocus
    setBarcode("");
    inputRef.current?.focus();
  };

  const menuItems = [
    { id: 1, title: "Receive Fabric", icon: <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /> },
    { id: 2, title: "Putaway to Rack", icon: <path d="M4 6h16M4 10h16M4 14h16M4 18h16" /> },
    { id: 3, title: "Issue to Cutting", icon: <path d="M14.121 14.121L19 19m-4.879-4.879l-4.242-4.242m0 0L4.93 4.93m4.949 4.949L4.93 14.88m9.899-4.95l4.243-4.242" /> },
    { id: 4, title: "WH Bundles", icon: <path d="M4 7l8-4 8 4-8 4-8-4zM4 12l8 4 8-4M4 17l8 4 8-4" /> },
    { id: 5, title: "Cycle Count", icon: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /> },
    { id: 6, title: "Settings", icon: <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /> },
  ];

  return (
    // Main Background: Deep Teal Gradient
    <div className="min-h-screen bg-gradient-to-br from-[#00607A] to-[#00B4CB] p-4 md:p-6 flex flex-col font-sans select-none overflow-hidden">
      
      {/* Hidden form for PDA physical scanner */}
      <form onSubmit={handleScanSubmit} className="absolute opacity-0 pointer-events-none">
        <input
          ref={inputRef}
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          inputMode="none" // Prevents virtual keyboard
          autoFocus
          onBlur={() => inputRef.current?.focus()} // Force focus back
        />
      </form>

      {/* Top Navigation / Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
            MEGA FACTORY <span className="text-[#004A63] bg-white/20 px-2 rounded">WMS</span>
          </h1>
        </div>

        {/* Language Toggle */}
        <div className="bg-[#004A63]/80 rounded-full px-2 py-1 flex gap-1 shadow-inner backdrop-blur-sm">
          {["ខ្មែរ", "中文", "Eng"].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                lang === l ? "bg-white text-[#004A63] shadow-sm" : "text-white/80 hover:text-white"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row gap-5 flex-1">
        
        {/* Left Side: Service Grid */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col items-center justify-center p-4 md:p-6 active:scale-95 transition-transform duration-100 ease-in-out border-b-4 border-transparent active:border-[#00B4CB]"
            >
              {/* Organic Icon Background like ABA */}
              <div className="bg-[#E0F7FA] text-[#00607A] p-4 rounded-full mb-3 md:mb-4 shadow-sm">
                <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  {item.icon}
                </svg>
              </div>
              <span className="text-[#004A63] font-bold text-sm md:text-base leading-tight text-center">
                {item.title}
              </span>
            </button>
          ))}
        </div>

        {/* Right Side: Shift Dashboard Banner */}
        <div className="bg-white rounded-2xl shadow-2xl p-5 w-full md:w-72 lg:w-80 flex flex-col shrink-0 relative overflow-hidden border border-white/50">
          
          {/* Decorative graphic behind text */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-[#00B4CB]/10 rounded-full blur-2xl"></div>

          <h2 className="text-[#004A63] font-extrabold text-lg mb-4 border-b pb-2">Shift Dashboard</h2>
          
          <div className="space-y-4 flex-1">
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase">Operator</p>
              <p className="text-[#00607A] font-bold text-lg">Chanudom E.</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase">Date</p>
              <p className="text-gray-700 font-medium">August 21, 2026</p>
            </div>

            <div className="bg-[#F8FAFC] p-3 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Scanner Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="text-sm font-bold text-emerald-600">Ready to Scan</span>
              </div>
            </div>
          </div>

          <button className="mt-4 w-full bg-[#E63946] text-white font-bold py-3 rounded-xl active:bg-red-700 shadow-md transition-colors text-sm">
            End Shift
          </button>
        </div>

      </div>
    </div>
  );
}