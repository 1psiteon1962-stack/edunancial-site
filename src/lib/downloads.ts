export interface DownloadItem {

  id: string;

  title: string;

  filename: string;

  category: string;

}

export const downloads: DownloadItem[] = [

  {
    id: "profit-book",
    title: "Business Is About Profit",
    filename: "business-is-about-profit.pdf",
    category: "Books",
  },

  {
    id: "working-head",
    title: "Working With Your Head",
    filename: "working-with-your-head.pdf",
    category: "Books",
  },

  {
    id: "economic-self-defense",
    title: "Economic Self Defense",
    filename: "economic-self-defense.pdf",
    category: "Books",
  },

];
