import { Region } from "./region";

export type ContentRegistry = {
  title: string;
  description: string;
};

export function getContent(region: Region): ContentRegistry {
  return {
    title: "Edunancial",
    description: `Financial literacy platform – Region: ${region}`
  };
}
