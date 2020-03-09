using Sym.Core;

namespace Dunyana.Domain
{
    public class OrderAddress : TrackAndAuditEntity<OrderAddress, int>
    {
        public OrderAddress()
        {

        }
        public override int Id { get; set; }

        public string Line1 { get; set; }
        public string Line2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string zip { get; set; }
        public string MobileNo { get; set; }
        public string Phone { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }

        public int OrderRefID { get; set; }
        public virtual Order Order { get; set; }
    }
}
