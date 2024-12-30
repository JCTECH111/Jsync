
import UpgradeBanner from '../components/UpgradeBanner'
import ActivityChart from '../components/DailyUsageChart'
import FileCards from '../components/FileCards'
import QuickAccess from '../components/QuickAccess'
import RecentFiles from '../components/RecentFiles'
function Overview() {
  return (
    <div>
      <UpgradeBanner />
      <ActivityChart />
      <FileCards />
      <QuickAccess />
      <RecentFiles />
    </div>
  )
}

export default Overview
