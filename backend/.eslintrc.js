module.exports = {
  plugins: ['import'],
  rules: {
    'import/no-unresolved': 'error', // Ловит несуществующие импорты
    'import/extensions': ['error', 'never'] // Проверяет расширения файлов
  },
  settings: {
    'import/resolver': {
      typescript: {} // Использует paths из tsconfig.json
    }
  }
}