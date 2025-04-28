'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { categories } from '@/types/item';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Determine if we're on a category page
  const currentCategory = categories.find(cat => 
    pathname === `/${cat.id}` || pathname.startsWith(`/${cat.id}/`)
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-primary text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image
                src="/hydra-list-2.png"
                alt="Hydra List"
                width={120}
                height={35}
                priority
                className="h-8 w-auto object-contain"
              />
            </Link>
            
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-white/30 rounded-md p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex space-x-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${category.id}`}
                  className={`hover:text-white/80 transition-colors px-3 py-2 rounded-md ${
                    pathname === `/${category.id}` || pathname.startsWith(`/${category.id}/`)
                      ? 'bg-white/20 font-bold'
                      : ''
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Mobile navigation */}
          {isMobileMenuOpen && (
            <nav className="mt-4 md:hidden">
              <div className="flex flex-col space-y-2 bg-white/10 rounded-lg p-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/${category.id}`}
                    className={`hover:bg-white/20 px-4 py-3 rounded-md transition-colors ${
                      pathname === `/${category.id}` || pathname.startsWith(`/${category.id}/`)
                        ? 'bg-white/20 font-bold'
                        : ''
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mr-3 text-xl">{category.icon}</span>
                    {category.name}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>
      
      {/* Page title */}
      {currentCategory && (
        <div className="bg-gradient-to-r from-secondary-light/10 to-primary-light/10 border-b border-color-border">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-color-text flex items-center">
              <span className="mr-3 text-2xl">{currentCategory.icon}</span>
              {currentCategory.name}
            </h1>
            <p className="text-color-text-light mt-2">{currentCategory.description}</p>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-primary-dark to-secondary-dark text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="mb-2">
                <Image
                  src="/hydra-list-2.png"
                  alt="Hydra List"
                  width={120}
                  height={35}
                  priority
                  className="h-8 w-auto object-contain"
                />
              </div>
              <p className="text-white/70">Share experiences with your partner</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${category.id}`}
                  className="hover:bg-white/10 px-3 py-2 rounded-md transition-colors"
                >
                  <span className="mr-2">{category.icon}</span>
                  <span className="hidden sm:inline">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="mt-8 text-center text-white/60 text-sm">
            <p>&copy; {new Date().getFullYear()} Hydra List. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}