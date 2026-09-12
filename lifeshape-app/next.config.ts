import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No longer a static export: from Etapa 0 onward this app does live
  // server-side calls to ClassroomIO with a secret API key, which a static
  // export (GitHub Pages) cannot do. The already-published pitch prototype
  // is unaffected — it was built and deployed before this change. The real
  // app will need a Node-capable host (Vercel) once it's ready to ship.
};

export default nextConfig;
