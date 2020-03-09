using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class MerchantContractDetailsMap : TrackAndAuditEntityMap<MerchantContractDetails, int>
    {
        public override void Map(EntityTypeBuilder<MerchantContractDetails> b)
        {
            b.ToTable("tblmerchantcontractdetails");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            //b.Property(x => x.MerchantID);
            b.Property(x => x.MerchantcontractID);
            b.Property(x => x.ContractFileName);
            b.HasOne<MerchantContract>(s => s.MerchantContract).WithMany(g => g.MerchantContractDetails).HasForeignKey(s => s.MerchantcontractID);
        }
    }
}