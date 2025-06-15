import type { Post } from "../models/post"
import Image from "next/image";

const CardComponent = ({ data }: { data: Post }) => (
  <div className="border-2 p-5 shadow rounded hover:bg-gray-100 rounded-lg">
    <div className="flex flex-row justify-between w-full">
        <h2 className="text-lg font-bold">{data.title}</h2>
        <h2 className="text-lg font-bold text-brown-500">{data.city}</h2>

    </div>
    <p>{new Date(data.date).toLocaleDateString()}</p>
    <p className="text-sm mt-2">{data.desc}</p>
    {data.image_url ? (
      <Image
        src={data.image_url.trim()}
        alt={data.title}
        className="mt-2 rounded"
        loading="lazy"
        width={20}
        height={20}
      />
    ) : (
      <p className="mt-2 text-gray-400 italic">No image available</p>
    )}
  </div>
);

export default CardComponent;
