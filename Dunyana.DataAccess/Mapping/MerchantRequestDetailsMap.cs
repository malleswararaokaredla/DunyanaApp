using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class MerchantRequestDetailsMap : TrackAndAuditEntityMap<MerchantRequestDetails, int>
    {
        public override void Map(EntityTypeBuilder<MerchantRequestDetails> b)
        {
            b.ToTable("tblmerchantrequestdetails");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.Property(x => x.ApprovalStatus);
            b.HasOne<MerchantRequest>(s => s.MerchantRequest).WithOne(g => g.MerchantRequestDetails).HasForeignKey<MerchantRequestDetails>(s => s.MerchantRequestID);
            b.HasOne<LookupTypeValues>(s => s.LookupTypeValues).WithOne(g => g.MerchantRequestDetails).HasForeignKey<MerchantRequestDetails>(s => s.ApprovalStatus);
            b.HasOne<NaqelUsers>(s => s.NaqelUsers).WithOne(g => g.MerchantRequestDetails).HasForeignKey<MerchantRequestDetails>(s => s.RequestAssignee);
        }
    }
}