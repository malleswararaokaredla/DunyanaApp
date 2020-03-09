namespace Sym.Core
{
    using System;

    /// <summary>
    /// Represents a base class for all domain entities.
    /// </summary>
    /// <typeparam name="TEntity">The entity's type.</typeparam>
    /// <typeparam name="TKey">The entity's key type.</typeparam>
    public abstract class EntityBase<TEntity, TKey> : IEquatable<TEntity>, IEntityBase
        where TEntity : EntityBase<TEntity, TKey>
    {
        #region Properties
        /// <summary>
        /// Gets or sets the id.
        /// </summary>
        /// <value>
        /// The id.
        /// </value>        
        public virtual TKey Id { get; set; }
        #endregion

        #region Equality & Identity
        /// <summary>
        /// Determines whether the specified <see cref="System.Object"/> is equal to this instance.
        /// </summary>
        /// <remarks>
        /// Entity equality is based on the equality of the ID. If both entities are new, then equality
        /// is based on reference equality.
        /// </remarks>
        /// <param name="obj">The <see cref="System.Object"/> to compare with this instance.</param>
        /// <returns>
        ///   <c>true</c> if the specified <see cref="System.Object"/> is equal to this instance; otherwise, <c>false</c>.
        /// </returns>
        public override bool Equals(object obj)
        {
            var entityBase = obj as TEntity;

            if (entityBase == null)
            {
                return false;
            }

            return ReferenceEquals(entityBase, this) || (entityBase.Id.Equals(Id) && !Id.Equals(default(TKey)));
        }

        /// <summary>
        /// Returns a hash code for this instance.
        /// </summary>
        /// <returns>
        /// A hash code for this instance, suitable for use in hashing algorithms and data structures like a hash table. 
        /// </returns>
        public override int GetHashCode()
        {
            return Id.Equals(default(TKey)) ? base.GetHashCode() : Id.GetHashCode();
        }
        #endregion

        #region IEquatable<TEntity> Members
        /// <summary>
        /// Returns a value indicating whether the given TEntity is equal to this TEntity.
        /// </summary>
        /// <param name="other">The entity to compare to.</param>
        /// <returns>A value indicating whether the given TEntity is equal to this TEntity.</returns>
        public virtual bool Equals(TEntity other)
        {
            if (other == null)
            {
                return false;
            }

            return ReferenceEquals(other, this) || (other.Id.Equals(Id) && !Id.Equals(default(TKey)));
        }
        #endregion
    }

    public abstract class AuditEntityBase<TEntity, TKey> : IEquatable<TEntity>, IAuditEntityBase
       where TEntity : AuditEntityBase<TEntity, TKey>
    {
        #region Fields
        private DateTime _createdDate;
        private int _createdBy;
        private DateTime _updatedDate;
        private int _updatedBy;
        #endregion

        #region Properties
        public virtual DateTime? CreatedDate { get; set; }
        public virtual int? CreatedBy { get; set; }
        public virtual int? UpdatedBy { get; set; }
        public virtual DateTime? UpdatedDate { get; set; }
        /// <summary>
        /// Gets or sets the id.
        /// </summary>
        /// <value>
        /// The id.
        /// </value>        
        public virtual TKey Id { get; set; }
        #endregion

        #region Equality & Identity
        /// <summary>
        /// Determines whether the specified <see cref="System.Object"/> is equal to this instance.
        /// </summary>
        /// <remarks>
        /// Entity equality is based on the equality of the ID. If both entities are new, then equality
        /// is based on reference equality.
        /// </remarks>
        /// <param name="obj">The <see cref="System.Object"/> to compare with this instance.</param>
        /// <returns>
        ///   <c>true</c> if the specified <see cref="System.Object"/> is equal to this instance; otherwise, <c>false</c>.
        /// </returns>
        public override bool Equals(object obj)
        {
            var entityBase = obj as TEntity;

            if (entityBase == null)
            {
                return false;
            }

            return ReferenceEquals(entityBase, this) || (entityBase.Id.Equals(Id) && !Id.Equals(default(TKey)));
        }

        /// <summary>
        /// Returns a hash code for this instance.
        /// </summary>
        /// <returns>
        /// A hash code for this instance, suitable for use in hashing algorithms and data structures like a hash table. 
        /// </returns>
        public override int GetHashCode()
        {
            return Id.Equals(default(TKey)) ? base.GetHashCode() : Id.GetHashCode();
        }
        #endregion

        #region IEquatable<TEntity> Members
        /// <summary>
        /// Returns a value indicating whether the given TEntity is equal to this TEntity.
        /// </summary>
        /// <param name="other">The entity to compare to.</param>
        /// <returns>A value indicating whether the given TEntity is equal to this TEntity.</returns>
        public virtual bool Equals(TEntity other)
        {
            if (other == null)
            {
                return false;
            }

            return ReferenceEquals(other, this) || (other.Id.Equals(Id) && !Id.Equals(default(TKey)));
        }
        #endregion
    }
}
