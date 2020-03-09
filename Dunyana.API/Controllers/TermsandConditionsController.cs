using Dunyana.API.Filters;
using Dunyana.Dto;
using Dunyana.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;

namespace Dunyana.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class TermsandConditionsController : ControllerBase
    {
        string strTermsandConditions = string.Empty;
        private readonly IConfiguration _configuration;
        string returnTermsandConditions = string.Empty;
        public TermsandConditionsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet, Route("TermsandConditions")]
        [TransactionFilter]
        public async Task<IActionResult> getTermsandConditions()
        {
            try
            {
                strTermsandConditions = _configuration["FilePath:ImagePath"] + "TermsandConditions/";
                string strServerURL = _configuration["FilePath:ServerURL"] + "TermsandConditions/";
                string TermsandConditions = "Cust_TnC.docx";
                if (System.IO.File.Exists(strTermsandConditions + TermsandConditions))
                {

                    returnTermsandConditions = strServerURL + TermsandConditions;
                }
                else
                {
                    returnTermsandConditions = "";

                }

                return Ok(new GenericResultDto<string> { Result = returnTermsandConditions } );
            }
            catch (Exception err)
            {

                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }


        }
    }
}