import * as fs from 'fs';

interface Recompensa {
    oro: number;
    [key: string]: number | string;  // Para permitir ítems como pociones o armas.
}

interface RecompensasConfig {
    recompensas: {
        [dia: string]: Recompensa;
    };
    recompensa_maxima_semanal: Recompensa;
    dias_consecutivos_requeridos: number;
    reset_recompensas_cada_semana: boolean;
}

export class RecompensasManager {
    private config: RecompensasConfig;

    constructor() {
        this.config = this.cargarConfiguracion();
    }

    private cargarConfiguracion(): RecompensasConfig {
        const data = fs.readFileSync('../assets/rewardconfig/diary_reward_config.json', 'utf-8');
        return JSON.parse(data);
    }

    public getRecompensaDia(dia: number): Recompensa | null {
        const key = `dia_${dia}`;
        return this.config.recompensas[key] || null;
    }

    public getRecompensaMaximaSemanal(): Recompensa {
        return this.config.recompensa_maxima_semanal;
    }

    public getDiasConsecutivosRequeridos(): number {
        return this.config.dias_consecutivos_requeridos;
    }

    public resetSemanal(): boolean {
        return this.config.reset_recompensas_cada_semana;
    }
}
