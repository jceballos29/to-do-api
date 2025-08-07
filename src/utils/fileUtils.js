// ========================================
// UTILIDADES DE ARCHIVO (File Utils)
// ========================================
// Este archivo contiene funciones utilitarias para manejar archivos
// Separamos esta lógica para que sea reutilizable y fácil de mantener

const fs = require('fs');
const path = require('path');

/**
 * Clase FileUtils - Maneja operaciones de archivos
 * Encapsula toda la lógica de lectura y escritura de archivos JSON
 */
class FileUtils {
    /**
     * Lee un archivo JSON y devuelve su contenido parseado
     * @param {string} filePath - Ruta del archivo a leer
     * @param {Array} defaultValue - Valor por defecto si el archivo no existe
     * @returns {Array|Object} Contenido del archivo parseado
     */
    static readJSONFile(filePath, defaultValue = []) {
        try {
            // Verificar si el archivo existe
            if (!fs.existsSync(filePath)) {
                console.warn(`Archivo no encontrado: ${filePath}. Usando valor por defecto.`);
                return defaultValue;
            }

            // Leer el contenido del archivo
            const data = fs.readFileSync(filePath, 'utf8');
            
            // Verificar que el archivo no esté vacío
            if (!data.trim()) {
                console.warn(`Archivo vacío: ${filePath}. Usando valor por defecto.`);
                return defaultValue;
            }

            // Parsear el JSON y devolverlo
            return JSON.parse(data);
        } catch (error) {
            console.error('Error leyendo archivo JSON:', error.message);
            console.warn(`Usando valor por defecto para ${filePath}`);
            return defaultValue;
        }
    }

    /**
     * Escribe datos en un archivo JSON con formato bonito
     * @param {string} filePath - Ruta del archivo donde escribir
     * @param {Array|Object} data - Datos a escribir en el archivo
     * @param {number} indent - Espacios de indentación (por defecto 2)
     * @returns {boolean} True si se escribió correctamente, false si hubo error
     */
    static writeJSONFile(filePath, data, indent = 2) {
        try {
            // Asegurar que el directorio existe
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // Convertir los datos a JSON con formato bonito
            const jsonData = JSON.stringify(data, null, indent);
            
            // Escribir el archivo
            fs.writeFileSync(filePath, jsonData, 'utf8');
            
            return true;
        } catch (error) {
            console.error('Error escribiendo archivo JSON:', error.message);
            return false;
        }
    }

    /**
     * Crea una copia de seguridad de un archivo
     * @param {string} filePath - Ruta del archivo original
     * @returns {boolean} True si se creó la copia, false si hubo error
     */
    static createBackup(filePath) {
        try {
            if (!fs.existsSync(filePath)) {
                console.warn(`No se puede hacer backup: archivo no existe ${filePath}`);
                return false;
            }

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupPath = `${filePath}.backup.${timestamp}`;
            
            fs.copyFileSync(filePath, backupPath);
            console.log(`Backup creado: ${backupPath}`);
            
            return true;
        } catch (error) {
            console.error('Error creando backup:', error.message);
            return false;
        }
    }

    /**
     * Verifica si un archivo existe y es legible
     * @param {string} filePath - Ruta del archivo
     * @returns {boolean} True si existe y es legible
     */
    static fileExists(filePath) {
        try {
            fs.accessSync(filePath, fs.constants.R_OK);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Obtiene información sobre un archivo
     * @param {string} filePath - Ruta del archivo
     * @returns {Object|null} Información del archivo o null si no existe
     */
    static getFileInfo(filePath) {
        try {
            if (!fs.existsSync(filePath)) {
                return null;
            }

            const stats = fs.statSync(filePath);
            return {
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime,
                isFile: stats.isFile(),
                isDirectory: stats.isDirectory()
            };
        } catch (error) {
            console.error('Error obteniendo información del archivo:', error.message);
            return null;
        }
    }
}

module.exports = FileUtils;
