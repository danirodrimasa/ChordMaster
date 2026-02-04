
# ChordMaster - Piano Chord Transposer

A minimalist, local-first web application designed for musicians. Enter piano chords, organize them into song sections, and transpose the entire composition instantly with a live interactive piano visualization.

## Features

- **Dual Notation Support**: Seamlessly toggle between Letter (A, B, C) and Solfège (Do, Re, Mi) notation.
- **Smart Transposition**: Real-time semitone shifting that preserves chord quality and correctly re-calculates note positions.
- **Dynamic Song Structure**: Organize your songs into sections (Intro, Verse, Chorus, etc.) that can be reordered and edited.
- **Visual Feedback**: An interactive 2-octave piano keyboard that highlights the specific notes of any selected chord.
- **Local-First**: Your data is stored directly in your browser's local storage—no account, no cloud, no latency.
- **Music-Friendly UI**: Dark and light modes with elegant typography and responsive layout.

## How Transposition Logic Works

The transposition engine follows a clear mathematical approach:
1. **Parsing**: When a chord is entered (e.g., `Cmaj7`), it's split into a **Root** (`C`) and a **Quality** (`maj7`).
2. **Indexing**: The root note is mapped to its semitone index (0 for C, 1 for C#, etc.).
3. **Offsetting**: A global semitone offset is applied to the index: `newIndex = (originalIndex + offset) % 12`.
4. **Re-Notation**: The `newIndex` is mapped back to its name in the selected notation system (Letter or Solfège).
5. **Visualization**: Each quality has a predefined set of semitone intervals (e.g., Minor triad is `[0, 3, 7]`). These intervals are applied to the transposed root index to determine which physical keys to highlight on the virtual piano.

## Run Locally with Docker

This application is ready to be dockerized for consistent local deployment.

### Prerequisites
- [Docker](https://www.docker.com/get-started) installed on your machine.
- [Docker Compose](https://docs.docker.com/compose/install/) (optional but recommended).

### Using Docker Compose
Simply run the following command in the project root:
```bash
docker-compose up --build
```
The app will be available at `http://localhost:3000`.

### Using Dockerfile Directly
1. Build the image:
   ```bash
   docker build -t chordmaster .
   ```
2. Run the container:
   ```bash
   docker run -p 3000:80 chordmaster
   ```

## Development
This app uses:
- **React 18** + **TypeScript**
- **Tailwind CSS** for styling
- **Lucide React** for iconography
- **Vite** (recommended) or any standard ESM bundler for building.
