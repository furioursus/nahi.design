export interface ExperienceItem {
	role: string;
	org?: string;
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
	"End-to-end product design",
	"Design systems, zero to one",
	"Research built into the sprint",
	"WCAG 2.2",
	"Sole designer on small teams",
	"Enterprise client workshops",
];

export const experience: ExperienceItem[] = [
	{
		role: "UX Design Consultant",
		org: "DecisionSigma.ai",
		date: "Nov 2024 – Nov 2025",
		location: "United States (Remote)",
		bullets: [
			"Redesigned the forecast chart component to support both simplified and detailed model views, reducing cognitive load for non-technical stakeholders while preserving analytical depth for energy engineers.",
			"Led end-to-end product design across four disciplines: UX research, product strategy, UI design, and design systems, as the sole designer on a 90-hour engagement spanning five distinct product surfaces.",
		],
	},
	{
		role: "Career break",
		date: "Nov 2024 – Present",
		bullets: ["Time away from full-time work for health, with one consulting engagement during the period."],
	},
	{
		role: "Product Designer to Sr. Product Designer",
		org: "Hewlett Packard Enterprise",
		date: "Mar 2023 – Nov 2024",
		location: "New York, United States",
		bullets: [
			"Held design function as sole designer through the Pachyderm acquisition and subsequent team reduction, maintaining product continuity and design output across a contracting organization.",
			"Delivered a WCAG 2.2 compliant design system for two cross-functional teams in four months, production-ready down to the documentation, before a department restructure halted release.",
			"Redesigned the highest-friction user flows after research, cutting inbound support volume and giving engineering back time that had been going to triage.",
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
			"Led design of watsonx Data Lineage from brief to ship in nine months, with a two-person UX team and three named enterprise banking partners, securing $100K+ in new contracts and three new Fortune 500 clients.",
			"The work won a Red Dot Award and is still in production six years after delivery.",
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
	"CDC-Sponsored Training for HIV Counselor Trainers",
];
