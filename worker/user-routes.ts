import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad } from './core-utils';
import type { EnrichmentData, SearchQuery, SearchHistoryEntry } from "@shared/types";
import { SearchHistoryEntity } from "./entities";
const mockEnrichmentData: Omit<EnrichmentData, 'title'> = {
	"person": {
		"linkedin_url": "https://www.linkedin.com/in/jennifer-smith-example",
		"job_title": "VP Sales and Operations",
		"tenure_in_company": "3 years 4 months",
		"education": "B.S. in Business Administration",
		"recent_linkedin_comment_or_post": "Commented on a post about Q2 sales strategies.",
		"conference_speaker_attendance": "Attended SaaStr Annual 2023",
		"personal_interests": "Marathon running, mentoring young professionals",
		"industry_affiliation": "Financial Services / Alternative Lending",
		"preferred_communication_channel": "Email",
		"pain_point_indicators": "Mentioned challenges with lead response times in a recent podcast.",
		"decision_influence_type": "Decision Maker",
		"recent_awards_recognition": "2023 Sales Leader of the Year",
		"tool_mentions_or_partnerships": "Salesforce, Outreach.io",
		"engagement_readiness_score": 85,
		"persona_type": "Revenue Executive"
	},
	"company": {
		"company_size": "51-200 employees",
		"primary_audience_market_segment": "Small and medium-sized businesses seeking working capital",
		"industry": "Financial Services / Alternative Lending / Business Financing",
		"revenue_range": "$10M - $50M",
		"growth_rate": "15% YoY",
		"headquarters_location": "New York, NY",
		"website": "https://ibusinessfunding.com",
		"description": "iBusiness Funding is a provider of alternative financing solutions for small and medium-sized businesses, including invoice factoring and working capital products.",
		"founded_year": 2013,
		"marketing_team_size": "5-10 people",
		"sales_team_size": "20-30 people",
		"press_mentions_news_coverage": "Featured in Forbes for innovative lending solutions.",
		"funding_rounds": "Series B, $25M",
		"recent_job_posting": "Hiring for Sales Development Representatives.",
		"recent_job_hiring": "Recently hired a new Director of Marketing.",
		"tech_stack": "Salesforce, Marketo, AWS",
		"partnerships": "Partnered with several accounting software firms.",
		"vendors": "Uses Stripe for payment processing.",
		"customer_acquisition_channels": "Direct sales, online lead generation, broker/partner referrals",
		"known_company_challenges": "Scaling the sales team while maintaining high lead quality.",
		"compliance_changes_affecting_them": "Adapting to new state-level lending regulations.",
		"direct_competitor_list": "Alternative lenders, invoice factoring companies, small business lenders",
		"competitors_customer_engagement_platforms": "Some competitors use Intercom or Drift.",
		"industry_benchmark_performance": "Above average in loan approval speed.",
		"pain_category_tag": "Working Capital / Speed-to-Lead",
		"solution_fit_tag": "Invoice Factoring / Working Capital Solutions",
		"recent_activity": "Launched a new partner portal last month."
	},
  "outreach": {
  	"botsplash_relation": "prospect",
  	"botsplash_use_cases_person": [
  		"Speed-to-lead automation for inbound web, partner, and phone leads",
  		"Intelligent lead routing, prioritization, and SLA workflows for sales and operations",
  		"Unified borrower and broker messaging via SMS, web chat, and email",
  		"Automated reminders for document collection and e-sign tasks",
  		"Real-time visibility and reporting across the funnel",
  		"After-hours and weekend coverage with AI to human handoff",
  		"Compliance controls for TCPA, opt-in, and conversation archiving"
  	],
  	"botsplash_use_cases_company": [
  		"Increase funded applications by engaging borrowers within seconds",
  		"Reduce call volume and no-shows with 2-way SMS and scheduling",
  		"Standardize broker communications and updates at scale",
  		"Multilingual chat support for SMB owners",
  		"Centralize all conversations in one platform integrated with existing CRM or LOS",
  		"Deflect simple support to chat while routing complex cases to the right rep"
  	],
  	"key_focus_areas": [
  		"Sub-30-second speed-to-lead across all channels",
  		"Consolidated broker and broker communications",
  		"Automations for document collection and status updates",
  		"Compliance-first messaging with TCPA and opt-out controls",
  		"Flexible integrations with current CRM or LOS",
  		"After-hours coverage with seamless agent escalation"
  	],
  	"email_subject": "Faster speed-to-lead for SMB financing at iBusiness Funding",
  	"email_sequence": [
  		"Hi Jennifer,\n\nYou lead Sales and Operations at iBusiness Funding, so keeping borrowers and brokers engaged quickly is critical. Botsplash helps SMB lenders respond in seconds and manage all conversations in one place.\n\nWith Botsplash you can:\n- Reply to web, partner, and phone leads in under 30 seconds via SMS or chat\n- Auto-route and prioritize leads to your team with SLA timers\n- Automate doc-collection nudges and status updates\n- Provide after-hours coverage with AI to agent handoff\n\nOpen to a 15-minute overview next week?",
  		"Hi Jennifer,\n\nFollowing up with a bit more detail on outcomes lenders see with Botsplash:\n- 30 to 60 percent faster speed-to-lead and higher contact rates\n- 10 to 25 percent lift in funded deals from improved follow-up\n- 20 to 40 percent fewer inbound calls through 2-way SMS and chat\n- TCPA compliance with opt-in management and conversation archiving\n\nWe plug into your CRM or LOS and centralize SMS, chat, and email so sales and ops share one view of each borrower and broker.\n\nWorth a quick walkthrough to see if this fits your process?",
  		"Hi Jennifer,\n\nCommon hiccups we fix for sales and ops teams:\n- Leads waiting minutes for a first touch\n- Disjointed broker updates across email, phone, and text\n- Manual doc reminders and task follow-ups\n- Limited visibility into conversation history and SLAs\n\nIf this resonates, we can spin up a small pilot on one intake channel or team in about 2 weeks with minimal IT lift.\n\nInterested in exploring a pilot?",
  		"Hi Jennifer,\n\nLast note from me. If timing is not ideal, I can share resources instead:\n- A checklist to get speed-to-lead under 30 seconds\n- A sample borrower messaging playbook for SMB financing\n- A quick ROI model for centralized messaging\n\nWould any of these be helpful?"
  	],
  	"linkedin_connection_message": "Hi Jennifer, I work with lenders at Botsplash to improve speed-to-lead and unify borrower and broker messaging. Would love to connect and share ideas relevant to iBusiness Funding.",
  	"linkedin_first_message": "Thanks for connecting, Jennifer. Quick idea for iBusiness Funding: consolidate SMS, chat, and email so sales and ops hit sub-30-second first responses, automate doc reminders, and stay TCPA compliant. Open to a 15-minute intro?"
  }
};
// Helper to create a stable hash from the search query
async function createQueryHash(query: SearchQuery, userId: string): Promise<string> {
  const sortedQuery = Object.entries(query)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
  const dataToHash = `${userId}|${sortedQuery}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(dataToHash);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.post('/api/enrich', async (c) => {
    const body = await c.req.json<{ query: SearchQuery }>();
    if (!body.query) {
      return bad(c, 'Missing query in request body.');
    }
    const { query } = body;
    // Using a mock user ID since we have simulated auth
    const MOCK_USER_ID = 'user_12345';
    const queryHash = await createQueryHash(query, MOCK_USER_ID);
    const historyEntity = new SearchHistoryEntity(c.env, queryHash);
    const cachedEntry = await historyEntity.getState();
    const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
    if (cachedEntry && cachedEntry.id && (Date.now() - cachedEntry.timestamp < TWO_HOURS_MS)) {
      console.log(`Returning cached data for query hash: ${queryHash}`);
      return ok(c, { ...cachedEntry.data, title: `(Cached) ${cachedEntry.data.title}` });
    }
    console.log(`Fetching new data for query hash: ${queryHash}`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network latency
    const timestamp = new Date();
    const newTitle = `${query.personName || 'Person'} at ${query.companyName || 'Company'} - Enriched on ${timestamp.toLocaleString()}`;
    const newEnrichmentData: EnrichmentData = {
      ...mockEnrichmentData,
      title: newTitle,
    };
    const newHistoryEntry: SearchHistoryEntry = {
      id: queryHash,
      query: query,
      data: newEnrichmentData,
      timestamp: timestamp.getTime(),
      userId: MOCK_USER_ID,
    };
    await SearchHistoryEntity.create(c.env, newHistoryEntry);
    return ok(c, newEnrichmentData);
  });
  app.get('/api/history', async (c) => {
    try {
      const { items } = await SearchHistoryEntity.list(c.env);
      // In a real app, you would filter by userId. For this demo, we return all.
      // We also sort by timestamp descending to show the most recent first.
      const sortedItems = items.sort((a, b) => b.timestamp - a.timestamp);
      return ok(c, sortedItems);
    } catch (error) {
      console.error('Failed to fetch search history:', error);
      return bad(c, 'Could not retrieve search history.');
    }
  });
}