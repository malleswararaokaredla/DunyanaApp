using Sym.Core;

namespace Dunyana.Domain
{
    public class MerchantAccountDetails : TrackAndAuditEntity<MerchantAccountDetails, int>
    {
        public MerchantAccountDetails()
        {

        }
        public override int Id { get; set; }
        public int MerchantID { get; set; }
        public string MerchantContractNumber { get; set; }
        public string CR { get; set; }
        public string Brand_Account { get; set; }
        public string Bank_Name { get; set; }
        public string AC_Number { get; set; }
        public string Address { get; set; }
        public string Swift_code { get; set; }
        public virtual Merchant Merchant { get; set; }
    }
}
