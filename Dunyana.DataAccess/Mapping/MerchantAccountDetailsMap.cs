using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class MerchantAccountDetailsMap : TrackAndAuditEntityMap<MerchantAccountDetails, int>
    {
        public override void Map(EntityTypeBuilder<MerchantAccountDetails> b)
        {
            b.ToTable("tblmerchantAccountdetails");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.Property(x => x.CR);
            b.Property(x => x.Brand_Account);
            b.Property(x => x.Bank_Name);
            b.Property(x => x.AC_Number);
            b.Property(x => x.Address);
            b.Property(x => x.Swift_code);
            b.HasOne<Merchant>(s => s.Merchant).WithOne(g => g.MerchantAccountDetails).HasForeignKey<MerchantAccountDetails>(s => s.MerchantID);
        }
    }

}
