'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Clock } from 'lucide-react';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'recent';
}

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // 加载最近搜索
  useEffect(() => {
    const recent = localStorage.getItem('recentSearches');
    if (recent) {
      setRecentSearches(JSON.parse(recent));
    }
  }, []);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 搜索建议（模拟数据，实际应该调用API）
  useEffect(() => {
    if (query.trim().length > 0) {
      // 模拟搜索建议
      const mockSuggestions: SearchSuggestion[] = [
        { id: '1', text: `${query} - 阳光玫瑰葡萄`, type: 'product' },
        { id: '2', text: `${query} - 赣南脐橙`, type: 'product' },
        { id: '3', text: `${query} - 五常大米`, type: 'product' },
      ];
      setSuggestions(mockSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // 保存到最近搜索
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    // 跳转到搜索结果页
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-2xl mx-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="搜索产品..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-12 pr-10 py-2.5 bg-white/10 dark:bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 搜索建议下拉 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
          {query.trim() && suggestions.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                搜索建议
              </div>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSearch(suggestion.text.split(' - ')[1] || suggestion.text)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">{suggestion.text}</span>
                </button>
              ))}
            </div>
          )}

          {!query.trim() && recentSearches.length > 0 && (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  最近搜索
                </div>
                <button
                  onClick={clearRecent}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  清除
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-gray-900 dark:text-white"
                >
                  {search}
                </button>
              ))}
            </div>
          )}

          {!query.trim() && recentSearches.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">输入关键词搜索产品</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
