using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Reflection;
using System.Threading.Tasks;

namespace Sym.Core.DataAccess
{
    public class Repository<TEntity> : IRepository<TEntity>
        where TEntity : class
    {
        protected readonly DbContext _dbContext;
        private readonly DbSet<TEntity> _dbSet;
        private readonly IHttpContextAccessor _httpContextAccessor;
     
        public readonly int SessionId;

        /// <summary>
        /// Initializes a new instance of the <see cref="Repository{TEntity}"/> class.
        /// </summary>
        /// <param name="dbContext">The database context.</param>
        public Repository(DbContext dbContext, IHttpContextAccessor httpContextAccessor)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
            _dbSet = _dbContext.Set<TEntity>();
            _httpContextAccessor = httpContextAccessor;
            var keys = _httpContextAccessor?.HttpContext?.Request?.Headers.Keys;
            if (keys != null )
            {
              
               // SessionId = int.Parse(_httpContextAccessor?.HttpContext?.Request?.Headers["SessionId"]);
            }
        }

        #region IQueryable<TEntity>
        public Type ElementType => ((IQueryable<TEntity>)_dbSet).ElementType;

        public Expression Expression => ((IQueryable<TEntity>)_dbSet).Expression;

        public IQueryProvider Provider => ((IQueryable<TEntity>)_dbSet).Provider;
        #endregion

        /// <summary>
        /// Finds an entity with the given primary key values. If found, is attached to the context and returned. If no entity is found, then null is returned.
        /// </summary>
        /// <param name="keyValues">The values of the primary key for the entity to be found.</param>
        /// <returns>A <see cref="Task" /> that represents the asynchronous insert operation.</returns>
        public async Task<TEntity> FindAsync(params object[] keyValues) => await _dbSet.FindAsync(keyValues);

        private void  CreateAuditObject(string actionname,TEntity entity)
        {
            string hostname = Dns.GetHostName();
            string ipaddress = (!string.IsNullOrEmpty(hostname)) ? Dns.GetHostAddresses(hostname).FirstOrDefault(ip => ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork).ToString() :string.Empty;
            var typeInfo = typeof(TEntity).GetTypeInfo();
			var name = entity.GetType().Name;
		
            var sourceId =  "";
            Audit a = new Audit();          
            a.Source = typeof(TEntity).Name;
            a.Action = actionname;
            a.CreatedBy =  "0";
            a.CreatedDate = DateTime.Now;
            a.HostName = hostname ?? string.Empty;
            a.IPAddress = ipaddress;
            a.Notes = Convert.ToString(sourceId);
            DbSet<Audit> auditdbset = _dbContext.Set<Audit>();
            auditdbset.Add(a);
            //if(actionname.Equals("Create"))
            //_dbContext.SaveChanges();

        }

        private void CreateAuditObject(string actionname, object id)
        {
            string hostname = Dns.GetHostName();
            string ipaddress = (!string.IsNullOrEmpty(hostname)) ? Dns.GetHostAddresses(hostname).FirstOrDefault(ip => ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork).ToString() : string.Empty;
            Audit a = new Audit();
            a.Source = typeof(TEntity).Name;
            a.Action = actionname;
          //  a.CreatedBy = EmployeeId.ToString();
            a.CreatedDate = DateTime.Now;
            a.HostName = hostname ?? string.Empty;
            a.IPAddress = ipaddress;
            a.Notes = Convert.ToString(id);
            DbSet<Audit> auditdbset = _dbContext.Set<Audit>();
            auditdbset.Add(a);
            //if(actionname.Equals("Create"))
            //_dbContext.SaveChanges();

        }

        /// <summary>
        /// Inserts a new entity asynchronously.
        /// </summary>
        /// <param name="entity">The entity to insert.</param>
        /// <returns>A <see cref="Task{TEntity}" /> that represents the asynchronous insert operation.</returns>
        public virtual async Task InsertAsync(TEntity entity)
        {
            try
            {
                _dbSet.Add(entity);
                //  CreateAuditObject("Create", entity);
                await _dbContext.SaveChangesAsync();
            }
            catch(Exception ex)
            {

            }
            
        }


        /// <summary>
        /// Inserts a range of entities asynchronously.
        /// </summary>
        /// <param name="entities">The entities to insert.</param>
        /// <returns>A <see cref="Task" /> that represents the asynchronous insert operation.</returns>
        public async Task InsertAsync(params TEntity[] entities)
        {
            _dbSet.AddRange(entities);
            entities.ToList().ForEach(e => CreateAuditObject("Create", e));
            await _dbContext.SaveChangesAsync();
            
        }

        /// <summary>
        /// Inserts a range of entities asynchronously.
        /// </summary>
        /// <param name="entities">The entities to insert.</param>
        /// <returns>A <see cref="Task" /> that represents the asynchronous insert operation.</returns>
        public async Task InsertAsync(IEnumerable<TEntity> entities)
        {
           
            _dbSet.AddRange(entities);
            entities.ToList().ForEach(e => CreateAuditObject("Create", e));
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(IEnumerable<TEntity> entities)
        {

            _dbSet.RemoveRange(entities);
            //entities.ToList().ForEach(e => CreateAuditObject("Delete", e));
            await _dbContext.SaveChangesAsync();
        }

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        public void Update(TEntity entity)
        {
            string actiontype = "Update";
            // using a stub entity to mark for deletion
            var typeInfo = typeof(TEntity).GetTypeInfo();
            // REVIEW: using metedata to find the key rather than use hardcode 'id'
            var property = typeInfo.GetProperty("Deactivated");
            if (property != null)
            {
                if (Convert.ToBoolean(property.GetValue(entity)) == true)
                    actiontype = "Delete";
            }
             CreateAuditObject(actiontype,entity);
            _dbContext.Entry(entity).State = EntityState.Modified;
            _dbContext.SaveChanges();

        }

        /// <summary>
        /// Updates the specified entity.
        /// </summary>
        /// <param name="entity">The entity.</param>
        public async Task<int> UpdateAsync(TEntity entity)
        {
            string actiontype = "Update";
            // using a stub entity to mark for deletion
            var typeInfo = typeof(TEntity).GetTypeInfo();
            // REVIEW: using metedata to find the key rather than use hardcode 'id'
            var property = typeInfo.GetProperty("Deactivated");
            if (property != null)
            {
                if (Convert.ToBoolean(property.GetValue(entity)) == true)
                    actiontype = "Delete";
            }
           // CreateAuditObject(actiontype,entity);
            _dbContext.Entry(entity).State = EntityState.Modified;
            return await _dbContext.SaveChangesAsync();

        }

        public async Task<int> UpdateAllAsync(IEnumerable<TEntity> entities)
        {
            string actiontype = "Update";
            foreach (var entity in entities)
            {
                // using a stub entity to mark for deletion
                var typeInfo = typeof(TEntity).GetTypeInfo();
                // REVIEW: using metedata to find the key rather than use hardcode 'id'
                var property = typeInfo.GetProperty("Deactivated");
                if (property != null)
                {
                    if (Convert.ToBoolean(property.GetValue(entity)) == true)
                        actiontype = "Delete";
                }
                CreateAuditObject(actiontype, entity);
                _dbContext.Entry(entity).State = EntityState.Modified;
            }
            return await _dbContext.SaveChangesAsync();

        }

        /// <summary>
        /// Updates the specified entities.
        /// </summary>
        /// <param name="entities">The entities.</param>
        public void Update(params TEntity[] entities)
        {
            entities.ToList().ForEach(e =>
            {
                CreateAuditObject("Update", e);
                _dbContext.Entry(e).State = EntityState.Modified;
            });
            _dbContext.SaveChanges();
        }

        /// <summary>
        /// Updates the specified entities.
        /// </summary>
        /// <param name="entities">The entities.</param>
        public void Update(IEnumerable<TEntity> entities)
        {
            entities.ToList().ForEach(entity => {
                CreateAuditObject("Update", entity);
                _dbContext.Entry(entity).State = EntityState.Modified;
            });
            _dbContext.SaveChanges();
        }

        /// <summary>
        /// Deletes the specified entity.
        /// </summary>
        /// <param name="entity">The entity to delete.</param>
        public void Delete(TEntity entity)
        {
            //CreateAuditObject("Delete",entity);
            _dbSet.Remove(entity);
            _dbContext.SaveChanges();
        }

        /// <summary>
        /// Deletes the entity by the specified primary key.
        /// </summary>
        /// <param name="id">The primary key value.</param>
        public void Delete(object id)
        {
           // CreateAuditObject("Delete",id);
            // using a stub entity to mark for deletion
            var typeInfo = typeof(TEntity).GetTypeInfo();
            // REVIEW: using metedata to find the key rather than use hardcode 'id'
            var property = typeInfo.GetProperty("Id");
            if (property != null)
            {
                var entity = Activator.CreateInstance<TEntity>();
                property.SetValue(entity, id);
                _dbContext.Entry(entity).State = EntityState.Deleted;
                _dbContext.SaveChanges();
            }
            else
            {
                var entity = _dbSet.Find(id);
                if (entity != null)
                {
                    Delete(entity);
                }
            }
        }


        /// <summary>
        /// Deletes the specified entities.
        /// </summary>
        /// <param name="entities">The entities.</param>
        public void Delete(params TEntity[] entities)
        {
            entities.ToList().ForEach(e => CreateAuditObject("Delete", e));
            _dbSet.RemoveRange(entities);
            _dbContext.SaveChanges();
        }

        /// <summary>
        /// Deletes the specified entities.
        /// </summary>
        /// <param name="entities">The entities.</param>
        public void Delete(IEnumerable<TEntity> entities)
        {
           // entities.ToList().ForEach(e => CreateAuditObject("Delete", e));
            _dbSet.RemoveRange(entities);
            _dbContext.SaveChanges();
        }

        /// <summary>
        /// Sets entity state to unchanged to persist entity modifications to database
        /// </summary>
        /// <param name="entity">The entity</param>
        public void SetUnchanged(TEntity entity)
        {
            _dbContext.Entry(entity).State = EntityState.Unchanged;
        }

        public IEnumerator<TEntity> GetEnumerator()
        {
            
            return ((IEnumerable<TEntity>)_dbSet).GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            
            return ((IEnumerable)_dbSet).GetEnumerator();
        }
    }
}
