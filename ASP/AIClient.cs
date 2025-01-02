using System;
using System.Threading.Tasks;
using OpenAI;
using OpenAI.Chat;

public class AIClient
{
    private OpenAIClient _client;

    public AIClient(string apiKey)
    {
        OpenAIClientSettings _settings = new OpenAIClientSettings("api.fireworks.ai/inference");
        _client = new OpenAIClient(apiKey, _settings);
    }

    public async Task<string> QueryAsync(string systemPrompt, string userPrompt)
    {
        List<Message> messages = new List<Message>();
        messages.Add(new Message(Role.System, systemPrompt));
        messages.Add(new Message(Role.User, userPrompt));

        ChatRequest request = new ChatRequest(messages, "accounts/fireworks/models/llama-v3p1-8b-instruct", maxTokens: 128, temperature: 0);
        var response = await _client.ChatEndpoint.GetCompletionAsync(request);
        return response.ToString();
    }
}
