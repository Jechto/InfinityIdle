using ASP.Models;
using Microsoft.AspNetCore.Mvc;
using Npgsql;
using System.Diagnostics;
using System.Linq;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ASP.Controllers
{
    public class ElementAPI : Controller
    {
        private readonly IConfiguration _configuration;
        public ElementAPI(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("/merge")]
        public IActionResult MergeNames([FromQuery] string element1, [FromQuery] string element2)
        {
            if (string.IsNullOrEmpty(element1) || string.IsNullOrEmpty(element2))
            {
                return BadRequest("Both elements must be provided");
            }

            // Sort to make sure the order is consistent regardless of user order
            var names = new[] { element1, element2 };
            var sortedNames = names.OrderBy(n => n).ToArray();

            var connectionString = _configuration.GetConnectionString("postgresConnection");
            var connection = new NpgsqlConnection(connectionString);

            // fetch the count of the elements, must be 2 unique or duplicate
            var element_ids = DatabaseHelper.GetElementCount(connection, sortedNames[0], sortedNames[1]);
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
                    count = 2;
                }   
            }

            string[] new_element = DatabaseHelper.ExecuteElementCreateQuery(connection, element_ids[0], element_ids[1]);

            Dictionary<string, string> response = new Dictionary<string, string>();
            response["name"] = new_element[0];
            response["emoji"] = new_element[1];
            response["_id"] = new_element[2];

            return Json(response);
        }
    }
}
