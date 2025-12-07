'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

interface TraceEvent {
  id: string;
  eventType: string;
  description: string;
  timestamp: string;
  location?: string;
  operator?: string;
  txHash?: string;
}

interface TraceData {
  tokenId: number;
  productType: string;
  originBase: string;
  harvestDate: string;
  qualityGrade: string;
  quantity: string;
  events: TraceEvent[];
}

const eventIcons: Record<string, string> = {
  PLANTING: '🌱',
  GROWING: '🌿',
  HARVESTING: '🌾',
  PROCESSING: '⚙️',
  PACKAGING: '📦',
  SHIPPING: '🚚',
  DELIVERED: '✅'
};

const eventLabels: Record<string, string> = {
  PLANTING: '种植',
  GROWING: '生长',
  HARVESTING: '采收',
  PROCESSING: '加工',
  PACKAGING: '包装',
  SHIPPING: '运输',
  DELIVERED: '交付'
};

export default function TracePage({ params }: { params: { tokenId: string } }) {
  const [traceData, setTraceData] = useState<TraceData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTraceData = useCallback(async () => {
    setLoading(true);
    // 模拟数据
    const mockData: TraceData = {
      tokenId: parseInt(params.tokenId),
      productType: '阳光玫瑰葡萄',
      originBase: '云南大理',
      harvestDate: '2024-06-20',
      qualityGrade: '特级',
      quantity: '5kg',
      events: [
        {
          id: '1',
          eventType: 'PLANTING',
          description: '优选阳光玫瑰品种，在云南大理基地进行种植',
          timestamp: '2024-01-15 09:30:00',
          location: '云南省大理市洱源县',
          operator: '李农户'
        },
        {
          id: '2',
          eventType: 'GROWING',
          description: '完成施肥、灌溉、病虫害防治等日常管理',
          timestamp: '2024-03-20 14:00:00',
          location: '云南省大理市洱源县',
          operator: '李农户'
        },
        {
          id: '3',
          eventType: 'HARVESTING',
          description: '达到最佳成熟度，进行人工采摘',
          timestamp: '2024-06-20 06:00:00',
          location: '云南省大理市洱源县',
          operator: '采收团队'
        },
        {
          id: '4',
          eventType: 'PROCESSING',
          description: '进行分拣、清洗、品质检测',
          timestamp: '2024-06-20 10:00:00',
          location: '大理农产品加工中心'
        },
        {
          id: '5',
          eventType: 'PACKAGING',
          description: '真空保鲜包装，贴溯源二维码',
          timestamp: '2024-06-20 14:00:00',
          location: '大理农产品加工中心'
        },
        {
          id: '6',
          eventType: 'SHIPPING',
          description: '冷链运输，全程温度监控',
          timestamp: '2024-06-21 08:00:00',
          location: '顺丰冷链物流'
        }
      ]
    };

    setTraceData(mockData);
    setLoading(false);
  }, [params.tokenId]);

  useEffect(() => {
    loadTraceData();
  }, [loadTraceData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!traceData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-slate-400 text-lg">未找到溯源信息</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* 产品信息卡片 */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-3xl p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* 产品图片 */}
              <div className="w-full md:w-64 h-64 bg-gradient-to-br from-emerald-600/20 to-teal-600/20 rounded-2xl flex items-center justify-center">
                <span className="text-8xl">🍇</span>
              </div>

              {/* 产品信息 */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                    已验证
                  </span>
                  <span className="text-slate-400 text-sm">Token #{traceData.tokenId}</span>
                </div>

                <h1 className="text-3xl font-bold text-white mb-6">{traceData.productType}</h1>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 rounded-xl p-4">
                    <div className="text-slate-400 text-sm mb-1">产地</div>
                    <div className="text-white font-medium">{traceData.originBase}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4">
                    <div className="text-slate-400 text-sm mb-1">采收日期</div>
                    <div className="text-white font-medium">{traceData.harvestDate}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4">
                    <div className="text-slate-400 text-sm mb-1">品质等级</div>
                    <div className="text-emerald-400 font-medium">{traceData.qualityGrade}</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4">
                    <div className="text-slate-400 text-sm mb-1">数量</div>
                    <div className="text-white font-medium">{traceData.quantity}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 溯源时间线 */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            <span className="text-emerald-400">区块链</span>溯源时间线
          </h2>

          <div className="relative">
            {/* 时间线 */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-teal-500 to-slate-700" />

            {/* 事件列表 */}
            <div className="space-y-8">
              {traceData.events.map((event, index) => (
                <div key={event.id} className="relative pl-20">
                  {/* 图标 */}
                  <div className="absolute left-0 w-16 h-16 bg-slate-800 border-4 border-emerald-500 rounded-full flex items-center justify-center text-2xl">
                    {eventIcons[event.eventType]}
                  </div>

                  {/* 内容卡片 */}
                  <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:border-emerald-500/50 transition-colors">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="text-lg font-semibold text-emerald-400">
                        {eventLabels[event.eventType]}
                      </span>
                      <span className="text-slate-500 text-sm">
                        {event.timestamp}
                      </span>
                    </div>

                    <p className="text-white mb-4">{event.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                      {event.location && (
                        <span className="flex items-center gap-1">
                          📍 {event.location}
                        </span>
                      )}
                      {event.operator && (
                        <span className="flex items-center gap-1">
                          👤 {event.operator}
                        </span>
                      )}
                    </div>

                    {event.txHash && (
                      <div className="mt-4 pt-4 border-t border-slate-700/50">
                        <span className="text-slate-500 text-sm">交易哈希: </span>
                        <a
                          href={`https://polygonscan.com/tx/${event.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 text-sm hover:underline"
                        >
                          {event.txHash}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 证书下载 */}
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <button className="px-8 py-4 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30">
            下载溯源证书
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

