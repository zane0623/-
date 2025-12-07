import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../../config/routes.dart';
import '../../providers/auth_provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('登录')),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const SizedBox(height: 32),
            Icon(Icons.agriculture,
                size: 80, color: Theme.of(context).colorScheme.primary),
            const SizedBox(height: 32),
            TextFormField(
              controller: _usernameController,
              decoration: const InputDecoration(labelText: '用户名'),
              validator: (v) => v?.isEmpty ?? true ? '请输入用户名' : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _passwordController,
              decoration: const InputDecoration(labelText: '密码'),
              obscureText: true,
              validator: (v) => v?.isEmpty ?? true ? '请输入密码' : null,
            ),
            const SizedBox(height: 32),
            Consumer<AuthProvider>(
              builder: (context, provider, child) => ElevatedButton(
                onPressed: provider.isLoading ? null : _handleLogin,
                child: provider.isLoading
                    ? const CircularProgressIndicator()
                    : const Text('登录'),
              ),
            ),
            const SizedBox(height: 16),
            TextButton(
              onPressed: () => context.push(RoutePaths.register),
              child: const Text('还没有账号？立即注册'),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;
    final success = await context
        .read<AuthProvider>()
        .login(_usernameController.text, _passwordController.text);
    if (success && mounted) {
      context.go(RoutePaths.home);
    }
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}
