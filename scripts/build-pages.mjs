/**
 * Publication GitHub Pages : `npm run build:pages` -> dossier `out/`.
 *
 * Les routes serveur (/api/contact, /selftest) n'ont pas leur place dans un
 * export statique : elles sont écartées le temps du build, puis remises en
 * place — même en cas d'échec — pour que le dépôt reste intact.
 */
import { spawnSync } from "node:child_process";
import { existsSync, rmSync, cpSync } from "node:fs";
import path from "node:path";

const HOLD = path.resolve(".pages-hold");
const MOVES = ["app/api", "app/selftest"];
const moved = [];

function run(cmd, args, env = {}) {
  const r = spawnSync(cmd, args, { stdio: "inherit", env: { ...process.env, ...env }, shell: process.platform === "win32" });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(" ")} a échoué (${r.status})`);
}

try {
  rmSync(HOLD, { recursive: true, force: true });
  rmSync("out", { recursive: true, force: true });
  rmSync(".next", { recursive: true, force: true });
  for (const rel of MOVES) {
    if (!existsSync(rel)) continue;
    const dest = path.join(HOLD, rel);
    cpSync(rel, dest, { recursive: true });
    rmSync(rel, { recursive: true, force: true });
    moved.push(rel);
  }
  run("npx", ["next", "build"], { STATIC_EXPORT: "1" });
  run("node", ["scripts/optimize-images.mjs"]);
} finally {
  for (const rel of moved) {
    rmSync(rel, { recursive: true, force: true });
    cpSync(path.join(HOLD, rel), rel, { recursive: true });
  }
  rmSync(HOLD, { recursive: true, force: true });
  rmSync(".next", { recursive: true, force: true });
}
