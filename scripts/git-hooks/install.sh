#!/bin/bash
# Install kenimoto-dev git hooks as symlinks into .git/hooks/
#
# Run once after `git clone`:
#   ./scripts/git-hooks/install.sh
#
# Re-run after adding new hooks. Existing files at .git/hooks/<name> are
# backed up to <name>.bak before being replaced.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
HOOKS_SRC="$REPO_ROOT/scripts/git-hooks"
HOOKS_DST="$REPO_ROOT/.git/hooks"

[ -d "$HOOKS_DST" ] || { echo "error: $HOOKS_DST not found — is this a git working tree?" >&2; exit 1; }

installed=0
for src in "$HOOKS_SRC"/*; do
  name=$(basename "$src")
  # Skip the installer itself and any non-hook files
  case "$name" in
    install.sh|README*|*.md) continue ;;
  esac

  chmod +x "$src"
  dst="$HOOKS_DST/$name"

  if [ -L "$dst" ] && [ "$(readlink "$dst")" = "$src" ]; then
    echo "  ok: $name (already linked)"
  else
    if [ -e "$dst" ] && [ ! -L "$dst" ]; then
      mv "$dst" "$dst.bak"
      echo "  backup: $name → $name.bak"
    fi
    ln -sf "$src" "$dst"
    echo "  installed: $name"
    installed=$((installed + 1))
  fi
done

echo ""
echo "Done. $installed hook(s) newly installed."
