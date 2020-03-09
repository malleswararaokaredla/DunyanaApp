namespace Sym.Core
{
    using System;

    /// <summary>
    /// Represents an entity tracks when it was created and updated, as well as the user that
    /// created and updated it. This information may be used for optimistic concurrency.
    /// </summary>
    public interface ITrackEntity
    {
        /// <summary>
        /// Gets or sets the ID of the user that created the instance.
        /// </summary>
        int CreatedBy { get; set; }

		/// <summary>
		/// Gets or sets the date/time the instance was created.
		/// </summary>
		DateTime CreatedDate { get; set; }

		/// <summary>
		/// Gets or sets the ID of the user that updated the instance.
		/// </summary>
		int UpdatedBy { get; set; }
        /// <summary>
        /// Gets or sets the date/time the instance was updated.
        /// </summary>
        DateTime UpdatedDate { get; set; }
    }

    public interface ITrackAndAuditEntity
    {

    }
}
