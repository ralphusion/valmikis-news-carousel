import React, { useState, useEffect, useRef } from 'react'
    import CategorySelector from './components/CategorySelector'
    import NewsCarousel from './components/NewsCarousel'

    const categories = {
      'Formula 1': 'https://www.motorsport.com/rss/f1/news/',
      'Local': 'https://www.thehindu.com/news/national/feeder/default.rss',
      'Sports': 'https://www.espncricinfo.com/rss/content/story/feeds/6.xml',
      'Finance': 'https://www.livemint.com/rss/companies',
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
      const categoryKeys = Object.keys(categories)
      const categoryIndex = useRef(0)

      const handleSwipe = (direction) => {
        if (direction === 'left') {
          categoryIndex.current = (categoryIndex.current + 1) % categoryKeys.length
        } else if (direction === 'right') {
          categoryIndex.current = (categoryIndex.current - 1 + categoryKeys.length) % categoryKeys.length
        }
        setCurrentCategory(categoryKeys[categoryIndex.current])
      }

      useEffect(() => {
        const fetchNews = async () => {
          setLoading(true)
          try {
            const items = await parseRSS(categories[currentCategory])
            setNewsItems(items.slice(0, 20))
          } catch (error) {
            console.error('Error fetching news:', error)
            setNewsItems([])
          }
          setLoading(false)
        }
        fetchNews()
      }, [currentCategory])

      return (
        <div className="min-h-screen bg-gray-100">
          <div className="fixed inset-0 -z-10">
            {newsItems[0]?.enclosure?.url && (
              <div
                className="w-full h-full bg-cover bg-center animate-zoom-in"
                style={{ backgroundImage: `url(${newsItems[0]?.enclosure?.url})` }}
              />
            )}
          </div>
          <div className="max-w-2xl mx-auto h-screen flex flex-col p-4">
            <CategorySelector 
              categories={categoryKeys} 
              currentCategory={currentCategory}
              onChange={setCurrentCategory}
            />
            <NewsCarousel 
              items={newsItems} 
              loading={loading} 
              interval={10000}
              onSwipe={handleSwipe}
            />
          </div>
        </div>
      )
    }

    export default App
