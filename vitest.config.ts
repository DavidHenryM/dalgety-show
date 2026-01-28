import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: [
      {
        find: /^@\/(.*)$/,
        replacement: `${path.resolve(rootDir, ".")}/$1`
      },
      {
        find: /^@app\/(.*)$/,
        replacement: `${path.resolve(rootDir, "app")}/$1`
      },
      {
        find: /^@lib\/(.*)$/,
        replacement: `${path.resolve(rootDir, "app/lib")}/$1`
      },
      {
        find: /^@components\/(.*)$/,
        replacement: `${path.resolve(rootDir, "app/components")}/$1`
      },
      {
        find: /^@generated\/(.*)$/,
        replacement: `${path.resolve(rootDir, "app/generated/prisma")}/$1`
      }
    ]
  },
  test: {
    globals: true,
    setupFiles: ["./test/setup-env.ts", "./test/setup.tsx"],
    maxConcurrency: 1,
    poolOptions: {
      threads: {
        minThreads: 1,
        maxThreads: 1
      }
    },
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          environment: "node",
          include: ["test/**/*.node.test.ts"],
          setupFiles: ["./test/setup-env.ts", "./test/setup.tsx"]
        }
      },
      {
        extends: true,
        test: {
          name: "jsdom",
          environment: "jsdom",
          include: ["test/**/!(*.node).test.{ts,tsx}"],
          setupFiles: ["./test/setup-env.ts", "./test/setup.tsx"]
        }
      }
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["app/**/*.{ts,tsx}"],
      exclude: [
        "app/generated/**",
        "app/**/*.d.ts",
        "app/**/globals.css",
        "app/**/types/**"
      ]
    }
  }
});
