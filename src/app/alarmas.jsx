import { useRef, useState } from 'react';
import { Alert, FlatList, Modal, Platform, Text, View } from 'react-native';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { BellOff, CalendarDays, Clock, Plus, Save, X } from 'lucide-react-native';
import AppButton from '../components/atoms/AppButton';
import AlarmItem from '../components/molecules/AlarmItem';
import ScreenContainer from '../components/organisms/ScreenContainer';
import { useAlarmas } from '../context/AlarmasContext';
import {
  esFechaValida,
  formatearFecha,
  formatearHora,
} from '../utils/fechaHora';

export default function AlarmasScreen() {
  const { alarmas, guardarAlarma, eliminarAlarma } = useAlarmas();
  const [fecha, setFecha] = useState(null);
  const [hora, setHora] = useState(null);
  const [idEditando, setIdEditando] = useState(null);
  const [selectorIOS, setSelectorIOS] = useState(null);
  const listaRef = useRef(null);

  function limpiarFormulario() {
    setFecha(null);
    setHora(null);
    setIdEditando(null);
    setSelectorIOS(null);
  }

  function aplicarSeleccion(modo, seleccionada) {
    if (!esFechaValida(seleccionada)) return;
    const copia = new Date(seleccionada.getTime());
    if (modo === 'date') setFecha(copia);
    else setHora(copia);
  }

  function abrirSelector(modo) {
    const seleccion = modo === 'date' ? fecha : hora;
    const valor = seleccion
      ? new Date(seleccion.getTime())
      : new Date(Date.now() + (modo === 'time' ? 60000 : 0));

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: valor,
        mode: modo,
        is24Hour: true,
        onValueChange: (_evento, seleccionada) => {
          aplicarSeleccion(modo, seleccionada);
        },
      });
      return;
    }

    setSelectorIOS({ modo, valor });
  }

  function guardar() {
    const resultado = guardarAlarma(fecha, hora, idEditando);

    if (!resultado.valida) {
      Alert.alert('Revisa los datos', resultado.mensaje);
      return;
    }

    limpiarFormulario();
    Alert.alert('Alarma guardada', resultado.mensaje);
  }

  function editar(alarma) {
    setFecha(new Date(alarma.fechaHora));
    setHora(new Date(alarma.fechaHora));
    setIdEditando(alarma.id);
    listaRef.current?.scrollToOffset({ offset: 0, animated: true });
  }

  function confirmarEliminar(id) {
    const alarma = alarmas.find((item) => item.id === id);
    if (!alarma) return;
    const programada = new Date(alarma.fechaHora);

    Alert.alert(
      'Eliminar alarma',
      `¿Eliminar la alarma del ${formatearFecha(programada)} a las ${formatearHora(programada, false)}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const resultado = eliminarAlarma(id);
            if (!resultado.valida) {
              Alert.alert('No se pudo eliminar', resultado.mensaje);
              return;
            }
            if (idEditando === id) limpiarFormulario();
          },
        },
      ]
    );
  }

  const formulario = (
    <View>
      <View className="rounded-2xl border border-slate-200 bg-white p-5">
        <Text className="mb-4 text-xl font-bold text-slate-900">
          {idEditando ? 'Editar alarma' : 'Nueva alarma'}
        </Text>

        <Text className="mb-2 text-sm font-semibold text-slate-600">Fecha</Text>
        <AppButton
          title={fecha ? formatearFecha(fecha) : 'Seleccionar fecha'}
          icon={CalendarDays}
          variant="secondary"
          onPress={() => abrirSelector('date')}
        />

        <Text className="mb-2 mt-4 text-sm font-semibold text-slate-600">Hora</Text>
        <AppButton
          title={hora ? formatearHora(hora, false) : 'Seleccionar hora'}
          icon={Clock}
          variant="secondary"
          onPress={() => abrirSelector('time')}
        />

        <AppButton
          title={idEditando ? 'Guardar cambios' : 'Registrar alarma'}
          icon={idEditando ? Save : Plus}
          onPress={guardar}
          className="mt-5"
        />

        {idEditando !== null && (
          <AppButton
            title="Cancelar edición"
            icon={X}
            variant="secondary"
            onPress={limpiarFormulario}
            className="mt-3"
          />
        )}
      </View>

      <Text className="mb-1 mt-6 text-xl font-bold text-slate-900">
        Alarmas registradas ({alarmas.length})
      </Text>
      <Text className="mb-4 text-sm text-slate-500">
        Ordenadas desde la fecha más próxima hasta la más lejana.
      </Text>
    </View>
  );

  return (
    <>
      <ScreenContainer
        title="Gestión de alarmas"
        subtitle="Selecciona la fecha y la hora para registrar una alarma."
        scroll={false}
      >
        <FlatList
          ref={listaRef}
          data={alarmas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AlarmItem
              alarma={item}
              onEdit={editar}
              onDelete={confirmarEliminar}
            />
          )}
          ListHeaderComponent={formulario}
          ListEmptyComponent={
            <View className="items-center rounded-2xl border border-dashed border-slate-300 p-6">
              <BellOff size={32} color="#94a3b8" />
              <Text className="mt-3 text-center text-base text-slate-500">
                Todavía no tienes alarmas registradas.
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </ScreenContainer>

      <Modal
        visible={selectorIOS !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectorIOS(null)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="rounded-t-3xl bg-white p-5 pb-10">
            <Text className="mb-4 text-xl font-bold text-slate-900">
              {selectorIOS?.modo === 'date' ? 'Seleccionar fecha' : 'Seleccionar hora'}
            </Text>

            {selectorIOS && (
              <DateTimePicker
                value={selectorIOS.valor}
                mode={selectorIOS.modo}
                display="spinner"
                themeVariant="light"
                onValueChange={(_evento, seleccionada) => {
                  if (!esFechaValida(seleccionada)) return;
                  setSelectorIOS((actual) => actual
                    ? { ...actual, valor: seleccionada }
                    : null
                  );
                }}
              />
            )}

            <AppButton
              title="Confirmar selección"
              onPress={() => {
                if (!selectorIOS) return;
                aplicarSeleccion(selectorIOS.modo, selectorIOS.valor);
                setSelectorIOS(null);
              }}
              className="mt-4"
            />
            <AppButton
              title="Cancelar"
              variant="secondary"
              onPress={() => setSelectorIOS(null)}
              className="mt-3"
            />
          </View>
        </View>
      </Modal>
    </>
  );
}