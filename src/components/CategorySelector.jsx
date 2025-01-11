import React from 'react'

    export default function CategorySelector({ categories, currentCategory, onChange }) {
      return (
        <div className="bg-white/80 backdrop-blur-sm p-4 shadow-sm overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  category === currentCategory
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )
    }
