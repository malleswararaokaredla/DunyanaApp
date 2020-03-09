using Checkout;
using Checkout.Payments;
using Dunyana.Domain.Models;
using System;
using System.Threading.Tasks;

namespace Dunyana.Services
{
    public class PaymentService
    {
        private readonly ICheckoutApi _checkoutApi;
        private readonly ISerializer _serializer;

        public PaymentService(ICheckoutApi checkoutApi, ISerializer serializer)
        {
            _checkoutApi = checkoutApi ?? throw new ArgumentNullException(nameof(checkoutApi));
            _serializer = serializer ?? throw new ArgumentNullException(nameof(serializer));
        }

        public async Task MakePayment(PaymentModel model)
        {
            if (string.IsNullOrWhiteSpace(model.CardToken))
                throw new ArgumentException("Model", $"{nameof(model.CardToken)} is missing.");

            var source = new TokenSource(model.CardToken);
            var paymentRequest = new PaymentRequest<TokenSource>(source, model.Currency, Convert.ToInt32(model.Amount))
            {
                Capture = model.Capture,
                Reference = model.Reference,
                ThreeDS = model.DoThreeDS,
              //  SuccessUrl = BuildUrl(nameof(ThreeDSSuccess)),
              //  FailureUrl = BuildUrl(nameof(ThreeDSFailure))
            };

            var response = await _checkoutApi.Payments.RequestAsync(paymentRequest);

            if (response.IsPending && response.Pending.RequiresRedirect())
            {
               // return Redirect(response.Pending.GetRedirectLink().Href);
            }

           // StorePaymentInTempData(response.Payment);

            if (response.Payment.Approved)
            {
               // return RedirectToAction(nameof(NonThreeDSSuccess));
            }

           // return RedirectToAction(nameof(NonThreeDSFailure));
        }
        
    }
}
