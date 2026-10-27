from pathlib import Path
import json
from PIL import Image, ImageOps
root=Path(__file__).resolve().parents[1]
patterns=json.loads((root/'content/patterns.json').read_text(encoding='utf-8'))
products=json.loads((root/'content/products.json').read_text(encoding='utf-8'))
sources={}
for row in patterns:
    image=row.get('image','');thumb=row.get('thumbnail','')
    if thumb.startswith('assets/patterns/thumbnails/'):sources[image]=thumb
for row in products:
    image='assets/'+row.get('image_path','');thumb='assets/'+row.get('thumbnail_path','')
    if thumb.startswith('assets/shop/thumbnails/'):sources[image]=thumb
created=0
for source_name,target_name in sorted(sources.items()):
    source=root/source_name;target=root/target_name
    if not source.is_file():raise SystemExit(f'Missing source image: {source_name}')
    target.parent.mkdir(parents=True,exist_ok=True)
    if target.exists():continue
    with Image.open(source) as original:
        image=ImageOps.exif_transpose(original);image.thumbnail((560,560),Image.Resampling.LANCZOS)
        if image.mode not in ('RGB','RGBA'):image=image.convert('RGBA' if 'transparency' in image.info else 'RGB')
        image.save(target,'WEBP',quality=80,method=6)
    created+=1
print(f'Created {created} thumbnails for {len(sources)} unique source images.')
