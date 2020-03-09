using System;
using Checkout.Payments;
namespace Dunyana.Dto
{
    public class GetWalletPointsHistoryDto
    {
        public int Id { get; set; }

        public string Transaction { get; set; }
        public DateTime TransactionDate { get; set; }
        public decimal TransactionPoints { get; set; }
        public string TransactionDescription { get; set; }
        public int Status { get; set; }
        public int? OrderID { get; set; }
    }

}
