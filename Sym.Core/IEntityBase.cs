using System;

namespace Sym.Core
{
    public interface IEntityBase
    {
    }

    public interface IAuditEntityBase
    {
        /// <summary>
        /// Gets or sets the ID of the user that created the instance.
        /// </summary>
        int? CreatedBy { get; set; }

        /// <summary>
        /// Gets or sets the date/time the instance was created.
        /// </summary>
        DateTime? CreatedDate { get; set; }

        /// <summary>
        /// Gets or sets the ID of the user that updated the instance.
        /// </summary>
        int? UpdatedBy { get; set; }

        /// <summary>
        /// Gets or sets the date/time the instance was updated.
        /// </summary>
        DateTime? UpdatedDate { get; set; }
    }
}
