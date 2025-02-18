import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import NewsItem from './NewsItem'

const NewsCarousel = forwardRef(({ items, loading, interval, onSwipe, onArticleChange }, ref) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const containerRef = useRef(null)

  useImperativeHandle(ref, () => ({
    resetToFirstArticle: () => {
      setCurrentIndex(0)
      if (items[0]?.enclosure?.url) {
        onArticleChange(items[0].enclosure.url)
      }
    }
  }))

  const handleKeyDown = (e) => {
    switch(e.key) {
      case 'ArrowUp':
        setCurrentIndex(prev => Math.max(prev - 1, 0))
        onArticleChange(items[Math.max(currentIndex - 1, 0)]?.enclosure?.url)
        break
      case 'ArrowDown':
        setCurrentIndex(prev => Math.min(prev + 1, items.length - 1))
        onArticleChange(items[Math.min(currentIndex + 1, items.length - 1)]?.enclosure?.url)
        break
      default:
        break
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, items])

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
    <div 
      className="flex-1 relative h-[calc(100vh-200px)] overflow-y-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      ref={containerRef}
    >
      <div className="absolute inset-0 transition-transform duration-500"
        style={{ transform: `translateY(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div 
            key={index} 
            className="h-[calc(100vh-200px)] absolute top-0 left-0 right-0"
            style={{ 
              transform: `translateY(${index * 100}%)`,
              visibility: index === currentIndex ? 'visible' : 'hidden'
            }}
          >
            <NewsItem item={item} />
          </div>
        ))}
      </div>
    </div>
  )
})

export default NewsCarousel
