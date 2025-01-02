using System;
using System.Threading.Tasks;
using OpenAI;
using OpenAI.Chat;
using OpenAI.Models;

public class AIClient
{
    private static OpenAIClient client;
    private const int MaxRetryAttempts = 3;
    private const int DelayMilliseconds = 2000;

    public AIClient(string apiKey)
    {
        OpenAIClientSettings _settings = new OpenAIClientSettings("api.fireworks.ai/inference");
        client = new OpenAIClient(apiKey, _settings);
    }

    public async Task<string> QueryAsync(string systemPrompt, string userPrompt)
    {
        List<Message> messages = new List<Message>
        {
            new Message(Role.System, systemPrompt),
            new Message(Role.User, userPrompt)
        };

        string ai_model = "accounts/fireworks/models/llama-v3p3-70b-instruct";
        //string ai_model = "accounts/fireworks/models/llama-v3p2-11b-vision-instruct";

        ChatRequest request = new ChatRequest(messages, ai_model, maxTokens: 256, temperature: 0);

        for (int attempt = 1; attempt <= MaxRetryAttempts; attempt++)
        {
            try
            {
                var response = await client.ChatEndpoint.GetCompletionAsync(request);
                return response.ToString();
            }
            catch (Exception ex)
            {
                if (attempt == MaxRetryAttempts)
                {
                    throw; // Re-throw the exception if the last attempt fails
                }
                Console.WriteLine($"Attempt {attempt} failed: {ex.Message}. Retrying in {DelayMilliseconds / 1000} seconds...");
                await Task.Delay(DelayMilliseconds);
            }
        }

        return null; // This line should never be reached
    }
}
