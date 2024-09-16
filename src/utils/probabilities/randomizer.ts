import { Chart } from 'chart.js';
import { Random, MersenneTwister19937 } from 'random-js'; // Asegúrate de estar importando correctamente
const random = new Random(MersenneTwister19937.autoSeed());

const sorted: number[] = [];
let cnt = 0;
while (cnt < 80000) {
  sorted.push(cnt);
  cnt++;
}
random.shuffle(sorted);

function boxMullerRandom(mean: number, stddev: number): number {
  let u1 = 0, u2 = 0;
  // Generar dos números aleatorios entre 0 y 1 que no sean 0
  while (u1 === 0) u1 = random.real(0, 1); // Utiliza random.real() para generar números entre 0 y 1
  while (u2 === 0) u2 = random.real(0, 1);

  // Aplicar la transformación de Box-Muller
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

  // Ajustar la media y la desviación estándar
  return z0 * stddev + mean;
}

// Función para generar números aleatorios con distribución normal truncada
function truncNormalRandom(mean: number, stddev: number, min: number, max: number): number {
  let result: number;
  do {
    result = boxMullerRandom(mean, stddev);
  } while (result < min || result > max);
  return result;
}

export function indiceAleatorio(): number {
  return Math.floor(truncNormalRandom(40000, 20000, 0, 79999));
}

export function generarRandom(): number {
  const randomIndex = indiceAleatorio(); // Cambié el nombre de la variable a 'randomIndex'
  return sorted[randomIndex];
}

export function graficaNormalIndices(): void {
  const { x, y } = generarDatosGraficaNormal();
  const ctx = (document.getElementById('chart') as HTMLCanvasElement).getContext('2d');
  new Chart(ctx!, {
    type: 'bar',
    data: {
      labels: x,
      datasets: [{ label: 'Frecuencia de índices aleatorios', data: y }],
    },
  });
}

function generarDatosGraficaNormal(): { x: number[]; y: number[] } {
  const x: number[] = [];
  const y: number[] = Array(80000).fill(0);

  for (let cnt = 0; cnt < 200000; cnt++) {
    const index = indiceAleatorio(); // Cambié el nombre de la variable a 'index'
    y[index]++;
  }

  for (let i = 0; i < 80000; i++) {
    x.push(i);
  }

  return { x, y };
}

export function graficaDatos(): void {
  const { x, y } = generarDatosGrafica();
  const ctx = (document.getElementById('chart') as HTMLCanvasElement).getContext('2d');
  new Chart(ctx!, {
    type: 'bar',
    data: {
      labels: x,
      datasets: [{ label: 'Frecuencia de números aleatorios', data: y }],
    },
  });
}

function generarDatosGrafica(): { x: number[]; y: number[] } {
  const x: number[] = [];
  const y: number[] = Array(80000).fill(0);

  for (let cnt = 0; cnt < 200000; cnt++) {
    const index = indiceAleatorio(); // Cambié el nombre de la variable a 'index'
    const valor = sorted[index];
    y[valor]++;
  }

  for (let i = 0; i < 80000; i++) {
    x.push(i);
  }

  return { x, y };
}
