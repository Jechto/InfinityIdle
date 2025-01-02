using ASP.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace ASP.Controllers
{
    public class ElementAPI : Controller
    {
        [HttpGet("/merge")]
        public IActionResult MergeNames([FromQuery] string element1, [FromQuery] string element2)
        {
            if (string.IsNullOrEmpty(element1) || string.IsNullOrEmpty(element2))
            {
                return BadRequest("Both elements must be provided");
            }

            var names = new[] { element1, element2 };
            var sortedNames = names.OrderBy(n => n).ToArray();
            var mergedNames = string.Join(" ", sortedNames);

            return Json(mergedNames);
        }
    }
}
