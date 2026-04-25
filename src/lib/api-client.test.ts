import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from './api-client';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
        removeItem: (key: string) => { delete store[key]; }
    };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Mock @tauri-apps/api/core
vi.mock('@tauri-apps/api/core', () => ({
    invoke: vi.fn(),
    isTauri: vi.fn(() => false)
}));

describe('APIClient Ollama Cloud Logic', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('fetchModels should use cloud URL and headers when in cloud mode', async () => {
        localStorage.setItem('ollama_mode', 'cloud');
        localStorage.setItem('ollama_api_key', 'test-key');

        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => ({ models: [] })
        } as any);

        await apiClient.fetchModels();

        expect(fetchSpy).toHaveBeenCalledWith(
            'https://ollama.com/api/tags',
            expect.objectContaining({
                headers: {
                    'Authorization': 'Bearer test-key'
                }
            })
        );
    });

    it('fetchModels should use local URL when in local mode', async () => {
        localStorage.setItem('ollama_mode', 'local');
        localStorage.setItem('ollama_host', 'http://127.0.0.1:11434');

        const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
            ok: true,
            json: async () => ({ models: [] })
        } as any);

        await apiClient.fetchModels();

        expect(fetchSpy).toHaveBeenCalledWith(
            'http://127.0.0.1:11434/api/tags',
            expect.not.objectContaining({
                headers: expect.objectContaining({
                    'Authorization': expect.any(String)
                })
            })
        );
    });
});
