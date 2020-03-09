using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Transactions;

namespace Dunyana.API.Filters
{
    [AttributeUsage(AttributeTargets.Method)]
    public class TransactionFilterAttribute : ActionFilterAttribute
    {
        private const string transactionKey = "Transaction-for-TransactionAttribute";
        

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
            context.HttpContext.Items[transactionKey] = scope;
        }


        public override void OnActionExecuted(ActionExecutedContext context)
        {
            if (context.Exception != null )
            {
                DisposeTransaction(context);
            }
            else
            {
                CompleteTransaction(context);
            }
        }

        protected void CompleteTransaction(ActionExecutedContext context)
        {
            ((TransactionScope)context.HttpContext.Items[transactionKey]).Complete();
            DisposeTransaction(context);
        }

        protected void DisposeTransaction(ActionExecutedContext context)
        {
            ((TransactionScope)context.HttpContext.Items[transactionKey]).Dispose();
        }
    }
}
