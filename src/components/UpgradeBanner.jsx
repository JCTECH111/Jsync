import React from 'react'
import Upgrade from '../assets/upgrade.svg'
import { Link } from 'react-router-dom'

function UpgradeBanner() {
  return (
    <div className='grid lg:grid-cols-[20%_60%_20%] grid-cols-1 h-auto items-center text-center justify-center w-full lg:h-40 gap-2 p-3 bg-blue-100 rounded-lg'>
  {/* Image */}
  <img
    alt='upgrade-image'
    src={Upgrade}
    className='h-32 mx-auto' // Centers the image on small screens
  />
  {/* Text Content */}
  <div className='flex flex-col items-center gap-3 text-center'>
    <h3 className='font-bold text-gray-900'>Get An Upgrade</h3>
    <p className='font-serif text-gray-500'>
      Get additional 500 GB space for your documents and files. Expand your storage and enjoy your business. Change plan for more space.
    </p>
    <small className='text-gray-500 cursor-pointer'>Close</small>
  </div>
  {/* Button */}
  <Link to="/dashboard/settings">
    <button className='flex justify-center items-center h-12 border-blue-600 border-[1px] w-28 rounded-md text-sm mx-auto hover:bg-blue-600 hover:text-white hover:border-none'>
      Upgrade Now
    </button>
  </Link>
</div>

  )
}

export default UpgradeBanner
