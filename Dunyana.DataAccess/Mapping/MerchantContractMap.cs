using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class MerchantContractMap : TrackAndAuditEntityMap<MerchantContract, int>
    {
        public override void Map(EntityTypeBuilder<MerchantContract> b)
        {
            b.ToTable("tblMerchantContract");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            //b.Property(x => x.MerchantID);
            b.Property(x => x.MerchantrequestID);
            b.HasOne<Merchant>(s => s.Merchant).WithMany(g => g.MerchantContract).HasForeignKey(s => s.MerchantID);
        }
    }
}