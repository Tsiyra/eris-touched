import { getQuestResultPanelState } from "/questboard-result-state.js";

const ERIS_PATCH_VERSION = "1.0005";
      const saveCharacterButton = document.querySelector(
        "#save-character-button"
      );
      const portraitPrompt = document.querySelector("#portrait-prompt");
      const portraitPromptStatus = document.querySelector("#portrait-prompt-status");
      const generatePromptButton = document.querySelector("#generate-prompt-button");
      const copyPortraitPromptButton = document.querySelector(
        "#copy-portrait-prompt-button"
      );
      const portraitImageUploadInput = document.querySelector("#portrait-image-upload");
      const clearPortraitImageButton = document.querySelector("#clear-portrait-image-button");
      const portraitUploadStatus = document.querySelector("#portrait-upload-status");
      const portraitZoomOutButton = document.querySelector("#portrait-zoom-out-button");
      const portraitZoomInButton = document.querySelector("#portrait-zoom-in-button");
      const portraitZoomLabel = document.querySelector("#portrait-zoom-label");
      const savePortraitUploadButton = document.querySelector("#save-portrait-upload-button");
      const characterNameInput = document.querySelector("#character-name");
      const characterDescriptionInput = document.querySelector("#character-description");
      const characterRaceSelect = document.querySelector("#character-race");
      const hairColorSelect = document.querySelector("#hair-color");
      const skinColorSelect = document.querySelector("#skin-color");
      const outfitNameInput = document.querySelector("#outfit-name");

      const questboardPortraitShell = document.querySelector("#questboard-portrait-shell");
      const questboardPortraitImage = document.querySelector("#questboard-portrait-image");
      const questboardPortraitPlaceholder = document.querySelector("#questboard-portrait-placeholder");
      const questboardPortraitInitials = document.querySelector("#questboard-portrait-initials");
      const questboardPortraitName = document.querySelector("#questboard-portrait-name");
      const questboardOutfitName = document.querySelector("#questboard-outfit-name");
      const questboardLevelBadge = document.querySelector("#questboard-level-badge");
      const questboardLevelFill = document.querySelector("#questboard-level-fill");
      const questboardLevelLabel = document.querySelector("#questboard-level-label");
      const questboardGoldTotal = document.querySelector("#questboard-gold-total");
      const heroPortraitShell = document.querySelector("#hero-portrait-shell");
      const heroPortraitImage = document.querySelector("#hero-portrait-image");
      const heroPortraitPlaceholder = document.querySelector("#hero-portrait-placeholder");
      const heroPortraitInitials = document.querySelector("#hero-portrait-initials");
      const heroPortraitName = document.querySelector("#hero-portrait-name");
      const heroOutfitName = document.querySelector("#hero-outfit-name");

      const heroEditButton = document.querySelector("#hero-edit-button");
      const settingsModal = document.querySelector("#settings-modal");
      const closeSettingsButton = document.querySelector("#close-settings-button");
      const portraitModal = document.querySelector("#portrait-modal");
      const closePortraitButton = document.querySelector("#close-portrait-button");
      const portraitModalImageShell = document.querySelector(".portrait-modal-image-shell");
      const portraitModalImage = document.querySelector("#portrait-modal-image");
      const portraitModalPlaceholder = document.querySelector("#portrait-modal-placeholder");
      const portraitModalInitials = document.querySelector("#portrait-modal-initials");
      const portraitModalName = document.querySelector("#portrait-modal-name");
      const portraitModalLevel = document.querySelector("#portrait-modal-level");
      const portraitModalOutfit = document.querySelector("#portrait-modal-outfit");
      const saveImageButton = document.querySelector("#save-image-button");
      const generateImageButton = document.querySelector("#generate-image-button");
      const portraitGenerationStatus = document.querySelector("#portrait-generation-status");

      const openRequestModalButton = document.querySelector("#open-request-modal-button");
      const requestModal = document.querySelector("#request-modal");
      const closeRequestButton = document.querySelector("#close-request-button");
      const requestModalStatus = document.querySelector("#request-modal-status");

      const taskInput = document.querySelector("#task");
      const timerDisplay = document.querySelector("#timer");
      const timerStatus = document.querySelector("#timer-status");

      const startButton = document.querySelector("#start-button");
      const embarkNowButton = document.querySelector("#embark-now-button");
      const pauseButton = document.querySelector("#pause-button");
      const holdTimerButton = document.querySelector("#hold-timer-button");
      const cancelTimerButton = document.querySelector("#cancel-timer-button");
      const completeButton = document.querySelector("#complete-button");

      const questStatus = document.querySelector("#quest-status");
      const questLoot = document.querySelector("#quest-loot");
      const storyLog = document.querySelector("#story-log");

      const heroLevel = document.querySelector("#hero-level");
      const heroXp = document.querySelector("#hero-xp");
      const heroCoins = document.querySelector("#hero-coins");
      const heroQuests = document.querySelector("#hero-quests");
      const heroLootCount = document.querySelector("#hero-loot-count");
      const levelFill = document.querySelector("#level-fill");
      const levelLabel = document.querySelector("#level-label");
      const inventoryList = document.querySelector("#inventory-list");

      const pinnedRequestList = document.querySelector("#pinned-request-list");
      const pinnedRequestCount = document.querySelector("#pinned-request-count");
      const questboardActiveCard = document.querySelector(".questboard-active-card");
      const activeQuestEmpty = document.querySelector("#active-quest-empty");
      const activeQuestDetails = document.querySelector("#active-quest-details");
      const activeQuestTitle = document.querySelector("#active-quest-title");
      const activeQuestOriginalTask = document.querySelector("#active-quest-original-task");
      const activeQuestRewardEstimate = document.querySelector("#active-quest-reward-estimate");
      const editActiveRequestButton = document.querySelector("#edit-active-request-button");
      const editActiveTaskButton = document.querySelector("#edit-active-task-button");
      const cancelActiveRequestButton = document.querySelector("#cancel-active-request-button");
      const questRequestProgressLabel = document.querySelector("#quest-request-progress-label");
      const questRequestProgressFill = document.querySelector("#quest-request-progress-fill");
      const questboardCharterGoal = document.querySelector("#questboard-charter-goal");
      const questboardCharterProgressLabel = document.querySelector("#questboard-charter-progress-label");
      const questboardCharterProgressFill = document.querySelector("#questboard-charter-progress-fill");
      const requestSizeButtons = document.querySelectorAll("[data-request-size]");
      const questStepList = document.querySelector("#quest-step-list");

      const npcChoicePanel = document.querySelector("#npc-choice-panel");
      const npcChoiceList = document.querySelector("#npc-choice-list");
      const knownNpcList = document.querySelector("#known-npc-list");
      const storyChapterList = document.querySelector("#story-chapter-list");
      const storyToneSelect = document.querySelector("#story-tone");
      const overarchingGoalInput = document.querySelector("#overarching-goal");
      const saveSettingsButton = document.querySelector("#save-settings-button");
      const minutesPromptModal = document.querySelector("#minutes-prompt-modal");
      const minutesPromptInput = document.querySelector("#minutes-input");
      const closeMinutesPromptButton = document.querySelector("#close-minutes-prompt-button");
      const cancelMinutesPromptButton = document.querySelector("#cancel-minutes-prompt-button");
      const confirmMinutesPromptButton = document.querySelector("#confirm-minutes-prompt-button");
      const navButtons = document.querySelectorAll(".nav-button");
      const appScreens = document.querySelectorAll(".app-screen");
      const activeOverlayLayers = new Set();

      function syncOverlayChrome() {
        document.body.classList.toggle("overlay-visible", activeOverlayLayers.size > 0);
      }

      function setOverlayLayerVisible(layer, isVisible) {
        if (!layer) return;
        if (isVisible) {
          activeOverlayLayers.add(layer);
        } else {
          activeOverlayLayers.delete(layer);
        }
        syncOverlayChrome();
      }

      function showScreen(screenName) {
        appScreens.forEach((screen) => {
          screen.classList.remove("active-screen");
        });

        navButtons.forEach((button) => {
          button.classList.remove("active");
        });

        const screen = document.querySelector(`#screen-${screenName}`);
        const button = document.querySelector(`[data-screen="${screenName}"]`);

        if (screen) screen.classList.add("active-screen");
        if (button) button.classList.add("active");
      }

      navButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const targetScreen = button.dataset.screen;
          if (targetScreen) {
            showScreen(targetScreen);
          }
        });
      });


      requestSizeButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const nextSize = button.dataset.requestSize;
          if (!nextSize) return;
          requestSize = nextSize;
          updateRequestSizeButtons();
        });
      });

      const PINNED_REQUESTS_STORAGE_KEY = "eris-touched-pinned-requests-v1";
      const CANCELED_PINNED_REQUEST_KEYS_STORAGE_KEY = "eris-touched-canceled-pinned-request-keys-v1";
      const ACTIVE_PINNED_REQUEST_ID_STORAGE_KEY = "eris-touched-active-pinned-request-id-v1";
      const ACTIVE_REQUEST_PROGRESS_STORAGE_KEY = "eris-touched-active-request-progress-v1";

      showScreen("questboard");

      let currentQuest = null;
      let lastCompletedQuest = null;
      let canceledPinnedRequestKeys = loadCanceledPinnedRequestKeys();
      let pinnedRequests = loadPinnedRequests();
      let log = [];
      let pendingNpcChoices = [];
      let knownNpcs = [];
      let storyChapters = [];
      let appSettings = {
        storyTone: "epic_heroic",
        overarchingGoal: "Build better habits",
      };

      let character = {
        name: "Eris-Touched Hero",
        description:
          "A fantasy adventurer touched by Eris, learning to turn chaos into quests.",
        portraitPrompt: "A fantasy portrait of an Eris-Touched hero.",
        portraitImageUrl: "",
        outfitName: "Hero Starter Outfit",
        race: "Human",
        hairColor: "Black",
        skinColor: "Olive",
      };

      let player = {
        name: "Eris-Touched Hero",
        level: 1,
        totalXp: 0,
        completedQuests: 0,
        coins: 0,
        inventory: [],
      };

      let timerInterval = null;
      let timerRunning = false;
      let questStarted = false;
      let startTime = null;
      let accumulatedSeconds = 0;
      let localTimerQuestId = null;
      let uploadedPortraitImageData = null;
      let portraitCropDraft = null;
      let portraitDragState = null;
      let requestSize = "medium";
      let activePinnedRequestId = localStorage.getItem(
        ACTIVE_PINNED_REQUEST_ID_STORAGE_KEY
      ) || "";
      let activeQuestProgress = loadActiveQuestProgress();

      function createPinnedRequestId() {
        return `pinned-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      }

      function normalizePinnedRequest(request) {
        const task = String(request?.task || '').trim();

        if (!task) {
          return null;
        }

        const plannedMinutes = Math.max(
          1,
          Math.min(600, Math.round(Number(request?.plannedMinutes) || 45))
        );
        const requestSize = ['small', 'medium', 'large'].includes(request?.requestSize)
          ? request.requestSize
          : 'medium';
        const requestPlan = normalizeRequestPlan(
          request?.requestPlan,
          task,
          requestSize,
          plannedMinutes
        );

        const questTitle = String(request?.questTitle || requestPlan.title || generateFantasyQuestTitle(task)).trim();
        requestPlan.title = questTitle;

        return {
          id: typeof request?.id === 'string' && request.id.trim()
            ? request.id.trim()
            : createPinnedRequestId(),
          task,
          questTitle,
          plannedMinutes: requestPlan.plannedMinutes,
          requestSize,
          requestPlan,
        };
      }

      function loadPinnedRequests() {
        try {
          const raw = localStorage.getItem(PINNED_REQUESTS_STORAGE_KEY);
          if (!raw) return [];

          const parsed = JSON.parse(raw);
          if (!Array.isArray(parsed)) return [];

          return parsed.map(normalizePinnedRequest).filter(Boolean);
        } catch (error) {
          console.error('Could not load pinned requests:', error);
          return [];
        }
      }

      function savePinnedRequests() {
        try {
          localStorage.setItem(
            PINNED_REQUESTS_STORAGE_KEY,
            JSON.stringify(pinnedRequests)
          );
        } catch (error) {
          console.error("Could not save pinned requests:", error);
        }
      }

      function getPinnedRequestKey(request) {
        return [
          String(request?.task || "").trim().toLowerCase(),
          Number(request?.plannedMinutes || 0),
          request?.requestSize || "medium",
        ].join("|");
      }

      function loadCanceledPinnedRequestKeys() {
        try {
          const parsed = JSON.parse(localStorage.getItem(CANCELED_PINNED_REQUEST_KEYS_STORAGE_KEY) || "[]");
          return new Set(Array.isArray(parsed) ? parsed.filter((key) => typeof key === "string" && key.trim()) : []);
        } catch (error) {
          console.error("Could not load canceled pinned request keys:", error);
          return new Set();
        }
      }

      function saveCanceledPinnedRequestKeys() {
        try {
          localStorage.setItem(
            CANCELED_PINNED_REQUEST_KEYS_STORAGE_KEY,
            JSON.stringify(Array.from(canceledPinnedRequestKeys).slice(-100))
          );
        } catch (error) {
          console.error("Could not save canceled pinned request keys:", error);
        }
      }

      function rememberCanceledPinnedRequest(request) {
        const normalized = normalizePinnedRequest(request);
        if (!normalized) return;

        canceledPinnedRequestKeys.add(normalized.id);
        canceledPinnedRequestKeys.add(getPinnedRequestKey(normalized));
        saveCanceledPinnedRequestKeys();
      }

      function isCanceledPinnedRequest(request) {
        const normalized = normalizePinnedRequest(request);
        return !normalized || canceledPinnedRequestKeys.has(normalized.id) || canceledPinnedRequestKeys.has(getPinnedRequestKey(normalized));
      }

      function normalizePinnedRequests(requests = []) {
        return requests.map(normalizePinnedRequest).filter(Boolean);
      }

      function mergePinnedRequests(...requestGroups) {
        const merged = [];
        const seenIds = new Set();
        const seenKeys = new Set();

        for (const request of requestGroups.flatMap(normalizePinnedRequests)) {
          if (isCanceledPinnedRequest(request)) {
            continue;
          }

          const key = getPinnedRequestKey(request);
          if (seenIds.has(request.id) || seenKeys.has(key)) {
            continue;
          }

          seenIds.add(request.id);
          seenKeys.add(key);
          merged.push(request);
        }

        return merged.slice(0, 20);
      }

      function setPinnedRequests(nextPinnedRequests, { renderList = true } = {}) {
        pinnedRequests = normalizePinnedRequests(nextPinnedRequests).slice(0, 20);
        savePinnedRequests();

        if (renderList) {
          renderPinnedRequests();
        }
      }

      function addPinnedRequest(request) {
        const normalized = normalizePinnedRequest(request);
        if (normalized) {
          canceledPinnedRequestKeys.delete(normalized.id);
          canceledPinnedRequestKeys.delete(getPinnedRequestKey(normalized));
          saveCanceledPinnedRequestKeys();
        }
        setPinnedRequests([request, ...pinnedRequests]);
      }

      function createRequestDraft(task, size, minutes, id = createPinnedRequestId()) {
        const requestPlan = buildFallbackRequestPlan(task, size, minutes);

        return normalizePinnedRequest({
          id,
          task,
          plannedMinutes: requestPlan.plannedMinutes,
          requestSize: size,
          requestPlan,
        });
      }

      function getRequestDraftFromModal() {
        const task = getRequestModalTask();

        if (!task) {
          setRequestModalStatus("Enter a guild request first.", "warning");
          alert("Enter a guild request first.");
          return null;
        }

        return createRequestDraft(task, requestSize, getDefaultPlannedMinutes(requestSize));
      }

      function normalizeActiveQuestProgress(progress = {}) {
        const subtaskMinutesById = {};
        const rawMinutesById = progress?.subtaskMinutesById;
        if (rawMinutesById && typeof rawMinutesById === "object") {
          for (const [id, value] of Object.entries(rawMinutesById)) {
            const minutes = Math.max(0, Math.round(Number(value)));
            if (typeof id === "string" && id.trim() && Number.isFinite(minutes)) {
              subtaskMinutesById[id.trim()] = minutes;
            }
          }
        }

        const subtaskHeldSecondsById = {};
        const rawHeldSecondsById = progress?.subtaskHeldSecondsById;
        if (rawHeldSecondsById && typeof rawHeldSecondsById === "object") {
          for (const [id, value] of Object.entries(rawHeldSecondsById)) {
            const seconds = Math.max(0, Math.round(Number(value)));
            if (typeof id === "string" && id.trim() && Number.isFinite(seconds) && seconds > 0) {
              subtaskHeldSecondsById[id.trim()] = seconds;
            }
          }
        }

        const subtaskTitlesById = {};
        const rawTitlesById = progress?.subtaskTitlesById;
        if (rawTitlesById && typeof rawTitlesById === "object") {
          for (const [id, value] of Object.entries(rawTitlesById)) {
            const title = String(value || "").trim();
            if (typeof id === "string" && id.trim() && title) {
              subtaskTitlesById[id.trim()] = title;
            }
          }
        }

        return {
          questId: typeof progress?.questId === "string" ? progress.questId : "",
          completedSubtaskIds: Array.isArray(progress?.completedSubtaskIds)
            ? progress.completedSubtaskIds.filter((id) => typeof id === "string" && id.trim())
            : [],
          subtaskMinutesById,
          subtaskHeldSecondsById,
          subtaskTitlesById,
          requestTitleOverride: typeof progress?.requestTitleOverride === "string"
            ? progress.requestTitleOverride.trim()
            : "",
          questTitleOverride: typeof progress?.questTitleOverride === "string"
            ? progress.questTitleOverride.trim()
            : "",
          activeSubtaskId: typeof progress?.activeSubtaskId === "string"
            ? progress.activeSubtaskId.trim()
            : "",
        };
      }

      function loadActiveQuestProgress() {
        try {
          const raw = localStorage.getItem(ACTIVE_REQUEST_PROGRESS_STORAGE_KEY);
          if (!raw) return normalizeActiveQuestProgress();

          const parsed = JSON.parse(raw);
          return normalizeActiveQuestProgress(parsed);
        } catch (error) {
          console.error("Could not load active request progress:", error);
          return normalizeActiveQuestProgress();
        }
      }

      function saveActiveQuestProgress(progress = activeQuestProgress) {
        activeQuestProgress = normalizeActiveQuestProgress(progress);

        try {
          localStorage.setItem(
            ACTIVE_REQUEST_PROGRESS_STORAGE_KEY,
            JSON.stringify(activeQuestProgress)
          );
        } catch (error) {
          console.error("Could not save active request progress:", error);
        }
      }

      function clearActiveQuestProgress() {
        activeQuestProgress = normalizeActiveQuestProgress();

        try {
          localStorage.removeItem(ACTIVE_REQUEST_PROGRESS_STORAGE_KEY);
        } catch (error) {
          console.error("Could not clear active request progress:", error);
        }
      }

      function setActivePinnedRequestId(requestId = "") {
        activePinnedRequestId = requestId || "";

        try {
          if (activePinnedRequestId) {
            localStorage.setItem(
              ACTIVE_PINNED_REQUEST_ID_STORAGE_KEY,
              activePinnedRequestId
            );
          } else {
            localStorage.removeItem(ACTIVE_PINNED_REQUEST_ID_STORAGE_KEY);
          }
        } catch (error) {
          console.error("Could not save active pinned request id:", error);
        }
      }

      function findPinnedRequestId(task, plannedMinutes, requestSize) {
        const normalizedTask = task.trim();
        const normalizedMinutes = Number(plannedMinutes ?? 45);
        const normalizedSize = requestSize ? String(requestSize) : "";

        const matchingRequest = pinnedRequests.find((request) => {
          return (
            request.task === normalizedTask &&
            Number(request.plannedMinutes ?? 45) === normalizedMinutes &&
            (!normalizedSize || request.requestSize === normalizedSize)
          );
        });

        return matchingRequest?.id ?? "";
      }

      function removePinnedRequestFromBoard(requestId, task, plannedMinutes) {
        const fallbackKey = task
          ? getPinnedRequestKey({ task, plannedMinutes, requestSize: currentQuest?.requestSize || "medium" })
          : "";
        const nextPinnedRequests = pinnedRequests.filter((request) => {
          if (requestId && request.id === requestId) {
            return false;
          }

          return !fallbackKey || getPinnedRequestKey(request) !== fallbackKey;
        });

        if (nextPinnedRequests.length !== pinnedRequests.length) {
          const removedRequests = pinnedRequests.filter((request) => !nextPinnedRequests.some((nextRequest) => nextRequest.id === request.id));
          for (const request of removedRequests) {
            rememberCanceledPinnedRequest(request);
          }
          setPinnedRequests(nextPinnedRequests);
        }
      }

      function updateRequestSizeButtons() {
        requestSizeButtons.forEach((button) => {
          button.classList.toggle("active", button.dataset.requestSize === requestSize);
        });
      }

      function getRequestSizeLabel(size) {
        const normalized = String(size || "medium");
        return normalized.charAt(0).toUpperCase() + normalized.slice(1);
      }

      function getDefaultPlannedMinutes(size) {
        if (size === "small") return 10;
        if (size === "large") return 60;
        return 30;
      }

      function toTitleCase(value) {
        return String(value || "")
          .toLowerCase()
          .split(/\s+/)
          .filter(Boolean)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      }

      function generateFantasyQuestTitle(task) {
        const cleanTask = String(task || "").replace(/[^a-z0-9\s]/gi, " ").trim();
        const words = cleanTask.split(/\s+/).filter((word) => word.length > 2);
        const subject = toTitleCase(words.slice(0, 3).join(" ") || cleanTask || "The Unmarked Task");
        const templates = [
          `The ${subject} Accord`,
          `The Charter of ${subject}`,
          `The ${subject} Vigil`,
          `The Guild Trial of ${subject}`,
        ];
        const index = Math.abs(subject.split("").reduce((total, char) => total + char.charCodeAt(0), 0)) % templates.length;
        return templates[index];
      }

      function distributeRequestMinutes(totalMinutes, stepCount) {
        const normalizedCount = Math.max(1, Math.floor(Number(stepCount) || 1));
        const normalizedTotal = Math.max(
          normalizedCount,
          Math.floor(Number(totalMinutes) || normalizedCount)
        );
        const base = Math.floor(normalizedTotal / normalizedCount);
        let remainder = normalizedTotal % normalizedCount;

        return Array.from({ length: normalizedCount }, () => {
          const minutes = base + (remainder > 0 ? 1 : 0);
          remainder = Math.max(0, remainder - 1);
          return Math.max(1, minutes);
        });
      }

      function buildFallbackRequestPlan(task, size, plannedMinutes) {
        const normalizedSize = ["small", "medium", "large"].includes(size) ? size : "medium";
        const cleanTask = task.trim();
        const stepCount = normalizedSize === "small" ? 1 : normalizedSize === "medium" ? 3 : 5;
        const templates = [
          "Prepare the workspace",
          "Break the request into smaller pieces",
          "Do the main work",
          "Review the result",
          "Tidy up and finish strong",
        ];
        const stepMinutes = distributeRequestMinutes(plannedMinutes, stepCount);

        const subtasks = Array.from({ length: stepCount }, (_, index) => ({
          id: `plan-${Date.now()}-${index + 1}`,
          title:
            normalizedSize === "small"
              ? cleanTask
              : `${templates[index % templates.length]}${index === 0 ? ` for ${cleanTask}` : ""}`,
          details:
            normalizedSize === "small"
              ? `Complete: ${cleanTask}.`
              : `${cleanTask} step ${index + 1} of ${stepCount}.`,
          minutes: stepMinutes[index],
        }));

        return {
          size: normalizedSize,
          title: generateFantasyQuestTitle(cleanTask),
          summary:
            normalizedSize === "small"
              ? `Single-step request for ${cleanTask}.`
              : `${getRequestSizeLabel(normalizedSize)} request broken into ${stepCount} steps for ${cleanTask}.`,
          subtasks,
          plannedMinutes: stepMinutes.reduce((total, minutes) => total + minutes, 0),
        };
      }

      function normalizeRequestPlan(plan, task, size, plannedMinutes) {
        if (!plan || typeof plan !== "object") {
          return buildFallbackRequestPlan(task, size, plannedMinutes);
        }

        const normalizedSize = ["small", "medium", "large"].includes(plan.size)
          ? plan.size
          : (["small", "medium", "large"].includes(size) ? size : "medium");
        const fallback = buildFallbackRequestPlan(task, normalizedSize, plannedMinutes);
        const subtasks = Array.isArray(plan.subtasks) ? plan.subtasks : [];
        const safeSubtasks = subtasks
          .map((subtask, index) => ({
            id:
              typeof subtask?.id === "string" && subtask.id.trim()
                ? subtask.id.trim()
                : (fallback.subtasks[index % fallback.subtasks.length]?.id || `plan-${index + 1}`),
            title: String(subtask?.title || "").trim(),
            details: String(subtask?.details || "").trim() || undefined,
            minutes: Number(subtask?.minutes),
          }))
          .filter((subtask) => subtask.title);

        while (safeSubtasks.length < fallback.subtasks.length) {
          const fallbackSubtask = fallback.subtasks[safeSubtasks.length % fallback.subtasks.length];
          safeSubtasks.push({
            id: fallbackSubtask.id,
            title: fallbackSubtask.title,
            details: fallbackSubtask.details,
            minutes: fallbackSubtask.minutes,
          });
        }

        const targetSteps = Math.max(
          normalizedSize === "small" ? 1 : normalizedSize === "medium" ? 2 : 5,
          safeSubtasks.length
        );
        const fallbackMinutes = distributeRequestMinutes(fallback.plannedMinutes, targetSteps);
        const normalizedSubtasks = safeSubtasks.slice(0, targetSteps).map((subtask, index) => ({
          id: subtask.id,
          title: subtask.title,
          details: subtask.details,
          minutes: Math.max(
            1,
            Math.round(
              Number.isFinite(subtask.minutes) && subtask.minutes > 0 ? subtask.minutes : fallbackMinutes[index] || 1
            )
          ),
        }));

        const plannedTotal = normalizedSubtasks.reduce((total, subtask) => total + subtask.minutes, 0);

        return {
          size: normalizedSize,
          title: String(plan.title || fallback.title || generateFantasyQuestTitle(task)).trim() || fallback.title,
          summary: String(plan.summary || fallback.summary).trim() || fallback.summary,
          plannedMinutes: plannedTotal,
          subtasks: normalizedSubtasks,
        };
      }

      function getCurrentQuestRequestPlan() {
        if (!currentQuest?.requestPlan) {
          return null;
        }

        return normalizeRequestPlan(
          currentQuest.requestPlan,
          currentQuest.task,
          currentQuest.requestSize ?? requestSize,
          currentQuest.plannedMinutes ?? getDefaultPlannedMinutes(requestSize)
        );
      }

      function getQuestPlanSubtasks() {
        const requestPlan = getCurrentQuestRequestPlan();
        if (!requestPlan?.subtasks?.length) {
          return [];
        }

        const progress = activeQuestProgress.questId === currentQuest?.id ? activeQuestProgress : null;

        return requestPlan.subtasks.map((subtask) => {
          const editedTitle = progress?.subtaskTitlesById?.[subtask.id];
          const recordedMinutes = Number(progress?.subtaskMinutesById?.[subtask.id]);

          return {
            ...subtask,
            title: editedTitle || subtask.title,
            minutes: Number.isFinite(recordedMinutes) && recordedMinutes > 0 ? recordedMinutes : 0,
          };
        });
      }

      function getQuestDisplayTask() {
        const progress = activeQuestProgress.questId === currentQuest?.id ? activeQuestProgress : null;
        return progress?.requestTitleOverride || currentQuest?.task || "";
      }

      function getQuestFantasyTitle() {
        const progress = activeQuestProgress.questId === currentQuest?.id ? activeQuestProgress : null;
        const requestPlan = getCurrentQuestRequestPlan();
        return progress?.questTitleOverride || currentQuest?.questTitle || requestPlan?.title || generateFantasyQuestTitle(currentQuest?.task || "");
      }

      function getActiveSubtask() {
        if (activeQuestProgress.questId !== currentQuest?.id || !activeQuestProgress.activeSubtaskId) {
          return null;
        }

        return getQuestPlanSubtasks().find((subtask) => subtask.id === activeQuestProgress.activeSubtaskId) || null;
      }

      function getQuestCompletedSubtaskIds() {
        if (activeQuestProgress.questId !== currentQuest?.id) return [];
        return Array.isArray(activeQuestProgress.completedSubtaskIds) ? activeQuestProgress.completedSubtaskIds : [];
      }

      function getRewardXp(minutes) {
        const actualMinutes = Math.max(0, Math.round(Number(minutes) || 0));
        return actualMinutes > 0 ? Math.round(actualMinutes * 8) : 0;
      }

      function getRewardGold(minutes) {
        const actualMinutes = Math.max(0, Math.round(Number(minutes) || 0));
        return actualMinutes > 0 ? Math.round(actualMinutes * 10) : 0;
      }
      function createRequestProgressBlock(completedCount, totalCount, completedMinutes = 0) {
        const progress = document.createElement("div");
        progress.className = "questboard-request-progress request-card-progress";

        const progressRow = document.createElement("div");
        progressRow.className = "questboard-request-progress-row";
        const label = document.createElement("span");
        label.textContent = "Request Progress";
        const value = document.createElement("strong");
        value.textContent = completedCount + " / " + totalCount + " Checkmarks - " + Math.max(0, Math.round(Number(completedMinutes) || 0)) + " min counted";
        progressRow.appendChild(label);
        progressRow.appendChild(value);

        const bar = document.createElement("div");
        bar.className = "questboard-request-progress-bar";
        const fill = document.createElement("div");
        const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        fill.style.width = Math.max(0, Math.min(100, progressPercent)) + "%";
        bar.appendChild(fill);

        progress.appendChild(progressRow);
        progress.appendChild(bar);
        return progress;
      }
      function getQuestProgressTotals() {
        const subtasks = getQuestPlanSubtasks();
        const completed = new Set(getQuestCompletedSubtaskIds());
        const completedMinutes = subtasks.reduce((total, subtask) => {
          if (!completed.has(subtask.id)) return total;
          return total + Math.max(0, Math.round(Number(subtask.minutes) || 0));
        }, 0);

        return {
          totalMinutes: completedMinutes,
          completedMinutes,
          totalCount: subtasks.length,
          completedCount: completed.size,
        };
      }

      function areQuestStepsComplete() {
        const subtasks = getQuestPlanSubtasks();
        if (!subtasks.length) return true;
        const completed = new Set(getQuestCompletedSubtaskIds());
        return subtasks.every((subtask) => completed.has(subtask.id));
      }

      let pendingMinutesPromptResolver = null;

      function openMinutesPromptModal(defaultMinutes = 1, promptLabel = "How many minutes did this task take?") {
        if (!minutesPromptModal || !minutesPromptInput) {
          return Promise.resolve(null);
        }

        const promptLabelNode = minutesPromptModal.querySelector("label[for='minutes-input']");
        if (promptLabelNode) {
          promptLabelNode.textContent = promptLabel;
        }

        minutesPromptInput.value = String(Math.max(1, Math.round(Number(defaultMinutes) || 1)));
        minutesPromptModal.style.display = "grid";
        setOverlayLayerVisible(minutesPromptModal, true);
        setTimeout(() => minutesPromptInput?.focus?.(), 0);

        return new Promise((resolve) => {
          pendingMinutesPromptResolver = resolve;
        });
      }

      function closeMinutesPromptModal() {
        if (minutesPromptModal) {
          minutesPromptModal.style.display = "none";
          setOverlayLayerVisible(minutesPromptModal, false);
        }
      }

      function resolveMinutesPrompt(value) {
        const resolve = pendingMinutesPromptResolver;
        pendingMinutesPromptResolver = null;
        closeMinutesPromptModal();
        if (resolve) {
          resolve(value);
        }
      }

      async function promptForQuestMinutes(promptLabel, defaultMinutes) {
        const cleanDefault = Math.max(1, Math.round(Number(defaultMinutes) || 1));
        const response = await openMinutesPromptModal(cleanDefault, promptLabel);
        if (response === null) {
          return null;
        }

        const parsed = Math.max(1, Math.round(Number(response) || cleanDefault));
        return Number.isFinite(parsed) ? parsed : cleanDefault;
      }

      function editActiveRequestTitle() {
        if (!currentQuest || currentQuest.status !== "active") {
          return;
        }

        const nextQuestTitle = window.prompt("Rename the fantasy quest title:", getQuestFantasyTitle());
        if (nextQuestTitle === null) return;

        const cleanQuestTitle = nextQuestTitle.trim();
        if (!cleanQuestTitle) return;

        saveActiveQuestProgress({
          ...activeQuestProgress,
          questId: currentQuest.id,
          questTitleOverride: cleanQuestTitle,
        });
        renderActiveQuest();
      }

      function editActiveTaskTitle() {
        if (!currentQuest || currentQuest.status !== "active") {
          return;
        }

        const nextTaskTitle = window.prompt("Rename the true request name:", getQuestDisplayTask());
        if (nextTaskTitle === null) return;

        const cleanTaskTitle = nextTaskTitle.trim();
        if (!cleanTaskTitle) return;

        saveActiveQuestProgress({
          ...activeQuestProgress,
          questId: currentQuest.id,
          requestTitleOverride: cleanTaskTitle,
        });
        renderActiveQuest();
      }

      async function cancelActiveRequest({ skipConfirm = false } = {}) {
        if (!currentQuest || currentQuest.status !== "active") {
          return true;
        }

        if (!skipConfirm) {
          const confirmed = window.confirm("Cancel this request? No XP, coins, items, or story will be awarded.");
          if (!confirmed) return false;
        }

        try {
          await callTool("cancel_focus_quest", {});
        } catch (error) {
          console.error("Cancel request failed:", error?.message || error, error);
          reportToolError(error);
          return false;
        }

        timerRunning = false;
        questStarted = false;
        startTime = null;
        accumulatedSeconds = 0;
        localTimerQuestId = null;
        clearInterval(timerInterval);
        clearActiveQuestProgress();
        setActivePinnedRequestId("");
        setFocusSessionActive(false);
        updateTimerDisplay();
        renderPinnedRequests();
        renderActiveQuest();
        return true;
      }

      function editQuestSubtaskTitle(subtaskId) {
        const subtask = getQuestPlanSubtasks().find((entry) => entry.id === subtaskId);
        if (!subtask) {
          return;
        }

        const nextTitle = window.prompt("Rename this checkmark task:", subtask.title);
        if (nextTitle === null) {
          return;
        }

        const cleanTitle = nextTitle.trim();
        if (!cleanTitle) {
          return;
        }

        saveActiveQuestProgress({
          ...activeQuestProgress,
          questId: currentQuest?.id || "",
          subtaskTitlesById: {
            ...(activeQuestProgress.subtaskTitlesById || {}),
            [subtaskId]: cleanTitle,
          },
        });
        renderQuestSteps();
        renderActiveQuest();
      }

      function startQuestSubtaskTimer(subtaskId) {
        const subtask = getQuestPlanSubtasks().find((entry) => entry.id === subtaskId);
        if (!currentQuest || !subtask || currentQuest.status !== "active") {
          return;
        }

        const heldSeconds = Math.max(0, Math.round(Number(activeQuestProgress.subtaskHeldSecondsById?.[subtaskId]) || 0));

        saveActiveQuestProgress({
          ...activeQuestProgress,
          questId: currentQuest.id,
          activeSubtaskId: subtaskId,
        });

        questStarted = true;
        timerRunning = true;
        localTimerQuestId = currentQuest.id;
        accumulatedSeconds = heldSeconds;
        startTime = Date.now();

        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimerDisplay, 1000);
        setFocusSessionActive(true);
        updateTimerDisplay();

        updatePauseButton();
        updateHoldButton();
        if (cancelTimerButton) cancelTimerButton.disabled = false;
        completeButton.textContent = "Complete Task";
        completeButton.disabled = false;
        renderQuestSteps();
        renderActiveQuest();
      }

      async function toggleQuestSubtaskCheckmark(subtaskId, options = {}) {
        const subtasks = getQuestPlanSubtasks();
        const subtask = subtasks.find((entry) => entry.id === subtaskId);
        if (!subtask) {
          return;
        }

        const completed = new Set(getQuestCompletedSubtaskIds());
        const nextProgress = {
          ...activeQuestProgress,
          questId: currentQuest?.id || "",
          completedSubtaskIds: subtasks.filter((entry) => completed.has(entry.id)).map((entry) => entry.id),
          subtaskMinutesById: {
            ...(activeQuestProgress.subtaskMinutesById || {}),
          },
          subtaskHeldSecondsById: {
            ...(activeQuestProgress.subtaskHeldSecondsById || {}),
          },
          subtaskTitlesById: {
            ...(activeQuestProgress.subtaskTitlesById || {}),
          },
        };

        if (completed.has(subtaskId)) {
          completed.delete(subtaskId);
          delete nextProgress.subtaskMinutesById[subtaskId];
          delete nextProgress.subtaskHeldSecondsById[subtaskId];
        } else {
          const isActiveSubtask = activeQuestProgress.activeSubtaskId === subtaskId && questStarted;
          const heldSeconds = Math.max(0, Math.round(Number(activeQuestProgress.subtaskHeldSecondsById?.[subtaskId]) || 0));
          const heldMinutes = heldSeconds > 0 ? Math.max(1, Math.round(heldSeconds / 60)) : 0;
          const minutes = options.useTimerMinutes
            ? Math.max(1, Math.round(getFocusedSeconds() / 60))
            : await promptForQuestMinutes(
                `How long did the checkmark for "${subtask.title}" take?`,
                heldMinutes || 1
              );
          if (minutes === null) {
            return;
          }

          completed.add(subtaskId);
          nextProgress.subtaskMinutesById[subtaskId] = minutes;
          delete nextProgress.subtaskHeldSecondsById[subtaskId];

          if (isActiveSubtask) {
            timerRunning = false;
            questStarted = false;
            startTime = null;
            accumulatedSeconds = 0;
            clearInterval(timerInterval);
            nextProgress.activeSubtaskId = "";
          }
        }

        nextProgress.completedSubtaskIds = subtasks.filter((entry) => completed.has(entry.id)).map((entry) => entry.id);
        saveActiveQuestProgress(nextProgress);
        updateTimerDisplay();
        renderQuestSteps();
        renderActiveQuest();
      }

      function renderQuestSteps() {
        if (!questStepList) return;
        const subtasks = getQuestPlanSubtasks();
        questStepList.innerHTML = "";

        if (!subtasks.length || currentQuest?.status !== "active") {
          questStepList.className = "questboard-step-list empty";
          questStepList.textContent = subtasks.length ? "" : "No checkmark tasks available.";
          if (questRequestProgressLabel) {
            questRequestProgressLabel.textContent = "0 / 0 Checkmarks";
          }
          if (questRequestProgressFill) {
            questRequestProgressFill.style.width = "0%";
          }
          return;
        }

        questStepList.className = "questboard-step-list";
        const completed = new Set(getQuestCompletedSubtaskIds());
        const totals = getQuestProgressTotals();
        const progressPercent = totals.totalCount > 0 ? Math.round((totals.completedCount / totals.totalCount) * 100) : 0;
        const activeSubtaskId = activeQuestProgress.questId === currentQuest?.id ? activeQuestProgress.activeSubtaskId : "";

        if (questRequestProgressLabel) {
          questRequestProgressLabel.textContent = `${totals.completedCount} / ${totals.totalCount} Checkmarks - ${formatTime(getFocusedSeconds())}`;
        }

        if (questRequestProgressFill) {
          questRequestProgressFill.style.width = `${Math.max(0, Math.min(100, progressPercent))}%`;
        }

        for (const subtask of subtasks) {
          const isDone = completed.has(subtask.id);
          const isActive = activeSubtaskId === subtask.id && questStarted;
          const heldSeconds = Math.max(0, Math.round(Number(activeQuestProgress.subtaskHeldSecondsById?.[subtask.id]) || 0));
          const isHeld = heldSeconds > 0 && !isActive && !isDone;
          const item = document.createElement("div");
          item.className = "questboard-step-item" + (isDone ? " is-done" : "") + (isActive ? " is-active" : "") + (isHeld ? " is-held" : "");

          const content = document.createElement("div");
          content.className = "questboard-step-content";

          const header = document.createElement("div");
          header.className = "questboard-step-header";

          const embarkButton = document.createElement("button");
          embarkButton.type = "button";
          embarkButton.className = "primary questboard-step-embark-button";
          embarkButton.textContent = isActive ? "||" : "\u00bb";
          embarkButton.title = isActive ? "Timer running" : isHeld ? `Resume from ${formatTime(heldSeconds)}` : "Embark";
          embarkButton.disabled = isDone || currentQuest?.status !== "active";
          embarkButton.addEventListener("click", (event) => {
            event.preventDefault();
            startQuestSubtaskTimer(subtask.id);
          });
          header.appendChild(embarkButton);

          const title = document.createElement("div");
          title.className = "questboard-step-title";
          title.textContent = subtask.title;
          header.appendChild(title);

          const menu = document.createElement("details");
          menu.className = "questboard-action-menu questboard-step-menu";

          const menuButton = document.createElement("summary");
          menuButton.className = "questboard-icon-button";
          menuButton.textContent = "...";
          menuButton.title = "Task actions";
          menuButton.setAttribute("aria-label", "Task actions");
          menu.appendChild(menuButton);

          const menuPanel = document.createElement("div");
          menuPanel.className = "questboard-action-menu-panel";

          const checkmarkButton = document.createElement("button");
          checkmarkButton.type = "button";
          checkmarkButton.className = "questboard-menu-action" + (isActive ? " is-timer-complete" : "");
          checkmarkButton.textContent = isDone ? "Uncheck" : "Checkmark";
          checkmarkButton.title = isDone ? "Remove checkmark" : "Complete task with typed minutes";
          checkmarkButton.addEventListener("click", (event) => {
            event.preventDefault();
            menu.open = false;
            void toggleQuestSubtaskCheckmark(subtask.id);
          });
          menuPanel.appendChild(checkmarkButton);

          const editButton = document.createElement("button");
          editButton.type = "button";
          editButton.className = "questboard-menu-action";
          editButton.textContent = "Edit task name";
          editButton.disabled = currentQuest?.status !== "active";
          editButton.addEventListener("click", (event) => {
            event.preventDefault();
            menu.open = false;
            editQuestSubtaskTitle(subtask.id);
          });
          menuPanel.appendChild(editButton);

          menu.appendChild(menuPanel);
          header.appendChild(menu);

          content.appendChild(header);

          item.appendChild(content);
          questStepList.appendChild(item);
        }
      }

      async function resolveRequestPlan(task, size, minutes, existingPlan = null) {
        if (existingPlan?.subtasks?.length) {
          return normalizeRequestPlan(existingPlan, task, size, minutes);
        }

        try {
          const response = await callTool("plan_focus_request", {
            task,
            requestSize: size,
            plannedMinutes: minutes,
          });
          return normalizeRequestPlan(response?.structuredContent?.requestPlan, task, size, minutes);
        } catch (error) {
          console.error("Could not plan request:", error?.message || error, error);
          return buildFallbackRequestPlan(task, size, minutes);
        }
      }      const LEVEL_THRESHOLDS = {

        1: 0,
        2: 90,
        3: 220,
        4: 420,
        5: 700,
        6: 1050,
        7: 1450,
        8: 1900,
        9: 2400,
        10: 3000,
      };

      function formatTime(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return [hours, minutes, seconds]
          .map((number) => String(number).padStart(2, "0"))
          .join(":");
      }

      function getFocusedSeconds() {
        if (!timerRunning || !startTime) {
          return accumulatedSeconds;
        }

        const currentRunSeconds = Math.floor((Date.now() - startTime) / 1000);
        return accumulatedSeconds + currentRunSeconds;
      }

      function getStoryToneLabel(storyTone) {
        const labels = {
          cozy_mythic: "Cozy Mythic",
          epic_heroic: "Epic Heroic",
          dramatic: "Dramatic",
          funny_chaos: "Funny Chaos",
          dark_mythic: "Dark Mythic",
        };

        return labels[storyTone] ?? "Epic Heroic";
      }

      function getTimerActiveSubtaskId() {
        return activeQuestProgress.questId === currentQuest?.id
          ? activeQuestProgress.activeSubtaskId
          : "";
      }

      function updateHoldButton() {
        if (!holdTimerButton) return;

        holdTimerButton.disabled = !questStarted || !getTimerActiveSubtaskId();
      }

      function updatePauseButton() {
        if (!pauseButton) return;

        pauseButton.disabled = !questStarted;

        if (timerRunning) {
          pauseButton.textContent = "\u23f8";
          pauseButton.title = "Pause timer";
          pauseButton.setAttribute("aria-label", "Pause timer");
        } else {
          pauseButton.textContent = "\u25b6";
          pauseButton.title = "Play timer";
          pauseButton.setAttribute("aria-label", "Play timer");
        }
      }

      function updateTimerDisplay() {
        const focusedSeconds = getFocusedSeconds();
        timerDisplay.textContent = formatTime(focusedSeconds);

        const minutes = Math.floor(focusedSeconds / 60);
        const activeSubtask = getActiveSubtask();

        if (!questStarted) {
          timerStatus.textContent = currentQuest?.status === "active"
            ? "Choose a checkmark task to begin."
            : "No request started.";
        } else if (timerRunning) {
          timerStatus.textContent = activeSubtask
            ? `Focusing on ${activeSubtask.title}.`
            : minutes >= 60
              ? "Legendary request in progress."
              : "Request in progress.";
        } else {
          timerStatus.textContent = activeSubtask
            ? `Paused on ${activeSubtask.title}.`
            : "Request paused.";
        }

        updatePauseButton();
        updateHoldButton();
      }

      function setFocusSessionActive(isActive) {
        document.body.classList.toggle("focus-session-active", isActive);

        if (questboardActiveCard) {
          questboardActiveCard.classList.toggle("focus-session-active", isActive);
        }

        if (heroEditButton) {
          heroEditButton.disabled = isActive;
        }

        if (openRequestModalButton) {
          openRequestModalButton.disabled = isActive;
        }
      }

      function syncTimerWithQuest() {
        if (currentQuest?.status === "active") {
          localTimerQuestId = currentQuest.id;
          setFocusSessionActive(questStarted);
          if (!questStarted) {
            updatePauseButton();
            updateHoldButton();
            if (cancelTimerButton) cancelTimerButton.disabled = true;
            completeButton.textContent = "Turn In Request";
        completeButton.disabled = true;
            updateTimerDisplay();
          }

          return;
        }

        if (questStarted) {
          resetLocalTimerAfterCompletion();
          localTimerQuestId = null;
        }

        setFocusSessionActive(false);
      }

      function pauseLocalTimer() {
        if (!timerRunning) return;

        accumulatedSeconds = getFocusedSeconds();
        timerRunning = false;
        startTime = null;

        clearInterval(timerInterval);
        updateTimerDisplay();

        updatePauseButton();
        updateHoldButton();
        if (cancelTimerButton) cancelTimerButton.disabled = false;
      }

      function resumeLocalTimer() {
        if (timerRunning || !questStarted) return;

        timerRunning = true;
        startTime = Date.now();

        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimerDisplay, 1000);
        updateTimerDisplay();

        updatePauseButton();
        updateHoldButton();
        if (cancelTimerButton) cancelTimerButton.disabled = false;
      }

      function resetLocalTimerAfterCompletion() {
        accumulatedSeconds = getFocusedSeconds();
        timerRunning = false;
        questStarted = false;
        startTime = null;
        localTimerQuestId = null;

        clearInterval(timerInterval);
        updateTimerDisplay();

        updatePauseButton();
        updateHoldButton();
        if (cancelTimerButton) cancelTimerButton.disabled = true;
        completeButton.disabled = true;
        setFocusSessionActive(false);
      }

      function cancelLocalTimer() {
        timerRunning = false;
        questStarted = false;
        startTime = null;
        accumulatedSeconds = 0;
        clearInterval(timerInterval);

        if (activeQuestProgress.questId === currentQuest?.id) {
          saveActiveQuestProgress({
            ...activeQuestProgress,
            activeSubtaskId: "",
          });
        }

        updatePauseButton();
        updateHoldButton();
        if (cancelTimerButton) cancelTimerButton.disabled = true;
        completeButton.textContent = "Turn In Request";
        completeButton.disabled = true;
        setFocusSessionActive(false);
        updateTimerDisplay();
        renderQuestSteps();
        renderActiveQuest();
      }

      function holdLocalTimer() {
        const activeSubtaskId = getTimerActiveSubtaskId();
        if (!currentQuest || !questStarted || !activeSubtaskId) return;

        const heldSeconds = Math.max(0, getFocusedSeconds());

        timerRunning = false;
        questStarted = false;
        startTime = null;
        accumulatedSeconds = 0;
        clearInterval(timerInterval);

        saveActiveQuestProgress({
          ...activeQuestProgress,
          questId: currentQuest.id,
          activeSubtaskId: "",
          subtaskHeldSecondsById: {
            ...(activeQuestProgress.subtaskHeldSecondsById || {}),
            [activeSubtaskId]: heldSeconds,
          },
        });

        updatePauseButton();
        updateHoldButton();
        if (cancelTimerButton) cancelTimerButton.disabled = true;
        completeButton.textContent = "Turn In Request";
        completeButton.disabled = true;
        setFocusSessionActive(false);
        updateTimerDisplay();
        renderQuestSteps();
        renderActiveQuest();
      }

      function readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.addEventListener("load", () => resolve(reader.result));
          reader.addEventListener("error", () => reject(reader.error));
          reader.readAsDataURL(file);
        });
      }

      function loadImageSource(source) {
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.addEventListener("load", () => resolve(image));
          image.addEventListener("error", () => reject(new Error("Image failed to load.")));
          image.src = source;
        });
      }

      async function createPortraitDataUrl(file) {
        const source = await readFileAsDataUrl(file);
        const image = await loadImageSource(source);
        const maxSize = 1024;
        const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight));
        const width = Math.max(1, Math.round(image.naturalWidth * scale));
        const height = Math.max(1, Math.round(image.naturalHeight * scale));
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);

        return canvas.toDataURL("image/jpeg", 0.88);
      }

      function normalizePortraitCropValue(value, fallback = 50) {
        const number = Number(value);
        return Math.max(0, Math.min(100, Math.round(Number.isFinite(number) ? number : fallback)));
      }

      function normalizePortraitZoom(value, fallback = 1) {
        const number = Number(value);
        return Math.max(1, Math.min(3, Number.isFinite(number) ? number : fallback));
      }

      function getPortraitCrop() {
        const source = portraitCropDraft || character;
        return {
          x: normalizePortraitCropValue(source?.portraitCropX),
          y: normalizePortraitCropValue(source?.portraitCropY),
          zoom: normalizePortraitZoom(source?.portraitZoom),
        };
      }

      function applyPortraitCrop() {
        const crop = getPortraitCrop();
        const position = crop.x + "% " + crop.y + "%";
        const transform = "scale(" + crop.zoom.toFixed(2) + ")";

        for (const image of [questboardPortraitImage, heroPortraitImage, portraitModalImage]) {
          if (!image) {
            continue;
          }
          image.style.objectPosition = position;
          image.style.transform = transform;
          image.style.transformOrigin = position;
        }

        if (portraitZoomLabel) {
          portraitZoomLabel.textContent = Math.round(crop.zoom * 100) + "%";
        }
      }

      function setPortraitCropDraft(x, y, zoom = getPortraitCrop().zoom) {
        portraitCropDraft = {
          portraitCropX: normalizePortraitCropValue(x),
          portraitCropY: normalizePortraitCropValue(y),
          portraitZoom: normalizePortraitZoom(zoom),
        };
        applyPortraitCrop();
      }

      function adjustPortraitZoom(delta) {
        if (!hasPortraitImageForCropping()) {
          if (portraitUploadStatus) portraitUploadStatus.textContent = "Upload or keep a portrait before adjusting zoom.";
          return;
        }

        const crop = getPortraitCrop();
        setPortraitCropDraft(crop.x, crop.y, crop.zoom + delta);
        if (portraitUploadStatus) portraitUploadStatus.textContent = "Portrait zoom adjusted. Save Portrait to keep it.";
      }

      function hasPortraitImageForCropping() {
        return Boolean(uploadedPortraitImageData || character.portraitImageUrl);
      }

      function setPortraitImageSource(imageUrl) {
        if (imageUrl) {
          if (questboardPortraitImage) {
            questboardPortraitImage.src = imageUrl;
            questboardPortraitImage.style.display = "block";
          }
          if (questboardPortraitPlaceholder) {
            questboardPortraitPlaceholder.style.display = "none";
          }
          if (heroPortraitImage) {
            heroPortraitImage.src = imageUrl;
            heroPortraitImage.style.display = "block";
          }
          if (heroPortraitPlaceholder) {
            heroPortraitPlaceholder.style.display = "none";
          }
          if (portraitModalImage) {
            portraitModalImage.src = imageUrl;
            portraitModalImage.style.display = "block";
          }
          if (portraitModalPlaceholder) {
            portraitModalPlaceholder.style.display = "none";
          }
          applyPortraitCrop();
          return;
        }

        if (questboardPortraitImage) {
          questboardPortraitImage.removeAttribute("src");
          questboardPortraitImage.style.display = "none";
        }
        if (questboardPortraitPlaceholder) {
          questboardPortraitPlaceholder.style.display = "grid";
        }
        if (heroPortraitImage) {
          heroPortraitImage.removeAttribute("src");
          heroPortraitImage.style.display = "none";
        }
        if (heroPortraitPlaceholder) {
          heroPortraitPlaceholder.style.display = "grid";
        }
        if (portraitModalImage) {
          portraitModalImage.removeAttribute("src");
          portraitModalImage.style.display = "none";
        }
        if (portraitModalPlaceholder) {
          portraitModalPlaceholder.style.display = "grid";
        }
        applyPortraitCrop();
      }
      function setPortraitGenerating(isGenerating) {
        generateImageButton.disabled = isGenerating;
        saveImageButton.disabled = isGenerating;
        saveCharacterButton.disabled = isGenerating;
        generatePromptButton.disabled = isGenerating;
        generateImageButton.classList.toggle("is-loading", isGenerating);
        generateImageButton.textContent = isGenerating
          ? "Copying Prompt..."
          : "Copy Image Prompt";

        if (isGenerating) {
          portraitGenerationStatus.textContent =
            "Preparing the manual image prompt.";
        } else if (
          portraitGenerationStatus.textContent ===
          "Preparing the manual image prompt."
        ) {
          portraitGenerationStatus.textContent = "";
        }
      }

      function setSelectValue(select, value, fallback) {
        const nextValue = value || fallback;
        const hasOption = Array.from(select.options).some(
          (option) => option.value === nextValue
        );

        select.value = hasOption ? nextValue : fallback;
      }

      function renderCharacter() {
        portraitPrompt.textContent = character.portraitPrompt;
        questboardPortraitName.textContent = character.name;
        questboardOutfitName.textContent = "Eris-Touched Hero";
        heroPortraitName.textContent = character.name;
        heroOutfitName.textContent = character.outfitName || "Hero Starter Outfit";
        portraitModalName.textContent = character.name;
        portraitModalOutfit.textContent = character.outfitName || "Hero Starter Outfit";
        portraitModalLevel.textContent = `Level ${player.level}`;

        if (character.portraitImageUrl) {
          setPortraitImageSource(character.portraitImageUrl);
        } else {
          setPortraitImageSource("");
          const initials = (character.name || "Eris-Touched Hero")
            .split(" ")
            .map((part) => part[0]?.toUpperCase())
            .slice(0, 2)
            .join("");
          if (questboardPortraitInitials) {
            questboardPortraitInitials.textContent = initials || "ET";
          }
          heroPortraitInitials.textContent = initials || "ET";
          portraitModalInitials.textContent = initials || "ET";
        }

        if (document.activeElement !== characterNameInput) {
          characterNameInput.value = character.name;
        }

        if (document.activeElement !== characterDescriptionInput) {
          characterDescriptionInput.value = character.description;
        }
        if (document.activeElement !== characterRaceSelect) {
          setSelectValue(characterRaceSelect, character.race, "Human");
        }
        if (document.activeElement !== hairColorSelect) {
          setSelectValue(hairColorSelect, character.hairColor, "Black");
        }
        if (document.activeElement !== skinColorSelect) {
          setSelectValue(skinColorSelect, character.skinColor, "Olive");
        }
        if (uploadedPortraitImageData === null && portraitUploadStatus) {
          portraitUploadStatus.textContent = character.portraitImageUrl
            ? "Current portrait saved."
            : "No portrait uploaded yet.";
        }
        if (portraitCropDraft === null) {
          applyPortraitCrop();
        }
        if (document.activeElement !== outfitNameInput) {
          outfitNameInput.value = character.outfitName ?? "Hero Starter Outfit";
        }

        renderQuestboardHeroStatus();
      }

      function renderQuestboardHeroStatus() {
        if (questboardLevelBadge) {
          questboardLevelBadge.textContent = `Lv ${player.level}`;
        }

        if (questboardGoldTotal) {
          questboardGoldTotal.textContent = player.coins ?? 0;
        }

        if (!questboardLevelFill || !questboardLevelLabel) return;

        const currentLevelXp = LEVEL_THRESHOLDS[player.level] ?? 0;
        const nextLevelXp = LEVEL_THRESHOLDS[player.level + 1];

        if (!nextLevelXp) {
          questboardLevelFill.style.width = "100%";
          questboardLevelLabel.textContent = "Max level reached";
          return;
        }

        const earnedThisLevel = player.totalXp - currentLevelXp;
        const neededThisLevel = nextLevelXp - currentLevelXp;
        const percent = Math.max(
          0,
          Math.min(100, Math.round((earnedThisLevel / neededThisLevel) * 100))
        );

        questboardLevelFill.style.width = `${percent}%`;
        questboardLevelLabel.textContent =
          `${player.totalXp} / ${nextLevelXp} XP to Level ${player.level + 1}`;
      }

      function renderHero() {
        heroLevel.textContent = player.level;
        heroXp.textContent = player.totalXp;
        heroCoins.textContent = player.coins ?? 0;
        heroQuests.textContent = player.completedQuests;
        heroLootCount.textContent = player.inventory.length;

        const currentLevelXp = LEVEL_THRESHOLDS[player.level] ?? 0;
        const nextLevelXp = LEVEL_THRESHOLDS[player.level + 1];

        if (!nextLevelXp) {
          levelFill.style.width = "100%";
          levelLabel.textContent = "Max level reached";
        } else {
          const earnedThisLevel = player.totalXp - currentLevelXp;
          const neededThisLevel = nextLevelXp - currentLevelXp;
          const percent = Math.max(
            0,
            Math.min(100, Math.round((earnedThisLevel / neededThisLevel) * 100))
          );

          levelFill.style.width = `${percent}%`;
          levelLabel.textContent =
            `${player.totalXp} / ${nextLevelXp} XP to Level ${player.level + 1}`;
        }
      }

      function renderInventory() {
        inventoryList.innerHTML = "";

        if (!player.inventory.length) {
          inventoryList.className = "empty";
          inventoryList.textContent = "No loot yet.";
          return;
        }

        inventoryList.className = "";

        for (const item of player.inventory) {
          const div = document.createElement("div");
          div.className = "inventory-item";

          const name = document.createElement("div");
          name.className = "inventory-name";
          name.textContent = item.name;

          const details = document.createElement("div");
          details.className = "inventory-details";
          const goldBonus = item.goldBonus ?? item.xpBonus ?? 0;
          details.textContent =
            `${item.rarity} · +${goldBonus}% future Gold bonus`;

          div.appendChild(name);
          div.appendChild(details);
          inventoryList.appendChild(div);
        }
      }

      function renderQuest() {
        const state = getQuestResultPanelState(currentQuest, lastCompletedQuest, {
          questStarted,
        });

        questStatus.textContent = state.statusText;
        questLoot.textContent = state.lootText;
      }

      function renderNpcChoices() {
        npcChoiceList.innerHTML = "";

        if (!pendingNpcChoices.length) {
          npcChoicePanel.style.display = "none";
          return;
        }

        npcChoicePanel.style.display = "block";

        for (const npc of pendingNpcChoices) {
          const card = document.createElement("div");
          card.className = "npc-card";

          const name = document.createElement("div");
          name.className = "npc-name";
          name.textContent = npc.name;

          const role = document.createElement("div");
          role.className = "npc-role";
          role.textContent = npc.role;

          const description = document.createElement("div");
          description.className = "npc-description";
          description.textContent = npc.description;

          const button = document.createElement("button");
          button.type = "button";
          button.className = "primary loading-button";
          button.textContent = "Invite";
          button.addEventListener("click", async (event) => {
            event.preventDefault();
            button.disabled = true;
            button.textContent = "Inviting...";
            try {
              await callTool("choose_npc", { npcId: npc.id });
            } catch (error) {
              reportToolError(error);
            } finally {
              button.disabled = false;
              button.textContent = "Invite";
            }
          });

          card.appendChild(name);
          card.appendChild(role);
          card.appendChild(description);
          card.appendChild(button);
          npcChoiceList.appendChild(card);
        }
      }

      function renderKnownNpcs() {
        knownNpcList.innerHTML = "";

        if (!knownNpcs.length) {
          knownNpcList.className = "empty";
          knownNpcList.textContent = "No NPCs have joined yet.";
          return;
        }

        knownNpcList.className = "";

        for (const npc of knownNpcs) {
          const card = document.createElement("div");
          card.className = "npc-card";

          const name = document.createElement("div");
          name.className = "npc-name";
          name.textContent = npc.name;

          const role = document.createElement("div");
          role.className = "npc-role";
          role.textContent = npc.role;

          const description = document.createElement("div");
          description.className = "npc-description";
          description.textContent = npc.description;

          card.appendChild(name);
          card.appendChild(role);
          card.appendChild(description);
          knownNpcList.appendChild(card);
        }
      }

      function createRequestTaskDetails({ isActive = false, requestPlan, request = null, open = false }) {
        const details = document.createElement("details");
        details.className = "questboard-request-task-details";
        details.open = open;

        const summary = document.createElement("summary");
        summary.textContent = "Request Details";
        details.appendChild(summary);

        const list = document.createElement("div");
        list.className = isActive ? "questboard-step-list" : "questboard-step-list pinned-request-task-list";
        const subtasks = isActive ? getQuestPlanSubtasks() : (Array.isArray(requestPlan?.subtasks) ? requestPlan.subtasks : []);

        if (!subtasks.length) {
          list.className += " empty";
          list.textContent = "No checkmark tasks available.";
          details.appendChild(list);
          return details;
        }

        const completed = isActive ? new Set(getQuestCompletedSubtaskIds()) : new Set();
        const activeSubtaskId = isActive && activeQuestProgress.questId === currentQuest?.id ? activeQuestProgress.activeSubtaskId : "";
        const normalizedRequest = request ? normalizePinnedRequest(request) : null;

        for (const subtask of subtasks) {
          const isDone = completed.has(subtask.id);
          const isRunning = isActive && activeSubtaskId === subtask.id && questStarted;
          const heldSeconds = isActive ? Math.max(0, Math.round(Number(activeQuestProgress.subtaskHeldSecondsById?.[subtask.id]) || 0)) : 0;
          const item = document.createElement("div");
          item.className = "questboard-step-item" + (isDone ? " is-done" : "") + (isRunning ? " is-active" : "") + (heldSeconds > 0 && !isRunning && !isDone ? " is-held" : "");

          const content = document.createElement("div");
          content.className = "questboard-step-content";
          const header = document.createElement("div");
          header.className = "questboard-step-header";

          const embarkButton = document.createElement("button");
          embarkButton.type = "button";
          embarkButton.className = "primary questboard-step-embark-button";
          embarkButton.textContent = isRunning ? "||" : "\u00bb";
          embarkButton.title = isRunning ? "Timer running" : heldSeconds > 0 ? "Resume from " + formatTime(heldSeconds) : "Embark on this task";
          embarkButton.disabled = isDone || questStarted || (isActive ? currentQuest?.status !== "active" : false);
          embarkButton.addEventListener("click", async (event) => {
            event.preventDefault();

            if (isActive) {
              startQuestSubtaskTimer(subtask.id);
              return;
            }

            if (!normalizedRequest) return;

            try {
              await embarkRequest(normalizedRequest, {
                button: embarkButton,
                activePinnedId: normalizedRequest.id,
              });
              startQuestSubtaskTimer(subtask.id);
            } catch (error) {
              console.error("Pinned task embark failed:", error?.message || error, error);
              reportToolError(error);
            }
          });
          header.appendChild(embarkButton);

          const titleGroup = document.createElement("div");
          titleGroup.className = "questboard-step-title-group";
          const title = document.createElement("div");
          title.className = "questboard-step-title";
          title.textContent = subtask.title;
          titleGroup.appendChild(title);

          const menu = document.createElement("details");
          menu.className = "questboard-action-menu questboard-step-menu";
          const menuButton = document.createElement("summary");
          menuButton.className = "questboard-icon-button";
          menuButton.textContent = "...";
          menuButton.title = "Task actions";
          menuButton.setAttribute("aria-label", "Task actions");
          menu.appendChild(menuButton);

          const menuPanel = document.createElement("div");
          menuPanel.className = "questboard-action-menu-panel";

          if (isActive) {
            const checkmarkButton = document.createElement("button");
            checkmarkButton.type = "button";
            checkmarkButton.className = "questboard-menu-action" + (isRunning ? " is-timer-complete" : "");
            checkmarkButton.textContent = isDone ? "Uncheck" : "Checkmark";
            checkmarkButton.title = isDone ? "Remove checkmark" : "Complete task with typed minutes";
            checkmarkButton.addEventListener("click", (event) => {
              event.preventDefault();
              menu.open = false;
              void toggleQuestSubtaskCheckmark(subtask.id);
            });
            menuPanel.appendChild(checkmarkButton);
          }

          const editButton = document.createElement("button");
          editButton.type = "button";
          editButton.className = "questboard-menu-action";
          editButton.textContent = "Edit task name";
          editButton.addEventListener("click", (event) => {
            event.preventDefault();
            menu.open = false;
            const nextTitle = window.prompt("Rename this checkmark task:", subtask.title);
            if (nextTitle === null) return;
            const cleanTitle = nextTitle.trim();
            if (!cleanTitle) return;

            if (isActive) {
              saveActiveQuestProgress({
                ...activeQuestProgress,
                questId: currentQuest?.id || "",
                subtaskTitlesById: {
                  ...(activeQuestProgress.subtaskTitlesById || {}),
                  [subtask.id]: cleanTitle,
                },
              });
              renderActiveQuest();
              return;
            }

            if (!normalizedRequest) return;
            setPinnedRequests(pinnedRequests.map((entry) => {
              if (entry.id !== normalizedRequest.id) return entry;
              const normalizedEntry = normalizePinnedRequest(entry);
              const nextPlan = {
                ...normalizedEntry.requestPlan,
                subtasks: normalizedEntry.requestPlan.subtasks.map((task) => task.id === subtask.id ? { ...task, title: cleanTitle } : task),
              };
              return normalizePinnedRequest({
                ...normalizedEntry,
                requestPlan: nextPlan,
              });
            }));
          });
          menuPanel.appendChild(editButton);
          menu.appendChild(menuPanel);
          titleGroup.appendChild(menu);
          header.appendChild(titleGroup);

          content.appendChild(header);
          item.appendChild(content);
          list.appendChild(item);
        }

        details.appendChild(list);
        return details;
      }
      function createActiveRequestCard() {
        if (!currentQuest || currentQuest.status !== "active") return null;

        const card = document.createElement("div");
        card.className = "pinned-request-card questboard-current-request-card";

        const titleRow = document.createElement("div");
        titleRow.className = "pinned-request-title-row";
        const titleGroup = document.createElement("div");
        const title = document.createElement("div");
        title.className = "pinned-request-title";
        title.textContent = getQuestFantasyTitle();
        const subtitle = document.createElement("div");
        subtitle.className = "pinned-request-description";
        subtitle.textContent = getQuestDisplayTask();
        titleGroup.appendChild(title);
        titleGroup.appendChild(subtitle);

        const requestMenu = document.createElement("details");
        requestMenu.className = "questboard-action-menu pinned-request-menu";
        const requestMenuButton = document.createElement("summary");
        requestMenuButton.className = "questboard-icon-button";
        requestMenuButton.textContent = "...";
        requestMenuButton.title = "Request actions";
        requestMenuButton.setAttribute("aria-label", "Request actions");
        requestMenu.appendChild(requestMenuButton);
        const requestMenuPanel = document.createElement("div");
        requestMenuPanel.className = "questboard-action-menu-panel";

        const editFantasyButton = document.createElement("button");
        editFantasyButton.type = "button";
        editFantasyButton.className = "questboard-menu-action";
        editFantasyButton.textContent = "Edit fantasy name";
        editFantasyButton.addEventListener("click", (event) => {
          event.preventDefault();
          requestMenu.open = false;
          editActiveRequestTitle();
        });
        requestMenuPanel.appendChild(editFantasyButton);

        const editTaskButton = document.createElement("button");
        editTaskButton.type = "button";
        editTaskButton.className = "questboard-menu-action";
        editTaskButton.textContent = "Edit true request name";
        editTaskButton.addEventListener("click", (event) => {
          event.preventDefault();
          requestMenu.open = false;
          editActiveTaskTitle();
        });
        requestMenuPanel.appendChild(editTaskButton);

        const cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.className = "questboard-menu-action danger";
        cancelButton.textContent = "Cancel request";
        cancelButton.addEventListener("click", (event) => {
          event.preventDefault();
          requestMenu.open = false;
          cancelActiveRequest();
        });
        requestMenuPanel.appendChild(cancelButton);
        requestMenu.appendChild(requestMenuPanel);

        titleRow.appendChild(titleGroup);
        titleRow.appendChild(requestMenu);
        card.appendChild(titleRow);

        const totals = getQuestProgressTotals();
        card.appendChild(createRequestProgressBlock(totals.completedCount, totals.totalCount, totals.completedMinutes, totals.totalMinutes));
        const details = createRequestTaskDetails({ isActive: true, open: false });

        const reward = document.createElement("div");
        reward.className = "questboard-active-reward-estimate";
        const rewardMinutes = totals.completedMinutes;
        reward.textContent = getRewardXp(rewardMinutes) + " XP - " + getRewardGold(rewardMinutes) + " Gold";
        details.appendChild(reward);

        const actions = document.createElement("div");
        actions.className = "pinned-request-actions";
        const turnInButton = document.createElement("button");
        turnInButton.type = "button";
        turnInButton.className = "danger loading-button";
        turnInButton.textContent = "Turn In Request";
        turnInButton.disabled = !areQuestStepsComplete();
        turnInButton.addEventListener("click", (event) => {
          event.preventDefault();
          completeCurrentQuest(turnInButton);
        });
        actions.appendChild(turnInButton);
        details.appendChild(actions);
        card.appendChild(details);
        return card;
      }

      function createPinnedRequestCard(request) {
        const card = document.createElement("div");
        card.className = "pinned-request-card";

        const normalizedRequest = normalizePinnedRequest(request);
        const requestPlan = normalizedRequest.requestPlan;

        const titleRow = document.createElement("div");
        titleRow.className = "pinned-request-title-row";

        const title = document.createElement("div");
        title.className = "pinned-request-title";
        title.textContent = normalizedRequest.task;

        const requestMenu = document.createElement("details");
        requestMenu.className = "questboard-action-menu pinned-request-menu";

        const requestMenuButton = document.createElement("summary");
        requestMenuButton.className = "questboard-icon-button";
        requestMenuButton.textContent = "...";
        requestMenuButton.title = "Request actions";
        requestMenuButton.setAttribute("aria-label", "Request actions");
        requestMenu.appendChild(requestMenuButton);

        const requestMenuPanel = document.createElement("div");
        requestMenuPanel.className = "questboard-action-menu-panel";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "questboard-menu-action pinned-request-edit-button";
        editButton.textContent = "Edit request name";
        editButton.addEventListener("click", (event) => {
          event.preventDefault();
          requestMenu.open = false;
          const nextTask = window.prompt("Rename this pinned request:", normalizedRequest.task);
          if (nextTask === null) return;
          const cleanTask = nextTask.trim();
          if (!cleanTask) return;
          setPinnedRequests(pinnedRequests.map((entry) => entry.id === normalizedRequest.id ? normalizePinnedRequest({ ...entry, task: cleanTask }) : entry));
        });
        requestMenuPanel.appendChild(editButton);

        const cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.className = "questboard-menu-action danger";
        cancelButton.textContent = "Cancel request";
        cancelButton.addEventListener("click", (event) => {
          event.preventDefault();
          requestMenu.open = false;
          const confirmed = window.confirm("Cancel this pinned request?");
          if (!confirmed) return;
          rememberCanceledPinnedRequest(normalizedRequest);
          setPinnedRequests(pinnedRequests.filter((entry) => entry.id !== normalizedRequest.id));
        });
        requestMenuPanel.appendChild(cancelButton);
        requestMenu.appendChild(requestMenuPanel);

        titleRow.appendChild(title);
        titleRow.appendChild(requestMenu);

        const description = document.createElement("div");
        description.className = "pinned-request-description";
        description.textContent = "Ready on the board.";

        const meta = document.createElement("div");
        meta.className = "pinned-request-meta";
        const rewardMinutes = 0;
        const rewards = [
          ["XP", `${getRewardXp(rewardMinutes)} XP`],
          ["$", `${getRewardGold(rewardMinutes)} Gold`],
        ];

        for (const [icon, value] of rewards) {
          const span = document.createElement("span");
          const iconSpan = document.createElement("span");
          iconSpan.className = "reward-icon";
          iconSpan.textContent = icon;
          const strong = document.createElement("strong");
          strong.textContent = value;
          span.appendChild(iconSpan);
          span.appendChild(strong);
          meta.appendChild(span);
        }

        const actions = document.createElement("div");
        actions.className = "pinned-request-actions";
        const turnInButton = document.createElement("button");
        turnInButton.type = "button";
        turnInButton.className = "danger loading-button";
        turnInButton.textContent = "Turn In Request";
        turnInButton.disabled = true;
        actions.appendChild(turnInButton);

        card.appendChild(titleRow);
        card.appendChild(description);
        card.appendChild(createRequestProgressBlock(0, requestPlan.subtasks.length, 0, 0));
        const details = createRequestTaskDetails({ requestPlan, request: normalizedRequest, open: false });
        details.appendChild(meta);
        details.appendChild(actions);
        card.appendChild(details);

        return card;
      }
      function renderPinnedRequests() {
        if (!pinnedRequestList) return;

        pinnedRequestList.innerHTML = "";

        const activeCard = createActiveRequestCard();
        const visiblePinnedRequests = pinnedRequests.filter((request) => {
          return !(currentQuest?.status === "active" && activePinnedRequestId && request.id === activePinnedRequestId);
        });
        const visibleCount = visiblePinnedRequests.length + (activeCard ? 1 : 0);

        if (pinnedRequestCount) {
          pinnedRequestCount.textContent = String(visibleCount);
        }

        if (!visibleCount) {
          pinnedRequestList.className = "pinned-request-list empty";
          pinnedRequestList.textContent = "No requests on the board yet.";
          return;
        }

        pinnedRequestList.className = "pinned-request-list";

        if (activeCard) {
          pinnedRequestList.appendChild(activeCard);
        }

        for (const request of visiblePinnedRequests) {
          pinnedRequestList.appendChild(createPinnedRequestCard(request));
        }
      }

      function renderActiveQuest() {
        const isActive = currentQuest?.status === "active";
        const showFocusCard = isActive && questStarted;
        const requestPlan = getCurrentQuestRequestPlan();

        renderPinnedRequests();

        if (questboardActiveCard) {
          questboardActiveCard.classList.toggle("is-visible", showFocusCard);
        }
        setFocusSessionActive(showFocusCard);

        const activeSubtask = getActiveSubtask();

        if (completeButton) {
          completeButton.textContent = showFocusCard && activeSubtask ? "Complete Task" : "Turn In Request";
          completeButton.disabled = !(showFocusCard && activeSubtask);
        }

        if (editActiveRequestButton) {
          editActiveRequestButton.style.display = showFocusCard ? "inline-grid" : "none";
          editActiveRequestButton.disabled = !showFocusCard;
        }

        if (editActiveTaskButton) {
          editActiveTaskButton.style.display = showFocusCard ? "inline-grid" : "none";
          editActiveTaskButton.disabled = !showFocusCard;
        }

        if (cancelActiveRequestButton) {
          cancelActiveRequestButton.style.display = showFocusCard ? "inline-grid" : "none";
          cancelActiveRequestButton.disabled = !showFocusCard;
        }

        if (activeQuestEmpty) {
          activeQuestEmpty.style.display = showFocusCard ? "none" : "block";
        }

        if (activeQuestDetails) {
          activeQuestDetails.style.display = showFocusCard ? "block" : "none";
        }

        if (!showFocusCard) {
          renderQuestSteps();
          return;
        }

        const totals = getQuestProgressTotals();
        const requestTask = getQuestDisplayTask();
        const timerSubtask = activeSubtask || getActiveSubtask();

        if (activeQuestTitle) {
          activeQuestTitle.textContent = timerSubtask?.title || getQuestFantasyTitle();
        }

        if (activeQuestOriginalTask) {
          activeQuestOriginalTask.textContent = requestTask;
        }


        if (activeQuestRewardEstimate) {
          const rewardMinutes = totals.completedMinutes;
          activeQuestRewardEstimate.textContent = `${getRewardXp(rewardMinutes)} XP - ${getRewardGold(rewardMinutes)} Gold`;
        }

        if (questRequestProgressLabel) {
          questRequestProgressLabel.textContent = `${totals.completedCount} / ${totals.totalCount} Checkmarks - ${formatTime(getFocusedSeconds())}`;
        }

        if (questRequestProgressFill) {
          const progressPercent = totals.totalCount > 0 ? Math.round((totals.completedCount / totals.totalCount) * 100) : 0;
          questRequestProgressFill.style.width = `${Math.max(0, Math.min(100, progressPercent))}%`;
        }

        renderQuestSteps();
      }

      function renderQuestboardCharter() {
        if (!questboardCharterGoal) return;

        const goal = appSettings.overarchingGoal || "Build better habits";
        const goalPercent = Math.max(
          0,
          Math.min(100, Math.round(((player.totalXp || 0) / 3000) * 100))
        );

        questboardCharterGoal.textContent = goal;

        if (questboardCharterProgressLabel) {
          questboardCharterProgressLabel.textContent = `${goalPercent}%`;
        }
        if (questboardCharterProgressFill) {
          questboardCharterProgressFill.style.width = `${goalPercent}%`;
        }
      }

      function renderStoryChapters() {
        if (!storyChapterList) return;
        storyChapterList.innerHTML = "";

        if (!storyChapters.length) {
          storyChapterList.className = "empty";
          storyChapterList.textContent = "No story chapters yet.";
          return;
        }

        storyChapterList.className = "";

        for (const chapter of storyChapters) {
          const details = document.createElement("details");
          details.className = "story-chapter story-chapter-collapsible";

          const summary = document.createElement("summary");
          summary.textContent = chapter.title || "Request Chapter";

          const content = document.createElement("div");
          content.className = "story-chapter-content";

          const meta = document.createElement("div");
          meta.className = "story-chapter-meta";
          const rewardText = chapter.coins ? `${chapter.coins} Gold` : "0 Gold";
          const xpText = chapter.xp ? `${chapter.xp} XP` : "0 XP";
          const minutesText = chapter.minutes ? `${chapter.minutes} min` : "0 min";
          meta.textContent = `${minutesText} - ${xpText} - ${rewardText}`;

          const body = document.createElement("p");
          body.className = "story-chapter-body";
          body.textContent = chapter.body || chapter.rewardSummary || "The guild record is quiet for this chapter.";

          content.appendChild(meta);
          content.appendChild(body);
          details.appendChild(summary);
          details.appendChild(content);
          storyChapterList.appendChild(details);
        }
      }
      function renderStoryLog() {
        storyLog.innerHTML = "";

        if (!log.length) {
          const li = document.createElement("li");
          li.className = "empty";
          li.textContent = "No guild request log entries yet.";
          storyLog.appendChild(li);
          return;
        }

        for (const entry of log) {
          const li = document.createElement("li");
          li.textContent = entry;
          storyLog.appendChild(li);
        }
      }

      function renderChronicleStats() {
        const highestXp = storyChapters.reduce(
          (max, chapter) => Math.max(max, chapter.xp || 0),
          0
        );
        const longestRequest = storyChapters.reduce(
          (longest, chapter) => {
            if (!chapter.minutes) return longest;
            return chapter.minutes > longest.minutes ? chapter : longest;
          },
          { minutes: 0, title: "None yet" }
        );

        document.querySelector("#chronicle-total-xp").textContent =
          player.totalXp;
        document.querySelector("#chronicle-coins").textContent =
          player.coins ?? 0;
        document.querySelector("#chronicle-completed-requests").textContent =
          player.completedQuests;
        document.querySelector("#chronicle-loot-count").textContent =
          player.inventory.length;
        document.querySelector("#chronicle-known-npcs").textContent =
          knownNpcs.length;
        document.querySelector("#chronicle-highest-xp").textContent = highestXp;
        document.querySelector("#chronicle-longest-request").textContent =
          longestRequest.title && longestRequest.minutes
            ? `${longestRequest.title} (${longestRequest.minutes} min)`
            : "None yet";
      }

      function renderSettings() {
        storyToneSelect.value = appSettings.storyTone ?? "epic_heroic";
        if (document.activeElement !== overarchingGoalInput) {
          overarchingGoalInput.value =
            appSettings.overarchingGoal ?? "Build better habits";
        }
      }

      function render() {
        renderCharacter();
        renderHero();
        renderSettings();
        renderNpcChoices();
        renderKnownNpcs();
        renderInventory();
        renderQuest();
        renderPinnedRequests();
        renderActiveQuest();
        renderQuestboardCharter();
        renderStoryChapters();
        renderStoryLog();
        renderChronicleStats();
      }

      function setRequestModalStatus(message = "", tone = "") {
        if (!requestModalStatus) return;
        requestModalStatus.textContent = message;
        requestModalStatus.dataset.tone = tone;
      }

      function getRequestModalTask() {
        return taskInput?.value?.trim?.() ?? "";
      }

      function setRequestModalButtonsDisabled(isDisabled) {
        if (startButton) startButton.disabled = isDisabled;
        if (embarkNowButton) embarkNowButton.disabled = isDisabled;
      }

      async function pinRequestFromModal(event) {
        event?.preventDefault?.();

        setRequestModalButtonsDisabled(true);
        startButton.classList.add("is-loading");
        startButton.textContent = "Pinning...";
        setRequestModalStatus("Saving request to the board...", "working");

        try {
          const request = getRequestDraftFromModal();
          if (!request) return;

          addPinnedRequest(request);
          setRequestModalStatus("Pinned to the request board.", "success");
          closeRequestModal();
        } catch (error) {
          console.error("Pin request failed:", error?.message || error, error);
          setRequestModalStatus(error.message || "Pin request failed.", "error");
          reportToolError(error);
        } finally {
          startButton.classList.remove("is-loading");
          startButton.textContent = "Pin Request";
          setRequestModalButtonsDisabled(false);
        }
      }

      async function embarkRequest(request, { button, activePinnedId = "", closeModal = false } = {}) {
        const normalizedRequest = normalizePinnedRequest(request);

        if (!normalizedRequest) {
          throw new Error("Missing guild request task.");
        }

        const originalText = button?.textContent || "Embark";

        if (currentQuest?.status === "active") {
          if (questStarted) {
            throw new Error("Hold, complete, or cancel the current timer before embarking on another request.");
          }

          const confirmed = window.confirm("Cancel the current active request and embark on this one instead?");
          if (!confirmed) return;

          const cancelled = await cancelActiveRequest({ skipConfirm: true });
          if (!cancelled) return;
        }

        if (button) {
          button.disabled = true;
          button.classList.add("is-loading");
          button.textContent = "Embarking...";
        }

        timerStatus.textContent = "Writing the quest opening...";
        setActivePinnedRequestId(activePinnedId);
        clearActiveQuestProgress();

        try {
          await callTool("start_focus_quest", {
            task: normalizedRequest.task,
            questTitle: normalizedRequest.questTitle,
            plannedMinutes: normalizedRequest.plannedMinutes,
            requestSize: normalizedRequest.requestSize,
            requestPlan: normalizedRequest.requestPlan,
          });

          if (closeModal) {
            closeRequestModal();
          }
        } catch (error) {
          setActivePinnedRequestId("");
          throw error;
        } finally {
          if (button) {
            const isCurrentPinnedRequest = Boolean(activePinnedId && currentQuest?.status === "active" && activePinnedRequestId === activePinnedId);
            button.classList.remove("is-loading");
            button.textContent = isCurrentPinnedRequest ? "Active" : originalText;
            button.disabled = questStarted || isCurrentPinnedRequest;
          }

          if (!questStarted) {
            updateTimerDisplay();
          }
        }
      }

      async function embarkRequestFromModal(event) {
        event?.preventDefault?.();

        setRequestModalButtonsDisabled(true);
        setRequestModalStatus("Starting request...", "working");

        try {
          const request = getRequestDraftFromModal();
          if (!request) return;

          await embarkRequest(request, {
            button: embarkNowButton,
            activePinnedId: findPinnedRequestId(request.task, request.plannedMinutes, request.requestSize),
            closeModal: true,
          });
          setRequestModalStatus("Expedition started.", "success");
        } catch (error) {
          console.error("Embark request failed:", error?.message || error, error);
          setRequestModalStatus(error.message || "Embark failed.", "error");
          reportToolError(error);
        } finally {
          setRequestModalButtonsDisabled(false);
        }
      }

      function openSettingsModal() {
        setOverlayLayerVisible(settingsModal, true);
        settingsModal.style.display = "grid";
      }

      function closeSettingsModal() {
        settingsModal.style.display = "none";
        setOverlayLayerVisible(settingsModal, false);
      }

      function openRequestModal() {
        if (!requestModal) return;
        requestModal.style.display = "grid";
        setOverlayLayerVisible(requestModal, true);
        setRequestModalStatus("");
        updateRequestSizeButtons();
        setTimeout(() => taskInput?.focus?.(), 0);
      }

      function closeRequestModal() {
        if (!requestModal) return;
        requestModal.style.display = "none";
        setOverlayLayerVisible(requestModal, false);
      }

      function openPortraitModal() {
        portraitModal.style.display = "grid";
        setOverlayLayerVisible(portraitModal, true);
      }

      function closePortraitModal() {
        portraitModal.style.display = "none";
        setOverlayLayerVisible(portraitModal, false);
      }

      function updateFromResponse(response) {
        const data = response?.structuredContent ?? response;

        if (data?.quest !== undefined) {
          currentQuest = data.quest;
          if (currentQuest?.status === "completed") {
            lastCompletedQuest = currentQuest;
          }
        }

        if (Array.isArray(data?.log)) {
          log = data.log;
        }

        if (data?.player) {
          player = data.player;
        }

        if (Array.isArray(data?.pendingNpcChoices)) {
          pendingNpcChoices = data.pendingNpcChoices;
        }

        if (Array.isArray(data?.knownNpcs)) {
          knownNpcs = data.knownNpcs;
        }

        if (Array.isArray(data?.storyChapters)) {
          storyChapters = data.storyChapters;
        }

        if (data?.appSettings) {
          appSettings = data.appSettings;
        }

        if (data?.character) {
          character = data.character;
        }

        if (Array.isArray(data?.pinnedRequests)) {
          pinnedRequests = mergePinnedRequests(pinnedRequests, data.pinnedRequests);
          savePinnedRequests();
        }

        render();
        syncTimerWithQuest();
      }

      // Web API integration
      const API_BASE = window.location.origin;

      async function callTool(name, payload) {
        const endpointMap = {
          get_progress: { method: "GET", path: "/api/progress" },
          pin_focus_quest: { method: "POST", path: "/api/pin-quest" },
          plan_focus_request: { method: "POST", path: "/api/plan-request" },
          embark_focus_quest: { method: "POST", path: "/api/embark-quest" },
          start_focus_quest: { method: "POST", path: "/api/start-quest" },
          complete_focus_quest: { method: "POST", path: "/api/complete-quest" },
          cancel_focus_quest: { method: "POST", path: "/api/cancel-quest" },
          update_character: { method: "POST", path: "/api/update-character" },
          generate_portrait: { method: "POST", path: "/api/generate-portrait" },
          update_settings: { method: "POST", path: "/api/update-settings" },
          choose_npc: { method: "POST", path: "/api/choose-npc" },
        };

        const config = endpointMap[name];
        if (!config) {
          throw new Error(`Unknown tool: ${name}`);
        }

        const url = `${API_BASE}${config.path}`;
        const options = {
          method: config.method,
          headers: {
            "Content-Type": "application/json",
          },
        };

        if (config.method === "POST" && payload) {
          options.body = JSON.stringify(payload);
        }

        const response = await fetch(url, options);
        const responseText = await response.text();
        let data = {};

        try {
          data = responseText ? JSON.parse(responseText) : {};
        } catch {
          data = {
            error: responseText || "API request failed",
          };
        }

        if (!response.ok) {
          throw new Error(data.error || data.message || "API request failed");
        }

        updateFromResponse(data);
        return data;
      }

      function reportToolError(error) {
        const message = error?.message || "Unknown error.";
        console.error("Tool call failed:", message, error);
        alert(`That action could not be completed. Please try again.\n${message}`);
      }

      function getToolText(response) {
        return response?.content
          ?.filter((item) => item.type === "text")
          .map((item) => item.text)
          .join("\n")
          .trim();
      }

      function buildCharacterPayload(name, description) {
        const payload = {
          name,
          description,
          race: characterRaceSelect.value,
          hairColor: hairColorSelect.value,
          skinColor: skinColorSelect.value,
          outfitName: outfitNameInput.value.trim(),
        };

        if (uploadedPortraitImageData !== null) {
          payload.portraitImageUrl = uploadedPortraitImageData;
        } else {
          payload.portraitImageUrl = character.portraitImageUrl || "";
        }

        const crop = getPortraitCrop();
        payload.portraitCropX = crop.x;
        payload.portraitCropY = crop.y;
        payload.portraitZoom = crop.zoom;

        return payload;
      }

      async function saveCharacterFromForm(button, savingText) {
        const name = characterNameInput.value.trim();
        const description = characterDescriptionInput.value.trim();

        if (!name || !description) {
          alert("Enter both a character name and description.");
          return false;
        }

        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = savingText;

        try {
          await callTool(
            "update_character",
            buildCharacterPayload(name, description)
          );
          portraitPromptStatus.textContent = "Saved from the current character choices.";
          uploadedPortraitImageData = null;
          portraitCropDraft = null;
          if (portraitImageUploadInput) portraitImageUploadInput.value = "";
          if (portraitUploadStatus) {
            portraitUploadStatus.textContent = character.portraitImageUrl
              ? "Current portrait saved."
              : "No portrait uploaded yet.";
          }
          return true;
        } catch (error) {
          reportToolError(error);
          return false;
        } finally {
          button.disabled = false;
          button.textContent = originalText;
        }
      }

      confirmMinutesPromptButton?.addEventListener("click", (event) => {
        event.preventDefault();
        const rawValue = minutesPromptInput?.value?.trim?.() ?? "";
        const parsedValue = rawValue === "" ? null : Number(rawValue);
        resolveMinutesPrompt(Number.isFinite(parsedValue) ? parsedValue : null);
      });

      cancelMinutesPromptButton?.addEventListener("click", (event) => {
        event.preventDefault();
        resolveMinutesPrompt(null);
      });

      closeMinutesPromptButton?.addEventListener("click", (event) => {
        event.preventDefault();
        resolveMinutesPrompt(null);
      });

      minutesPromptInput?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          confirmMinutesPromptButton?.click();
        }
      });

      generatePromptButton.addEventListener("click", async (event) => {
        event.preventDefault();
        await saveCharacterFromForm(generatePromptButton, "Generating...");
      });

      copyPortraitPromptButton.addEventListener("click", async (event) => {
        event.preventDefault();
        const promptText = portraitPrompt.textContent.trim();

        if (!promptText) {
          alert("Generate and save a portrait prompt first.");
          return;
        }

        try {
          await navigator.clipboard.writeText(promptText);
          copyPortraitPromptButton.textContent = "Copied!";

          setTimeout(() => {
            copyPortraitPromptButton.textContent = "Copy Saved Prompt";
          }, 1200);
        } catch (error) {
          console.error("Could not copy prompt:", error);
          alert("Copy failed. You can manually select and copy the prompt text.");
        }
      });

      heroEditButton?.addEventListener("click", () => {
        openSettingsModal();
      });

      closeSettingsButton.addEventListener("click", (event) => {
        event.preventDefault();
        closeSettingsModal();
      });

      openRequestModalButton?.addEventListener("click", () => {
        openRequestModal();
      });

      closeRequestButton?.addEventListener("click", (event) => {
        event.preventDefault();
        closeRequestModal();
      });

      questboardPortraitShell?.addEventListener("click", () => {
        openPortraitModal();
      });

      heroPortraitShell.addEventListener("click", () => {
        openPortraitModal();
      });

      closePortraitButton.addEventListener("click", (event) => {
        event.preventDefault();
        closePortraitModal();
      });

      saveImageButton.addEventListener("click", (event) => {
        event.preventDefault();
        if (!character.portraitImageUrl) {
          alert("There is no image to save.");
          return;
        }

        const link = document.createElement("a");
        link.href = character.portraitImageUrl;
        link.download = character.portraitImageUrl.startsWith("data:image/png")
          ? "eris-touched-portrait.png"
          : "eris-touched-portrait.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });

      generateImageButton.addEventListener("click", async (event) => {
        event.preventDefault();
        const saved = await saveCharacterFromForm(
          generateImageButton,
          "Preparing Prompt..."
        );

        if (!saved) {
          return;
        }

        const promptText = portraitPrompt.textContent.trim();

        if (!promptText) {
          alert("There is no portrait prompt available.");
          return;
        }

        try {
          await navigator.clipboard.writeText(promptText);
          generateImageButton.textContent = "Prompt Copied!";
          portraitGenerationStatus.textContent =
            "Image prompt copied. Generate it manually for now, then upload the finished portrait from this portrait view. Gemini AI Studio support is planned for a later patch.";

          setTimeout(() => {
            generateImageButton.textContent = "Copy Image Prompt";
          }, 1400);
        } catch (error) {
          console.error("Could not copy prompt:", error);
          portraitGenerationStatus.textContent =
            "Copy failed. Open settings, use Copy Saved Prompt, then generate the portrait manually.";
          alert("Copy failed. You can manually select and copy the saved prompt text.");
        }
      });

      saveCharacterButton.addEventListener("click", async (event) => {
        event.preventDefault();
        const name = characterNameInput.value.trim();
        const description = characterDescriptionInput.value.trim();

        if (!name || !description) {
          alert("Enter both a character name and description.");
          return;
        }

        saveCharacterButton.disabled = true;
        saveCharacterButton.textContent = "Saving...";

        try {
          await callTool(
            "update_character",
            buildCharacterPayload(name, description)
          );
          uploadedPortraitImageData = null;
          portraitCropDraft = null;
          if (portraitImageUploadInput) portraitImageUploadInput.value = "";
          if (portraitUploadStatus) {
            portraitUploadStatus.textContent = character.portraitImageUrl
              ? "Current portrait saved."
              : "No portrait uploaded yet.";
          }
        } catch (error) {
          reportToolError(error);
        } finally {
          saveCharacterButton.disabled = false;
          saveCharacterButton.textContent = "Save Character";
        }
      });

      portraitImageUploadInput?.addEventListener("change", async () => {
        const file = portraitImageUploadInput.files?.[0];

        if (!file) {
          uploadedPortraitImageData = null;
          portraitCropDraft = null;
          renderCharacter();
          return;
        }

        portraitImageUploadInput.disabled = true;
        if (clearPortraitImageButton) clearPortraitImageButton.disabled = true;
        if (savePortraitUploadButton) savePortraitUploadButton.disabled = true;
        if (portraitUploadStatus) portraitUploadStatus.textContent = "Preparing portrait...";

        try {
          uploadedPortraitImageData = await createPortraitDataUrl(file);
          setPortraitCropDraft(50, 50, 1);
          setPortraitImageSource(uploadedPortraitImageData);
          if (portraitUploadStatus) {
            portraitUploadStatus.textContent = "Portrait selected. Move it in the circle, then Save Portrait.";
          }
        } catch (error) {
          console.error("Could not prepare portrait image:", error);
          uploadedPortraitImageData = null;
          portraitCropDraft = null;
          portraitImageUploadInput.value = "";
          renderCharacter();
          alert("That image could not be prepared. Please choose a PNG, JPEG, or WebP file.");
        } finally {
          portraitImageUploadInput.disabled = false;
          if (clearPortraitImageButton) clearPortraitImageButton.disabled = false;
          if (savePortraitUploadButton) savePortraitUploadButton.disabled = false;
        }
      });

      portraitZoomOutButton?.addEventListener("click", (event) => {
        event.preventDefault();
        adjustPortraitZoom(-0.1);
      });

      portraitZoomInButton?.addEventListener("click", (event) => {
        event.preventDefault();
        adjustPortraitZoom(0.1);
      });

      portraitModalImageShell?.addEventListener("pointerdown", (event) => {
        if (!hasPortraitImageForCropping()) return;
        const crop = getPortraitCrop();
        portraitDragState = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          cropX: crop.x,
          cropY: crop.y,
          zoom: crop.zoom,
        };
        portraitModalImageShell.setPointerCapture?.(event.pointerId);
        portraitModalImageShell.classList.add("is-dragging");
        event.preventDefault();
      });

      portraitModalImageShell?.addEventListener("pointermove", (event) => {
        if (!portraitDragState || portraitDragState.pointerId !== event.pointerId) return;
        const rect = portraitModalImageShell.getBoundingClientRect();
        const sensitivity = 100 / Math.max(1, rect.width * portraitDragState.zoom);
        const nextX = portraitDragState.cropX - ((event.clientX - portraitDragState.startX) * sensitivity);
        const nextY = portraitDragState.cropY - ((event.clientY - portraitDragState.startY) * sensitivity);
        setPortraitCropDraft(nextX, nextY, portraitDragState.zoom);
        if (portraitUploadStatus) portraitUploadStatus.textContent = "Portrait moved. Save Portrait to keep it.";
        event.preventDefault();
      });

      function finishPortraitDrag(event) {
        if (!portraitDragState || portraitDragState.pointerId !== event.pointerId) return;
        portraitModalImageShell?.releasePointerCapture?.(event.pointerId);
        portraitModalImageShell?.classList.remove("is-dragging");
        portraitDragState = null;
      }

      portraitModalImageShell?.addEventListener("pointerup", finishPortraitDrag);
      portraitModalImageShell?.addEventListener("pointercancel", finishPortraitDrag);

      savePortraitUploadButton?.addEventListener("click", async (event) => {
        event.preventDefault();
        savePortraitUploadButton.disabled = true;
        savePortraitUploadButton.textContent = "Saving...";
        if (portraitUploadStatus) portraitUploadStatus.textContent = "Saving portrait...";

        try {
          await callTool(
            "update_character",
            buildCharacterPayload(character.name, character.description)
          );
          uploadedPortraitImageData = null;
          portraitCropDraft = null;
          if (portraitImageUploadInput) portraitImageUploadInput.value = "";
          if (portraitUploadStatus) portraitUploadStatus.textContent = "Portrait saved.";
          document.querySelector(".portrait-upload-menu")?.removeAttribute("open");
        } catch (error) {
          reportToolError(error);
        } finally {
          savePortraitUploadButton.disabled = false;
          savePortraitUploadButton.textContent = "Save Portrait";
        }
      });

      clearPortraitImageButton?.addEventListener("click", (event) => {
        event.preventDefault();
        uploadedPortraitImageData = "";
        portraitCropDraft = { portraitCropX: 50, portraitCropY: 50, portraitZoom: 1 };
        if (portraitImageUploadInput) portraitImageUploadInput.value = "";
        setPortraitImageSource("");
        const initials = (character.name || "Eris-Touched Hero")
          .split(" ")
          .map((part) => part[0]?.toUpperCase())
          .slice(0, 2)
          .join("");
        if (questboardPortraitInitials) {
          questboardPortraitInitials.textContent = initials || "ET";
        }
        heroPortraitInitials.textContent = initials || "ET";
        portraitModalInitials.textContent = initials || "ET";
        if (portraitUploadStatus) portraitUploadStatus.textContent = "Portrait will be removed when saved.";
      });

      saveSettingsButton.addEventListener("click", async (event) => {
        event.preventDefault();
        saveSettingsButton.disabled = true;
        saveSettingsButton.textContent = "Saving...";

        try {
          await callTool("update_settings", {
            storyTone: storyToneSelect.value,
            overarchingGoal: overarchingGoalInput.value.trim(),
          });
        } catch (error) {
          reportToolError(error);
        } finally {
          saveSettingsButton.disabled = false;
          saveSettingsButton.textContent = "Save Guild Charter";
        }
      });

      async function completeCurrentQuest(button = completeButton) {
        const totals = getQuestProgressTotals();
        const fallbackMinutes = Math.max(1, Math.round(getFocusedSeconds() / 60));
        const actualMinutes = Math.max(1, Math.round(totals.completedMinutes || fallbackMinutes));
        const originalText = button?.textContent || "Turn In Request";

        if (button) {
          button.disabled = true;
          button.classList.add("is-loading");
          button.textContent = "Writing Story...";
        }
        questStatus.textContent = "Turning in the request and writing the story...";

        try {
          await callTool("complete_focus_quest", {
            actualMinutes,
            questTitle: getQuestFantasyTitle(),
            task: getQuestDisplayTask(),
          });
          removePinnedRequestFromBoard(
            activePinnedRequestId,
            currentQuest?.task,
            currentQuest?.plannedMinutes
          );
          setActivePinnedRequestId("");
          clearActiveQuestProgress();
        } catch (error) {
          reportToolError(error);
          if (button) button.disabled = false;
        } finally {
          if (button) {
            button.classList.remove("is-loading");
            button.textContent = originalText;
          }
          renderPinnedRequests();
          renderActiveQuest();
        }
      }
      editActiveRequestButton?.addEventListener("click", (event) => {
        event.preventDefault();
        event.currentTarget.closest("details")?.removeAttribute("open");
        editActiveRequestTitle();
      });

      editActiveTaskButton?.addEventListener("click", (event) => {
        event.preventDefault();
        event.currentTarget.closest("details")?.removeAttribute("open");
        editActiveTaskTitle();
      });

      cancelActiveRequestButton?.addEventListener("click", (event) => {
        event.preventDefault();
        event.currentTarget.closest("details")?.removeAttribute("open");
        cancelActiveRequest();
      });

      startButton?.addEventListener("click", (event) => {
        pinRequestFromModal(event);
      });

      embarkNowButton?.addEventListener("click", (event) => {
        embarkRequestFromModal(event);
      });

      pauseButton.addEventListener("click", (event) => {
        event.preventDefault();

        if (timerRunning) {
          pauseLocalTimer();
        } else {
          resumeLocalTimer();
        }
      });

      holdTimerButton?.addEventListener("click", (event) => {
        event.preventDefault();
        holdLocalTimer();
      });

      cancelTimerButton?.addEventListener("click", (event) => {
        event.preventDefault();
        cancelLocalTimer();
      });

      completeButton.addEventListener("click", async (event) => {
        event.preventDefault();
        const activeSubtask = getActiveSubtask();
        if (questStarted && activeSubtask) {
          void toggleQuestSubtaskCheckmark(activeSubtask.id, { useTimerMinutes: true });
          return;
        }
        completeCurrentQuest(completeButton);
      });

      updateTimerDisplay();
      render();

      // Load initial progress
      callTool("get_progress", {}).catch((error) => {
        console.error("Could not load progress:", error);
      });
