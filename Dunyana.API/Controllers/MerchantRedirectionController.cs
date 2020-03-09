using Dunyana.API.Filters;
using Dunyana.Dto;
using Dunyana.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
namespace Dunyana.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class MerchantRedirectionController : ControllerBase
    {
        private readonly MerchantService _MerchantService;
        private readonly MerchantRedirectionService _MerchantRedirectionService;
        public MerchantRedirectionController(MerchantService MerchantService, MerchantRedirectionService MerchantRedirectionService)
        {
            _MerchantService = MerchantService;
            _MerchantRedirectionService = MerchantRedirectionService;
        }
        // GET: api/<controller>
        [HttpGet, Route("getMerchantsRedirection"), Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> getMerchants()
        {
            try
            {
                var _getMerchantRedirectionlist = await _MerchantService.getMerchantRedirection();
                if (_getMerchantRedirectionlist.Count > 0)
                {

                    return Ok(_getMerchantRedirectionlist);
                }

                return Ok(_getMerchantRedirectionlist);

            }
            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
        [HttpGet, Route("getMerchantRedirectionlist/{MerchantId}"), Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> getMerchantRedirectionlist(int MerchantId)
        {
            try
            {
                var _getMerchantRedirectionlist = await _MerchantService.getMerchantRedirectionlist(MerchantId);
                if (!string.IsNullOrEmpty(_getMerchantRedirectionlist.MerchantRedirectionUrl))
                {

                    return Ok(_getMerchantRedirectionlist);
                }

                return Ok(_getMerchantRedirectionlist);

            }
            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }
        [HttpPost, Route("updateMerchantRedirectionUrl"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> UpdateMerchantRedirectionUrl([FromBody] MerchantRedirectionDto MerchantRedirectionDto)
        {
            try
            {
                if (!string.IsNullOrEmpty(MerchantRedirectionDto.MerchantRedirectionUrl))
                {

                    await _MerchantService.UpdateMerchantRedirectionDetails(MerchantRedirectionDto);
                }
                else
                {
                    return BadRequest(new GenericResultDto<string> { Result = "MerchantRedirectionUrl" });
                }

            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string>
                {
                    Result = err.Message
                });
            }
            return Ok(new GenericResultDto<string> { Result = "Merchant redirection URL updated successfully" });

        }
        [HttpPost, Route("insertMerchantRedirection/{MerchantId}"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> insertMerchantRedirectionDetails(int MerchantId, [FromBody] MerchantRedirectionlistDto MerchantRedirectionlistDto)
        {
            try
            {
                var _getDetails = await _MerchantService.GetMerchantDetailswithid(MerchantId);
                if (_getDetails != null)
                { 
                   await _MerchantRedirectionService.InsertMerchantRedirectionDetails(MerchantRedirectionlistDto,_getDetails.Id);

                }
                else
                {
                    return BadRequest(new GenericResultDto<string> { Result = "Invalid email" });
                }

            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string>
                {
                    Result = err.Message
                });
            }
            return Ok(new GenericResultDto<string> { Result = "Merchant attribute values capture successfully" });

        }
        [HttpPost, Route("updateMerchantRedirectionValue/{MerchantId}"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> updateMerchantRedirection(int MerchantId, [FromBody] MerchantRedirectionlistDto MerchantRedirectionlistDto)
        {
            try
            {
                var _getDetails = await _MerchantService.GetMerchantDetailswithid(MerchantId);
                if (_getDetails != null)
                {
                    await _MerchantRedirectionService.UpdateMerchantRedirectionDetails(MerchantRedirectionlistDto, _getDetails.Id);

                }
                else
                {
                    return BadRequest(new GenericResultDto<string> { Result = "Invalid email" });
                }

            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string>
                {
                    Result = err.Message
                });
            }
            return Ok(new GenericResultDto<string> { Result = "Merchant attribute values updated successfully" });

        }
        [HttpPost, Route("deleteMerchantRedirectionValue/{MerchantId}/{MerchantRedirectionId}"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> deleteMerchantRedirectionValue(int MerchantId,int MerchantRedirectionId)
        {
            try
            {
                var _getMerchantDetails = await _MerchantService.GetMerchantDetailswithid(MerchantId);
                if (_getMerchantDetails != null)
                {
                    
                    await _MerchantRedirectionService.deleteMerchantRedirectionValue(MerchantId,MerchantRedirectionId);
                }
                else
                {
                    return BadRequest(new GenericResultDto<string> { Result = "Invalid email" });
                }

            }

            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string>
                {
                    Result = err.Message
                });
            }
            return Ok(new GenericResultDto<string> { Result = "Merchant attribute values deleted successfully" });

        }
    }

}