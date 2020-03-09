using Dunyana.Services;
using Microsoft.AspNetCore.Mvc.Filters;
using System;

namespace Dunyana.API.Filters
{
    [AttributeUsage(AttributeTargets.Method)]
    public class DisableLazyLoadingFilter : ActionFilterAttribute
    {
        private readonly DataBaseService _dataBaseService;

        public DisableLazyLoadingFilter(DataBaseService databaseService)
        {
            _dataBaseService = databaseService;
        }

        public override void OnResultExecuting(ResultExecutingContext context)
        {
            _dataBaseService.DisableLazyLoading();
            base.OnResultExecuting(context);
        }
    }
}
