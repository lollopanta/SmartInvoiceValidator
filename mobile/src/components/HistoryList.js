import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Theme } from '../styles/theme';

export default function HistoryList({ history }) {
    const { t } = useTranslation();

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <View style={styles.itemMain}>
                <Text style={styles.piva}>{item.partita_iva}</Text>
                <Text style={styles.date}>{new Date(item.created).toLocaleDateString()}</Text>
            </View>
            <View style={styles.itemSide}>
                <Text style={styles.amount}>€{(parseFloat(item.imponibile) || 0).toFixed(2)}</Text>
                <View style={[styles.badge, item.valid ? styles.badgeSuccess : styles.badgeDanger]}>
                    <Text style={styles.badgeText}>
                        {item.valid ? t('history.valid') : t('history.invalid')}
                    </Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t('history.title')}</Text>
            {history.length === 0 ? (
                <Text style={styles.empty}>{t('history.empty')}</Text>
            ) : (
                <FlatList
                    data={history}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: Theme.spacing.xl,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: Theme.colors.text,
        marginBottom: Theme.spacing.md,
        letterSpacing: -0.2,
    },
    empty: {
        textAlign: 'center',
        color: Theme.colors.muted,
        padding: Theme.spacing.xl,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Theme.colors.glass,
        padding: Theme.spacing.md,
        borderRadius: Theme.radius.md,
        marginBottom: Theme.spacing.sm,
        borderWidth: 1,
        borderColor: Theme.colors.glassBorder,
        ...Theme.shadows.light,
    },
    itemMain: {
        justifyContent: 'center',
    },
    piva: {
        fontSize: 16,
        fontWeight: '600',
        color: Theme.colors.text,
    },
    date: {
        fontSize: 12,
        color: Theme.colors.muted,
        marginTop: 2,
    },
    itemSide: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 14,
        fontWeight: '700',
        color: Theme.colors.text,
        marginBottom: 4,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 100,
    },
    badgeSuccess: {
        backgroundColor: '#e1fcef',
    },
    badgeDanger: {
        backgroundColor: '#fee7e9',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: Theme.colors.text,
        textTransform: 'uppercase',
    },
});
