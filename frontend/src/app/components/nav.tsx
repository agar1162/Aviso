import Image from 'next/image';

export default function Nav() {
  return (
    <div className="flex flex-row justify-center items-center gap-[25%] pt-10">
      <div className="flex flex-row gap-2 text-[50px] text-brown-500">
        ¡AViSO!
        <button onClick={() => console.log('Button clicked')}>
          <Image
            src="/down.svg"
            width={36}
            height={65}
            alt="Toggle dropdown"
            className="cursor-pointer"
          />
        </button>
      </div>
      <div className="">
        <button className="bg-red-500 text-white rounded-xl flex items-center justify-center h-15 w-40 text-[36px]">
          Report
        </button>
      </div>
    </div>
  );
}
