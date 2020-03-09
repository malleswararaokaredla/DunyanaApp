namespace Dunyana.Dto
{
    public class GenericResultDto
    {
        public string Message;
    }
    public class LoginResultDto<T>
    {
        public string Result;
        public string ReFirstName;
        public string ReEmail;
        public string LoginStatus;
        public string LoginType;
        public string OTP;
        public string Website;
        public string Token;
        public T ResultData;

    }
    public class GenericResultDto<T>
    {
        public T Result;
        public T ReFirstName;
        public T ReEmail;
        public T LoginStatus;
        public T LoginType;
        public T OTP; 
    }
    public class PaymentResultDto<T>
    {
        public T Result;
        public string Message;
    }
    public class GenericErrorDto<T>
    {
        public T Errors;
    }
    public class GenericErrorStatus
    {

    }
    public class OrderResultDto<T>
    {
        public T Result;
        public T ReOrderNo;
        public T ReCustomer;
        public T ReMerchant;
    }

}
