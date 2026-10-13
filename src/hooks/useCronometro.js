import { useCallback, useEffect, useRef, useState } from 'react';

export default function useCronometro() {
  const [tiempo, setTiempo] = useState(0);
  const [enEjecucion, setEnEjecucion] = useState(false);

  const intervaloRef = useRef(null);
  const inicioRef = useRef(null);
  const acumuladoRef = useRef(0);

  const limpiarIntervalo = useCallback(() => {
    if (intervaloRef.current !== null) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    // Evita iniciar otro intervalo si el cronómetro ya está funcionando.
    if (inicioRef.current !== null) return;

    inicioRef.current = performance.now();
    setTiempo(acumuladoRef.current);
    setEnEjecucion(true);

    intervaloRef.current = setInterval(() => {
      const inicio = inicioRef.current;

      if (inicio !== null) {
        setTiempo(
          acumuladoRef.current + Math.max(0, performance.now() - inicio)
        );
      }
    }, 250);
  }, []);

  const pause = useCallback(() => {
    const inicio = inicioRef.current;

    if (inicio === null) return;

    acumuladoRef.current += Math.max(0, performance.now() - inicio);
    inicioRef.current = null;
    limpiarIntervalo();

    setTiempo(acumuladoRef.current);
    setEnEjecucion(false);
  }, [limpiarIntervalo]);

  const stop = useCallback(() => {
    inicioRef.current = null;
    acumuladoRef.current = 0;
    limpiarIntervalo();

    setTiempo(0);
    setEnEjecucion(false);
  }, [limpiarIntervalo]);

  useEffect(() => {
    return () => {
      inicioRef.current = null;
      limpiarIntervalo();
    };
  }, [limpiarIntervalo]);

  return { tiempo, enEjecucion, play, pause, stop };
}