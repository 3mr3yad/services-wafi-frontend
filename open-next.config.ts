import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// No incremental cache yet: pages are dynamic or statically generated.
// Add an R2 incremental cache here only when a page adopts ISR.
export default defineCloudflareConfig({});
