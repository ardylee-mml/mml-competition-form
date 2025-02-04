'use client'

import { useState, useEffect } from 'react'
import { Application } from '@/lib/storage'
import { RefreshCw } from 'lucide-react'

export default function AdminPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications')
      if (!response.ok) throw new Error('Failed to fetch applications')
      const data = await response.json()
      setApplications(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading applications')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchApplications()
  }

  if (loading) return <div className="text-white">Loading...</div>
  if (error) return <div className="text-red-500">Error: {error}</div>

  return (
    <div className="container mx-auto p-4 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Applications ({applications.length})</h1>
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 border border-gray-700">
          <thead>
            <tr className="bg-gray-900">
              <th className="p-2 border border-gray-700">Team Name</th>
              <th className="p-2 border border-gray-700">Discord ID</th>
              <th className="p-2 border border-gray-700">Game Title</th>
              <th className="p-2 border border-gray-700">Game Genre</th>
              <th className="p-2 border border-gray-700">Team Members</th>
              <th className="p-2 border border-gray-700">Projected DAU</th>
              <th className="p-2 border border-gray-700">Day One Retention</th>
              <th className="p-2 border border-gray-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-700">
                <td className="p-2 border border-gray-700">{app.teamName}</td>
                <td className="p-2 border border-gray-700">{app.discordId}</td>
                <td className="p-2 border border-gray-700">{app.gameTitle}</td>
                <td className="p-2 border border-gray-700">{app.gameGenre}</td>
                <td className="p-2 border border-gray-700">{app.teamMembers}</td>
                <td className="p-2 border border-gray-700">{app.projectedDAU}</td>
                <td className="p-2 border border-gray-700">{app.dayOneRetention}%</td>
                <td className="p-2 border border-gray-700">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 