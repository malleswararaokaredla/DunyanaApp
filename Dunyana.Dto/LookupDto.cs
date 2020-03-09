namespace Dunyana.Dto
{
    public class LookupTypeDto
    {

        public int Id { get; set; }
        public string Description { get; set; }

    }
    public class LookupTypeValueDto
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public int LookupTypeID { get; set; }
        public string Status { get; set; }

    }
  
}
