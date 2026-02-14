import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, RefreshControl, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
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
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <View>
            <View style={styles.badgeNew}>
              <Text style={styles.badgeNewText}>{t('app.auditing')}</Text>
            </View>
            <View style={styles.titleRow}>
              <MaskedView
                style={styles.maskedViewFull}
                maskElement={
                  <Text style={styles.title}>
                    Smart <Text style={styles.title}>Invoice</Text> Validator
                  </Text>
                }
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[styles.title, { color: Theme.colors.text }]}>Smart </Text>
                  <LinearGradient
                    colors={Theme.colors.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={[styles.title, { color: 'white', opacity: 0 }]}>Invoice</Text>
                  </LinearGradient>
                  <Text style={[styles.title, { color: Theme.colors.text }]}> Validator</Text>
                </View>
              </MaskedView>
            </View>
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
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  header: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.lg,
    backgroundColor: Theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badgeNew: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(44, 123, 229, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    marginBottom: 8,
  },
  badgeNewText: {
    color: Theme.colors.primary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Theme.colors.text,
    letterSpacing: -0.5,
  },
  maskedViewFull: {
    height: 36,
    width: '100%',
  },
  subtitle: {
    fontSize: 14,
    color: Theme.colors.muted,
    marginTop: 4,
    opacity: 0.8,
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
    padding: Theme.spacing.md,
    alignItems: 'center',
    backgroundColor: Theme.colors.background,
  },
  footerText: {
    fontSize: 10,
    color: Theme.colors.muted,
  }
});
