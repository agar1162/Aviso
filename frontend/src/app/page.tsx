'use client'

import { useEffect, useState } from 'react'
import type { Post } from '../models/posts'
import Nav from './components/nav'
import Image from 'next/image'

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  /*
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
        console.log('Fetched posts:', data) 
        setPosts(data)
      } catch (err) {
        console.error('Failed to fetch posts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])
  */

  return (
    <>
      <Nav />
      <div className='bg-blue-500'>
          h
      </div>
    </>
  )
}


