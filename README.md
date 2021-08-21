## Paladin

Paladin is a simple moderation bot with support for:
- reaction roles
- logging users joining/leaving the server
- moderator actions (kicking/banning/unbanning users)
- "banned words" filter (with thread support!)

Support is planned for:
- logging user renames, avatar changes, and role changes
- automatic logging of manual kicks/bans/unbans

### Self-hosting

Paladin needs the following permissions:
- `SEND_MESSAGES` (for all forms of logging + reaction roles)
- `USE_PUBLIC_THREADS` (for banned words filtering in threads)
- `MANAGE_MESSAGES` (for banned words filter)
- `KICK_MEMBERS` (for the `/kick` command)
- `BAN_MEMBERS` (for the `/ban` and `/unban` commands)

Paladin needs the following bot scopes enabled:
- Server Members Intent (for logging users joining/leaving the server)