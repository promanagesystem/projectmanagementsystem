// resources/js/utils/route.ts
import { route as ziggyRoute, Config } from 'ziggy-js';
import { Ziggy } from '../routes'; // asumsi route.ts ada di utils/
 // named import dari routes.js

// Fungsi route wrapper untuk TypeScript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const route = (name: string, params?: any, absolute = true): string => {
  // ZiggyConfig hasil generate Laravel kadang tidak 100% sama tipe Config
  return ziggyRoute(name, params ?? {}, absolute, Ziggy as unknown as Config).toString();
};
