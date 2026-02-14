import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, Text, TouchableOpacity, RefreshControl, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import './src/locales/i18n';
import { Theme } from './src/styles/theme';
import InvoiceForm from './src/components/InvoiceForm';
import ValidationResult from './src/components/ValidationResult';
import HistoryList from './src/components/HistoryList';
import { validateInvoice, getValidationHistory } from './src/services/api';

export default function App() {
  const { t, i18n } = useTranslation();
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    const data = await getValidationHistory();
    setHistory(data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleValidate = async (payload) => {
    setLoading(true);
    setResult(null);
    const res = await validateInvoice(payload);
    setLoading(false);
    setResult(res);
    if (res.ok) {
      fetchHistory();
    }
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'it' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Smart <Text style={styles.titleAccent}>Invoice</Text></Text>
          <Text style={styles.subtitle}>{t('app.subtitle')}</Text>
        </View>
        <TouchableOpacity style={styles.langButton} onPress={toggleLanguage}>
          <Text style={styles.langButtonText}>{i18n.language.toUpperCase()}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} color={Theme.colors.primary} />
        }
      >
        <InvoiceForm onValidate={handleValidate} loading={loading} />

        <ValidationResult result={result} />

        <HistoryList history={history} />
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 SmartInvoiceValidator</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Theme.colors.text,
  },
  titleAccent: {
    color: Theme.colors.primary,
  },
  subtitle: {
    fontSize: 12,
    color: Theme.colors.muted,
    marginTop: 2,
  },
  langButton: {
    backgroundColor: 'rgba(44, 123, 229, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  langButtonText: {
    color: Theme.colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  scrollContent: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.xl * 2,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Theme.spacing.md,
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
  },
  footerText: {
    fontSize: 10,
    color: Theme.colors.muted,
  }
});
