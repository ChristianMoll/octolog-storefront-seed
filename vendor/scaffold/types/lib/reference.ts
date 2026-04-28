export interface LinkReference {
  type: "link";
  link: string;
  openInNewWindow?: boolean;
}

export interface PageFolderReference {
  type: "page-folder";
  pageFolder: { _url: string };
  openInNewWindow?: boolean;
}

export type Reference = LinkReference | PageFolderReference;
