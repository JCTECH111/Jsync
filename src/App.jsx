import React from 'react'
import AppRouter from './routes/AppRouter'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import './App.css'

function App() {
  return (
    <>
    <AppRouter />
    <SpeedInsights />
    <Analytics />
    </>
  )
}

export default App