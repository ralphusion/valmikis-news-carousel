import React, { useState, useEffect, useRef } from 'react'
import CategorySelector from './components/CategorySelector'
import NewsCarousel from './components/NewsCarousel'

const categories = {
  'Formula 1': 'https://www.motorsport.com/rss/f1/news/',
  'Latest': 'https://www.thehindu.com/news/national/feeder/default.rss',
  'Sports': 'https://www.espncricinfo.com/rss/content/story/feeds/6.xml',
  'Business': 'https://www.livemint.com/rss/companies',
  'Lifestyle': 'https://www.indiatoday.in/rss/1206577',
  'AI': 'https://www.livemint.com/rss/AI'
}

async function parseRSS(url) {
  try {
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`
    const response = await fetch(proxyUrl)
    const data = await response.json()
    
    return data.items.map(item => ({
      title: item.title || 'Untitled Article',
      contentSnippet: item.description?.replace(/<[^>]+>/g, '') || '',
      pubDate: item.pubDate || new Date().toISOString(),
      link: item.link || '#',
      enclosure: {
        url: item.enclosure?.link || 
             item.thumbnail || 
             'https://source.unsplash.com/random/800x600?news'
      }
    }))
  } catch (error) {
    console.error('Error parsing RSS:', error)
    return []
  }
}

function App() {
  const [currentCategory, setCurrentCategory] = useState('Formula 1')
  const [newsItems, setNewsItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState('')
  const categoryKeys = Object.keys(categories)
  const categoryIndex = useRef(0)
  const carouselRef = useRef(null)

  const handleSwipe = (direction) => {
    if (direction === 'left') {
      categoryIndex.current = (categoryIndex.current + 1) % categoryKeys.length
    } else if (direction === 'right') {
      categoryIndex.current = (categoryIndex.current - 1 + categoryKeys.length) % categoryKeys.length
    }
    const newCategory = categoryKeys[categoryIndex.current]
    setCurrentCategory(newCategory)
    if (carouselRef.current) {
      carouselRef.current.resetToFirstArticle()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch(e.key) {
        case 'ArrowLeft':
          handleSwipe('right')
          break
        case 'ArrowRight':
          handleSwipe('left')
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSwipe])

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      try {
        const items = await parseRSS(categories[currentCategory])
        setNewsItems(items.slice(0, 20))
        if (items[0]?.enclosure?.url) {
          setCurrentImage(items[0].enclosure.url)
        }
      } catch (error) {
        console.error('Error fetching news:', error)
        setNewsItems([])
      }
      setLoading(false)
    }
    fetchNews()
  }, [currentCategory])

  const handleArticleChange = (imageUrl) => {
    setCurrentImage(imageUrl)
  }

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 -z-10">
        {currentImage && (
          <>
            <div
              className="w-full h-full bg-cover bg-center animate-zoom-in"
              style={{ 
                backgroundImage: `url(${currentImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                objectFit: 'cover'
              }}
            />
            <div className="absolute inset-0 bg-black/50" />
          </>
        )}
      </div>
      <div className="max-w-4xl mx-auto h-screen flex flex-col p-4 space-y-6">
        <div className="w-full pt-6">
          <CategorySelector 
            categories={categoryKeys} 
            currentCategory={currentCategory}
            onChange={setCurrentCategory}
          />
        </div>
        <div className="flex-1">
          <NewsCarousel 
            ref={carouselRef}
            items={newsItems} 
            loading={loading} 
            interval={10000}
            onSwipe={handleSwipe}
            onArticleChange={handleArticleChange}
          />
        </div>
      </div>
    </div>
  )
}

export default App
