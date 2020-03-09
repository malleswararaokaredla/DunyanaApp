namespace Sym.Core.Extensions
{
    public static class NumberExtensions
    {

        public static string ToCurrencyString(this decimal? source)
        {
            return string.Format("{0:C}", source).Replace("$", "");
        }
        
    }
}
