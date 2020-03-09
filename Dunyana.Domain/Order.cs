using Sym.Core;
using System;
using System.Collections.Generic;

namespace Dunyana.Domain
{
    public class Order : TrackAndAuditEntity<Order, int>
    {
        public Order()
        {

        }
        public override int Id { get; set; }
        public int CustomerID { get; set; }
        public string OrderNo { get; set; }
        public DateTime OrderDate { get; set; }
        public float OrderAmount { get; set; }
        public string Currency { get; set; }
        public string OrderStatus { get; set; }
        public string Paymentstatus { get; set; }
        public string COD { get; set; }
        public int MerchantID { get; set; }

        public virtual ICollection<OrderAddress> OrderAddress { get; set; }
        public virtual ICollection<WayBill> WayBill { get; set; }
        public virtual CustomerRegistration CustomerRegistration { get; set; }
        public virtual Merchant Merchant { get; set; }
    }
}
