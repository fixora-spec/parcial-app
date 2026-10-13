import { useEffect, useState } from 'react';
import { AppState, Text, View } from 'react-native';
import { CalendarDays, Clock } from 'lucide-react-native';
import ScreenContainer from '../components/organisms/ScreenContainer';
import {
  formatearFecha,
  formatearHora,
  obtenerSaludo,
} from '../utils/fechaHora';

export default function RelojScreen() {
  const [ahora, setAhora] = useState(() => new Date());

  useEffect(() => {
    const actualizar = () => setAhora(new Date());
    const intervalo = setInterval(actualizar, 1000);

    const suscripcion = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') actualizar();
    });

    return () => {
      clearInterval(intervalo);
      suscripcion.remove();
    };
  }, []);

  return (
    <ScreenContainer
      title="Reloj digital"
      subtitle="Hora y fecha actuales de tu dispositivo."
      contentClassName="justify-center"
    >
      <View className="items-center rounded-3xl border border-slate-200 bg-white px-4 py-8">
        <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-blue-100">
          <Clock size={48} color="#2563eb" />
        </View>

        <Text className="mb-4 text-center text-2xl font-bold text-slate-900">
          {obtenerSaludo(ahora)}
        </Text>

        <Text
          className="w-full text-center font-mono text-5xl font-bold text-blue-700"
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
          accessibilityLabel={`Hora actual: ${formatearHora(ahora)}`}
        >
          {formatearHora(ahora)}
        </Text>

        <View className="mt-6 flex-row items-center">
          <CalendarDays size={20} color="#64748b" />
          <Text className="ml-2 text-lg font-semibold text-slate-600">
            {formatearFecha(ahora)}
          </Text>
        </View>

        <Text className="mt-6 text-center text-sm text-slate-500">
          Se actualiza cada segundo.
        </Text>
      </View>
    </ScreenContainer>
  );
}