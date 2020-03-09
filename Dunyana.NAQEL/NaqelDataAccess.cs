using Dunyana.Dto;
using NaqelService;
using System.Threading.Tasks;
namespace Dunyana.NAQEL
{
    public class NaqelDataAccess
    {
        NaqelService.XMLShippingServiceSoapClient client = new XMLShippingServiceSoapClient(XMLShippingServiceSoapClient.EndpointConfiguration.XMLShippingServiceSoap);

        public bool isWaybillDelivered()
        {
            bool result = false;
                       client.IsWaybillExistsAsync(new ClientInformation { ClientID = 1 }, 1);
            //IsWaybillDelivered
                return result;
        }
        public async Task<Tracking[]> TraceByWaybillNo(TraceByWaybillDto TraceByWaybillDto)
        {
            ClientInformation objClientInformation = new ClientInformation();
            objClientInformation.ClientID = TraceByWaybillDto.clientID;
            objClientInformation.Password = TraceByWaybillDto.password;
            objClientInformation.Version = TraceByWaybillDto.version;
            return  await client.TraceByWaybillNoAsync(objClientInformation,TraceByWaybillDto.WaybillNo);
        }

    }
}
