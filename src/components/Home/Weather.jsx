import { Sun } from 'lucide-react'
import React from 'react'
import { IoIosCloudOutline } from 'react-icons/io'

const Weather = () => {
  return (
    <div className="hidden md:flex absolute top-8 left-1/3 transform -translate-x-1/2 z-50">
        <div className="text-center">
          <p className="text-gray-700 font-semibold text-lg mb-0">Cairo</p>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sun className="w-6 h-6 text-yellow-400 -mt-6" strokeWidth={1.5} />
            <IoIosCloudOutline className="w-14 h-14 text-black-400 font-light -ml-6" strokeWidth={0.2} />
            <p className="text-xl font-semibold text-gray-800" style={{ marginTop: '-30px' }}>23°C</p>
          </div>
        </div>
      </div>
  )
}

export default Weather