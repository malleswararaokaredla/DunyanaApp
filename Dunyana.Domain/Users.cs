using Sym.Core;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Dunyana.Domain
{
    public class Users : TrackAndAuditEntity<Users, int>
    {
        public Users()
        {

        }
        public override int Id { get; set; }     
        public string Username { get; set; }     
        public string PWD { get; set; }
        public string Type { get; set; }
        public int Status { get; set; }
        public string GUID { get; set; }
        public virtual ICollection<UserAduit> UserAduit { get; set; }
        public virtual CustomerRegistration CustomerRegistration { get; set; }
        public virtual Merchant Merchant { get; set; }
        public virtual NaqelUsers NaqelUsers { get; set; }
        [NotMapped]
        public string Token { get; set; }
    }
    
}