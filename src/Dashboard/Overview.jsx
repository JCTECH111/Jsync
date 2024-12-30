
import UpgradeBanner from '../components/UpgradeBanner'
import ActivityChart from '../components/DailyUsageChart'
import FileCards from '../components/FileCards'
import QuickAccess from '../components/QuickAccess'
import RecentFiles from '../components/RecentFiles'
import Footer from '../components/Footer'
function Overview() {
  return (
    <div>
      <UpgradeBanner />
      <ActivityChart />
      <FileCards />
      <QuickAccess />
      <RecentFiles />
      <Footer />
    </div>
  )
}

export default Overview
