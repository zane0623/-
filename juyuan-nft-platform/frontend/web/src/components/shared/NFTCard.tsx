'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, TrendingUp } from 'lucide-react';

interface NFTCardProps {
  nft: {
    id: number;
    name: string;
    image: string;
    description: string;
    price: string;
    quantity: number;
    sold: number;
    originBase: string;
    harvestDate: string;
    status: 'active' | 'sold_out' | 'upcoming';
  };
}

export function NFTCard({ nft }: NFTCardProps) {
  const progress = (nft.sold / nft.quantity) * 100;
  const remaining = nft.quantity - nft.sold;

  return (
    <Link href={`/nft/${nft.id}`}>
      <div className="card hover-lift transition-all duration-300 hover:shadow-2xl group">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={nft.image}
            alt={nft.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Status badge */}
          {nft.status === 'sold_out' ? (
            <div className="absolute top-4 right-4 badge badge-error">
              已售罄
            </div>
          ) : nft.status === 'upcoming' ? (
            <div className="absolute top-4 right-4 badge badge-info">
              即将开售
            </div>
          ) : (
            <div className="absolute top-4 right-4 badge badge-success">
              预售中
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {nft.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {nft.description}
          </p>

          {/* Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-primary-600" />
              {nft.originBase}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-primary-600" />
              采收日期：{nft.harvestDate}
            </div>
          </div>

          {/* Progress */}
          {nft.status === 'active' && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>销售进度</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-primary transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                剩余 {remaining} / {nft.quantity}
              </div>
            </div>
          )}

          {/* Price and CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <div className="text-xs text-gray-500 mb-1">价格</div>
              <div className="text-xl font-bold text-primary-600 flex items-center">
                {nft.price}
                <TrendingUp className="w-4 h-4 ml-1 text-green-500" />
              </div>
            </div>

            {nft.status === 'sold_out' ? (
              <button className="btn-outline opacity-50 cursor-not-allowed" disabled>
                已售罄
              </button>
            ) : nft.status === 'upcoming' ? (
              <button className="btn-outline">
                敬请期待
              </button>
            ) : (
              <button className="btn-primary">
                立即购买
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}


