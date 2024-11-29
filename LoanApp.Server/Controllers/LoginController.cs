using LoanApp.Server.Data;
using LoanApp.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LoanApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LoginController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] Login login)
        {
            if (string.IsNullOrEmpty(login.Username) || string.IsNullOrEmpty(login.PasswordHash))
                return BadRequest("Username and password are required.");

            // Check if the username already exists
            var existingUser = await _context.Logins.FirstOrDefaultAsync(u => u.Username == login.Username);
            if (existingUser != null)
                return Conflict("Username already exists. Please choose a different username.");

            // Set default role as "User"
            login.Role = "User";

            // Add new user
            _context.Logins.Add(login);
            await _context.SaveChangesAsync();

            return Ok("User registered successfully.");
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Login login)
        {
            // Find the user by username
            var user = await _context.Logins.FirstOrDefaultAsync(u => u.Username == login.Username);

            // Check if user exists and password matches directly
            if (user == null || user.PasswordHash != login.PasswordHash)
                return Unauthorized("Invalid credentials.");

            // Generate token for the authenticated user
            var token = GenerateJwtToken(user);
            return Ok(new { Token = token, Role = user.Role });
        }

        private string GenerateJwtToken(Login user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes("YourSecretKeyHere");

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = "LoanApp",
                Audience = "LoanAppUsers"
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
