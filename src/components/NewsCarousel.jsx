import React, { useState, useEffect } from 'react'
    import NewsItem from './NewsItem'

    export default function NewsCarousel({ items, loading, interval }) {
      const [currentIndex, setCurrentIndex] = useState(0)

      useEffect(() => {
        if (items.length > 1) {
          const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length)
          }, interval)
          return () => clearInterval(timer)
        }
      }, [items, interval])

      if (loading) {
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-white/80 rounded w-48" />
              <div className="h-4 bg-white/80 rounded w-64" />
              <div className="h-4 bg-white/80 rounded w-56" />
            </div>
          </div>
        )
      }

      return (
        <div className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-500"
            style={{ transform: `translateY(-${currentIndex * 100}%)` }}
          >
            {items.map((item, index) => (
              <div key={index} className="h-full p-4">
                <NewsItem item={item} />
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      )
    }
