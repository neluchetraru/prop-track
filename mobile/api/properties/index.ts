export * from './queries';
export * from './mutations';
export * from './types';

// Re-export functions with better names for backward compatibility
export { getProperties as list } from './queries';
export { getProperty as get } from './queries';
export { createProperty as create } from './mutations';
export { updateProperty as update } from './mutations';
export { deleteProperty as delete } from './mutations';
