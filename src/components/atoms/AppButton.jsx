import { Pressable, Text } from 'react-native';

const VARIANTES = {
  primary: {
    fondo: 'bg-blue-600 active:bg-blue-700',
    texto: 'text-white',
    icono: '#ffffff',
  },
  secondary: {
    fondo: 'bg-slate-200 active:bg-slate-300',
    texto: 'text-slate-900',
    icono: '#0f172a',
  },
  success: {
    fondo: 'bg-emerald-600 active:bg-emerald-700',
    texto: 'text-white',
    icono: '#ffffff',
  },
  danger: {
    fondo: 'bg-rose-600 active:bg-rose-700',
    texto: 'text-white',
    icono: '#ffffff',
  },
};

export default function AppButton({
  title,
  onPress,
  icon: Icon,
  variant = 'primary',
  disabled = false,
  className = '',
  accessibilityLabel,
}) {
  const colores = VARIANTES[variant] ?? VARIANTES.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled }}
      className={`min-h-[48px] flex-row items-center justify-center rounded-xl px-4 py-3 ${colores.fondo} ${disabled ? 'opacity-40' : ''} ${className}`}
    >
      {Icon && (
        <Icon size={20} color={colores.icono} strokeWidth={2} />
      )}

      <Text
        className={`text-base font-semibold ${colores.texto} ${Icon ? 'ml-2' : ''}`}
      >
        {title}
      </Text>
    </Pressable>
  );
}