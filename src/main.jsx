import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { BrowserRouter } from "react-router";
import { registerSW } from "virtual:pwa-register";
import superjson from "superjson";

// ! internal imports
import App from "./App";
import { trpc } from "./lib/trpc";
import { queryClientDefaults } from "./lib/queryConfig";
import "./index.css";

const queryClient = new QueryClient({ defaultOptions: queryClientDefaults });
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch: (input, init) =>
        globalThis.fetch(input, { ...(init || {}), credentials: "include" }),
    }),
  ],
});

registerSW({ immediate: true });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  </StrictMode>,
);
