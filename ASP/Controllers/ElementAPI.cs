using ASP.Models;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System.Diagnostics;
using System.Linq;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ASP.Controllers
{
    [ApiController]
    [Route("api")]
    public class ElementAPI : Controller
    {
        private readonly IConfiguration _configuration;
        private AIClient _aiClient;

        private readonly string system_prompt_merge = "you are given 2 things and you need to generate a thing/element it would create if combined, reply only with the combined thing, no context, if it doesn't make sense to merge them just write one of the 2 elements in response";
        private readonly string system_prompt_emoji = "you are given a thing and you need to generate an emoji that represents it, reply only with the emoji, no context";
        public ElementAPI(IConfiguration configuration)
        {
            if (configuration == null)
            {
                throw new ArgumentNullException(nameof(configuration));
            }
            _configuration = configuration;
            _aiClient = new AIClient(configuration["OAI_key"]);
        }

        [HttpGet("automerge")]
        public async Task<IActionResult> AutoMerge([FromQuery] int tier)
        {
            var connectionString = _configuration.GetConnectionString("postgresConnection");

            List<string> all_elements = DatabaseHelper.GetAllElementsByTier(connectionString, tier);

            for (int i = 0; i < all_elements.Count; i++)
            {
                for (int j = i; j < all_elements.Count; j++)
                {
                    Console.WriteLine($"Merging {all_elements[i]} + {all_elements[j]}");
                    await Merge(all_elements[i], all_elements[j]);
                }
            }
            return StatusCode(200);
        }

        [HttpGet("merge")]
        public async Task<IActionResult> Merge([FromQuery] string element1, [FromQuery] string element2)
        {
            if (string.IsNullOrEmpty(element1) || string.IsNullOrEmpty(element2))
            {
                return BadRequest("Both elements must be provided");
            }

            // Sort to make sure the order is consistent regardless of user order
            var names = new[] { element1, element2 };
            var sortedNames = names.OrderBy(n => n).ToArray();

            var connectionString = _configuration.GetConnectionString("postgresConnection");

            // fetch the count of the elements, must be 2 unique or duplicate
            var element_ids = DatabaseHelper.GetElementCount(connectionString, sortedNames[0], sortedNames[1]);
            var count = element_ids.Length;

            // validate response
            if (count == 0)
            {
                return NotFound("Invalid Merge, must be 2 discovered elements");
            }
            if (count == 1)
            {
                if (element1 != element2)
                {
                    return NotFound("Invalid Merge, must be 2 discovered elements, only 1 is discovered");
                }
                else
                {
                    element_ids = new int[] { element_ids[0], element_ids[0] };
                }
            }

            string[]? db_element = DatabaseHelper.CheckMerge(connectionString, element_ids[0], element_ids[1]);

            if (db_element != null)
            {
                Dictionary<string, string> response = new Dictionary<string, string>();
                response["name"] = db_element[0];
                response["emoji"] = db_element[1];
                response["_id"] = db_element[2];

                return Json(response);
            }
            else
            {
                // Query the AI model because the element doesn't exist and needs to be generated
                string ai_response = await _aiClient.QueryAsync(system_prompt_merge, $"'{sortedNames[0]}' + '{sortedNames[1]}'");
                Console.WriteLine($"AI Generated Element: {ai_response}");
                if (ai_response == null)
                {
                    return StatusCode(500, "AI model failed to respond");
                }
                string ai_response_emoji = await _aiClient.QueryAsync(system_prompt_emoji, $"'{ai_response}'");

                int emoji = char.ConvertToUtf32(ai_response_emoji.ToString(), 0);
                if (!(emoji >= 0x2000 && emoji <= 0x10FFFF))
                {
                    return StatusCode(500, "AI model failed to generate a valid emoji");
                }

                // Check if the element already exists in the database, if not, add it
                var amount_found = DatabaseHelper.GetElementCount(connectionString, ai_response).Length;
                if (amount_found == 0)
                {
                    //fetch tier of elements and increment by 1
                    int tier_element_1 = DatabaseHelper.GetElementTierById(connectionString, element_ids[0]);
                    int tier_element_2 = DatabaseHelper.GetElementTierById(connectionString, element_ids[1]);

                    int new_tier = Math.Max(tier_element_1, tier_element_2) + 1;

                    DatabaseHelper.CreateNewElement(connectionString, ai_response, ai_response_emoji, new_tier);
                }

                //TODO: create recipe

                int new_element_id = DatabaseHelper.GetElementId(connectionString, ai_response);
                DatabaseHelper.CreateNewRecipe(connectionString, element_ids[0], element_ids[1], new_element_id);

                Dictionary<string, string> response = new Dictionary<string, string>();
                response["name"] = ai_response;
                response["emoji"] = ai_response_emoji;
                response["_id"] = new_element_id.ToString();
                return Json(response);
            }
        }
    }
}
