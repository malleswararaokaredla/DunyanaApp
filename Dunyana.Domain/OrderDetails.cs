using Sym.Core;
using System;

namespace Dunyana.Domain
{
    public class OrderDetails : TrackAndAuditEntity<OrderDetails, int>
    {
        public OrderDetails()
        {

        }
        public override int Id { get; set; }
        public int OrderRefID { get; set; }
        public int WaybillId { get; set; }
        //public string TrackingID { get; set; }
        public string ProductSKU { get; set; }
        public string ProductImage { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public int Quantity { get; set; }
        public float UnitCost { get; set; }
        public string CurrenyCode { get; set; }
        public DateTime Returndate { get; set; }
        public DateTime? Canceldate { get; set; }
        public virtual WayBill WayBill { get; set; }
    }
}
