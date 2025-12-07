'use client';

const products = [
  { 
    name: '恐龙蛋荔枝', 
    sold: 750, 
    revenue: '75 ETH',
    progress: 75,
    trend: '+12%'
  },
  { 
    name: '有机大米', 
    sold: 500, 
    revenue: '25 ETH',
    progress: 50,
    trend: '+8%'
  },
  { 
    name: '普洱茶', 
    sold: 320, 
    revenue: '48 ETH',
    progress: 64,
    trend: '+15%'
  },
  { 
    name: '阳澄湖大闸蟹', 
    sold: 200, 
    revenue: '40 ETH',
    progress: 100,
    trend: '售罄'
  },
  { 
    name: '东北黑木耳', 
    sold: 180, 
    revenue: '9 ETH',
    progress: 30,
    trend: '+5%'
  },
];

export function TopProducts() {
  return (
    <div className="space-y-4">
      {products.map((product, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-semibold">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-gray-900 truncate">
                {product.name}
              </span>
              <span className={`text-sm ${product.trend === '售罄' ? 'text-red-600' : 'text-green-600'}`}>
                {product.trend}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${product.progress === 100 ? 'bg-red-500' : 'bg-green-500'} rounded-full transition-all`}
                    style={{ width: `${product.progress}%` }}
                  />
                </div>
              </div>
              <div className="text-sm text-gray-500 w-20 text-right">
                {product.sold} 份
              </div>
              <div className="text-sm font-medium text-gray-900 w-20 text-right">
                {product.revenue}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

