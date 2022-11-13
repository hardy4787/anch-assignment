namespace anch.API.Models;

public class Contact
{
    public string JobTitle { get; set; } = null!;

    public string Role { get; set; } = null!;

    public string OrganisationUnit { get; set; } = null!;

    public long Id { get; set; }

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string FirstName { get; set; } = null!;
}
