import type { ImageMetadata } from "astro";

import ibmThumb from "../img/ibm_thumb.png";
import qlThumb from "../img/ql_thumb.png";
import quantalyricDesktopFilter from "../img/quantalyric-desktop-filter.png";

export interface CaseStudyMeta {
	id: string;
	title: string;
	heroImage: ImageMetadata;
	heroImageAlt: string;
	status: string;
	statusLastUpdated: Date;
	services: string[];
	tags: string[];
	thumbSummary: string;
	summary: string;
	gridThumbImage: ImageMetadata;
}

export const caseStudies: CaseStudyMeta[] = [
	{
		id: "ibm-data-lineage",
		title: "From Hours to Seconds: Redesigning Data Lineage at IBM",
		heroImage: ibmThumb,
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
	},
];
