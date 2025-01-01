using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.Http.HttpResults;
namespace ASP.Models
{
    public class ErrorViewModel
    {
        public string? RequestId { get; set; }

        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);
    }


public static class ErrorViewModelEndpoints
{
	public static void MapErrorViewModelEndpoints (this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/ErrorViewModel").WithTags(nameof(ErrorViewModel));

        group.MapGet("/", () =>
        {
            return new [] { new ErrorViewModel() };
        })
        .WithName("GetAllErrorViewModels")
        .WithOpenApi();

        group.MapGet("/{id}", (int id) =>
        {
            //return new ErrorViewModel { ID = id };
        })
        .WithName("GetErrorViewModelById")
        .WithOpenApi();

        group.MapPut("/{id}", (int id, ErrorViewModel input) =>
        {
            return TypedResults.NoContent();
        })
        .WithName("UpdateErrorViewModel")
        .WithOpenApi();

        group.MapPost("/", (ErrorViewModel model) =>
        {
            //return TypedResults.Created($"/api/ErrorViewModels/{model.ID}", model);
        })
        .WithName("CreateErrorViewModel")
        .WithOpenApi();

        group.MapDelete("/{id}", (int id) =>
        {
            //return TypedResults.Ok(new ErrorViewModel { ID = id });
        })
        .WithName("DeleteErrorViewModel")
        .WithOpenApi();
    }
}}
