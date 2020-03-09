using Dunyana.DataAccess;
using Microsoft.EntityFrameworkCore;
using System.Data.SqlClient;

namespace Dunyana.Services
{
    public class DataBaseService
    {
        private readonly DunyanaDbContext _context;
        public DataBaseService(DunyanaDbContext context)
        {
            _context = context;
        }

        public SqlConnection GetDBConnection()
        {
            return _context.Database.GetDbConnection() as SqlConnection;
        }

        public void DisableLazyLoading()
        {
            var test = _context.ChangeTracker.LazyLoadingEnabled;
            _context.ChangeTracker.LazyLoadingEnabled = false;
        }

    }
}
