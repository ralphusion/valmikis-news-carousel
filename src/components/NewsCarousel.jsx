import React, { useState, useEffect, useRef } from 'react'
import NewsItem from './NewsItem'

export default function NewsCarousel({ items, loading, interval, onSwipe, onArticleChange }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const deltaX = touchEndX - touchStartX.current
    const deltaY = touchEndY - touchStartY.current

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 50) onSwipe('right')
      if (deltaX < -50) onSwipe('left')
    } else {
      if (deltaY > 50) {
        setCurrentIndex((prev) => Math.max(prev - 1, 0))
        onArticleChange(items[Math.max(currentIndex - 1, 0)]?.enclosure?.url)
      }
      if (deltaY < -50) {
        setCurrentIndex((prev) => Math.min(prev + 1, items.length - 1))
        onArticleChange(items[Math.min(currentIndex + 1, items.length - 1)]?.enclosure?.url)
      }
    }
  }

  useEffect(() => {
    if (items.length > 1) {
      const timer = setInterval(() => {
        const nextIndex = (currentIndex + 1) % items.length
        setCurrentIndex(nextIndex)
        onArticleChange(items[nextIndex]?.enclosure?.url)
      }, interval)
      return () => clearInterval(timer)
    }
  }, [items, interval, currentIndex, onArticleChange])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-black/50 rounded w-48" />
          <div className="h-4 bg-black/50 rounded w-64" />
          <div className="h-4 bg-black/50 rounded w-56" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 relative overflow-hidden">
      <div 
        className="absolute inset-0 transition-transform duration-500"
        style={{ transform: `translateY(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={index} className="h-full flex items-center p-4">
            <div className="flex-1 h-full">
              <NewsItem item={item} />
            </div>
            <div className="w-12 ml-4 flex items-center">
              <div className="flex flex-col space-y-2 bg-black/20 backdrop-blur-sm p-2 rounded-lg">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentIndex(i)
                      onArticleChange(items[i]?.enclosure?.url)
                    }}
                    className={`w-3 h-3 rounded-full transition-all ${
                      i === index ? 'bg-purple-600' : 'bg-white/50'
                    } hover:bg-purple-400`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
