export function createApiClient({ apiBase = window.location.origin, updateFromResponse, onError } = {}) {
  const endpointMap = {
    get_progress: { method: "GET", path: "/api/progress" },
    start_focus_quest: { method: "POST", path: "/api/start-quest" },
    complete_focus_quest: { method: "POST", path: "/api/complete-quest" },
    update_character: { method: "POST", path: "/api/update-character" },
    generate_portrait: { method: "POST", path: "/api/generate-portrait" },
    update_settings: { method: "POST", path: "/api/update-settings" },
    choose_npc: { method: "POST", path: "/api/choose-npc" },
  };

  async function callTool(name, payload) {
    const config = endpointMap[name];
    if (!config) throw new Error(`Unknown tool: ${name}`);

    const options = {
      method: config.method,
      headers: { "Content-Type": "application/json" },
    };

    if (config.method === "POST" && payload !== undefined) {
      options.body = JSON.stringify(payload);
    }

    const response = await fetch(`${apiBase}${config.path}`, options);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || data.message || `API request failed: ${response.status}`);
    }

    updateFromResponse?.(data);
    return data;
  }

  function reportToolError(error) {
    console.error("Tool call failed:", error);
    onError?.(error);
  }

  function getToolText(response) {
    return response?.content
      ?.filter((item) => item.type === "text")
      .map((item) => item.text)
      .join("\n")
      .trim();
  }

  return { callTool, reportToolError, getToolText };
}
