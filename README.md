# Džamija Rečane

The website of Džamija Rečane (Rečane, Prizren, Kosovo): daily prayer times, the Hijri calendar, Qibla direction and tesbih, Qur'an and duas, events, and services for the džemat.

Based on the mosque's Facebook page: https://www.facebook.com/share/1DBXqaMakv/?mibextid=wwXIfr

## How this site is built

Changes are made with [Claude Code](https://claude.ai/code) and pushed to `main` on GitHub.
[Lovable](https://lovable.dev/projects/ac936922-1f57-41af-8879-8cdca885fe45) stays connected in the background: it syncs `main`, hosts the mosque photos and publishes the live site.

Built with TanStack Start, React and Tailwind CSS.

## Development

You need Node.js and npm.

```sh
git clone https://github.com/hurtialek66-dot/cheer-corner-tool.git
cd cheer-corner-tool
npm i
npm run dev
```

The mosque photos are served by Lovable, so they only appear in the Lovable preview and on the published site, not when running locally.
