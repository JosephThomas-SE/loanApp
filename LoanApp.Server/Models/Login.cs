using System.ComponentModel.DataAnnotations;

namespace LoanApp.Server.Models
{
    public class Login
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; } // e.g., "admin" or "user"
    }

}
