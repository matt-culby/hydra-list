import Link from "next/link";
import { categories } from "@/types/item";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-4xl font-bold text-white-800 mb-4">
          Welcome to Hydra
        </h1>
        <p className="text-xl text-white-600">
          Share and track experiences with your partner. Create lists, rate
          activities, and discover new adventures together.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        {categories.map((category) => (
          <Link key={category.id} href={`/${category.id}`} className="group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg border border-gray-200 h-full">
              <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                <span className="text-6xl">{category.icon}</span>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
