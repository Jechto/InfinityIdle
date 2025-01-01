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

            var mergedNames = $"{element1} {element2}";
            return Json(mergedNames);
        }
    }
}
