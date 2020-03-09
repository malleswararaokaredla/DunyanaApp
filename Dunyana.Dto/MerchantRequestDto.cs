using System.ComponentModel.DataAnnotations;

namespace Dunyana.Dto
{
    public class MerchantRequestDto
    {
        public dynamic RequestID { get; set; }
        public dynamic MerchantName { get; set; }
        public int MerchantID { get; set; }
        public dynamic SourceLocation { get; set; }
        public dynamic OperatingCountries { get; set; }
        public dynamic Categories { get; set; }
        public int RequestAssignee { get; set; }
        public dynamic RequestAssigneeName { get; set; }
        public dynamic RequestStatus { get; set; }
        public dynamic RequestDescription { get; set; }
        public dynamic RequestCreatedOn { get; set; }
        public dynamic MerchantContractNumber { get; set; }
    }
    public class ModifyMerchantRequestDto
    {
        [Range(1, int.MaxValue, ErrorMessage = "The RequestID is required")]
        public int RequestID { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "The RequestID is required")]
        public int MerchantID { get; set; }
        [Required(ErrorMessage = "The MerchantName is required")]
        public string MerchantName { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "The ApprovalStatus is required")]
        public int ApprovalStatus { get; set; }
        [Required(ErrorMessage = "The ApprovalStatusdesc is required")]
        public string ApprovalStatusdesc { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "The RequestAssignee is required")]
        public int RequestAssignee { get; set; }
        public string Description { get; set; }
        public string MerchantContractNumber { get; set; }
    }
    public class NaqelRequestDto
    {
        [Required(ErrorMessage = "The RequestType is required")]
        public string RequestType { get; set; }
        [Required(ErrorMessage = "The NaqelUserEmail is required")]
        public string NaqelUserEmail { get; set; }
        [Required(ErrorMessage = "The NaqelUserType is required")]
        public string NaqelUserType { get; set; }
    }
}
