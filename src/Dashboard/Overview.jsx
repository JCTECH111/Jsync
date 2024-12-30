
import UpgradeBanner from '../components/UpgradeBanner'
import ActivityChart from '../components/DailyUsageChart'
import FileCards from '../components/FileCards'
import QuickAccess from '../components/QuickAccess'
function Overview() {
  return (
    <div>
      <UpgradeBanner />
      <ActivityChart />
      <FileCards />
      <QuickAccess />
    </div>
  )
}

export default Overview
