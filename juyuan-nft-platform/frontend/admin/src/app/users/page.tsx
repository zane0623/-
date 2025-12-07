'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import AdminHeader from '@/components/layout/Header';

interface User {
  id: string;
  username: string;
  email: string;
  walletAddress: string;
  kycStatus: string;
  role: string;
  nftCount: number;
  createdAt: string;
}

export default function UsersPage() {
  const [users] = useState<User[]>([
    { id: '1', username: '张三', email: 'zhangsan@example.com', walletAddress: '0x1234...5678', kycStatus: 'APPROVED', role: 'USER', nftCount: 5, createdAt: '2024-01-10' },
    { id: '2', username: '李四', email: 'lisi@example.com', walletAddress: '0x2345...6789', kycStatus: 'PENDING', role: 'USER', nftCount: 3, createdAt: '2024-01-12' },
    { id: '3', username: '王五', email: 'wangwu@example.com', walletAddress: '0x3456...7890', kycStatus: 'NOT_SUBMITTED', role: 'USER', nftCount: 0, createdAt: '2024-01-15' },
    { id: '4', username: '管理员', email: 'admin@juyuan.com', walletAddress: '0x4567...8901', kycStatus: 'APPROVED', role: 'ADMIN', nftCount: 0, createdAt: '2024-01-01' },
  ]);

  const getKYCBadge = (status: string) => {
    const styles: Record<string, string> = {
      NOT_SUBMITTED: 'bg-gray-100 text-gray-800',
      PENDING: 'bg-amber-100 text-amber-800',
      APPROVED: 'bg-emerald-100 text-emerald-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    const labels: Record<string, string> = {
      NOT_SUBMITTED: '未提交',
      PENDING: '审核中',
      APPROVED: '已认证',
      REJECTED: '已拒绝'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      USER: 'bg-blue-100 text-blue-800',
      ADMIN: 'bg-purple-100 text-purple-800',
      SUPER_ADMIN: 'bg-red-100 text-red-800',
      FARMER: 'bg-green-100 text-green-800'
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[role]}`}>{role}</span>;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
              <p className="text-gray-500 mt-1">管理平台用户账户</p>
            </div>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              导出用户数据
            </button>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">总用户数</div>
              <div className="text-3xl font-bold text-gray-900">5,678</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">已认证</div>
              <div className="text-3xl font-bold text-emerald-600">4,123</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">待审核</div>
              <div className="text-3xl font-bold text-amber-600">156</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">今日新增</div>
              <div className="text-3xl font-bold text-blue-600">23</div>
            </div>
          </div>

          {/* 用户列表 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="搜索用户名、邮箱或钱包地址..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="">全部KYC状态</option>
                  <option value="APPROVED">已认证</option>
                  <option value="PENDING">审核中</option>
                  <option value="NOT_SUBMITTED">未提交</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="">全部角色</option>
                  <option value="USER">普通用户</option>
                  <option value="ADMIN">管理员</option>
                  <option value="FARMER">农户</option>
                </select>
              </div>
            </div>

            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">用户</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">钱包地址</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">KYC状态</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">角色</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">NFT数量</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">注册时间</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold">
                          {user.username.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.username}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-gray-500">{user.walletAddress}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getKYCBadge(user.kycStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900">{user.nftCount}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button className="text-emerald-600 hover:text-emerald-700 mr-3">查看</button>
                      <button className="text-blue-600 hover:text-blue-700 mr-3">编辑</button>
                      <button className="text-red-600 hover:text-red-700">禁用</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

