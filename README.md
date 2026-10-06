# Džamija Rečane

The website of Džamija Rečane (Rečane, Prizren, Kosovo): daily prayer times, the Hijri calendar, Qibla direction and tesbih, Qur'an, duas and hadith, and events for the džemat.

The mosque's Facebook page: https://www.facebook.com/share/1JRMQJDnUC/

Live site: https://recanedzamija.com/

## How this site is built and published

Changes are made with [Claude Code](https://claude.ai/code) and merged into `main` on GitHub.
Every push to `main` builds the site and publishes it to GitHub Pages automatically
(see `.github/workflows/deploy.yml`); it is live about a minute later.

Built with TanStack Start, React and Tailwind CSS. `npm run build` prerenders every page to
plain HTML in `dist/`, so the site can be served by any static host.

## Development

You need Node.js and npm.

```sh
git clone https://github.com/hurtialek66-dot/cheer-corner-tool.git
cd cheer-corner-tool
npm i
npm run dev
```

To build for a sub-path (as GitHub Pages does), set `BASE_PATH`, for example
`BASE_PATH=/cheer-corner-tool/ npm run build`.
