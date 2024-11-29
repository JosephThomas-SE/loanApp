using System.ComponentModel.DataAnnotations.Schema;

namespace LoanApp.Server.Models
{
    // Models/Repayment.cs
    public class Repayment
    {
        public int Id { get; set; }
        public int LoanId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }
        public DateTime DueDate { get; set; }
        public string Status { get; set; } = "PENDING"; // Default status is PENDING
    }

}
