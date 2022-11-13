using Microsoft.EntityFrameworkCore;

namespace anch.API.Models;

public partial class AnchContext : DbContext
{
    public AnchContext(DbContextOptions<AnchContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Contact> Contacts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Contact>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Contacts");
        });
    }
}
