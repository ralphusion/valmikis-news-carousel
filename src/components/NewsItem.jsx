import React from 'react'

    export default function NewsItem({ item = {} }) {
      const pubDate = item.pubDate ? new Date(item.pubDate) : new Date()
      const formattedDate = pubDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })

      const cleanContent = (content) => {
        if (!content) return 'No content available...'
        const cleaned = content
          .replace(/<[^>]+>/g, '')
          .replace(/\s+/g, ' ')
          .trim()
        return cleaned.length > 500 ? cleaned.substring(0, 500) + '...' : cleaned
      }

      return (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 h-full flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 leading-tight text-gray-900">
              {item.title}
            </h1>
            <p className="text-sm text-gray-500 mb-4">{formattedDate}</p>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {cleanContent(item.contentSnippet)}
            </p>
          </div>
          <div>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full text-center px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Read More
              </a>
            )}
          </div>
        </div>
      )
    }
