using Dunyana.DataAccess.Repositories;
using Dunyana.Domain;
using Dunyana.Dto;
using Microsoft.AspNetCore.Http;
using Sym.Core.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Dunyana.Services
{
    public class PaymentCardsService : EntityService<PaymentCards, PaymentCardsRepository>
    {

        public PaymentCardsService(PaymentCardsRepository repository,
           IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {


        }
        public List<GetPaymentCardsDto> GetPaymentByCustomer(string CustomerID)
        {
          var getPaymentCardslist = (from s in this.Repository.Where(m => m.CustomerRegistration.Users.GUID == CustomerID)
                                select new
                                {
                                    s.Id,
                                  //  s.CustomerId,
                                  //  s.CardCustomerId,
                                  //  s.CardSourceId,
                                    s.last4digits,
                                    s.CardType,
                                    s.Expyear,
                                    s.Expmonth,
                                }).Distinct().ToList();

            List<GetPaymentCardsDto> PaymentCardslist = new List<GetPaymentCardsDto>();
            foreach (var Paymentlist in getPaymentCardslist)
            {
                GetPaymentCardsDto PaymentCard = new GetPaymentCardsDto();
                PaymentCard.paymentcardId = Paymentlist.Id;
             //   PaymentCard.CustomerId = Paymentlist.CustomerId;
              //  PaymentCard.CardCustomerId = Paymentlist.CardCustomerId;
              //  PaymentCard.CardSourceId = Paymentlist.CardSourceId;
                PaymentCard.last4digits = Paymentlist.last4digits;
                PaymentCard.CardType = Paymentlist.CardType;
                PaymentCard.Expmonth = Paymentlist.Expmonth;
                PaymentCard.Expyear = Paymentlist.Expyear;
                PaymentCardslist.Add(PaymentCard);
            }
            return PaymentCardslist;

        }

        public GetPaymentCardsDto GetPaymentCardInfo(int paymentCardId)
        {

            PaymentCards paymentCard = Repository.Where(c => c.Id == paymentCardId).FirstOrDefault();

                GetPaymentCardsDto paymentCardDto = new GetPaymentCardsDto();
            paymentCardDto.paymentcardId = paymentCard.Id;
            paymentCardDto.CustomerId = paymentCard.CustomerId;
            paymentCardDto.CardCustomerId = paymentCard.CardCustomerId;
            paymentCardDto.CardSourceId = paymentCard.CardSourceId;
            paymentCardDto.last4digits = paymentCard.last4digits;
            paymentCardDto.CardType = paymentCard.CardType;
            paymentCardDto.Expmonth = paymentCard.Expmonth;
            paymentCardDto.Expyear = paymentCard.Expyear;
                 
            return paymentCardDto;

        }

        public async Task<string> InsertPaymentCards(PaymentCardsDto PaymentCardsDto)
        {
            try
            {
                await Repository.InsertAsync(new PaymentCards
                {
                    CardCustomerId = PaymentCardsDto.CardCustomerId,
                    CardSourceId = PaymentCardsDto.CardSourceId,
                    last4digits = PaymentCardsDto.last4digits,
                    CardType = PaymentCardsDto.CardType,
                    Expyear = PaymentCardsDto.Expyear,
                    Expmonth = PaymentCardsDto.Expmonth,
                    CustomerId = PaymentCardsDto.CustomerId,
                });
                return "Card inserted successfully";
            }
            catch (Exception err)
            {
                return err.Message;
            }
        }
    }
}
