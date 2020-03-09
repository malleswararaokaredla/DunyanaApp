using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Dunyana.Dto
{
    public class OrderDetailsDto
    {
        [Required(ErrorMessage = "The OrderNo is required")]
        public string OrderNo { get; set; }
        [Required]
        [DataType(DataType.Date, ErrorMessage = "The PaymentDate must be yyyy-MM-dd HH:MM:SS DateFormat"), DisplayFormat(DataFormatString = "{0:yyyy-MM-dd HH:MM:SS}", ApplyFormatInEditMode = true)]
        public DateTime OrderDate { get; set; }
        [DataType(DataType.Currency)]
        public float OrderAmount { get; set; }
        [Required(ErrorMessage = "The CurrenyCode is required")]
        public string CurrenyCode { get; set; }
        [Required]
        [EnumDataType(typeof(OrderCOD), ErrorMessage = "The COD Type should be 'Y' or 'N'")]
        public string COD { get; set; }
        public string OrderStatus { get; set; }
        [Required(ErrorMessage = "The ConsigneeAddressLine1 is required")]
        public string ConsigneeAddressLine1 { get; set; }
        public string ConsigneeAddressLine2 { get; set; }
        [Required(ErrorMessage = "The ConsigneeAddressCity is required")]
        public string ConsigneeAddressCity { get; set; }
        [Required(ErrorMessage = "The ConsigneeAddressState is required")]
        public string ConsigneeAddressState { get; set; }
        [Required(ErrorMessage = "The ConsigneeAddressCountry is required")]
        public string ConsigneeAddressCountry { get; set; }
        [Required(ErrorMessage = "The ConsigneeAddresszip is required")]
        public string ConsigneeAddresszip { get; set; }
        [Required(ErrorMessage = "The ConsigneeAddressMobileNo is required")]
        public string ConsigneeAddressMobileNo { get; set; }
        public string ConsigneeAddressPhone { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public List<Waybill> Waybill { get; set; }
        public List<PaymentResponseWithoutRequiredDto> PaymentDetails { get; set; }
    }
    public class Waybill
    {
        [Required(ErrorMessage = "The WaybillNo is required")]
        public string WaybillNo { get; set; }
        public List<ProductDetailsDto> Products { get; set; }
    }
    public class ProductDetailsDto
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "The ProductID is required")]
        public int ProductID { get; set; }
        [Required(ErrorMessage = "The ProductSKU is required")]
        public string ProductSKU { get; set; }
        public string ProductImage { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "The Quantity is required")]
        public int Quantity { get; set; }
        [DataType(DataType.Currency)]
        public float UnitCost { get; set; }
        [Required(ErrorMessage = "The CurrenyCode is required")]
        public string CurrenyCode { get; set; }
        [DataType(DataType.Date, ErrorMessage = "The Returndate must be yyyy-MM-dd HH:MM:SS DateFormat"), DisplayFormat(DataFormatString = "{0:yyyy-MM-dd HH:MM:SS}", ApplyFormatInEditMode = true)]
        public DateTime Returndate { get; set; }
        [DataType(DataType.Date, ErrorMessage = "The Canceldate must be yyyy-MM-dd HH:MM:SS DateFormat"), DisplayFormat(DataFormatString = "{0:yyyy-MM-dd HH:MM:SS}", ApplyFormatInEditMode = true)]
        public DateTime? Canceldate { get; set; }
    }
    public enum OrderCOD
    {
        Y, N
    }

    public class GetOrderDetailsDto
    {
        public int OrderID { get; set; }
        public int MerchantID { get; set; }
        public string MerchantName { get; set; }
        public string MerchantImage { get; set; }
        public int CustomerID { get; set; }
        public string CustomerName { get; set; }
        public string OrderNo { get; set; }
        public DateTime OrderDate { get; set; }
        public float OrderAmount { get; set; }
        public string COD { get; set; }
        public string CurrenyCode { get; set; }
        public string OrderStatus { get; set; }
        public string ConsigneeAddressLine1 { get; set; }
        public string ConsigneeAddressLine2 { get; set; }
        public string ConsigneeAddressCity { get; set; }
        public string ConsigneeAddressState { get; set; }
        public string ConsigneeAddressCountry { get; set; }
        public string ConsigneeAddresszip { get; set; }
        public string ConsigneeAddressMobileNo { get; set; }
        public string ConsigneeAddressPhone { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string PaymentStatus { get; set; }
        public List<GetProductDetailsDto> Products { get; set; }
        public List<PaymentResponseWithoutRequiredDto> PaymentDetails { get; set; }
    }
    public class GetProductDetailsDto
    {
        public dynamic ProductID { get; set; }
        public string TrackingID { get; set; }
        public string ProductSKU { get; set; }
        public string ProductImage { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public int Quantity { get; set; }
        public float UnitCost { get; set; }
        public string CurrenyCode { get; set; }
        public int? OrderID { get; set; }
        public string COD { get; set; }
    }
    public class OrderPaymentDto
    {
        public string CustomerId { get; set; }
        public string OrderId { get; set; }
        public string OrderAmount { get; set; }
    }
}
