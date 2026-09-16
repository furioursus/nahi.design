import type { ImageMetadata } from "astro";

import hivazThumb from "@img/homepage-05.webp";
import ibmThumb from "@img/homepage-06.webp";
import hpeThumb from "@img/homepage-07.webp";
import quantalyricThumb from "@img/homepage-08.webp";

export interface CaseStudyCard {
	slug: string;
	label: string;
	eyebrow: string;
	title: string;
	blurb: string;
	meta: string;
	thumb: ImageMetadata;
	thumbAlt: string;
}

export const caseStudies: CaseStudyCard[] = [
	{
		slug: "hivaz-hiv-care-arizona",
		label: "HIVAZ.org",
		eyebrow: "UX design · Aunt Rita's Foundation",
		title: "Redesigning the front door to HIV care in Arizona",
		blurb:
			"Broken links and a maze of unsorted providers were burying the people who needed care most. Three concepts tried to fix it with more structure. The one that worked asked a single question, then got out of the way.",
		meta: "3 months · solo",
		thumb: hivazThumb,
		thumbAlt: "The HIVAZ.org status-check screen, reading \"OK. Let's start. Tap your status.\" with three icon choices",
	},
	{
		slug: "ibm-data-lineage",
		label: "IBM",
		eyebrow: "Product design · IBM",
		title: "Data lineage that answers in seconds, not hours",
		blurb:
			"IBM's decade-old tracing tool took hours to draw a map an auditor needed instantly. Showing almost nothing, then letting people ask for more, cut load times by up to 90% and won a Red Dot Award.",
		meta: "9 months · design lead",
		thumb: ibmThumb,
		thumbAlt: "IBM Watson Knowledge Catalog's data lineage view, showing a lineage graph tracing SAVINGS_ACCOUNTS through source tables to final reports and models",
	},
	{
		slug: "hpe-ai-troubleshooting-agent",
		label: "HPE",
		eyebrow: "Product design · HPE",
		title: "Debugging's hardest step was asking for help",
		blurb:
			"Ten out of ten interviews wanted something leadership hadn't asked for: a way to know whether a failure was theirs before they had to ask an engineer. Built and shipped in a week, the week before the team was laid off.",
		meta: "1 week · solo",
		thumb: hpeThumb,
		thumbAlt: "An internal log viewer at HPE with an AI chat panel open beside it, explaining a pipeline failure",
	},
	{
		slug: "quantalyric-mvp",
		label: "QuantaLyric",
		eyebrow: "Product design · QuantaLyric",
		title: "Forty hours, one chart worth funding",
		blurb:
			"A founder's vision spanned three products. Forty hours of contract time meant finding the one chart that would get the company funded, designing everything around it, and building only that.",
		meta: "40 hours · solo",
		thumb: quantalyricThumb,
		thumbAlt: "QuantaLyric's demand forecast dashboard, a dark-themed chart comparing two models against actual demand with an open detail tooltip",
	},
];
