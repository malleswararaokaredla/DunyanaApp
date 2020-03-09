
using System.IO;
using System.Reflection;

namespace Microsoft.EntityFrameworkCore.Migrations
{
    public static class MigrationBuilderExtensions
    {
        public static void RunEmbeddedResource<TMigration>(this MigrationBuilder migrationBuilder, string resourceName)
        {
            using (var stream = typeof(TMigration).GetTypeInfo().Assembly
                .GetManifestResourceStream(resourceName))
            {
                using (var ms = new StreamReader(stream))
                {
                    migrationBuilder.Sql(ms.ReadToEnd());
                }
            }
        }
    }
}
