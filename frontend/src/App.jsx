import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { LinkIcon, ChartBarIcon, ClipboardIcon } from '@heroicons/react/24/outline'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setShortUrl('')

    try {
      const response = await axios.post('/api/shorten', { originalUrl: url })
      setShortUrl(response.data.shortUrl)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            URL Shortener
          </h1>
          <p className="text-lg text-gray-300">
            Shorten your long URLs into memorable, shareable links
          </p>
        </div>

        <motion.div 
          className="card bg-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-1">
                Enter your URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="input bg-gray-700 text-white placeholder-gray-400"
                  required
                />
                <LinkIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Shorten URL'
              )}
            </button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-3 bg-red-900/50 text-red-200 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            {shortUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-gray-700 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-300">Shortened URL</p>
                    <p className="text-lg text-primary-400 truncate">{shortUrl}</p>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="ml-4 p-2 text-gray-400 hover:text-white transition-colors"
                    title="Copy to clipboard"
                  >
                    <ClipboardIcon className="h-5 w-5" />
                  </button>
                </div>
                {copied && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm text-green-400"
                  >
                    Copied to clipboard!
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <a
            href={`/api/analytics/${shortUrl?.split('/').pop()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ChartBarIcon className="h-4 w-4 mr-1" />
            View Analytics
          </a>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default App
