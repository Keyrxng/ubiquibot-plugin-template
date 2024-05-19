import { EmitterWebhookEvent as WebhookEvent, EmitterWebhookEventName as WebhookEventName } from "@octokit/webhooks";
import { Octokit } from "@octokit/rest";
import { PluginSettings } from "./plugin-input";
import { createAdapters } from "../adapters";

export type SupportedEvents = "issue_comment.created"; // Add more events here

export interface Context<T extends WebhookEventName = SupportedEvents> {
  eventName: T;
  payload: WebhookEvent<T>["payload"];
  octokit: InstanceType<typeof Octokit>;
  adapters: ReturnType<typeof createAdapters>;
  config: PluginSettings;
  env: {
    GITHUB_TOKEN: string;
    SUPABASE_URL: string;
    SUPABASE_KEY: string;
  };
  logger: {
    fatal: (message: unknown, ...optionalParams: unknown[]) => void;
    error: (message: unknown, ...optionalParams: unknown[]) => void;
    warn: (message: unknown, ...optionalParams: unknown[]) => void;
    info: (message: unknown, ...optionalParams: unknown[]) => void;
    debug: (message: unknown, ...optionalParams: unknown[]) => void;
  };
}
