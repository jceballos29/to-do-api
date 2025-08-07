// ========================================
// UTILIDADES DE FECHA (Date Utils)
// ========================================
// Este archivo contiene funciones utilitarias para manejar fechas
// Facilita el trabajo con fechas en formato ISO y otras operaciones

/**
 * Clase DateUtils - Maneja operaciones relacionadas con fechas
 * Centraliza toda la lógica de fechas para consistencia
 */
class DateUtils {
    /**
     * Obtiene la fecha y hora actual en formato ISO 8601
     * @returns {string} Fecha actual en formato ISO (ej: "2025-08-07T10:30:00.000Z")
     */
    static getCurrentDateTime() {
        return new Date().toISOString();
    }

    /**
     * Valida si una cadena es una fecha válida en formato ISO
     * @param {string} dateString - Cadena de fecha a validar
     * @returns {boolean} True si es válida, false si no
     */
    static isValidISODate(dateString) {
        if (!dateString || typeof dateString !== 'string') {
            return false;
        }

        const date = new Date(dateString);
        
        // Verificar que la fecha es válida y que el string original es igual al ISO
        return date instanceof Date && 
               !isNaN(date) && 
               dateString === date.toISOString();
    }

    /**
     * Convierte una fecha a formato legible en español
     * @param {string} isoDateString - Fecha en formato ISO
     * @returns {string} Fecha en formato legible
     */
    static formatToReadable(isoDateString) {
        try {
            const date = new Date(isoDateString);
            
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/Bogota' // Ajusta según tu zona horaria
            };

            return date.toLocaleDateString('es-ES', options);
        } catch (error) {
            console.error('Error formateando fecha:', error.message);
            return 'Fecha inválida';
        }
    }

    /**
     * Calcula la diferencia en días entre dos fechas
     * @param {string} date1 - Primera fecha en formato ISO
     * @param {string} date2 - Segunda fecha en formato ISO
     * @returns {number} Diferencia en días (positivo si date2 es posterior)
     */
    static daysBetween(date1, date2) {
        try {
            const d1 = new Date(date1);
            const d2 = new Date(date2);
            
            const diffTime = d2.getTime() - d1.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            return diffDays;
        } catch (error) {
            console.error('Error calculando diferencia de días:', error.message);
            return 0;
        }
    }

    /**
     * Verifica si una fecha es de hoy
     * @param {string} isoDateString - Fecha en formato ISO
     * @returns {boolean} True si es de hoy
     */
    static isToday(isoDateString) {
        try {
            const date = new Date(isoDateString);
            const today = new Date();
            
            return date.toDateString() === today.toDateString();
        } catch (error) {
            return false;
        }
    }

    /**
     * Obtiene el tiempo transcurrido desde una fecha hasta ahora
     * @param {string} isoDateString - Fecha en formato ISO
     * @returns {string} Tiempo transcurrido en formato legible
     */
    static timeAgo(isoDateString) {
        try {
            const date = new Date(isoDateString);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            
            const diffSeconds = Math.floor(diffMs / 1000);
            const diffMinutes = Math.floor(diffSeconds / 60);
            const diffHours = Math.floor(diffMinutes / 60);
            const diffDays = Math.floor(diffHours / 24);

            if (diffDays > 0) {
                return `hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
            } else if (diffHours > 0) {
                return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
            } else if (diffMinutes > 0) {
                return `hace ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
            } else {
                return 'hace unos segundos';
            }
        } catch (error) {
            console.error('Error calculando tiempo transcurrido:', error.message);
            return 'tiempo desconocido';
        }
    }

    /**
     * Crea una fecha a partir de componentes separados
     * @param {number} year - Año
     * @param {number} month - Mes (1-12)
     * @param {number} day - Día
     * @param {number} hour - Hora (0-23)
     * @param {number} minute - Minuto (0-59)
     * @returns {string} Fecha en formato ISO
     */
    static createISODate(year, month, day, hour = 0, minute = 0) {
        try {
            // Los meses en JavaScript van de 0-11, por eso restamos 1
            const date = new Date(year, month - 1, day, hour, minute);
            return date.toISOString();
        } catch (error) {
            console.error('Error creando fecha:', error.message);
            return this.getCurrentDateTime();
        }
    }

    /**
     * Convierte una fecha ISO a objeto con componentes separados
     * @param {string} isoDateString - Fecha en formato ISO
     * @returns {Object} Objeto con year, month, day, hour, minute
     */
    static parseISODate(isoDateString) {
        try {
            const date = new Date(isoDateString);
            
            return {
                year: date.getFullYear(),
                month: date.getMonth() + 1, // Sumamos 1 porque los meses van de 0-11
                day: date.getDate(),
                hour: date.getHours(),
                minute: date.getMinutes(),
                dayOfWeek: date.getDay(), // 0 = domingo, 1 = lunes, etc.
                dayName: date.toLocaleDateString('es-ES', { weekday: 'long' })
            };
        } catch (error) {
            console.error('Error parseando fecha:', error.message);
            return null;
        }
    }
}

module.exports = DateUtils;
