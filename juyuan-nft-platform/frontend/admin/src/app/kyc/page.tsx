'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import AdminHeader from '@/components/layout/Header';
import { 
  FileCheck, 
  User, 
  Calendar, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Download,
  MoreHorizontal,
  FileText,
  Camera,
  Shield
} from 'lucide-react';

interface KYCApplication {
  id: string;
  user: {
    name: string;
    email: string;
    wallet: string;
    avatar: string;
  };
  idType: string;
  idNumber: string;
  documents: {
    idFront: string;
    idBack: string;
    selfie: string;
  };
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  riskLevel: 'low' | 'medium' | 'high';
  submittedAt: string;
  reviewedAt?: string;
  reviewer?: string;
  rejectReason?: string;
}

const applications: KYCApplication[] = [
  {
    id: '1',
    user: { name: '张三', email: 'zhangsan@example.com', wallet: '0x1234...5678', avatar: '张' },
    idType: '身份证',
    idNumber: '310***********1234',
    documents: { idFront: '/id-front.jpg', idBack: '/id-back.jpg', selfie: '/selfie.jpg' },
    status: 'pending',
    riskLevel: 'low',
    submittedAt: '2024-01-15 14:30'
  },
  {
    id: '2',
    user: { name: '李四', email: 'lisi@example.com', wallet: '0x2345...6789', avatar: '李' },
    idType: '身份证',
    idNumber: '110***********5678',
    documents: { idFront: '/id-front.jpg', idBack: '/id-back.jpg', selfie: '/selfie.jpg' },
    status: 'reviewing',
    riskLevel: 'medium',
    submittedAt: '2024-01-15 12:00',
    reviewer: '审核员A'
  },
  {
    id: '3',
    user: { name: '王五', email: 'wangwu@example.com', wallet: '0x3456...7890', avatar: '王' },
    idType: '护照',
    idNumber: 'E********90',
    documents: { idFront: '/passport.jpg', idBack: '', selfie: '/selfie.jpg' },
    status: 'approved',
    riskLevel: 'low',
    submittedAt: '2024-01-14 10:00',
    reviewedAt: '2024-01-14 15:30',
    reviewer: '审核员B'
  },
  {
    id: '4',
    user: { name: '赵六', email: 'zhaoliu@example.com', wallet: '0x4567...8901', avatar: '赵' },
    idType: '身份证',
    idNumber: '440***********9012',
    documents: { idFront: '/id-front.jpg', idBack: '/id-back.jpg', selfie: '/selfie.jpg' },
    status: 'rejected',
    riskLevel: 'high',
    submittedAt: '2024-01-13 09:00',
    reviewedAt: '2024-01-13 16:00',
    reviewer: '审核员A',
    rejectReason: '证件照片模糊，无法识别关键信息'
  },
  {
    id: '5',
    user: { name: '钱七', email: 'qianqi@example.com', wallet: '0x5678...9012', avatar: '钱' },
    idType: '身份证',
    idNumber: '320***********3456',
    documents: { idFront: '/id-front.jpg', idBack: '/id-back.jpg', selfie: '/selfie.jpg' },
    status: 'pending',
    riskLevel: 'low',
    submittedAt: '2024-01-15 16:00'
  },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  pending: { label: '待审核', color: 'text-amber-700', bgColor: 'bg-amber-100', icon: Clock },
  reviewing: { label: '审核中', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: AlertCircle },
  approved: { label: '已通过', color: 'text-emerald-700', bgColor: 'bg-emerald-100', icon: CheckCircle },
  rejected: { label: '已拒绝', color: 'text-red-700', bgColor: 'bg-red-100', icon: XCircle },
};

const riskConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  low: { label: '低风险', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  medium: { label: '中风险', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  high: { label: '高风险', color: 'text-red-700', bgColor: 'bg-red-100' },
};

export default function KYCPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<KYCApplication | null>(null);

  const filteredApps = applications.filter(app => {
    if (selectedStatus !== 'all' && app.status !== selectedStatus) return false;
    if (searchQuery && 
        !app.user.name.includes(searchQuery) &&
        !app.user.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = [
    { label: '待审核', value: applications.filter(a => a.status === 'pending').length, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    { label: '审核中', value: applications.filter(a => a.status === 'reviewing').length, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: '今日通过', value: applications.filter(a => a.status === 'approved').length, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { label: '今日拒绝', value: applications.filter(a => a.status === 'rejected').length, color: 'text-red-600', bgColor: 'bg-red-50' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          {/* 页面标题 */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">KYC审核</h1>
              <p className="text-gray-500 mt-1">审核用户实名认证申请</p>
            </div>
            <div className="flex gap-3">
              <button className="btn-secondary btn-sm flex items-center gap-2">
                <Download className="w-4 h-4" />
                导出报表
              </button>
              <button className="btn-primary btn-sm">
                批量审核
              </button>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className={`${stat.bgColor} rounded-2xl p-6 border-0 animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* 筛选栏 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex gap-2">
                {[
                  { key: 'all', label: '全部' },
                  { key: 'pending', label: '待审核' },
                  { key: 'reviewing', label: '审核中' },
                  { key: 'approved', label: '已通过' },
                  { key: 'rejected', label: '已拒绝' },
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setSelectedStatus(item.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedStatus === item.key
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="flex-1" />
              <div className="relative min-w-[280px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索用户名或邮箱..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Filter className="w-4 h-4" />
                筛选
              </button>
            </div>
          </div>

          {/* KYC列表 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">用户信息</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">证件信息</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">提交时间</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">风险等级</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">状态</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredApps.map((app) => {
                    const status = statusConfig[app.status];
                    const risk = riskConfig[app.riskLevel];
                    const StatusIcon = status.icon;
                    
                    return (
                      <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {app.user.avatar}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{app.user.name}</p>
                              <p className="text-sm text-gray-500">{app.user.email}</p>
                              <p className="text-xs text-gray-400 font-mono">{app.user.wallet}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">{app.idType}</p>
                              <p className="text-sm text-gray-500 font-mono">{app.idNumber}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-gray-900">{app.submittedAt}</p>
                            {app.reviewedAt && (
                              <p className="text-sm text-gray-500">审核于 {app.reviewedAt}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${risk.bgColor} ${risk.color}`}>
                            <Shield className="w-3.5 h-3.5" />
                            {risk.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${status.bgColor} ${status.color}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {status.label}
                          </span>
                          {app.reviewer && (
                            <p className="text-xs text-gray-400 mt-1">by {app.reviewer}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setSelectedApp(app)}
                              className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="查看详情"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            {app.status === 'pending' && (
                              <>
                                <button className="px-3 py-1.5 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-colors">
                                  通过
                                </button>
                                <button className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors">
                                  拒绝
                                </button>
                              </>
                            )}
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <MoreHorizontal className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 详情抽屉 */}
          {selectedApp && (
            <div className="fixed inset-0 z-50 flex justify-end">
              <div 
                className="absolute inset-0 bg-black/50"
                onClick={() => setSelectedApp(null)}
              />
              <div className="relative w-full max-w-lg bg-white shadow-2xl animate-slide-in-left">
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">KYC详情</h2>
                    <button 
                      onClick={() => setSelectedApp(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <XCircle className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-auto p-6">
                    {/* 用户信息 */}
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">用户信息</h3>
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                          {selectedApp.user.avatar}
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{selectedApp.user.name}</p>
                          <p className="text-gray-500">{selectedApp.user.email}</p>
                          <p className="text-sm text-gray-400 font-mono">{selectedApp.user.wallet}</p>
                        </div>
                      </div>
                    </div>

                    {/* 证件信息 */}
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">证件信息</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-500">证件类型</span>
                          <span className="font-medium text-gray-900">{selectedApp.idType}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-500">证件号码</span>
                          <span className="font-medium text-gray-900 font-mono">{selectedApp.idNumber}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-500">风险等级</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${riskConfig[selectedApp.riskLevel].bgColor} ${riskConfig[selectedApp.riskLevel].color}`}>
                            {riskConfig[selectedApp.riskLevel].label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 证件照片 */}
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">证件照片</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="aspect-[4/3] bg-gray-100 rounded-xl flex flex-col items-center justify-center">
                          <Camera className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-xs text-gray-500">证件正面</span>
                        </div>
                        <div className="aspect-[4/3] bg-gray-100 rounded-xl flex flex-col items-center justify-center">
                          <Camera className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-xs text-gray-500">证件背面</span>
                        </div>
                        <div className="aspect-[4/3] bg-gray-100 rounded-xl flex flex-col items-center justify-center">
                          <User className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-xs text-gray-500">人脸照片</span>
                        </div>
                      </div>
                    </div>

                    {/* 审核历史 */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">审核历史</h3>
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Clock className="w-4 h-4 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">用户提交申请</p>
                            <p className="text-sm text-gray-500">{selectedApp.submittedAt}</p>
                          </div>
                        </div>
                        {selectedApp.reviewedAt && (
                          <div className="flex gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              selectedApp.status === 'approved' ? 'bg-emerald-100' : 'bg-red-100'
                            }`}>
                              {selectedApp.status === 'approved' 
                                ? <CheckCircle className="w-4 h-4 text-emerald-600" />
                                : <XCircle className="w-4 h-4 text-red-600" />
                              }
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {selectedApp.status === 'approved' ? '审核通过' : '审核拒绝'}
                              </p>
                              <p className="text-sm text-gray-500">{selectedApp.reviewedAt} by {selectedApp.reviewer}</p>
                              {selectedApp.rejectReason && (
                                <p className="text-sm text-red-600 mt-1">{selectedApp.rejectReason}</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  {selectedApp.status === 'pending' && (
                    <div className="p-6 border-t border-gray-200 flex gap-4">
                      <button className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors">
                        拒绝
                      </button>
                      <button className="flex-1 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors">
                        通过
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

