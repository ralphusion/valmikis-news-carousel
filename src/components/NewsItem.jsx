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
            className="inline-flex items-center text-purple-300 hover:text-purple-200 transition-colors group"
          >
            <span className="mr-2">Read full story on</span>
            <span className="font-medium border-b border-purple-300/50 hover:border-purple-200/70 transition-colors">
              {source}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1.5 opacity-80 group-hover:translate-x-1 transition-transform"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
            />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}
