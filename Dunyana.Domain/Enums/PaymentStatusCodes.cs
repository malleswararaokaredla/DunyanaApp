using System;
using System.Collections.Generic;
using System.Text;

namespace Dunyana.Domain.Enums
{
   public class PaymentStatusCodes
    {

        public string GetPaymentStatus(string statusCode)
        {
            string result = string.Empty;
            switch (statusCode)
            {
                case "20087":
                    result = "Bad Track Data (invalid CVV and/or expiry date)";
                    break;
                case "10000":
                    result = "Approved";
                    break;
                case "20001":
                    result = "Refer to Card Issuer";
                    break;
                case "20002":
                    result = "Refer to Card Issuer -Special Conditions";
                    break;
                case "20003":
                    result = "Invalid Merchant or Merchant is not active";
                    break;
                case "20005":
                    result = "Declined - Do Not Honour";
                    break;
                case "20006":
                    result = "Error / Invalid Request Parameters";
                    break;
                case "20009":
                    result = "Request in Progress";
                    break;
                case "20010":
                    result = "Partial Value Approved";
                    break;
                case "20012":
                    result = "Invalid Transaction.Issuer does not support original credit transaction over Visa SMS";
                    break;
                case "20013":
                    result = "Invalid Value/ Amount.For Visa non - money transfer OCTs, if the amount exceeds the US$50,000.00 limit";
                    break;
                case "20014":
                    result = "Invalid Card Number";
                    break;
                case "20017":
                    result = "Customer Cancellation";
                    break;
                case "20018":
                    result = "Customer Dispute";
                    break;
                case "20019":
                    result = "Re - enter Transaction or Transaction has expired";
                    break;
                case "20020":
                    result = "Invalid Response";
                    break;
                case "20021":
                    result = "No Action Taken";
                    break;
                case "20022":
                    result = "Suspected Malfunction";
                    break;

                case "20023":
                    result = "Unacceptable Transaction Fee";
                    break;
                case "20024":
                    result = "File Update Not Supported by the Receiver";
                    break;

                case "20025":
                    result = "Unable to Locate Record on File";
                    break;
                case "20026":
                    result = "Duplicate file update record";
                    break;
                case "20027":
                    result = "File Update Field Edit Error";
                    break;
                case "20028":
                    result = "File Update File Locked Out";
                    break;
                case "20029":
                    result = "File Update not Successful";
                    break;
                case "20030":
                    result = "Format Error";
                    break;
                case "20031":
                    result = "Bank not Supported by Switch";
                    break;
                case "20032":
                    result = "Completed Partially";
                    break;
                case "20039":
                    result = "No CREDIT Account";
                    break;
                case "20040":
                    result = "Requested Function not Supported";
                    break;
                case "20042":
                    result = "No Universal Value / Amount";
                    break;
                case "20044":
                    result = "No Investment Account";
                    break;
                case "20046":
                    result = "Bank Decline";
                    break;
                case "20051":
                    result = "Insufficient Funds";
                    break;
                case "20052":
                    result = "No Cheque Account";
                    break;
                case "20053":
                    result = "No Savings Account";
                    break;
                case "20054":
                    result = "Expired Card";
                    break;
                case "20055":
                    result = "Incorrect PIN(invalid Amex CVV).";
                    break;
                case "20056":
                    result = "No Card Record";
                    break;
                case "20057":
                    result = "Transaction not Permitted to Cardholder.Issuer does not support original credit transactions(OCTs) over Visa SMS";
                    break;
                case "20058":
                    result = "Transaction not Permitted to Terminal";
                    break;
                case "20059":
                    result = "Suspected Fraud";
                    break;
                case "20060":
                    result = "Card Acceptor Contact Acquirer";
                    break;
                case "20061":
                    result = "Exceeds Withdrawal Value / Amount Limits.For Visa enhanced original credit transactions(OCTs), if the defined 1 - day, 7 - day, or 30 - day amount or count limits exceeded";
                    break;
                case "20062":
                    result = "Restricted Card.For Visa original credit transactions(OCTs) sent to an embargoed country(Cuba, Iran, Syria, or Sudan)";
                    break;
                case "20063":
                    result = "Security Violation";
                    break;
                case "20064":
                    result = "Original Value Incorrect.For Visa money transfer original credit transactions(OCTs), if any of the following is missing: Sender Reference Number, Sender Account Number, Sender Name, Sender Address, etc.";
                    break;
                case "20065":
                    result = "Exceeds Withdrawal Frequency Limit.For Visa enhanced original credit transactions(OCTs), if the defined 1 - day, 7 - day, or 30 - day count limit exceeded";
                    break;
                case "20066":
                    result = "Card Acceptor Call Acquirer Security";
                    break;
                case "20067":
                    result = "Hard Capture—Pick Up Card at ATM";
                    break;
                case "20068":
                    result = "Response Received Too Late / Timeout";
                    break;
                case "20075":
                    result = "Allowable PIN Tries Exceeded";
                    break;
                case "20082":
                    result = "No security model";
                    break;
                case "20083":
                    result = "No accounts";
                    break;
                case "20084":
                    result = "No PBF";
                    break;
                case "20085":
                    result = "PBF update error";
                    break;
                case "20086":
                    result = "ATM Malfunction / Invalid authorisation type";
                    break;                
                case "20088":
                    result = "Unable to Dispense / process";
                        break;
                case "20089":
                    result = "Administration Error";
                    break;
                case "20090":
                    result = "Cut - off in Progress";
                    break;
                case "20091":
                    result = "Issuer or Switch is Inoperative.Issuer does not support original credit transactions(OCTs) over Visa SMS";
                    break;
                case "20092":
                    result = "Financial Institution not Found";
                    break;
                case "20093":
                    result = "Transaction Cannot be Completed.Issuer does not support original credit transactions(OCTs) over Visa SMS";
                    break;
                case "20094":
                    result = "Duplicate Transmission/ Invoice";
                    break;
                case "20095":
                    result = "Reconcile Error";
                    break;
                case "20096":
                    result = "System Malfunction.For Visa Cross Border money transfer original credit transactions(OCTs) where the recipient issuer’s country requires watch list scoring and watch list scoring could not be performed";
                    break;
                case "20097":
                    result = "Reconciliation Totals Reset";
                    break;
                case "20098":
                    result = "MAC Error";
                    break;
                case "20099":
                    result = "Other / Unidentified responses";
                    break;
                case "200N0":
                    result = "Unable to authorize";
                    break;
                case "200N7":
                    result = "Decline for CVV2 failure";
                    break;
                case "200O5":
                    result = "Pin Required";
                    break;
                case "200P1":
                    result = "Over Daily Limit";
                    break;
                case "200P9":
                    result = "Limit exceeded.Enter a lesser value.";
                    break;
                case "200R1":
                    result = "Issuer initiated a stop payment(revocation order) for the Authorization";
                    break;
                case "200R3":
                    result = "Issuer initiated a stop payment(revocation order) for all Authorizations";
                    break;
                case "200S4":
                    result = "PTLF Full";
                    break;
                case "200T2":
                    result = "Invalid Transaction Date";
                    break;
                case "200T3":
                    result = "Card not supported";
                    break;
                case "200T5":
                    result = "CAF Status = 0 or 9";
                    break;
                case "20100":
                    result = "Invalid Expiry Date Format";
                    break;
                case "20101":
                    result = "No Account / No Customer(Token incorrect or invalid)";
                    break;
                case "20102":
                    result = "Invalid Merchant / Wallet ID";
                    break;
                case "20103":
                    result = "Card type / Payment method not supported";
                    break;
                case "20104":
                    result = "Gateway Reject - Invalid Transaction";
                    break;
                case "20105":
                    result = "Gateway Reject - Violation";
                    break;
                case "20106":
                    result = "Unsupported currency";
                    break;
                case "20107":
                    result = "Billing address is missing";
                    break;
                case "20108":
                    result = "Declined - Updated Cardholder Available";
                    break;
                case "20109":
                    result = "Authorisation Already Reversed(voided) or Capture is larger than initial Authorised Value.";
                    break;
                case "20110":
                    result = "Authorization completed";
                    break;
                case "20111":
                    result = "Transaction already reversed";
                    break;
                case "20112":
                    result = "Merchant not MasterCard SecureCode enabled";
                    break;
                case "20113":
                    result = "Invalid Property";
                    break;
                case "20114":
                    result = "Invalid Channel or Token is incorrect";
                    break;
                case "20115":
                    result = "Missing / Invalid Lifetime";
                    break;
                case "20116":
                    result = "Invalid Encoding";
                    break;
                case "20117":
                    result = "Invalid API Version";
                    break;
                case "20118":
                    result = "Transaction Pending";
                    break;
                case "20119":
                    result = "Invalid Batch data and / or batch data is missing";
                    break;
                case "20120":
                    result = "Invalid Customer / User";
                    break;
                case "20121":
                    result = "Transaction Limit for Merchant / Terminal exceeded";
                    break;
                case "20123":
                    result = "MISSING BASIC DATA: zip, addr, member";
                    break;
                case "20150":
                    result = "Card not 3D Secure(3DS) enabled";
                    break;
                case "20151":
                    result = "Cardholder failed 3DS authentication";
                    break;
                case "20152":
                    result = "Initial 3DS transaction not completed within 15 minutes";
                    break;
                case "20153":
                    result = "3DS system malfunction";
                    break;
                case "20154":
                    result = "3DS authentication required";
                    break;
                 default:
                    result = "";
                    break;
            }
            return result;

        }
    }
}


