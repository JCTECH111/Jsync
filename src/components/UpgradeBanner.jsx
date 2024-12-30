import React from 'react'
import Upgrade from '../assets/upgrade.svg'
import { Link } from 'react-router-dom'

function UpgradeBanner() {
  return (
    <div className='grid lg:grid-cols-[20%_60%_20%] grid-cols-1 h-auto items-center text-center justify-between w-full lg:h-40 gap-2 p-3 bg-blue-100 rounded-lg'>
    <img alt='upgrade-image' src={Upgrade} className='h-32'/>
      <div className='flex flex-col gap-3 '>
        <h3 className='font-bold text-gray-900'>Get An Upgrade</h3>
        <p className='font-serif text-gray-500'>Get additional 500 GB space for your documents and files. Expand your storage and enjoy your business. Change plan for more space</p>
        <small>Close</small>
      </div>
      <Link>
        <button className='flex justify-center items-center h-12 border-blue-600 border-[1px] w-28 rounded-md text-sm hover:bg-blue-600 hover:text-white hover:border-none'>
            Upgrade Now
        </button>
      </Link>
    </div>
  )
}

export default UpgradeBanner
