using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Dunyana.Dto
{
    public class TokenDto
    {
        [Required(ErrorMessage = "Please enter GUID")]
        public string GUID { get; set; }
        [Required(ErrorMessage = "Please enter type")]
        public string Type { get; set; }
        public string Token { get; set; }

    }

}
