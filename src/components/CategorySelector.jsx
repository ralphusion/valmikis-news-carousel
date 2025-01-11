import React from 'react'

    export default function CategorySelector({ categories, currentCategory, onChange }) {
      return (
        <div className="bg-white/20 backdrop-blur-sm p-4 shadow-sm overflow-x-auto scrollbar-hide rounded-lg">
          <div className="flex gap-2 justify-start min-w-max">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  category === currentCategory
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/20 text-gray-700 hover:bg-white/30'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )
    }
