# DSpice: Designing and Simulating Analog and Digital Circuits

DSpice is a professional, cross-platform circuit design and simulation environment built for VS Code. It provides a powerful graphical schematic designer and delivers precise waveform simulation results powered by the robust **ngspice** engine.

## What’s New 

**v0.1.1 (Current)**

- **Enhanced Custom Editors:** Native visual editing support for ``.dcs`` (Circuit Schematics) and ``.sym`` (Component Symbols) files directly within VS Code.
- **Interactive Drawing Canvas:** Introduced a full-featured graphical environment equipped with zoom, pan, grid snapping, and a dynamic context-aware toolbar.
- **Seamless IDE Integration:** Deep integration with VS Code's native features, including full support for Undo/Redo history and clipboard operations (Copy/Cut/Paste).
- **New Properties Panel:** Added an intuitive side panel for real-time component configuration and attribute editing.
- **New Symbols Panel:** Introduced a dedicated panel for quick browsing, management, and placement of electronic components.
- **Signal List Dialog:** Added a new dialog interface for better tracking and management of simulation signals.
- **Bug Fixes:** Revised and resolved multiple stability issues related to DC Analysis, schematic circuit rendering, and custom symbol design.

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