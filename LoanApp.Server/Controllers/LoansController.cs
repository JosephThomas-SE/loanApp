using LoanApp.Server.Data;
using LoanApp.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LoanApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoansController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LoansController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Admin and User: Create a loan
        [Authorize(Roles = "User")]
        [HttpPost]
        public async Task<IActionResult> CreateLoan([FromBody] Loan loan)
        {
            if (loan == null)
                return BadRequest("Loan data is invalid.");

            // Calculate repayments based on loan details
            decimal weeklyRepayment = loan.AmountRequired / loan.LoanTerm;
            for (int i = 0; i < loan.LoanTerm; i++)
            {
                var repayment = new Repayment
                {
                    LoanId = loan.Id,
                    Amount = i == loan.LoanTerm - 1 ? weeklyRepayment + (loan.AmountRequired % loan.LoanTerm) : weeklyRepayment,
                    DueDate = DateTime.UtcNow.AddDays((i + 1) * 7) // 7 days interval for repayments
                };
                loan.Repayments.Add(repayment);
            }

            loan.Status = "PENDING"; // Set initial loan status
            _context.Loans.Add(loan);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLoan), new { id = loan.Id }, loan);
        }

        // Admin: Get all loans
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllLoans()
        {
            var loans = await _context.Loans
                                      .Include(l => l.Repayments)
                                      .ToListAsync();
            return Ok(loans);
        }

        // User: Get specific loan details
        [Authorize(Roles = "User,Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLoan(int id)
        {
            var loan = await _context.Loans
                                     .Include(l => l.Repayments)
                                     .FirstOrDefaultAsync(l => l.Id == id);

            if (loan == null)
                return NotFound();

            // If the user is not an Admin, restrict access to their own loans
            var userRole = User.IsInRole("Admin");
            var username = User.Identity.Name;
            if (!userRole && loan.BorrowerUsername != username)
                return Forbid();

            return Ok(loan);
        }

        // Admin: Approve loan
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/approve")]
        public async Task<IActionResult> ApproveLoan(int id)
        {
            var loan = await _context.Loans.FindAsync(id);
            if (loan == null)
                return NotFound();

            loan.Status = "APPROVED";
            await _context.SaveChangesAsync();
            return Ok(loan);
        }

        // Admin: Reject loan
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/reject")]
        public async Task<IActionResult> RejectLoan(int id)
        {
            var loan = await _context.Loans.FindAsync(id);
            if (loan == null)
                return NotFound();

            loan.Status = "REJECTED";
            await _context.SaveChangesAsync();
            return Ok(loan);
        }

        // Admin: Set loan status to pending
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/pending")]
        public async Task<IActionResult> SetPendingLoan(int id)
        {
            var loan = await _context.Loans.FindAsync(id);
            if (loan == null)
                return NotFound();

            loan.Status = "PENDING";
            await _context.SaveChangesAsync();
            return Ok(loan);
        }

        // User: Add repayment to loan
        [Authorize(Roles = "User,Admin")]
        [HttpPost("{id}/repay")]
        public async Task<IActionResult> AddRepayment(int id, [FromBody] Repayment repayment)
        {
            var loan = await _context.Loans
                                     .Include(l => l.Repayments)
                                     .FirstOrDefaultAsync(l => l.Id == id);

            if (loan == null)
                return NotFound();

            // Restrict users from repaying others' loans
            if (!User.IsInRole("Admin") && loan.BorrowerUsername != User.Identity.Name)
                return Forbid();

            repayment.LoanId = id;
            repayment.Status = "PAID";
            _context.Repayments.Add(repayment);
            await _context.SaveChangesAsync();

            // Check if all repayments are made
            if (loan.Repayments.All(r => r.Status == "PAID"))
            {
                loan.Status = "PAID"; // Mark as PAID
                await _context.SaveChangesAsync();
            }

            return Ok(repayment);
        }
    }
}
