import { RetailerAdapter } from "./types";
import { GenericRetailerAdapter } from "./generic-adapter";
import { ZaraAdapter } from "./zara-adapter";
import { HmAdapter } from "./hm-adapter";

export class AdapterRegistry {
  private adapters: RetailerAdapter[] = [];
  private fallbackAdapter: RetailerAdapter;

  constructor() {
    this.fallbackAdapter = new GenericRetailerAdapter();
    this.register(new ZaraAdapter());
    this.register(new HmAdapter());
  }

  register(adapter: RetailerAdapter): void {
    this.adapters.push(adapter);
  }

  resolve(url: URL): RetailerAdapter {
    for (const adapter of this.adapters) {
      if (adapter.canHandle(url)) {
        return adapter;
      }
    }
    return this.fallbackAdapter;
  }

  getAll(): RetailerAdapter[] {
    return [...this.adapters, this.fallbackAdapter];
  }
}

export const adapterRegistry = new AdapterRegistry();

