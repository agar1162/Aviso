import Image from "next/image";

export default function Nav() {
  return (
    <div className="w-[90%] lg:w-[40%] mx-auto pt-10">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 text-[40px] text-brown-500 items-center">
          ¡AViSO!
          <button onClick={() => console.log("Button clicked")}>
            <Image
              src="/down.svg"
              width={36}
              height={65}
              alt="Toggle dropdown"
              className="cursor-pointer"
            />
          </button>
        </div>

        <button className="bg-red-500 hover:bg-red-400 text-white rounded-xl flex items-center justify-center px-6 py-2 text-[20px] gap-3">
          <span className="flex items-center gap-3">
            <span>Report</span>
            <span className="w-[1px] h-6 bg-white" />
            <span className="text-xl font-bold"><img src="/plus.svg" width={15} height={15}/></span>

          </span>
        </button>
      </div>
    </div>
  );
}
