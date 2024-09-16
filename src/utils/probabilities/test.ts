import { calculateDamage } from './probabilities.js'; 

// Simulación de un héroe para probar
const hero = {
  'tipo-heroe': 'warrior',
  'subtipo-heroe': 'tank',
  dano: 2,
  critico: 5
};

// Prueba simple
const result = calculateDamage(hero);

console.log('El daño calculado es:', result);