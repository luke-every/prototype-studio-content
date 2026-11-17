export type StoryModule = { default: { component?: unknown; args?: Record<string, unknown> } } & Record<string, unknown>;
export const stories: Record<string, { name: string; load: () => Promise<StoryModule> }>;
