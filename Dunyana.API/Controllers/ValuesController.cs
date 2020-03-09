using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using Dunyana.Services;
using Dunyana.Dto;
using Microsoft.AspNetCore.Http;

namespace Dunyana.API.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly LookupTypeService _LookupTypeService;
        private IHostingEnvironment _hostingEnvironment;
        private readonly IConfiguration _configuration;
        string strImagePath = string.Empty;
        // GET api/values
        public ValuesController(IConfiguration configuration, IHostingEnvironment hostingEnvironment, LookupTypeService LookupTypeService)
        {
            _configuration = configuration;
            _hostingEnvironment = hostingEnvironment;
            _LookupTypeService = LookupTypeService;
        }


        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost, Route("UploadFile"), DisableRequestSizeLimit]
        public async Task<IActionResult> UploadFile( )
        {
            try
            {
                strImagePath = _configuration["FilePath:ImagePath"] + "CategoryImages/";
                if (!Directory.Exists(strImagePath))
                    Directory.CreateDirectory(strImagePath);
                if (ModelState.IsValid)
                {
                    var file = HttpContext.Request.Form.Files[0];

                    if (string.IsNullOrWhiteSpace(_hostingEnvironment.WebRootPath))
                    {
                        _hostingEnvironment.WebRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                    }
                    string webRootPath = _hostingEnvironment.WebRootPath;
                    string newPath = Path.Combine(webRootPath, strImagePath);
                    if (file.Length > 0)
                    {
                        string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                        string fullPath = Path.Combine(strImagePath, fileName);
                        byte[] fileBytes;
                        using (var ms = new MemoryStream())
                        {
                            file.CopyTo(ms);
                            fileBytes = ms.ToArray();
                        }
                        using (var stream = new FileStream(fullPath, FileMode.Append, FileAccess.Write))
                        {

                            await file.CopyToAsync(stream);
                            stream.Flush();
                        }
                    }
                }
                return Ok(new Dto.GenericResultDto<string> { Result = "Upload Successful." });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new Dto.GenericResultDto<string> { Result = "Upload Successful." });
            }
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
