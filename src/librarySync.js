/*
#--------------------------------------------------------------------------------------------------
Name:        librarySync.js
Author:      d.fathi
Created:     05/09/2026
Updated:     09/09/2026
Copyright:   (c) DSpice 2026
Licence:     free
#---------------------------------------------------------------------------------------------------
Description: Module to scan library files and parse SPICE models/subcircuits with robust regex
*/

const fs = require('fs');
const path = require('path');

class LibrarySync {

    /**
     * Scan the extension lib folder and return all .lib files
     * @param {string} extensionPath - The extension root path
     * @returns {Array<{name: string, fullPath: string}>}
     */
static getLibraryFiles(extensionPath) {
    const libDir = path.join(extensionPath, 'library');
    const libFiles = [];

    if (!fs.existsSync(libDir)) {
        console.warn('⚠️ library directory not found:', libDir);
        return libFiles;
    }

    function scanDir(dir, baseDir) {
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    // Recursively scan subdirectory
                    scanDir(fullPath, baseDir);
                } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.lib')) {
                    // Get relative path from library root (e.g. "semiconductor/bjt/2n555.lib")
                    const relativePath = path.relative(baseDir, fullPath);
                    libFiles.push({
                        name: entry.name,
                        fullPath: fullPath,
                        relativePath: relativePath
                    });
                }
            }
        } catch (err) {
            console.error('❌ Error scanning directory:', dir, err);
        }
    }

    scanDir(libDir, libDir);
    return libFiles;
}


/**
 * Parse a SPICE library file and extract models and subcircuits
 * @param {string} filePath - Full path to the .lib file
 * @returns {{rawContent: string, models: string[], subckts: string[], error?: string}}
 */
static getSpiceModels(filePath) {
    const result = {
        rawContent: '',
        models: [],
        subckts: []
    };

    if (!filePath || !fs.existsSync(filePath)) {
        result.error = 'File not found: ' + filePath;
        return result;
    }

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        result.rawContent = content;

        const lines = content.split(/\r?\n/);
        let insideSubckt = false;  // Track whether we are inside a SUBCKT

        for (let i = 0; i < lines.length; i++) {
            const trimmedLine = lines[i].trim();
            
            // Skip blank lines and comments
            if (trimmedLine === '' || trimmedLine.startsWith('*') || trimmedLine.startsWith(';')) {
                continue;
            }

            // Detect the start of a .SUBCKT block
            const subcktMatch = trimmedLine.match(/^\.SUBCKT\s+([A-Za-z0-9_\-\.]+)/i);
            if (subcktMatch) {
                const subcktName = subcktMatch[1];
                insideSubckt = true;  // Entered a SUBCKT block
                // Avoid duplicates
                if (!result.subckts.includes(subcktName)) {
                    result.subckts.push(subcktName);
                }
                continue;
            }

            // Detect the end of a .SUBCKT block
            if (trimmedLine.match(/^\.ENDS/i)) {
                insideSubckt = false;  // Exited the SUBCKT block
                continue;
            }

            // Detect .MODEL only when outside a SUBCKT block
            // Ignore models defined inside subcircuits
            if (!insideSubckt) {
                const modelMatch = trimmedLine.match(/^\.MODEL\s+([A-Za-z0-9_\-\.]+)/i);
                if (modelMatch) {
                    const modelName = modelMatch[1];
                    // Avoid duplicates
                    if (!result.models.includes(modelName)) {
                        result.models.push(modelName);
                    }
                }
            }
        }
    } catch (err) {
        result.error = 'Error reading file: ' + err.message;
    }

    return result;
}
}

module.exports = LibrarySync;