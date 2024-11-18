// src/globals.d.ts
export {};

declare global {
  interface Window {
    ZFWidget: {
      init: (id: string, options: any) => void;
    };
  }
}
