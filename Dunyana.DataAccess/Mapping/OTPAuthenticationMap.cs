using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class OTPAuthenticationMap : TrackAndAuditEntityMap<OTPAuthentication, int>
    {
        public override void Map(EntityTypeBuilder<OTPAuthentication> b)
        {
            b.ToTable("tblOTPAuthentication");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.Property(x => x.OTP);
            b.Property(x => x.VerificationId);
            b.Property(x => x.StartDate);
            b.Property(x => x.EndDate);
        }
    }

}
