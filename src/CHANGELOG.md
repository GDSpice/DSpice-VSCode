# Changelog

All notable changes to DSpice will be documented in this file.

## [0.1.2] - 2026-09-13
### Added
- **SPICE Netlist Editor:** Introduced a new dialog for editing SPICE netlist files with full syntax highlighting.
- **Enhanced Code Editor:** Added a dedicated dialog for editing HTML/CSS code files with syntax highlighting, VSCode Dark+ theme alignment, improved scrollbar handling, and active line highlighting.
- **Library Model Picker:** Enabled selecting SPICE models directly from bundled libraries, including support for nested directory scanning for `.lib` files.
- **Toolbar & Shortcuts:** Added a new "Model" toolbar button and a 'D' keyboard shortcut for quick SPICE model creation.
- **Clipboard Commands:** Added native support for Copy, Cut, and Paste operations within the editor.
- **Shape Tools:** Updated and refined toolbar buttons for arc, ellipse, polygon, rect, and polyline drawing.

### Changed
- **SPICE Model Handling:** Centralized and improved the application of SPICE model metadata to symbols and drawing elements. The properties panel now seamlessly displays device/model fields and supports a "Find similar model" action.
- **Symbol Storage:** Enhanced symbol handling to store data as JSON with robust device and model support.

### Fixed
- **Code Editor:** Resolved text misalignment issues during typing between the textarea and highlight layer.
- **Symbol Rendering:** Fixed various issues related to symbol references, device names, and null symbol handling.
- **Circuit Interaction:** Improved probe editing and positioning accuracy within the circuit canvas.

## [0.1.1] - 2026-09-08
### Added
- **Enhanced Custom Editors:** Native visual editing support for ``.dcs`` (Circuit Schematics) and ``.sym`` (Component Symbols) files directly within VS Code.
- **Interactive Drawing Canvas:** Introduced a full-featured graphical environment equipped with zoom, pan, grid snapping, and a dynamic context-aware toolbar.
- **Seamless IDE Integration:** Deep integration with VS Code's native features, including full support for Undo/Redo history and clipboard operations (Copy/Cut/Paste).
- **New Properties Panel:** Added an intuitive side panel for real-time component configuration and attribute editing.
- **New Symbols Panel:** Introduced a dedicated panel for quick browsing, management, and placement of electronic components.
- **Signal List Dialog:** Added a new dialog interface for better tracking and management of simulation signals.

### Fixed
- **Bug Fixes:** Revised and resolved multiple stability issues related to DC Analysis, schematic circuit rendering, and custom symbol design.
