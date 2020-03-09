using Dunyana.API.Filters;
using Dunyana.Dto;
using Dunyana.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace Dunyana.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class MerchantBonusController : ControllerBase
    {
        private readonly MerchantRequestService _MerchantRequestService;
        private readonly MerchantBonusService _MerchantBonusService;
        string strImagePath = string.Empty;
        public MerchantBonusController(IConfiguration configuration, MerchantRequestService MerchantRequestService, MerchantBonusService MerchantBonusService)
        {
            _MerchantRequestService = MerchantRequestService;
            _MerchantBonusService = MerchantBonusService;
        }
        [HttpGet, Route("GetMerchantBonus"), Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> GetMerchantBonus()
        {
            try
            {
                var _getMerchantBonus = _MerchantRequestService.GetAll();

                return Ok(_getMerchantBonus);
            }
            catch (Exception err)
            {

                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }


        }
        [HttpPost, Route("UpdateMerchantBonus"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> UpdateMerchantBonus([FromBody] UpdateMerchantBonusDto UpdateMerchantBonusDto)
        {
            string ResultMeassage = string.Empty;
            try
            {

                ResultMeassage = await _MerchantBonusService.UpdateMerchantBonus(UpdateMerchantBonusDto);
                return Ok(new GenericResultDto<string> { Result = ResultMeassage });
            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
    }
}