import { Pressable, Text, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

const TONOS = {
  blue: {
    fondo: 'bg-blue-100',
    texto: 'text-blue-700',
    icono: '#2563eb',
  },
  amber: {
    fondo: 'bg-amber-100',
    texto: 'text-amber-700',
    icono: '#d97706',
  },
  violet: {
    fondo: 'bg-violet-100',
    texto: 'text-violet-700',
    icono: '#7c3aed',
  },
};

export default function ExerciseCard({
  number,
  title,
  description,
  icon: Icon,
  onPress,
  tone = 'blue',
}) {
  const colores = TONOS[tone] ?? TONOS.blue;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={description}
      className="mb-4 min-h-[112px] rounded-2xl border border-slate-200 bg-white p-5 active:bg-slate-100"
    >
      <View className="flex-row items-center">
        <View
          className={[
            'h-14 w-14 items-center justify-center rounded-2xl',
            colores.fondo,
          ].join(' ')}
        >
          {Icon && (
            <Icon size={28} color={colores.icono} strokeWidth={2} />
          )}
        </View>

        <View className="mx-4 flex-1">
          <Text
            className={['text-xs font-bold', colores.texto].join(' ')}
          >
            EJERCICIO {String(number).padStart(2, '0')}
          </Text>

          <Text className="mt-1 text-xl font-bold text-slate-900">
            {title}
          </Text>

          <Text className="mt-2 text-sm leading-5 text-slate-600">
            {description}
          </Text>
        </View>

        <ChevronRight size={22} color="#94a3b8" />
      </View>
    </Pressable>
  );
}