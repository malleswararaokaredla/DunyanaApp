using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class PaymentCardsMap : TrackAndAuditEntityMap<PaymentCards, int>
    {
        public override void Map(EntityTypeBuilder<PaymentCards> b)
        {
            b.ToTable("tblPaymentCards");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.HasKey(x => x.CardCustomerId);
            b.HasKey(x => x.CardSourceId);
            b.HasKey(x => x.last4digits);
            b.HasKey(x => x.CardType);
            b.HasKey(x => x.Expmonth);
            b.HasKey(x => x.Expyear);
            b.HasOne<CustomerRegistration>(s => s.CustomerRegistration).WithOne(g => g.PaymentCards).HasForeignKey<PaymentCards>(s => s.CustomerId);
        }
    }
}
