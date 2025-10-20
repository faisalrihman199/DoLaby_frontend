import React from 'react';

export default function HowWorks() {
  return (

    <div className="max-w-7xl md:mx-5 mx-auto bg-white rounded-3xl shadow-lg p-8 md:p-12 lg:p-16">

      {/* Title */}
      <h2 className="text-4xl md:text-5xl font-[500] text-gray-900 mb-8">
        How it Works
      </h2>

      {/* Steps Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-start mb-8">

        {/* Step 1 */}
         <div className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#12396F] text-[25px] font-bold text-white">
          1
        </span>
        <h3 className="text-[20px] md:text-[30px] font-semibold text-[#12396F] kantumruy leading-tight">
          Choose Outfit
        </h3>
      </div>

        {/* Step 2 */}
         <div className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#12396F] text-[25px] font-bold text-white">
          1
        </span>
        <h3 className="text-[20px] md:text-[30px] font-semibold text-[#12396F] kantumruy leading-tight">
          Upload Photo
        </h3>
      </div>

        {/* Step 3 */}
         <div className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#12396F] text-[25px] font-bold text-white">
          1
        </span>
        <h3 className="text-[20px] md:text-[30px] font-semibold text-[#12396F] kantumruy leading-tight">
          See the Result
        </h3>
      </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* Left Text */}
        <div>
          <h3 className="text-3xl md:text-4xl font-[600] text-[#12396F] kantumruy leading-tight">
            Start your Free<br />
            Virtual Try-On Today
          </h3>
        </div>

        {/* Right Card */}
        <div className="bg-blue-100 rounded-2xl p-8 md:p-10">
          <h4 style={{ WebkitTextStroke: "1px white" }} className="text-2xl text-outline-white md:text-3xl font-[700] font-kanit text-black mb-6">
            Want unlimited?
          </h4>
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg md:text-xl px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
            Register Now
          </button>
        </div>
      </div>
    </div>

  );
}