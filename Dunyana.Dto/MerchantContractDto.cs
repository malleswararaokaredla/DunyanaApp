namespace Dunyana.Dto
{
    public class MerchantContractDto
    {
        public dynamic RequestID { get; set; }
        public dynamic MerchantID { get; set; }
        public dynamic MerchantName { get; set; }
        public dynamic ContractID { get; set; }
    }
    public class InsertMerchantContractDto
    {
        public int MerchantID { get; set; }
        public int MerchantrequestID { get; set; }
        public string ContractFilename { get; set; }
    }
}
