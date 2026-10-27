#!/usr/bin/env python3
"""Split four reviewed 2x3 AI-authored AR layer atlases into aligned PNGs."""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ATLAS_DIR = ROOT / "docs" / "ar-layered" / "sources"
OUTPUT_DIR = ROOT / "assets" / "ar-assets" / "layers"

SETS = {
    "caisson-sui": (
        "caisson-six-layer-atlas.png",
        ("rear-frame", "outer-ornaments", "main-petals", "jade-interleaves", "center-rays", "pearl-crescents"),
    ),
    "tuanshan-window-qing": (
        "tuanshan-six-layer-atlas.png",
        ("walnut-medallion", "gem-rim", "clover-openings", "blue-rosette", "ivory-blossoms", "center-boss"),
    ),
    "haitang-window-ming": (
        "haitang-six-layer-atlas.png",
        ("jade-backplate", "navy-frame", "turquoise-lobes", "blue-inner-petals", "coral-inlays", "center-jewels"),
    ),
    "pipa-ornament-tang": (
        "pipa-six-layer-atlas.png",
        ("scalloped-ground", "gold-quatrefoil", "jade-petals", "dark-petals", "filigree-heart", "corner-rosettes"),
    ),
}


def main() -> None:
    for motif_id, (filename, layer_names) in SETS.items():
        atlas_path = ATLAS_DIR / filename
        with Image.open(atlas_path) as source:
            atlas = source.convert("RGBA")
        if atlas.size != (1024, 1536):
            raise ValueError(f"{atlas_path} must be 1024x1536, got {atlas.size}")

        out_dir = OUTPUT_DIR / motif_id
        out_dir.mkdir(parents=True, exist_ok=True)
        for index, layer_name in enumerate(layer_names):
            col, row = index % 2, index // 2
            cell = atlas.crop((col * 512, row * 512, (col + 1) * 512, (row + 1) * 512))
            alpha = cell.getchannel("A")
            # Drop only very faint atlas haze while retaining antialiased embroidery edges.
            alpha = alpha.point(lambda value: 0 if value < 28 else value)
            cell.putalpha(alpha)
            if alpha.getbbox() is None:
                raise ValueError(f"Empty layer {motif_id}/{layer_name}")
            cell.save(out_dir / f"layer_{index + 1:02d}_{layer_name}.png", optimize=True)


if __name__ == "__main__":
    main()
