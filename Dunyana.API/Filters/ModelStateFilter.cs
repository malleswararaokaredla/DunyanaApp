using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;

namespace Dunyana.API.Filters
{
    [AttributeUsage(AttributeTargets.Method)]
    public class ModelStateFilter : Microsoft.AspNetCore.Mvc.Filters.ActionFilterAttribute
    {
        private readonly ILogger<ModelStateFilter> _logger;
        public ModelStateFilter(ILogger<ModelStateFilter> logger)
        {
            _logger = logger;
        }
        /*
         * Model state is applied only to POST methods.
         * it can be applied for GET methods but it will fail when the call has nullable parameters
         * ex: http://localhost:5000/api/Session/ListCashierSessions/1/null/null/komal.tapadia@tekzenit.com/null
         */
        public override void OnActionExecuting(Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext context)
        {
            if (context.HttpContext.Request.Method != "GET" &&  !context.ModelState.IsValid)
            {
                context.Result = new BadRequestObjectResult(context.ModelState);
                var errorString = string.Join("; ", context.ModelState.Values.ToList()
                    .SelectMany(v => v.Errors)
                    .Select(x => x.ErrorMessage));
                _logger.LogError($"Bad Request: {errorString}");
            }
        }
    }
}
