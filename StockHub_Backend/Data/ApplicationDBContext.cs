using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Build.Framework;
using Microsoft.EntityFrameworkCore;
using StockHub_Backend.Models;

namespace StockHub_Backend.Data
{
    public class ApplicationDBContext : IdentityDbContext<AppUser>
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {

        }

        public DbSet<Stock> Stock { get; set; }
        public DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            List<IdentityRole> roles = new List<IdentityRole>
    {
        new IdentityRole
        {
            Id = "1", // Fixed ID
            Name = "Admin",
            NormalizedName = "ADMIN",
            ConcurrencyStamp = "1" // Fixed concurrency stamp
        },
        new IdentityRole
        {
            Id = "2", // Fixed ID
            Name = "User",
            NormalizedName = "USER",
            ConcurrencyStamp = "2" // Fixed concurrency stamp
        }};
            builder.Entity<IdentityRole>().HasData(roles);
        }
    }
}