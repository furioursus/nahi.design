import type { Slide } from "@components/Presentation.astro";

import IBMTheBefore from "@img/ibm-the-before.png";
import IBMTheAfter from "@img/ibm-the-after.png";
import IBMWorkshop from "@img/ibm-workshop.jpg";

export const slides: Slide[] = [
	{
		type: "title",
		eyebrow: "Design Lead · 9 months · IBM watsonx",
		title: "Data Lineage",
		subtitle:
			"Turning a 300-step technical diagram into a seconds-to-answer tool for regulated-industry data teams.",
	},
	{
		type: "stat",
		heading: "Why this mattered",
		stats: [
			{ value: "Up to $23M", label: "In fines for regulatory compliance" },
			{ value: "300+", label: "Possible points of failure in a data pipeline" },
			{ value: "Hours", label: "To identify points of failure" },
			{ value: "100+", label: "UI gestures to identify points of failure" },
		],
	},
	{
		type: "text",
		heading: "Ship the Summary View — start focused, stay focused",
		body: [
			"Competitors rendered the full diagram (slow) or forced manual queries (painful).",
			"The Summary View lands users on the simplest level — first source, end consumer — and lets them pull more detail when they need it.",
			"It won concept testing on both desirability and usability. Time-to-value moved from hours to seconds.",
		],
	},
	{
		type: "image",
		image: IBMTheBefore,
		alt: "The original IBM Infosphere data lineage: a cramped technical diagram with no business metadata and details hidden behind hover tooltips.",
		caption:
			"The before. Purely technical metadata, hidden behind hover tooltips — no business context, hard to read.",
	},
	{
		type: "image",
		image: IBMTheAfter,
		alt: "The redesigned data lineage: a clean Summary View showing original sources and end consumers, with controls to expand the upstream and downstream flow on demand.",
		caption:
			"The after. Users control size and scope — expand upstream or downstream only as far as they need.",
	},
	{
		type: "text",
		heading: "Where did the idea come from?",
		body: [
			"No single source gave us the Summary View.",
			"A competitor's pattern, a freshly filed patent, and an internal team's diagram all pointed at the same problem — and each failed differently.",
			"The idea came from naming why all three fell short, and combining what each got right.",
		],
	},
	{
		type: "text",
		heading: "Generalizing beyond the mandate",
		body: [
			"Leadership mandated folding lineage into watsonx alongside Catalog and Quality.",
			"What wasn't mandated: ETL and the AI model team came asking for the same logic, for data that looked nothing like banking transactions.",
			"Six years later, the same patterns still ship in IBM's lineage product.",
		],
	},
	{
		type: "text-image",
		heading: "Bi-weekly co-creation with ING, State Street, and Rabobank",
		body: [
			"Recurring workshops generated and tested solutions in the same loop — desirability and feasibility together, not sequentially.",
			"Concepts arrived pre-validated by the exact buyers we needed to convert.",
		],
		image: IBMWorkshop,
		alt: "IBM workshop attendees gather around me as I facilitate co-creation sessions.",
	},
	{
		type: "stat",
		heading: "Outcomes",
		stats: [
			{ value: "Red Dot Award", label: "Received" },
			{ value: "Up to 90%", label: "Increase in performance" },
			{ value: "$100K+", label: "In new contracts" },
			{ value: "6 years later", label: "Still shipping, still relevant" },
		],
	},
	{
		type: "quote",
		quote:
			"Nahi is a talented designer with an impressive range of skills and experiences. I've never met such a well-rounded designer who is skilled in everything: UX design, producing pixel-perfect hi-fidelity designs, leading workshops, conducting user research independently, defining product requirements, and stakeholder management.",
		subtitle: "Lauren Chen, Co-worker",
	},
	{
		type: "title",
		title: "Thank you",
		subtitle: "Let's talk about what's next.",
	},
];
