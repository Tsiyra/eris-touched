# Questboard Loop Debug Notes

First loop to verify:
- Guild Request opens the modal.
- Pin Request creates a local pinned request and updates the pinned count.
- Refresh keeps local pinned requests.
- Embark from the modal starts the focus timer.
- Embark from a pinned request starts the focus timer for that request.
- Turn In Request completes the active quest and removes the active pinned request.

Debug after this loop is stable:
- Request planning should use the AI/tool path instead of only the fallback plan.
- Medium and large requests need checkmark progress verified from start to turn-in.
- Reward payout should be checked against actual completed minutes, not estimated minutes.
- Character and Guild Charter saves should be retested against the origin/CORS fix.
- Encoded symbols in the UI should be cleaned up so buttons and rewards display consistently.
