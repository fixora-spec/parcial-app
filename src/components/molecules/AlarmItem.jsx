import { Text, View } from 'react-native';
import { Bell, Pencil, Trash2 } from 'lucide-react-native';
import AppButton from '../atoms/AppButton';
import { formatearFecha, formatearHora } from '../../utils/fechaHora';

export default function AlarmItem({ alarma, onEdit, onDelete }) {
  const programada = new Date(alarma.fechaHora);
  const fecha = formatearFecha(programada);
  const hora = formatearHora(programada, false);

  return (
    <View className="mb-4 rounded-2xl border border-slate-200 bg-white p-5">
      <View className="flex-row items-center">
        <View className="mr-4 h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
          <Bell size={24} color="#d97706" />
        </View>

        <View className="flex-1">
          <Text className="text-2xl font-bold text-slate-900">{hora}</Text>
          <Text className="mt-1 text-base text-slate-600">{fecha}</Text>
        </View>
      </View>

      <View className="mt-4 flex-row flex-wrap gap-3">
        <AppButton
          title="Editar"
          icon={Pencil}
          variant="secondary"
          onPress={() => onEdit(alarma)}
          accessibilityLabel={`Editar alarma del ${fecha} a las ${hora}`}
          className="min-w-[120px] flex-1"
        />
        <AppButton
          title="Eliminar"
          icon={Trash2}
          variant="danger"
          onPress={() => onDelete(alarma.id)}
          accessibilityLabel={`Eliminar alarma del ${fecha} a las ${hora}`}
          className="min-w-[120px] flex-1"
        />
      </View>
    </View>
  );
}