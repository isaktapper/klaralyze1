'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ExampleComponent() {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Example query - replace 'your_table' with your actual table name
        const { data, error } = await supabase
          .from('your_table')
          .select('*')
        
        if (error) throw error
        setData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
    }

    fetchData()
  }, [])

  if (error) return <div>Error: {error}</div>
  if (!data) return <div>Loading...</div>

  return (
    <div>
      <h1>Data from Supabase</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
} 