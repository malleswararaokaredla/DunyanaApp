using Dunyana.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Dunyana.DataAccess.Mapping
{
    public class CategoryMap : TrackAndAuditEntityMap<Category, int>
    {
        public override void Map(EntityTypeBuilder<Category> b)
        {
            b.ToTable("tblcategory");
            b.HasKey(x => x.Id);
            b.Property(x => x.Id).HasAnnotation("MySql:ValueGeneratedOnAdd", true).ValueGeneratedOnAdd();
            b.Property(x => x.Name);
            b.Property(x => x.Image);
            b.Property(x => x.Priority);
            b.Property(x => x.IsActive);
        }
    }
}
