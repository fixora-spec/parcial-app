import { Text, View } from 'react-native';
import { Pause, Play, Square, Timer } from 'lucide-react-native';
import AppButton from '../components/atoms/AppButton';
import ScreenContainer from '../components/organisms/ScreenContainer';
import useCronometro from '../hooks/useCronometro';
import { formatearDuracion } from '../utils/fechaHora';

export default function CronometroScreen() {
  const { tiempo, enEjecucion, play, pause, stop } = useCronometro();
  const estado = enEjecucion
    ? 'En ejecución'
    : tiempo > 0
      ? 'En pausa'
      : 'Listo para iniciar';

  return (
    <ScreenContainer
      title="Cronómetro"
      subtitle="Mide el tiempo y continúa después de una pausa."
      contentClassName="justify-center"
    >
      <View className="items-center rounded-3xl border border-slate-200 bg-white px-4 py-8">
        <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-violet-100">
          <Timer size={48} color="#7c3aed" />
        </View>

        <Text className="mb-3 text-xs font-bold text-slate-500">
          TIEMPO TRANSCURRIDO
        </Text>

        <Text
          className="w-full text-center font-mono text-5xl font-bold text-violet-700"
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.6}
          accessibilityLabel={`Tiempo transcurrido: ${formatearDuracion(tiempo)}`}
        >
          {formatearDuracion(tiempo)}
        </Text>

        <Text className="mt-4 text-base font-semibold text-slate-600">
          {estado}
        </Text>
      </View>

      <View className="mt-6 gap-3">
        <AppButton
          title="Play"
          icon={Play}
          variant="success"
          onPress={play}
          disabled={enEjecucion}
          accessibilityLabel="Iniciar o continuar el cronómetro"
        />
        <AppButton
          title="Pause"
          icon={Pause}
          variant="secondary"
          onPress={pause}
          disabled={!enEjecucion}
          accessibilityLabel="Pausar el cronómetro"
        />
        <AppButton
          title="Stop"
          icon={Square}
          variant="danger"
          onPress={stop}
          accessibilityLabel="Detener y reiniciar el cronómetro"
        />
      </View>

      <Text className="mt-4 text-center text-sm leading-5 text-slate-500">
        Play inicia o continúa. Pause conserva el tiempo. Stop vuelve a cero.
      </Text>
    </ScreenContainer>
  );
}