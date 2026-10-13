import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { AlarmClock, Clock, Timer } from 'lucide-react-native';
import ScreenContainer from '../components/organisms/ScreenContainer';
import ExerciseCard from '../components/molecules/ExerciseCard';

const EJERCICIOS = [
  {
    number: 1,
    title: 'Reloj digital',
    description: 'Consulta la hora, la fecha y el saludo del momento.',
    icon: Clock,
    tone: 'blue',
    route: '/reloj',
  },
  {
    number: 2,
    title: 'Gestión de alarmas',
    description: 'Registra, edita y elimina tus alarmas.',
    icon: AlarmClock,
    tone: 'amber',
    route: '/alarmas',
  },
  {
    number: 3,
    title: 'Cronómetro',
    description: 'Inicia, pausa y reinicia la medición del tiempo.',
    icon: Timer,
    tone: 'violet',
    route: '/cronometro',
  },
];

export default function MenuScreen() {
  return (
    <ScreenContainer
      title="Menú principal"
      subtitle="Selecciona un ejercicio para comenzar."
      showBack={false}
    >
      <View className="mb-6 self-start rounded-full bg-blue-100 px-4 py-2">
        <Text className="text-xs font-bold text-blue-700">EXAMEN PARCIAL</Text>
      </View>

      {EJERCICIOS.map((ejercicio) => (
        <ExerciseCard
          key={ejercicio.route}
          number={ejercicio.number}
          title={ejercicio.title}
          description={ejercicio.description}
          icon={ejercicio.icon}
          tone={ejercicio.tone}
          onPress={() => router.navigate(ejercicio.route)}
        />
      ))}
    </ScreenContainer>
  );
}