using Sym.Core;

namespace Dunyana.Domain
{
    public class AdminPromotionalCountries : TrackAndAuditEntity<AdminPromotionalCountries, int>
    {
        public AdminPromotionalCountries()
        {

        }
        public override int Id { get; set; }
        public int CountryID { get; set; }
        public int PromotionalID { get; set; }
        public virtual AdminPromotional AdminPromotional { get; set; }
        public virtual LookupTypeValues LookupTypeValues { get; set; }
    }
}
