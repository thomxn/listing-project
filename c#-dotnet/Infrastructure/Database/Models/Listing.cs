using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace listingapi.Infrastructure.Database.Models
{
    [Table("listing")]
    public class Listing
    {
        [Key]
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("description")]
        public string Description { get; set; }
        [Column("building_type")]
        public string BuildingType { get; set; }
        [Column("street_address")]
        public string StreetAddress { get; set; }
        [Column("postal_code")]
        public string PostalCode { get; set; }
        [Column("city")]
        public string City { get; set; }
        [Column("country")]
        public string Country { get; set; }
        [Column("surface_area_m2")]
        public double SurfaceAreaM2 { get; set; }
        [Column("rooms_count")]
        public int RoomsCount { get; set; }
        [Column("bedrooms_count")]
        public int BedroomsCount { get; set; }
        [Column("price")]
        public double Price { get; set; }
        [Column("contact_phone_number")]
        public string ContactPhoneNumber { get; set; }
        [Column("created_date")]
        public DateTime CreatedDate { get; set; }
        [Column("updated_date")]
        public DateTime UpdatedDate { get; set; }
    }
}
