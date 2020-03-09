using Dunyana.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Dunyana.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class LookupTypeValueController : BaseController
    {
        private readonly LookupTypeValuesService _lookupTypeValuesService;

        public LookupTypeValueController(LookupTypeValuesService lookupTypeValuesService)
        {
            _lookupTypeValuesService = lookupTypeValuesService;
        }
        [Route("GetCountrylist")]
        [HttpGet]
        public async Task<IActionResult> GetCountrylist()
        {
            var _types = _lookupTypeValuesService.GetAll();

            return Ok(_types);
        }

        [Route("getNaqelUserTypes")]
        [HttpGet]
        public async Task<IActionResult> GetNaqelUserTypes()
        {
            var naqelUserTypes = _lookupTypeValuesService.GetNaqelUserTypes();

            return Ok(naqelUserTypes);
        }

    }
}