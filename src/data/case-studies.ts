import type { ImageMetadata } from "astro";

import ibmThumb from "@img/ibm_thumb.png";
import qlThumb from "@img/ql_thumb.png";
import hpeThumb from "@img/hpe-ai_thumb.png";
import ibmDataLineageVideo from "@video/ibm-data-lineage-hero.mp4";
import quantalyricDesktopFilter from "@img/quantalyric-desktop-filter.png";
import hpeAITroubleshootingAgent from "@img/hpe-ai-troubleshooting-agent.png";

export interface CaseStudyMeta {
	id: string;
	title: string;
	heroImage: ImageMetadata | string;
	heroImageAlt: string;
	status: string;
	statusLastUpdated: Date;
	services: string[];
	tags: string[];
	thumbSummary: string;
	summary: string;
	gridThumbImage: ImageMetadata;
	summaryDetail: string;
	theAsk: string;
	theApproach: string;
	theOutcome: string;
}

export const caseStudies: CaseStudyMeta[] = [
	{
		id: "ibm-data-lineage",
		title: "From Hours to Seconds: Redesigning Data Lineage at IBM",
		heroImage: ibmDataLineageVideo,
		heroImageAlt: "IBM data lineage visualization interface",
		status: "Shipped",
		statusLastUpdated: new Date("2019-01-01"),
		services: ["Product Design", "UX Research", "Data Visualization"],
		tags: ["IBM", "DevOps", "Data Visualization"],
		thumbSummary:
			"As design lead, drove the full research, concept, and delivery process to replace IBM Infosphere with a performant, watsonx-integrated data lineage experience, cutting retrieval time from hours to seconds and earning a Red Dot Award.",
		summary:
			"As design lead, drove the full research, concept, and delivery process to replace IBM Infosphere with a performant, watsonx-integrated data lineage experience, cutting retrieval time from hours to seconds and earning a Red Dot Award.",
		gridThumbImage: ibmThumb,
		summaryDetail:
			"Data lineage is crucial for compliance. Close collaboration with ING, State Street, and Rabobank, along with user research cycles run in parallel, led us to immediately valuable and desirable designs.",
		theAsk:
			"IBM Infosphere was a decade old and being folded into the new watsonx platform. The brief: modernize data lineage, improve performance, and embed it where enterprise users actually work.",
		theApproach:
			"I led a three-person UX team, ran co-creation workshops with ING, State Street, and Rabobank, and partnered with engineering, product, research, and clients across three time zones to ship a redesign that won contracts and a Red Dot Award.",
		theOutcome:
			"Loading time decreased by up to 90%. Multiple new design patterns adopted by IBM.",
	},
	{
		id: "quantalyric-mvp",
		title: "From Grand Vision to Shippable MVP",
		heroImage: quantalyricDesktopFilter,
		heroImageAlt: "QuantaLyric DecisionSigma dashboard interface",
		status: "PoC Shipped",
		statusLastUpdated: new Date("2025-01-01"),
		services: [
			"Product UX/UI",
			"Web Design",
			"Brand Identity",
			"Design Systems",
		],
		tags: ["QuantaLyric", "BI Dashboard"],
		thumbSummary:
			"A full-stack engagement designing the MVP, brand, and design system for QuantaLyric's DecisionSigma, an AI energy forecasting tool launching to Australian traders.",
		summary:
			"QuantaLyric's energy traders were comparing their AI forecasts against government projections in a tool that didn't exist yet. I had 90 hours, one part-time developer, and a founder whose vision was three products wide. The job was to find the one thing that would get them funded and build only that.",
		gridThumbImage: qlThumb,
		summaryDetail:
			"My client's grand vision was a unified surface for ML engineers, data scientists, and energy traders.",
		theAsk:
			"Ship an MVP energy forecasting product, MLOps features to support the energy trader experience, and an investor-ready marketing site, in parallel.",
		theApproach:
			"Cut scope to the value prop. Used Radix UI to move fast, then custom-built where it mattered.",
		theOutcome:
			"Proof of concept built, and actively pursuing investors for seed funding.",
	},
	{
		id: "hpe-ai-troubleshooting-agent",
		title: "An AI Troubleshooting Agent for HPE",
		heroImage: hpeAITroubleshootingAgent,
		heroImageAlt: "HPE AI troubleshooting agent interface",
		status: "PoC Shipped",
		statusLastUpdated: new Date("2024-01-01"),
		services: ["Product UX/UI"],
		tags: ["HPE", "Debugging, Agentic AI"],
		thumbSummary:
			"Built a coded proof of concept AI agent that diagnosed and suggested fixes to data pipeline errors, helping data scientists and ML engineers reduce the cost of compute spend by $10k+ per day.",
		summary:
			"Data Scientists felt guilty they couldn't help ML Engineers debug infrastructure problems in their data pipeline used to run an AI model. User research and a design workshop opened up new ways of thinking about product direction, starting with a RAG-powered AI assistant that reads logs and docs, then hands both roles a shared starting point. Built as a coded proof-of-concept, scoped for in-depth user testing.",
		gridThumbImage: hpeThumb,
		summaryDetail:
			"Learning that our data scientist users <strong>felt guilty</strong> when not being able to support ML engineers with infrastructure issues (especially on small data science teams) might seem like a foot note to others. But to me, it reads as crucial opportunity being missed. The timing was right. Roadmap planning for the next quarter was coming up, and there was space for riskier projects.",
		theAsk:
			"Data Scientists and ML Engineers sit on opposite sides of a brittle handoff. When pipelines fail, neither has the full context the other needs.",
		theApproach:
			"Start shifting our product philosophy. Instead of assuming that providing more technology will fix the user experience, move to create UX that supports users through difficult events like pipeline failures.",
		theOutcome:
			"I designed an AI assistant that reads the logs and the docs, then suggests the appropriate fixes. Moreover, shifted the entire point of view of the product team. ",
	},
];
