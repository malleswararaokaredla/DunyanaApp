using System;
using System.Collections.Generic;

namespace Dunyana.Dto
{
    public class merchantcontractdetailsDto
    {
        public int MerchantrequestID { get; set; }
        public int MerchantID { get; set; }
        public string MerchantName { get; set; }
        public string ActiveContractFileName { get; set; }
        public string ContractUploaddate { get; set; }
        public List<merchantcontractdetailsHistoryDto> merchantcontractsHistory { get; set; }
    }
    public class merchantcontractdetailsHistoryDto
    {
        public string ContractFileName { get; set; }
        public string ContractFileURL { get; set; }
        public DateTime? ContractUploaddate { get; set; }
    }
}
