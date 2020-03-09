namespace Sym.Core.Service
{
    using System.Linq;
    using System.Threading.Tasks;

    /// <summary>
    /// Provides basic data operations for entities
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    public interface IEntityService<TEntity> : IQueryable<TEntity>
    {
        Task Add(TEntity entity);

        Task Update(TEntity entity);

        void Delete(TEntity entity);

        void SetUnchanged(TEntity entity);
    }
}
