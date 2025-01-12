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

  // Extract source from link
  const source = item.link ? new URL(item.link).hostname.replace('www.', '') : 'Unknown'

  const cleanContent = (content) => {
    if (!content) return 'No content available...'
    const cleaned = content
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    return cleaned.length > 500 ? cleaned.substring(0, 500) + '...' : cleaned
  }

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 flex flex-col space-y-4 h-[80vh]">
      <div>
        <h1 className="text-3xl font-bold mb-1 leading-tight text-white">
          {item.title}
        </h1>
        <p className="text-sm text-white/80 mb-4">{formattedDate}</p>
        <p className="text-white text-xl leading-relaxed mb-6 text-justify">
          {cleanContent(item.contentSnippet)}
        </p>
      </div>
      <div className="mt-auto">
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 underline text-lg transition-colors"
          >
            Continue on {source} →
          </a>
        )}
      </div>
    </div>
  )
}
