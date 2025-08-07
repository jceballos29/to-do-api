// ========================================
// MODELO DE TAREA (Task Model)
// ========================================
// Este archivo define la estructura y validaciones de una tarea
// El modelo es la representación de los datos de nuestra aplicación

/**
 * Clase Task - Define la estructura de una tarea
 * Esta clase encapsula la lógica relacionada con los datos de las tareas
 */
class Task {
    /**
     * Constructor para crear una nueva instancia de tarea
     * @param {Object} taskData - Datos de la tarea
     * @param {number} taskData.id - ID único de la tarea
     * @param {string} taskData.title - Título de la tarea
     * @param {string} taskData.description - Descripción de la tarea
     * @param {number} taskData.status - Estado de la tarea (0, 1, 2)
     * @param {string} taskData.createdAt - Fecha de creación en formato ISO
     * @param {string} taskData.updatedAt - Fecha de actualización en formato ISO
     */
    constructor({ id, title, description, status, createdAt, updatedAt }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    /**
     * Valida que los datos de la tarea sean correctos
     * @returns {Object} Objeto con isValid (boolean) y errors (array)
     */
    validate() {
        const errors = [];

        // Validar título
        if (!this.title || typeof this.title !== 'string' || this.title.trim() === '') {
            errors.push('El título es obligatorio y debe ser un texto válido');
        }

        // Validar descripción
        if (!this.description || typeof this.description !== 'string' || this.description.trim() === '') {
            errors.push('La descripción es obligatoria y debe ser un texto válido');
        }

        // Validar estado
        if (this.status === undefined || this.status === null || ![0, 1, 2].includes(Number(this.status))) {
            errors.push('El estado debe ser 0 (pendiente), 1 (en progreso) o 2 (completada)');
        }

        // Validar fechas
        if (this.createdAt && !this.isValidDate(this.createdAt)) {
            errors.push('La fecha de creación debe ser una fecha válida en formato ISO');
        }

        if (this.updatedAt && !this.isValidDate(this.updatedAt)) {
            errors.push('La fecha de actualización debe ser una fecha válida en formato ISO');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Valida si una fecha está en formato ISO válido
     * @param {string} dateString - Fecha en formato string
     * @returns {boolean} True si es válida, false si no
     */
    isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date) && dateString === date.toISOString();
    }

    /**
     * Convierte la tarea a un objeto plano (sin métodos)
     * Útil para serializar a JSON
     * @returns {Object} Objeto plano con los datos de la tarea
     */
    toObject() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Crea una nueva tarea desde datos de entrada
     * Aplica valores por defecto y validaciones básicas
     * @param {Object} inputData - Datos de entrada del usuario
     * @param {number} newId - ID para la nueva tarea
     * @returns {Task} Nueva instancia de Task
     */
    static createNew(inputData, newId) {
        const currentDateTime = new Date().toISOString();
        
        return new Task({
            id: newId,
            title: inputData.title ? inputData.title.trim() : '',
            description: inputData.description ? inputData.description.trim() : '',
            status: inputData.status !== undefined ? Number(inputData.status) : 0,
            createdAt: currentDateTime,
            updatedAt: currentDateTime
        });
    }

    /**
     * Actualiza los campos de la tarea con nuevos datos
     * Solo actualiza los campos que se proporcionan
     * @param {Object} updateData - Datos para actualizar
     * @returns {Task} La misma instancia actualizada
     */
    update(updateData) {
        let wasUpdated = false;

        // Actualizar título si se proporciona
        if (updateData.title !== undefined) {
            this.title = updateData.title.trim();
            wasUpdated = true;
        }

        // Actualizar descripción si se proporciona
        if (updateData.description !== undefined) {
            this.description = updateData.description.trim();
            wasUpdated = true;
        }

        // Actualizar estado si se proporciona
        if (updateData.status !== undefined) {
            this.status = Number(updateData.status);
            wasUpdated = true;
        }

        // Si hubo cambios, actualizar la fecha de modificación
        if (wasUpdated) {
            this.updatedAt = new Date().toISOString();
        }

        return this;
    }

    /**
     * Obtiene el nombre descriptivo del estado
     * @returns {string} Nombre del estado en español
     */
    getStatusName() {
        const statusNames = {
            0: 'Pendiente',
            1: 'En progreso',
            2: 'Completada'
        };
        return statusNames[this.status] || 'Estado desconocido';
    }

    /**
     * Crea una instancia de Task desde un objeto plano
     * Útil para cargar datos desde JSON
     * @param {Object} data - Datos de la tarea en formato objeto
     * @returns {Task} Nueva instancia de Task
     */
    static fromObject(data) {
        return new Task(data);
    }
}

// Exportamos la clase para usar en otros archivos
module.exports = Task;
