'use client'

import { useState, useEffect } from 'react'
import { Application } from '@/lib/storage'
import { RefreshCw, X } from 'lucide-react'

export default function AdminPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)

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

  const DetailModal = ({ application }: { application: Application }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Application Details</h2>
          <button 
            onClick={() => setSelectedApp(null)}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-cyan-400">Team Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400">Team Name</label>
                <p className="text-white">{application.teamName}</p>
              </div>
              <div>
                <label className="text-gray-400">Discord ID</label>
                <p className="text-white">{application.discordId}</p>
              </div>
            </div>
            <div>
              <label className="text-gray-400">Team Members</label>
              <p className="text-white whitespace-pre-wrap">{application.teamMembers}</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-cyan-400">Game Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400">Game Title</label>
                <p className="text-white">{application.gameTitle}</p>
              </div>
              <div>
                <label className="text-gray-400">Genre</label>
                <p className="text-white">{application.gameGenre}</p>
              </div>
            </div>
            <div>
              <label className="text-gray-400">Game Concept</label>
              <p className="text-white whitespace-pre-wrap">{application.gameConcept}</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-cyan-400">Business & Development</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400">Projected DAU</label>
                <p className="text-white">{application.projectedDAU}</p>
              </div>
              <div>
                <label className="text-gray-400">Day One Retention</label>
                <p className="text-white">{application.dayOneRetention}%</p>
              </div>
            </div>
            <div>
              <label className="text-gray-400">Promotion Plan</label>
              <p className="text-white whitespace-pre-wrap">{application.promotionPlan}</p>
            </div>
            <div>
              <label className="text-gray-400">Monetization Plan</label>
              <p className="text-white whitespace-pre-wrap">{application.monetizationPlan}</p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-semibold text-cyan-400">Experience & Resources</h3>
            <div>
              <label className="text-gray-400">Team Experience</label>
              <p className="text-white whitespace-pre-wrap">{application.teamExperience}</p>
            </div>
            <div>
              <label className="text-gray-400">Previous Projects</label>
              <p className="text-white whitespace-pre-wrap">{application.previousProjects}</p>
            </div>
            <div>
              <label className="text-gray-400">Development Timeline</label>
              <p className="text-white whitespace-pre-wrap">{application.developmentTimeline}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )

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
              <th className="p-2 border border-gray-700">Date</th>
              <th className="p-2 border border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-700">
                <td className="p-2 border border-gray-700">{app.teamName}</td>
                <td className="p-2 border border-gray-700">{app.discordId}</td>
                <td className="p-2 border border-gray-700">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 border border-gray-700">
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedApp && <DetailModal application={selectedApp} />}
    </div>
  )
} 