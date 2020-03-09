using Sym.Core;
using System.Collections.Generic;

namespace Dunyana.Domain
{
    public class Category : TrackAndAuditEntity<Category, int>
    {
        public Category()
        {

        }
        public override int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public int Priority { get; set; }
        public int IsActive { get; set; }
        public virtual ICollection<MerchantCategory> MerchantCategory { get; set; }
        public virtual ICollection<MerchantCatalog> MerchantCatalog { get; set; }
    }
}
