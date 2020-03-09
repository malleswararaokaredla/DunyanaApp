using Sym.Core;
using System;
using System.Collections.Generic;

namespace Dunyana.Domain
{
    public class WayBill : TrackAndAuditEntity<WayBill, int>
    {
        public WayBill()
        {

        }
        public override int Id { get; set; }
        public int OrderId { get; set; }
        public string WaybillNo { get; set; }
        public virtual Order Order { get; set; }
        public virtual ICollection<OrderDetails> OrderDetails { get; set; }
    }
}
