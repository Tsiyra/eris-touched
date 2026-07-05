import test from 'node:test';
import assert from 'node:assert/strict';
import { getQuestResultPanelState } from '../public/questboard-result-state.js';

test('keeps the latest completed request visible after a new quest becomes active', () => {
  const completedQuest = {
    status: 'completed',
    questTitle: 'Moonlit Ledger',
    task: 'Organize receipts',
    coins: 40,
    xp: 60,
    rewardSummary: '40 Gold, 60 XP',
    story: 'The ledger shone like moonlight.',
  };

  const activeQuest = {
    status: 'active',
    task: 'Write sprint notes',
    coins: 0,
    xp: 10,
  };

  const state = getQuestResultPanelState(activeQuest, completedQuest, { questStarted: true });

  assert.equal(state.statusText, 'Reward: 40 Gold, 60 XP');
  assert.equal(state.lootText, '');
});
