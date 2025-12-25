'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import AdminHeader from '@/components/layout/Header';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { ToastContainer, showToast } from '@/components/ui/Toast';
import {
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  Ban,
  CheckCircle,
  Shield,
  Mail,
  Phone,
  Wallet,
  Calendar,
  MoreHorizontal,
  UserPlus
} from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  walletAddress: string;
  kycStatus: string;
  role: string;
  nftCount: number;
  totalSpent: number;
  status: 'active' | 'banned';
  createdAt: string;
  lastLoginAt: string;
}

const initialUsers: User[] = [
  { id: '1', username: '张三', email: 'zhangsan@example.com', phone: '138****1234', walletAddress: '0x1234...5678', kycStatus: 'APPROVED', role: 'USER', nftCount: 5, totalSpent: 2980, status: 'active', createdAt: '2024-01-10', lastLoginAt: '2024-01-15 14:30' },
  { id: '2', username: '李四', email: 'lisi@example.com', phone: '139****5678', walletAddress: '0x2345...6789', kycStatus: 'PENDING', role: 'USER', nftCount: 3, totalSpent: 1580, status: 'active', createdAt: '2024-01-12', lastLoginAt: '2024-01-15 10:20' },
  { id: '3', username: '王五', email: 'wangwu@example.com', phone: '137****9012', walletAddress: '0x3456...7890', kycStatus: 'NOT_SUBMITTED', role: 'USER', nftCount: 0, totalSpent: 0, status: 'active', createdAt: '2024-01-15', lastLoginAt: '2024-01-15 16:00' },
  { id: '4', username: '管理员', email: 'admin@juyuan.com', phone: '136****3456', walletAddress: '0x4567...8901', kycStatus: 'APPROVED', role: 'ADMIN', nftCount: 0, totalSpent: 0, status: 'active', createdAt: '2024-01-01', lastLoginAt: '2024-01-15 09:00' },
  { id: '5', username: '赵六', email: 'zhaoliu@example.com', phone: '135****7890', walletAddress: '0x5678...9012', kycStatus: 'REJECTED', role: 'USER', nftCount: 1, totalSpent: 299, status: 'banned', createdAt: '2024-01-08', lastLoginAt: '2024-01-12 18:00' },
];

const kycStatusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  NOT_SUBMITTED: { label: '未提交', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  PENDING: { label: '审核中', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  APPROVED: { label: '已认证', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  REJECTED: { label: '已拒绝', color: 'text-red-700', bgColor: 'bg-red-100' }
};

const roleConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  USER: { label: '普通用户', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  ADMIN: { label: '管理员', color: 'text-purple-700', bgColor: 'bg-purple-100' },
  SUPER_ADMIN: { label: '超级管理员', color: 'text-red-700', bgColor: 'bg-red-100' },
  FARMER: { label: '农户', color: 'text-green-700', bgColor: 'bg-green-100' }
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKyc, setSelectedKyc] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [banUser, setBanUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 新用户表单
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    phone: '',
    role: 'USER',
  });

  const filteredUsers = users.filter(user => {
    if (searchQuery && 
        !user.username.includes(searchQuery) &&
        !user.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !user.walletAddress.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedKyc && user.kycStatus !== selectedKyc) return false;
    if (selectedRole && user.role !== selectedRole) return false;
    return true;
  });

  const stats = [
    { label: '总用户数', value: users.length },
    { label: '已认证', value: users.filter(u => u.kycStatus === 'APPROVED').length },
    { label: '待审核', value: users.filter(u => u.kycStatus === 'PENDING').length },
    { label: '今日新增', value: 23 },
  ];

  // 添加用户
  const handleAddUser = async () => {
    if (!newUser.username || !newUser.email) {
      showToast.warning('请填写必填项', '用户名和邮箱不能为空');
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: `${Date.now()}`,
      ...newUser,
      walletAddress: '',
      kycStatus: 'NOT_SUBMITTED',
      nftCount: 0,
      totalSpent: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      lastLoginAt: '-',
    };
    
    setUsers(prev => [user, ...prev]);
    showToast.success('添加成功', `用户 ${newUser.username} 已创建`);
    setShowAddModal(false);
    setNewUser({ username: '', email: '', phone: '', role: 'USER' });
    setIsLoading(false);
  };

  // 编辑用户
  const handleEditUser = async () => {
    if (!editUser) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUsers(prev => prev.map(u => u.id === editUser.id ? editUser : u));
    showToast.success('保存成功', `用户 ${editUser.username} 信息已更新`);
    setEditUser(null);
    setIsLoading(false);
  };

  // 禁用/启用用户
  const handleToggleBan = async () => {
    if (!banUser) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newStatus = banUser.status === 'active' ? 'banned' : 'active';
    setUsers(prev => prev.map(u => 
      u.id === banUser.id ? { ...u, status: newStatus as 'active' | 'banned' } : u
    ));
    showToast.success(
      newStatus === 'banned' ? '已禁用' : '已启用',
      `用户 ${banUser.username} ${newStatus === 'banned' ? '已被禁用' : '已恢复正常'}`
    );
    setBanUser(null);
    setIsLoading(false);
  };

  // 删除用户
  const handleDeleteUser = async () => {
    if (!deleteUser) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUsers(prev => prev.filter(u => u.id !== deleteUser.id));
    showToast.success('删除成功', `用户 ${deleteUser.username} 已删除`);
    setDeleteUser(null);
    setIsLoading(false);
  };

  // 导出用户
  const handleExport = () => {
    const csv = [
      ['用户名', '邮箱', '手机', 'KYC状态', '角色', 'NFT数量', '消费金额', '注册时间'].join(','),
      ...filteredUsers.map(u => [
        u.username,
        u.email,
        u.phone,
        kycStatusConfig[u.kycStatus].label,
        roleConfig[u.role].label,
        u.nftCount,
        u.totalSpent,
        u.createdAt
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    showToast.success('导出成功', `已导出 ${filteredUsers.length} 条用户数据`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <ToastContainer />
        
        <main className="flex-1 overflow-auto p-6">
          {/* 页面标题 */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
              <p className="text-gray-500 mt-1">管理平台用户账户</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleExport}
                className="btn-secondary btn-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                导出
              </button>
              <button 
                onClick={() => setShowAddModal(true)}
                className="btn-primary btn-sm flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                添加用户
              </button>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* 搜索和筛选 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[280px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索用户名、邮箱或钱包地址..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <select 
                value={selectedKyc}
                onChange={(e) => setSelectedKyc(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">全部KYC状态</option>
                <option value="APPROVED">已认证</option>
                <option value="PENDING">审核中</option>
                <option value="NOT_SUBMITTED">未提交</option>
                <option value="REJECTED">已拒绝</option>
              </select>
              <select 
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">全部角色</option>
                <option value="USER">普通用户</option>
                <option value="ADMIN">管理员</option>
                <option value="FARMER">农户</option>
              </select>
            </div>
          </div>

          {/* 用户列表 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">用户</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">钱包地址</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">KYC状态</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">角色</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">NFT/消费</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">注册时间</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={`hover:bg-gray-50 ${user.status === 'banned' ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                          user.status === 'banned' ? 'bg-gray-400' : 'bg-gradient-to-br from-emerald-500 to-teal-500'
                        }`}>
                          {user.username.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{user.username}</span>
                            {user.status === 'banned' && (
                              <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded">已禁用</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-gray-500">{user.walletAddress || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${kycStatusConfig[user.kycStatus].bgColor} ${kycStatusConfig[user.kycStatus].color}`}>
                        {kycStatusConfig[user.kycStatus].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleConfig[user.role].bgColor} ${roleConfig[user.role].color}`}>
                        {roleConfig[user.role].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className="text-gray-900">{user.nftCount} NFT</span>
                        <span className="text-gray-400 mx-1">|</span>
                        <span className="text-emerald-600">¥{user.totalSpent}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setDetailUser(user)}
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="查看"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setEditUser({...user})}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="编辑"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setBanUser(user)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.status === 'banned' 
                              ? 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                              : 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                          }`}
                          title={user.status === 'banned' ? '启用' : '禁用'}
                        >
                          {user.status === 'banned' ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => setDeleteUser(user)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* 添加用户弹窗 */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="添加用户"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">用户名 *</label>
            <input
              type="text"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
              placeholder="请输入用户名"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">邮箱 *</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
              placeholder="请输入邮箱"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">手机号</label>
            <input
              type="tel"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
              placeholder="请输入手机号"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">角色</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
            >
              <option value="USER">普通用户</option>
              <option value="FARMER">农户</option>
              <option value="ADMIN">管理员</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowAddModal(false)}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleAddUser}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? '创建中...' : '创建用户'}
            </button>
          </div>
        </div>
      </Modal>

      {/* 用户详情弹窗 */}
      <Modal
        isOpen={!!detailUser}
        onClose={() => setDetailUser(null)}
        title="用户详情"
        size="md"
      >
        {detailUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {detailUser.username.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{detailUser.username}</h3>
                <p className="text-gray-500">{detailUser.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <Phone className="w-4 h-4" />
                  手机号
                </div>
                <p className="font-medium">{detailUser.phone || '-'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <Wallet className="w-4 h-4" />
                  钱包地址
                </div>
                <p className="font-medium font-mono text-sm">{detailUser.walletAddress || '-'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <Shield className="w-4 h-4" />
                  KYC状态
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${kycStatusConfig[detailUser.kycStatus].bgColor} ${kycStatusConfig[detailUser.kycStatus].color}`}>
                  {kycStatusConfig[detailUser.kycStatus].label}
                </span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <Calendar className="w-4 h-4" />
                  注册时间
                </div>
                <p className="font-medium">{detailUser.createdAt}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-emerald-600">{detailUser.nftCount}</p>
                <p className="text-sm text-emerald-700">持有 NFT</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-blue-600">¥{detailUser.totalSpent}</p>
                <p className="text-sm text-blue-700">累计消费</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 编辑用户弹窗 */}
      <Modal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        title="编辑用户"
        size="md"
      >
        {editUser && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
              <input
                type="text"
                value={editUser.username}
                onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
              <input
                type="email"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">手机号</label>
              <input
                type="tel"
                value={editUser.phone}
                onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">角色</label>
              <select
                value={editUser.role}
                onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
              >
                <option value="USER">普通用户</option>
                <option value="FARMER">农户</option>
                <option value="ADMIN">管理员</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setEditUser(null)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleEditUser}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? '保存中...' : '保存更改'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* 禁用/启用确认 */}
      <ConfirmDialog
        isOpen={!!banUser}
        onClose={() => setBanUser(null)}
        onConfirm={handleToggleBan}
        title={banUser?.status === 'banned' ? '启用用户' : '禁用用户'}
        message={banUser?.status === 'banned' 
          ? `确定要启用用户 ${banUser?.username} 吗？`
          : `确定要禁用用户 ${banUser?.username} 吗？禁用后该用户将无法登录。`
        }
        type={banUser?.status === 'banned' ? 'success' : 'warning'}
        confirmText={banUser?.status === 'banned' ? '确认启用' : '确认禁用'}
        loading={isLoading}
      />

      {/* 删除确认 */}
      <ConfirmDialog
        isOpen={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={handleDeleteUser}
        title="删除用户"
        message={`确定要删除用户 ${deleteUser?.username} 吗？此操作不可撤销。`}
        type="danger"
        confirmText="确认删除"
        loading={isLoading}
      />
    </div>
  );
}
