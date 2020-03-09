using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class MerchantMap : TrackAndAuditEntityMap<Merchant, int>
    {
        public override void Map(EntityTypeBuilder<Merchant> b)
        {
            b.ToTable("tblMerchant");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.Property(x => x.Name);
            b.Property(x => x.ProfileImage);
            b.Property(x => x.Company);
            b.Property(x => x.CompanyImage);
            b.Property(x => x.Website);
            b.Property(x => x.MerchantRedirectionUrl);
            b.Property(x => x.Email);
            b.Property(x => x.Categories);
            //b.Property(x => x.Country);
            b.Property(x => x.SellCountries);
            b.Property(x => x.TermandCondition);
            b.HasOne<LookupTypeValues>(s => s.LookupApprovalStatus).WithOne(g => g.MerchantApprovalStatus).HasForeignKey<Merchant>(s => s.ApprovalStatus);
            b.HasOne<LookupTypeValues>(s => s.LookupCountry).WithOne(g => g.MerchantCountry).HasForeignKey<Merchant>(s => s.Country);
            b.HasOne<Users>(s => s.Users).WithOne(g => g.Merchant).HasForeignKey<Merchant>(s => s.UsersID);
        }
    }
}
