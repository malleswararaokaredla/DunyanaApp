
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Dunyana.API
{
    public class LogAndErrorHandlingMiddleware
    {
        private readonly RequestDelegate next;
        private readonly ILogger<LogAndErrorHandlingMiddleware> logger;
        private static string requestLog;

        public LogAndErrorHandlingMiddleware(RequestDelegate next, ILogger<LogAndErrorHandlingMiddleware> logger)
        {
            this.next = next;
            this.logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            //capture the request body
            var requestStream = new MemoryStream(100);
            requestLog = $"REQUEST HttpMethod: {context.Request.Method}, Path: {context.Request.Path}";
            try
            {
                using (var bodyReader = new StreamReader(context.Request.Body))
                {
                    if (!context.Request.Path.Value.Contains("/api/MerchantContract/insertMerchantContract"))
                    {
                        var bodyAsText = bodyReader.ReadToEnd();
                        if (string.IsNullOrWhiteSpace(bodyAsText) == false)
                        {
                            requestLog += $", Body : {bodyAsText}";
                        }

                        var bytesToWrite = Encoding.UTF8.GetBytes(bodyAsText);
                        requestStream.Write(bytesToWrite, 0, bytesToWrite.Length);
                        requestStream.Seek(0, SeekOrigin.Begin);
                        context.Request.Body = requestStream;
                    }
                }

                await next(context);
                if (context.Response.StatusCode == StatusCodes.Status400BadRequest)
                    logger.LogTrace("-----------------------------" + requestLog + "-------------------------------------------");

            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex, logger);

            }
            finally
            {
                requestStream.Dispose();
            }
        }


        private static async Task HandleExceptionAsync(HttpContext context, Exception exception, ILogger<LogAndErrorHandlingMiddleware> logger)
        {
            logger.LogError("-----------------------------" + requestLog + "-------------------------------------------");
            if (!context.Response.HasStarted)
            {
                var code = HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)code;
               
            }
        }
    }
}
