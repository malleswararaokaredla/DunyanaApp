namespace Dunyana.Dto
{
    public class NaqelOrderDto
    {
        public int OrderID { get; set; }
        public dynamic OrderNo { get; set; }
        public dynamic OrderDate { get; set; }
        public dynamic OrderAmount { get; set; }
        public dynamic MerchantID { get; set; }
        public dynamic MerchantName { get; set; }
        public dynamic CustomerID { get; set; }
        public dynamic CustomerFirstName { get; set; }
        public dynamic CustomerLastName { get; set; }
        public string COD { get; set; }
        public dynamic OrderStatus { get; set; }
        public dynamic PaidbyWallet { get; set; }
        public dynamic Paidbycard { get; set; }
        public dynamic PaidatMerchant { get; set; }
    }

}
