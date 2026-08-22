import React, { useState, useRef, useEffect } from "react";

export default function PutawayScreen({ onBack }) {
  const [scanStep, setScanStep] = useState("SCAN_ITEM");
  
  const [barcode, setBarcode] = useState("");
  const [itemData, setItemData] = useState(null);
  const [rackData, setRackData] = useState(null);
  
  const inputRef = useRef(null);

  // Aggressive focus lock: Ensures the hidden input always catches the PDA laser
  useEffect(() => {
    const enforceFocus = () => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
    };

    enforceFocus(); // Initial focus
    
    // Re-focus if the user taps anywhere on the screen
    window.addEventListener("click", enforceFocus);
    window.addEventListener("touchstart", enforceFocus);
    
    // Fallback: Check focus every 1 second in case the browser steals it
    const focusInterval = setInterval(enforceFocus, 1000);

    return () => {
      window.removeEventListener("click", enforceFocus);
      window.removeEventListener("touchstart", enforceFocus);
      clearInterval(focusInterval);
    };
  }, [scanStep]);

  // Listen for the 'Enter' key automatically appended by the PDA
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      
      const scannedValue = barcode.trim();
      if (!scannedValue) return;

      setBarcode(""); // Clear the input buffer instantly

      if (scanStep === "SCAN_ITEM") {
        // TODO: Replace with actual backend API fetch for fabric
        setItemData({
          rollId: scannedValue,
          fabricType: "Raw Fabric - Cotton",
          qty: 150,
          uom: "Meters"
        });
        setScanStep("SCAN_RACK");
      } 
      else if (scanStep === "SCAN_RACK") {
        // TODO: Replace with actual backend API fetch for the rack
        setRackData({
          rackId: scannedValue,
          currentBalance: 450, 
        });
        setScanStep("READY_TO_SUBMIT");
      }
    }
  };

  const handleConfirmPutaway = () => {
    // TODO: Send POST request linking itemData.rollId to rackData.rackId
    console.log("Submitting Putaway:", { item: itemData.rollId, rack: rackData.rackId });
    
    // Reset the UI for the next fabric roll
    setItemData(null);
    setRackData(null);
    setScanStep("SCAN_ITEM");
  };

  // Allow users to go back a step dynamically
  const handleStepBack = () => {
    if (scanStep === "READY_TO_SUBMIT") {
      setRackData(null);
      setScanStep("SCAN_RACK");
    } else if (scanStep === "SCAN_RACK") {
      setItemData(null);
      setScanStep("SCAN_ITEM");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00607A] to-[#00B4CB] p-4 flex flex-col font-sans select-none overflow-hidden">
      
      {/* 
        Off-screen input field for Android WebViews. 
        Fully interactable but completely invisible. 
      */}
      <input
        ref={inputRef}
        type="text"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        onKeyDown={handleKeyDown}
        inputMode="none" // Hides virtual keyboard
        autoComplete="off"
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          opacity: 0.01,
          height: "1px",
          width: "1px",
        }}
      />

      {/* Header (Cleaned up, no back button here) */}
      <div className="flex justify-center items-center mb-6 text-white pt-2">
        <h1 className="text-xl font-bold uppercase tracking-widest text-center">Putaway</h1>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-md border-t-8 border-[#00B4CB] flex flex-col min-h-[450px]">
          
          {/* Progress Indicator */}
          <div className="flex justify-center gap-2 mb-8">
            <div className={`h-2 w-1/3 rounded-full transition-colors ${scanStep === 'SCAN_ITEM' ? 'bg-[#00B4CB]' : 'bg-gray-200'}`}></div>
            <div className={`h-2 w-1/3 rounded-full transition-colors ${scanStep === 'SCAN_RACK' ? 'bg-[#00B4CB]' : 'bg-gray-200'}`}></div>
            <div className={`h-2 w-1/3 rounded-full transition-colors ${scanStep === 'READY_TO_SUBMIT' ? 'bg-[#00B4CB]' : 'bg-gray-200'}`}></div>
          </div>

          {/* Dynamic Content Area */}
          <div className="flex-1">
            {/* STEP 1: SCAN FABRIC */}
            {scanStep === "SCAN_ITEM" && (
              <div className="text-center animate-fade-in pb-4">
                <h2 className="text-2xl font-extrabold text-[#004A63] mb-2">Scan Fabric QR</h2>
                <p className="text-gray-500 font-medium mb-8">Point PDA at the roll label</p>
                <div className="w-32 h-32 mx-auto bg-[#E0F7FA] rounded-2xl flex items-center justify-center border-2 border-dashed border-[#00B4CB] animate-pulse">
                  <span className="text-[#00B4CB] text-4xl">📦</span>
                </div>
              </div>
            )}

            {/* STEP 2: SCAN RACK */}
            {scanStep === "SCAN_RACK" && (
              <div className="text-center animate-fade-in">
                <div className="bg-[#F8FAFC] p-4 rounded-xl mb-6 border border-gray-100 shadow-sm text-left">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Fabric Scanned</p>
                  <p className="text-lg font-bold text-[#004A63]">{itemData.rollId}</p>
                  <div className="flex justify-between mt-2 border-t pt-2">
                    <span className="text-gray-500">Qty:</span>
                    <span className="font-extrabold text-[#00B4CB] text-xl">{itemData.qty} {itemData.uom}</span>
                  </div>
                </div>
                <h2 className="text-2xl font-extrabold text-[#004A63] mb-2">Scan Rack QR</h2>
                <p className="text-gray-500 font-medium mb-4">Where are you placing this?</p>
              </div>
            )}

            {/* STEP 3: CONFIRMATION */}
            {scanStep === "READY_TO_SUBMIT" && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-extrabold text-center text-[#004A63] mb-6">Confirm Putaway</h2>
                
                <div className="space-y-3 mb-8">
                  {/* Fabric Summary */}
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Item Qty</p>
                      <p className="font-bold text-[#004A63]">{itemData.rollId}</p>
                    </div>
                    <p className="font-extrabold text-xl text-[#00B4CB]">+{itemData.qty} {itemData.uom}</p>
                  </div>
                  
                  {/* Destination Summary */}
                  <div className="flex justify-between items-center bg-[#E0F7FA] p-4 rounded-xl border border-[#00B4CB]/30">
                    <div>
                      <p className="text-xs text-[#00607A] font-bold uppercase">Destination Rack</p>
                      <p className="font-bold text-[#004A63]">{rackData.rackId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#00607A] font-bold uppercase">Current Balance</p>
                      <p className="font-extrabold text-xl text-[#00607A]">{rackData.currentBalance}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DYNAMIC ACTION BAR (Always anchored at the bottom of the card) */}
          <div className="mt-4 flex gap-3 w-full border-t border-gray-100 pt-6">
            
            {/* Dynamic Left Button: Exit if Step 1, Back if Step 2 or 3 */}
            <button 
              onClick={scanStep === "SCAN_ITEM" ? onBack : handleStepBack}
              className="w-1/3 bg-[#E63946]/10 text-[#E63946] border-2 border-[#E63946]/20 py-4 rounded-2xl font-extrabold text-lg active:bg-[#E63946] active:text-white transition-colors"
            >
              {scanStep === "SCAN_ITEM" ? "EXIT" : "BACK"}
            </button>

            {/* Dynamic Right Button: Disabled/Ghost if waiting, Confirm if Ready */}
            {scanStep === "READY_TO_SUBMIT" ? (
              <button 
                onClick={handleConfirmPutaway}
                className="w-2/3 bg-[#00B4CB] text-white py-4 rounded-2xl font-extrabold text-xl shadow-[0_8px_20px_rgba(0,180,203,0.4)] active:scale-95 active:bg-cyan-600 transition-all flex items-center justify-center gap-2"
              >
                <span>CONFIRM</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            ) : (
              <div className="w-2/3 bg-gray-50 text-gray-400 py-4 rounded-2xl font-bold text-sm flex items-center justify-center border-2 border-dashed border-gray-200">
                WAITING FOR SCAN...
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}