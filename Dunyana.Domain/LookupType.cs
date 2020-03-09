using Sym.Core;
using System.Collections.Generic;

namespace Dunyana.Domain
{
    public class LookupType : TrackAndAuditEntity<LookupType, int>
    {
        public LookupType()
        {

        }

        public override int Id { get; set; }
        public string Description { get; set; }
        public virtual ICollection<LookupTypeValues> LookupTypeValue { get; set; }
    }
}
