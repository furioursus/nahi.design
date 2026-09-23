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
		title: "Designing HIV care for the people outreach was missing",
		blurb:
			"Arizona's HIV portal was losing the people its programs most needed to reach. I chose to design for them first, cut a quiz that tested well down to one question, and bounce rates fell by 60%.",
		meta: "3 months · solo",
		thumb: hivazThumb,
		thumbAlt: "The HIVAZ.org status-check screen, reading \"OK. Let's start. Tap your status.\" with three icon choices",
	},
	{
		slug: "ibm-data-lineage",
		label: "IBM",
		eyebrow: "Product design · IBM",
		title: "Drawing less of the map for the questions banks ask every day",
		blurb:
			"IBM's lineage tool was built for audits and took hours to draw. I made a folded view the everyday default and kept the full map one click away. Load times fell by up to 90%, and the redesign won a Red Dot Award.",
		meta: "9 months · design lead",
		thumb: ibmThumb,
		thumbAlt: "IBM Watson Knowledge Catalog's data lineage view, showing a lineage graph tracing SAVINGS_ACCOUNTS through source tables to final reports and models",
	},
	{
		slug: "hpe-ai-troubleshooting-agent",
		label: "HPE",
		eyebrow: "Product design · HPE",
		title: "Selling the big idea, shipping the smallest one",
		blurb:
			"Leadership asked for an AI feature, but interviews pointed to guilt, not missing tools. I won buy-in with a north star prototype and shipped its smallest form in a week. The team was laid off the week after.",
		meta: "1 week · solo",
		thumb: hpeThumb,
		thumbAlt: "An internal log viewer at HPE with an AI chat panel open beside it, explaining a pipeline failure",
	},
	{
		slug: "quantalyric-mvp",
		label: "QuantaLyric",
		eyebrow: "Product design · QuantaLyric",
		title: "Helping a founder find the one chart worth building",
		blurb:
			"A pre-seed founder wanted three products, and I had forty hours. Asking where the value lived and who it was for led us to one chart for energy traders. I designed the rest and built only that.",
		meta: "40 hours · solo",
		thumb: quantalyricThumb,
		thumbAlt: "QuantaLyric's demand forecast dashboard, a dark-themed chart comparing two models against actual demand with an open detail tooltip",
	},
];
