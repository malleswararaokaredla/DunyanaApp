using Dunyana.API.Filters;
using Dunyana.Dto;
using Dunyana.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Dunyana.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class LookupController : ControllerBase
    {
        private readonly LookupTypeService _lookupService;
        public LookupController(LookupTypeService lookupService)
        {
            _lookupService = lookupService;
        }     
        [HttpGet, Route("GetLookup")] 
        public async Task<IActionResult> Get()
        {
            var _types = _lookupService.GetAll();

            return Ok(_types);
        }

        [HttpPost,Route("AddLookupType")]
        [TransactionFilter]
        public async Task<IActionResult> AddLookupType([FromBody] LookupTypeDto lookupTypeDto)
        {
            try
            {
                await _lookupService.AddLookupType(lookupTypeDto);

                
            } 
        
            catch (Exception err)
            {
                return Ok(new GenericResultDto<string> { Result = err.Message });
            }
            return Ok(new GenericResultDto<string> { Result = "Successfully added new lookup type" });
        }
    }
}