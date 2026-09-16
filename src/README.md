# DSpice: Designing and Simulating Analog and Digital Circuits

DSpice is a professional, cross-platform circuit design and simulation environment built for VS Code. It provides a powerful graphical schematic designer and delivers precise waveform simulation results powered by the robust **ngspice** engine.

## What’s New 

**v0.1.3 (Current)**

### Added

- **Package Metadata:** Added keywords to the extension package for better discoverability in the VS Code marketplace.

### Changed
- **Schematic Symbols:** Updated voltage and current source symbols, Vbar (Vcc), and basic circuit elements to use device names consistently.
- **GND Behavior:** Improved GND symbol updating logic based on its attachment position in the circuit.
- **Theming Support:** Updated Operating Point (OP) analysis and wire colors to ensure proper visibility and contrast across all VS Code themes.
- **Terminology:** Renamed "lib" references to "library" throughout the project for better clarity and consistency.

### Fixed
- **Wire Naming:** Resolved wire renaming issues, specifically for Input, Output, and Bidirectional ports.
- **Wire Rendering:** Fixed general wire naming and color display inconsistencies in the canvas.

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