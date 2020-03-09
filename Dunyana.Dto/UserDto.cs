using System.Collections.Generic;

namespace Dunyana.Dto
{
    public class UserDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }  
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string Country { get; set; }
        public string Address { get; set; }
        public string IsActive { get; set; }
        public string UserType { get; set; }
        public int? NaqelUserType { get; set; }
        public string CreatedDt { get; set; }
        public string Company { get; set; }

    }

    public class UsersDto
    {
        public List<UserDto> Naqelusers { get; set; }
        public List<UserDto> Customers { get; set; }
        public List<UserDto> Merchants { get; set; }
    }
}
