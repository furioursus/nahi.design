// Local Netlify Build Plugin — see docs/deploy-notifications.md.
//
// Runs inside Netlify's own build process (no relay server needed) and posts to Telegram's Bot
// API directly. TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set as Netlify environment
// variables (Site settings → Environment variables) — never hardcode them here or in
// netlify.toml, both of which are committed to this public repo.

import { execSync } from "node:child_process";

// Netlify's standard build env vars expose COMMIT_REF (the SHA) but not the message itself — the
// plugin runs inside the checked-out repo, so `git log` reads it straight from there. Subject
// line only (%s), not the full body, to keep the notification skimmable. Never throws: a shallow
// clone, a detached-HEAD edge case, or any other git hiccup should drop this line, not the build.
function getCommitMessage() {
	try {
		return execSync("git log -1 --pretty=%s", { encoding: "utf8" }).trim() || null;
	} catch {
		return null;
	}
}

// Telegram's `parse_mode: "HTML"` treats <, >, and & as markup — a commit subject is freeform
// text and can contain any of them (e.g. a stray "<" in a description), which would otherwise
// break the message's formatting or silently swallow part of it.
function escapeHtml(text) {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// TELEGRAM_CHAT_ID accepts one ID or a comma-separated list, so the same deploy notification can
// DM several people (e.g. both of you) without standing up a group chat. Whitespace around each
// ID is trimmed so "111, 222" and "111,222" behave the same.
function getChatIds() {
	const raw = process.env.TELEGRAM_CHAT_ID;
	if (!raw) return [];
	return raw
		.split(",")
		.map((id) => id.trim())
		.filter(Boolean);
}

async function sendTelegramMessage(text) {
	const token = process.env.TELEGRAM_BOT_TOKEN;
	const chatIds = getChatIds();

	if (!token || chatIds.length === 0) {
		// Missing credentials shouldn't ever fail a deploy over a notification — just skip, loudly,
		// in the build log.
		console.warn("[telegram-notify] Skipping: TELEGRAM_BOT_TOKEN and/or TELEGRAM_CHAT_ID not set.");
		return;
	}

	// Sent independently per recipient, in parallel, so one bad chat ID (typo, someone blocked the
	// bot) doesn't stop the others from getting notified.
	await Promise.all(
		chatIds.map(async (chatId) => {
			const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					chat_id: chatId,
					text,
					parse_mode: "HTML",
					disable_web_page_preview: true,
				}),
			});

			if (!res.ok) {
				// Same reasoning as above — a Telegram API hiccup (rate limit, bad chat id) shouldn't
				// take the site down with it.
				console.warn(
					`[telegram-notify] Telegram API responded ${res.status} for chat ${chatId}: ${await res.text()}`,
				);
			}
		}),
	);
}

function pick(variants) {
	return variants[Math.floor(Math.random() * variants.length)];
}

// Each variant is [opening line, closing line] — the info line between them (context/branch,
// url or error) stays fixed across all of them, only the flavor text varies. `${site}` is
// interpolated into the opener at call time, not baked into these arrays, so it stays in one
// place rather than duplicated per variant.
const SUCCESS_VARIANTS = [
	["☕💬 Ooh, {site} just deployed — ang bilis naman ng build!", "Letting the whole group chat know — chismis time!"],
	["💅✨ {site} shipped clean, walang drama, walang kaso!", "Grabe, so proud — bongga talaga."],
	["🙏🎉 Thank God, {site} deployed nang matagumpay!", "Lami kaayo — tell everyone, ha!"],
	["📞👀 Ay, such a clean build for {site}, wala talagang aberya!", "Sending the push notification now — don't forget to forward this to the group!"],
	["😌💬 {site} came through fine — di ako nag-alala, alam kong bahala na ang Diyos.", "Okay, merienda break, we're done here."],
	["✨📱 {site} deployed nicely, parang Pasko — complete, walang kulang!", "Ay ang ganda nito — forwarding to everyone now."],
];

const ERROR_VARIANTS = [
	["😩📞 <i>hay nako</i> — {site} just crashed, ambot lang unsa nahitabo!", "Go check the build log before this gets worse, ha."],
	["💢👀 Grabe, {site} has a problem again — bati kaayo!", "Chismis later, but check that deploy log now, ha!"],
	["😤💬 Naku po, {site} didn't deploy — unsa may nahitabo diri?!", "Ambot, just read the log to find out what happened."],
	["🙅‍♀️📱 Ay, this won't do — the build for {site} broke!", "Grabe naman, go check it before Tita gets more worked up."],
	["😖☎️ Uy, {site} just went down — don't panic, but fix it agad!", "Go check the log, baka simpleng typo lang 'yan."],
];

// SITE_NAME/URL/CONTEXT/BRANCH/COMMIT_REF are standard Netlify build environment variables —
// see https://docs.netlify.com/configure-builds/environment-variables/.
export async function onSuccess() {
	const site = process.env.SITE_NAME ?? "site";
	// `URL` is the site's actual domain (custom domain if verified), constant across every
	// deploy regardless of context. `DEPLOY_PRIME_URL` varies by context instead — it's the
	// custom domain only for a genuine production deploy, but a `<branch>--sitename.netlify.app`
	// link for a branch deploy — so it's the fallback here, not the primary.
	const url = process.env.URL ?? process.env.DEPLOY_PRIME_URL;
	const context = process.env.CONTEXT ?? "unknown";
	const branch = process.env.BRANCH ?? "unknown";
	const commitMessage = getCommitMessage();
	const [open, close] = pick(SUCCESS_VARIANTS);

	await sendTelegramMessage(
		`${open.replace("{site}", `<b>${site}</b>`)}\n` +
			`${context} · <code>${branch}</code>\n` +
			(commitMessage ? `💬 ${escapeHtml(commitMessage)}\n` : "") +
			(url ? `${url}\n` : "") +
			`\n${close}`,
	);
}

export async function onError({ error }) {
	const site = process.env.SITE_NAME ?? "site";
	const context = process.env.CONTEXT ?? "unknown";
	const branch = process.env.BRANCH ?? "unknown";
	const commitMessage = getCommitMessage();
	// Telegram caps messages at 4096 chars; keep this well under that so it stays skimmable in a
	// chat notification rather than dumping a full stack trace.
	const message = (error?.message ?? String(error)).slice(0, 500);
	const [open, close] = pick(ERROR_VARIANTS);

	await sendTelegramMessage(
		`${open.replace("{site}", `<b>${site}</b>`)}\n` +
			`${context} · <code>${branch}</code>\n` +
			(commitMessage ? `💬 ${escapeHtml(commitMessage)}\n` : "") +
			`<pre>${escapeHtml(message)}</pre>\n` +
			`\n${close}`,
	);
}
