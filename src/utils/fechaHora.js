const dosDigitos = (valor) => String(valor).padStart(2, '0');

export function esFechaValida(fecha) {
  return fecha instanceof Date && Number.isFinite(fecha.getTime());
}

export function formatearHora(fecha = new Date(), incluirSegundos = true) {
  if (!esFechaValida(fecha)) {
    return incluirSegundos ? '--:--:--' : '--:--';
  }

  const hora = dosDigitos(fecha.getHours());
  const minutos = dosDigitos(fecha.getMinutes());
  const segundos = dosDigitos(fecha.getSeconds());

  return incluirSegundos
    ? `${hora}:${minutos}:${segundos}`
    : `${hora}:${minutos}`;
}

export function formatearFecha(fecha = new Date()) {
  if (!esFechaValida(fecha)) return '--/--/----';

  const dia = dosDigitos(fecha.getDate());
  const mes = dosDigitos(fecha.getMonth() + 1);
  const anio = String(fecha.getFullYear()).padStart(4, '0');

  return `${dia}/${mes}/${anio}`;
}

export function obtenerSaludo(fecha = new Date()) {
  if (!esFechaValida(fecha)) return '';

  const hora = fecha.getHours();

  if (hora < 12) return 'Buenos días';
  if (hora < 18) return 'Buenas tardes';

  return 'Buenas noches';
}

// Recibe milisegundos y muestra mm:ss o HH:mm:ss.
export function formatearDuracion(milisegundos = 0) {
  const totalSegundos = Number.isFinite(milisegundos)
    ? Math.max(0, Math.floor(milisegundos / 1000))
    : 0;

  const horas = Math.floor(totalSegundos / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;

  if (horas > 0) {
    return `${dosDigitos(horas)}:${dosDigitos(minutos)}:${dosDigitos(segundos)}`;
  }

  return `${dosDigitos(minutos)}:${dosDigitos(segundos)}`;
}

// Combina la fecha y la hora locales sin modificar los valores originales.
export function combinarFechaHora(fecha, hora) {
  if (!esFechaValida(fecha) || !esFechaValida(hora)) return null;

  const combinada = new Date(fecha.getTime());
  combinada.setHours(hora.getHours(), hora.getMinutes(), 0, 0);

  return combinada;
}

function resultadoInvalido(mensaje) {
  return { valida: false, mensaje, fechaHora: null };
}

// Cada alarma utilizará { id, fechaHora }, con fechaHora en milisegundos.
export function validarAlarma({
  fecha,
  hora,
  alarmas = [],
  idActual = null,
  ahora = new Date(),
} = {}) {
  if (!esFechaValida(fecha)) {
    return resultadoInvalido('Selecciona una fecha válida.');
  }

  if (!esFechaValida(hora)) {
    return resultadoInvalido('Selecciona una hora válida.');
  }

  const fechaHora = combinarFechaHora(fecha, hora).getTime();
  const alarmaActual = alarmas.find((alarma) => alarma.id === idActual);

  if (idActual !== null && !alarmaActual) {
    return resultadoInvalido('La alarma que intentas editar ya no existe.');
  }

  // Al editar, la propia alarma no cuenta como duplicada.
  const duplicada = alarmas.some(
    (alarma) => alarma.id !== idActual && alarma.fechaHora === fechaHora
  );

  if (duplicada) {
    return resultadoInvalido('Ya existe una alarma con esa fecha y hora.');
  }

  const conservaSuHorario = alarmaActual?.fechaHora === fechaHora;

  if (!conservaSuHorario && fechaHora < ahora.getTime()) {
    return resultadoInvalido(
      'La fecha y hora no pueden ser anteriores al momento actual.'
    );
  }

  return { valida: true, mensaje: '', fechaHora };
}