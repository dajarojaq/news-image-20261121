# Saturday 21 November 2026 — World News in One Image

An editorial broadsheet visual summary of Saturday, 21 November 2026 world news (`1024x1024` PNG, deterministic), built for make.fun's `news-image-20261121` competition.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

This writes the deterministic `entry.png` image (1024x1024, <= 1 MiB) to `$MAKEFUN_OUTPUT_DIR/entry.png` (or `/output/entry.png` by default) with no network calls.

## Regenerate image locally

```sh
node build.mjs
```
