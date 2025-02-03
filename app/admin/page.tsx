'use client'

import { useState, useEffect } from 'react'
import { Application } from '@/lib/storage'
import { Search, Trash2, RefreshCw } from 'lucide-react'

export default function AdminPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchField, setSearchField] = useState<'email' | 'discordId'>('email')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadApplications = async () => {
    try {
      const res = await fetch('/api/applications')
      if (!res.ok) throw new Error('Authentication failed')
      const data = await res.json()
      setApplications(data.applications)
      setFilteredApplications(data.applications)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadApplications()
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await loadApplications()
    } finally {
      setIsRefreshing(false)
    }
  }

  // Search function
  useEffect(() => {
    const filtered = applications.filter(app => {
      const searchValue = searchTerm.toLowerCase()
      const fieldValue = app[searchField]?.toLowerCase() || ''
      return fieldValue.includes(searchValue)
    })
    setFilteredApplications(filtered)
  }, [searchTerm, searchField, applications])

  const downloadCsv = () => {
    const csv = [
      [
        'ID',
        'Name',
        'Email',
        'Discord ID',
        'Team Name',
        'Team Members',
        'Team Experience',
        'Previous Projects',
        'Team Experience Description',
        'Game Genre',
        'Game Title',
        'Game Concept',
        'Why Win',
        'Why Players Like',
        'Promotion Plan',
        'Monetization Plan',
        'Projected DAU',
        'Day One Retention',
        'Development Timeline',
        'Resources & Tools',
        'Created At'
      ],
      ...applications.map(app => [
        app.id,
        app.name,
        app.email,
        app.discordId,
        app.teamName,
        app.teamMembers,
        app.teamExperience,
        app.previousProjects,
        app.teamExperienceDescription,
        app.gameGenre,
        app.gameTitle,
        app.gameConcept,
        app.whyWin,
        app.whyPlayersLike,
        app.promotionPlan,
        app.monetizationPlan,
        app.projectedDAU,
        app.dayOneRetention,
        app.developmentTimeline,
        app.resourcesTools,
        app.createdAt
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'applications.csv'
    a.click()
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return
    }

    setIsDeleting(id)
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete application')
      }

      setApplications(prev => prev.filter(app => app.id !== id))
      setFilteredApplications(prev => prev.filter(app => app.id !== id))
      
      if (selectedApp?.id === id) {
        setSelectedApp(null)
      }
    } catch (error) {
      console.error('Error deleting application:', error)
      alert('Failed to delete application')
    } finally {
      setIsDeleting(null)
    }
  }

  const renderTableRow = (app: Application) => (
    <tr key={app.id} className="border-b border-gray-700 hover:bg-gray-800">
      <td className="p-2 text-gray-100">{app.name || '-'}</td>
      <td className="p-2 text-gray-100">{app.email || '-'}</td>
      <td className="p-2 text-gray-100">{app.discordId || '-'}</td>
      <td className="p-2 text-gray-100">{app.teamName || '-'}</td>
      <td className="p-2 text-gray-100">{app.gameTitle || '-'}</td>
      <td className="p-2 text-gray-100">{app.gameGenre || '-'}</td>
      <td className="p-2 text-gray-100">{new Date(app.createdAt).toLocaleDateString()}</td>
      <td className="p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedApp(app)}
            className="text-cyan-400 hover:text-cyan-300"
          >
            View
          </button>
          <button
            onClick={() => handleDelete(app.id)}
            disabled={isDeleting === app.id}
            className={`text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1`}
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting === app.id ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </td>
    </tr>
  )

  const ApplicationDetails = ({ application }: { application: Application }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 text-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-cyan-400">Application Details</h2>
          <div className="flex gap-2">
            <button
              onClick={() => handleDelete(application.id)}
              disabled={isDeleting === application.id}
              className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting === application.id ? 'Deleting...' : 'Delete'}
            </button>
            <button 
              onClick={() => setSelectedApp(null)}
              className="text-gray-400 hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <section className="border-b border-gray-700 pb-4">
            <h3 className="font-semibold mb-2 text-cyan-300">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Name</label>
                <p className="text-gray-100">{application.name || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <p className="text-gray-100">{application.email || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Discord ID</label>
                <p className="text-gray-100">{application.discordId || '-'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Team Name</label>
                <p className="text-gray-100">{application.teamName || '-'}</p>
              </div>
            </div>
          </section>

          <section className="border-b border-gray-700 pb-4">
            <h3 className="font-semibold mb-2 text-cyan-300">Team Information</h3>
            <div className="space-y-2">
              <div>
                <label className="text-sm text-gray-400">Team Members</label>
                <p className="whitespace-pre-line text-gray-100">{application.teamMembers}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Team Experience</label>
                <p className="text-gray-100">{application.teamExperience}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Previous Projects</label>
                <p className="text-gray-100">{application.previousProjects}</p>
              </div>
            </div>
          </section>

          <section className="border-b border-gray-700 pb-4">
            <h3 className="font-semibold mb-2 text-cyan-300">Game Details</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Game Title</label>
                  <p className="text-gray-100">{application.gameTitle}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Genre</label>
                  <p className="text-gray-100">{application.gameGenre}</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400">Game Concept</label>
                <p className="text-gray-100">{application.gameConcept}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Why Win</label>
                <p className="text-gray-100">{application.whyWin}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Why Players Will Like</label>
                <p className="text-gray-100">{application.whyPlayersLike}</p>
              </div>
            </div>
          </section>

          <section className="border-b border-gray-700 pb-4">
            <h3 className="font-semibold mb-2 text-cyan-300">Business & Development</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Projected DAU</label>
                  <p className="text-gray-100">{application.projectedDAU}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Day One Retention</label>
                  <p className="text-gray-100">{application.dayOneRetention}%</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400">Promotion Plan</label>
                <p className="text-gray-100">{application.promotionPlan}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Monetization Plan</label>
                <p className="text-gray-100">{application.monetizationPlan}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Development Timeline</label>
                <p className="text-gray-100">{application.developmentTimeline}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Resources & Tools</label>
                <p className="text-gray-100">{application.resourcesTools}</p>
              </div>
            </div>
          </section>

          <div className="text-sm text-gray-400">
            Application ID: {application.id}<br />
            Submitted: {new Date(application.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )

  if (error) return <div className="p-8 text-red-500">Error: {error}</div>
  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Applications</h1>
          <div className="text-gray-400">
            Total Records: {applications.length}
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-gray-700 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button 
            onClick={downloadCsv}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Download CSV
          </button>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-6 bg-gray-800 p-4 rounded-lg">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search by ${searchField === 'email' ? 'email' : 'Discord ID'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSearchField('email')}
              className={`px-4 py-2 rounded-lg ${
                searchField === 'email'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setSearchField('discordId')}
              className={`px-4 py-2 rounded-lg ${
                searchField === 'discordId'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              Discord ID
            </button>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-400">
          Showing {filteredApplications.length} of {applications.length} applications
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead>
            <tr className="bg-gray-800 text-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Discord ID</th>
              <th className="p-2 text-left">Team Name</th>
              <th className="p-2 text-left">Game Title</th>
              <th className="p-2 text-left">Game Genre</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map(app => renderTableRow(app))}
          </tbody>
        </table>
      </div>

      {selectedApp && <ApplicationDetails application={selectedApp} />}
    </div>
  )
} 