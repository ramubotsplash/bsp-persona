import { IndexedEntity } from "./core-utils";
import type { SearchHistoryEntry, EnrichmentData } from "@shared/types";
// A placeholder for the EnrichmentData part of the initial state.
const initialEnrichmentData: EnrichmentData = {
  person: {} as any,
  company: {} as any,
  outreach: {} as any,
};
export class SearchHistoryEntity extends IndexedEntity<SearchHistoryEntry> {
  static readonly entityName = "searchHistory";
  static readonly indexName = "searchHistories";
  static readonly initialState: SearchHistoryEntry = {
    id: "",
    query: { personName: "", title: "", companyName: "", additionalInfo: "" },
    data: initialEnrichmentData,
    timestamp: 0,
    userId: "",
  };
}