using Dunyana.API.Filters;
using Dunyana.Dto;
using Dunyana.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace Dunyana.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class MerchantContractController : ControllerBase
    {
        private IHostingEnvironment _hostingEnvironment;
        private readonly IConfiguration _configuration;
        private readonly MerchantRequestService _MerchantRequestService;
        private readonly MerchantService _MerchantService;
        private readonly MerchantContractService _MerchantContractService;
        private readonly MerchantContractDetailServices _MerchantContractDetailServices;
        string strMerchantImages = string.Empty;
        string strContractPath = string.Empty;
        public MerchantContractController(IHostingEnvironment hostingEnvironment, IConfiguration configuration, MerchantContractService MerchantContractService,
                                          MerchantContractDetailServices MerchantContractDetailServices, MerchantRequestService MerchantRequestService, MerchantService MerchantService)
        {
            _configuration = configuration;
            _hostingEnvironment = hostingEnvironment;
            _MerchantContractService = MerchantContractService;
            _MerchantContractDetailServices = MerchantContractDetailServices;
            _MerchantRequestService = MerchantRequestService;
            _MerchantService = MerchantService;
        }
        [HttpGet, Route("getMerchantContractlist"), Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> getMerchantContractlist()
        {
            try
            {
                var _getMerchantContractlist = await _MerchantRequestService.Getmerchantcontract();
                if (_getMerchantContractlist.Count > 0)
                {
                    foreach (var MerchantContractlist in _getMerchantContractlist)
                    {
                        strMerchantImages = _configuration["FilePath:ImagePath"] + "MerchantContract/";
                        string strServerURL = _configuration["FilePath:ServerURL"] + "MerchantContract/";
                        if (System.IO.File.Exists(strMerchantImages + MerchantContractlist.ActiveContractFileName))
                        {

                            MerchantContractlist.ActiveContractFileName = strServerURL + MerchantContractlist.ActiveContractFileName;
                        }
                        else
                        {
                            MerchantContractlist.ActiveContractFileName = "";

                        }
                        if (MerchantContractlist.merchantcontractsHistory != null)
                        {
                            foreach (var merchantcontractsHistory in MerchantContractlist.merchantcontractsHistory)
                            {
                                if (System.IO.File.Exists(strMerchantImages + merchantcontractsHistory.ContractFileName))
                                {

                                    merchantcontractsHistory.ContractFileURL = strServerURL + merchantcontractsHistory.ContractFileName;
                                }
                                else
                                {
                                    merchantcontractsHistory.ContractFileURL = "";

                                }
                            }
                        }

                    }
                }

                return Ok(_getMerchantContractlist);

            }
            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }

        [HttpPost, Route("getContractByMerchant"), Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> getContractByMerchant(GetMerchant GetMerchant)
        {
            try
            {
                var _getMerchantContractlist = await _MerchantService.GetcontractBymerchant(GetMerchant);
                if (_getMerchantContractlist.Count > 0)
                {
                    foreach (var MerchantContractlist in _getMerchantContractlist)
                    {
                        strMerchantImages = _configuration["FilePath:ImagePath"] + "MerchantContract/";
                        string strServerURL = _configuration["FilePath:ServerURL"] + "MerchantContract/";


                        if (System.IO.File.Exists(strMerchantImages + MerchantContractlist.ContractFileName))
                        {

                            MerchantContractlist.ContractFileURL = strServerURL + MerchantContractlist.ContractFileName;
                        }
                        else
                        {
                            MerchantContractlist.ContractFileURL = "";

                        }
                    }
                }

                return Ok(_getMerchantContractlist);

            }
            catch (Exception err)
            {
                return BadRequest(new GenericResultDto<string> { Result = err.Message });
            }
        }

        [HttpPost, DisableRequestSizeLimit, Route("insertMerchantContract"), Authorize(AuthenticationSchemes = "Bearer")]
        [TransactionFilter]
        public async Task<IActionResult> insertMerchantContract([FromForm]int MerchantID, [FromForm]int MerchantrequestID)
        {
            try
            {
                strContractPath = _configuration["FilePath:ImagePath"] + "MerchantContract/";
                string strServerURL = _configuration["FilePath:ServerURL"] + "MerchantContract/";

                var file = Request.Form.Files[0];
                if (file != null)
                {
                    string fileName = string.Empty;
                    if (!Directory.Exists(strContractPath))
                    {
                        Directory.CreateDirectory(strContractPath);
                    }
                    if (file.Length > 0)
                    {
                        fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                        string fullPath = Path.Combine(strContractPath, fileName);
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            file.CopyTo(stream);
                        }
                    }
                    InsertMerchantContractDto InsertMerchantContractDto = new InsertMerchantContractDto();
                    InsertMerchantContractDto.MerchantID = MerchantID;
                    InsertMerchantContractDto.MerchantrequestID = MerchantrequestID;
                    InsertMerchantContractDto.ContractFilename = fileName;
                    int MerchantContractID = await _MerchantContractService.CheckMerchantContract(MerchantID, MerchantrequestID);
                    if (MerchantContractID == 0)
                    {
                        await _MerchantContractService.InsertMerchantContract(InsertMerchantContractDto);
                        int getMerchantContractID = await _MerchantContractService.CheckMerchantContract(MerchantID, MerchantrequestID);
                        if (getMerchantContractID > 0)
                        {

                            await _MerchantContractDetailServices.InsertMerchantContractdetails(InsertMerchantContractDto, getMerchantContractID);
                        }
                    }
                    else
                    {
                        await _MerchantContractService.UpdateMerchantContract(InsertMerchantContractDto);
                        await _MerchantContractDetailServices.InsertMerchantContractdetails(InsertMerchantContractDto, MerchantContractID);
                    }
                }
                return Ok(new GenericResultDto<string> { Result = "Merchant Contract Upload Successfully" });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new GenericResultDto<string> { Result = ex.Message });
            }

        }

    }
}