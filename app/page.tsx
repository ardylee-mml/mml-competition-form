import ApplicationForm from "./components/ApplicationForm"

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <main className="container mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-4 text-center text-cyan-400">MML Game Design and Development Competition</h1>
          <p className="text-lg text-center mb-8 text-gray-300">
            Showcase your game development skills and compete for 30000 Robux!
          </p>
          <ApplicationForm />
        </div>
      </main>
    </div>
  )
}

