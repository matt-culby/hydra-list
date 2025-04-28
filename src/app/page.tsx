import Link from 'next/link';
import { categories } from '@/types/item';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Hydra List</h1>
        <p className="text-xl text-gray-600">
          Share and track experiences with your partner. Create lists, rate activities, and discover new adventures together.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        {categories.map((category) => (
          <Link 
            key={category.id}
            href={`/${category.id}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg border border-gray-200 h-full">
              <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                <span className="text-6xl">{category.icon}</span>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h2>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-16 max-w-4xl w-full bg-gray-50 rounded-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl mb-4">
              1
            </div>
            <h3 className="text-lg font-semibold mb-2">Create Lists</h3>
            <p className="text-gray-600">Add restaurants, travel destinations, and more to your shared lists.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-2xl mb-4">
              2
            </div>
            <h3 className="text-lg font-semibold mb-2">Experience Together</h3>
            <p className="text-gray-600">Use the random picker to choose your next adventure.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl mb-4">
              3
            </div>
            <h3 className="text-lg font-semibold mb-2">Rate & Review</h3>
            <p className="text-gray-600">Keep track of your experiences with ratings and notes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
