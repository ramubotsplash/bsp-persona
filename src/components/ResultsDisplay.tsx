import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { EnrichmentData, Person, Company, Outreach } from '@shared/types';
import {
  User,
  Building,
  Target,
  Linkedin,
  Mail,
} from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react';
interface ResultsDisplayProps {
  data: EnrichmentData;
}
const DataField = ({ label, value }: { label: string; value: React.ReactNode | undefined }) => {
  if (!value) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 py-2 border-b border-border/50">
      <dt className="font-semibold text-sm text-foreground">{label}</dt>
      <dd className="md:col-span-2 text-sm text-muted-foreground">{value}</dd>
    </div>
  );
};
const DataListField = ({ label, items }: { label: string; items: string[] | undefined }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="py-2 border-b border-border/50">
      <p className="font-semibold text-sm text-foreground mb-2">{label}</p>
      <ul className="list-disc list-inside space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-sm text-muted-foreground">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
const PersonTab = ({ person, title }: { person: Person, title?: string }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <User className="w-5 h-5" />
        Person Details
      </CardTitle>
      {title && <CardDescription>{title}</CardDescription>}
    </CardHeader>
    <CardContent className="space-y-1">
      <DataField label="Job Title" value={person.job_title} />
      <DataField label="Persona Type" value={person.persona_type} />
      <DataField label="Industry" value={person.industry_affiliation} />
      <DataField label="LinkedIn" value={person.linkedin_url} />
      <DataField label="Education" value={person.education} />
      <DataField label="Tenure" value={person.tenure_in_company} />
      <DataField label="Influence Type" value={person.decision_influence_type} />
      <DataField label="Recent Post/Comment" value={person.recent_linkedin_comment_or_post} />
      <DataField label="Conference Attendance" value={person.conference_speaker_attendance} />
      <DataField label="Personal Interests" value={person.personal_interests} />
      <DataField label="Awards" value={person.recent_awards_recognition} />
    </CardContent>
  </Card>
);
const CompanyTab = ({ company, title }: { company: Company, title?: string }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Building className="w-5 h-5" />
        Company Details
      </CardTitle>
      {title && <CardDescription>{title}</CardDescription>}
    </CardHeader>
    <CardContent className="space-y-1">
      <DataField label="Website" value={company.website} />
      <DataField label="Description" value={company.description} />
      <DataField label="Industry" value={company.industry} />
      <DataField label="Headquarters" value={company.headquarters_location} />
      <DataField label="Founded" value={company.founded_year} />
      <DataField label="Company Size" value={company.company_size} />
      <DataField label="Revenue Range" value={company.revenue_range} />
      <DataField label="Audience Segment" value={company.primary_audience_market_segment} />
      <DataField label="Pain Category" value={<Badge variant="secondary">{company.pain_category_tag}</Badge>} />
      <DataField label="Solution Fit" value={<Badge variant="secondary">{company.solution_fit_tag}</Badge>} />
      <DataField label="Competitors" value={company.direct_competitor_list} />
    </CardContent>
  </Card>
);
const OutreachTab = ({ outreach, title }: { outreach: Outreach, title?: string }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Target className="w-5 h-5" />
        Outreach Strategy
      </CardTitle>
      {title && <CardDescription>{title}</CardDescription>}
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2 flex items-center gap-2"><Linkedin className="w-4 h-4" /> LinkedIn</h3>
        <div className="space-y-3 text-sm text-muted-foreground p-4 bg-secondary rounded-md">
          <p><strong className="text-foreground">Connection Message:</strong> {outreach.linkedin_connection_message}</p>
          <p><strong className="text-foreground">First Message:</strong> {outreach.linkedin_first_message}</p>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2 flex items-center gap-2"><Mail className="w-4 h-4" /> Email Sequence</h3>
        <Accordion type="single" collapsible className="w-full">
          {outreach.email_sequence.map((email, index) => (
            <AccordionItem value={`item-${index + 1}`} key={index}>
              <AccordionTrigger>Email #{index + 1}</AccordionTrigger>
              <AccordionContent className="whitespace-pre-wrap text-sm text-muted-foreground p-4">
                {email}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <DataListField label="Key Focus Areas" items={outreach.key_focus_areas} />
      <DataListField label="Use Cases (Person)" items={outreach.botsplash_use_cases_person} />
      <DataListField label="Use Cases (Company)" items={outreach.botsplash_use_cases_company} />
    </CardContent>
  </Card>
);
export function ResultsDisplay({ data }: ResultsDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full"
    >
      <Tabs defaultValue="person" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="person"><User className="w-4 h-4 mr-2" />Person</TabsTrigger>
          <TabsTrigger value="company"><Building className="w-4 h-4 mr-2" />Company</TabsTrigger>
          <TabsTrigger value="outreach"><Target className="w-4 h-4 mr-2" />Outreach</TabsTrigger>
        </TabsList>
        <TabsContent value="person" className="mt-4">
          <PersonTab person={data.person} title={data.title} />
        </TabsContent>
        <TabsContent value="company" className="mt-4">
          <CompanyTab company={data.company} title={data.title} />
        </TabsContent>
        <TabsContent value="outreach" className="mt-4">
          <OutreachTab outreach={data.outreach} title={data.title} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}