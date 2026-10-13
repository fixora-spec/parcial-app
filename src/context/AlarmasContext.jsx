import { createContext, useContext, useRef, useState } from 'react';
import { validarAlarma } from '../utils/fechaHora';

const AlarmasContext = createContext(null);

export function AlarmasProvider({ children }) {
  const [alarmas, setAlarmas] = useState([]);
  const alarmasRef = useRef([]);
  const secuenciaRef = useRef(0);

  function actualizarAlarmas(lista) {
    const ordenadas = [...lista].sort(
      (primera, segunda) => primera.fechaHora - segunda.fechaHora
    );

    alarmasRef.current = ordenadas;
    setAlarmas(ordenadas);
  }

  function guardarAlarma(fecha, hora, idActual = null) {
    // La referencia permite validar contra la lista más reciente.
    const resultado = validarAlarma({
      fecha,
      hora,
      alarmas: alarmasRef.current,
      idActual,
    });

    if (!resultado.valida) return resultado;

    let id = idActual;

    if (idActual === null) {
      secuenciaRef.current += 1;
      id = `alarma-${Date.now()}-${secuenciaRef.current}`;
    }

    const registro = { id, fechaHora: resultado.fechaHora };

    const nuevaLista = idActual === null
      ? [...alarmasRef.current, registro]
      : alarmasRef.current.map((alarma) =>
          alarma.id === idActual ? registro : alarma
        );

    actualizarAlarmas(nuevaLista);

    return {
      ...resultado,
      alarma: registro,
      mensaje: idActual === null
        ? 'Alarma registrada correctamente.'
        : 'Alarma actualizada correctamente.',
    };
  }

  function eliminarAlarma(id) {
    const existe = alarmasRef.current.some((alarma) => alarma.id === id);

    if (!existe) {
      return { valida: false, mensaje: 'La alarma ya no existe.' };
    }

    actualizarAlarmas(
      alarmasRef.current.filter((alarma) => alarma.id !== id)
    );

    return { valida: true, mensaje: 'Alarma eliminada correctamente.' };
  }

  return (
    <AlarmasContext.Provider
      value={{ alarmas, guardarAlarma, eliminarAlarma }}
    >
      {children}
    </AlarmasContext.Provider>
  );
}

export function useAlarmas() {
  const contexto = useContext(AlarmasContext);

  if (contexto === null) {
    throw new Error('useAlarmas debe utilizarse dentro de AlarmasProvider.');
  }

  return contexto;
}