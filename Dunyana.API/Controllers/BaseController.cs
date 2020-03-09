using Dunyana.API.Filters;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Dunyana.API.Controllers
{
    [Route("api/[controller]")]
    [EnableCors("AllowAllOrigins")]
    [ServiceFilter(typeof(DisableLazyLoadingFilter))]
    //[Authorize]	 
    public class BaseController : Controller
    {
      

        public BaseController()
        {
        }

      

        public override void OnActionExecuting(ActionExecutingContext context)
        {
             
        }

         
    }
}
