import type { Post } from '../models/posts';

export default async function Page() {
  let data = await fetch('http://localhost:8000/posts');
  let posts: Post[] = await data.json();
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
