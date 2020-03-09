using Sym.Core;

namespace Dunyana.Domain
{
    public class UserAduit : TrackAndAuditEntity<UserAduit, int>
    {
        public UserAduit()
        {

        }
        public override int Id { get; set; }
        public int UsersID { get; set; }
        public string Oldvalue { get; set; }
        public string Newvalue { get; set; }
        public virtual Users Users { get; set; }
    }
}
