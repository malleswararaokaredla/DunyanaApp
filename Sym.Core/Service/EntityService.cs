using Microsoft.AspNetCore.Http;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace Sym.Core.Service
{
    using DataAccess;
    using System.Threading.Tasks;




    /// <summary>
    /// Base service class for handling entity data operations
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    /// <typeparam name="TRepository"></typeparam>
    public abstract class EntityService<TEntity, TRepository> :  IEntityService<TEntity>
        where TRepository : IRepository<TEntity>
        where TEntity : class
    {
        #region Fields
        private readonly TRepository _repository;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public readonly int EmployeeId;
        public readonly int SessionId;

        private static string _createdBy;
      
        #endregion

        #region Constructor
        protected EntityService(TRepository repository) 
        {
            _repository = repository;
        }

        protected EntityService(TRepository repository, IHttpContextAccessor httpContextAccessor)
        {
            _repository = repository;
            _httpContextAccessor = httpContextAccessor;
            var keys = _httpContextAccessor?.HttpContext?.Request?.Headers.Keys;
            if (keys != null && keys.Contains("EmployeeId"))
            {
                EmployeeId = int.Parse(_httpContextAccessor?.HttpContext?.Request?.Headers["EmployeeId"]);
                SessionId = int.Parse(_httpContextAccessor?.HttpContext?.Request?.Headers["SessionId"]);
            }
        }
        #endregion

        #region Properties
        protected TRepository Repository
        {
            get { return _repository; }
        }
        #endregion

        #region IEntityService Members
        public virtual Task Add(TEntity entity)
        {
            return Repository.InsertAsync(entity);
        }
		public virtual Task AddAll(IEnumerable<TEntity> entities)
		{
			return Repository.InsertAsync(entities);
		}

		public virtual void Delete(TEntity entity)
        {
            Repository.Delete(entity);
        }
		public virtual void DeleteAll(IEnumerable<TEntity> entities)
		{
			Repository.Delete(entities);
		}

        public virtual void SetUnchanged(TEntity entity)
        {
            try
            {
                Repository.SetUnchanged(entity);
            }
            catch(Exception ex)
            {

            }
            
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        public IEnumerator<TEntity> GetEnumerator()
        {
            throw new System.NotImplementedException();
        }

        // ReSharper disable once UnassignedGetOnlyAutoProperty
        public Type ElementType { get; }
        public Expression Expression { get; }
        public IQueryProvider Provider { get; }
        public Task Update(TEntity entity)
        {
            throw new System.NotImplementedException();
        }

        public static string CreatedBy
        {
            get { return _createdBy; }

            set { _createdBy = value; }
        }

        #endregion
    }
}
