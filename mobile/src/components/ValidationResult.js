import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Theme } from '../styles/theme';

export default function ValidationResult({ result }) {
    const { t } = useTranslation();
    if (!result) return null;

    const isValid = result.ok && result.data?.valid;
    const errors = result.data?.errors || [];
    const warnings = result.data?.warnings || [];

    return (
        <View style={[styles.container, isValid ? styles.validBorder : styles.invalidBorder]}>
            <Text style={[styles.title, isValid ? styles.validText : styles.invalidText]}>
                {isValid ? t('result.valid') : t('result.invalid')}
            </Text>

            {!isValid && errors.map((err, i) => (
                <Text key={i} style={styles.errorText}>• {err}</Text>
            ))}

            {isValid && (
                <Text style={styles.successText}>{t('result.success')}</Text>
            )}

            {warnings.length > 0 && warnings.map((warn, i) => (
                <Text key={i} style={styles.warningText}>⚠️ {warn}</Text>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: Theme.spacing.md,
        padding: Theme.spacing.md,
        borderRadius: Theme.radius.md,
        backgroundColor: Theme.colors.white,
        borderLeftWidth: 4,
    },
    validBorder: {
        borderLeftColor: Theme.colors.success,
        backgroundColor: '#f0fdf4',
    },
    invalidBorder: {
        borderLeftColor: Theme.colors.danger,
        backgroundColor: '#fef2f2',
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: Theme.spacing.sm,
    },
    validText: { color: Theme.colors.success },
    invalidText: { color: Theme.colors.danger },
    errorText: {
        fontSize: 14,
        color: '#991b1b',
        marginBottom: 4,
    },
    warningText: {
        fontSize: 13,
        color: '#92400e',
        marginTop: 4,
    },
    successText: {
        fontSize: 14,
        color: '#065f46',
    }
});
