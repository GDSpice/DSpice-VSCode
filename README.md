# DSpice: Designing and Simulating Analog and Digital Circuits

DSpice is a professional, cross-platform circuit design and simulation environment built for VS Code. It provides a powerful graphical schematic designer and delivers precise waveform simulation results powered by the robust **ngspice** engine.

## What’s New 

**v0.1.2 (Current)**

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

## Key Features
- **Graphical Schematic Designer:** Intuitive interface for drawing and designing circuit schematics.
- **Advanced Simulation Engine:** Powered by ngspice for accurate analog and mixed-signal circuit simulations (DC, AC, Transient).
- **Interactive Waveform Viewer:** Visualize and analyze simulation results with an interactive graph viewer, featuring PNG export capabilities.
- **Extensive Component Library:** Includes a wide range of SPICE models (BJT, MOSFET, JFET, Diodes, OP-AMPs, and more).
- **Cross-Platform:** Built with ElectronJS, offering a seamless experience on Windows and Linux.

## Installation
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "DSpice"
4. Click Install

## Usage
1. Open DSpice from the Activity Bar
2. Create a new schematic
3. Add components from the library
4. Run simulation and view waveform results

## Requirements
- VS Code 1.70.0 or higher

## Document
- https://dspice-vscode.readthedocs.io

## License
MIT License - See LICENSE file for details

## Support
For issues and feature requests, please visit: https://github.com/GDSpice/DSpice-VSCode/issues