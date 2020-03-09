using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class MerchantRequestMap : TrackAndAuditEntityMap<MerchantRequest, int>
    {
        public override void Map(EntityTypeBuilder<MerchantRequest> b)
        {
            b.ToTable("tblMerchantRequest");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.Property(x => x.ApprovalStatus);
            b.Property(x => x.MerchantRequestGUID);
            b.HasOne<Merchant>(s => s.Merchant).WithOne(g => g.MerchantRequest).HasForeignKey<MerchantRequest>(s => s.MerchantID);
            b.HasOne<LookupTypeValues>(s => s.LookupTypeValues).WithOne(g => g.MerchantRequest).HasForeignKey<MerchantRequest>(s => s.ApprovalStatus);
            b.HasOne<NaqelUsers>(s => s.NaqelUsers).WithOne(g => g.MerchantRequest).HasForeignKey<MerchantRequest>(s => s.RequestAssignee);
        }
    }
}