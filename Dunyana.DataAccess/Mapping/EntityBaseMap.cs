using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Sym.Core;
using Sym.Core.DataAccess;

namespace Dunyana.DataAccess.Mapping
{
    public class TrackAndAuditEntityMap<TEntity, TKey> : EntityMappingConfiguration<TEntity>
        where TEntity : TrackAndAuditEntity<TEntity, TKey>
        where TKey : struct
    {
        public override void Map(EntityTypeBuilder<TEntity> b)
        {
             
            b.HasKey(x => x.Id);
            b.Property(t => t.CreatedBy)
              .HasColumnName("CreatedBy");
            b.Property(t => t.CreatedDate)
                .HasColumnName("CreatedDate");
            b.Property(t => t.UpdatedDate)
                .HasColumnName("UpdatedDate");            
        }

        
    }
}
