using System.ComponentModel.DataAnnotations.Schema;

namespace LoanApp.Server.Models
{
    // Models/Loan.cs
    public class Loan
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string BorrowerUsername { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal AmountRequired { get; set; }
        public int LoanTerm { get; set; }
        public string Status { get; set; } = "PENDING"; // Default status is PENDING
        public List<Repayment> Repayments { get; set; } = new List<Repayment>();
    }

}
