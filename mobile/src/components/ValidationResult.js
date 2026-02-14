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
        ...Theme.shadows.light,
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
        fontSize: 15,
        fontWeight: '800',
        marginBottom: Theme.spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    validText: { color: Theme.colors.success },
    invalidText: { color: Theme.colors.danger },
    errorText: {
        fontSize: 14,
        color: '#991b1b',
        marginBottom: 4,
        lineHeight: 20,
    },
    warningText: {
        fontSize: 13,
        color: Theme.colors.warning,
        marginTop: 4,
        fontWeight: '600',
    },
    successText: {
        fontSize: 14,
        color: '#065f46',
        fontWeight: '600',
    }
});
