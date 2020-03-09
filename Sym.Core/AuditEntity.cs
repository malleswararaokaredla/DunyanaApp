namespace Sym.Core
{
    using System;
    /// <summary>
    /// Provides a base class for entities with properties for optimistic concurrency and auditing.
    /// </summary>
    /// <typeparam name="TEntity">The type of the entity.</typeparam>
    /// <typeparam name="TKey">The type of the entity's key.</typeparam>
    public class TrackEntity<TEntity, TKey> : EntityBase<TEntity, TKey>, ITrackEntity
		where TEntity : TrackEntity<TEntity, TKey>
	{
		#region Fields
		private DateTime _createdDate;
		private int _createdBy;
		private DateTime _updatedDate;
		private int _updatedBy;
		#endregion
		#region Properties
		/// <summary>
		/// Gets the date that the entity was created on
		/// </summary>
		public virtual DateTime CreatedDate
		{
			get { return _createdDate; }
		}
		DateTime ITrackEntity.CreatedDate
		{
			get { return _createdDate; }
			set { _createdDate = value; }
		}
		/// <summary>
		/// Gets the user who created the entity
		/// </summary>
		public virtual int CreatedBy
		{
			get { return _createdBy; }
		}
		int ITrackEntity.CreatedBy
		{
			get { return _createdBy; }
			set { _createdBy = value; }
		}
		/// <summary>
		/// Gets the update date for the entity
		/// </summary>
		public virtual DateTime UpdatedDate
		{
			get { return _updatedDate; }
		}
		DateTime ITrackEntity.UpdatedDate
		{
			get { return _updatedDate; }
			set { _updatedDate = value; }
		}
		/// <summary>
		/// Gets the user who updated the entity
		/// </summary>
		public virtual int UpdatedBy
		{
			get { return _updatedBy; }
		}
		int ITrackEntity.UpdatedBy
		{
			get { return _updatedBy; }
			set { _updatedBy = value; }
		}
		#endregion
	}
	public class TrackAndAuditEntity<TEntity, TKey> : AuditEntityBase<TEntity, TKey>, ITrackAndAuditEntity
		where TEntity : TrackAndAuditEntity<TEntity, TKey>
	{



	}
}