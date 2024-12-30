import React from 'react'
import UpgradeBanner from '../components/UpgradeBanner'
import ActivityChart from '../components/DailyUsageChart'
function Overview() {
  return (
    <div>
      <UpgradeBanner />
      <ActivityChart />
    </div>
  )
}

export default Overview
