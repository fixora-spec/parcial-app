import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import AppButton from '../atoms/AppButton';

cssInterop(SafeAreaView, { className: 'style' });

export default function ScreenContainer({
  title,
  subtitle,
  children,
  showBack = true,
  scroll = true,
  contentClassName = '',
}) {
  const contenido = (
    <View
      className={[
        'px-5 pb-8',
        scroll ? 'grow' : 'flex-1',
        contentClassName,
      ].join(' ')}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar style="dark" />

      <View className="px-5 pb-5 pt-2">
        {showBack && (
          <AppButton
            title="Volver al menú"
            icon={ArrowLeft}
            variant="secondary"
            onPress={() => router.navigate('/')}
            className="mb-5 self-start"
          />
        )}

        <Text className="text-3xl font-bold text-slate-900">
          {title}
        </Text>

        {subtitle && (
          <Text className="mt-2 text-base leading-6 text-slate-600">
            {subtitle}
          </Text>
        )}
      </View>

      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {contenido}
        </ScrollView>
      ) : (
        contenido
      )}
    </SafeAreaView>
  );
}