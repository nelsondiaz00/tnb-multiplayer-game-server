import * as fs from 'fs';

interface SubastaConfig {
    duracion_subasta_horas: number;
    incremento_minimo: number;
    moneda: string;
    comision_por_venta: number;
    cantidad_maxima_ofertas: number;
    tipo_subasta: string;
    participantes_minimos: number;
    notificaciones: {
        recordatorio_tiempo_limite: boolean;
        ganador_subasta: boolean;
    };
}

export class SubastaManager {
    private config: SubastaConfig;

    constructor() {
        this.config = this.cargarConfiguracion();
    }

    private cargarConfiguracion(): SubastaConfig {
        const data = fs.readFileSync('../assets/auctionsconfig/auction_config.json', 'utf-8');
        return JSON.parse(data);
    }

    public getDuracionSubasta(): number {
        return this.config.duracion_subasta_horas;
    }

    public getIncrementoMinimo(): number {
        return this.config.incremento_minimo;
    }

    public aplicarComision(ganancia: number): number {
        return ganancia * (1 - this.config.comision_por_venta);
    }

    public esParticipanteValido(participantes: number): boolean {
        return participantes >= this.config.participantes_minimos;
    }

    public notificarGanador(): boolean {
        return this.config.notificaciones.ganador_subasta;
    }

    public notificarTiempoLimite(): boolean {
        return this.config.notificaciones.recordatorio_tiempo_limite;
    }
}
