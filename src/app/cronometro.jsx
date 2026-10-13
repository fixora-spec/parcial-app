import { useState } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { Pause, Play, Square, Timer } from 'lucide-react-native';
import AppButton from '../components/atoms/AppButton';
import ScreenContainer from '../components/organisms/ScreenContainer';
import useCronometro from '../hooks/useCronometro';
import { formatearDuracion } from '../utils/fechaHora';

export default function CronometroScreen() {
  const { tiempo, enEjecucion, play, pause, stop } = useCronometro();
  const { width, height, fontScale } = useWindowDimensions();
  const [anchoContenido, setAnchoContenido] = useState(0);

  const estado = enEjecucion
    ? 'En ejecución'
    : tiempo > 0
      ? 'En pausa'
      : 'Listo para iniciar';

  const tiempoFormateado = formatearDuracion(tiempo, true);
  const ancho = anchoContenido || Math.min(520, Math.max(0, width - 40));
  const compacto = ancho < 330 || height < 640;
  const controlesEnColumna = ancho < 320 || fontScale > 1.3;

  const tamanoTiempo = Math.min(
    compacto ? 64 : 80,
    Math.max(32, (ancho - 56) / (tiempoFormateado.length * 0.62))
  );

  const colorEstado = enEjecucion
    ? 'text-emerald-700'
    : tiempo > 0
      ? 'text-amber-800'
      : 'text-slate-700';

  const colorPunto = enEjecucion
    ? 'bg-emerald-600'
    : tiempo > 0
      ? 'bg-amber-600'
      : 'bg-slate-500';

  const claseControl = [
    'min-h-[56px] rounded-2xl',
    controlesEnColumna ? 'w-full' : 'flex-1',
  ].join(' ');

  return (
    <ScreenContainer
      title="Cronómetro"
      subtitle="Mide el tiempo y continúa después de una pausa."
      scrollHeader
      contentClassName="justify-center"
    >
      <View
        className="w-full max-w-[520px] self-center"
        onLayout={({ nativeEvent }) => {
          const nuevoAncho = nativeEvent.layout.width;
          setAnchoContenido((actual) => actual === nuevoAncho ? actual : nuevoAncho);
        }}
      >
        <View
          className={[
            'rounded-[28px] border border-violet-200 bg-white',
            compacto ? 'p-5' : 'p-7',
          ].join(' ')}
        >
          <View className="flex-row items-center">
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-violet-100">
              <Timer size={24} color="#7c3aed" strokeWidth={1.8} />
            </View>
            <Text className="ml-3 flex-1 text-base font-semibold text-slate-700">
              Tiempo transcurrido
            </Text>
          </View>

          <View className={compacto ? 'mt-5' : 'mt-8'}>
            <Text
              className="w-full text-center font-mono font-bold text-violet-700"
              style={{ fontSize: tamanoTiempo }}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.35}
              accessibilityLabel={`Tiempo transcurrido: ${tiempoFormateado}`}
            >
              {tiempoFormateado}
            </Text>

            <Text className="mt-2 text-center text-xs font-medium tracking-widest text-slate-600">
              HORAS : MINUTOS : SEGUNDOS
            </Text>
          </View>

          <View className="mt-6 max-w-full self-center flex-row items-center rounded-full bg-slate-100 px-4 py-2">
            <View
              className={['h-2 w-2 shrink-0 rounded-full', colorPunto].join(' ')}
            />
            <Text
              className={[
                'ml-2 shrink text-center text-sm font-semibold',
                colorEstado,
              ].join(' ')}
              accessibilityLiveRegion="polite"
            >
              {estado}
            </Text>
          </View>
        </View>

        <View className="mt-6">
          <AppButton
            title="Play"
            icon={Play}
            variant="success"
            onPress={play}
            disabled={enEjecucion}
            accessibilityLabel="Iniciar o continuar el cronómetro"
            className="min-h-[56px] rounded-2xl"
          />

          <View
            className={[
              'mt-3 gap-3',
              controlesEnColumna ? 'flex-col' : 'flex-row',
            ].join(' ')}
          >
            <AppButton
              title="Pause"
              icon={Pause}
              variant="secondary"
              onPress={pause}
              disabled={!enEjecucion}
              accessibilityLabel="Pausar el cronómetro"
              className={claseControl}
            />
            <AppButton
              title="Stop"
              icon={Square}
              variant="danger"
              onPress={stop}
              accessibilityLabel="Detener y reiniciar el cronómetro"
              className={claseControl}
            />
          </View>
        </View>

        <View className="mt-5 rounded-2xl border border-slate-200 bg-white px-4 py-3">
          <Text className="text-center text-sm leading-6 text-slate-500">
            Play inicia o continúa. Pause conserva el tiempo. Stop vuelve a cero.
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}