# React + Vite

## API configuration

Set `VITE_API_URL` to the public backend API base URL (including `/api`) when
building the production client, for example `https://api.example.com/api`.
For Vercel, set this in the project's Environment Variables for every deployment
environment you use, then redeploy. Do not set it to the frontend's Vercel URL:
the SPA rewrite serves `index.html` for frontend routes and is not an API proxy.
Production builds without a valid external backend URL fail API requests with a
configuration error rather than sending them to the frontend rewrite.
Local development defaults to `http://localhost:5000/api`.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
