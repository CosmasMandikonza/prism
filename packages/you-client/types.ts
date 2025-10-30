export interface SearchResult {
  url: string; title?: string; description?: string;
  page_age?: string; // ISO date from You.com
  snippets?: string[]; favicon_url?: string; thumbnail_url?: string;
}
export interface SearchResponse { results: { web: SearchResult[] } }

export interface ContentsResponse {
  url: string;
  content: string; // normalized text
  title?: string;
  last_modified?: string;
  doc_type?: string; // html/pdf
}

export interface NewsItem {
  url: string; title: string; published_at?: string; source?: string;
}
export interface NewsResponse { results: { items: NewsItem[] } }
