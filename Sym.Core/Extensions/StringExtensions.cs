using System;
using System.Text.RegularExpressions;

namespace Sym.Core.Extensions
{
    public static class StringExtensions
    {
        //private const string PhoneFormat = "{0:(###) ###-####}";

        //public static string DigitsOnly(this string str)
        //{
        //    return Regex.Replace(str, "[^0-9]", "");
        //}

        //public static string ToFormattedPhoneNumberString(this string str)
        //{
        //    return string.Format(PhoneFormat, Convert.ToInt64(str.DigitsOnly()));
        //}

        //// taken from http://stackoverflow.com/questions/1365407/c-sharp-code-to-validate-email-Address
        //public static bool IsValidEmail(this string email)
        //{
        //    try
        //    {
        //        var mailAddress = new System.Net.Mail.MailAddress(email);
        //        return mailAddress.Address == email;
        //    }
        //    catch
        //    {
        //        return false;
        //    }
        //}

        public static string GetLast(this string source, int tailLength)
        {
            return tailLength >= source.Length ? source : source.Substring(source.Length - tailLength);
        }

        public static bool EqualsIgnoreCase(this string thisString, string anotherString)
        {
            return string.Equals(thisString, anotherString, StringComparison.OrdinalIgnoreCase);
        }

        public static string RemoveNonAlphaNumericCharacters(this string thisString)
        {
            var regex = new Regex("[^a-zA-Z0-9 -]");
            return regex.Replace(thisString, string.Empty);
        }

        public static string Right(this string thisString, int numberOfCharacters)
        {
            if (thisString.Length <= numberOfCharacters)
                return thisString;

            return thisString.Substring(thisString.Length - numberOfCharacters, numberOfCharacters);
        }


    }
}
