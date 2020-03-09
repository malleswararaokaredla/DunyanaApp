using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Sym.Core;
using Sym.Core.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

namespace Dunyana.DataAccess
{
    public class DunyanaDbContext : DbContext
    {
      
        public int UserId;

        static DunyanaDbContext()
        {
            // Database.SetInitializer<SymDbContext>(null);
        }
        public DunyanaDbContext() { }
        // ReSharper disable once SuggestBaseTypeForParameter
        public DunyanaDbContext(DbContextOptions<DunyanaDbContext> options) : base(options)
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder
            .UseLazyLoadingProxies();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.AddEntityConfigurationsFromAssembly(GetType().GetTypeInfo().Assembly);
        }
        public override DbSet<TEntity> Set<TEntity>()
        {
            return base.Set<TEntity>();
        }
        public override int SaveChanges()
        {
            SetRowAuditData();
            return base.SaveChanges();
        }
        private void SetRowAuditData()
        {
            var addedUpdatedEntities = GetAddedUpdatedEntities().ToList();
            var currentDateTime = DateTime.Now;

            var httpContextAccessor = this.GetService<IHttpContextAccessor>();
            if (httpContextAccessor.HttpContext != null)
            {
                var keys = httpContextAccessor?.HttpContext?.Request?.Headers.Keys;
                if (keys != null)
                {
                    UserId = 0;
                    if (!string.IsNullOrEmpty(httpContextAccessor?.HttpContext?.Request?.Headers["UserId"]))
                    {
                        UserId = int.Parse(httpContextAccessor?.HttpContext?.Request?.Headers["UserId"]);
                    }
                }
            }

            // NOTE: ADMIN module will not have session so there we are passing EmployeeId rest all will be sessionId
            var user = UserId > 0 ? UserId : 0;
            addedUpdatedEntities.ForEach((e =>
            {
                if (e.Entity is IEntityBase)
                {
                    var entityBase = e.Entity as ITrackEntity;
                    if (entityBase == null)
                    {
                        return;
                    }
                    if (e.State == EntityState.Added)
                    {
                        entityBase.CreatedBy = user;
                        entityBase.CreatedDate = currentDateTime;
                    }

                    entityBase.UpdatedBy = user;
                    entityBase.UpdatedDate = currentDateTime;
                }
                else
                {
                    var entityBase = e.Entity as IAuditEntityBase;
                    if (entityBase == null)
                    {
                        return;
                    }
                    if (e.State == EntityState.Added)
                    {
                        entityBase.CreatedBy = user;
                        entityBase.CreatedDate = currentDateTime;
                    }
                    if (!entityBase.CreatedBy.HasValue)
                    {
                        entityBase.CreatedBy = user;
                    }
                    if (!entityBase.CreatedDate.HasValue)
                    {
                        entityBase.CreatedDate = currentDateTime;
                    }
                    entityBase.UpdatedBy = user;
                    entityBase.UpdatedDate = currentDateTime;
                }

            }));
        }

        private IEnumerable<EntityEntry> GetAddedUpdatedEntities()
        {
            //var context = ((IObjectContextAdapter)this).ObjectContext;
            return
                from e in ChangeTracker.Entries().Where(e => e.State == EntityState.Added || e.State == EntityState.Modified)
                where
                    //e.IsRelationship == false
                    //&& 
                    e.Entity is ITrackEntity || e.Entity is ITrackAndAuditEntity
                select e;
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {
             SetRowAuditData();
            //var addedUpdatedEntities = GetAddedUpdatedEntities().ToList();
            return base.SaveChangesAsync();
        }
    }
    
}
