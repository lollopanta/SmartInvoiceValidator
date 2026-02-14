import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Theme } from '../styles/theme';

export default function InvoiceForm({ onValidate, loading }) {
    const { t } = useTranslation();
    const [piva, setPiva] = useState('');
    const [amount, setAmount] = useState('');
    const [rate, setRate] = useState('22');
    const [total, setTotal] = useState('');

    const handleValidate = () => {
        onValidate({
            partita_iva: piva,
            imponibile: parseFloat(amount),
            aliquota_iva: parseFloat(rate),
            totale_dichiarato: parseFloat(total),
        });
    };

    const calculateTotal = () => {
        const a = parseFloat(amount) || 0;
        const r = parseFloat(rate) || 0;
        const t = a + (a * r) / 100;
        setTotal(t.toFixed(2).toString());
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('form.piva')}</Text>
                <TextInput
                    style={styles.input}
                    value={piva}
                    onChangeText={setPiva}
                    keyboardType="numeric"
                    maxLength={11}
                    placeholder={t('form.piva_placeholder')}
                />
            </View>

            <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.label}>{t('form.amount')} (€)</Text>
                    <TextInput
                        style={styles.input}
                        value={amount}
                        onChangeText={(v) => { setAmount(v); }}
                        onBlur={calculateTotal}
                        keyboardType="decimal-pad"
                        placeholder="0.00"
                    />
                </View>
                <View style={[styles.inputGroup, { width: 80 }]}>
                    <Text style={styles.label}>{t('form.rate')} (%)</Text>
                    <TextInput
                        style={styles.input}
                        value={rate}
                        onChangeText={setRate}
                        onBlur={calculateTotal}
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('form.total')} (€)</Text>
                <TextInput
                    style={styles.input}
                    value={total}
                    onChangeText={setTotal}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                />
            </View>

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleValidate}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={Theme.colors.white} />
                ) : (
                    <Text style={styles.buttonText}>{t('form.validate')}</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: Theme.spacing.md,
        backgroundColor: Theme.colors.white,
        borderRadius: Theme.radius.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inputGroup: {
        marginBottom: Theme.spacing.md,
    },
    inputRow: {
        flexDirection: 'row',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Theme.colors.text,
        marginBottom: Theme.spacing.xs,
    },
    input: {
        borderWidth: 1,
        borderColor: Theme.colors.border,
        borderRadius: Theme.radius.md,
        padding: Theme.spacing.sm,
        fontSize: 16,
        color: Theme.colors.text,
    },
    button: {
        backgroundColor: Theme.colors.primary,
        padding: Theme.spacing.md,
        borderRadius: Theme.radius.md,
        alignItems: 'center',
        marginTop: Theme.spacing.sm,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: Theme.colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
});
