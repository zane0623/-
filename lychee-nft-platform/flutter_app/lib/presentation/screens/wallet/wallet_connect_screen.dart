import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/auth_provider.dart';

class WalletConnectScreen extends StatefulWidget {
  const WalletConnectScreen({super.key});

  @override
  State<WalletConnectScreen> createState() => _WalletConnectScreenState();
}

class _WalletConnectScreenState extends State<WalletConnectScreen> {
  final _addressController = TextEditingController();
  bool _isConnecting = false;

  @override
  void dispose() {
    _addressController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = context.watch<AuthProvider>();
    final isConnected = authProvider.user?.hasWallet ?? false;

    return Scaffold(
      appBar: AppBar(title: const Text('连接钱包')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            // 钱包图标
            Container(
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primaryContainer,
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.account_balance_wallet,
                size: 80,
                color: Theme.of(context).colorScheme.primary,
              ),
            ),
            const SizedBox(height: 32),

            if (isConnected) ...[
              // 已连接状态
              _buildConnectedView(context, authProvider),
            ] else ...[
              // 未连接状态
              _buildDisconnectedView(context),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildConnectedView(BuildContext context, AuthProvider authProvider) {
    final walletAddress = authProvider.user!.walletAddress!;

    return Column(
      children: [
        const Text(
          '钱包已连接',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          '您可以使用此钱包进行NFT交易',
          style: TextStyle(color: Colors.grey),
        ),
        const SizedBox(height: 32),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  '钱包地址',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        walletAddress,
                        style: const TextStyle(
                          fontSize: 14,
                          fontFamily: 'monospace',
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.copy, size: 20),
                      onPressed: () {
                        Clipboard.setData(ClipboardData(text: walletAddress));
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('地址已复制')),
                        );
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 24),
        SizedBox(
          width: double.infinity,
          child: OutlinedButton.icon(
            onPressed: () async {
              final confirmed = await showDialog<bool>(
                context: context,
                builder: (context) => AlertDialog(
                  title: const Text('断开钱包'),
                  content: const Text('确定要断开钱包连接吗？'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(context, false),
                      child: const Text('取消'),
                    ),
                    ElevatedButton(
                      onPressed: () => Navigator.pop(context, true),
                      child: const Text('确定'),
                    ),
                  ],
                ),
              );

              if (confirmed == true && context.mounted) {
                await context.read<AuthProvider>().disconnectWallet();
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('钱包已断开')),
                  );
                }
              }
            },
            icon: const Icon(Icons.link_off),
            label: const Text('断开钱包'),
          ),
        ),
      ],
    );
  }

  Widget _buildDisconnectedView(BuildContext context) {
    return Column(
      children: [
        const Text(
          '连接钱包',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          '连接您的Web3钱包以进行NFT交易',
          style: TextStyle(color: Colors.grey),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 32),

        // 常用钱包列表
        _buildWalletOption(
          context,
          icon: Icons.account_balance_wallet,
          name: 'MetaMask',
          description: '最流行的以太坊钱包',
          onTap: _connectMetaMask,
        ),
        const SizedBox(height: 12),
        _buildWalletOption(
          context,
          icon: Icons.account_balance,
          name: 'WalletConnect',
          description: '通过二维码连接',
          onTap: _connectWalletConnect,
        ),
        const SizedBox(height: 12),
        _buildWalletOption(
          context,
          icon: Icons.wallet,
          name: '其他钱包',
          description: '手动输入钱包地址',
          onTap: _showManualInput,
        ),
      ],
    );
  }

  Widget _buildWalletOption(
    BuildContext context, {
    required IconData icon,
    required String name,
    required String description,
    required VoidCallback onTap,
  }) {
    return Card(
      child: InkWell(
        onTap: _isConnecting ? null : onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.primaryContainer,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, size: 32),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      description,
                      style: const TextStyle(
                        fontSize: 12,
                        color: Colors.grey,
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _connectMetaMask() async {
    setState(() => _isConnecting = true);
    await Future.delayed(const Duration(seconds: 2));

    // 模拟连接成功
    final mockAddress =
        '0x${DateTime.now().millisecondsSinceEpoch.toRadixString(16).padLeft(40, '0')}';

    if (mounted) {
      final success =
          await context.read<AuthProvider>().connectWallet(mockAddress);
      setState(() => _isConnecting = false);

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('钱包连接成功！')),
        );
        context.pop();
      }
    }
  }

  Future<void> _connectWalletConnect() async {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('WalletConnect功能开发中...')),
    );
  }

  void _showManualInput() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('输入钱包地址'),
        content: TextField(
          controller: _addressController,
          decoration: const InputDecoration(
            hintText: '0x...',
            labelText: '钱包地址',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('取消'),
          ),
          ElevatedButton(
            onPressed: () async {
              final address = _addressController.text;
              if (address.isNotEmpty) {
                Navigator.pop(context);
                final success =
                    await context.read<AuthProvider>().connectWallet(address);
                if (success && mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('钱包连接成功！')),
                  );
                  context.pop();
                }
              }
            },
            child: const Text('连接'),
          ),
        ],
      ),
    );
  }
}
