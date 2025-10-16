export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// For the new multi-field search form
export interface SearchQuery {
  personName: string;
  title: string;
  companyName: string;
  additionalInfo: string;
}
// Persona App Specific Types
export interface Person {
  linkedin_url: string;
  job_title: string;
  tenure_in_company: string;
  education: string;
  recent_linkedin_comment_or_post: string;
  conference_speaker_attendance: string;
  personal_interests: string;
  industry_affiliation: string;
  preferred_communication_channel: string;
  pain_point_indicators: string;
  decision_influence_type: string;
  recent_awards_recognition: string;
  tool_mentions_or_partnerships: string;
  engagement_readiness_score: number;
  persona_type: string;
}
export interface Company {
  company_size: string;
  primary_audience_market_segment: string;
  industry: string;
  revenue_range: string;
  growth_rate: string;
  headquarters_location: string;
  website: string;
  description: string;
  founded_year: number;
  marketing_team_size: string;
  sales_team_size: string;
  press_mentions_news_coverage: string;
  funding_rounds: string;
  recent_job_posting: string;
  recent_job_hiring: string;
  tech_stack: string;
  partnerships: string;
  vendors: string;
  customer_acquisition_channels: string;
  known_company_challenges: string;
  compliance_changes_affecting_them: string;
  direct_competitor_list: string;
  competitors_customer_engagement_platforms: string;
  industry_benchmark_performance: string;
  pain_category_tag: string;
  solution_fit_tag: string;
  recent_activity: string;
}
export interface Outreach {
  botsplash_relation: string;
  botsplash_use_cases_person: string[];
  botsplash_use_cases_company: string[];
  key_focus_areas: string[];
  email_subject: string;
  email_sequence: string[];
  linkedin_connection_message: string;
  linkedin_first_message: string;
}
export interface EnrichmentData {
  title?: string;
  person: Person;
  company: Company;
  outreach: Outreach;
}
export interface SearchHistoryEntry {
  id: string; // A unique ID for the history entry, a hash of the query + userId
  query: SearchQuery;
  data: EnrichmentData;
  timestamp: number;
  userId: string;
}