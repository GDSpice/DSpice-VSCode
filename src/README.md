# DSpice: Designing and Simulating Analog and Digital Circuits

DSpice is a professional, cross-platform circuit design and simulation environment built for VS Code. It provides a powerful graphical schematic designer and delivers precise waveform simulation results powered by the robust **ngspice** engine.

## What’s New 

**v0.1.4 (Current)**

### Added
- **Circuit Simulation Engine:** Added `runSimulation` function to enable and execute circuit analysis.
- **Simulation Results Display:** Added a dedicated view to display circuit simulation results directly within the editor.
- **Analysis Graphs Enhancement:** Added X- and Y-axis output data visualization to analysis graphs for better data interpretation.
- **Component Selection Dialog:** Introduced `elementDialog` for streamlined component selection and placement.
- **Semiconductor Elements:** Added and updated various semiconductor elements to expand the built-in component library.
- **Output Management:** Added functionality to dynamically add and remove analysis outputs during simulation setup.
- **Interactive Properties Panel:** Updated analysis views to automatically show the Properties panel when double-clicking a circuit element.

### Changed
- **Code Refactoring:** Renamed internal parsing functions to match `parseSpiceResults` for better consistency and maintainability.
- **DOM Utility Update:** Updated the `getElementsByClassName` function for improved performance and reliability across the webview.

### Fixed
- **Reference Naming:** Resolved reference naming issues to ensure accurate component and net identification during simulation and editing.


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