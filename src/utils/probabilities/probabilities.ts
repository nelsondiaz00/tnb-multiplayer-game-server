import { generarRandom } from './randomizer.js'; // Importar el archivo randomizer
import { Random, MersenneTwister19937 } from 'random-js'; // Asegúrate de estar importando correctamente

const random = new Random(MersenneTwister19937.autoSeed());

interface Hero {
  critico?: number;
  dano?: number;
  'tipo-heroe': string;
  'subtipo-heroe': string;
  damage?: number;
}

interface HitStats {
  'tipo-heroe': string;
  'subtipo-heroe': string;
  'dano-minimo': number;
  'dano-maximo': number;
  'dano-prob': number;
  'dano-crit-prob': number;
  'evadir-golpe-prob': number;
  'resistir-prob': number;
  'escapar-prob': number;
}

const hitStatsPerType: HitStats[] = [
{
    'tipo-heroe': 'warrior',
    'subtipo-heroe': 'tank',
    'dano-minimo': 1,
    'dano-maximo': 6,
    'dano-prob': 40,
    'dano-crit-prob': 0,
    'evadir-golpe-prob': 5,
    'resistir-prob': 0,
    'escapar-prob': 5,
},
{
    'tipo-heroe': 'warrior',
    'subtipo-heroe': 'weapon',
    'dano-minimo': 1,
    'dano-maximo': 6,
    'dano-prob': 60,
    'dano-crit-prob': 0,
    'evadir-golpe-prob': 3,
    'resistir-prob': 0,
    'escapar-prob': 2,
},
{
    'tipo-heroe': 'wizard',
    'subtipo-heroe': 'fire',
    'dano-minimo': 1,
    'dano-maximo': 8,
    'dano-prob': 70,
    'dano-crit-prob': 0,
    'evadir-golpe-prob': 0,
    'resistir-prob': 5,
    'escapar-prob': 0,
},
{
    'tipo-heroe': 'wizard',
    'subtipo-heroe': 'ice',
    'dano-minimo': 1,
    'dano-maximo': 8,
    'dano-prob': 70,
    'dano-crit-prob': 0,
    'evadir-golpe-prob': 0,
    'resistir-prob': 4,
    'escapar-prob': 0,
},
{
    'tipo-heroe': 'rogue',
    'subtipo-heroe': 'poison',
    'dano-minimo': 1,
    'dano-maximo': 10,
    'dano-prob': 55,
    'dano-crit-prob': 0,
    'evadir-golpe-prob': 0,
    'resistir-prob': 0,
    'escapar-prob': 0,
},
{
    'tipo-heroe': 'rogue',
    'subtipo-heroe': 'machete',
    'dano-minimo': 1,
    'dano-maximo': 10,
    'dano-prob': 60,
    'dano-crit-prob': 0,
    'evadir-golpe-prob': 0,
    'resistir-prob': 0,
    'escapar-prob': 2,
}
];
  

function calculateBaseDamage(hero: Hero, hitStats: HitStats): number {
  return Math.floor(random.integer(hitStats['dano-minimo'], hitStats['dano-maximo'])) + (hero.dano || 0);
}

function searchHeroStats(hero: Hero): { hero: Hero; hitStats: HitStats | null } {
  for (const hitStats of hitStatsPerType) {
    if (hitStats['tipo-heroe'] === hero['tipo-heroe'] && hitStats['subtipo-heroe'] === hero['subtipo-heroe']) {
      hero.damage = calculateBaseDamage(hero, hitStats);
      return { hero, hitStats };
    }
  }
  return { hero, hitStats: null };
}

function fillMatrixCrit(percentageMatrix: number[], hitStats: HitStats, hero: Hero): number[] {
  let filledRows = percentageMatrix.length;
  const probability = hitStats['dano-crit-prob'];
  // console.log(probability + (hero.critico ?? 0));
  const rows = 80000 * ((probability + (hero.critico || 0)) / 100);
  const filledBefore = filledRows;

  while (filledRows < rows + filledBefore) {
    percentageMatrix.push(random.integer(120, 180));
    filledRows++;
  }
  return percentageMatrix;
}

function fillMatrixStat(percentageMatrix: number[], probability: number, value: number): number[] {
  let filledRows = percentageMatrix.length;
  if (filledRows >= 80000) return percentageMatrix;

  const rows = 80000 * (probability / 100);
  const filledBefore = filledRows;

  while (filledRows < rows + filledBefore) {
    percentageMatrix.push(value);
    filledRows++;
  }
  return percentageMatrix;
}

function completeMatrix(percentageMatrix: number[]): number[] {
  let filledRows = percentageMatrix.length;
  while (filledRows < 80000) {
    percentageMatrix.push(0);
    filledRows++;
  }
  return percentageMatrix;
}

function fillProbsMatrix(hitStats: HitStats, hero: Hero): number[] {
  let percentageMatrix: number[] = [];

  percentageMatrix = fillMatrixCrit(percentageMatrix, hitStats, hero);
  percentageMatrix = fillMatrixStat(percentageMatrix, hitStats['dano-prob'], 100);
  percentageMatrix = fillMatrixStat(percentageMatrix, hitStats['evadir-golpe-prob'], 80);
  percentageMatrix = fillMatrixStat(percentageMatrix, hitStats['resistir-prob'], 60);
  percentageMatrix = fillMatrixStat(percentageMatrix, hitStats['escapar-prob'], 20);

  return completeMatrix(percentageMatrix);
}

export function calculateDamage(hero: Hero): number {
  if (!hero['tipo-heroe'] || !hero['subtipo-heroe']) return -1;

  const { hero: updatedHero, hitStats } = searchHeroStats(hero);
  if (!hitStats) return -1;

  const percentageMatrix = fillProbsMatrix(hitStats, updatedHero);
  const damagePercentage = percentageMatrix[generarRandom()];
  const finalDamage = (updatedHero.damage || 0) * (damagePercentage / 100);

  return finalDamage;
}
