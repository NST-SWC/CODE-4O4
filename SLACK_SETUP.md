## Slack Bot / Webhook for Dev Club Notifications

Use this guide to stand up a Slack bot (token-based) or a simple incoming webhook that mirrors important Dev Club notifications into your Slack channel.

### 1) Create the Slack app
1. Go to https://api.slack.com/apps and choose **Create New App**.
2. Pick **From a manifest** and paste the YAML below (update the name if you like):

```yaml
display_information:
  name: Dev Club Bot
  description: Sends Dev Club updates to Slack
features:
  bot_user:
    display_name: Dev Club Bot
    always_online: true
oauth_config:
  scopes:
    bot:
      - chat:write
      - chat:write.public
      - channels:join
      - channels:read
settings:
  org_deploy_enabled: false
  socket_mode_enabled: false
  token_rotation_enabled: false
```

3. Click **Create**, then **Install to Workspace**. Approve the requested scopes.
4. Copy the **Bot User OAuth Token** (starts with `xoxb-`).
5. Grab your target channel ID from Slack (channel menu → **View channel details** → **Copy channel ID**).

### 2) Add environment variables
Add these to `.env.local` (and any deployment env). Use either a webhook or bot token; both can coexist and the app will prefer the webhook when present.
```
# Preferred: Webhook-only (single channel)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# Optional: Bot token for dynamic channels/threads (fallback if webhook missing/fails)
SLACK_BOT_TOKEN=xoxb-...
SLACK_DEVCLUB_CHANNEL_ID=C01234567

# Protects /api/slack/notify
SLACK_SEND_SECRET=choose-a-random-string
```
- `SLACK_SEND_SECRET` protects the API endpoint; include it as the `x-slack-secret` header when calling.
- Restart `npm run dev` after updating env vars.

### 3) API endpoint for app-triggered posts
Send structured messages from the app or external jobs:
```bash
curl -X POST http://localhost:3000/api/slack/notify \
  -H "Content-Type: application/json" \
  -H "x-slack-secret: $SLACK_SEND_SECRET" \
  -d '{
        "title": "New Event Published",
        "body": "AI Hackathon kicks off Friday 5pm.",
        "url": "https://devclub.example.com/events/hackathon",
        "ping": "here"
      }'
```
Payload fields: `text` (raw), or `title`/`body` + optional `url`, `ping` (`here` or `channel`), `channel` override, and `blocks` if you want to fully control the Slack layout.

### 4) CLI smoke test
Send a quick message without running the Next.js server:
```bash
npm run slack:send -- "Hello from Dev Club bot" --url https://devclub.example.com --ping here
```
This uses `scripts/send-slack-message.js` and will prefer `SLACK_WEBHOOK_URL` if set; otherwise it falls back to the bot token.

### 5) Wiring ideas
- Call `POST /api/slack/notify` from existing cron jobs or admin flows when a new event/project is approved.
- Use `ping: "here"` for urgent updates; omit for routine announcements.
- Include a `url` so the Slack button deep-links into the portal.
