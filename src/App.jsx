import React, { useState } from 'react'
import './App.css'
import axios from 'axios'

const App = () => {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([]) // {role:'user'|'bot', text}
  const [loading, setLoading] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return

    const userMessage = { role: 'user', text: question.trim() }
    setMessages((m) => [...m, userMessage])
    setQuestion('')
    setLoading(true)
// https://chatbot-backend-s75c.onrender.com
    try {
      const res = await axios.post(`${API_URL}/ask`, { question: userMessage.text })
      const body = res.data
      if (body && body._status) {
        const botMessage = { role: 'bot', text: body._finalData || 'No response' }
        setMessages((m) => [...m, botMessage])
      } else {
        const errMsg = (body && body._message) || 'Request failed'
        setMessages((m) => [...m, { role: 'bot', text: `Error: ${errMsg}` }])
      }
    } catch (err) {
      console.error('request error:', err)
      // try to provide a helpful error message (server response if available)
      const serverMsg = err?.response?.data || err?.message || 'Unknown error'
      setMessages((m) => [...m, { role: 'bot', text: `Server error: ${JSON.stringify(serverMsg)}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden'>
        <header className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6'>
          <h1 className='text-2xl font-bold'>Personal Chatbot</h1>
          <p className='text-sm opacity-90'>Ask anything — powered by your generative AI model</p>
        </header>

        <main className='md:flex'>
          <section className='md:w-1/3 border-r p-4 bg-gray-50'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
              <label className='text-sm font-medium'>Your prompt</label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={6}
                className='resize-none rounded-md border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300'
                placeholder='Write your question or prompt here...'
              />
              <button
                type='submit'
                disabled={loading}
                className={`py-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {loading ? 'Generating...' : 'Send'}
              </button>
            </form>
            <p className='text-xs mt-4 text-gray-500'>Pro tip: Try asking for a summary, code snippet, or creative content.</p>
          </section>

          <section className='md:flex-1 p-4'>
            <div className='h-[60vh] overflow-y-auto p-3 flex flex-col gap-3'>
              {messages.length === 0 && (
                <div className='text-center text-gray-400 mt-12'>Your conversation will appear here.</div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`max-w-[80%] ${m.role === 'user' ? 'self-end text-right' : 'self-start text-left'}`}>
                  <div className={`${m.role === 'user' ? 'inline-block bg-indigo-600 text-white' : 'inline-block bg-gray-100 text-gray-800'} px-4 py-2 rounded-lg`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
