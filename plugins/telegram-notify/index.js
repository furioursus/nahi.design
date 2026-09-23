// Local Netlify Build Plugin — see docs/deploy-notifications.md. Secrets live in Netlify env vars only; this repo is public.

import { execSync } from "node:child_process";

// Netlify exposes the SHA but not the message; never throws — see docs/deploy-notifications.md "Gotchas".
function getCommitMessage() {
	try {
		return execSync("git log -1 --pretty=%s", { encoding: "utf8" }).trim() || null;
	} catch {
		return null;
	}
}

// parse_mode "HTML" treats <, >, & as markup.
function escapeHtml(text) {
	return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// One ID or a comma-separated list; whitespace around each is ignored.
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
		// A notification must never fail a deploy.
		console.warn("[telegram-notify] Skipping: TELEGRAM_BOT_TOKEN and/or TELEGRAM_CHAT_ID not set.");
		return;
	}

	// Independent per recipient, so one bad ID doesn't stop the rest.
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
				// Logged, not thrown — same reason as above.
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

// [opening, closing] flavor text; the info line between them is fixed — see docs/deploy-notifications.md.
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

// Standard Netlify build env vars: https://docs.netlify.com/configure-builds/environment-variables/
export async function onSuccess() {
	const site = process.env.SITE_NAME ?? "site";
	// URL first, not DEPLOY_PRIME_URL — see docs/deploy-notifications.md "Gotchas".
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
	// Telegram caps messages at 4096 chars; 500 keeps it skimmable.
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
