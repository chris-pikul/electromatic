# Electromatic

WORK IN PROGRESS

Web-based Electronic Circuit Simulator and Schematic Drafting.

Inspired and based directly on "Circuit Simulator" by Paul Falstad and Iain
Sharpe at [https://www.falstad.com/circuit/circuitjs.html](falstad.com/circuit/circuitjs.html).

## About This Repository

This is a monorepo comprised of two parts (for now), the first being the editor
and the second being the engine.

### Editor - Web Frontend

The editor is at [./editor](./editor) and holds the React project for displaying
in the browser. Here all the interactions and user-interface code is placed, but
none of the actual math implementation.

### Engine - WASM Backend

The engine will be at [./engine](./engine) and will hold the Rust/WASM project
for building the simulation engine responsible for performing the calculations
for the editor, or potentially as "standalone".

## License

Copyright © 2022 Chris Pikul. Licensed under GNU General Public License 3.0, see
the file [LICENSE](LICENSE) for further details.
