import 'package:flutter/foundation.dart';
import '../models/presale.dart';
import '../services/api_service.dart';

class PresaleProvider with ChangeNotifier {
  final ApiService _apiService;
  List<Presale> _presales = [];
  Presale? _selectedPresale;
  bool _isLoading = false;
  String? _error;

  PresaleProvider(this._apiService);

  List<Presale> get presales => _presales;
  Presale? get selectedPresale => _selectedPresale;
  bool get isLoading => _isLoading;
  String? get error => _error;

  List<Presale> get activePresales =>
      _presales.where((p) => p.status == 'ACTIVE').toList();

  List<Presale> get scheduledPresales =>
      _presales.where((p) => p.status == 'SCHEDULED').toList();

  Future<void> loadPresales() async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      _presales = await _apiService.getPresales();

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadPresaleById(String id) async {
    try {
      _isLoading = true;
      _error = null;
      notifyListeners();

      _selectedPresale = await _apiService.getPresaleById(id);

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  void clearSelectedPresale() {
    _selectedPresale = null;
    notifyListeners();
  }
}


