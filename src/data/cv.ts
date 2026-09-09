export interface ExperienceItem {
	role: string;
	org: string;
	date: string;
	location?: string;
	bullets: string[];
}

export interface EducationItem {
	role: string;
	org: string;
	date: string;
}

export const competencies: string[] = [
	"End-to-End Product Design",
	"Design Systems (0-to-1)",
	"UX Research",
	"Service Design",
	"Cross-Functional Leadership",
	"Accessibility (WCAG 2.2)",
];

export const experience: ExperienceItem[] = [
	{
		role: "Career Break",
		org: "Health and Well-Being Break",
		date: "Nov 2024 – Present",
		bullets: [
			"Took an intentional year away from full-time work to prioritize long-term health after nearly a decade without extended time off, partnering with healthcare providers to establish a sustainable, long-term health management plan.",
			"Took on one fixed-fee consulting engagement during this period (see DecisionSigma.ai, below).",
		],
	},
	{
		role: "UX Design Consultant",
		org: "DecisionSigma.ai",
		date: "Nov 2024 – Nov 2025",
		location: "United States (Remote) · consulting engagement during Health and Well-Being Break",
		bullets: [
			"Redesigned the forecast chart component to support both simplified and detailed model views, reducing cognitive load for non-technical stakeholders while preserving analytical depth for energy engineers.",
			"Led end-to-end product design across four disciplines: UX research, product strategy, UI design, and design systems, as the sole designer on a 90-hour engagement spanning five distinct product surfaces.",
		],
	},
	{
		role: "Product Designer to Sr. Product Designer",
		org: "Hewlett Packard Enterprise",
		date: "Mar 2023 – Nov 2024",
		location: "New York, United States",
		bullets: [
			"Held design function as sole designer through the Pachyderm acquisition and subsequent team reduction, maintaining product continuity and design output across a contracting organization.",
			"Built a WCAG 2.2-compliant design system in four months for two cross-functional teams, delivering production-ready components and documentation before a department restructure halted release.",
			"Led research-driven redesign of the highest-friction user flows, reducing inbound support volume and freeing engineering cycles from triage toward roadmap delivery.",
			"Established cross-team design and development workflow standards in Jira, reducing design-to-engineering handoff friction and enabling more predictable sprint planning across product and engineering.",
		],
	},
	{
		role: "Product Designer",
		org: "Pachyderm Inc.",
		date: "May 2021 – Mar 2023",
		location: "Oakland, CA",
		bullets: [
			"Shipped multiple major product features across the platform, contributing to company growth from Series B funding through successful acquisition by Hewlett Packard Enterprise.",
			"Built a bi-weekly user research practice from scratch, embedding usability testing into the product development cycle and reducing late-stage design rework through earlier signal collection.",
		],
	},
	{
		role: "User Experience Designer",
		org: "IBM",
		date: "Jan 2019 – Apr 2021",
		location: "San Jose, CA",
		bullets: [
			"Led design of watsonx Data Lineage from brief to ship (two-person UX team, three named enterprise banking partners, nine months), securing $100K+ in new contracts and three new Fortune 500 clients. Received a Red Dot Award; the work remains in production six years after delivery.",
			"Owned design of IBM Data Privacy, a new watsonx product enabling automated privacy-policy enforcement on provisioned datasets; managed a design intern and researcher from zero to shipped across a large, ambiguous scope; core product architecture persists in IBM Software Hub today.",
			"Generalized the Data Lineage pattern beyond the original three-team mandate to serve ETL, AI model, and additional internal teams, negotiating adoption across seven teams without formal authority. The abstraction remained in production through six subsequent years of development.",
			"Ran co-creation workshops with enterprise clients including ING, State Street, Rabobank, GM, and Ford across three time zones to validate and pressure-test designs for two major watsonx platform products.",
		],
	},
	{
		role: "Design Strategist",
		org: "Asian & Pacific Islander American Health Forum",
		date: "Apr 2017 – Oct 2018",
		location: "Oakland, California",
		bullets: [
			"Provided capacity-building services to federally funded HIV clinics nationwide as part of Capacity for Health, a CDC-funded initiative; personally partnered with at least 10 organizations across the United States.",
			"Researched and designed HIVAZ.org, a statewide HIV care connection platform for Arizona's Department of Health and Human Services and Aunt Rita's Foundation.",
			"Led a statewide service-delivery evaluation for Washington State, identifying capacity gaps across funded grantees and driving a major process shift, including a new statewide resource clearinghouse.",
			"Developed Design Thinking trainings and a CDC-approved brand development curriculum for the national provider network; trained 30+ personnel and coached leadership on human-centered problem-solving.",
			"Led concept development, theory of change, and information architecture for one of the first online education platforms in the HIV healthcare field.",
		],
	},
];

export const education: EducationItem[] = [
	{ role: "UX Design Immersive", org: "General Assembly", date: "2016" },
	{ role: "B.S., Hospitality & Tourism Management", org: "San Francisco State University, College of Business", date: "2012 – 2015" },
];

export const certifications: string[] = [
	"Enterprise Design Thinking Practitioner",
	"Certificate of Achievement: Design Maximizer",
	"CDC-Sponsored Training for HIV Counselor Trainers",
];
