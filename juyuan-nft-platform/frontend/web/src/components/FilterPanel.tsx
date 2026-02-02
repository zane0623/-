'use client';

import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function FilterPanel({
  isOpen,
  onClose,
  priceRange,
  onPriceRangeChange,
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange,
}: FilterPanelProps) {
  if (!isOpen) return null;

  const productTypes = ['全部', '葡萄', '橙子', '大米', '苹果'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl m-4 max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">筛选和排序</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 价格范围 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
              价格范围: ¥{priceRange[0]} - ¥{priceRange[1]}
            </label>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex gap-4">
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={priceRange[0]}
                  onChange={(e) => onPriceRangeChange([parseInt(e.target.value) || 0, priceRange[1]])}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="最低价"
                />
                <input
                  type="number"
                  min="0"
                  max="10000"
                  value={priceRange[1]}
                  onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value) || 10000])}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="最高价"
                />
              </div>
            </div>
          </div>

          {/* 产品类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
              产品类型
            </label>
            <div className="flex flex-wrap gap-2">
              {productTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => onTypeChange(type === '全部' ? '' : type)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedType === (type === '全部' ? '' : type)
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 排序 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
              排序方式
            </label>
            <div className="space-y-2">
              {[
                { value: 'popularity', label: '按热度' },
                { value: 'price-asc', label: '价格：低到高' },
                { value: 'price-desc', label: '价格：高到低' },
                { value: 'date', label: '按日期' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    sortBy === option.value
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 flex gap-3">
          <button
            onClick={() => {
              onPriceRangeChange([0, 10000]);
              onTypeChange('');
              onSortChange('popularity');
            }}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            重置
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            应用筛选
          </button>
        </div>
      </div>
    </div>
  );
}
