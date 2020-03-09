using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class PaymentResponseMap : TrackAndAuditEntityMap<PaymentResponse, int>
    {
        public override void Map(EntityTypeBuilder<PaymentResponse> b)
        {
            b.ToTable("tblpaymentresponse");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.HasKey(x => x.PaymentDate);
            b.HasKey(x => x.Amount);
            b.HasKey(x => x.Currency);
            b.HasKey(x => x.Card);
            b.HasKey(x => x.Cardscheme);
            b.HasKey(x => x.CardType);
            b.HasKey(x => x.PaymentStatus);
            b.HasKey(x => x.TransactionType);
            b.HasKey(x => x.PaymentCustomerId);
            b.HasKey(x => x.PaymentSourceId);
            b.HasKey(x => x.OrderId);
            b.HasKey(x => x.ReturnPaymentResponse);
            b.HasOne<CustomerRegistration>(s => s.CustomerRegistration).WithOne(g => g.PaymentResponse).HasForeignKey<PaymentResponse>(s => s.CustomerId);
        }
    }
}
