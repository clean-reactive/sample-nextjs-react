import { rmSync } from 'node:fs';

// Removes the data files given as CLI args so the server boots against a
// clean store. Runs *before* the server starts: the in-file repos seed a
// missing file in their constructor but read it unguarded afterwards, so a
// mid-run delete would throw ENOENT.
for (const file of process.argv.slice(2)) {
  rmSync(file, { force: true });
}
