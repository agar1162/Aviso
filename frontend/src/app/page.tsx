'use client'

import { useEffect, useState } from 'react'
import type { Post } from '../models/posts'
import Nav from './components/nav'
import Image from 'next/image'

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('https://aviso-api-vpfsn.ondigitalocean.app/posts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!res.ok) {
          const errorText = await res.text()
          console.error('Failed response:', res.status, errorText)
          return
        }

        const data = await res.json()
        console.log('Fetched posts:', data) // ✅ log to confirm
        setPosts(data)
      } catch (err) {
        console.error('Failed to fetch posts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <>
      <Nav />
      <div className="px-4 py-8">
        {loading ? (
          <p className="text-center text-brown-500">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white shadow-md rounded-xl p-4 border border-gray-200"
              >
                {/* Only show image if it's a valid URL */}
                {post.image_url?.startsWith('http') && (
                  <div className="relative h-48 w-full mb-4">
                    <Image
                      src={post.image_url}
                      alt={post.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Info */}
                <h2 className="text-xl font-semibold text-brown-500">{post.title}</h2>
                <p className="text-gray-600">{post.date} at {post.time?.slice(0, 5)}</p>
                <p className="text-gray-700">{post.city}, {post.county}</p>
                <p className="text-sm mt-2 text-gray-500">{post.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
