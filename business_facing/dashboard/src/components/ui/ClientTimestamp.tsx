'use client'

import { useState, useEffect } from 'react'

export default function ClientTimestamp() {
  const [timestamp, setTimestamp] = useState<string>('')

  useEffect(() => {
    const updateTimestamp = () => {
      setTimestamp(new Date().toLocaleTimeString())
    }
    
    // Set initial timestamp
    updateTimestamp()
    
    // Update every minute
    const interval = setInterval(updateTimestamp, 60000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <span>
      Walmart Supply Chain Command Center • Last updated: {timestamp || 'Loading...'}
    </span>
  )
}