import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface NFTCardProps {
  tokenId: string;
  productType: string;
  quantity: number;
  qualityGrade: string;
  imageUrl: string;
  price: string;
  currency: string;
  harvestDate?: string;
  originBase: string;
  status: 'available' | 'sold' | 'delivered';
}

export const NFTCard: React.FC<NFTCardProps> = ({
  tokenId,
  productType,
  quantity,
  qualityGrade,
  imageUrl,
  price,
  currency,
  harvestDate,
  originBase,
  status,
}) => {
  const statusColors = {
    available: 'bg-green-500',
    sold: 'bg-yellow-500',
    delivered: 'bg-gray-500',
  };

  const statusText = {
    available: '可购买',
    sold: '已售出',
    delivered: '已交付',
  };

  return (
    <Link href={`/nft/${tokenId}`}>
      <div className="group relative overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
        {/* 状态标签 */}
        <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-semibold text-white ${statusColors[status]}`}>
          {statusText[status]}
        </div>

        {/* 图片 */}
        <div className="relative h-64 w-full overflow-hidden bg-gray-100">
          <Image
            src={imageUrl || '/placeholder-nft.png'}
            alt={productType}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* 内容 */}
        <div className="p-6">
          {/* 产品类型 */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {productType}
          </h3>

          {/* 产品详情 */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">数量:</span>
              <span className="font-medium text-gray-900">{quantity}g</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">等级:</span>
              <span className="font-medium text-gray-900">{qualityGrade}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">产地:</span>
              <span className="font-medium text-gray-900">{originBase}</span>
            </div>
            {harvestDate && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">收获日期:</span>
                <span className="font-medium text-gray-900">
                  {new Date(harvestDate).toLocaleDateString('zh-CN')}
                </span>
              </div>
            )}
          </div>

          {/* 价格和按钮 */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">价格</p>
                <p className="text-2xl font-bold text-green-600">
                  {price} <span className="text-sm font-normal">{currency}</span>
                </p>
              </div>
              {status === 'available' && (
                <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  购买
                </button>
              )}
            </div>
          </div>

          {/* Token ID */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Token ID: <span className="font-mono">{tokenId.slice(0, 8)}...{tokenId.slice(-6)}</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NFTCard; 