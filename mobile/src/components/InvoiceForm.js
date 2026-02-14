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
        padding: Theme.spacing.lg,
        backgroundColor: Theme.colors.white,
        borderRadius: Theme.radius.lg,
        borderWidth: 1,
        borderColor: Theme.colors.border,
        ...Theme.shadows.light,
    },
    inputGroup: {
        marginBottom: Theme.spacing.md,
    },
    inputRow: {
        flexDirection: 'row',
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: Theme.colors.text,
        marginBottom: Theme.spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        borderWidth: 1,
        borderColor: Theme.colors.border,
        borderRadius: Theme.radius.md,
        padding: Theme.spacing.md,
        fontSize: 16,
        color: Theme.colors.text,
        backgroundColor: '#fcfdfe',
    },
    button: {
        backgroundColor: Theme.colors.primary,
        padding: Theme.spacing.md,
        borderRadius: Theme.radius.md,
        alignItems: 'center',
        marginTop: Theme.spacing.sm,
        shadowColor: Theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: Theme.colors.white,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});
