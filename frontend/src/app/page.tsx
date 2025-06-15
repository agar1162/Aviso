import type { Post } from './models/post';


export default async function Page() {
  const res = await fetch('http://localhost:8000/posts')
  const posts: Post[] = await res.json()

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}


