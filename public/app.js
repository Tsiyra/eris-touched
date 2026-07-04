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
      const heroPortraitShell = document.querySelector("#hero-portrait-shell");
      const heroPortraitImage = document.querySelector("#hero-portrait-image");
      const heroPortraitPlaceholder = document.querySelector("#hero-portrait-placeholder");
      const heroPortraitInitials = document.querySelector("#hero-portrait-initials");
      const heroPortraitName = document.querySelector("#hero-portrait-name");
      const heroOutfitName = document.querySelector("#hero-outfit-name");

      const settingsGearButton = document.querySelector("#settings-gear-button");
      const settingsModal = document.querySelector("#settings-modal");
      const closeSettingsButton = document.querySelector("#close-settings-button");
      const portraitModal = document.querySelector("#portrait-modal");
      const closePortraitButton = document.querySelector("#close-portrait-button");
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
      const resumeButton = document.querySelector("#resume-button");
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
      const activeQuestEmpty = document.querySelector("#active-quest-empty");
      const activeQuestDetails = document.querySelector("#active-quest-details");
      const activeQuestTitle = document.querySelector("#active-quest-title");
      const activeQuestMeta = document.querySelector("#active-quest-meta");
      const questboardCharterGoal = document.querySelector("#questboard-charter-goal");
      const questboardCharterProgressLabel = document.querySelector("#questboard-charter-progress-label");
      const questboardCharterProgressFill = document.querySelector("#questboard-charter-progress-fill");
      const plannedMinuteButtons = document.querySelectorAll("[data-planned-minutes]");

      const npcChoicePanel = document.querySelector("#npc-choice-panel");
      const npcChoiceList = document.querySelector("#npc-choice-list");
      const knownNpcList = document.querySelector("#known-npc-list");
      const storyChapterList = document.querySelector("#story-chapter-list");
      const storyToneSelect = document.querySelector("#story-tone");
      const overarchingGoalInput = document.querySelector("#overarching-goal");
      const saveSettingsButton = document.querySelector("#save-settings-button");
      const navButtons = document.querySelectorAll(".nav-button");
      const appScreens = document.querySelectorAll(".app-screen");

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
          showScreen(button.dataset.screen);
        });
      });

      plannedMinuteButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const nextMinutes = Number(button.dataset.plannedMinutes);
          if (!Number.isFinite(nextMinutes)) return;
          plannedMinutes = nextMinutes;
          updatePlannedMinuteButtons();
        });
      });

      showScreen("questboard");

      let currentQuest = null;
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
      let plannedMinutes = 45;
      const PINNED_REQUESTS_STORAGE_KEY = "eris-touched-pinned-requests-v1";

      function createPinnedRequestId() {
        return `pinned-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      }

      function loadPinnedRequests() {
        try {
          const raw = localStorage.getItem(PINNED_REQUESTS_STORAGE_KEY);
          if (!raw) return [];

          const parsed = JSON.parse(raw);
          if (!Array.isArray(parsed)) return [];

          return parsed
            .map((request) => ({
              id: request?.id || createPinnedRequestId(),
              task: String(request?.task || "").trim(),
              plannedMinutes: Math.max(
                1,
                Math.min(600, Math.round(Number(request?.plannedMinutes) || 45))
              ),
            }))
            .filter((request) => request.task);
        } catch (error) {
          console.error("Could not load pinned requests:", error);
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

      const LEVEL_THRESHOLDS = {
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

      function updateTimerDisplay() {
        const focusedSeconds = getFocusedSeconds();
        timerDisplay.textContent = formatTime(focusedSeconds);

        const minutes = Math.floor(focusedSeconds / 60);

        if (!questStarted) {
          timerStatus.textContent = "No request started.";
        } else if (timerRunning) {
          timerStatus.textContent =
            minutes >= 60
              ? "Legendary request in progress."
              : "Request in progress.";
        } else {
          timerStatus.textContent = "Request paused.";
        }
      }

      function startLocalTimer(quest = null) {
        questStarted = true;
        timerRunning = true;
        localTimerQuestId = quest?.id ?? null;

        if (quest?.startedAt) {
          const startedAt = Date.parse(quest.startedAt);
          accumulatedSeconds = Number.isFinite(startedAt)
            ? Math.max(0, Math.floor((Date.now() - startedAt) / 1000))
            : 0;
        } else {
          accumulatedSeconds = 0;
        }

        startTime = Date.now();

        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimerDisplay, 1000);
        updateTimerDisplay();

        pauseButton.disabled = false;
        resumeButton.disabled = true;
        completeButton.disabled = false;
      }

      function syncTimerWithQuest() {
        if (currentQuest?.status === "active") {
          if (localTimerQuestId !== currentQuest.id || !questStarted) {
            startLocalTimer(currentQuest);
          }

          return;
        }

        if (questStarted) {
          resetLocalTimerAfterCompletion();
          localTimerQuestId = null;
        }
      }

      function pauseLocalTimer() {
        if (!timerRunning) return;

        accumulatedSeconds = getFocusedSeconds();
        timerRunning = false;
        startTime = null;

        clearInterval(timerInterval);
        updateTimerDisplay();

        pauseButton.disabled = true;
        resumeButton.disabled = false;
      }

      function resumeLocalTimer() {
        if (timerRunning || !questStarted) return;

        timerRunning = true;
        startTime = Date.now();

        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimerDisplay, 1000);
        updateTimerDisplay();

        pauseButton.disabled = false;
        resumeButton.disabled = true;
      }

      function resetLocalTimerAfterCompletion() {
        accumulatedSeconds = getFocusedSeconds();
        timerRunning = false;
        questStarted = false;
        startTime = null;
        localTimerQuestId = null;

        clearInterval(timerInterval);
        updateTimerDisplay();

        pauseButton.disabled = true;
        resumeButton.disabled = true;
        completeButton.disabled = true;
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
        if (!file?.type?.startsWith("image/")) {
          throw new Error("Choose an image file.");
        }

        const source = await readFileAsDataUrl(file);
        const image = await loadImageSource(source);
        const size = 768;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
        const sourceX = Math.floor((image.naturalWidth - sourceSize) / 2);
        const sourceY = Math.floor((image.naturalHeight - sourceSize) / 2);

        canvas.width = size;
        canvas.height = size;
        context.drawImage(
          image,
          sourceX,
          sourceY,
          sourceSize,
          sourceSize,
          0,
          0,
          size,
          size
        );

        return canvas.toDataURL("image/jpeg", 0.9);
      }

      function setPortraitImageSource(imageUrl) {
        if (imageUrl) {
          questboardPortraitImage.src = imageUrl;
          questboardPortraitImage.style.display = "block";
          questboardPortraitPlaceholder.style.display = "none";
          heroPortraitImage.src = imageUrl;
          heroPortraitImage.style.display = "block";
          heroPortraitPlaceholder.style.display = "none";
          portraitModalImage.src = imageUrl;
          portraitModalImage.style.display = "block";
          portraitModalPlaceholder.style.display = "none";
          return;
        }

        questboardPortraitImage.removeAttribute("src");
        questboardPortraitImage.style.display = "none";
        questboardPortraitPlaceholder.style.display = "grid";
        heroPortraitImage.removeAttribute("src");
        heroPortraitImage.style.display = "none";
        heroPortraitPlaceholder.style.display = "grid";
        portraitModalImage.removeAttribute("src");
        portraitModalImage.style.display = "none";
        portraitModalPlaceholder.style.display = "grid";
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
        questboardOutfitName.textContent = character.outfitName || "Hero Starter Outfit";
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
          questboardPortraitInitials.textContent = initials || "ET";
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
        if (uploadedPortraitImageData === null) {
          portraitUploadStatus.textContent = character.portraitImageUrl
            ? "Current portrait saved."
            : "No portrait uploaded yet.";
        }
        if (document.activeElement !== outfitNameInput) {
          outfitNameInput.value = character.outfitName ?? "Hero Starter Outfit";
        }
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
            `${item.rarity} · +${goldBonus}% future Guild Coin bonus`;

          div.appendChild(name);
          div.appendChild(details);
          inventoryList.appendChild(div);
        }
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
          description.className = "npc-details";
          description.textContent = npc.description;

          const hook = document.createElement("div");
          hook.className = "npc-details";
          hook.textContent = npc.storyHook;

          const chooseButton = document.createElement("button");
          chooseButton.className = "primary";
          chooseButton.textContent = `Choose ${npc.role}`;

          chooseButton.addEventListener("click", async () => {
            const allButtons = npcChoiceList.querySelectorAll("button");
            allButtons.forEach((button) => {
              button.disabled = true;
            });

            try {
              await callTool("choose_npc", {
                npcId: npc.id,
              });
            } catch (error) {
              reportToolError(error);
              allButtons.forEach((button) => {
                button.disabled = false;
              });
            }
          });

          card.appendChild(name);
          card.appendChild(role);
          card.appendChild(description);
          card.appendChild(hook);
          card.appendChild(chooseButton);

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
          const div = document.createElement("div");
          div.className = "known-npc";

          const name = document.createElement("div");
          name.className = "npc-name";
          name.textContent = npc.name;

          const role = document.createElement("div");
          role.className = "npc-role";
          role.textContent = npc.role;

          const details = document.createElement("div");
          details.className = "npc-details";
          details.textContent = npc.description;

          div.appendChild(name);
          div.appendChild(role);
          div.appendChild(details);

          knownNpcList.appendChild(div);
        }
      }

      function renderStoryChapters() {
        storyChapterList.innerHTML = "";

        if (!storyChapters.length) {
          storyChapterList.className = "empty";
          storyChapterList.textContent = "No guild chronicle entries yet.";
          return;
        }

        storyChapterList.className = "";

        for (const chapter of storyChapters) {
          const card = document.createElement("div");
          card.className = "story-chapter";

          const title = document.createElement("div");
          title.className = "story-chapter-title";
          title.textContent = chapter.title;

          const meta = document.createElement("div");
          meta.className = "story-chapter-meta";
          const coinsText = chapter.coins
            ? ` · ${chapter.coins} Guild Coins`
            : "";
          meta.textContent =
            `${chapter.minutes} min · ${chapter.rarity} · ${chapter.loot}${coinsText} · ${chapter.xp} XP`;

          const body = document.createElement("div");
          body.className = "story-chapter-body";
          body.textContent = chapter.body;

          card.appendChild(title);
          card.appendChild(meta);
          card.appendChild(body);

          storyChapterList.appendChild(card);
        }
      }

      function renderQuest() {
        if (!currentQuest) {
          questStatus.textContent = "No request completed yet.";
          questLoot.textContent = "";
          return;
        }

        questStatus.textContent =
          `${currentQuest.status.toUpperCase()}: ${currentQuest.task}`;

        if (currentQuest.loot) {
          const legendaryClass =
            currentQuest.rarity === "Legendary" ? "legendary" : "";

          questLoot.textContent = "";

          const rarity = document.createElement("span");
          rarity.className = legendaryClass;
          rarity.textContent = `${currentQuest.rarity} loot:`;

          questLoot.appendChild(rarity);
          const coinsText = currentQuest.coins
            ? ` · ${currentQuest.coins} Guild Coins`
            : "";

          questLoot.append(
            ` ${currentQuest.loot}${coinsText} · ${currentQuest.xp} XP`
          );
        } else {
          questLoot.textContent = "";
        }
      }

      function getDraftTask() {
        return taskInput.value.trim() || "Write the Guild Brief";
      }

      function getEstimatedXp(minutes) {
        return Math.max(5, Math.round(minutes * 8));
      }

      function getEstimatedCoins(minutes) {
        return Math.round(minutes * 10);
      }

      function updatePlannedMinuteButtons() {
        plannedMinuteButtons.forEach((button) => {
          const buttonMinutes = Number(button.dataset.plannedMinutes);
          button.classList.toggle("active", buttonMinutes === plannedMinutes);
        });
      }

      function setPlannedMinuteButtonsDisabled(isDisabled) {
        plannedMinuteButtons.forEach((button) => {
          button.disabled = isDisabled;
        });
      }

      function createPinnedRequestCard(request) {
        const card = document.createElement("div");
        card.className = "pinned-request-card";

        const title = document.createElement("div");
        title.className = "pinned-request-title";
        title.textContent = request.task;

        const description = document.createElement("div");
        description.className = "pinned-request-description";
        description.textContent = "Ready on the board. Embark when this request is the one you want to focus on.";

        const meta = document.createElement("div");
        meta.className = "pinned-request-meta";

        const minutes = request.plannedMinutes ?? 25;
        const rewards = [
          ["⏱", `${minutes} min`],
          ["XP", `${getEstimatedXp(minutes)} XP`],
          ["◎", `${getEstimatedCoins(minutes)} Coins`],
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

        const embarkButton = document.createElement("button");
        embarkButton.type = "button";
        embarkButton.className = "primary loading-button pinned-embark-button";
        embarkButton.textContent = "Embark";
        embarkButton.disabled = currentQuest?.status === "active";
        embarkButton.addEventListener("click", async (event) => {
          event.preventDefault();
          embarkButton.disabled = true;
          embarkButton.classList.add("is-loading");
          embarkButton.textContent = "Embarking...";
          timerStatus.textContent = "Writing the quest opening...";

          try {
            setRequestModalStatus("");
            await callTool("start_focus_quest", {
              task: request.task,
              plannedMinutes: request.plannedMinutes ?? 45,
            });
          } catch (error) {
            console.error("Pinned request embark failed:", error?.message || error, error);
            reportToolError(error);
            embarkButton.disabled = false;
          } finally {
            embarkButton.classList.remove("is-loading");
            embarkButton.textContent = "Embark";
          }
        });

        actions.appendChild(embarkButton);
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(meta);
        card.appendChild(actions);

        return card;
      }

      function renderPinnedRequests() {
        if (!pinnedRequestList) return;

        pinnedRequestList.innerHTML = "";

        if (pinnedRequestCount) {
          pinnedRequestCount.textContent = String(pinnedRequests.length);
        }

        if (!pinnedRequests.length) {
          pinnedRequestList.className = "pinned-request-list empty";
          pinnedRequestList.textContent = "No pinned requests yet. Use Guild Request to create one.";
          return;
        }

        pinnedRequestList.className = "pinned-request-list";

        for (const request of pinnedRequests) {
          pinnedRequestList.appendChild(createPinnedRequestCard(request));
        }
      }

      function renderActiveQuest() {
        const isActive = currentQuest?.status === "active";

        if (activeQuestEmpty) {
          activeQuestEmpty.style.display = isActive ? "none" : "block";
        }

        if (activeQuestDetails) {
          activeQuestDetails.style.display = isActive ? "block" : "none";
        }

        if (!isActive) {
          return;
        }

        const planned = currentQuest.plannedMinutes ?? plannedMinutes;

        if (activeQuestTitle) {
          activeQuestTitle.textContent = currentQuest.task;
        }

        if (activeQuestMeta) {
          activeQuestMeta.textContent = `${planned} min estimate · ${getEstimatedXp(planned)} XP · ${getEstimatedCoins(planned)} Guild Coins`;
        }
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
        updatePlannedMinuteButtons();
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
        setPlannedMinuteButtonsDisabled(isDisabled);
      }

      async function pinRequestFromModal(event) {
        event?.preventDefault?.();
        const task = getRequestModalTask();

        if (!task) {
          setRequestModalStatus("Enter a guild request first.", "warning");
          alert("Enter a guild request first.");
          return;
        }

        setRequestModalButtonsDisabled(true);
        startButton.classList.add("is-loading");
        startButton.textContent = "Pinning...";
        setRequestModalStatus("Pinning request to the board...", "working");

        try {
          pinnedRequests = [
            {
              id: createPinnedRequestId(),
              task,
              plannedMinutes,
            },
            ...pinnedRequests,
          ];
          savePinnedRequests();
          renderPinnedRequests();
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

      async function embarkRequestFromModal(event) {
        event?.preventDefault?.();
        const task = getRequestModalTask();

        if (!task) {
          setRequestModalStatus("Enter a guild request first.", "warning");
          alert("Enter a guild request first.");
          return;
        }

        setRequestModalButtonsDisabled(true);
        embarkNowButton.classList.add("is-loading");
        embarkNowButton.textContent = "Embarking...";
        timerStatus.textContent = "Writing the quest opening...";
        setRequestModalStatus("Starting the expedition...", "working");

        try {
          await callTool("start_focus_quest", {
            task,
            plannedMinutes,
          });
          setRequestModalStatus("Expedition started.", "success");
          closeRequestModal();
        } catch (error) {
          console.error("Embark request failed:", error?.message || error, error);
          setRequestModalStatus(error.message || "Embark failed.", "error");
          reportToolError(error);
        } finally {
          embarkNowButton.classList.remove("is-loading");
          embarkNowButton.textContent = "Embark";
          setRequestModalButtonsDisabled(false);
          if (!questStarted) {
            updateTimerDisplay();
          }
        }
      }

      function openSettingsModal() {
        settingsModal.style.display = "grid";
      }

      function closeSettingsModal() {
        settingsModal.style.display = "none";
      }

      function openRequestModal() {
        if (!requestModal) return;
        requestModal.style.display = "grid";
        setRequestModalStatus("");
        updatePlannedMinuteButtons();
        setTimeout(() => taskInput?.focus?.(), 0);
      }

      function closeRequestModal() {
        if (!requestModal) return;
        requestModal.style.display = "none";
      }

      function openPortraitModal() {
        portraitModal.style.display = "grid";
      }

      function closePortraitModal() {
        portraitModal.style.display = "none";
      }

      function updateFromResponse(response) {
        const data = response?.structuredContent ?? response;

        if (data?.quest !== undefined) {
          currentQuest = data.quest;
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

        render();
        syncTimerWithQuest();
      }

      // Web API integration
      const API_BASE = window.location.origin;

      async function callTool(name, payload) {
        const endpointMap = {
          get_progress: { method: "GET", path: "/api/progress" },
          pin_focus_quest: { method: "POST", path: "/api/pin-quest" },
          embark_focus_quest: { method: "POST", path: "/api/embark-quest" },
          start_focus_quest: { method: "POST", path: "/api/start-quest" },
          complete_focus_quest: { method: "POST", path: "/api/complete-quest" },
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
          portraitImageUploadInput.value = "";
          portraitUploadStatus.textContent = character.portraitImageUrl
            ? "Current portrait saved."
            : "No portrait uploaded yet.";
          return true;
        } catch (error) {
          reportToolError(error);
          return false;
        } finally {
          button.disabled = false;
          button.textContent = originalText;
        }
      }

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

      settingsGearButton.addEventListener("click", () => {
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

      questboardPortraitShell.addEventListener("click", () => {
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
            "Image prompt copied. Generate it manually for now, then upload the finished portrait here. Gemini AI Studio support is planned for a later patch.";

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
          portraitImageUploadInput.value = "";
          portraitUploadStatus.textContent = character.portraitImageUrl
            ? "Current portrait saved."
            : "No portrait uploaded yet.";
        } catch (error) {
          reportToolError(error);
        } finally {
          saveCharacterButton.disabled = false;
          saveCharacterButton.textContent = "Save Character";
        }
      });

      portraitImageUploadInput.addEventListener("change", async () => {
        const file = portraitImageUploadInput.files?.[0];

        if (!file) {
          uploadedPortraitImageData = null;
          renderCharacter();
          return;
        }

        portraitImageUploadInput.disabled = true;
        clearPortraitImageButton.disabled = true;
        portraitUploadStatus.textContent = "Preparing portrait...";

        try {
          uploadedPortraitImageData = await createPortraitDataUrl(file);
          setPortraitImageSource(uploadedPortraitImageData);
          portraitUploadStatus.textContent =
            "Portrait selected. Save Character to keep it.";
        } catch (error) {
          console.error("Could not prepare portrait image:", error);
          uploadedPortraitImageData = null;
          portraitImageUploadInput.value = "";
          renderCharacter();
          alert("That image could not be prepared. Please choose a PNG, JPEG, or WebP file.");
        } finally {
          portraitImageUploadInput.disabled = false;
          clearPortraitImageButton.disabled = false;
        }
      });

      clearPortraitImageButton.addEventListener("click", (event) => {
        event.preventDefault();
        uploadedPortraitImageData = "";
        portraitImageUploadInput.value = "";
        setPortraitImageSource("");
        const initials = (character.name || "Eris-Touched Hero")
          .split(" ")
          .map((part) => part[0]?.toUpperCase())
          .slice(0, 2)
          .join("");
        questboardPortraitInitials.textContent = initials || "ET";
        heroPortraitInitials.textContent = initials || "ET";
        portraitModalInitials.textContent = initials || "ET";
        portraitUploadStatus.textContent = "Portrait will be removed when saved.";
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

      startButton?.addEventListener("click", (event) => {
        pinRequestFromModal(event);
      });

      embarkNowButton?.addEventListener("click", (event) => {
        embarkRequestFromModal(event);
      });

      pauseButton.addEventListener("click", () => {
        pauseLocalTimer();
      });

      resumeButton.addEventListener("click", () => {
        resumeLocalTimer();
      });

      completeButton.addEventListener("click", async () => {
        const focusedSeconds = getFocusedSeconds();
        const actualMinutes = Math.max(1, Math.round(focusedSeconds / 60));

        completeButton.disabled = true;
        completeButton.classList.add("is-loading");
        completeButton.textContent = "Writing Story...";
        questStatus.textContent = "Turning in the request and writing the story...";

        try {
          await callTool("complete_focus_quest", {
            actualMinutes,
          });
        } catch (error) {
          reportToolError(error);
          completeButton.disabled = false;
        } finally {
          completeButton.classList.remove("is-loading");
          completeButton.textContent = "Turn In Request";
        }
      });

      updateTimerDisplay();
      render();

      // Load initial progress
      callTool("get_progress", {}).catch((error) => {
        console.error("Could not load progress:", error);
      });
