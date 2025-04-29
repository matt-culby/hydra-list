import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="relative w-full max-w-4xl">
        <Image
          src="/hydra-list-4.png"
          alt="Hydra List"
          width={1200}
          height={800}
          className="w-full h-auto rounded-lg shadow-2xl"
          priority
        />
      </div>
    </div>
  );
}
