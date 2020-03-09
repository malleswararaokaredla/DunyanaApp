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
    public class WalletPointsHistoryService : EntityService<WalletPointsHistory, WalletPointsHistoryRepository>
    {
        public WalletPointsHistoryService(WalletPointsHistoryRepository repository,
           IHttpContextAccessor httpContextAccessor) : base(repository, httpContextAccessor)
        {
        }
        public async Task<List<GetWalletPointsHistoryDto>> GetAll(int CustomerID)
        {

            var getWalletPointsHistory = (from s in this.Repository.Where(m => m.CustomerID == CustomerID)
                                           select new
                                        {
                                            s.Transaction,
                                            s.TransactionDate,
                                            s.TransactionPoints,
                                            s.TransactionDescription,
                                            s.OrderID,
                                            s.Status,
                                        }).OrderByDescending(s => s.TransactionDate).ToList();

            List<GetWalletPointsHistoryDto> GetWalletPointsHistoryList = new List<GetWalletPointsHistoryDto>();
            foreach (var WalletPointsHistory in getWalletPointsHistory)
            {
                GetWalletPointsHistoryDto GetWalletPointsHistoryDto = new GetWalletPointsHistoryDto();
                GetWalletPointsHistoryDto.Transaction = WalletPointsHistory.Transaction;
                GetWalletPointsHistoryDto.TransactionDate = WalletPointsHistory.TransactionDate;
                if (GetWalletPointsHistoryDto.TransactionPoints != null)
                {
                    GetWalletPointsHistoryDto.TransactionPoints = WalletPointsHistory.TransactionPoints;
                }
                else
                {
                    GetWalletPointsHistoryDto.TransactionPoints = 0;
                }
                GetWalletPointsHistoryDto.TransactionDescription = WalletPointsHistory.TransactionDescription;
                GetWalletPointsHistoryDto.Status = WalletPointsHistory.Status;
                GetWalletPointsHistoryDto.OrderID = WalletPointsHistory.OrderID;
                GetWalletPointsHistoryList.Add(GetWalletPointsHistoryDto);
            }
            return GetWalletPointsHistoryList;
        }

    }


}