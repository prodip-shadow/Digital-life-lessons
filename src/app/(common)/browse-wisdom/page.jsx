"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/card/card';
import { MdSearch } from 'react-icons/md';
import Loader from '@/components/loader/loader';

export default function BrowseWisdom() {
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('Newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetch('/api/lessons')
      .then(res => res.json())
      .then(data => {
        setLessons(data);
        setFilteredLessons(data);
      })
      .catch(err => console.error("Failed to fetch browse lessons", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...lessons];
    if (category !== 'All Categories') {
      result = result.filter(lesson => lesson.category === category);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(lesson => {
        const authorName = typeof lesson.author === 'object' && lesson.author !== null 
          ? lesson.author.name 
          : lesson.author || '';
        return (
          lesson.title.toLowerCase().includes(q) || 
          authorName.toLowerCase().includes(q) ||
          lesson.category.toLowerCase().includes(q)
        );
      });
    }

    // Apply sorting
    if (sortBy === 'Newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'Most Saved') {
      result.sort((a, b) => {
        const aFav = a.favoritesBy?.length || parseInt(a.stats?.bookmarks) || 0;
        const bFav = b.favoritesBy?.length || parseInt(b.stats?.bookmarks) || 0;
        return bFav - aFav;
      });
    }

    setFilteredLessons(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, category, lessons, sortBy]);

  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleLessons = filteredLessons.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <header className="bg-surface-container-low border-b border-white/5 py-12">
        <div className="px-4 md:px-8 lg:px-12 xl:px-24 max-w-[1600px] mx-auto w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-text-heading mb-2">Browse Wisdom</h1>
            <p className="font-sans text-base text-text-body">Discover lessons from diverse lives and perspectives.</p>
          </div>
          <div className="w-full md:w-auto md:flex-1 min-w-[250px] max-w-md relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg" />
            <input 
              type="text" 
              placeholder="Search by topic, author, or keyword..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full bg-bg-card border-white/10 pl-10 focus:border-primary-container focus:outline-none" 
            />
          </div>
        </div>
      </header>

      {/* Filters & Content */}
      <main className="py-12">
        <div className="px-4 md:px-8 lg:px-12 xl:px-24 max-w-[1600px] mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select select-bordered w-full md:w-auto bg-bg-card border-white/10 focus:border-primary-container focus:outline-none"
              >
                <option>All Categories</option>
                <option>Mindset</option>
                <option>Career</option>
                <option>Relationships</option>
                <option>Productivity</option>
                <option>Stoicism</option>
                <option>Health</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest mr-2 hidden md:inline">SORT BY:</span>
              <button 
                onClick={() => setSortBy('Newest')}
                className={`btn btn-sm ${sortBy === 'Newest' ? 'btn-primary' : 'btn-outline border-white/10 text-on-surface hover:bg-white/5 hover:text-on-surface'}`}
              >
                Newest
              </button>
              <button 
                onClick={() => setSortBy('Most Saved')}
                className={`btn btn-sm ${sortBy === 'Most Saved' ? 'btn-primary' : 'btn-outline border-white/10 text-on-surface hover:bg-white/5 hover:text-on-surface'}`}
              >
                Most Saved
              </button>
            </div>
          </div>

          {loading ? (
            <Loader message="Gathering digital wisdom..." />
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ staggerChildren: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {visibleLessons.map((lesson, idx) => (
                <motion.div key={lesson.id || idx} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="h-full">
                  <Card {...lesson} />
                </motion.div>
              ))}
              {visibleLessons.length === 0 && (
                <div className="col-span-full py-12 text-center text-on-surface-variant font-sans">
                  No lessons found matching your filters.
                </div>
              )}
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-16 pb-12">
              <div className="join">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="join-item btn bg-transparent border-white/10 hover:bg-white/5 text-on-surface disabled:opacity-50"
                >«</button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`join-item btn ${currentPage === page ? 'bg-primary border-primary text-white hover:bg-primary/90' : 'bg-transparent border-white/10 hover:bg-white/5 text-on-surface'}`}
                  >
                    {page}
                  </button>
                ))}
                
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="join-item btn bg-transparent border-white/10 hover:bg-white/5 text-on-surface disabled:opacity-50"
                >»</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
