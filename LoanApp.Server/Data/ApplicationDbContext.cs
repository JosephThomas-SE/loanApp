using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using LoanApp.Server.Models;

namespace LoanApp.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // Custom entities
        public DbSet<Loan> Loans { get; set; }
        public DbSet<Repayment> Repayments { get; set; }
        public DbSet<Login> Logins { get; set; }
    }
}
