using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dunyana.Dto;
using Dunyana.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Dunyana.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class WalletPointsController : ControllerBase
    {
        private readonly WalletPointsHistoryService _WalletPointsHistoryService;
        private readonly UsersService _UsersService;
        public WalletPointsController(WalletPointsHistoryService WalletPointsHistoryService, UsersService UsersService)
        {
            _WalletPointsHistoryService = WalletPointsHistoryService;
            _UsersService =  UsersService;
        }
        [HttpGet, Route("GetWalletPointsHistory/{CustomerID}"), Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> GetWalletPointsHistory(string CustomerID)
        {
            try
            {
                var getCustomerID = await _UsersService.getCustomerID(CustomerID);
                var _getWalletPointsHistory = await _WalletPointsHistoryService.GetAll(getCustomerID);
                return Ok(_getWalletPointsHistory);
            }
            catch (Exception err)
            {

                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
    }
}