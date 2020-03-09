using Dunyana.Dto;
using Dunyana.NAQEL;
using NaqelService;
using System.Threading.Tasks;
namespace Dunyana.Services
{

    public class NaqelServices
    {
        private readonly NaqelDataAccess _NaqelDataAccess;
        public NaqelServices(NaqelDataAccess NaqelDataAccess)
        {

            _NaqelDataAccess = NaqelDataAccess;
        }

        public async Task<Tracking[]> TraceByWaybillNoDetails(TraceByWaybillDto TraceByWaybillDto)
        {
            return await _NaqelDataAccess.TraceByWaybillNo(TraceByWaybillDto);
        }

    }
}
