export interface LanguageOption {
  code: string;
  name: string;
  enabled: boolean;
}

export const languages: LanguageOption[] = [

  {
    code: "en",
    name: "English",
    enabled: true,
  },

  {
    code: "es",
    name: "Spanish",
    enabled: true,
  },

  {
    code: "fr",
    name: "French",
    enabled: false,
  },

  {
    code: "ar",
    name: "Arabic",
    enabled: false,
  },

  {
    code: "sw",
    name: "Swahili",
    enabled: false,
  },

];
