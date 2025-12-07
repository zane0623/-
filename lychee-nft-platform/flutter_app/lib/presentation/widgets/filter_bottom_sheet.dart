import 'package:flutter/material.dart';

/// 筛选条件
class FilterOptions {
  String? category;
  double? minPrice;
  double? maxPrice;
  String? sortBy;
  bool? onlyAvailable;

  FilterOptions({
    this.category,
    this.minPrice,
    this.maxPrice,
    this.sortBy,
    this.onlyAvailable,
  });

  FilterOptions copyWith({
    String? category,
    double? minPrice,
    double? maxPrice,
    String? sortBy,
    bool? onlyAvailable,
  }) {
    return FilterOptions(
      category: category ?? this.category,
      minPrice: minPrice ?? this.minPrice,
      maxPrice: maxPrice ?? this.maxPrice,
      sortBy: sortBy ?? this.sortBy,
      onlyAvailable: onlyAvailable ?? this.onlyAvailable,
    );
  }
}

/// 筛选底部表单
class FilterBottomSheet extends StatefulWidget {
  final FilterOptions? initialOptions;
  final ValueChanged<FilterOptions> onApply;

  const FilterBottomSheet({
    super.key,
    this.initialOptions,
    required this.onApply,
  });

  @override
  State<FilterBottomSheet> createState() => _FilterBottomSheetState();
}

class _FilterBottomSheetState extends State<FilterBottomSheet> {
  late FilterOptions _options;

  final List<String> _categories = [
    '全部',
    '恐龙蛋荔枝',
    '桂味荔枝',
    '糯米糍',
    '妃子笑',
  ];

  final List<String> _sortOptions = [
    '默认排序',
    '价格从低到高',
    '价格从高到低',
    '最新发布',
  ];

  @override
  void initState() {
    super.initState();
    _options = widget.initialOptions ?? FilterOptions();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Theme.of(context).scaffoldBackgroundColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 标题栏
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                '筛选条件',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextButton(
                onPressed: _resetFilters,
                child: const Text('重置'),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // 分类
          const Text(
            '分类',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _categories.map((category) {
              final isSelected = _options.category == category ||
                  (category == '全部' && _options.category == null);
              return FilterChip(
                label: Text(category),
                selected: isSelected,
                onSelected: (selected) {
                  setState(() {
                    _options.category = category == '全部' ? null : category;
                  });
                },
              );
            }).toList(),
          ),
          const SizedBox(height: 24),

          // 排序
          const Text(
            '排序方式',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _sortOptions.map((sort) {
              final isSelected = _options.sortBy == sort ||
                  (sort == '默认排序' && _options.sortBy == null);
              return ChoiceChip(
                label: Text(sort),
                selected: isSelected,
                onSelected: (selected) {
                  setState(() {
                    _options.sortBy = sort == '默认排序' ? null : sort;
                  });
                },
              );
            }).toList(),
          ),
          const SizedBox(height: 24),

          // 价格范围
          const Text(
            '价格范围 (ETH)',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: TextField(
                  decoration: const InputDecoration(
                    hintText: '最低价',
                    isDense: true,
                  ),
                  keyboardType: TextInputType.number,
                  onChanged: (value) {
                    _options.minPrice = double.tryParse(value);
                  },
                ),
              ),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 8),
                child: Text('-'),
              ),
              Expanded(
                child: TextField(
                  decoration: const InputDecoration(
                    hintText: '最高价',
                    isDense: true,
                  ),
                  keyboardType: TextInputType.number,
                  onChanged: (value) {
                    _options.maxPrice = double.tryParse(value);
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // 仅显示有货
          SwitchListTile(
            title: const Text('仅显示有货'),
            value: _options.onlyAvailable ?? false,
            onChanged: (value) {
              setState(() {
                _options.onlyAvailable = value;
              });
            },
            contentPadding: EdgeInsets.zero,
          ),
          const SizedBox(height: 24),

          // 应用按钮
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                widget.onApply(_options);
                Navigator.pop(context);
              },
              child: const Text('应用筛选'),
            ),
          ),
        ],
      ),
    );
  }

  void _resetFilters() {
    setState(() {
      _options = FilterOptions();
    });
  }
}

/// 显示筛选底部表单
void showFilterBottomSheet(
  BuildContext context, {
  FilterOptions? initialOptions,
  required ValueChanged<FilterOptions> onApply,
}) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (context) => FilterBottomSheet(
      initialOptions: initialOptions,
      onApply: onApply,
    ),
  );
}
